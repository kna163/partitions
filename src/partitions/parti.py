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
Seq = list[int]
Part = list[int]

def seq_to_part(seq : Seq) -> Part:
    #string of the form (0)10111101(0)(1)
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
    if p1 == p2:
        return 0
    if sum(p1) < sum(p2):
        return -1
    if sum(p1) > sum(p2):
        return 1
    
def cmp_partial(p1 : Part, p2 : Part) -> int | None:
    if p1 == p2:
        return 0
    rev = False
    if sum(p1) > sum(p2):
        p1,p2 = p2,p1
        rev = True
    if len(p2) < len(p1):
        return None
    for i in range(len(p1)):
        if p1[i] > p2[i]:
            return None
    if rev:
        return 1
    else:
        return -1
    

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