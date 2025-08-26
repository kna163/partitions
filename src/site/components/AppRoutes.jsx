import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Basic from '../pages/Basic';
import Visual from '../pages/Visual';
import Sample from '../pages/Sample';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/basic" element={<Basic />} />
      <Route path="/visual" element={<Visual />} />
      <Route path="/sample" element={<Sample />} />
    </Routes>
  );
}