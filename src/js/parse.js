import {seqToPart, partToSeq, trimSeq, core, 
    decomp, refIdx, coreToVec, vecToCore, fromDecomp} from "./parti.js";
const functions = {seqToPart, partToSeq, trimSeq, core, decomp, refIdx, coreToVec, vecToCore, fromDecomp};

const name_to_func = {
    "seqToPart": seqToPart,
    "partToSeq": partToSeq,
    "trimSeq": trimSeq,
    "core": core,
    "decomp": decomp,
    "refIdx": refIdx,
    "coreToVec": coreToVec,
    "vecToCore": vecToCore,
    "fromDecomp": fromDecomp
};
/*

Expr = List(Expr*) | (List(Expr*) | Call)[Expr] | Call(Expr*) | Number

[2,3,4]

[2,3,4][0]

partToSeq([32,[3,2][0]])[2]

*/

function cleanWhitespace(str) {
    var a = str.replace(/[^\S ]+/g, '');
    return a.replace(/ +/g, ' ').replace(/^ /, '');
}

function tokenize(str) { //partToSeq([34,2],b) -> ['partToSeq', '(', '[', '34', ',', '2', ']', ',', 'b', ')']
    var ans = [];
    var n = str.length;
    var i = 0;
    while (i < n) {
        if (/\s/.test(str[i])) {
            i++;
            continue;
        }
        if (',()[]'.includes(str[i])) {
            ans.push({str: str[i], pos: i});
            i++;
            continue;
        }
        var j = i+1;
        while (j < n && !(/\s/.test(str[j])) && !',()[]'.includes(str[j])) {
            j++;
        }
        ans.push({str : str.slice(i,j), pos : i});
        i = j;
    }
    return ans;
}

function throwSyntaxError(msg, pos, str) {
    var pointer = ' '.repeat(pos) + '^';
    throw new Error("Syntax error:\n" + msg + "\n" + str + "\n" + pointer);
}

function throwRuntimeError(msg, pos, str) {
    var pointer = ' '.repeat(pos) + '^';
    throw new Error("Runtime error:\n" + msg + "\n" + str + "\n" + pointer);
}


function checkBalanced(tokens, str) {
    var stack = [];
    for (var token of tokens) {
        if (token.str == '(' || token.str == '[') {
            stack.push(token);
        } else if (token.str == ')' || token.str == ']') {
            if (stack.length == 0) {
                throwSyntaxError("Unmatched closing bracket: " + token.str, token.pos, str);
            }
            var last = stack.pop();
            if ((last.str == '(' && token.str != ')') || (last.str == '[' && token.str != ']')) {
                throwSyntaxError("Mismatched brackets: " + last.str + " and " + token.str, token.pos, str);
            }
        }
    }
    if (stack.length > 0) {
        throwSyntaxError("Unmatched opening bracket: " + stack[stack.length - 1].str, stack[stack.length - 1].pos, str);
    }
}


/*

Expr = List(Expr*) | (List(Expr*) | Call)[Expr] | Call(Expr*) | Number

[2,3,4]

[2,3,4][0]

partToSeq([32,[3,2][0]])[2]

*/
function basicAst(tokens,str) { // takes list of tokens and makes a basic AST, assuming syntax is correct
    var ans = [];
    var i = 0;
    var canIndexExpr = false;
    while (i < tokens.length) {
        if (/^(-|\+)?\d+$/.test(tokens[i].str)) {
            var val = Number(tokens[i].str);
            ans.push({type : "Num", pos : tokens[i].pos, val : val});
            i++;
            continue;
        }
        if (/^([a-z]|[A-Z])+$/.test(tokens[i].str)) {
            if (!(tokens[i].str in name_to_func)) {
                throwSyntaxError("Unrecognized function name: " + tokens[i].str, tokens[i].pos, str);
            }
            if (i == tokens.length - 1) {
                throwSyntaxError("Expected arguments, got EOL instead", tokens[i].pos, str);
            }
            if (tokens[i+1].str != '(') {
                throwSyntaxError("Unexpected token after function: " + tokens[i].str, tokens[i].pos, str);
            }
            var [args,j] = basicAst(tokens.slice(i+2),str);
            if (args.length != name_to_func[tokens[i].str].length) {
                if (tokens[i].str != "fromDecomp" || args.length != 1) {
                    throwSyntaxError("Argument Error, expected: " + name_to_func[tokens[i].str].length + " arguments, got: " + args.length);
                }
            }
            ans.push({type: "Name", pos : tokens[i].pos, fname: tokens[i].str, fargs: args});
            i = i + j + 2;
            canIndexExpr = true; //in some cases, can
            continue;
        }
        if (tokens[i].str == ',') {
            canIndexExpr = false;
            i++;
            continue;
        }
        if (tokens[i].str == '(') {
            var [es,j] = basicAst(tokens.slice(i+1),str);
            if (es.length != 1) {
                throwSyntaxError("Expected simple expression starting after '('", tokens[i].pos, str);
            }
            canIndexExpr = ["Name", "List", "Index"].includes(es[0].type);
            ans.push(es[0]);
            i = j + i + 1;
            continue;
        }
        if (tokens[i].str == '[' && canIndexExpr) {
            var [es,j] = basicAst(tokens.slice(i+1),str);
            if (es.length != 1) {
                throwSyntaxError("Expected simple expression starting after ", tokens[i].pos, str);
            }
            if (ans.length == 0) {throw new Error ("How did we get here?");}
            var prev = ans.pop()
            ans.push({type: "Index", pos : tokens[i].pos, arr : prev, idx: es[0]});
            i = i + j + 1;
            continue;
        }
        if (tokens[i].str == '[') {
            var [es,j] = basicAst(tokens.slice(i+1),str);
            ans.push({type: "List", pos : tokens[i].pos, eles : es});
            canIndexExpr = true;
            i = j + i + 1;
            continue;
        }
        if (tokens[i].str == ')') {
            return [ans, i+1];
        }
        if (tokens[i].str == ']') {
            return [ans, i+1];
        }
        throwSyntaxError("Unknown token: " + tokens[i].str, tokens[i].pos, str);
    }
    return [ans, i];
}

function checkSeq(seq,pos,str) {
    if (!Array.isArray(seq)) {
        throwRuntimeError("Expected a sequence!", pos, str);
    }
    for (var n of seq) {
        if (!Number.isInteger(n) || n > 1 || n < 0) {
            throwRuntimeError("Sequences should only be 0/1!", pos, str);
        }
    }
}
function checkPart(part,pos,str) {
    if (!Array.isArray(part)) {
        throwRuntimeError("Expected a partition!", pos, str);
    }
    var prev = Infinity;
    for (var n of part) {
        if (!Number.isInteger(n) || prev < n) {
            throwRuntimeError("Partitions should only be descending integers", pos, str);
        }
        prev = n;
    }
}
function checkVec(vec,pos,str) {
    if (!Array.isArray(vec)) {
        throwRuntimeError("Expected an integer vector!", pos, str);
    }
    for (var n of vec) {
        if (!Number.isInteger(n)) {
            throwRuntimeError("Vector should be integers only!", pos, str);
        }
        if (vec.reduce((a, b) => a + b, 0) != 0) {
            throwRuntimeError("Vector doesn't sum to 0!", pos, str);
        }
    }
}

function cleanPart(part) {
    for (var i = 0; i < part.length; i++) {
        if (part[i] == 0) {
            return part.slice(0,i);
        }
    }
    return part;
}

function arraysEqual(arr1,arr2) {
    if (arr1.length != arr2.length) {
        return false;
    }
    return arr1.every((val, index) => val === arr2[index]);
}

function evalAst(ast, str) {
    if (Array.isArray(ast)) {
        throwRuntimeError("Unexpected array in evalAst!", 0, str);
    }
    // if (ast.length == 0) {
    //     return null;
    // }
    // if (ast.length > 1) {
    //     throwRuntimeError("Expected simple expression, found " + ast.length + " expressions instead.\nAst Dump:\n" + JSON.stringify(ast), ast[1].pos, str);
    // }
    switch (ast.type) {
        case ("List") :
            var temp = ast.eles.map((x) => evalAst(x));
            return temp;
        case ("Index") :
            var arr = evalAst(ast.arr);
            var idx = evalAst(ast.idx);
            if (!Array.isArray(arr)) {
                throwRuntimeError("Expected array to index, but object was not an array!\nAst Dump:\n" + JSON.stringify(ast), ast.pos, str);
            }
            if (!Number.isInteger(idx) || idx < 0) {
                throwRuntimeError("Expected non-negative index, got " + JSON.stringify(idx) + " instead!\nAst Dump:\n" + JSON.stringify(ast), ast.pos, str);
            }
            if (idx >= arr.length) {
                throwRuntimeError("Index " + idx + " is out of bounds!", ast.pos, str);
            }
            return arr[idx];
        case ("Num") :
            return ast.val;
        case ("Name") :
            switch (ast.fname) {
                case ("seqToPart") :
                    var seq = evalAst(ast.fargs[0]);
                    checkSeq(seq, ast.pos, str);
                    return seqToPart(trimSeq(seq));
                case ("partToSeq") :
                    var part = evalAst(ast.fargs[0]);
                    checkPart(part, ast.pos, str);
                    var p2 = cleanPart(part);
                    return partToSeq(p2);
                case ("trimSeq") :
                    var seq = evalAst(ast.fargs[0]);
                    checkSeq(seq, ast.pos, str);
                    return trimSeq(seq);
                case ("core") :
                    var seq = evalAst(ast.fargs[0]);
                    checkSeq(seq, ast.pos, str);
                    var n = evalAst(ast.fargs[1]);
                    if (!Number.isInteger(n) || n <= 0) {
                        throwRuntimeError("Expected argument to core to be a positive integer!", ast.pos, str);
                    }
                    return core(trimSeq(seq),n);
                case ("decomp") :
                    var seq = evalAst(ast.fargs[0]);
                    checkSeq(seq, ast.pos, str);
                    var n = evalAst(ast.fargs[1]);
                    if (!Number.isInteger(n) || n <= 0) {
                        throwRuntimeError("Expected argument to decomp to be a positive integer!", ast.pos, str);
                    }
                    return decomp(trimSeq(seq),n);
                case ("refIdx") :
                    var seq = evalAst(ast.fargs[0]);
                    checkSeq(seq, ast.pos, str);
                    return refIdx(trimSeq(seq));
                case ("coreToVec") :
                    var seq = evalAst(ast.fargs[0]);
                    checkSeq(seq, ast.pos, str);
                    var n = evalAst(ast.fargs[1]);
                    if (!Number.isInteger(n) || n <= 0) {
                        throwRuntimeError("Expected argument to coreToVec to be a positive integer!", ast.pos, str);
                    }
                    return coreToVec(trimSeq(seq),n);
                case ("vecToCore") :
                    var vec = evalAst(ast.fargs[0]);
                    checkVec(vec, ast.pos, str);
                    return vecToCore(vec);
                case ("fromDecomp") :
                    if (ast.fargs.length == 1) {
                        var arr = evalAst(ast.fargs[0]);
                        if (arr.length != 2 || !Array.isArray(arr) || !Array.isArray(arr[1])) {
                            throwRuntimeError("Expected argument(s) to fromDecomp to be array, [arrays] or [array, [arrays]]!", ast.pos, str);
                        }
                        var coreSeq = arr[0];
                        var quos = arr[1];
                    }
                    else {
                        var coreSeq = evalAst(ast.fargs[0]);
                        var quos = evalAst(ast.fargs[1]);
                    }
                    if (!Array.isArray(coreSeq) || !Array.isArray(quos)) {
                        throwRuntimeError("Expected argument(s) to fromDecomp to be array, [arrays] or [array, [arrays]]!", ast.pos, str);
                    }
                    var t = quos.length;
                    if (t == 0) {
                        throwRuntimeError("Expected length of quotients to be positive!", ast.pos, str);
                    }
                    checkSeq(coreSeq, ast.pos, str);
                    quos.map((x) => checkSeq(x,ast.pos,str));
                    coreSeq = trimSeq(coreSeq);
                    quos = quos.map((x) => trimSeq(x));
                    if (!arraysEqual(core(coreSeq,t), coreSeq)) {
                        throwRuntimeError("Expected first sequence to be a " + t + "-core!", ast.pos, str);
                    }
                    return fromDecomp(coreSeq,quos);
                default :
                    throwRuntimeError("How did we get here? Bad name\nAst Dump:\n" + JSON.stringify(ast));
            }
        default :
            throwRuntimeError("How did we get here?\nAst Dump:\n" + JSON.stringify(ast));

    }
}

function textEval(str) {
    var a = cleanWhitespace(str);
    var toks = tokenize(a);
    checkBalanced(toks,a);
    return evalAst(basicAst(toks,a)[0][0],a);
}

// const name_to_func = {
//     "seqToPart": seqToPart,
//     "partToSeq": partToSeq,
//     "trimSeq": trimSeq,
//     "core": core,
//     "decomp": decomp,
//     "refIdx": refIdx,
//     "coreToVec": coreToVec,
//     "vecToCore": vecToCore,
//     "fromDecomp": fromDecomp
// };

export {textEval}