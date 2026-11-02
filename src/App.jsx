import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// The hero line is the word "viola" sent over UART: the line idles high, then
// each character is a start bit (low), 8 data bits (LSB first) and a stop bit (high).
const buildTrace = (width) => {
  const high = 30;
  const low = 58;
  const gutter = Math.max(window.innerWidth * 0.08, (window.innerWidth - 1400) / 2);
  const bit = width < 720 ? Math.min((width - gutter - 90) / 50, 7) : Math.min((width * 0.45) / 50, 16);

  const bits = [];
  for (const ch of "viola") {
    const code = ch.charCodeAt(0);
    bits.push(0);
    for (let i = 0; i < 8; i++) bits.push((code >> i) & 1);
    bits.push(1);
  }

  let x = gutter;
  let level = 1;
  let d = `M0 ${high} H${x}`;
  for (const b of bits) {
    if (b !== level) {
      d += ` V${b ? high : low}`;
      level = b;
    }
    x += bit;
    d += ` H${x}`;
  }

  const hx = x + 44;
  const s = 22;
  const heart =
    `C${hx - 6} ${high - 12} ${hx - s} ${high - 12} ${hx - s} ${high + 4} ` +
    `C${hx - s} ${high + 16} ${hx - 6} ${high + 26} ${hx} ${high + 34} ` +
    `C${hx + 6} ${high + 26} ${hx + s} ${high + 16} ${hx + s} ${high + 4} ` +
    `C${hx + s} ${high - 12} ${hx + 6} ${high - 12} ${hx} ${high}`;

  return {
    line: `${d} H${hx} ${heart} H${width}`,
    heart: `M${hx} ${high} ${heart} Z`,
  };
};

const introAlreadySeen = () => {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    return sessionStorage.getItem("intro-seen") === "1";
  } catch {
    return false;
  }
};

// ---------------------------------------------------------------------------
// Site content: edit the text below to update the site.
// ---------------------------------------------------------------------------

const tagline = "Computer engineering at the University of Michigan, class of 2028. Circuits, embedded systems, and data.";

const socialLinks = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/violasem/" },
  { name: "GitHub", url: "https://github.com/violasem" },
];

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "notes", label: "Notes" },
  { id: "outside-work", label: "Outside work" },
];

const experience = [
  {
    org: "PERMIAS Michigan",
    place: "Ann Arbor, on-site",
    summary: "Outreach to alumni and partner organizations for the Indonesian student organization at U-M.",
    roles: [{ title: "Co-Director of External Relations", dates: "Jul 2026 – present" }],
  },
  {
    org: "Electrical and Computer Engineering, University of Michigan",
    roles: [
      {
        title: "Instructional Aide, EECS 215: Introduction to Circuits",
        dates: "Aug 2026 – present",
        summary: "Course staff for a lab section.",
      },
    ],
  },
  {
    org: "University of Michigan Department of Mathematics",
    place: "Ann Arbor, on-site",
    summary:
      "Weekly tutoring sessions and study groups for engineering students, breaking down topics in vector calculus, linear algebra, and differential equations. Drop-in calculus tutoring focused on helping students approach problems with more confidence.",
    roles: [
      { title: "Differential Equations Tutor, Mathematics Learning Center", dates: "Jan 2026 – present" },
      { title: "Calculus I & II Tutor, Mathematics Learning Center", dates: "Aug 2025 – present" },
      { title: "Study Group Facilitator", dates: "Aug 2025 – present" },
    ],
  },
  {
    org: "Stealth Startup",
    place: "Jakarta, hybrid",
    roles: [
      {
        title: "Developer Intern",
        dates: "Jun 2026 – Sep 2026",
        summary:
          "Helped build an AI startup developing software with large language models to automate workflows, improve customer experiences, and solve real-world business challenges.",
      },
    ],
  },
  {
    org: "University of Michigan Climate and Space",
    roles: [
      {
        title: "Data Engineer",
        dates: "May 2026 – Sep 2026",
        summary:
          "Applied dimensionality reduction to multi-layered space physics datasets with 7 parameters, and used machine learning models to cluster, classify, and predict plasma and solar wind behavior.",
      },
      {
        title: "Research Intern",
        dates: "Oct 2025 – May 2026",
        summary:
          "Worked with Associate Professor Liang Zhao to build Python machine learning pipelines that preprocess and analyze large-scale in-situ solar wind data from the Swift Observatory and Parker Solar Probe.",
      },
    ],
  },
];

const coursework = [
  "Programming and data structures",
  "Logic design",
  "Computer organization",
  "Electric circuits",
  "Discrete math",
  "Differential equations",
  "Computational linear algebra",
];

const skills = [
  { group: "Languages", items: "C++, Python, Verilog, MATLAB" },
  { group: "Hardware", items: "Arduino, FPGA logic, circuits" },
  { group: "Data", items: "Machine learning pipelines, dimensionality reduction, clustering" },
  { group: "Tools", items: "Git, Linux, React" },
];

const Section = ({ id, title, children }) => (
  <section id={id} className="section">
    <h2 className="section-title">{title}</h2>
    <div className="section-body">{children}</div>
  </section>
);

export default function App() {
  // intro runs draw -> settle -> done
  const [phase, setPhase] = useState(() => (introAlreadySeen() ? "done" : "draw"));
  const hasEntered = phase !== "draw";

  const heroRef = useRef(null);
  const traceWrapRef = useRef(null);
  const [traceWidth, setTraceWidth] = useState(() => document.documentElement.clientWidth);

  useEffect(() => {
    if (!traceWrapRef.current) return;
    const observer = new ResizeObserver(([entry]) => setTraceWidth(entry.contentRect.width));
    observer.observe(traceWrapRef.current);
    return () => observer.disconnect();
  }, []);

  // the line starts at the middle of the screen, then drops into place
  useLayoutEffect(() => {
    if (phase !== "draw" || !traceWrapRef.current || !heroRef.current) return;
    const top = traceWrapRef.current.getBoundingClientRect().top;
    heroRef.current.style.setProperty("--trace-from", `${window.innerHeight / 2 - top - 30}px`);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") return;
    if (phase === "settle") {
      const t = setTimeout(() => setPhase("done"), 1000);
      return () => clearTimeout(t);
    }
    const settle = () => {
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {
        // storage is optional: the intro just plays again next visit
      }
      setPhase("settle");
    };
    const t = setTimeout(settle, 1650);
    window.addEventListener("pointerdown", settle);
    window.addEventListener("keydown", settle);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", settle);
      window.removeEventListener("keydown", settle);
    };
  }, [phase]);

  const trace = buildTrace(traceWidth);

  return (
    <div className="app">
      <header ref={heroRef} className={`hero phase-${phase}`}>
        <div className="hero-stage">
          <h1 className="hero-name">
            viola
            <br />
            sembiring
          </h1>
          <img src="/avatar.jpeg" alt="Illustrated portrait of Viola with glasses and puppy ears" className="hero-avatar" />
        </div>

        <div className="hero-trace" ref={traceWrapRef}>
          <svg
            viewBox={`0 0 ${traceWidth} 80`}
            preserveAspectRatio="none"
            role="img"
            aria-label="A signal line spelling viola in UART, ending in a heart"
          >
            <path className="trace-line" d={trace.line} pathLength="1" />
            <path className="trace-heart" d={trace.heart} />
          </svg>
        </div>

        <div className="hero-meta">
          <p className="hero-tagline">{tagline}</p>
          <div className="link-row">
            {socialLinks.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </header>

      {hasEntered && (
        <div className="page">
          <nav className="site-nav" aria-label="Sections">
            <div className="site-nav-inner">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`}>
                  {s.label}
                </a>
              ))}
            </div>
          </nav>

          <main className="content">
            <Section id="about" title="About">
              <p className="lede">
                I’m Viola Charissa Diana Sembiring, a computer engineering student who loves building things that are
                both logical and alive: circuits, embedded systems, and data that tells a story, especially space
                plasma and solar wind.
              </p>
              <p className="body-text">
                I’m curious about systems: how they behave, how they fail, and how they can be designed more
                thoughtfully. I like hardware debugging, clean architecture, CAD, and making hard things feel simple.
              </p>
              <img
                src="/potrait.jpeg"
                alt="Viola in a maize shirt at Michigan Stadium after a game, with the marching band behind her"
                className="about-photo"
                loading="lazy"
              />
            </Section>

            <Section id="experience" title="Experience">
              {experience.map((e) => (
                <article key={e.org} className="org">
                  <h3 className="org-name">{e.org}</h3>
                  {e.place && <p className="org-place">{e.place}</p>}
                  {e.roles.map((r) => (
                    <div key={r.title} className="role">
                      <div className="role-head">
                        <h4 className="role-title">{r.title}</h4>
                        <span className="dates">{r.dates}</span>
                      </div>
                      {r.summary && <p className="body-text">{r.summary}</p>}
                    </div>
                  ))}
                  {e.summary && <p className="body-text org-summary">{e.summary}</p>}
                </article>
              ))}
            </Section>

            <Section id="education" title="Education">
              <article className="org">
                <h3 className="org-name">University of Michigan College of Engineering</h3>
                <div className="role">
                  <div className="role-head">
                    <h4 className="role-title">B.S.E. in Computer Engineering, minor in Data Science</h4>
                    <span className="dates">Aug 2024 – May 2028</span>
                  </div>
                  <p className="body-text">GPA 3.94/4.0. Dean’s List and University Honors to date.</p>
                </div>
                <h4 className="list-title">Relevant coursework</h4>
                <ul className="plain-list">
                  {coursework.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </article>
            </Section>

            <Section id="skills" title="Skills">
              <dl className="skills">
                {skills.map((s) => (
                  <div key={s.group} className="skill-row">
                    <dt>{s.group}</dt>
                    <dd>{s.items}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            <Section id="notes" title="Notes">
              <p className="body-text notes-intro">Reflections and things I’m thinking through while I learn.</p>
              <iframe
                title="Viola's notes on Notion"
                className="notes-frame"
                src="https://lopsided-passbook-280.notion.site/ebd//2ed826ec6ca8800ab28edaef165b6909"
                width="100%"
                height="600"
                loading="lazy"
                allowFullScreen
              />
            </Section>

            <Section id="outside-work" title="Outside work">
              <p className="body-text">
                Born and raised in Medan, Indonesia. Always looking for good fantasy manga and manhwa. Dog person.
              </p>
              <iframe
                title="Playlist Viola is listening to on Spotify"
                className="playlist"
                src="https://open.spotify.com/embed/playlist/1vHnZpoh3TbeXlvnFfp7Uf?utm_source=generator"
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </Section>
          </main>

          <footer className="footer">
            <div className="link-row">
              {socialLinks.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.name}
                </a>
              ))}
            </div>
            <p className="footer-note">
              The line at the top of this page is my name, sent over UART: 8 data bits, LSB first, with a start and stop
              bit per letter.
            </p>
          </footer>
        </div>
      )}
    </div>
  );
}
