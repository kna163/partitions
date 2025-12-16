import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Littlewood from '../pages/Littlewood';
import Basic from '../pages/Basic';
import Visual from '../pages/Visual';
import Sample from '../pages/Sample';
import Notes from '../pages/Notes';
import Docs from '../pages/Docs';

import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/littlewood" element={<Littlewood />} />
      <Route path="/basic" element={<Basic />} />
      <Route path="/visual" element={<Visual />} />
      <Route path="/sample" element={<Sample />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/docs" element={<Docs />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}