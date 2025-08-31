import { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import RevealMarkdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealMath from "reveal.js/plugin/math/math.esm.js";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/sky.css";
import Navbar from "../components/Navbar.jsx";

export default function Sample() {
  const revealRef = useRef(null);
  const slidesRef = useRef(null);

  useEffect(() => {
    let deck;
    const markdown = `
<section data-markdown>
## Slide 1
A paragraph with some text and a [link](https://hakim.se).

---

## Slide 2
Here’s some math: $E = mc^2$

---

## Slide 3
Background images, etc.
</section>
    `;
    if (slidesRef.current && revealRef.current) {
      slidesRef.current.innerHTML = markdown;

      const deck = new Reveal(revealRef.current, {
        plugins: [RevealMarkdown, RevealMath.KaTeX], // or MathJax
      });
      deck.initialize();
    }
  
    return () => {
    if (deck) {
      deck.destroy(); // removes event listeners, resets DOM mutations
    }
    if (revealRef.current) {
      revealRef.current.innerHTML = "";
    }
    document.body.removeAttribute("style");
    document.documentElement.removeAttribute("style");
  };
    // Extra safety: reset body background
    // document.body.style.background = "";
  }, []);

  return (
    <>
      <Navbar />
      <div className="reveal" ref={revealRef} style={{ height: '100vh' }}>
        <div className="slides" ref={slidesRef}></div>
      </div>
    </>
  );
}
