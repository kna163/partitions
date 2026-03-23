import { useEffect, useRef, useState } from 'react';
import './TOC.css'

export default function TOC() {
  const sections = useRef([]);
  const [active, setActive] = useState(null);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };

  useEffect(() => {
    // discover sections once
    sections.current = [...document.querySelectorAll('section[id]')].map(
      (s) => ({
        id: s.id,
        title: s.querySelector('h2,h3')?.textContent ?? s.id,
        el: s,
      })
    );

    // initial hash jump
    const hash = location.hash.slice(1);
    if (hash) document.getElementById(hash)?.scrollIntoView();

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
            history.replaceState(null, '', `#${e.target.id}`);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.current.forEach((s) => obs.observe(s.el));
    return () => obs.disconnect();
  }, []);

  return (
    <aside className="toc">
      <ul>
        {sections.current.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => scrollTo(s.id)}
              className={active === s.id ? 'active' : ''}
            >
              {s.title}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
