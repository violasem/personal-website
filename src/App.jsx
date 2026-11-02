import React, { useEffect, useRef, useState } from "react";
import { about, education, experience, log, logTypes, profile, skills } from "./content.js";

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

// --- little hearts that burst out wherever you click ---
const HEART_COLORS = ["#ff7fa8", "#ffc93c", "#8f9bff", "#ff9d6c"];

const burstHearts = (x, y, count = 6) => {
  if (prefersReducedMotion()) return;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
    const distance = 40 + Math.random() * 60;
    heart.className = "burst-heart";
    heart.textContent = "♥";
    heart.setAttribute("aria-hidden", "true");
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.color = HEART_COLORS[i % HEART_COLORS.length];
    heart.style.fontSize = `${12 + Math.random() * 14}px`;
    heart.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    heart.style.setProperty("--spin", `${(Math.random() - 0.5) * 70}deg`);
    heart.addEventListener("animationend", () => heart.remove());
    document.body.appendChild(heart);
  }
};

// --- sections pop in as you scroll to them ---
const useReveal = (dependency) => {
  useEffect(() => {
    const items = document.querySelectorAll(".pop:not(.in)");
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
      { threshold: 0.08 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [dependency]);
};

const ExternalLinks = ({ links, className = "text-links" }) => (
  <div className={className}>
    {links.map((l) => (
      <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer">
        {l.name}
      </a>
    ))}
  </div>
);

const Chevron = () => (
  <svg className="chevron" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
    <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- the tiny puppy that follows your cursor (click it to pet it) ---
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

    // the puppy trails behind the cursor, so it never sits on top of what you're clicking
    const onMove = (e) => {
      if (e.pointerType === "mouse") target = clamp(e.clientX - 96);
    };
    const onDown = (e) => {
      if (e.pointerType !== "mouse") target = clamp(e.clientX - 36);
    };

    const tick = () => {
      const gap = target - x;
      x += Math.max(-3.4, Math.min(3.4, gap * 0.05));
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
    const t = setTimeout(() => setSaying(false), 1200);
    return () => clearTimeout(t);
  }, [saying, pets]);

  const pet = (e) => {
    setPets((n) => n + 1);
    setSaying(true);
    burstHearts(e.clientX || 60, e.clientY || window.innerHeight - 50, 8);
  };

  return (
    <div className="puppy" ref={rootRef} style={{ transform: "translateX(24px)" }}>
      {saying && <span className="puppy-says">woof!</span>}
      <button type="button" className="puppy-button" aria-label="Pet the puppy" onClick={pet}>
        <svg key={pets} className={pets ? "puppy-svg hop" : "puppy-svg"} viewBox="0 0 76 62" width="72" height="59" aria-hidden="true">
          <g className="tail">
            <path d="M18 32 C10 30 6 24 8 16" fill="none" stroke="#2b2a4c" strokeWidth="6.5" strokeLinecap="round" />
            <path d="M18 32 C10 30 6 24 8 16" fill="none" stroke="#e8c49a" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g stroke="#2b2a4c" strokeWidth="2">
            <rect className="leg leg-b" x="27" y="40" width="7" height="17" rx="3.5" fill="#d4ad82" />
            <rect className="leg leg-b" x="49" y="40" width="7" height="17" rx="3.5" fill="#d4ad82" />
            <rect className="leg leg-a" x="19" y="40" width="7" height="18" rx="3.5" fill="#e8c49a" />
            <rect className="leg leg-a" x="41" y="40" width="7" height="18" rx="3.5" fill="#e8c49a" />
          </g>
          <g className="puppy-top">
            <rect x="15" y="24" width="42" height="23" rx="11.5" fill="#e8c49a" stroke="#2b2a4c" strokeWidth="2" />
            <circle cx="54" cy="20" r="14.5" fill="#e8c49a" stroke="#2b2a4c" strokeWidth="2" />
            <ellipse cx="62" cy="25" rx="8" ry="5.5" fill="#fbeedd" stroke="#2b2a4c" strokeWidth="1.6" />
            <ellipse cx="68" cy="22.5" rx="2.8" ry="2.2" fill="#2b2a4c" />
            <path d="M61 28 q3 2.5 6 0" fill="none" stroke="#2b2a4c" strokeWidth="1.4" strokeLinecap="round" />
            <circle className="eye" cx="56" cy="17" r="2" fill="#2b2a4c" />
            <circle cx="56" cy="17" r="4.8" fill="none" stroke="#2b2a4c" strokeWidth="1.5" />
            <path d="M60.8 16.5 h4" stroke="#2b2a4c" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="51" cy="25" r="2.4" fill="#ff9fbe" />
            <path className="ear" d="M46 9 C38 9 36 22 40 30 C44 33 48 28 48 20 C48 15 48 11 46 9 Z" fill="#7a5533" stroke="#2b2a4c" strokeWidth="2" strokeLinejoin="round" />
          </g>
        </svg>
      </button>
    </div>
  );
};

const TopBar = ({ route }) => (
  <header className="topbar">
    <div className="topbar-inner">
      <a className="brand" href="#/">
        <span className="brand-heart" aria-hidden="true">
          ♥
        </span>
        {profile.name}
      </a>
      <nav aria-label="Main">
        {navItems.map((n) => {
          const active = route === n.href.slice(2) || (n.href === "#/log" && route.startsWith("log/"));
          return (
            <a key={n.href} href={n.href} aria-current={active ? "page" : undefined}>
              {n.label}
            </a>
          );
        })}
      </nav>
    </div>
  </header>
);

const BouncyTitle = ({ text }) => (
  <h1 className="bouncy" aria-label={text}>
    {text.split("").map((ch, i) => (
      <span key={i} aria-hidden="true" style={{ "--i": i }}>
        {ch === " " ? " " : ch}
      </span>
    ))}
  </h1>
);

const Avatar = () => {
  const [boops, setBoops] = useState(0);
  const faceRef = useRef(null);
  const message = boops === 0 ? profile.boopHint : profile.boopLines[(boops - 1) % profile.boopLines.length];

  const tilt = (e) => {
    if (!faceRef.current || prefersReducedMotion()) return;
    const r = faceRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    faceRef.current.style.setProperty("--tilt", `${px * 14}deg`);
    faceRef.current.style.setProperty("--shift", `${px * 8}px, ${py * 8}px`);
  };

  const resetTilt = () => {
    faceRef.current?.style.setProperty("--tilt", "0deg");
    faceRef.current?.style.setProperty("--shift", "0px, 0px");
  };

  return (
    <div className="avatar-area">
      <button
        type="button"
        ref={faceRef}
        className="avatar-button"
        aria-label="Boop Viola's nose"
        onPointerMove={tilt}
        onPointerLeave={resetTilt}
        onClick={(e) => {
          setBoops((n) => n + 1);
          burstHearts(e.clientX || 100, e.clientY || 200, 10);
        }}
      >
        <img key={boops} src="/avatar.jpeg" alt="" className={boops ? "hero-avatar booped" : "hero-avatar"} draggable="false" />
      </button>
      <p key={message + boops} className="bubble" aria-live="polite">
        {message}
      </p>
    </div>
  );
};

const FLOATIES = [
  { ch: "♥", x: 6, y: 16, size: 26, color: "#ff7fa8", depth: 18, delay: 0 },
  { ch: "✦", x: 33, y: 12, size: 24, color: "#ffffff", depth: 28, delay: -1.4 },
  { ch: "☁", x: 54, y: 8, size: 46, color: "#ffffff", depth: 10, delay: -2.6 },
  { ch: "★", x: 94, y: 20, size: 26, color: "#ffc93c", depth: 24, delay: -0.8 },
  { ch: "♥", x: 51, y: 74, size: 20, color: "#ff7fa8", depth: 34, delay: -3.2 },
  { ch: "✦", x: 96, y: 74, size: 18, color: "#ffffff", depth: 20, delay: -2 },
  { ch: "☁", x: 2, y: 66, size: 38, color: "#ffffff", depth: 14, delay: -4 },
];

const Hero = () => {
  const heroRef = useRef(null);

  const parallax = (e) => {
    if (!heroRef.current || prefersReducedMotion()) return;
    const r = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    heroRef.current.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };

  return (
    <section className="hero" ref={heroRef} onPointerMove={parallax}>
      <div className="floaties" aria-hidden="true">
        {FLOATIES.map((f, i) => (
          <span key={i} className="floaty-wrap" style={{ left: `${f.x}%`, top: `${f.y}%`, "--depth": `${f.depth}px` }}>
            <span className="floaty" style={{ fontSize: f.size, color: f.color, animationDelay: `${f.delay}s` }}>
              {f.ch}
            </span>
          </span>
        ))}
      </div>
      <div className="hero-inner">
        <div className="hero-main">
          <Avatar />
          <BouncyTitle text={profile.greeting} />
          <p className="hero-statement">{profile.statement}</p>
          <div className="hero-actions">
            <a className="button" href="#/log">
              See my project log
            </a>
            <ExternalLinks links={profile.links} />
          </div>
        </div>
        <dl className="hero-facts">
          {profile.facts.map((f) => (
            <div key={f.label} className="fact">
              <dt>
                <span aria-hidden="true">{f.icon}</span> {f.label}
              </dt>
              {f.lines.map((line) => (
                <dd key={line}>{line}</dd>
              ))}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

const ProjectLog = () => {
  const [filter, setFilter] = useState("All");
  const entries = filter === "All" ? log : log.filter((e) => e.type === filter);

  return (
    <section id="log" className="block pop">
      <div className="block-head">
        <div>
          <h2>Project log</h2>
          <p className="block-intro">What I’ve been up to. Click one to see what I did and what I learned.</p>
        </div>
        <div className="filters" role="group" aria-label="Filter projects">
          {["All", ...logTypes].map((t) => (
            <button key={t} type="button" aria-pressed={filter === t} onClick={() => setFilter(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <ul className="log-list" key={filter}>
        {entries.map((e, i) => (
          <li key={e.slug} style={{ "--i": i }}>
            <a className="log-row" href={`#/log/${e.slug}`}>
              <span className="log-icon" aria-hidden="true">
                {e.icon}
              </span>
              <span className="log-text">
                <span className="log-title">{e.title}</span>
                <span className="log-summary">{e.summary}</span>
                <span className="log-dates">{e.dates}</span>
              </span>
              <span className={`type type-${e.type.toLowerCase()}`}>{e.type}</span>
              <Chevron />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

const Experience = () => (
  <section id="experience" className="block pop">
    <div className="block-head">
      <h2>Experience</h2>
    </div>
    <div className="exp-list">
      {experience.map((e) => (
        <article key={e.org} className="exp-org">
          <h3>{e.org}</h3>
          <ul>
            {e.roles.map((r) => (
              <li key={r.title} className="exp-role">
                <a href={`#/log/${r.log}`}>{r.title}</a>
                <span className="dates">{r.dates}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </section>
);

const EducationSkills = () => (
  <section id="education" className="block two-col pop">
    <div>
      <h2>Education</h2>
      <h3 className="edu-school">{education.school}</h3>
      <p className="edu-degree">{education.degree}</p>
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
            <dd className="skill-chips">
              {s.items.split(", ").map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="block two-col about pop">
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
    <div className="polaroid">
      <img
        src="/potrait.jpeg"
        alt="Viola in a maize shirt at Michigan Stadium after a game, with the marching band behind her"
        loading="lazy"
      />
      <p>go blue!</p>
    </div>
  </section>
);

const Home = () => (
  <>
    <Hero />
    <main className="wrap">
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
      <div className="detail-head">
        <span className="detail-icon" aria-hidden="true">
          {entry.icon}
        </span>
        <div>
          <span className={`type type-${entry.type.toLowerCase()}`}>{entry.type}</span>
          <h1 className="detail-title">{entry.title}</h1>
        </div>
      </div>
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
          </dl>
          {entry.tools && (
            <div className="side-group">
              <h2>Tools and methods</h2>
              <div className="skill-chips">
                {entry.tools.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {entry.links && (
            <div className="side-group">
              <h2>Links</h2>
              <ExternalLinks links={entry.links} />
            </div>
          )}
        </aside>
      </div>

      <a className="next-project" href={`#/log/${next.slug}`}>
        <span className="muted">Next project</span>
        <span className="next-title">
          <span>
            <span aria-hidden="true">{next.icon}</span> {next.title}
          </span>
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
  useReveal(showsHome);

  // a little heart burst wherever you click
  useEffect(() => {
    const onDown = (e) => {
      if (e.target.closest?.(".avatar-button, .puppy-button")) return;
      burstHearts(e.clientX, e.clientY, 5);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  useEffect(() => {
    if (isDetail) {
      const entry = log.find((e) => e.slug === route.slice(4));
      document.title = entry ? `${entry.title} | ${profile.name}` : profile.name;
    } else {
      document.title = isNotes ? `Notes | ${profile.name}` : profile.name;
    }

    const target = showsHome && route ? document.getElementById(route) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [route, isDetail, isNotes, showsHome]);

  return (
    <div className="app">
      <TopBar route={route} />
      {isDetail ? <LogDetail slug={route.slice(4)} /> : isNotes ? <Notes /> : <Home />}
      <footer className="footer">
        <div className="wrap footer-inner">
          <span>
            Made with <span className="footer-heart">♥</span> by {profile.name}
          </span>
          <ExternalLinks links={profile.links} />
        </div>
      </footer>
      <Puppy />
    </div>
  );
}
