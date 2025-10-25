import Navbar from "../components/Navbar.jsx";
import { useEffect, useRef } from "react";
import RevealMarkdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealMath from "reveal.js/plugin/math/math.esm.js";


import RevealWrapper from "../components/RevealWrapper.jsx";
// Make sure reveal.js is installed with npm for the following imports to work
// Plugins
import RevealNotes from 'reveal.js/plugin/notes/notes';
import RevealZoom from 'reveal.js/plugin/zoom/zoom';


export default function Littlewood() {
return (
    <>
      <Navbar />
      <div style={{height:"90vh", width:"100%"}}>
       <RevealWrapper>
        <section>
          <h3>Contents</h3>
          <ul>
            <li className="fragment"><strong>Motivation</strong> - Crates in good places</li>
            <li className="fragment"><strong>Intro to Littlewood decomposition</strong></li>
            <li className="fragment"><strong>01-sequences</strong></li>
            <li className="fragment"><strong>Proof of Littlewood decomposition</strong></li>
            <li className="fragment"><strong>Addendum</strong> - A question revsisited</li>
          </ul>
        </section>
        <section key="0">
          <h3>A problem...</h3>
          <p className="fragment">Imagine you have \(n\) crates pushed up against a wall and your extra-wide forklift can only remove exactly two adjacent boxes at a time.</p> 
          <p className="fragment">When can you remove all of the crates?</p>
        </section>
        <section key="1">
          <section key="1-0">
<h3>Easy solution?</h3>
          <p className = "fragment">Obviously, if \(n\) is odd, then it's doomed!</p> 
          <p className = "fragment"> At the very least, \(n\) needs to be even. For the first few numbers, there are only a few configurations of boxes...</p>
          <p className = "fragment"> Small calculations (↓)</p>
          </section>
          
          <section key="1-1">
            <h3>Small cases</h3> 
            <p className="fragment">\(n=2\)</p>

            <p className="fragment">\(n=4\)</p>
          </section>
          <section key="1-2">
            <h3>\(n=6\)</h3>
            <p className="fragment">\(n=6\)</p>
            <p> Uh oh...</p>
          </section>
        </section>
        <section key="2">
          <h3>What characterizes failure?</h3>
          <p className="fragment">The main reason why this configuration for \(n=6\) fails is that you can't start removing any boxes from the "staircase" portion!</p>
          <p className="fragment">Any triangular number {String.raw`\(n=\frac{k(k-1)}{2}\)`} with its namesake configuration will fail!</p>
          <p className="fragment">If you start with some boxes and remove boxes when you can until you end up in a staircase pattern, was a mistake made along the way?</p>
        </section>
        <section key="3">
          <h3>What characterizes failure? - Balance!</h3>
          <p className="fragment">Apply a chess board pattern!</p>
          <p className="fragment">Obviously if it's unbalanced, you won't be able to finish!</p>
          <p className="fragment">What if it's balanced? Then, along the boundary, there's a pair of white and black squares we can remove, and the rest is induction!</p>
        </section>

        <section key="4">
          <h3>Probability of failure?</h3>
            <p className="fragment">If \(n\) is large and even, and we randomly pick one of the configurations of \(n\) boxes uniformly, what roughly are the odds that we can finish the job?</p>
            <p className="fragment">Generally, very hard to count! For \(n=40,50,60,100\), respectively, this is {String.raw`\(\frac{24842}{37338} \approx 66.5\%,\)`} {String.raw`\(\frac{129512}{204226} \approx 63.4\%\)`} {String.raw`\(\frac{585128}{966467} \approx 60.5\%\)`}, and finally {String.raw`\(\frac{103679156
  }{190569292}\approx 54.4\%\)`}</p>
            <p className="fragment">Turns out, probability goes to zero and is {String.raw`\(O\left(\frac{1}{\sqrt[4]{n}}\right)\)`}!</p>
            <p className="fragment">Proof comes later in addendum.</p>
          {/* <section key="4-1">
            <p> We cheat a bit and use future knowledge! This is counting the number of partitions of \(n\) with empty \(2\)-core. From the Littlewood decomposition, this is the number of pairs of partitions which sum to \(n/2\).</p>
            <p class="fragment">The generating function of the partition function is {String.raw`\(P(X)=\prod_{i=1}^\infty (1+X^i+X^{2i}+\cdots) = \prod_{i=1}^\infty \frac{1}{1-X^i}\)`}, so the generating function for pairs of partitions is just \(P(X)^2\)</p>
            <p class="fragment">Meinardus (Asymptotische Aussagen über Partitionen 1954) Consider the product {String.raw`\[f(X) = \prod_{i=1}^\infty \frac{1}{(1-X^i)^{a_n}}\] = 1 + \sum_{i=1}^\infty r(n)X^i`}. If the Dirichlet series {String.raw`D(s) = \sum_{i=1}^\infty a_n n^{-2}`} converges for.</p>
          </section> */}
        </section>

        <section key="5">
          <h3>Partitions!</h3>
          <p className="fragment"> \(\lambda = (a_1,\ldots,a_k)\) is a <strong>partition</strong>  of \(n\) if the \(a_i\) are decreasing and all positive and sum to \(n\), written as \(|\lambda| = n\). Evidently, we've been discussing partitions all this time! These corresponding images are referred to as the <strong>Young diagram</strong> of \(\lambda\) where the \(i\)th row has \(a_i\) boxes.</p>
          <p className="fragment"> \(\lambda\) is a \(t\)-core if there is no way to remove precisely \(t\) contiguous tiles from the border such that the resulting shape is a partition.</p>
          <p className="fragment"> The Littlewood decomposition says that for every \(t \ge 2\), there is a bijective map between \(\lambda\) and tuples of the form \((\lambda_c,(\lambda_1,\ldots,\lambda_t))\) where \(\lambda_c\) is a \(t\)-core and the \(\lambda_i\) are partitions. This bijection satisfies {String.raw`\(\frac{|\lambda| - |\lambda_c|}{t}\) = \sum_i |\lambda_i|`}.</p>
        </section>

        <section key="6">
          <h3>\(t\)-cores</h3>
          <p className="fragment"> </p>
        </section>
      </RevealWrapper>
      </div>
      
    </>
  )

  
}
