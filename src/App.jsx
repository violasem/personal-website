import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { about, education, log, logTypes, profile, skills, timeline } from "./content.js";

const NOTION_URL = "https://lopsided-passbook-280.notion.site/ebd//2ed826ec6ca8800ab28edaef165b6909";
const SPOTIFY_URL = "https://open.spotify.com/embed/playlist/1vHnZpoh3TbeXlvnFfp7Uf?utm_source=generator";

const navItems = [
  { href: "#/log", label: "Project log" },
  { href: "#/experience", label: "Experience" },
  { href: "#/education", label: "Education" },
  { href: "#/about", label: "About" },
  { href: "#/notes", label: "Notes" },
];

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Hash routes work on any host, with no server setup: #/log/<slug>, #/notes, or a home section.
const parseRoute = () => window.location.hash.replace(/^#\/?/, "");

const useRoute = () => {
  const [route, setRoute] = useState(parseRoute);
  useEffect(() => {
    const onChange = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
};

// Sections fade in the first time they scroll into view.
const useReveal = (key) => {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal:not(.in)");
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);
};

// Tracks which section you're reading, so the top menu can underline it.
const useCurrentSection = (enabled) => {
  const [current, setCurrent] = useState(null);
  useEffect(() => {
    if (!enabled) {
      setCurrent(null);
      return;
    }
    const ids = ["log", "experience", "education", "about"];
    const onScroll = () => {
      let found = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) found = id;
      }
      setCurrent(found);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);
  return current;
};

// A few small hearts, only when someone pets the dog or boops the portrait.
const burstHearts = (x, y, count = 4) => {
  if (prefersReducedMotion()) return;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
    const distance = 30 + Math.random() * 34;
    heart.className = "burst-heart";
    heart.textContent = "♥";
    heart.setAttribute("aria-hidden", "true");
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${10 + Math.random() * 7}px`;
    heart.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    heart.addEventListener("animationend", () => heart.remove());
    document.body.appendChild(heart);
  }
};

const ExternalLinks = ({ links }) => (
  <div className="text-links">
    {links.map((l) => (
      <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer">
        {l.name}
      </a>
    ))}
  </div>
);

const Chevron = () => (
  <svg className="chevron" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TypeLabel = ({ type }) => <span className={`type type-${type.toLowerCase()}`}>{type}</span>;

// The dog follows your cursor along the bottom of the screen. Click it to pet it.
const Puppy = () => {
  const rootRef = useRef(null);
  const [pets, setPets] = useState(0);
  const [saying, setSaying] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || prefersReducedMotion()) return;

    const clamp = (value) => Math.max(8, Math.min(window.innerWidth - 80, value));
    let x = 24;
    let target = 24;
    let frame;

    // the dog trails behind the cursor, so it never sits on top of what you're clicking
    const onMove = (e) => {
      if (e.pointerType === "mouse") target = clamp(e.clientX - 96);
    };
    const onDown = (e) => {
      if (e.pointerType !== "mouse") target = clamp(e.clientX - 36);
    };

    const tick = () => {
      const gap = target - x;
      x += Math.max(-3, Math.min(3, gap * 0.05));
      el.style.transform = `translateX(${x}px)`;
      el.classList.toggle("walking", Math.abs(gap) > 6);
      if (Math.abs(gap) > 6) el.classList.toggle("flip", gap < 0);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!saying) return;
    const t = setTimeout(() => setSaying(false), 1100);
    return () => clearTimeout(t);
  }, [saying, pets]);

  const pet = (e) => {
    setPets((n) => n + 1);
    setSaying(true);
    burstHearts(e.clientX || 60, e.clientY || window.innerHeight - 50, 4);
  };

  return (
    <div className="puppy" ref={rootRef} style={{ transform: "translateX(24px)" }}>
      {saying && <span className="puppy-says">woof</span>}
      <button type="button" className="puppy-button" aria-label="Pet the dog" onClick={pet}>
        <svg key={pets} className={pets ? "puppy-svg hop" : "puppy-svg"} viewBox="0 0 76 62" width="68" height="55" aria-hidden="true">
          <g className="tail">
            <path d="M18 32 C10 30 6 24 8 16" fill="none" stroke="#27303b" strokeWidth="6" strokeLinecap="round" />
            <path d="M18 32 C10 30 6 24 8 16" fill="none" stroke="#d9bd9b" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g stroke="#27303b" strokeWidth="1.8">
            <rect className="leg leg-b" x="27" y="40" width="7" height="17" rx="3.5" fill="#c6a988" />
            <rect className="leg leg-b" x="49" y="40" width="7" height="17" rx="3.5" fill="#c6a988" />
            <rect className="leg leg-a" x="19" y="40" width="7" height="18" rx="3.5" fill="#d9bd9b" />
            <rect className="leg leg-a" x="41" y="40" width="7" height="18" rx="3.5" fill="#d9bd9b" />
          </g>
          <g className="puppy-top">
            <rect x="15" y="24" width="42" height="23" rx="11.5" fill="#d9bd9b" stroke="#27303b" strokeWidth="1.8" />
            <circle cx="54" cy="20" r="14.5" fill="#d9bd9b" stroke="#27303b" strokeWidth="1.8" />
            <ellipse cx="62" cy="25" rx="8" ry="5.5" fill="#f1e6d8" stroke="#27303b" strokeWidth="1.4" />
            <ellipse cx="68" cy="22.5" rx="2.8" ry="2.2" fill="#27303b" />
            <path d="M61 28 q3 2.5 6 0" fill="none" stroke="#27303b" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="56" cy="17" r="2" fill="#27303b" />
            <circle cx="56" cy="17" r="4.8" fill="none" stroke="#27303b" strokeWidth="1.4" />
            <path d="M60.8 16.5 h4" stroke="#27303b" strokeWidth="1.4" strokeLinecap="round" />
            <path className="ear" d="M46 9 C38 9 36 22 40 30 C44 33 48 28 48 20 C48 15 48 11 46 9 Z" fill="#755a42" stroke="#27303b" strokeWidth="1.8" strokeLinejoin="round" />
          </g>
        </svg>
      </button>
    </div>
  );
};

const ScrollProgress = () => {
  const barRef = useRef(null);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return <span className="scroll-progress" ref={barRef} aria-hidden="true" />;
};

const TopBar = ({ route, current }) => (
  <header className="topbar">
    <div className="topbar-inner">
      <a className="brand" href="#/">
        {profile.name}
      </a>
      <nav aria-label="Main">
        {navItems.map((n) => {
          const id = n.href.slice(2);
          const active = current ? current === id : route === id || (id === "log" && route.startsWith("log/"));
          return (
            <a key={n.href} href={n.href} aria-current={active ? "page" : undefined}>
              {n.label}
            </a>
          );
        })}
      </nav>
    </div>
    <ScrollProgress />
  </header>
);

// --- the banner's solar wind line: it draws itself in, bends around the cursor, and ripples on click ---
const SolarWind = ({ heroRef }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    const reduced = prefersReducedMotion();
    const HEIGHT = 170;
    const BASE = 66;
    let width = 0;
    let frame;
    let visible = true;
    let pull = 0;
    let pullTarget = 0;
    let pointerX = 0;
    const ripples = [];
    const startedAt = performance.now();
    const particles = Array.from({ length: 7 }, (_, i) => ({ at: i / 7, speed: 0.035 + (i % 3) * 0.012 }));

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.clientWidth;
      canvas.width = width * ratio;
      canvas.height = HEIGHT * ratio;
      canvas.style.height = `${HEIGHT}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (reduced) draw(performance.now());
    };

    const waveAt = (x, t, layer) => {
      const phase = layer * 1.7;
      let y = BASE + layer * 17;
      y += Math.sin(x * 0.0065 + t * 0.55 + phase) * (15 - layer * 2);
      y += Math.sin(x * 0.0165 - t * 0.38 + phase * 2) * 6;
      const near = x - pointerX;
      y -= pull * (30 - layer * 8) * Math.exp(-(near * near) / (2 * 130 * 130));
      for (const r of ripples) {
        const age = t - r.t;
        const d = Math.abs(x - r.x) - age * 420;
        y -= 24 * Math.exp(-(d * d) / (2 * 55 * 55)) * Math.exp(-age * 1.5) * (1 - layer * 0.25);
      }
      return y;
    };

    const strokeLayer = (t, layer, color, lineWidth, reach) => {
      ctx.beginPath();
      for (let x = 0; x <= reach; x += 6) {
        const y = waveAt(x, t, layer);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.stroke();
    };

    function draw(now) {
      const t = (now - startedAt) / 1000;
      const progress = reduced ? 1 : Math.min(t / 1.4, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const reach = width * eased;
      pull += (pullTarget - pull) * 0.09;
      while (ripples.length && t - ripples[0].t > 3) ripples.shift();

      ctx.clearRect(0, 0, width, HEIGHT);

      // everything under the front line is the page, so the portrait disappears behind it
      ctx.beginPath();
      ctx.moveTo(0, HEIGHT);
      for (let x = 0; x <= width + 6; x += 6) ctx.lineTo(x, waveAt(x, t, 0));
      ctx.lineTo(width, HEIGHT);
      ctx.closePath();
      ctx.fillStyle = "#f7f7f5";
      ctx.fill();

      strokeLayer(t, 2, "rgba(156, 90, 100, 0.34)", 1.5, reach);
      strokeLayer(t, 1, "rgba(60, 75, 92, 0.34)", 1.5, reach);
      strokeLayer(t, 0, "#27303b", 2.5, reach);

      // particles riding the line
      ctx.fillStyle = "#9c5a64";
      for (const p of particles) {
        if (!reduced) p.at = (p.at + p.speed / 60) % 1;
        const x = p.at * width;
        if (x > reach) continue;
        ctx.beginPath();
        ctx.arc(x, waveAt(x, t, 0), 3, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced && visible) frame = requestAnimationFrame(draw);
    }

    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      pointerX = e.clientX - r.left;
      pullTarget = e.pointerType === "mouse" ? 1 : 0;
    };
    const onLeave = () => {
      pullTarget = 0;
    };
    const onDown = (e) => {
      const r = hero.getBoundingClientRect();
      ripples.push({ x: e.clientX - r.left, t: (performance.now() - startedAt) / 1000 });
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduced) return () => window.removeEventListener("resize", resize);

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("pointerdown", onDown);
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) frame = requestAnimationFrame(draw);
    });
    observer.observe(hero);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointerdown", onDown);
    };
  }, [heroRef]);

  return <canvas ref={canvasRef} className="solar-wind" aria-hidden="true" />;
};

const Sun = () => (
  <svg className="sun" viewBox="0 0 100 100" aria-hidden="true">
    <g className="sun-rays">
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="50" y1="9" x2="50" y2={i % 2 ? "16" : "20"} transform={`rotate(${i * 30} 50 50)`} />
      ))}
    </g>
    <circle cx="50" cy="50" r="22" />
  </svg>
);

const Portrait = ({ heroRef }) => {
  const [boops, setBoops] = useState(0);
  const figureRef = useRef(null);

  // the portrait leans slightly toward your cursor
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion()) return;
    const onMove = (e) => {
      if (e.pointerType !== "mouse" || !figureRef.current) return;
      const r = hero.getBoundingClientRect();
      const lean = ((e.clientX - r.left) / r.width - 0.5) * 4;
      figureRef.current.style.setProperty("--lean", `${lean.toFixed(2)}deg`);
    };
    hero.addEventListener("pointermove", onMove);
    return () => hero.removeEventListener("pointermove", onMove);
  }, [heroRef]);

  return (
    <div className="hero-figure" ref={figureRef}>
      <Sun />
      <button
        type="button"
        className="avatar-button"
        aria-label="Boop Viola's nose"
        onClick={(e) => {
          setBoops((n) => n + 1);
          burstHearts(e.clientX || 300, e.clientY || 300, 5);
        }}
      >
        <img key={boops} src="/avatar.jpeg" alt="" className={boops ? "hero-avatar booped" : "hero-avatar"} draggable="false" />
      </button>
    </div>
  );
};

const Hero = () => {
  const heroRef = useRef(null);
  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-inner">
        <div className="hero-main">
          <h1>{profile.greeting}</h1>
          <p className="hero-statement">{profile.statement}</p>
          <div className="hero-actions">
            <a className="button" href="#/log">
              See my project log
            </a>
            <ExternalLinks links={profile.links} />
          </div>
        </div>
        <Portrait heroRef={heroRef} />
      </div>
      <SolarWind heroRef={heroRef} />
    </section>
  );
};

const Facts = () => (
  <dl className="facts">
    {profile.facts.map((f, i) => (
      <div key={f.label} className="fact" style={{ "--i": i }}>
        <dt>{f.label}</dt>
        {f.lines.map((line) => (
          <dd key={line}>{line}</dd>
        ))}
      </div>
    ))}
  </dl>
);

const ProjectLog = () => {
  const [filter, setFilter] = useState("All");
  const [hovered, setHovered] = useState(null);
  const entries = filter === "All" ? log : log.filter((e) => e.type === filter);
  const active = entries.find((e) => e.slug === hovered) || entries[0];
  const filtersRef = useRef(null);
  const listRef = useRef(null);
  const [pill, setPill] = useState(null);
  const [bar, setBar] = useState(null);

  // slide the filter pill and the row marker to whatever is selected
  useLayoutEffect(() => {
    const measure = () => {
      const button = filtersRef.current?.querySelector('[aria-pressed="true"]');
      if (button) setPill({ x: button.offsetLeft, y: button.offsetTop, w: button.offsetWidth, h: button.offsetHeight });
      const row = listRef.current?.querySelector(`[data-slug="${active.slug}"]`);
      if (row) setBar({ y: row.offsetTop, h: row.offsetHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [filter, active.slug]);

  return (
    <section id="log" className="block reveal">
      <div className="block-head">
        <div>
          <h2>Project log</h2>
          <p className="block-intro">What I’ve been working on. Point at one for a preview, or open it for the full story.</p>
        </div>
        <div className="filters" role="group" aria-label="Filter projects" ref={filtersRef}>
          {pill && <span className="filter-pill" style={{ transform: `translate(${pill.x}px, ${pill.y}px)`, width: pill.w, height: pill.h }} />}
          {["All", ...logTypes].map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={filter === t}
              onClick={() => {
                setFilter(t);
                setHovered(null);
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="log-explorer">
        <div className="log-list-wrap" ref={listRef}>
          {bar && <span className="row-marker" style={{ transform: `translateY(${bar.y}px)`, height: bar.h }} />}
          <ul className="log-list" key={filter}>
            {entries.map((e, i) => (
              <li key={e.slug} style={{ "--i": i }} data-slug={e.slug}>
                <a
                  className={e.slug === active.slug ? "log-row selected" : "log-row"}
                  href={`#/log/${e.slug}`}
                  onPointerEnter={(ev) => ev.pointerType === "mouse" && setHovered(e.slug)}
                  onFocus={() => setHovered(e.slug)}
                >
                  <span className="log-text">
                    <span className="log-title">{e.title}</span>
                    <span className="log-summary">{e.summary}</span>
                    <span className="log-dates">{e.dates}</span>
                  </span>
                  <TypeLabel type={e.type} />
                  <Chevron />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <aside className="log-preview">
          <div className="preview-inner" key={active.slug}>
            <TypeLabel type={active.type} />
            <h3>{active.title}</h3>
            <p className="preview-overview">{active.overview}</p>
            {active.did && (
              <ul className="did-list">
                {active.did.map((d, i) => (
                  <li key={d} style={{ "--i": i }}>
                    {d}
                  </li>
                ))}
              </ul>
            )}
            {active.tools && <p className="preview-tools">{active.tools.join(", ")}</p>}
            <a className="preview-open" href={`#/log/${active.slug}`}>
              Open project
              <Chevron />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
};

// Each role is a line that steps up while I held it.
const toMonths = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthLabel = (months) => {
  const whole = Math.floor(months);
  return `${MONTHS[whole % 12]} ${Math.floor(whole / 12)}`;
};

const Experience = () => {
  const now = new Date();
  const nowMonths = now.getFullYear() * 12 + now.getMonth() + 1;
  const start = Math.min(...timeline.map((t) => toMonths(t.from)));
  const span = nowMonths - start;
  const xOf = (months) => ((months - start) / span) * 100;
  const [cursor, setCursor] = useState(null);
  const [open, setOpen] = useState(null);
  const axisRef = useRef(null);
  const timelineRef = useRef(null);
  const userTookOver = useRef(false);

  const ticks = [];
  for (let m = start; m <= nowMonths; m++) if ((m - start) % 3 === 0) ticks.push(m);

  const onMove = (e) => {
    userTookOver.current = true;
    const r = axisRef.current?.getBoundingClientRect();
    if (!r) return;
    const fraction = (e.clientX - r.left) / r.width;
    setCursor(fraction >= 0 && fraction <= 1 ? start + fraction * span : null);
  };

  // once the lines have drawn, the date cursor sweeps across once to show what it does
  useEffect(() => {
    const el = timelineRef.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    let frame;
    let timer;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = setTimeout(() => {
          const began = performance.now();
          const step = (time) => {
            if (userTookOver.current) return;
            const p = Math.min((time - began) / 2600, 1);
            setCursor(p < 1 ? start + p * span : null);
            if (p < 1) frame = requestAnimationFrame(step);
          };
          frame = requestAnimationFrame(step);
        }, 1500);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [start, span]);

  return (
    <section id="experience" className="block reveal">
      <div className="block-head">
        <div>
          <h2>Experience</h2>
          <p className="block-intro">Each line steps up while I held that role. Move across it to travel through time, or click a role to open it.</p>
        </div>
      </div>
      <div
        className={cursor !== null ? "timeline scanning" : "timeline"}
        ref={timelineRef}
        onPointerMove={onMove}
        onPointerLeave={() => setCursor(null)}
      >
        <div className="tl-axis">
          <div className="tl-axis-plot" ref={axisRef}>
            {ticks.map((m) => (
              <span key={m} className="tl-tick" style={{ left: `${xOf(m)}%` }}>
                {monthLabel(m)}
              </span>
            ))}
            {cursor !== null && (
              <span className="tl-cursor-label" style={{ left: `${xOf(cursor)}%` }}>
                {monthLabel(cursor)}
              </span>
            )}
          </div>
        </div>
        {timeline.map((t, i) => {
          const from = toMonths(t.from);
          const to = t.to ? toMonths(t.to) + 1 : nowMonths;
          const isActive = cursor !== null && cursor >= from && cursor < to;
          const isOpen = open === t.role;
          const entry = log.find((e) => e.slug === t.log);
          const d = `M0 21 H${xOf(from)} V5 H${xOf(to)} ${t.to ? "V21 H100" : ""}`;
          return (
            <div key={t.role} className={`tl-item${isActive ? " active" : ""}${isOpen ? " open" : ""}`} style={{ "--i": i }}>
              <button type="button" className="tl-row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : t.role)}>
                <span className="tl-name">
                  <span className="tl-role">{t.role}</span>
                  <span className="tl-org">{t.org}</span>
                </span>
                <span className="tl-plot">
                  {ticks.map((m) => (
                    <i key={m} className="tl-grid" style={{ left: `${xOf(m)}%` }} />
                  ))}
                  <svg viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true">
                    <path d={d} />
                  </svg>
                  {!t.to && <i className="tl-now" />}
                  {cursor !== null && <i className="tl-cursor" style={{ left: `${xOf(cursor)}%` }} />}
                </span>
                <span className="tl-dates">
                  {t.dates}
                  <svg className="tl-toggle" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                    <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <div className="tl-panel" inert={!isOpen}>
                <div className="tl-panel-inner">
                  <p>{entry?.summary}</p>
                  <a href={`#/log/${t.log}`}>
                    Open project
                    <Chevron />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const EducationSkills = () => (
  <section id="education" className="block two-col reveal">
    <div>
      <h2>Education</h2>
      <h3 className="edu-school">{education.school}</h3>
      <p>{education.degree}</p>
      <p className="muted">{education.dates}</p>
      <p className="muted edu-note">{education.note}</p>
      <h4>Relevant coursework</h4>
      <ul className="course-list">
        {education.coursework.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
    <div>
      <h2>Skills</h2>
      <dl className="skills">
        {skills.map((s) => (
          <div key={s.group}>
            <dt>{s.group}</dt>
            <dd>{s.items}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="block two-col about reveal">
    <div>
      <h2>About</h2>
      <p className="about-intro">{about.intro}</p>
      <p className="muted">{about.more}</p>
      <h4>Outside of work</h4>
      <p className="muted">{about.outside}</p>
      <iframe
        title="Playlist Viola is listening to on Spotify"
        className="playlist"
        src={SPOTIFY_URL}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
    <img
      src="/potrait.jpeg"
      alt="Viola in a maize shirt at Michigan Stadium after a game, with the marching band behind her"
      className="about-photo"
      loading="lazy"
    />
  </section>
);

const Home = () => (
  <>
    <Hero />
    <main className="wrap">
      <Facts />
      <ProjectLog />
      <Experience />
      <EducationSkills />
      <About />
    </main>
  </>
);

const LogDetail = ({ slug }) => {
  const index = log.findIndex((e) => e.slug === slug);
  const entry = log[index];

  if (!entry) {
    return (
      <main className="wrap detail">
        <h1 className="detail-title">Project not found</h1>
        <p className="muted">This project isn’t in the log. It may have been renamed.</p>
        <a className="back" href="#/log">
          Back to project log
        </a>
      </main>
    );
  }

  const next = log[(index + 1) % log.length];
  const facts = [
    ["Role", entry.role],
    ["Where", entry.where],
    ["With", entry.with],
    ["When", entry.dates],
  ].filter(([, value]) => value);

  return (
    <main className="wrap detail" key={entry.slug}>
      <a className="back" href="#/log">
        Back to project log
      </a>
      <TypeLabel type={entry.type} />
      <h1 className="detail-title">{entry.title}</h1>
      <p className="detail-overview">{entry.overview}</p>

      <div className="detail-grid">
        <div className="detail-body">
          {entry.did && (
            <section>
              <h2>What I did</h2>
              <ul className="did-list">
                {entry.did.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </section>
          )}
          {entry.learned && (
            <section>
              <h2>What I learned</h2>
              <p>{entry.learned}</p>
            </section>
          )}
          {entry.updates && (
            <section>
              <h2>Updates</h2>
              <ol className="updates">
                {entry.updates.map((u) => (
                  <li key={u.date + u.text}>
                    <span className="dates">{u.date}</span>
                    <span>{u.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="detail-side">
          <dl>
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            {entry.tools && (
              <div>
                <dt>Tools and methods</dt>
                <dd>{entry.tools.join(", ")}</dd>
              </div>
            )}
          </dl>
          {entry.links && (
            <div className="side-links">
              <ExternalLinks links={entry.links} />
            </div>
          )}
        </aside>
      </div>

      <a className="next-project" href={`#/log/${next.slug}`}>
        <span className="muted">Next project</span>
        <span className="next-title">
          <span>{next.title}</span>
          <Chevron />
        </span>
      </a>
    </main>
  );
};

const Notes = () => (
  <main className="wrap detail">
    <h1 className="detail-title">Notes</h1>
    <p className="detail-overview">Reflections and things I’m thinking through while I learn.</p>
    <iframe title="Viola's notes on Notion" className="notes-frame" src={NOTION_URL} width="100%" height="720" loading="lazy" allowFullScreen />
  </main>
);

export default function App() {
  const route = useRoute();
  const isDetail = route.startsWith("log/");
  const isNotes = route === "notes";
  const showsHome = !isDetail && !isNotes;
  const current = useCurrentSection(showsHome);
  const cameFromPage = useRef(false);
  useReveal(showsHome);

  useEffect(() => {
    if (isDetail) {
      const entry = log.find((e) => e.slug === route.slice(4));
      document.title = entry ? `${entry.title} | ${profile.name}` : profile.name;
    } else {
      document.title = isNotes ? `Notes | ${profile.name}` : profile.name;
    }

    const target = showsHome && route ? document.getElementById(route) : null;
    // smooth when moving around the home page, instant when arriving from another page
    if (target) target.scrollIntoView({ behavior: cameFromPage.current || prefersReducedMotion() ? "auto" : "smooth" });
    else window.scrollTo({ top: 0, behavior: "auto" });
    cameFromPage.current = !showsHome;
  }, [route, isDetail, isNotes, showsHome]);

  return (
    <div className="app">
      <TopBar route={route} current={current} />
      {isDetail ? <LogDetail slug={route.slice(4)} /> : isNotes ? <Notes /> : <Home />}
      <footer className="footer">
        <div className="wrap footer-inner">
          <span>{profile.name}</span>
          <ExternalLinks links={profile.links} />
        </div>
      </footer>
      <Puppy />
    </div>
  );
}
