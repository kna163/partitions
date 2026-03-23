import { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import RevealNotes from "reveal.js/plugin/notes/notes.esm.js";
import RevealZoom from "reveal.js/plugin/zoom/zoom.esm.js";
// import RevealMath from "reveal.js/plugin/math/math.esm.js";

import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/sky.css";

export default function RevealWrapper({ children }) {
  const deckRef = useRef(null);
  const revealRef = useRef(null);

  useEffect(() => {
    revealRef.current = new Reveal(deckRef.current, {
      plugins: [RevealNotes, RevealZoom],
      controls: true,
      fragments: false, //debug
    });
    revealRef.current.initialize();
    return () => revealRef.current.destroy();
  }, []);

  return (
    <div ref={deckRef} className="reveal">
      <div className="slides">{children}</div>
    </div>
  );
}
