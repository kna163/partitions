import Navbar from "../components/Navbar.jsx";
import DiagramBar from "../components/DiagramBar.jsx";
import Grapher from "../components/Grapher.jsx";

import * as g from '../../js/graphics.js';

import { useEffect, useRef, useState } from "react";
import rough from 'roughjs';


import './Page.css';


export default function Visualizer() {
  const [boringness, setBoringness] = useState(.2);
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);
  const canvasRef = useRef(null);

  const counter = useRef(0);
return (
    <>
      <Navbar />
      <h1>Diagram Maker!</h1>
      <p>Hopefully fairly straightforward. Each diagram is composed of several basic components, such as partitions, skew partitions, and paths. Transformations are applied in the following order: First, it will scale and rotate (ccw angle in degrees) the diagram relative to the origin, and then finally apply the translation.</p>
      <p>Partitions are denoted with <code>[5,3,1]</code> and for skew partitions by <code>[5,3,1]\[3,1]</code>. As for drawing paths, the notation <code>(a,b)--(c,d)--(e,f)--</code>, where the last (optional) <code>--</code> will close the path with the segment connecting the first and last points.</p>
      <p>The components are rendered sequentially starting from the first item in the list, which will appear on the bottom. By default, has <code>character=.2</code>, adjusting to lower levels will make the diagram more standard, and more interesting results may happen at high values.</p>
      <p>Finally, the top priority for options are ones with fields (color), then ones from advanced options (see <a href="https://github.com/rough-stuff/rough/wiki#options">RoughJS</a> for lists of properties; for example can use <code>hachureGap: 10, fill: "lightcoral", roughness: 3, stroke: "yellow", strokeWidth:5</code>), and then finally default ones.</p>
      <div>
        <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={boringness}
        onChange={(e) => setBoringness(parseFloat(e.target.value))}
      />
      <p>character={boringness}</p>
      </div>

      <div>
        <button onClick={() => {
          const link = document.createElement('a');
          link.download = 'canvas.png';
          link.href = canvasRef.current.toDataURL('image/png');
          link.click();
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
      </div>

      {/*Canvas div*/}
      <div style={{ display: "inline-block", border: "1px solid #ddd", borderRadius: 6, lineHeight: 0 }}>
        <canvas ref={canvasRef} width={800} height={600} />
        <Grapher items={items} canvasRef={canvasRef} roughlvl={boringness} />
      </div> 

      {/* */}
      <div>
        <DiagramBar onItemsChange={setItems}/>
      </div>
    </>
  )

  
}