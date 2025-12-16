"""parti.py

Provides various functions for some computation with partitions, including the Littlewood decomposition,
p-cores and hook-lengths

Part is the lesser-used type, which is the normal representation of partitions i.e. 3+2=5 is [3,2]
Seq is the predominant type used in computation which is the 0/1 bi-infinite word representation of partitions
i.e. [3,2] = (...0) 11010 (1...)

Example:
    >>> parti.seq_to_part([1,1,0,1,0])
    [3,2]
    >>> parti.trim_seq([0,0,0,1,1,0,1,0])
    [1,1,0,1,0]
    >>> parti.part_to_seq([3,2])
    [1,1,0,1,0]
    >>> parti.part_to_seq([2,2,1])
    [1,0,1,0,0]
    >>> parti.core([1,0,1,0,0],3)
    [1,1,0]
    >>> parti.decomp([1,0,1,0,0],3)
    ([1,1,0],[[1,0],[],[]])
    >>> parti.from_decomp([1,1,0],[[1,0],[],[]])
    [1,0,1,0,0]
    >>> parti.core_to_vec([1,1,0],3)
    [0,1,-1]
    >>> parti.vec_to_core([0,1,-1])
    [1,1,0]

"""
from collections.abc import Iterator
import bisect

Seq = list[int]
Part = list[int]

def seq_to_part(seq : Seq) -> Part:
    #string of the form (0)101111010(1)
    cur = 0
    ans = []
    for b in seq:
        if b == 1:
            cur += 1
        else:
            if cur != 0:
                ans.append(cur)
    ans.reverse()
    return ans
def part_to_seq(part : Part) -> Seq:
    cur = 0
    ans = []
    for n in part[::-1]:
        ans += (n-cur) * [1] + [0]
        cur = n
    return ans
def trim_seq(seq : Seq) -> Seq:
    i = 0
    j = len(seq)
    while i < len(seq) and seq[i] == 0:
        i += 1
    while j > 0 and seq[j-1] == 1:
        j -= 1
    return seq[i:j]
def core(seq : Seq, t : int) -> Seq:
    zs = [0] * t
    for i in range(len(seq)):
        if seq[i] == 0:
            zs[i % t] += 1
    ans = [1] * len(seq)
    for i in range(len(seq)):
        if i//t < zs[i % t]:
            ans[i] = 0
    return trim_seq(ans)

def ref_idx(seq : Seq) -> int:
    zs = seq.count(0)
    c = 0
    for i,b in enumerate(seq):
        if zs == c:
            return i
        if b == 0:
            zs -= 1
        else:
            c += 1
    return 0

def decomp(seq : Seq,t : int) -> tuple[Seq, list[Seq]]:
    # see https://arxiv.org/pdf/2502.06423v2
    #ref gives reference for 0th t-quotient
    """ 5
        [1,      0,0,0,1,
         0, |||| 1,1,0,1,
         1,      1,0]
    """
    ref = ref_idx(seq) % t
    quos = [[] for _ in range(t)]
    for i,b in enumerate(seq):
        quos[(i-ref)%t].append(b)
    quos = [trim_seq(q) for q in quos]
    return core(seq,t), quos

def core_to_vec(seq : Seq, t : int) -> list[int]: #seq is the seq of a core
    """6 
        [1, 0, 1, 1, 0, 0,
         1, 1, 1, 0, 0, 1,
    |||| 1, 0, 0, 1, 0, 1,
         0, 1, 1, 1, 1, 1,
         1, 0, 1, 1, 0, 1,
         0]"""
    temp = [-1] * t
    ref = ref_idx(seq)
    for i in range(t):
        j = 0
        idx = (i - ref) % t
        while j*t+i < len(seq):
            if seq[j*t+i] == 1:
                break
            j += 1
        temp[idx] = (j*t+i-ref)//t
    return temp

def vec_to_core(vec : list[int]) -> Seq:
    t = len(vec)
    mi = float('inf')
    ma = float('-inf')
    temp = [0]*t
    for i,n in enumerate(vec):
        idx = n*t+i
        if idx < mi:
            mi = idx
        if idx > ma:
            ma = idx
        temp[i] = idx
    #temp[i] records the first 1 that appears mod i, everything prior is a 0, everything after is a 1
    ans = []
    for i in range(mi,ma-t+1):
        if i < temp[i % t]:
            ans.append(0)
        else:
            ans.append(1)
    return trim_seq(ans)
    

def from_decomp(seq : Seq, quos : list[Seq]) -> Seq: #seq is a len(quos)-core
    t = len(quos)
    vec = core_to_vec(seq,t)
    refs = [ref_idx(q) for q in quos]
    mi = (vec[0]-refs[0]) * t
    ma = (vec[0]+len(quos[0]) - refs[0]) * t
    for i in range(1,t):
        neg = (vec[i]-refs[i]) * t + i
        pos = (len(quos[i]) - refs[i] + vec[i]) * t + i
        if neg < mi:
            mi = neg
        if pos > ma:
            ma = pos
    ans = [-1] * (ma-mi+1)
    for i in range(mi,ma+1):
        # i = k * t + i2
        # s_i = (s^(i2))_(k-n_i2)
        # seq[j] = s_(j-ref)
        k = i//t
        i2 = (i % t + t) % t 
        rel = k-vec[i2] # want s^(i2)_(k-n_i) "=" quos[i2][ref_i + k-n_i]
        r = refs[i2]
        l = len(quos[i2])
        if r+k-vec[i2] < 0:
            ans[i-mi] = 0
        elif r+k-vec[i2] >= l :
            ans[i-mi] = 1
        else:
            ans[i-mi] = quos[i2][r + k-vec[i2]]
    return trim_seq(ans)

def cmp_total(p1 : Part, p2 : Part) -> int:
    # Total ordering on all partitions
    # returns 1 if p1 gt p2, -1 if p1 lt p2, 0 otherwise
    # 1) Based on what number it partitions
    # 2) Based on lexicographic ordering
    if p1 == p2:
        return 0
    if sum(p1) < sum(p2):
        return -1
    if sum(p1) > sum(p2):
        return 1
    for i in range(len(p1)):
        if p1[i] > p2[i]:
            return 1
        if p1[i] < p2[i]:
            return -1
    return #unreachable
    
def cmp_partial(p1 : Part, p2 : Part) -> int | None:
    # Partial ordering on all partitions
    # Based on containment of Young diagrams
    if p1 == p2:
        return 0
    rev = False
    if sum(p2) > sum(p1):
        p1,p2 = p2,p1
        rev = True
    if len(p2) > len(p1):
        return None
    for i in range(len(p1)):
        if p1[i] < p2[i]:
            return None
    if rev:
        return -1
    else:
        return 1

def cmp_dom(p1 : Part, p2 : Part) -> int | None :
    # Partial ordering on all partitions
    # based on dominating sequences
    # (a1,a2,...) dominates (b1,b2,...) if a1 >= b1, a1+a2 >= b1+b2, ...
    if p1 == p2:
        return 0
    rev = False
    if sum(p2) > sum(p1) or (sum(p1) == sum(p2) and len(p1) > len(p2)):
        p1,p2 = p2,p1
        rev = True
    s1,s2 = 0,0
    gt =  sum(p1) > sum(p2)
    pos = False
    neg = False
    for i in range(min(len(p1),len(p2))):
        s1 += p1[i]
        s2 += p2[i]
        if s1 < s2:
            neg = True
            if gt:
                return None
        if s1 > s2:
            pos = True
    if gt:
        return -1 if rev else 1
    # same sum, p1 is shorter than p2
    match (pos,neg):
        case True, True:
            return None
        case True, False:
            return -1 if rev else 1
        case False, True:
            return 1 if rev else -1
        case False, False:
            raise RuntimeError("should be unreachable")

def conj_part(part : Part) -> Part :
    # look at difference between one and the next, it affects the multiplicity
    # X X X X X X X X X
    # X X X X X X
    # X X X X X X
    # X X X
    # X
    # X
    # X

    # num parts encountered = 1, (mult 1) diff is 3, have [1,1,1]
    # num parts encountered = 3, (mult 2) diff is 3, have [3,3,3,1,1,1]
    # num parts encountered = 4, (mult 1) diff is 2, have [4,4,3,3,3,1,1,1]
    # num parts encountered = 7, (mult 3) diff is 1, have [7,4,4,3,3,3,1,1,1]
    return seq_to_part(reversed([(0 if b else 1) for b in part_to_seq(part)]))
    # ans = []
    # if not part:
    #     return []
    # prev = None
    # ans = []
    # for i in range(len(part)):
    #     if not prev or part[i] == prev:
    #         prev = part[i]
    #         continue

def is_self_cong(part : Part) -> bool:
    s = part_to_seq(part)
    if len(s) % 2 != 0:
        return False
    for i in range(len(s)//2):
        if s[i] == 0 and s[-i] != 1:
            return False
        if s[i] == 1 and s[-i] != 0:
            return False
    return True
    
def is_core(part : Part, t : int) -> bool:
    s = part_to_seq(part)
    if len(s) < t:
        return True
    for i in range(len(s)-t+1):
        if s[i] == 1 and s[i+t-1] == 0:
            return False 
    return True

def next_part(part : Part) -> Part | None :
    # returns next part (same sum) under lexicographic ordering or None if it is of the form [n]
    # case 1: ends with multiples
    # case 2: ends with unique
    # [4,4] -> [5,1,1,1] -> [5,2,1] -> [5,3] -> [6,1,1] -> [6,2] -> [7,1] -> [8]
    # ex. [6,3,3] -> [6] + [4] + [1,1] ; [3,1] -> [4] ; [3,1,1,1] -> [3,2,1] -> [3,3]
    # [2,2,1] -> [3,1,1]
    if len(part) < 2:
        return None
    if part[-1] == part[-2]: #case 1: multiples
        prev = part[-1]
        cnt = 1
        for i in range(1,len(part)):
            if part[-i-1] == prev:
                cnt += 1
            else:
                break
        return part[:-cnt] + [part[-cnt] + 1] + ((cnt-1)*prev-1)*[1]
    prev = part[-2]
    cnt = 1
    for i in range(2,len(part)):
        if part[-i-1] == prev:
            cnt += 1
        else:
            break
    ans = part[:-cnt-1] + [prev + 1] + ((cnt-1)*prev+part[-1]-1)*[1]
    return ans 


def prev_part(part : Part) -> Part | None:
    # ex. [6,4,1,1] -> [6,3,3]
    # find # of 1s at the end and repeat number and dump rest
    # [5,5,1,1,1,1,1] -> [5,4,4,2]
    # [5,5] -> [5,4,1] -> [5,3,2] -> [5,3,1,1]
    if not part or part[0] == 1:
        return None
    if part[-1] != 1:
        return part[:-1] + [part[-1]-1,1]
    cnt = 1
    for i in range(1,len(part)-1):
        if part[-i-1] == 1:
            cnt += 1
        else:
            break
    a = part[-cnt-1]
    rem = (cnt+a)%(a-1)
    return part[:-cnt-1] + ((cnt+a)//(a-1)) * [a-1] + ([(cnt+a)%(a-1)] if rem != 0 else [])


def gen_parts_n(n : int) -> Iterator[Part]:
    # generates partitions of n in increasing lexicographic ordering
    if n == 0:
        yield []
        return
    cur = [1]*n
    yield cur
    while cur[0] != n:
        cur = next_part(cur)
        yield cur.copy()
    return


def gen_parts() -> Iterator[Part]: #generates all parts, starting from [] and in increasing lexicographical order for each n
    n = 0
    while True:
        for part in gen_parts_n(n):
            yield part
        n += 1

PN_TABLE = {}
PNK_TABLE = {}
"""
P(n,k) : number of partitions of n with largest part at most k.
P(n,1) = 1
P(n,n) = P(n)
P(n,k) = P(n) if k > n
P(n,3) = P(n-3,3) + P(n-2,2) + P(n-1,1)

P(n,k) = P(n-k,k) + P(n-(k-1),k-1) + ... + P(n-1,1)

P(4,3) = 4 # 3,1; 2,2; 2,1,1; 1,1,1,1

P(1,3) = 1
P(2,2) = 2
P(3,1) = 1
"""

def get_pnk(n : int,k : int) -> int:
    if k == 0:
        return 1 if n == 0 else 0
    if n < 2:
        return 1
    if k == 1:
        return 1
    if k > n:
        return get_pnk(n,n)
    if (n,k) in PNK_TABLE:
        return PNK_TABLE[(n,k)]
    else:
        ans = 0
        for i in range(1,k+1):
            ans += get_pnk(n-i,i)
        PNK_TABLE[(n,k)] = ans
        return ans
        
def clear_pnk_table() -> None:
    PNK_TABLE.clear()

def lex_order(part : Part) -> int : #gives the lex order of part of size n
    if part[0] == 1:
        return 0
    n = sum(part)
    ans = 0
    for p in part:
        ans += get_pnk(n,p-1)
        n -= p
    return ans


def from_lex(n : int, i : int) -> Part : #gives the ith partition of n
    if i == 0:
        return n*[1]
    for k in range(2,n+1):
        if get_pnk(n,k) > i:
            return [k] + from_lex(n-k,i-get_pnk(n,k-1))

CHAR_VALUE_TABLE = {((),()): 1}
PCHAR_VALUE_TABLE = {((),()): 1} #perm char

def part_minus_rim(part : Part, k : int) -> tuple(list[Part]):
    #
    seq = part_to_seq(part)
    if len(seq) <= k:
        return [],[]
    cnt = 0
    for i in range(k):
        if seq[k] == 0:
            cnt ^= 1
    pos = []
    neg = []
    for i in range(len(seq)-k):
        if seq[i] == 1 and seq[i+k] == 0:
            seq[i] = 0
            seq[i+k] = 1
            if not cnt:
                pos.append(seq_to_part(seq))
            else:
                neg.append(seq_to_part(seq))
            seq[i] = 1
            seq[i+k] = 0
        cnt ^= seq[i] ^ seq[i+k]
    return pos,neg


def clear_char_val_table() -> None:
    CHAR_VALUE_TABLE.clear()
    CHAR_VALUE_TABLE[((),())] = 1
#Murnaghan - Nakayama Rule

def get_char_value(char : Part, conj_class : Part) -> int:
    if (tuple(char), tuple(conj_class)) in CHAR_VALUE_TABLE:
        return CHAR_VALUE_TABLE[(tuple(char),tuple(conj_class))]
    ans = 0
    pos,neg = part_minus_rim(char,conj_class[0])
    for p in pos:
        ans += CHAR_VALUE_TABLE[(tuple(p),tuple(conj_class[1:]))]
    for p in neg:
        ans -= CHAR_VALUE_TABLE[(tuple(p),tuple(conj_class[1:]))]
    CHAR_VALUE_TABLE[(tuple(char),tuple(conj_class))] = ans
    return ans
    
def clear_pchar_val_table() -> None:
    PCHAR_VALUE_TABLE.clear()
    PCHAR_VALUE_TABLE[((),())] = 1

def get_pchar_value(pchar : Part, conj_class : Part) -> int:
    if (tuple(pchar), tuple(conj_class)) in PCHAR_VALUE_TABLE:
        return PCHAR_VALUE_TABLE[(tuple(pchar),tuple(conj_class))]
    if conj_class[0] > pchar[0]:
        return 0
    if len(pchar) == 1:
        return 1
    if conj_class[0] == 1:
        ans = 1
        for i in range(1,sum(pchar)+1):
            ans *= i
        for p in pchar:
            for i in range(1,p+1):
                ans //= i
        return ans
    ans = 0
    for i in range(len(pchar)):
        if pchar[i] < conj_class[0]:
            break
        a = pchar[i] - conj_class[0]
        other = pchar[:i] + pchar[i+1:]
        if a != 0:
            bisect.insort(other, a, key = lambda x: -x)
        ans += get_pchar_value(other,conj_class[1:])
    return ans


def perm_table(n : int) -> dict[(Part,Part),int]: #generates the permutation character table of Sn
    ans = {}
    for lamb in gen_parts_n(n):
        for mu in gen_parts_n(n):
            ans[tuple(lamb),tuple(mu)] = get_pchar_value(lamb,mu)
    return ans

def perm_table2(n : int) -> list[list[int]]: #same but uses the lex ordering for indexing
    ans = []
    for lamb in gen_parts_n(n):
        ans.append([])
        for mu in gen_parts_n(n):
            ans[-1].append(get_pchar_value(lamb,mu))
    return ans

def char_table(n : int) : #generates the irreducible character table of Sn
    ans = {}
    for lamb in gen_parts_n(n):
        for mu in gen_parts_n(n):
            ans[tuple(lamb),tuple(mu)] = get_char_value(lamb,mu)
    return ans

def char_table2(n : int) -> list[list[int]]: #same but uses the lex ordering for indexing
    ans = []
    for lamb in gen_parts_n(n):
        ans.append([])
        for mu in gen_parts_n(n):
            ans[-1].append(get_char_value(lamb,mu))
    return ans
# def update(self,seq = [], part = []):
#     if seq:
#         self.seq = seq
#         self.part = self.seq_to_part(seq)
#         return
#     if part:
#         self.seq = self.part_to_seq(part)
#         self.part = part
#         return

# Other conveniences
# def img(self,auto=True):
#     if not auto:
#         p = figure(match_aspect=True)
#         p.block(x=0, y=[-i-1 for i in range(0,len(self.part))], width = self.part)
#         return p
#     N = max((20,5+max(self.part),5+len(self.part)))
#     p = figure(
#         x_range = Range1d(0,N//2, bounds=(-.25,N)),
#         y_range = Range1d(-N//2,0, bounds=(-N,.25)),
#         match_aspect=True
#         )
#     p.axis.visible = False
#     p.block(x=0, y=[-i-1 for i in range(0,len(self.part))], width = self.part)
#     p.xaxis.ticker = FixedTicker(ticks=[x for x in range(N)])
#     p.yaxis.ticker = FixedTicker(ticks=[x+1.0 for x in range(-N,0)])
#     return p
# def __str__(self):
#     return "seq: " + str(self.seq) + " part: " + str(self.part)
# def __eq__(self,other):
#     return self.part == other.part
# def __lt__(self,other):
#     if sum(self.part) != sum(other.part):
#         return sum(self.part) < sum(other.part)
#     return self.part < other.part