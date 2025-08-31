import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function MathJaxProvider({ children }) {
  const location = useLocation();

  useEffect(() => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetClear?.(); // optional: clear old rendering
      window.MathJax.typesetPromise();
    }
  }, [location.pathname]);

  return children;
}
