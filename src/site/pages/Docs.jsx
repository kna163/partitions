import TOC from "../components/TOC.jsx";
import Navbar from "../components/Navbar.jsx";
import '../components/DocsSidebar.css';

const docs = [
  {
    name: "Types",
    description: "`Seq` : The step sequence of a partition, consisting only of 0s and 1s, e.g. [1,0,1,0,0,1,0]. \
    Although canonically starts with a 1 and ends with a 0 (leading 0s and trailing 1s are considered the same as none), \
     any binary sequence works. Almost every function takes in Seq instead of Part due to it being easier to work with in computation.\n\
     `Part` : The usual representation of a partition, with the parts descending, e.g. [5,3,1,1] is 5+3+1+1=10. More user-friendly.\
     ",
    examples: ["[1,0,1,0,1,0,0] : Seq", "[3,2,1] : Part"],
  },
  {
    name: "seq_to_part(seq)",
    description: "`Seq -> Part` \n \
    Returns the corresponding partition representation of `seq`.\n \
    `part_to_seq` does the opposite.",
    examples: ["seq_to_part([1,0,0,1,1,0,1,1,0])\n>>> [5,3,1,1]", "seq_to_part([1,1,0,1,0,1,0])\n>>> [4,3,2]"],
  },
  {
    name: "part_to_seq(part)",
    description: "`Part -> Seq` \n \
    Returns the corresponding sequence representation of `part`.\n \
    `seq_to_part` does the opposite.",
    examples: ["part_to_seq([5,3,1,1])\n>>> [1,0,0,1,1,0,1,1,0]", "part_to_seq([4,3,2])\n>>> [1,1,0,1,0,1,0]"],
  },
  {
    name: "trim_seq(seq)",
    description: "`Seq -> Seq`\n \
    Returns the canonical form of `seq` by removing leading 0s and trailing 1s which are absorbed in the bi-infinite sequence.\n \
    The `parti` library guarantees that if the input is trimmed, the output is correct and trimmed as well (so nested calls work properly). So, the only time you might need to trim when working with the library is when inputting in your own binary sequences directly. \n \
    The interpreter on this page always trims the input for these functions, so there is no need to worry here.",
    examples: ["trim_seq([0,0,1,1,1,1])\n>>> []", "trim_seq([0,0,1,0,1,1])\n>>> [1,0]", "core(trim_seq([0,1,1,1,0,1,0,1,0,0,1]),3) // needed for library, but not here\n>>> [1,1,0]", "core(part_to_seq([5,5,4,3]),3)\n>>> [1,1,0] // doesn't need trim_seq"],
  },
  {
    name: "core(seq, t)",
    description: "`Seq, Int -> Seq`\n \
    Returns the `t`-core of `seq`.\n",
    examples: ["core(part_to_seq([5,3,1,1]), 3)\n>>> [1,0,0,1,1,0,1,1,0] //this is already a 3-core!", "core(part_to_seq([3,2,1]),3)\n>>> []"],
  },
  {
    name: "ref_idx(seq)",
    description: "`Seq -> Int`\n\
    Returns the reference index of `seq`, which is the unique 0-based index of the array such that the number of 1s strictly before it is equal to the number of 0s at the index and from then on.\n \
    The quotients are taken with respect to this index, e.g. the 0th t-quotient consists of the subsequence seq[i] where i%t = ref_idx(seq)%t. \
    Alternatively, when considering the Ferrers diagram, the reference index splits it into negative indices and non-negative indices at the point where the outline of the diagram intersects the line y=-x.",
    examples: ["ref_idx([1,0,0,1,1,0,1,1,0])\n>>> 4", "ref_idx([1,0,1,0,1,0])\n>>> 3", "ref_idx([0,0,1])=2"],
  },
  {
    name: "decomp(seq,t)",
    description: "`Seq, Int -> List = [Seq, List[Seq]]`\n \
    Returns the Littlewood `t`-decomposition of `seq` as [core,quos], where core is the `t`-core and quos[i] \
    is the ith `t`-quotients. \n\
    The numbering of these quotients is with respect to ref_idx, i.e. quos[i] is going to be the subsequence seq[j] where j%t = (i-ref_idx(seq))%t, as per convention. \
    `from_decomp(core,quos)` provides the inverse function (NB: the output of decomp is a list, but from_decomp takes two inputs in the module/library. For added convenience, here, the interpreter will actually accept either.).",
    examples: ["decomp([1,0,0,1,1,0,1,1,0],4)\n>>> [[1,1,0],[[1,1,0],[],[],[]]]", "decomp(from_decomp([1,0,0,1,0],[[1,0],[1,1,0],[]]),3)\n>>> [[1,0,0,1,0],[[1,0],[1,1,0],[]]]"],
  },

  {
    name: "core_to_vec(seq,t)",
    description: "`Seq, Int -> List[Int]`\n \
    Returns the associated length `t` integer vector of the (assumed) `t`-core `seq`.\n \
    `core_to_vec(seq,t)[i]` is the smallest k such that the (i+k*t)th element (with respect to ref_idx) of the bi-infinite sequence is 1. Note that since it deals with the bi-infinite sequence, i+k*t+ref_idx can be outside of the array.\
    the sum of the entries of `core_to_vec(seq,t)` is always 0, and the inverse function is `vec_to_core(vec)`.",
    examples: ["core_to_vec([1,0,0,1,0],3)\n>>> [-1,1,0] //ref_idx is 3", "core_to_vec([1,0,0,1,1,0,1,1,0],3)\n>>> [0,2,-2]"],
  },

  {
    name: "vec_to_core(vec)",
    description: "`List[Int] -> Seq`\n \
    Returns the associated `t`-core of the integer vector `vec` of length `t` with sum 0. \n \
    The inverse function is `core_to_vec`.",
    examples: ["vec_to_core([-1,1,0])\n>>> [1,0,0,1,0]", "vec_to_core([0,2,-2])\n>>> [1,0,0,1,1,0,1,1,0]"],
  },

  {
    name: "from_decomp(seq, quos)",
    description: "`Seq, List[Seq] -> Seq`\n \
    Returns the partition with `t`-core `seq` and `t`-quotients `quos` (list of t sequences).\n \
    Assumes that `seq` is a `t`-core. This provides the other side of the Littlewood decomposition. \
    Additionally, for convenience, the interpreter converts `from_decomp([seq,[quos]])` into `from_decomp(seq,quos)`. The inverse function is `decomp`.\
    ",
    examples: ["from_decomp([1,0,0,1,0],[[1,0],[1,1,0],[]])\n>>> [1,0,0,0,0,0,1,1,1,1,1,1,1,0]", "from_decomp([1,1,0],[[1,1,0],[],[],[]])\n>>> [1,0,0,1,1,0,1,1,0]"],
  },
  {
    name: "cmp_total(p1, p2)",
    description: "`Part, Part -> int`\n \
    Returns -1 if p1 < p2, 0 if p1 == p2, and 1 if p1 > p2\
    Ordering is first determined by what number it partitions, so if sum(p1) > sum(p2) then p1 > p2\
    Then it is determined by the lexicographical ordering, ex. [3,2,1] > [3,1,1]. This is a total ordering, so it always returns an integer.",
    examples: ["cmp_total([3,2,1],[3,1,1])\n>>> 1", "cmp_total([2,2],[1,1,1,1,1])\n>>> -1", "cmp_total([5,2],[5,2])\n>>> 0"],
  },
  {
    name: "cmp_partial(p1, p2)",
    description: "`Part, Part -> int | None`\n \
    Returns -1 if p1 < p2, 0 if p1 == p2, 1 if p1 > p2, and None if there is none of these are true \
    Ordering is determined by whether one partition's diagram containing the other entirely, defining a partial ordering.",
    examples: ["cmp_partial([3,2,1],[3,1,1])\n>>> None", "cmp_partial([5,4,3,3,2],[4,3,1,1])\n>>> 1", "cmp_partial([5,4,3,3,2],[4,4,4])\n>>> None"],
  },
  {
    name: "cmp_dom(p1, p2)",
    description: "`Part, Part -> int | None`\n \
    Returns -1 if p1 < p2, 0 if p1 == p2, 1 if p1 > p2, and None if there is none of these are true \
    Ordering is determined by if one partition dominates another, that is for all \(i\), \(\sum a_i > \sum b_i \) then \(A=(a_i)\) dominates \(B=(b_i)\).",
    examples: ["cmp_dom([3,2,1],[3,1,1])\n>>> 1", "cmp_dom([5,4,3,3,2],[4,3,1,1])\n>>> 1", "cmp_dom([5,4,3,3,2],[4,4,4])\n>>> 1", "cmp_dom([4,3,1,1,1],[4,2,2,2])\n>>> None"],
  },
  {
    name: "conj_part(part)",
    description: "`Part -> Part`\n \
    Returns the partition's conjugate, that is for \(\lambda=(\lambda_1,\ldots)\), the partition obtained by having \(\lambda_i\) squares in the \(i\)th column.",
    examples: ["conj_part([3,2,1])\n>>> [3,2,1]", "conj_part([4,2])\n>>> [2,2,1,1]", "conj_part([9,6,6,3,1,1,1])\n>>> [7,4,4,3,3,3,1,1,1]"],
  },
  {
    name: "is_self_conj(part)",
    description: "`Part -> bool`\n \
    Returns if a partition is conjugate to itself; slightly more efficient than the direct comparison",
    examples: ["is_self_conj([3,2,1])\n>>> True", "is_self_conj([4,2])\n>>> False"],
  },
  {
    name: "is_core(part,t)",
    description: "`Part, int -> bool`\n \
    Returns if a partition is a t-core, or rather if it has no t-rim hooks.",
    examples: ["is_core([4,2],3)\n>>> True", "is_core([5,2,1],3)\n>>> False", "is_core([4,3,2,1],2)\n>>> True"],
  },
  {
    name: "next_part(part)",
    description: "`Part -> Part | None`\n \
    Returns the next partition (of the same number) coming in lexicographical order or None if it is the last one i.e. [n].",
    examples: ["next_part([4,3,3,2])\n>>> [4,4,1,1,1,1]", "next_part([2,2,1,1])\n>>> [2,2,2]", "next_part([3,2,1])\n>>> [3,3]", "next_part([4])\n>>> None"],
  },
  {
    name: "prev_part(part)",
    description: "`Part -> Part | None`\n \
    Returns the previous partition (of the same number) coming in lexicographical order or None if it is the first one i.e. [1,1,...,1].",
    examples: ["prev_part([4,4,1,1,1,1])\n>>> [4,3,3,2]", "prev_part([2,2,2])\n>>> [2,2,1,1]", "prev_part([3,3])\n>>> [3,2,1]", "prev_part([1,1,1,1])\n>>> None"],
  },
  {
    name: "gen_parts_n(n)",
    description: "`int -> Iterator[Part]`\n \
    Returns a generator which goes through each of the partitions of \(n\) in increasing lexicogrpahical order.",
  },
  {
    name: "gen_parts()",
    description: "`None -> Iterator[Part]`\n \
    Returns a generator which goes through every partition of \(n\) while \(n\) increases indefinitely and starting from \(n=0\)",
  },
  {
    name: "get_pnk(n,k)",
    description: "`int, int -> int`\n \
    Returns the number of partitions of \(n\) where each part is no greater than \(k\). In particular, get_pnk(n,n) gives the number of partitions of \(n\). Due to computational complexity, it is suggested to use only moderate values of k.",
    examples: ["get_pnk(5,2)\n>>> 3", "get_pnk(5,5)\n>>> 7", "get_pnk(8,3)\n>>> 10"]
  },
  {
    name: "lex_order(part)",
    description: "`Part -> int`\n \
    Returns the index of part in the list of all partitions of that same number when in lexicographical order.",
    examples: ["lex_order([1,1,1])\n>>> 0", "lex_order([3,2,1])\n>>> 5", "lex_order([4,3,1,1,1])\n>>> 18"],
  },
  {
    name: "from_lex(n,i)",
    description: "`int, int -> Part`\n \
    Returns the \(i\)th partition of \(n\) when in lexicographical order.",
    examples: ["from_lex(3,0)\n>>> [1,1,1]", "from_lex(6,5)\n>>> [3,2,1]", "from_lex(10,18)\n>>> [4,3,1,1,1]"],
  },
  {
    name: "part_minus_rim(part,k)",
    description: "`Part, int -> tuple(list(Part))`\n \
    Given part, it generates lists of all partitions which result from removing exactly one \(k\)-rim hook from the original. \
    It seperates these based on how many rows the \(k\)-rim hook traverses with the ones crossing an odd number of rows being in the first list (corresponding to having a positive coefficient) \
    and the ones crossing an even number of rows being in the second (negative coefficients). This is key to the Murnaghan-Nakayama rule."
  },
  {
    name: "get_char_value(char, conj_class)",
    description: "`Part, Part -> int`\n \
    Returns the value of the irreducible character (indexed by char) on the conjugacy class (indexed by conj_class). Fairly fast even for larger partitions.",
    examples: ["get_char_value([2,1,1],[1,1,1,1])\n>>> 3", "get_char_value([7,5,4,1],[7,4,4,1,1])\n>>> -1", "get_char_value([4,4,1,1],[5,3,2])\n>>> 0"]
  },
  {
    name: "get_pchar_value(pchar, conj_class)",
    description: "`Part, Part -> int`\n \
    Returns the value of the permutation character (indexed by pchar) on the conjugacy class (indexed by conj_class). Also fairly fast, but might run into performance issues as the values can be very large on some conjugacy classes for large partitions.",
    examples: ["get_pchar_value([2,1,1],[1,1,1,1])\n>>> 12", "get_pchar_value([7,5,4,1],[7,4,4,1,1])\n>>> 4", "get_pchar_value([4,4,1,1],[5,3,2])\n>>> 0"]
  },
  {
    name: "char_table(n)",
    description: "`int -> dict[(tuple(int),tuple(int)), int]`\n \
    Returns the irreducible character table of \(S_n\) as a dictionary where the key (char,conj_class) is mapped to the value `get_char_value(list(char),list(conj_class))`. Note that tuples should be used with the map instead of lists."
  },
  {
    name: "char_table2(n)",
    description: "`int -> list[list[int]]`\n \
    Returns the irreducible character table of \(S_n\) as a list where the [i][j] entry is going to be the value of the ith irred. character (from lex order) on the jth conjugacy class."
  },
  {
    name: "perm_table(n)",
    description: "`int -> dict[(tuple(int),tuple(int)), int]`\n \
    Returns the permutation character table of \(S_n\) as a dictionary where the key (pchar,conj_class) is mapped to the value `get_pchar_value(list(pchar),list(conj_class))`. Note that tuples should be used with the map instead of lists."
  },
  {
    name: "perm_table2(n)",
    description: "`int -> list[list[int]]`\n \
    Returns the permutation character table of \(S_n\) as a list where the [i][j] entry is going to be the value of the ith permutation character (from lex order) on the jth conjugacy class."
  },
  {
    name: "clear_pnk_table()",
    description: "None -> None`\n \
    Clears memorized values of get_pnk(n,k) (for faster computation) in order to free up memory again; should be almost entirely unnecessary in most use cases.",
  },
  {
    name: "clear_char_val_table()",
    description: "None -> None`\n \
    Clears memorized values of get_char_value(char,conj_class) (for faster computation) in order to free up memory again. Once again, usually unnecessary unless computing many times with large partitions.",
  },
  {
    name: "clear_pchar_val_table()",
    description: "None -> None`\n \
    Clears memorized values of get_pchar_value(char,conj_class) (for faster computation) in order to free up memory again. Once again, usually unnecessary unless computing many times with large partitions.",
  },

];

function formatDocs(s) {
    return s.replace(/`([^`]+)`/g, "<code>$1</code>")
}


export default function Docs() {
    
    return (
    <>
      <Navbar />
      <TOC />

      <main>
        {docs.map((d) => {
          const id = d.name.toLowerCase().replace(/\s+/g, '-');

          return (
            <section key={id} id={id}>
              <h2>{d.name}</h2>
              <p dangerouslySetInnerHTML={{ __html: formatDocs(d.description)}} />

              {d.examples && (
                <pre>
                  {d.examples.join('\n\n')}
                </pre>
              )}
            </section>
          );
        })}
      </main>
    </>
  );
}