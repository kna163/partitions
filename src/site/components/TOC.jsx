import { useEffect, useRef, useState } from 'react';

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
    <aside className="sticky top-6 w-56 text-sm">
      <ul className="space-y-2">
        {sections.current.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => scrollTo(s.id)}
              className={`w-full text-left px-2 py-1 rounded ${
                active === s.id ? 'font-bold bg-gray-100' : ''
              }`}
            >
              {s.title}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
