import * as g from '../../js/graphics.js';

import Navbar from "../components/Navbar.jsx";
import { useEffect, useRef } from "react";
import rough from 'roughjs';


export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.translate(2,2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let scale = 30;
    let partStyle = {roughness: 0.5, hachureGap: 1.5};
    let partBoxStyle2 = {roughness: 0.5, hachureGap: 5, hachureAngle : 45};
    rc.polygon(g.scale(g.partToCoords([8,7,5,3,2]),scale), {...partStyle, fill: "darkseagreen"});
    rc.polygon(g.scale([[2,2],[5,2],[5,3],[3,3],[3,4],[2,4],[2,5],[1,5],[1,3],[2,3],[2,2]],scale), {...partBoxStyle2, fill: "lightcoral"});
    rc.polygon(g.scale([[6,0],[8,0],[8,1],[7,1],[7,2],[6,2],[6,0]],scale), {...partBoxStyle2, fill: "mediumorchid"})
    ctx.restore();
  }, []);

  return (
    <>
      <Navbar />
  
      <h1>Home</h1>
      <p>Many years ago, I had worked with integer partitions for a bit, and had come across some interesting statements which said that they had intimate ties with the representation theory of \(S_n\), the group of symmetries on \(n\) variables. In the interest of sharing some of these facts and to develop some of the ideas from back then into more interactive and accessible forms, this project came about.
        This project largely focuses on the Littlewood decomposition which gives a way of splitting up a partition into other partitions without losing any information along the way. The python module allows you to do some other computations with partitions which are also important!
      </p>
      
      <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "60px"}}>
        <div>
          <canvas
            ref={canvasRef}
            width={250}
            height={250}/>
          <p>Diagram of two rim hooks of the partition {String.raw`\(\lambda=[8,7,5,3,2]\)`} made using RoughJS</p>
        </div>
        <div>
          <p>
            {String.raw`\[\begin{array}{c|ccccccccccc}
              S_6 & [1, 1, 1, 1, 1, 1] & [2, 1, 1, 1, 1] & [2, 2, 1, 1] & [2, 2, 2] & [3, 1, 1, 1] & [3, 2, 1] & [3, 3] & [4, 1, 1] & [4, 2] & [5, 1] & [6]\\ \hline 
              \chi[1, 1, 1, 1, 1, 1] & 1 & -1 & 1 & -1 & 1 & -1 & 1 & -1 & 1 & 1 & -1 \\ 
              \chi[2, 1, 1, 1, 1] & 5 & -3 & 1 & 1 & 2 & 0 & -1 & -1 & -1 & 0 & 1 \\ 
              \chi[2, 2, 1, 1] & 9 & -3 & 1 & -3 & 0 & 0 & 0 & 1 & 1 & -1 & 0 \\ 
              \chi[2, 2, 2] & 5 & -1 & 1 & 3 & -1 & -1 & 2 & 1 & -1 & 0 & 0 \\ 
              \chi[3, 1, 1, 1] & 10 & -2 & -2 & 2 & 1 & 1 & 1 & 0 & 0 & 0 & -1 \\ 
              \chi[3, 2, 1] & 16 & 0 & 0 & 0 & -2 & 0 & -2 & 0 & 0 & 1 & 0 \\ 
              \chi[3, 3] & 5 & 1 & 1 & -3 & -1 & 1 & 2 & -1 & -1 & 0 & 0 \\ 
              \chi[4, 1, 1] & 10 & 2 & -2 & -2 & 1 & -1 & 1 & 0 & 0 & 0 & 1 \\ 
              \chi[4, 2] & 9 & 3 & 1 & 3 & 0 & 0 & 0 & -1 & 1 & -1 & 0 \\ 
              \chi[5, 1] & 5 & 3 & 1 & -1 & 2 & 0 & -1 & 1 & -1 & 0 & -1 \\ 
              \chi[6] & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 \end{array}\]`}
          </p>
          <p>The irreducible character table of \(S_6\) using partitions as labels for characters and conjugacy classes.</p>

        </div>
      </div>
      <h3>Key features</h3>
      <p>Littlewood</p>
      <ul>
        <li>A slideshow which explores a problem and shows how the Littlewood decomposition can more naturally come about.</li>
        <li>Proves the Littlewood decomposition using bi-infinite sequences. This also gives some more of the context for the calculator on this website.</li>
        <li>Provides some context about the connection between the Littlewood decomposition and modular representations of \(S_n\) via block theory in broad strokes.</li>
      </ul>
      <p>Notes</p>
      <ul>
        <li>Contains proofs from the slideshow in a page format for easier reading.</li>
      </ul>
      <p>Text calculator</p>
      <ul>
        <li>Allows you to do computations on the web page without downloading anything! Useful for quick calculations, reference, etc.</li>
        <li>Contains documentation for supported functions on the page including working with sequences and the Littlewood decomposition.</li>
        <li>Provides debugging information when there's an issue with the input.</li>
        <li>How it works: An interpreter parses and passes in the input to the JS port of the core part of the library, which then returns the result.</li>
      </ul>
      <p>Docs & Python Library</p>
      <ul>
        <li>Provides documentation for the python library.</li>
        <li>Python library contains entirety of the JS port, so it works with sequences and the Littlewood decomposition as well.</li>
        <li>
          Additional features are as follows:
        <ul>
          <li>Can enumerate all partitions of \(n\), forward or backward in lexicographical order.</li>
          <li>Can compare partitions based on containment (one diagram fits inside the other), dominance order ({String.raw`\(\sum_{j \le i} a_i \ge \sum_{j \le i} b_i\)`} for all \(i\)), and lexicographical order.</li>
          <li>Can compute irreducible character table for the symmetric group as well as the permutation character table.</li>          
        </ul>
        </li>

      </ul>
    </>
  )
}