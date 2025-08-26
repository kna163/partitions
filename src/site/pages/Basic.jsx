import React, { useState, useMemo, useEffect } from "react";
import * as parse from '../../js/parse.js';
import { debounce } from "lodash";
import DocsSidebar from "../components/DocsSidebar.jsx";
import Navbar from "../components/Navbar.jsx";
const debounceTime = 750;

export default function Basic() {
  const [debouncedValue, setDebouncedValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const debouncedUpdate = useMemo(
    () => debounce((val) => setDebouncedValue(val), debounceTime),
    []
  );
  const [evalValue, setEvalValue] = useState("");
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);     // updates immediately
    debouncedUpdate(val);   // updates only after debounce delay
  };
  useEffect(() => {
    if (!debouncedValue) {
      setEvalValue(null);
      setError(null);
      return;
    }

    try {
      var str = debouncedValue;
      var result = parse.textEval(str);
      setEvalValue(result);
      setError(null);
    } catch (err) {
      setEvalValue(null);
      setError(`${err.message}`);
    }
  }, [debouncedValue]);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "0vh" }}></div>
      <Navbar />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
       <div
          style={{
            flex: 1,
            padding: "1rem",
            overflowY: "auto", // independent scroll
          }}
        >
          <h1> Text-based Editor!</h1>

          <p>For most functions, it only accepts the step sequence of the partition, (input variable will be named seq as well) so for the ordinary partition [5,3,1,1], you can get the step sequence with partToSeq([5,3,1,1]).
            Function calls are done in a standard way, e.g. if you want to use decomp(seq,t), you can use decomp([1,0,0,1,1,0,1,1,0],3), (or the more friendly decomp(partToSeq([5,3,1,1]),3)) to get the Littlewood decomposition for \(t=3\) of the partition [5,3,1,1].
          Additionally, indexing in lists is done using standard \(0\)-indexed bracket notation, that is, [5,3,1,1][1] = 3, and it also works with function calls which return lists; if you want to get the 3-core, you can use either decomp(...)[0] or core(...) and get the ith 3-quotient with decomp(...)[1][i]. 
          </p>
          <p>More formally, one can describe the basic grammar as `Expr = Number | (Expr) | List(Expr*) | Call(Expr*) | (List(Expr*) | Call(Expr*))[Expr]`. So, an expression such as decomp( decomp( partToSeq([5,3,1,1]),4)[1][0],2) is still valid. The docs (to the right) and the error messages should be helpful for programming, but for more serious work, use the Python package <a href='https://github.com/kna163/partitions/blob/main/src/partitions/parti.py'>here</a>! </p>
          <h3>Input</h3>
          <textarea
            type="text"
            value={inputValue} 
            onChange={handleChange}
            placeholder="Type here..."
          />

          <h3>Result</h3>
          <input type="text" value={evalValue !== null ? JSON.stringify(evalValue) : ""} readOnly />
          <pre >{error !== null ? <span style={{color: "hotpink"}}>{error}</span> : ""}</pre>
      </div>

        {/* <input type="text" value={error} readOnly /> */}
          <DocsSidebar />

    </div>

    </>
  
  );
}