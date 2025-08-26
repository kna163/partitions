import React, { useState } from "react";

const docs = [
  {
    name: "Types",
    description: "Seq : The step sequence of a partition, consisting only of 0s and 1s, e.g. [1,0,1,0,0,1,0]. \
    Although canonically starts with a 1 and ends with a 0 (leading 0s and trailing 1s are considered the same as none), \
     any binary sequence works. Almost every function takes in Seq instead of Part due to it being easier to work with in computation.\n\
     Part : The usual representation of a partition, with the parts descending, e.g. [5,3,1,1] is 5+3+1+1=10. More user-friendly.\
     ",
    examples: ["[1,0,1,0,1,0,0] : Seq", "[3,2,1] : Part"],
  },
  {
    name: "seqToPart(seq)",
    description: "Seq -> Part \n \
    Returns the corresponding partition representation of `seq`.\n \
    partToSeq does the opposite.",
    examples: ["seqToPart([1,0,0,1,1,0,1,1,0]) = [5,3,1,1]", "seqToPart([1,1,0,1,0,1,0]) = [4,3,2]"],
  },
  {
    name: "partToSeq(part)",
    description: "Part -> Seq \n \
    Returns the corresponding sequence representation of `part`.\n \
    seqToPart does the opposite.",
    examples: ["partToSeq([5,3,1,1]) = [1,0,0,1,1,0,1,1,0]", "partToSeq([4,3,2]) = [1,1,0,1,0,1,0]"],
  },
  {
    name: "trimSeq(seq)",
    description: "Seq -> Seq\n \
    Returns the canonical form of `seq` by removing leading 0s and trailing 1s which are absorbed in the bi-infinite sequence.\n \
    The `parti` library guarantees that if the input is trimmed, the output is correct and trimmed as well (so nested calls work properly). So, the only time you might need to trim when working with the library is when inputting in your own binary sequences directly. \n \
    The interpreter on this page always trims the input for these functions, so there is no need to worry here.",
    examples: ["trimSeq([0,0,1,1,1,1]) = []", "trimSeq([0,0,1,0,1,1]) = [1,0]", "core(trimSeq([0,1,1,1,0,1,0,1,0,0,1]),3)=[1,1,0] // needed for library, but not here", "core(partToSeq([5,5,4,3]),3) = [1,1,0] // doesn't need trimSeq"],
  },
  {
    name: "core(seq, t)",
    description: "Seq, Int -> Seq\n \
    Returns the `t`-core of `seq`.\n",
    examples: ["core(partToSeq([5,3,1,1]), 3) = [1,0,0,1,1,0,1,1,0] //this is already a 3-core!", "core(partToSeq([3,2,1]),3) = []"],
  },
  {
    name: "refIdx(seq)",
    description: "Seq -> Int \n\
    Returns the reference index of `seq`, which is the unique 0-based index of the array such that the number of 1s strictly before it is equal to the number of 0s at the index and from then on.\n \
    The quotients are taken with respect to this index, e.g. the 0th t-quotient consists of the subsequence seq[i] where i%t = refIdx(seq)%t. \
    Alternatively, when considering the Ferrers diagram, the reference index splits it into negative indices and non-negative indices at the point where the outline of the diagram intersects the line y=-x.",
    examples: ["refIdx([1,0,0,1,1,0,1,1,0]) = 4", "refIdx([1,0,1,0,1,0]) = 3", "refIdx([0,0,1])=2"],
  },
  {
    name: "decomp(seq,t) ",
    description: "Seq, Int -> [Seq, [Seq]]\n \
    Returns the Littlewood `t`-decomposition of `seq` as [core,quos], where core is the `t`-core and quos[i] \
    is the ith `t`-quotients. \n\
    The numbering of these quotients is with respect to refIdx, i.e. quos[i] is going to be the subsequence seq[j] where j%t = (i-refIdx(seq))%t, as per convention. \
    fromDecomp(core,quos) provides the inverse function (NB: the output of decomp is a list, but fromDecomp takes two inputs in the module/library. For added convenience, here, the interpreter will actually accept either.).",
    examples: ["decomp([1,0,0,1,1,0,1,1,0],4) = [[1,1,0],[[1,1,0],[],[],[]]]", "decomp(fromDecomp([1,0,0,1,0],[[1,0],[1,1,0],[]]),3) = [[1,0,0,1,0],[[1,0],[1,1,0],[]]]"],
  },

  {
    name: "coreToVec(seq,t)",
    description: "Seq, Int -> [Int]\n \
    Returns the associated length `t` integer vector of the (assumed) `t`-core `seq`.\n \
    coreToVec(seq,t)[i] is the smallest k such that the (i+k*t)th element (with respect to refIdx) of the bi-infinite sequence is 1. Note that since it deals with the bi-infinite sequence, i+k*t+refIdx can be outside of the array.\
    the sum of the entries of coreToVec(seq,t) is always 0, and the inverse function is vecToCore(vec).",
    examples: ["coreToVec([1,0,0,1,0],3) = [-1,1,0] //refIdx is 3", "coreToVec([1,0,0,1,1,0,1,1,0],3) = [0,2,-2]"],
  },

  {
    name: "vecToCore(vec)",
    description: "[Int] -> Seq\n \
    Returns the associated `t`-core of the integer vector `vec` of length `t` with sum 0. \n \
    The inverse function is coreToVec.",
    examples: ["vecToCore([-1,1,0]) = [1,0,0,1,0]", "vecToCore([0,2,-2]) = [1,0,0,1,1,0,1,1,0]"],
  },

  {
    name: "fromDecomp(seq, quos)",
    description: "Seq, [Seq] -> Seq\n \
    Returns the partition with `t`-core `seq` and `t`-quotients `quos` (list of t sequences).\n \
    Assumes that `seq` is a `t`-core. This provides the other side of the Littlewood decomposition. \
    Additionally, for convenience, the interpreter converts fromDecomp([seq,[quos]]) into fromDecomp(seq,quos). \
    ",
    examples: ["fromDecomp([1,0,0,1,0],[[1,0],[1,1,0],[]]) = [1,0,0,0,0,0,1,1,1,1,1,1,1,0]", "fromDecomp([1,1,0],[[1,1,0],[],[],[]]) = [1,0,0,1,1,0,1,1,0]"],
  },
];
// decomp(seq,t) 

const CollapsibleItem = ({ item }) => {
  const [openDesc, setOpenDesc] = useState(false);
  const [openExamples, setOpenExamples] = useState(false);

  return (
    <div style={{ marginBottom: "8px" }}>
      <div
        onClick={() => setOpenDesc(!openDesc)}
        style={{ cursor: "pointer", fontWeight: "bold" }}
      >
        {item.name}
      </div>
      {openDesc && (
        <div style={{ paddingLeft: "16px", marginTop: "4px" }}>
          <div style={{ whiteSpace: "pre-line" }}>{item.description}</div>
          {item.examples?.length > 0 && (
            <div
              onClick={() => setOpenExamples(!openExamples)}
              style={{ cursor: "pointer", color: "blue", marginTop: "4px" }}
            >
              {openExamples ? "Hide Examples" : "Show Examples"}
            </div>
          )}
          {openExamples &&
            item.examples.map((ex, idx) => (
              <div key={idx} style={{ paddingLeft: "16px" }}>
                {ex}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default function DocsSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        width: collapsed ? "50px" : "250px",
        transition: "width 0.2s",
        borderLeft: "1px solid #ddd",
        background: "#f9f9f9",
        padding: "8px",
        overflowY: "auto", // independent scroll
      }}
    >
      <h3>Docs</h3>
      <button onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "←" : "→"}
      </button>
      {!collapsed &&
        docs.map((item, idx) => <CollapsibleItem key={idx} item={item} />)}
    </div>
  );
}