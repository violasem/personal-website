import React, { useEffect, useRef, useState } from "react";
import { about, applications, education, features, log, logTypes, pins, profile, skills, specs, timing } from "./content.js";

const NOTION_URL = "https://lopsided-passbook-280.notion.site/ebd//2ed826ec6ca8800ab28edaef165b6909";
const SPOTIFY_URL = "https://open.spotify.com/embed/playlist/1vHnZpoh3TbeXlvnFfp7Uf?utm_source=generator";

const navItems = [
  { href: "#/specs", label: "Specs" },
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

const appNote = (slug) => {
  const index = log.findIndex((e) => e.slug === slug);
  return `AN-${String(log.length - index).padStart(2, "0")}`; // oldest entry is AN-01, so numbers never change
};

// A few small hearts, only when someone pets the dog or boops the chip.
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
    <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
  </svg>
);

// --- the dog ---
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
            <path d="M18 32 C10 30 6 24 8 16" fill="none" stroke="#15191a" strokeWidth="6" strokeLinecap="round" />
            <path d="M18 32 C10 30 6 24 8 16" fill="none" stroke="#d9bd9b" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g stroke="#15191a" strokeWidth="1.8">
            <rect className="leg leg-b" x="27" y="40" width="7" height="17" rx="3.5" fill="#c6a988" />
            <rect className="leg leg-b" x="49" y="40" width="7" height="17" rx="3.5" fill="#c6a988" />
            <rect className="leg leg-a" x="19" y="40" width="7" height="18" rx="3.5" fill="#d9bd9b" />
            <rect className="leg leg-a" x="41" y="40" width="7" height="18" rx="3.5" fill="#d9bd9b" />
          </g>
          <g>
            <rect x="15" y="24" width="42" height="23" rx="11.5" fill="#d9bd9b" stroke="#15191a" strokeWidth="1.8" />
            <circle cx="54" cy="20" r="14.5" fill="#d9bd9b" stroke="#15191a" strokeWidth="1.8" />
            <ellipse cx="62" cy="25" rx="8" ry="5.5" fill="#f1e6d8" stroke="#15191a" strokeWidth="1.4" />
            <ellipse cx="68" cy="22.5" rx="2.8" ry="2.2" fill="#15191a" />
            <path d="M61 28 q3 2.5 6 0" fill="none" stroke="#15191a" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="56" cy="17" r="2" fill="#15191a" />
            <circle cx="56" cy="17" r="4.8" fill="none" stroke="#15191a" strokeWidth="1.4" />
            <path d="M60.8 16.5 h4" stroke="#15191a" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M46 9 C38 9 36 22 40 30 C44 33 48 28 48 20 C48 15 48 11 46 9 Z" fill="#755a42" stroke="#15191a" strokeWidth="1.8" strokeLinejoin="round" />
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
        VS-2028
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

// --- the pinout: each pin is a link, and its copper trace lights up when you point at it ---
const PIN_Y = [130, 205, 280, 355];
const PIN_JOG = [-14, -22, -10, -18];

const Pinout = ({ active, setActive }) => (
  <svg className="pinout" viewBox="0 0 520 480" role="group" aria-label="Pinout of the VS-2028 chip. Each pin links to a part of this site.">
    <g className="silk-extra" aria-hidden="true">
      <text x="185" y="62">U1</text>
      <circle cx="84" cy="50" r="3" />
      <circle cx="436" cy="430" r="3" />
      <path d="M170 66 h-14 v14 M350 66 h14 v14 M170 424 h-14 v-14 M350 424 h14 v-14" fill="none" />
    </g>

    {pins.map((pin, i) => {
      const left = i < 4;
      const row = left ? i : 7 - i;
      const y = PIN_Y[row];
      const end = y + PIN_JOG[row];
      const d = left ? `M185 ${y} H130 L${130 - Math.abs(PIN_JOG[row])} ${end} H34` : `M335 ${y} H390 L${390 + Math.abs(PIN_JOG[row])} ${end} H486`;
      const isOn = active === i;
      const linkProps = pin.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

      return (
        <a
          key={pin.name}
          href={pin.href}
          {...linkProps}
          className={isOn ? "pin on" : "pin"}
          style={{ "--i": i }}
          aria-label={`Pin ${i + 1}, ${pin.name}. ${pin.note}`}
          onPointerEnter={() => setActive(i)}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(null)}
        >
          <path className="pin-hit" d={d} />
          <path className="trace" d={d} pathLength="100" />
          <path className="pulse" d={d} pathLength="100" />
          <circle className="pad" cx={left ? 24 : 496} cy={end} r="10" />
          <circle className="pad-hole" cx={left ? 24 : 496} cy={end} r="3.6" />
          <rect className="pin-hit-label" x={left ? 14 : 346} y={end - 30} width="160" height="44" />
          <text className="pin-label" x={left ? 42 : 478} y={end - 10} textAnchor={left ? "start" : "end"}>
            {pin.name}
          </text>
          <rect className="leg-metal" x={left ? 168 : 335} y={y - 8} width="17" height="16" />
        </a>
      );
    })}

    <g aria-hidden="true">
      <rect className="chip" x="185" y="80" width="150" height="330" rx="4" />
      <path className="chip-notch" d="M246 80 a14 14 0 0 0 28 0" />
      <circle className="pin-one" cx="199" cy="98" r="4" />
    </g>
    {pins.map((pin, i) => {
      const left = i < 4;
      const y = PIN_Y[left ? i : 7 - i];
      return (
        <text key={pin.name} className={active === i ? "pin-number on" : "pin-number"} x={left ? 199 : 321} y={y + 5} textAnchor="middle" aria-hidden="true">
          {i + 1}
        </text>
      );
    })}
  </svg>
);

const ChipWindow = () => {
  const [boops, setBoops] = useState(0);
  return (
    <button
      type="button"
      className="chip-window"
      aria-label="Boop Viola's nose"
      onClick={(e) => {
        setBoops((n) => n + 1);
        burstHearts(e.clientX || 300, e.clientY || 200, 4);
      }}
    >
      <img key={boops} src="/avatar.jpeg" alt="" className={boops ? "booped" : ""} draggable="false" />
    </button>
  );
};

const Hero = () => {
  const [active, setActive] = useState(null);
  const pin = active === null ? null : pins[active];

  return (
    <section className="board">
      <div className="board-inner">
        <div className="board-text">
          <p className="part-line">{profile.partLine}</p>
          <h1>{profile.name}</h1>
          <p className="board-statement">{profile.statement}</p>
          <ExternalLinks links={profile.links} />
          <p className="readout" aria-live="polite">
            {pin ? (
              <>
                <span className="readout-pin">PIN {active + 1} {pin.name}</span> {pin.note}
              </>
            ) : (
              <>
                <span className="readout-pin">READY</span> Every pin goes somewhere. Try one.
              </>
            )}
          </p>
        </div>
        <div className="board-figure">
          <Pinout active={active} setActive={setActive} />
          <div className="chip-marking">
            <ChipWindow />
            <p className="chip-part">VS-2028</p>
            <p className="chip-sub">MADE IN MEDAN</p>
            <p className="chip-sub">ASSEMBLED IN ANN ARBOR</p>
          </div>
        </div>
      </div>
      <p className="board-silk">
        <span>VS-2028 REV 2026.11</span>
        <span>{profile.release}</span>
      </p>
    </section>
  );
};

const Sheet = ({ number, id, title, children, intro, aside }) => (
  <section id={id} className="sheet-section">
    <div className="section-head">
      <div>
        <h2>
          <span className="section-number">{number}</span>
          {title}
        </h2>
        {intro && <p className="section-intro">{intro}</p>}
      </div>
      {aside}
    </div>
    {children}
  </section>
);

const Overview = () => (
  <section className="overview">
    <div>
      <h2>
        <span className="section-number">1</span>Features
      </h2>
      <ul className="square-list">
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
    <div>
      <h2>
        <span className="section-number">2</span>Applications
      </h2>
      <ul className="square-list">
        {applications.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </div>
    <div>
      <h2>
        <span className="section-number">3</span>Description
      </h2>
      <p>{about.intro}</p>
    </div>
  </section>
);

const Specs = () => (
  <Sheet number="4" id="specs" title="Specifications">
    <div className="table-wrap">
      <table className="spec-table">
        <thead>
          <tr>
            <th scope="col">Parameter</th>
            <th scope="col" className="conditions">Conditions</th>
            <th scope="col" className="num">Min</th>
            <th scope="col" className="num">Typ</th>
            <th scope="col" className="num">Max</th>
            <th scope="col">Unit</th>
          </tr>
        </thead>
        <tbody>
          {specs.map((s) => (
            <tr key={s.parameter}>
              <th scope="row">{s.parameter}</th>
              <td className="muted conditions">{s.conditions}</td>
              <td className="num">{s.min}</td>
              <td className="num">{s.typ}</td>
              <td className="num">{s.max}</td>
              <td className="muted">{s.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Sheet>
);

const ProjectLog = () => {
  const [filter, setFilter] = useState("All");
  const entries = filter === "All" ? log : log.filter((e) => e.type === filter);

  return (
    <Sheet
      number="5"
      id="log"
      title="Project log"
      intro="Application notes on what I’ve worked on. Open one to see what I did and what I learned."
      aside={
        <div className="filters" role="group" aria-label="Filter projects">
          {["All", ...logTypes].map((t) => (
            <button key={t} type="button" aria-pressed={filter === t} onClick={() => setFilter(t)}>
              {t}
            </button>
          ))}
        </div>
      }
    >
      <ul className="log-list">
        {entries.map((e) => (
          <li key={e.slug}>
            <a className="log-row" href={`#/log/${e.slug}`}>
              <span className="log-number">{appNote(e.slug)}</span>
              <span className="log-text">
                <span className="log-title">{e.title}</span>
                <span className="log-summary">{e.summary}</span>
              </span>
              <span className="log-type">{e.type}</span>
              <span className="log-dates">{e.dates}</span>
              <Chevron />
            </a>
          </li>
        ))}
      </ul>
    </Sheet>
  );
};

// --- experience as a logic analyzer: each role is a signal that's high while I held it ---
const toMonths = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthLabel = (months) => `${MONTHS[Math.floor(months) % 12]} ${Math.floor(Math.floor(months) / 12)}`;

const Timing = () => {
  const now = new Date();
  const nowMonths = now.getFullYear() * 12 + now.getMonth() + 1;
  const start = Math.min(...timing.map((t) => toMonths(t.from)));
  const span = nowMonths - start;
  const xOf = (months) => ((months - start) / span) * 100;
  const [cursor, setCursor] = useState(null);
  const plotRef = useRef(null);

  const ticks = [];
  for (let m = start; m <= nowMonths; m++) if ((m - start) % 3 === 0) ticks.push(m);

  const onMove = (e) => {
    const r = plotRef.current?.getBoundingClientRect();
    if (!r) return;
    const fraction = (e.clientX - r.left) / r.width;
    setCursor(fraction >= 0 && fraction <= 1 ? start + fraction * span : null);
  };

  return (
    <Sheet number="6" id="experience" title="Experience" intro="Timing diagram. Each signal is high while I held the role. Move across it to read a date, or open a role.">
      <div className="timing" onPointerMove={onMove} onPointerLeave={() => setCursor(null)}>
        <div className="timing-axis">
          <div className="axis-plot" ref={plotRef}>
            {ticks.map((m) => (
              <span key={m} className="axis-tick" style={{ left: `${xOf(m)}%` }}>
                {monthLabel(m)}
              </span>
            ))}
            {cursor !== null && (
              <span className="cursor-label" style={{ left: `${xOf(cursor)}%` }}>
                {monthLabel(cursor)}
              </span>
            )}
          </div>
        </div>
        {timing.map((t) => {
          const from = toMonths(t.from);
          const to = t.to ? toMonths(t.to) + 1 : nowMonths;
          const x1 = xOf(from);
          const x2 = xOf(to);
          const isHigh = cursor !== null && cursor >= from && cursor < to;
          const d = `M0 21 H${x1} V5 H${x2} ${t.to ? `V21 H100` : ""}`;
          return (
            <a key={t.signal} className={isHigh ? "signal high" : "signal"} href={`#/log/${t.log}`}>
              <span className="signal-name">
                <span className="signal-title">{t.signal}</span>
                <span className="signal-org">{t.org}</span>
              </span>
              <span className="signal-plot">
                <svg viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true">
                  <path d={d} />
                </svg>
                {ticks.map((m) => (
                  <i key={m} className="grid-line" style={{ left: `${xOf(m)}%` }} />
                ))}
                {cursor !== null && <i className="cursor-line" style={{ left: `${xOf(cursor)}%` }} />}
              </span>
              <span className="signal-dates">{t.dates}</span>
            </a>
          );
        })}
      </div>
    </Sheet>
  );
};

const EducationSkills = () => (
  <div className="two-col">
    <Sheet number="7" id="education" title="Education">
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
    </Sheet>
    <Sheet number="8" id="skills" title="Interfaces">
      <dl className="skills">
        {skills.map((s) => (
          <div key={s.group}>
            <dt>{s.group}</dt>
            <dd>{s.items}</dd>
          </div>
        ))}
      </dl>
    </Sheet>
  </div>
);

const About = () => (
  <Sheet number="9" id="about" title="About">
    <div className="about-grid">
      <div>
        <p className="about-more">{about.more}</p>
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
      <figure>
        <img
          src="/potrait.jpeg"
          alt="Viola in a maize shirt at Michigan Stadium after a game, with the marching band behind her"
          loading="lazy"
        />
        <figcaption>{about.figure}</figcaption>
      </figure>
    </div>
  </Sheet>
);

const Home = () => (
  <>
    <Hero />
    <main className="sheet">
      <div className="sheet-header">
        <span>VS-2028 Datasheet</span>
        <span>Rev. 2026.11</span>
      </div>
      <Overview />
      <Specs />
      <ProjectLog />
      <Timing />
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
      <main className="sheet detail">
        <h1 className="detail-title">Application note not found</h1>
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

  let section = 1;

  return (
    <main className="sheet">
      <div className="sheet-header">
        <span>
          {appNote(slug)} {entry.type}
        </span>
        <span>VS-2028 Application note</span>
      </div>
      <div className="detail">
        <a className="back" href="#/log">
          Back to project log
        </a>
        <h1 className="detail-title">{entry.title}</h1>
        <p className="detail-overview">{entry.overview}</p>

        <div className="detail-grid">
          <div className="detail-body">
            {entry.did && (
              <section>
                <h2>
                  <span className="section-number">{section++}</span>What I did
                </h2>
                <ul className="square-list">
                  {entry.did.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </section>
            )}
            {entry.learned && (
              <section>
                <h2>
                  <span className="section-number">{section++}</span>What I learned
                </h2>
                <p>{entry.learned}</p>
              </section>
            )}
            {entry.updates && (
              <section>
                <h2>
                  <span className="section-number">{section++}</span>Revision history
                </h2>
                <ol className="updates">
                  {entry.updates.map((u) => (
                    <li key={u.date + u.text}>
                      <span className="muted">{u.date}</span>
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
          <span className="log-number">{appNote(next.slug)}</span>
          <span className="next-title">{next.title}</span>
          <Chevron />
        </a>
      </div>
    </main>
  );
};

const Notes = () => (
  <main className="sheet">
    <div className="sheet-header">
      <span>VS-2028 Notes</span>
      <span>Rev. 2026.11</span>
    </div>
    <div className="detail">
      <h1 className="detail-title">Notes</h1>
      <p className="detail-overview">Reflections and things I’m thinking through while I learn.</p>
      <iframe title="Viola's notes on Notion" className="notes-frame" src={NOTION_URL} width="100%" height="720" loading="lazy" allowFullScreen />
    </div>
  </main>
);

export default function App() {
  const route = useRoute();
  const isDetail = route.startsWith("log/");
  const isNotes = route === "notes";
  const showsHome = !isDetail && !isNotes;

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
        <div className="footer-inner">
          <span>{profile.name}</span>
          <ExternalLinks links={profile.links} />
        </div>
      </footer>
      <Puppy />
    </div>
  );
}
