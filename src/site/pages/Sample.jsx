import { useEffect, useRef } from "react";
import RevealMarkdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealMath from "reveal.js/plugin/math/math.esm.js";
// import "reveal.js/dist/reveal.css";
// import "reveal.js/dist/theme/sky.css";
import Navbar from "../components/Navbar.jsx";


import RevealWrapper from "../components/RevealWrapper.jsx";
// Make sure reveal.js is installed with npm for the following imports to work
// Plugins
import RevealNotes from 'reveal.js/plugin/notes/notes';
import RevealZoom from 'reveal.js/plugin/zoom/zoom';


export default function Sample() {
return (
    <>
      <Navbar />
      <div style={{height:"100vh", width:"100%"}}>
       <RevealWrapper>
        <section>
          <h2>Slide 1</h2>
          <p>Hello world!</p>
        </section>
        <section><h2>Slide 2</h2></section>
      </RevealWrapper>
      </div>
      
    </>
  )

  
}
