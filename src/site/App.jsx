import React from "react"
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./components/AppRoutes";
import MathJaxProvider from "./components/MathJaxProvider";

export default function App() {
  
  return (
    
    <BrowserRouter basename={import.meta.env.DEV ? "/" : "/partitions"}>
      <MathJaxProvider>
        <AppRoutes />
      </MathJaxProvider>
    </BrowserRouter>
  );
}