import React from "react"
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./components/AppRoutes";

export default function App() {
  
  return (
    
    <BrowserRouter basename={import.meta.env.DEV ? "/" : "/partitions"}>
      <script defer src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js"></script>
      <AppRoutes />
    </BrowserRouter>
  );
}