import { useEffect, useRef } from "react";
import RevealMarkdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealMath from "reveal.js/plugin/math/math.esm.js";
// import "reveal.js/dist/reveal.css";
// import "reveal.js/dist/theme/sky.css";
import Navbar from "../components/Navbar.jsx";
import RoughBasic from "../components/RoughBasic.jsx";

import notesURL from '../assets/Partitions.pdf';


import RevealWrapper from "../components/RevealWrapper.jsx";
// Make sure reveal.js is installed with npm for the following imports to work
// Plugins
import RevealNotes from 'reveal.js/plugin/notes/notes';
import RevealZoom from 'reveal.js/plugin/zoom/zoom';


export default function Notes() {
return (
    <>
      <Navbar />
      <div style={{height:"100vh", width:"100%", display: "flex", marginLeft: "auto", marginRight: "auto"}}>
        <embed src={notesURL} width="90%" />
       {/* <iframe src="http://docs.google.com/gview?
url=..//pub/papers/google.pdf&embedded=true"
style="width:600px; height:500px;" frameborder="0"></iframe> */}
      </div>
      
    </>
  )

  
}



