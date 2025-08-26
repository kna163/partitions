import subprocess
import json
import pytest
import select
import partitions.parti as parti
import os
import random

NODE_WORKER = os.path.join('.', 'src', 'js', 'worker.js')

TIMEOUT = 1.0 #seconds
N = 50


def start_node_proc():
    return subprocess.Popen(
        ["node", NODE_WORKER],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1
    )

@pytest.fixture(scope="session")
def node_state():
    proc = start_node_proc()
    yield {"proc": proc}
    proc.kill()

def run_js(node_state,f,args):
    proc = node_state["proc"]
    request = {"f" : f, "args": args}
    try:
        proc.stdin.write(json.dumps(request) + "\n")
        proc.stdin.flush()
    except (BrokenPipeError, ValueError):
        proc.kill()
        raise RuntimeError("Broken D;")
    rlist, _, _ = select.select([proc.stdout], [], [], TIMEOUT)
    if not rlist:
        proc.kill()
        raise TimeoutError(f"Call to {f} timed out for args={args}")
    line = proc.stdout.readline()
    if not line:
        err_output = proc.stderr.read()
        raise RuntimeError(f"No output, {err_output.strip()}")
    return json.loads(line.strip())
    
    

def compare_imps(node_state,py_imp,js_imp,inputs):
    py_ans = py_imp(*inputs)
    js_ans = run_js(node_state,js_imp,inputs)
    print("py", py_ans)
    print("js", js_ans)
    if isinstance(py_ans,tuple):
        py_ans = list(py_ans)
    assert py_ans == js_ans

rand_seqs = [([1] + [random.randint(0,1) for _ in range(random.randint(1,50))] + [0]) for _ in range(N)]
rand_parts = [sorted([random.randint(1,15) for _ in range(random.randint(1,10))],reverse=True) for _ in range(N)]
rand_ints = [random.randint(2,10) for _ in range(N)]
rand_vecs = [[random.randint(-10,10) for _ in range(random.randint(1,12))] for _ in range(N)]
[vec.append(-sum(vec)) for vec in rand_vecs]

@pytest.mark.parametrize("seq", rand_seqs)
def test_seq_to_part(node_state,seq):
    compare_imps(node_state,parti.seq_to_part, "seqToPart",[seq])

@pytest.mark.parametrize("seq", rand_seqs)
def test_trim_seq(node_state,seq):
    compare_imps(node_state,parti.trim_seq, "trimSeq",[seq[1:-1]]) #removes nontrivial guarantee

@pytest.mark.parametrize("part",rand_parts)
def test_part_to_seq(node_state,part):
    compare_imps(node_state,parti.part_to_seq, "partToSeq",[part])

@pytest.mark.parametrize("seq", rand_seqs)
def test_ref_idx(node_state,seq):
    compare_imps(node_state,parti.ref_idx, "refIdx", [seq])

@pytest.mark.parametrize("seq, t", zip(rand_seqs, rand_ints))
def test_core(node_state,seq,t):
    compare_imps(node_state,parti.core, "core", [seq,t])

@pytest.mark.parametrize("seq, t", zip(rand_seqs,rand_ints))
def test_core_to_vec(node_state,seq, t):
    core = parti.core(seq,t)
    compare_imps(node_state,parti.core_to_vec, "coreToVec", [core])

@pytest.mark.parametrize("seq, t", zip(rand_seqs,rand_ints))
def test_core_to_vec(node_state,seq, t):
    core = parti.core(seq,t)
    compare_imps(node_state,parti.core_to_vec, "coreToVec", [core, t])

@pytest.mark.parametrize("vec", rand_vecs)
def test_vec_to_core(node_state,vec):
    compare_imps(node_state,parti.vec_to_core, "vecToCore", [vec])

@pytest.mark.parametrize("seq, t", zip(rand_seqs,rand_ints))
def test_decomp(node_state,seq, t):
    compare_imps(node_state,parti.decomp, "decomp", [seq,t])

@pytest.mark.parametrize("seq, t", zip(rand_seqs,rand_ints))
def test_from_decomp(node_state,seq, t):
    core,quos = parti.decomp(seq,t)
    js_ans = run_js(node_state,"fromDecomp", [core,quos])
    py_ans = parti.from_decomp(core,quos)
    assert js_ans == py_ans