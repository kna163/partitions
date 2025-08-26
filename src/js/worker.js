

import {seqToPart, partToSeq, trimSeq, core, 
    decomp, refIdx, coreToVec, vecToCore, fromDecomp} from "./parti.js";
const functions = {seqToPart, partToSeq, trimSeq, core, decomp, refIdx, coreToVec, vecToCore, fromDecomp};

import readline from 'readline';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
rl.on('line', (line) => {
    try {
        const {f, args} = JSON.parse(line);
        if (!(f in functions)) {
            throw new Error('No such function: ${f}');
        }
        const ans = functions[f](...args);
        process.stdout.write(JSON.stringify(ans) + "\n");
    }
    catch (err) {
        process.stderr.write("Error: " + err.message + "\n");
        process.exit(1);
    }
})