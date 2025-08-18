// basic functions for partitions, slighlty more limited than the python file!

// def seq_to_part(seq : Seq) -> Part:
//     #string of the form (0)10111101(0)(1)
//     cur = 0
//     ans = []
//     for b in seq:
//         if b == 1:
//             cur += 1
//         else:
//             if cur != 0:
//                 ans.append(cur)
//     ans.reverse()
//     return ans

function seqToPart(seq) {
    var cur = 0;
    var ans = []
    var idx = 0;
    for (var b of seq) {
        if (b == 1) {
            cur++;
        }
        else {
            if (cur != 0) {
            ans[idx] = cur;
            idx++;
            }
        }
    }
    return ans.reverse();
}

// def part_to_seq(part : Part) -> Seq:
//     cur = 0
//     ans = []
//     for n in part[::-1]:
//         ans += (n-cur) * [1] + [0]
//         cur = n
//     return ans
function partToSeq(part) {
    var cur = 0;
    var ans = [];
    for (var n of part.reverse()) {
        for (i = 0; i < n-cur; i++) {
            ans.push(1);
        }
        cur = n;
        ans.push(0);
    }
    return ans;
}

// def trim_seq(seq : Seq) -> Seq:
//     i = 0
//     j = len(seq)
//     while i < len(seq) and seq[i] == 0:
//         i += 1
//     while j >= 0 and seq[j-1] == 1:
//         j -= 1
//     return seq[i:j]

function trimSeq(seq) {
    var i = 0;
    var j = seq.length;
    while (i < seq.length && seq[i] == 0) {
        i++;
    }
    while (j > 0 && seq[j-1] == 1) {
           j--;
    }
    return seq.slice(i,j);
}

// def core(seq : Seq, t : int) -> Seq:
    // zs = [0] * t
    // for i in range(len(seq)):
    //     if seq[i] == 0:
    //         zs[i % t] += 1
    // ans = [1] * len(seq)
    // for i in range(len(seq)):
    //     if i//t < zs[i % t]:
    //         ans[i] = 0
    // return trim_seq(ans)
function core(seq, t) {
    var zs = Array(t).fill(0);
    for (var i = 0; i < seq.length; i++) {
        if (seq[i] == 0) {
            zs[i % t]++;
        }
    }
    var ans = Array(seq.length).fill(1) 
    for (var i = 0; i < seq.length; i++){
        if (Math.floor(i/t) < zs[i % t]) {
            ans[i] = 0;
        }
    }
    return trimSeq(ans);
}

// def ref_idx(seq : Seq) -> int:
//     ref = 0
//     zs = seq.count(0)
//     c = 0
//     for i,b in enumerate(seq):
//         if zs == c:
//             return i
//         if b == 0:
//             zs -= 1
//         else:
//             c += 1

function refIdx(seq) {
    var zs = seq.filter((v) => (v === 0)).length;
    var c = 0;
    for (var i = 0; i < seq.length; i++) {
        if (zs == c) {
            return i;
        }
        seq[i] == 0 ? zs-- : c++;
    }
    return 0;
}

// def decomp(seq : Seq,t : int) -> tuple[Seq, list[Seq]]:
//     # see https://arxiv.org/pdf/2502.06423v2
//     #ref gives reference for 0th t-quotient
//     ref = ref_idx(seq) % t
//     quos = [[] for _ in range(t)]
//     for i,b in enumerate(seq):
//         quos[(i-ref)%t].append(b)
//     quos = [trim_seq(q) for q in quos]
//     return core(seq,t), quos

function decomp(seq,t) {
    var ref = refIdx(seq) % t;
    var quos = [];
    for (var i = 0; i < t; i++) {
        quos[i] = [];
    }
    for (var i = 0; i < seq.length; i++) {
        quos[(t+i-ref) % t].push(seq[i]);
    }
    quos = quos.map((x) => trimSeq(x));
    return [core(seq,t),quos]
}

// def core_to_vec(core : Seq, t : int) -> list[int]:
//     temp = [-1] * t
//     ref = ref_idx(seq)
//     for i in range(t):
//         j = 0
//         idx = (i - ref) % t
//         while j*t+i < len(seq):
//             if seq[j*t+i] == 1:
//                 break
//             j += 1
//         temp[idx] = (j*t+i-ref)//t
//     return temp

function coreToVec(seq,t) {
    var ans = Array(t)
    var ref = refIdx(seq)
    for (var i = 0; i < t; i++) {
        var j = 0;
        var idx = ((i - ref) % t + t ) % t;
        while (j * t + i < seq.length) {
            if (seq[j*t+i] == 1) {break;}
            j++;
        }
        ans[idx] = Math.floor((j*t+i-ref)/t)
    }
    return ans;
}

// def vec_to_core(vec : list[int]) -> Seq:
//     t = len(vec)
//     mi = float('inf')
//     ma = float('-inf')
//     temp = [0]*t
//     for i,n in enumerate(vec):
//         idx = n*t+i
//         if idx < mi:
//             mi = idx
//         if idx > ma:
//             ma = idx
//         temp[i] = idx
//     #temp[i] records the first 1 that appears mod i, everything prior is a 0, everything after is a 1
//     ans = []
//     for i in range(mi,ma-t+1):
//         if i < temp[i % t]:
//             ans.append(0)
//         else:
//             ans.append(1)
//     return ans
function vecToCore(vec) {
    var t = vec.length;
    var mi = Infinity;
    var ma = -Infinity;
    var temp = Array(t);
    for (var i = 0; i < vec.length; i++) {
        var idx = vec[i]*t+i;
        mi = Math.min(mi,idx);
        ma = Math.max(ma,idx);
        temp[i] = idx;
    }
    ans = [];
    for (var i = mi; i < ma-t+1; i++) {
        if (i < temp[(i % t + t) % t]) {
            ans.push(0);
        }
        else {
            ans.push(1);
        }
    }
    return ans;
}

// def from_decomp(seq : Seq, quos : list[Seq]) -> Seq:
    // t = len(quos)
    // vec = core_to_vec(seq,t)
    // refs = [ref_idx(q) for q in quos]
    // mi = (vec[0]-refs[0]) * t
    // ma = (vec[0]+len(quos[0]) - refs[0]) * t
    // for i in range(1,t):
    //     neg = (vec[i]-refs[i]) * t + i
    //     pos = (len(quos[i]) - refs[i] + vec[i]) * t + i
    //     if neg < mi:
    //         mi = neg
    //     if pos > ma:
    //         ma = pos
    // ans = [-1] * (ma-mi+1)
    // for i in range(mi,ma+1):
    //     # i = k * t + i2
    //     # s_i = (s^(i2))_(k-n_i2)
    //     # seq[j] = s_(j-ref)
    //     k = i//t
    //     i2 = (i % t + t) % t 
    //     rel = k-vec[i2] # want s^(i2)_(k-n_i) "=" quos[i2][ref_i + k-n_i]
    //     r = refs[i2]
    //     l = len(quos[i2])
    //     if r+k-vec[i2] < 0:
    //         ans[i-mi] = 0
    //     elif r+k-vec[i2] >= l :
    //         ans[i-mi] = 1
    //     else:
    //         ans[i-mi] = quos[i2][r + k-vec[i2]]
    // return trim_seq(ans)

function fromDecomp(seq, quos) {
    var t = quos.length;
    var vec = coreToVec(seq,t);
    var refs = quos.map((x) => refIdx(x));
    var mi = (vec[0]-refs[0]) * t;
    var ma = (vec[0] + quos[0].length - refs[0]) * t;
    for (var i = 1; i < t; i++) {
        mi = Math.min(mi, (vec[i]-refs[i]) * t + i);
        ma = Math.max(ma, (quos[i].length + vec[i] - refs[i]) * t + i);
    }
    var ans = Array(ma-mi+1);
    for (var i = mi; i < ma+1; i++) {
        var k = Math.floor(i/t);
        var i2 = (i % t + t) % t;
        if (refs[i2]+k-vec[i2] < 0) {
            ans[i-mi] = 0;
        }
        else {
            refs[i2]+k-vec[i2] >= quos[i2].length ? ans[i-mi] = 1 : ans[i-mi] = quos[i2][refs[i2]+k-vec[i2]];
        }
    }
    return trimSeq(ans)
}
module.exports = {seqToPart, partToSeq, trimSeq, core, decomp, refIdx, coreToVec, vecToCore, fromDecomp};
// const functions = {seqToPart partToSeq trimSeq core decomp refIdx coreToVec vecToCore fromDecomp};

