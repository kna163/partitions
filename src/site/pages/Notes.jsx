import { useEffect, useRef } from "react";

import Navbar from "../components/Navbar.jsx";

import notesURL from '../assets/Partitions.pdf';

export default function Notes() {
return (
    <>
      <Navbar />
      <div style={{height:"100vh", width:"100%", display: "flex", marginLeft: "auto", marginRight: "auto"}}>
        <embed src={notesURL} width="90%" />
      </div>
      
    </>
  )

  
}



