import sys
print(sys.path)
import random
import partitions.parti as parti
print(sys.path)

def test_seq_part():
    p = [2,2,1]
    s = [1,0,1,0,0]
    assert parti.seq_to_part(s) == p
    assert parti.part_to_seq(p) == s
    p = [3,2,1]
    s = [1,0,1,0,1,0]
    assert parti.seq_to_part(s) == p
    assert parti.part_to_seq(p) == s
    p = [7,4,2,1,1,1]
    s = [1,0,0,0,1,0,1,1,0,1,1,1,0]
    assert parti.seq_to_part(s) == p
    assert parti.part_to_seq(p) == s
    assert parti.seq_to_part([]) == []
    assert parti.part_to_seq([]) == []

def test_seq_part2():
    N = 100
    for _ in range(N):
        s = [1] + [random.randint(0,1) for _ in range(random.randint(1,50))] + [0]
        assert parti.part_to_seq(parti.seq_to_part(s)) == s
    for _ in range(N):
        p = [random.randint(1,15) for _ in range(random.randint(1,10))]
        p.sort(reverse=True)
        assert parti.seq_to_part(parti.part_to_seq(p)) == p
    

def test_vec_core():
    c = [1,1,0]
    n = [0,1,-1]
    assert parti.core_to_vec(c,3) == n
    assert parti.vec_to_core(n) == c
    assert parti.ref_idx(c) == 1
    c = [1,1,1,0,0]
    assert parti.core([1,0,0,0,1,0,1,1,0,1,1,1,0],5) == c
    assert parti.ref_idx(c) == 2
    n = [0,1,1,-1,-1]
    assert parti.core_to_vec(c,5) == n
    assert parti.vec_to_core(n) == c
    

def test_vec_core2():
    N = 100
    for _ in range(N):
        s = [1] + [random.randint(0,1) for _ in range(random.randint(1,50))] + [0]
        t = random.randint(2,10)
        c = parti.core(s,t)
        print(t,s)
        print(t,c)
        v = parti.core_to_vec(c,t)
        print(parti.ref_idx(c))

        assert sum(v) == 0
        assert parti.vec_to_core(v) == c
    for _ in range(N):
        n = [random.randint(-10,10) for _ in range(random.randint(2,10))]
        n.append(-sum(n))
        assert parti.core_to_vec(parti.vec_to_core(n),len(n)) == n

def test_decomp():
    s = [1,0,1,0,0]
    ec = [1,1,0]
    equos = [[1,0],[],[]]
    oc, oquos = parti.decomp(s,3)
    assert oc == ec
    for i in range(3):
        assert equos[i] == oquos[i]
    assert parti.from_decomp(ec,equos) == s
    s = [1,0,0,0,1,0,1,1,0,1,1,1,0]
    ec = [1,1,1,0,0]
    equos = [[],[1,0],[],[],[1,0]]
    oc, oquos = parti.decomp(s,5)
    assert oc == ec
    for i in range(5):
        assert equos[i] == oquos[i]

def test_decomp2():
    N = 50
    for _ in range(N):
        s = [1] + [random.randint(0,1) for _ in range(random.randint(1,50))] + [0]
        t = random.randint(2,10)
        c, quos = parti.decomp(s,t)
        parti.from_decomp(c,quos) == s