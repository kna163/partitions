import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function MathJaxProvider({ children }) {
  const location = useLocation();
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.MathJax?.typesetPromise && containerRef.current) {
      window.MathJax.typesetPromise([containerRef.current]);
    }
  }, [location.pathname]);

  return <div ref={containerRef}>{children}</div>;
}