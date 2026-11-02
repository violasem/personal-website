import React, { useEffect, useState } from "react";
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
  <svg className="chevron" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TopBar = ({ route }) => (
  <header className="topbar">
    <div className="topbar-inner">
      <a className="brand" href="#/">
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

const Hero = () => (
  <section className="hero">
    <div className="hero-inner">
      <div className="hero-main">
        <img src="/avatar.jpeg" alt="Illustrated portrait of Viola with glasses and puppy ears" className="hero-avatar" />
        <h1>{profile.name}</h1>
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
            <dt>{f.label}</dt>
            {f.lines.map((line) => (
              <dd key={line}>{line}</dd>
            ))}
          </div>
        ))}
      </dl>
    </div>
  </section>
);

const ProjectLog = () => {
  const [filter, setFilter] = useState("All");
  const entries = filter === "All" ? log : log.filter((e) => e.type === filter);

  return (
    <section id="log" className="block">
      <div className="block-head">
        <div>
          <h2>Project log</h2>
          <p className="block-intro">What I’ve worked on. Select one to see what I did and what I learned.</p>
        </div>
        <div className="filters" role="group" aria-label="Filter projects">
          {["All", ...logTypes].map((t) => (
            <button key={t} type="button" aria-pressed={filter === t} onClick={() => setFilter(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <ul className="log-list">
        {entries.map((e) => (
          <li key={e.slug}>
            <a className="log-row" href={`#/log/${e.slug}`}>
              <span className="log-dates">{e.dates}</span>
              <span className="log-text">
                <span className="log-title">{e.title}</span>
                <span className="log-summary">{e.summary}</span>
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
  <section id="experience" className="block">
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
  <section id="education" className="block two-col">
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
            <dd>{s.items}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="block two-col about">
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
    <main className="wrap detail">
      <a className="back" href="#/log">
        Back to project log
      </a>
      <span className={`type type-${entry.type.toLowerCase()}`}>{entry.type}</span>
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
          </dl>
          {entry.tools && (
            <div className="side-group">
              <h2>Tools and methods</h2>
              <ul className="tool-list">
                {entry.tools.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
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
          {next.title}
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

  useEffect(() => {
    if (isDetail) {
      const entry = log.find((e) => e.slug === route.slice(4));
      document.title = entry ? `${entry.title} | ${profile.name}` : profile.name;
    } else {
      document.title = isNotes ? `Notes | ${profile.name}` : profile.name;
    }

    const target = !isDetail && !isNotes && route ? document.getElementById(route) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [route, isDetail, isNotes]);

  return (
    <div className="app">
      <TopBar route={route} />
      {isDetail ? <LogDetail slug={route.slice(4)} /> : isNotes ? <Notes /> : <Home />}
      <footer className="footer">
        <div className="wrap footer-inner">
          <span>{profile.name}</span>
          <ExternalLinks links={profile.links} />
        </div>
      </footer>
    </div>
  );
}
