import Navbar from "../components/Navbar.jsx";
import DrawSlides from "../components/DrawSlides.jsx";

import { useEffect, useRef, createRef } from "react";
import RevealMarkdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealMath from "reveal.js/plugin/math/math.esm.js";


import RevealWrapper from "../components/RevealWrapper.jsx";
// Make sure reveal.js is installed with npm for the following imports to work
// Plugins
import RevealNotes from 'reveal.js/plugin/notes/notes';
import RevealZoom from 'reveal.js/plugin/zoom/zoom';


export default function Littlewood() {
  const ncanvases = 30;
  const canvasRefs = useRef([...Array(ncanvases)].map(() => createRef()));
  let canvases = canvasRefs.current;

return (
    <>
      <Navbar />
      <div style={{height:"90vh", width:"100%"}}>
       <RevealWrapper>
        <section>
          <h3> The Littlewood decomposition</h3>
            <p className="fragment">A story of how to go from this...</p>
            <canvas className = "fragment" ref={canvases[0]} width={180} height={180} />
            <p className="fragment">to this</p>
            <canvas className = "fragment" ref={canvases[1]} width={300} height={100} />
        </section>
        <section>
          <h3>Contents</h3>
          <ul>
            <li className="fragment">A counting problem...</li>
            <li className="fragment">Littlewood Decomposition & Examples</li>
            <li className="fragment">Revisiting a problem...</li>
            <li className="fragment">Proof & Construction</li>
            <li className="fragment">Connections to Representation Theory</li>
            {/* <li className="fragment"><strong>Addendum</strong> - A question revsisited</li> */}
          </ul>
        </section>
        <section key="0">
          <h3>A problem...</h3>
          <div className="fragment">
            <p style={{marginTop: "0", fontSize: "20pt"}}>Imagine you have \(n\) crates pushed up into a corner and your extra-wide forklift can only remove exactly two adjacent boxes at a time.</p> 
            <canvas ref={canvases[2]} width={300} height={200} />
          </div>
          <div className="fragment">
            <p style={{marginTop: "0", fontSize: "20pt"}}>When can you remove all crates such that it's always pushed up against the walls?</p>
            <canvas ref={canvases[3]} width={300} height={180} />

          </div>

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
            <div className="fragment">
              <p>\(n=2\)</p>
              <canvas ref={canvases[4]} width={240} height={100} />
            </div>
            <div className="fragment">
              <p>\(n=4\)</p>
              <canvas ref={canvases[5]} width={300} height={180} />
            </div>
          </section>
          <section key="1-2">
            <h3>\(n=6\)</h3>
            <canvas ref={canvases[6]} width={1000} height={200} />
            <p> Uh oh...</p>
            <canvas ref={canvases[7]} width={300} height={200} />
          </section>
        </section>
        <section key="2">
          <h3>What characterizes failure?</h3>
          <p className="fragment">The main reason why this configuration for \(n=6\) fails is that you can't start removing any boxes from the "staircase" portion!</p>
          <p className="fragment">Any triangular number {String.raw`\(n=\frac{k(k-1)}{2}\)`} with its namesake configuration will fail!</p>
          <canvas ref={canvases[8]} width={300} height={200} />
        </section>
        <section>
          <h3>What characterizes failure?</h3>
          <p className="fragment">If you start with some boxes and remove boxes when you can until you end up in a staircase pattern, was a mistake made along the way?</p>
          <canvas ref={canvases[9]} width={300} height={200} />
        </section>
        <section key="3">
          <h3>What characterizes failure? - Balance!</h3>
          <p className="fragment">Apply a chess board pattern!</p>
          <canvas ref={canvases[10]} width={300} height={180} />
          <p className="fragment">Obviously if it's unbalanced, you won't be able to finish, each domino is balanced!</p>
          <canvas ref={canvases[11]} width={200} height={120} />
          
        </section>
        <section>
          <h3>What characterizes failure? - Balance!</h3>
          <p className="fragment">What if it's balanced? Consider the boundary, if there's a pair of squares we can remove, remove it! If not, then it must be a staircase pattern, which isn't balanced, so this case never happens! This shows you can't 'mess up' along the way!</p>
          <canvas ref={canvases[12]} width={300} height={250} />
        </section>

        <section key="4">
          <h3>Probability of failure?</h3>
            <p className="fragment">If \(n\) is large and even, and we randomly pick one of the configurations of \(n\) boxes uniformly, what roughly are the odds that we can finish the job?</p>
            <p className="fragment">Generally, hard to count!
              {String.raw` \(\quad {\tiny \begin{array}{|c|c|c|} \hline n & P(\text{possible})  \\ \hline 40 & \frac{24842}{37338} \approx 66.5\% \\ 50 & \frac{129512}{204226} \approx 63.4\% \\ 60 & \frac{585128}{966467} \approx 60.5\% \\ 100 & \frac{103679156
  }{190569292} \approx 54.4\% \\ \hline\end{array}}\)`} </p>
              {/* For \(n=40,50,60,100\), respectively, this is {String.raw`\(\frac{24842}{37338} \approx 66.5\%,\)`} {String.raw`\(\frac{129512}{204226} \approx 63.4\%\)`} {String.raw`\(\frac{585128}{966467} \approx 60.5\%\)`}, and finally {String.raw`\(\frac{103679156
  }{190569292}\approx 54.4\%\)`}</p> */}
            <p className="fragment">Turns out, probability goes to zero and is {String.raw`\(O\left(\frac{1}{\sqrt[4]{n}}\right)\)`}!</p>
            <p className="fragment">Proof of this contained in notes!</p>
          {/* <section key="4-1">
            <p> We cheat a bit and use future knowledge! This is counting the number of partitions of \(n\) with empty \(2\)-core. From the Littlewood decomposition, this is the number of pairs of partitions which sum to \(n/2\).</p>
            <p class="fragment">The generating function of the partition function is {String.raw`\(P(X)=\prod_{i=1}^\infty (1+X^i+X^{2i}+\cdots) = \prod_{i=1}^\infty \frac{1}{1-X^i}\)`}, so the generating function for pairs of partitions is just \(P(X)^2\)</p>
            <p class="fragment">Meinardus (Asymptotische Aussagen über Partitionen 1954) Consider the product {String.raw`\[f(X) = \prod_{i=1}^\infty \frac{1}{(1-X^i)^{a_n}}\] = 1 + \sum_{i=1}^\infty r(n)X^i`}. If the Dirichlet series {String.raw`D(s) = \sum_{i=1}^\infty a_n n^{-2}`} converges for.</p>
          </section> */}
        </section>
        <section>
          <h3>Thus far...</h3>
          <ul>
            <li className="fragment">Took problem about removing boxes and turned it into a problem of balanced squares</li>
            <li className="fragment">The main obstruction from succeeding in task were cases in which you can't remove a single one. The coloring shows that the order you try to remove things in doesn't matter.</li>
            <li className="fragment">There is probably an efficient way to count the number of "good" configurations of \(n\) boxes out of all of them...</li>
            <li className="fragment">No mention of Littlewood Decomposition...</li>
          </ul>
        </section>
        <section>
          <h3>Soon...</h3>
          <ul>
            <li className="fragment">Introduce some definitions and state the Littlewood decomposition!</li>
            <li className="fragment">Define bi-infinite \(01\) sequences and working with hooks</li>
            <li className="fragment">Give algorithms for the decomposition</li>
            <li className="fragment">Talk about connections to representation theory!</li>
          </ul>
        </section>

        <section key="5">
          <h3>Partitions!</h3>
          <p className="fragment"> We've been working with <strong>partitions</strong> this entire time!</p>
          <div className="fragment">
            <p>The partition \(\lambda = (5,3,1,1)\), generally \(\lambda = (a_1,\ldots), \ a_1 \geq a_2 \cdots\)</p>
            <canvas ref={canvases[13]} width={200} height={140} />
          </div>
          <p className="fragment">Write \(\lambda \vdash n = \sum a_i\)</p>
          {/* <p className="fragment"> \(\lambda = (a_1,\ldots,a_k)\) is a <strong>partition</strong>  of \(n\) if the \(a_i\) are decreasing and all positive and sum to \(n\), written as \(|\lambda| = n\). Evidently, we've been discussing partitions all this time! These corresponding images are referred to as the <strong>Young diagram</strong> of \(\lambda\) where the \(i\)th row has \(a_i\) boxes.</p>
          <p className="fragment"> \(\lambda\) is a \(t\)-core if there is no way to remove precisely \(t\) contiguous tiles from the border such that the resulting shape is a partition.</p>
          <p className="fragment"> The Littlewood decomposition says that for every \(t \ge 2\), there is a bijective map between \(\lambda\) and tuples of the form \((\lambda_c,(\lambda_1,\ldots,\lambda_t))\) where \(\lambda_c\) is a \(t\)-core and the \(\lambda_i\) are partitions. This bijection satisfies {String.raw`\(\frac{|\lambda| - |\lambda_c|}{t} = \sum_i |\lambda_i|\)`}.</p> */}
        </section>

        <section key="6">
          <h3>Rim Hooks</h3>
          <p className="fragment">A rim hook of length \(t\) is a connected set of \(t\) boxes which intersects the border such that removing it gives another partition. Our dominos were \(2\)-hooks!</p>
          <div style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center", // optional: center canvases horizontally
      gap: "60px" // space between canvases
    }}>
            <div className="fragment">
              <canvas ref={canvases[14]} width={300} height={120} />
              <p>A \(6\) and a \(3\)-rim hook.</p>
            </div>
            <div className="fragment">
              <canvas ref={canvases[15]} width={300} height={120} />
              <p>Non-examples</p>
            </div>
          </div>
        </section>
        <section>
          <h3> The \(t\)-core</h3>
          <p className="fragment">The \(t\)-core of a partition \(\lambda\) is the result of removing \(t\)-rim hooks until you can't remove any more.</p>
          <canvas ref={canvases[16]} width={330} height={240} />
          <p className="fragment"> The \(3\)-core of \(\lambda=(10,5,5,2,2)\) is \(\lambda^c = (4,2)\) (remove orange, then blue, then purple)</p>
        </section>
        <section>
          <h3> The \(t\)-core</h3>
          <p className="fragment">For \(t=2\) we know that the \(2\)-core of \(\lambda\) measures the black/white imbalance and is a staircase configuration.</p>
          <p className="fragment">Earlier counting problem is just number of partitions of \(n\) with empty \(2\)-core!</p>
          <p className="fragment">Also know that the order of removing \(2\)-rim hooks doesn't matter in this case. This generalizes...</p>
          <p className="fragment">With this terminology, can finally state the <strong>Littlewood decomposition</strong>!</p>
        </section>
        <section>
          <h3>The Littlewood Decomposition</h3>
          <p className="fragment">Let \(t \ge 1\) be fixed, then for any partition \(\lambda\), it can be uniquely decomposed into its \(t\)-core, \(\lambda^c\), and \(t\) many partitions called the \(t\)-quotient, \(\lambda^1,\ldots,\lambda^t\) such that \(|\lambda| = |\lambda^c| + t(|\lambda^1| + \cdots + |\lambda^t|)\)</p>
          <p className="fragment">Conversely, for a \(t\)-core \(\lambda^c\) and any \(t\) many partitions \(\lambda^1,\ldots,\lambda^t\), there exists a unique partition \(\lambda\) with \(\lambda^c,(\lambda^1,\ldots,\lambda^t)\) as its corresponding decomposition.</p>
          <p className="fragment">Gives a way of counting number of partitions with empty \(2\)-core!</p>
        </section>

        <section>
          <h3>The Littlewood Decomposition</h3>
          <p className="fragment">Thus far, abstract bijection...</p>
          <p className="fragment">Can compute \(t\) core, but don't know if our algorithm of just removing any \(t\)-rim hook works...</p>
          <p className="fragment">What is the "correct" \(t\)-quotient for \(\lambda\)?</p>
          <p className="fragment">How to reconstruct \(\lambda\) from the decomposition?</p>
          <p className="fragment">Answer: \(01\)-sequences!</p>
        </section>

        <section>
          <h3>\(01\)-Sequences</h3>
          <p>For \(\lambda\), imagine putting \(0\)s and \(1\)s along the border with \(0\) if it is a vertical segment and \(1\) otherwise. Starting from the bottom left gives the \(01\)-sequence \(s_\lambda\).</p>
          <canvas ref={canvases[17]} width={330} height={240} />
          <p>Replace infinite \(0\)s, \(1\)s with \(\bar0,\bar1\). \(\lambda=(7,6,4,4,2,1)\) has \(s_\lambda = \bar0 1010110011010 \bar1\).</p>
        </section>

        <section>
          <h3>Indexing \(01\)-Sequences</h3>
          <p> We want to index it! The line \(y=-x\) seperates the negative indices from the non-negatives.</p>
          <canvas ref={canvases[18]} width={330} height={240} />
          <p>{String.raw`\(s_0=s_1=0, s_2=s_3=1, s_{-1}=1\)`}.</p>
          <p>Use a bar to note where the seperation is, e.g. \(s=\bar0 101011|0011010\bar1\)</p>
        </section>

        <section>
          <h3>Indexing \(01\)-Sequences</h3>
          <p>Check: \(0\)th index is the place where the # of \(1\)s strictly to the left is equal to the # of \(0\)s at that place and to the right.</p>
          <p>Will use indexing in a bit...</p>
          <canvas ref={canvases[27]} width={330} height={240} />
        </section>

        <section>
          <h3>\(01\)-Sequences</h3>
          <p>What happens when we modify the sequence and swap a \(10\) for a \(01\)?</p>
          <canvas ref={canvases[19]} width={330} height={240} />
          <p>This just removes one box...</p>
        </section>
        <section>
          <h3>\(01\)-Sequences</h3>
          <p>What happens when we modify the sequence and swap {String.raw`\(s_i=1,s_{i+t}=0\)`} with {String.raw`\(s_i=0,s_{i+t}=1\)`}?</p>
          <canvas ref={canvases[20]} width={330} height={240} />
          <p>This removes a \(t\)-rim hook!</p>
          <p>Want to induct on \(t\) with base case \(t=1\)...</p>
        </section>

        <section>
          <h3>\(01\)-Sequences</h3>
          <p>Two cases: either segment is {String.raw`\(1\underbrace{1\cdots 1}_{t-1}0\)`} or there's some \(a\) with {String.raw`\((s_i,s_{i+a},s_{i+t})=(1,0,0)\)`}</p>
          <p>First case: {String.raw`\(1\underbrace{1\cdots 1}_{t-1}0\)`}</p>
          <canvas ref={canvases[21]} width={330} height={240} />
        </section>

        <section>
          <p>Second case: There's some \(a\) with {String.raw`\((s_i,s_{i+a},s_{i+t})=(1,0,0)\)`}</p>
          <canvas ref={canvases[22]} width={330} height={240} />
          <p>Removing \(a\)-rim hook and adjacent \((t-a)\)-rim hook is same as removing a \(t\)-rim hook!</p>
        </section>

        <section>
          <h3>\(t\)-core via \(01\)-sequences</h3>
          <p>Algorithm: keep on swapping {String.raw`\(s_i=1,s_{i+t}=0\)`} with {String.raw`\(s_i=0,s_{i+t}=1\)`}!</p>
          <p>These swaps never affect indexing. Two cases to check \(i,i+t\) are on the same side or straddles the line \(y=-x\).</p>
          <p>Can compute \(t\)-core on large enough finite segment \(s'\). \(\#(s_j=1 \ | \ j \equiv a \mod t, s_j \in s')\) is preserved under swaps, shows order of removing \(t\)-rim hooks doesn't matter for finding \(t\)-core!</p>
        </section>

        <section>
          <h3>\(t\)-quotient via \(01\)-sequences</h3>
          <p>Algorithm: \(a\)th \(t\)-quotient, \(\lambda^a\) is defined by subsequence {String.raw`\(\{s_i \ | \ i \equiv a \mod t\}\)`}.</p>
          <p> \(t=3, \lambda = (9,4,4,4,4,3,2,1)\), \(\lambda^0,\lambda^1,\lambda^2\) are purple, orange, blue (as per indexing).</p>
          <canvas ref={canvases[23]} width={330} height={300} />
          <canvas ref={canvases[24]} width={330} height={300} />
        </section>

        <section>
          <p>Removing a square from \(\lambda^a\) removes a \(t\)-rim hook from \(\lambda\), so \(\lambda^a\) corresponds to \(t|\lambda^a|\) squares of \(\lambda\)</p>
          <p>This gives us the size relation \(|\lambda| = |\lambda^c| + t\sum_a |\lambda^a|\) from earlier. </p>
          <canvas ref={canvases[25]} width={330} height={300} />
          <canvas ref={canvases[26]} width={330} height={300} /> {/*idx 27 is copy of */}
        </section>

        <section>
          <h3>Decomposition Summary</h3>
          <p> Essentially, to get \(\lambda^c\), just keep on swapping {String.raw`\(s_i=1,s_{i+t}=0\)`} with {String.raw`\(s_i=0,s_{i+t}=1\)`}. The \(t\)-quotient is formed by reading off every \(t\)th element.</p>
        </section>

        <section>
          <section>
            <h3>Going backwards...</h3>
            <p>The \(t\)-quotient almost gives the entire sequence of \(\lambda\)...</p>
            <p>Main issue is the quotient is shifting agnostic ({String.raw`\(s_{tn} \mapsto s_{t+tn}\)`} would give the same quotient*)</p>
            <p>\(t\)-core should give data on how much to shift each quotient sequence by when reconstructing \(\lambda\)...</p>
          </section>
          <section>
            <h3>Going backwards...</h3>
            <p>The example in being "shifting agnostic" is a bit incomplete as this would cause the indexing to change. A proper one is {String.raw`\(s_{tn} \mapsto s_{t+tn}, \ s_{1+tn} \mapsto s_{1-t+tn}\)`}, as the two changes in indexing that each map would make cancel out.</p>
            <p>In terms of the next section, this proper example corresponds to the \(t\)-core \(\lambda^c=(1)\) with vector {String.raw`\((1,\underbrace{0}_{t-2},-1)\)`}.</p>
          </section>
        </section>

        <section>
          <h3>\(t\)-cores and vectors</h3>
          <p>Suppose \(\lambda\) is a \(t\)-core, and let \(s_\lambda\) be the sequence, define {String.raw`\(v=(n_0,\ldots,n_{t-1})\)`} where \(n_i\) is the smallest {String.raw`\(n \in \mathbb{Z}\)`} such that {String.raw`\(s_{i+tn} = 1\)`}.</p>
          <p>Since \(\lambda\) is a \(t\)-core, {String.raw`\(s_{i+t(n_i+k)}=1\)`} for all \(k \ge 0\)</p>
          <p>\(\lambda = (3,1)\) is a \(3\)-core with sequence \(\bar0 10|110\bar1\) and vector \(v=(0,-1,1)\)</p>
        </section>

        <section>
          <h3>\(t\)-cores and vectors</h3>
          <p>Due to how indexing is defined, \(\sum n_i = 0\) since \(n_i\) contributes \(n_i\) \(0\)s to the right of the bar.</p>
          <p>There is a bijection between \(t\)-cores and vectors of length \(t\) which sum to \(0\).</p>
        </section>

        <section>
          <h3>Reconstruction</h3>
          <p>Algorithm: Let {String.raw`\(\lambda^c \sim (n_0,\ldots,n_{t-1})\)`} and {String.raw`\(\lambda^i \sim s^i=s_{\lambda^i}\)`}, define new sequence \(s\) by the following:</p>
          <p>{String.raw`\(s_{i+tk} = s^i_{k-n_i}\)`}. This shifts \(s^i\) by \(n_i\) places to the right.</p>
          <p>Want to show that it's the inverse of previous algorithm.</p>
        </section>

        <section>
          <h3>Reconstruction</h3>
          <p>{String.raw`\(s_{i+tk} = s^i_{k-n_i}\)`}</p>
          <p>Clear that it gives back the same quotient; only need to check that it gives the right core.</p>
          <p>Removing all \(t\)-rim hooks converts \(s^i\) into \(\bar{0}\bar{1}\); reduces to bijection between cores and vectors.</p>
        </section>

        <section>
          <p>Finally done with Littlewood decomposition!</p>
          <ul>
            <li>Gave algorithms for decomposition, reconstruction</li>
            <li>Made it easier to formulate initial problem and count</li>
          </ul>
          <p>Going to give some remarks on representation theory...</p>
        </section>

        <section>
          <h3>What is Representation Theory?</h3>
          <p>Essentially, study of a group \(G\) via linear algebra (or modules)...</p>
          <ul>
            <li>Assign each \(g \in G\) an \(n \times n\) matrix \(\rho_g\) with {String.raw`\(\rho_{gh}=\rho_g\rho_h\)`}. This is a <strong>representation</strong> of \(G\).</li>
            <li>If {String.raw`\(W\subseteq \mathbb{C}^n\)`} has \(\rho_gW \subseteq W\) for all \(g\), then {String.raw`\(W \oplus V \cong \mathbb{C}^n\)`} and find representations \(\phi_g,\psi_g\) so that \(\rho_g = \phi_g \oplus \psi_g\). </li>
          </ul>
        </section>

        <section>
          <h3>What is Representation Theory?</h3>
          <ul>
            <li>For any finite group, "decomposing" eventually stops. These minimal \(W\) are <strong>irreducible representations</strong>, finite groups only have finitely many.</li>
            <li>Usually want to think in terms of irreducibles.</li>
          </ul>
        </section>

        <section>
          <h3>Partitions and \(S_n\)</h3>
          <p>Let \(S_n\) be the symmetric group on \(n\) points, that is, the set of bijections {String.raw`\(\{1,\ldots,n\} \to \{1,\ldots,n\}\)`}</p>
          <p>Number of conjugacy classes equals number of irreducibles (general fact). For \(S_n\), conjugacy classes can be indexed by \(\lambda \vdash n\).</p>
          <p>For each \(\lambda\), can construct irreducible reps \(\rho_\lambda\) using <strong>induction</strong> and <strong>restriction</strong>!</p>
        </section>

        <section>
          <h3>Partitions and \(S_n\)</h3>
          <p>In representation theory, <strong>induction</strong> and <strong>restriction</strong> give ways of getting representations on \(G\) from a subgroup \(H\) (or vice versa). Irreducibles don't necessarily give rise to other reducibles.</p>
          <p><strong>Young's branching rule:</strong> For \(S_n\), can easily find relationships between induced/restricted reps by looking at when one partition's diagram contains another. </p>
        </section>

        <section>
          <h3>Modular representation theory</h3>
          <p>Instead of working over {String.raw`\(\mathbb{C}\)`} (where theory is simpler), what happens if you work over some field (alg. closed) \(K\) of positive characteristic \(p\) (i.e. \(1 \cdot p = 0\))?</p>
          <p>If \(p \nmid |G|\), basically nothing changes, otherwise if \(p \mid |G|\), interesting things can happen!</p>
          <p>Main thing is over {String.raw`\(\mathbb{C}\)`} finding a subrepresentation (\(W\) with \(\rho_gW \subseteq W\)) means you can rewrite as direct sum; no longer true!</p>
        </section>

        <section>
          <h3>Modular representation theory</h3>
          <p>Irreducible: no subrepresentations, Indecomposable: not a direct sum, over characteristic \(p \mid |G|\), no longer the same!</p>
          <p>Over \(K\), indecomposables still aren't that nice, instead want to consider chains of subrepresentations whose quotients are irreducibles</p>
          <p>These quotients or <strong>composition factors</strong> are the "correct" building blocks.</p>
        </section>

        <section>
          <h3>Modular representation theory</h3>
          <p>Number of irreducibles is the number of conjugacy classes \(C\) such that \(g \in C\) has \(p \nmid |g|\).</p>
          <p>What happens to our irreducibles over {String.raw`\(\mathbb{C}\)`} if we 'read them' over \(K\) instead? Block theory answers this!</p>
        </section>

        <section>
          <h3>Block theory</h3>
          <p>What are the blocks?</p>
          <p>Regular representation (dim \(|G|\) vector space, {String.raw`\(\rho_g e_h=e_{gh}\)`}) over \(K\) splits into direct sum of indecomposable <strong>blocks</strong></p>
          <p>No two blocks share composition factors!</p>
          <p>Each of the irreducibles over {String.raw`\(\mathbb{C}\)`} have their composition factors contained entirely inside one block</p>
        </section>

        <section>
          <h3>Back to \(S_n\)</h3>
          <p>(Nakayama's Conjecture (proven)) Let \(\lambda, \mu \vdash n\), then \(\rho_\lambda, \rho_\mu\) belong to the same block if and only if they have the same \(p-\)core. </p>
          <p>(Brauer-Nesbitt) If \(\lambda \vdash n\) is a \(p\)-core, then \(\rho_\lambda\) is also an irreducible representation over \(K\) and the block is isomorphic to \(\rho_\lambda\)</p>
          <p>\(p\)-quotient also contains some information about representations but even more complicated...</p>
        </section>

        <section>
          <h3>Applications:</h3>
          <ul>
            <li>(Young's Branching, Nakayama) Can take \(\lambda,\mu \vdash n+1\), then restrict \(\rho_\lambda,\rho_\mu\), restrict it to \(S_n\) and determine if they have common composition factors</li>
            <li>(Nakayama, Littlewood decomp)Can count the number of irreducibles of \(S_n\) (over {String.raw`\(\mathbb{C}\)`}) which belong to a particular block \(\lambda^c\).</li>
          </ul>
          <p>Main References: "The Representation Theory of the Symmetric Group" James-Kerber. (Block theory) "Representation Theory of Finite Groups and Associative Algebras" Curtis-Reiner</p>
        </section>

      </RevealWrapper>
      </div>
      <DrawSlides canvases={canvases} />
    </>
  )

  
}
