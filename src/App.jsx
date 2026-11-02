import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { contact, deskItems, education, log, logTypes, profile, skills, timeline } from "./content.js";


const navItems = [
  { href: "#/log", label: "Project log" },
  { href: "#/experience", label: "Experience" },
  { href: "#/education", label: "Education" },
  { href: "#/contact", label: "Contact" },
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
    const ids = ["log", "experience", "education", "contact"];
    const onScroll = () => {
      let found = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) found = id;
      }
      // the last section may be too short to reach the line, so count the bottom of the page as reaching it
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      setCurrent(atBottom ? ids[ids.length - 1] : found);
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

// Lets the desk tell the dog there's a treat.
const dogBus = new EventTarget();

const squeak = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audio = new AudioCtx();
    const now = audio.currentTime;
    [0, 0.13].forEach((delay) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1050, now + delay);
      osc.frequency.exponentialRampToValueAtTime(620, now + delay + 0.1);
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.05, now + delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.11);
      osc.connect(gain).connect(audio.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.12);
    });
    setTimeout(() => audio.close(), 500);
  } catch {
    // no sound available, and the quack bubble still shows
  }
};

// The dog follows your cursor along the bottom of the screen. Click it to pet it, or give it a treat.
const Puppy = () => {
  const rootRef = useRef(null);
  const [pets, setPets] = useState(0);
  const [saying, setSaying] = useState(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || prefersReducedMotion()) return;

    const clamp = (value) => Math.max(8, Math.min(window.innerWidth - 80, value));
    let x = 24;
    let y = 0;
    let target = 24;
    let frame;
    let treat = null;

    // the dog trails behind the cursor, so it never sits on top of what you're clicking
    const onMove = (e) => {
      if (e.pointerType === "mouse") target = clamp(e.clientX - 96);
    };
    const onDown = (e) => {
      if (e.pointerType !== "mouse") target = clamp(e.clientX - 36);
    };

    const onTreat = (e) => {
      treat = e.detail;
    };

    const tick = () => {
      // heading for a treat, the dog leaves the floor and runs right to it
      const goalX = treat ? clamp(treat.x - 34) : target;
      const goalY = treat ? treat.y - (window.innerHeight - 30) : 0;
      const gapX = goalX - x;
      const gapY = goalY - y;
      const distance = Math.hypot(gapX, gapY);
      if (treat || Math.abs(gapY) > 1) {
        const speed = treat ? 7 : 5;
        const step = Math.min(speed, distance) / (distance || 1);
        x += gapX * step;
        y += gapY * step;
      } else {
        x += Math.max(-3, Math.min(3, gapX * 0.05));
        y = 0;
      }
      el.style.transform = `translate(${x}px, ${y}px)`;
      const moving = treat ? distance > 8 : Math.abs(gapX) > 6 || Math.abs(gapY) > 1;
      el.classList.toggle("walking", moving);
      if (Math.abs(gapX) > 6) el.classList.toggle("flip", gapX < 0);
      if (treat && distance <= 8) {
        treat.onEaten();
        treat = null;
        setPets((n) => n + 1);
        setSaying("yum!");
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    dogBus.addEventListener("treat", onTreat);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      dogBus.removeEventListener("treat", onTreat);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!saying) return;
    const t = setTimeout(() => setSaying(null), 1100);
    return () => clearTimeout(t);
  }, [saying, pets]);

  const pet = (e) => {
    setPets((n) => n + 1);
    setSaying("woof");
    burstHearts(e.clientX || 60, e.clientY || window.innerHeight - 50, 4);
  };

  return (
    <div className="puppy" ref={rootRef} style={{ transform: "translateX(24px)" }}>
      {saying && <span className="puppy-says">{saying}</span>}
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

const TopBar = ({ route, current }) => {
  const navRef = useRef(null);

  // on phones the menu can scroll sideways, so keep the current section's link in view
  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector('[aria-current="page"]');
    if (link && nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({ left: link.offsetLeft - nav.clientWidth / 2 + link.offsetWidth / 2, behavior: "smooth" });
    }
  });

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="#/" aria-label={profile.name}>
          <span className="brand-full">{profile.name}</span>
          <span className="brand-short" aria-hidden="true">
            VS
          </span>
        </a>
        <nav aria-label="Main" ref={navRef}>
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
};

// Drawings for the desk.
const DeskObject = ({ art }) => {
  if (art === "pennant") {
    return (
      <svg viewBox="0 0 170 84" width="100%" aria-hidden="true">
        <rect x="2" y="2" width="9" height="80" rx="3" fill="#8a6f52" />
        <path d="M11 6 L166 42 L11 78 Z" fill="#26405f" />
        <path d="M11 6 L166 42 L11 78 Z" fill="none" stroke="#e3c46f" strokeWidth="3" strokeLinejoin="round" />
        <text x="24" y="50" fontFamily="Figtree, sans-serif" fontSize="21" fontWeight="700" letterSpacing="0.5" fill="#f0d98c">GO BLUE</text>
      </svg>
    );
  }
  if (art === "duck") {
    return (
      <svg viewBox="0 0 100 92" width="100%" aria-hidden="true">
        <path d="M14 58 C12 44 24 42 34 46 C36 28 50 14 66 18 C82 22 86 40 76 50 C90 50 94 62 86 74 C78 86 44 90 28 84 C16 79 14 68 14 58 Z" fill="#ecc863" />
        <path d="M84 30 C94 27 98 33 96 38 C92 42 84 42 79 39 Z" fill="#d8894a" />
        <circle cx="68" cy="29" r="3.8" fill="#27303b" />
        <circle cx="69.3" cy="27.7" r="1.2" fill="#fff" />
        <path d="M38 62 C44 72 58 72 66 62" fill="none" stroke="#c9a33f" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (art === "sticker") {
    return (
      <svg viewBox="0 0 100 100" width="100%" aria-hidden="true">
        <circle cx="50" cy="50" r="48" fill="#fff" />
        <circle cx="50" cy="50" r="42" fill="#26405f" />
        <text x="50" y="58" textAnchor="middle" fontFamily="Figtree, sans-serif" fontSize="24" fontWeight="800" letterSpacing="1" fill="#f0d98c">EECS</text>
      </svg>
    );
  }
  if (art === "treat") {
    return (
      <svg viewBox="0 0 100 52" width="100%" aria-hidden="true">
        <path d="M24 10 A13 13 0 0 0 8 26 A13 13 0 0 0 24 42 C30 44 34 38 38 38 H62 C66 38 70 44 76 42 A13 13 0 0 0 92 26 A13 13 0 0 0 76 10 C70 8 66 14 62 14 H38 C34 14 30 8 24 10 Z" fill="#cfa877" stroke="#a9845a" strokeWidth="2.5" />
        <circle cx="42" cy="26" r="2" fill="#a9845a" />
        <circle cx="52" cy="24" r="2" fill="#a9845a" />
        <circle cx="60" cy="28" r="2" fill="#a9845a" />
      </svg>
    );
  }
  if (art === "multimeter") {
    return (
      <svg viewBox="0 0 96 150" width="100%" aria-hidden="true">
        <rect x="3" y="3" width="90" height="144" rx="12" fill="#d8a94f" />
        <rect x="12" y="12" width="72" height="126" rx="7" fill="#2f3741" />
        <rect x="20" y="20" width="56" height="30" rx="3" fill="#bfcdb6" />
        <text x="72" y="42" textAnchor="end" fontFamily="ui-monospace, Menlo, monospace" fontSize="19" fontWeight="600" fill="#2f3741">3.94</text>
        <circle cx="48" cy="86" r="20" fill="#c9ced3" />
        <circle cx="48" cy="86" r="14" fill="#4b5560" />
        <rect x="46" y="72" width="4" height="15" rx="2" fill="#e8ebee" />
        <circle cx="30" cy="124" r="5" fill="#b4545a" />
        <circle cx="48" cy="124" r="5" fill="#111518" />
        <circle cx="66" cy="124" r="5" fill="#b4545a" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 150 36" width="100%" aria-hidden="true">
      <path d="M1 18 H148" stroke="#8f959a" strokeWidth="4" strokeLinecap="round" />
      <rect x="38" y="5" width="74" height="26" rx="11" fill="#d9c09b" />
      <rect x="50" y="5" width="7" height="26" fill="#7d5a3c" />
      <rect x="64" y="5" width="7" height="26" fill="#2f3741" />
      <rect x="78" y="5" width="7" height="26" fill="#b4545a" />
      <rect x="95" y="5" width="6" height="26" fill="#c8a24f" />
    </svg>
  );
};

// --- the banner is a desk: photos and notes you can pick up, throw, and tidy ---
const Desk = () => {
  const zoneRef = useRef(null);
  const itemRefs = useRef({});
  const state = useRef({});
  const moved = useRef(new Set());
  const topZ = useRef(deskItems.length + 2);
  const [messy, setMessy] = useState(false);
  const [tipText, setTipText] = useState(null);
  const tipRef = useRef(null);
  const tipOwner = useRef(null);
  const tipTimer = useRef(null);

  const heroEl = () => zoneRef.current.closest(".hero");
  const isPhone = () => window.innerWidth <= 860;
  const bounds = (el) => {
    const hero = heroEl();
    return {
      minX: -el.offsetWidth * 0.25,
      maxX: hero.clientWidth - el.offsetWidth * 0.75,
      minY: 0,
      maxY: hero.clientHeight - 58 - el.offsetHeight * 0.75,
    };
  };
  const place = (id) => {
    const p = state.current[id];
    const el = itemRefs.current[id];
    if (el) el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`;
    if (tipOwner.current === id) positionTip();
  };
  const positionTip = () => {
    const el = itemRefs.current[tipOwner.current];
    const tip = tipRef.current;
    if (!el || !tip) return;
    const hero = heroEl().getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const left = Math.max(10, Math.min(hero.width - tip.offsetWidth - 10, r.left - hero.left + r.width / 2 - tip.offsetWidth / 2));
    const above = r.top - hero.top - tip.offsetHeight - 10;
    const top = above > 8 ? above : r.bottom - hero.top + 10;
    tip.style.transform = `translate(${left}px, ${top}px)`;
  };
  const showTip = (item, text, linger) => {
    clearTimeout(tipTimer.current);
    tipOwner.current = item.id;
    setTipText(text || item.desc);
    if (linger) tipTimer.current = setTimeout(() => setTipText(null), linger);
  };
  const hideTipSoon = () => {
    clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => {
      tipOwner.current = null;
      setTipText(null);
    }, 1700);
  };

  // the description needs measuring after its text changes
  useLayoutEffect(() => {
    if (tipText) positionTip();
  });
  const homeOf = (item) => {
    const el = itemRefs.current[item.id];
    const spot = isPhone() ? item.phone : item.at;
    if (!el || !spot) return null;
    const hero = heroEl().getBoundingClientRect();
    const zone = zoneRef.current.getBoundingClientRect();
    return {
      x: zone.left - hero.left + spot.x * (zone.width - el.offsetWidth),
      y: zone.top - hero.top + spot.y * (zone.height - el.offsetHeight),
      rot: spot.rot,
    };
  };

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const hero = heroEl().getBoundingClientRect();
    const zone = zoneRef.current.getBoundingClientRect();
    const timers = [];

    deskItems.forEach((item, i) => {
      const el = itemRefs.current[item.id];
      const home = homeOf(item);
      if (!home) return;
      state.current[item.id] = { ...home, baseRot: home.rot, vx: 0, vy: 0 };
      if (reduced) {
        place(item.id);
        el.classList.add("shown");
        return;
      }
      // everything starts in one neat pile, then spreads out across the desk
      el.style.transform = `translate(${zone.left - hero.left + (zone.width - el.offsetWidth) / 2}px, ${zone.top - hero.top + (zone.height - el.offsetHeight) / 2}px) rotate(0deg)`;
      timers.push(
        setTimeout(() => {
          el.classList.add("settling", "shown");
          place(item.id);
        }, 180 + i * 90),
        setTimeout(() => el.classList.remove("settling"), 1300 + i * 90)
      );
    });

    const onResize = () => {
      deskItems.forEach((item) => {
        const el = itemRefs.current[item.id];
        const home = homeOf(item);
        if (!home || !el) return;
        const p = state.current[item.id] || (state.current[item.id] = { ...home, baseRot: home.rot, vx: 0, vy: 0 });
        if (moved.current.has(item.id)) {
          const b = bounds(el);
          p.x = Math.max(b.minX, Math.min(b.maxX, p.x));
          p.y = Math.max(b.minY, Math.min(b.maxY, p.y));
        } else {
          Object.assign(p, home, { baseRot: home.rot });
        }
        el.classList.add("shown");
        place(item.id);
      });
    };
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", onResize);
      Object.values(state.current).forEach((p) => cancelAnimationFrame(p.frame));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startDrag = (e, item) => {
    if (e.button !== undefined && e.button !== 0) return;
    const el = itemRefs.current[item.id];
    const p = state.current[item.id];
    if (!p) return;
    e.preventDefault();
    cancelAnimationFrame(p.frame);
    el.setPointerCapture?.(e.pointerId);
    el.classList.remove("settling");
    el.classList.add("dragging");
    el.style.zIndex = ++topZ.current;
    showTip(item);

    const grabX = e.clientX - p.x;
    const grabY = e.clientY - p.y;
    const startX = e.clientX;
    const startY = e.clientY;
    let lastX = e.clientX;
    let lastY = e.clientY;
    let lastTime = performance.now();
    let dragged = false;

    const onMove = (ev) => {
      if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > 5) dragged = true;
      const b = bounds(el);
      const now = performance.now();
      const dt = Math.max(now - lastTime, 8);
      p.vx = ((ev.clientX - lastX) / dt) * 16;
      p.vy = ((ev.clientY - lastY) / dt) * 16;
      lastX = ev.clientX;
      lastY = ev.clientY;
      lastTime = now;
      p.x = Math.max(b.minX, Math.min(b.maxX, ev.clientX - grabX));
      p.y = Math.max(b.minY, Math.min(b.maxY, ev.clientY - grabY));
      p.rot = p.baseRot + Math.max(-9, Math.min(9, p.vx * 0.7));
      place(item.id);
    };

    const start = { x: p.x, y: p.y };

    const onUp = (ev) => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.classList.remove("dragging");

      // on a phone, a vertical swipe scrolls the page instead, so put the item back
      if (ev.type === "pointercancel") {
        Object.assign(p, start, { rot: p.baseRot, vx: 0, vy: 0 });
        place(item.id);
        tipOwner.current = null;
        clearTimeout(tipTimer.current);
        setTipText(null);
        return;
      }
      hideTipSoon();

      if (!dragged) {
        tapItem(item, el, ev);
        return;
      }
      if (item.id === "treat") {
        giveTreat(item, el);
        return;
      }
      moved.current.add(item.id);
      setMessy(true);
      if (prefersReducedMotion() || performance.now() - lastTime > 90) {
        p.vx = 0;
        p.vy = 0;
      }
      // let go and it slides a little, then settles flat
      const glide = () => {
        const b = bounds(el);
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.91;
        p.vy *= 0.91;
        if (p.x < b.minX || p.x > b.maxX) {
          p.x = Math.max(b.minX, Math.min(b.maxX, p.x));
          p.vx *= -0.5;
        }
        if (p.y < b.minY || p.y > b.maxY) {
          p.y = Math.max(b.minY, Math.min(b.maxY, p.y));
          p.vy *= -0.5;
        }
        p.rot += (p.baseRot - p.rot) * 0.14;
        place(item.id);
        if (Math.hypot(p.vx, p.vy) > 0.15 || Math.abs(p.rot - p.baseRot) > 0.1) p.frame = requestAnimationFrame(glide);
      };
      p.frame = requestAnimationFrame(glide);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
  };

  // the dog runs over, eats the treat, and a new one appears where it started
  const giveTreat = (item, el) => {
    const p = state.current[item.id];
    p.vx = 0;
    p.vy = 0;
    p.rot = p.baseRot;
    place(item.id);
    el.classList.add("claimed");
    const r = el.getBoundingClientRect();
    const eaten = () => {
      burstHearts(r.left + r.width / 2, r.top + r.height / 2, 5);
      el.classList.add("eaten");
      showTipGone();
      setTimeout(() => {
        const home = homeOf(item);
        if (home) Object.assign(p, home, { baseRot: home.rot });
        place(item.id);
        el.classList.remove("eaten", "claimed");
      }, 2200);
    };
    if (prefersReducedMotion()) eaten();
    else dogBus.dispatchEvent(Object.assign(new Event("treat"), { detail: { x: r.left + r.width / 2, y: r.top + r.height / 2, onEaten: eaten } }));
  };

  const showTipGone = () => {
    tipOwner.current = null;
    clearTimeout(tipTimer.current);
    setTipText(null);
  };

  const tapItem = (item, el, ev) => {
    if (item.id === "duck") {
      squeak();
      showTip(item, "quack!", 1200);
    }
    if (prefersReducedMotion()) return;
    el.firstChild?.animate?.(
      [{ transform: "scale(1)" }, { transform: "scale(1.04, 0.96)" }, { transform: "scale(0.98, 1.02)" }, { transform: "scale(1)" }],
      { duration: 340, easing: "ease-out" }
    );
    if (item.id === "me") burstHearts(ev.clientX, ev.clientY, 5);
  };

  const nudge = (e, item) => {
    const steps = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] };
    const step = steps[e.key];
    if (!step) return;
    e.preventDefault();
    const el = itemRefs.current[item.id];
    const p = state.current[item.id];
    const b = bounds(el);
    p.x = Math.max(b.minX, Math.min(b.maxX, p.x + step[0]));
    p.y = Math.max(b.minY, Math.min(b.maxY, p.y + step[1]));
    el.style.zIndex = ++topZ.current;
    place(item.id);
    moved.current.add(item.id);
    setMessy(true);
  };

  const tidy = () => {
    deskItems.forEach((item) => {
      const el = itemRefs.current[item.id];
      const home = homeOf(item);
      const p = state.current[item.id];
      if (!home || !p) return;
      cancelAnimationFrame(p.frame);
      Object.assign(p, home, { baseRot: home.rot, vx: 0, vy: 0 });
      el.classList.add("settling");
      setTimeout(() => el.classList.remove("settling"), 800);
      place(item.id);
    });
    moved.current.clear();
    setMessy(false);
  };

  return (
    <>
      <div className="desk-zone" ref={zoneRef} aria-hidden="false">
        <p className="desk-hint">
          {messy ? (
            <button type="button" className="tidy" onClick={tidy}>
              tidy up
            </button>
          ) : (
            <>
              <span className="hint-mouse">pick things up to read about them</span>
              <span className="hint-touch">slide things sideways to pick them up</span>
            </>
          )}
        </p>
      </div>
      {deskItems.map((item, i) => (
        <div
          key={item.id}
          ref={(el) => {
            itemRefs.current[item.id] = el;
          }}
          className={`desk-item desk-${item.kind}${item.phone ? "" : " desk-no-phone"}`}
          style={{ zIndex: i + 2 }}
          tabIndex={0}
          role="group"
          aria-label={`${item.alt || item.label || item.text}. Drag it, or move it with the arrow keys.`}
          onPointerDown={(e) => startDrag(e, item)}
          onKeyDown={(e) => nudge(e, item)}
          onFocus={(e) => {
            if (e.target.matches(":focus-visible")) showTip(item);
          }}
          onBlur={hideTipSoon}
        >
          {item.kind === "object" ? (
            <div className={`object-art art-${item.art}`}>
              <DeskObject art={item.art} />
            </div>
          ) : item.kind === "photo" ? (
            <figure>
              <img src={item.src} alt="" draggable="false" style={{ objectPosition: item.focus }} />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ) : (
            <p style={{ background: item.color }}>{item.text}</p>
          )}
        </div>
      ))}
      <div ref={tipRef} className={tipText ? "desk-tip shown" : "desk-tip"} role="status">
        {tipText}
      </div>
    </>
  );
};

// A real little desk drawer. Opening it brings your resume up on a sheet of paper.
const ResumeDrawer = () => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);

  const openDrawer = () => {
    setOpen(true);
    setTimeout(() => dialogRef.current?.showModal(), prefersReducedMotion() ? 0 : 320);
  };
  const close = () => dialogRef.current?.close();

  return (
    <div className="desk-front">
      <button type="button" className={open ? "drawer open" : "drawer"} onClick={openDrawer} aria-haspopup="dialog">
        <span className="drawer-label">resume</span>
        <span className="drawer-handle" aria-hidden="true" />
      </button>
      {createPortal(
      <dialog ref={dialogRef} className="resume" aria-label="Resume" onClose={() => setOpen(false)} onClick={(e) => e.target === dialogRef.current && close()}>
        <div className="resume-actions">
          {contact.resumeUrl ? (
            <a className="button" href={contact.resumeUrl} download>
              Download PDF
            </a>
          ) : (
            <button type="button" className="button" onClick={() => window.print()}>
              Print or save as PDF
            </button>
          )}
          <button type="button" className="resume-close" onClick={close} aria-label="Close resume">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <article className="resume-paper">
          <header>
            <h2>{profile.name}</h2>
            <p>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              {profile.links.map((l) => (
                <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              ))}
            </p>
          </header>
          <section>
            <h3>Education</h3>
            <div className="resume-row">
              <strong>{education.school}</strong>
              <span>{education.dates}</span>
            </div>
            <p>{education.degree}</p>
            <p>{education.note}</p>
            <p>Relevant coursework: {education.coursework.join(", ")}</p>
          </section>
          <section>
            <h3>Experience</h3>
            {timeline.map((t) => {
              const entry = log.find((e) => e.slug === t.log);
              return (
                <div key={t.role} className="resume-item">
                  <div className="resume-row">
                    <strong>{t.role}</strong>
                    <span>{t.dates}</span>
                  </div>
                  <p className="resume-org">{t.org}</p>
                  {entry && !timeline.slice(0, timeline.indexOf(t)).some((other) => other.log === t.log) && <p>{entry.summary}</p>}
                </div>
              );
            })}
          </section>
          <section>
            <h3>Skills</h3>
            {skills.map((k) => (
              <p key={k.group}>
                <strong>{k.group}:</strong> {k.items}
              </p>
            ))}
          </section>
        </article>
      </dialog>,
        document.body
      )}
    </div>
  );
};

const Hero = () => {
  return (
    <section className="hero">
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
        <Desk />
      </div>
      <ResumeDrawer />
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
  const [open, setOpen] = useState(null);
  const entries = filter === "All" ? log : log.filter((e) => e.type === filter);
  const filtersRef = useRef(null);
  const gridRef = useRef(null);
  const lastSpots = useRef(new Map());
  const [pill, setPill] = useState(null);

  // slide the filter highlight to whichever filter is selected
  useLayoutEffect(() => {
    const measure = () => {
      const button = filtersRef.current?.querySelector('[aria-pressed="true"]');
      if (button) setPill({ x: button.offsetLeft, y: button.offsetTop, w: button.offsetWidth, h: button.offsetHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [filter]);

  // when cards change places, glide each one from its old spot to its new one
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const origin = grid.getBoundingClientRect();
    const reduced = prefersReducedMotion();
    grid.querySelectorAll("[data-slug]").forEach((card) => {
      const r = card.getBoundingClientRect();
      const spot = { x: r.left - origin.left, y: r.top - origin.top };
      const old = lastSpots.current.get(card.dataset.slug);
      if (old && !reduced && (old.x !== spot.x || old.y !== spot.y)) {
        card.animate([{ transform: `translate(${old.x - spot.x}px, ${old.y - spot.y}px)` }, { transform: "none" }], {
          duration: 420,
          easing: "cubic-bezier(0.3, 0.8, 0.3, 1)",
        });
      }
      lastSpots.current.set(card.dataset.slug, spot);
    });
  }, [filter, open]);

  const toggle = (slug, button) => {
    const opening = open !== slug;
    setOpen(opening ? slug : null);
    if (opening && !prefersReducedMotion()) {
      setTimeout(() => {
        const card = button.closest(".log-card");
        if (!card) return;
        // a tall card on a phone lines up with the top; otherwise just bring it into view
        const tall = card.offsetHeight > window.innerHeight * 0.7;
        card.scrollIntoView({ behavior: "smooth", block: tall ? "start" : "nearest" });
      }, 420);
    }
  };

  return (
    <section id="log" className="block reveal">
      <div className="block-head">
        <div>
          <h2>Project log</h2>
          <p className="block-intro">What I’ve been working on. Open a card to read more.</p>
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
                if (t !== "All" && !log.some((e) => e.slug === open && e.type === t)) setOpen(null);
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <ul className="log-grid" ref={gridRef}>
        {entries.map((e, i) => {
          const isOpen = open === e.slug;
          return (
            <li key={e.slug} data-slug={e.slug} className={`log-card card-${e.type.toLowerCase()}${isOpen ? " open" : ""}`} style={{ "--i": i }}>
              <button type="button" className="card-head" aria-expanded={isOpen} onClick={(ev) => toggle(e.slug, ev.currentTarget)}>
                <span className="card-top">
                  <TypeLabel type={e.type} />
                  <span className="card-dates">{e.dates}</span>
                </span>
                <span className="card-title">{e.title}</span>
                <span className="card-summary">{e.summary}</span>
                <span className="card-toggle" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div className="card-panel" inert={!isOpen}>
                <div className={e.tools || e.fullPage ? "card-panel-inner" : "card-panel-inner solo"}>
                  <div className="card-detail">
                    <p className="card-overview">{e.overview}</p>
                    {e.did && (
                      <>
                        <h3>What I did</h3>
                        <ul className="did-list">
                          {e.did.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {e.learned && (
                      <>
                        <h3>What I learned</h3>
                        <p className="card-overview">{e.learned}</p>
                      </>
                    )}
                  </div>
                  {(e.tools || e.fullPage) && (
                    <div className="card-side">
                      {e.tools && (
                        <>
                          <h3>Tools and methods</h3>
                          <p>{e.tools.join(", ")}</p>
                        </>
                      )}
                      {e.fullPage && (
                        <a className="card-open" href={`#/log/${e.slug}`}>
                          See the full page
                          <Chevron />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const TYPE_COLORS = { Research: "#6f879c", Engineering: "#ad8f5e", Teaching: "#7d9484", Leadership: "#9c7a84" };

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
  const [only, setOnly] = useState(null);
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
          <p className="block-intro">Each line steps up while I held that role. Slide across it to travel through time, or tap a role for a short summary.</p>
        </div>
      </div>
      <div className="tl-legend" role="group" aria-label="Highlight one kind of role">
        {logTypes.map((type) => (
          <button key={type} type="button" aria-pressed={only === type} style={{ "--type": TYPE_COLORS[type] }} onClick={() => setOnly(only === type ? null : type)}>
            {type}
          </button>
        ))}
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
            <div
              key={t.role}
              className={`tl-item${isActive ? " active" : ""}${isOpen ? " open" : ""}${only && entry?.type !== only ? " faded" : ""}`}
              style={{ "--i": i, "--type": TYPE_COLORS[entry?.type] || "#3c4b5c" }}
            >
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
                  {entry?.fullPage && (
                    <a href={`#/log/${t.log}`}>
                      See the full page
                      <Chevron />
                    </a>
                  )}
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

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <section id="contact" className="block reveal">
      <div className="contact-card">
        <div>
          <h2>Contact</h2>
          <p className="contact-lead">{contact.lead}</p>
          <a className="contact-email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </div>
        <div className="contact-actions">
          <a className="contact-button primary" href={`mailto:${contact.email}`}>
            Send an email
          </a>
          <button type="button" className="contact-button" onClick={copy} aria-live="polite">
            {copied ? "Copied" : "Copy email"}
          </button>
          <ExternalLinks links={profile.links} />
        </div>
      </div>
    </section>
  );
};

const Home = () => (
  <>
    <Hero />
    <main className="wrap">
      <Facts />
      <ProjectLog />
      <Experience />
      <EducationSkills />
      <Contact />
    </main>
  </>
);

const LogDetail = ({ slug }) => {
  const fullPages = log.filter((e) => e.fullPage);
  const index = fullPages.findIndex((e) => e.slug === slug);
  const entry = fullPages[index];

  if (!entry) {
    return (
      <main className="wrap detail">
        <h1 className="detail-title">This project doesn’t have its own page</h1>
        <p className="muted">You can read about it in the project log.</p>
        <a className="back after" href="#/log">
          Back to project log
        </a>
      </main>
    );
  }

  const next = fullPages[(index + 1) % fullPages.length];
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
        <span className="muted">Other research</span>
        <span className="next-title">
          <span>{next.title}</span>
          <Chevron />
        </span>
      </a>
    </main>
  );
};

export default function App() {
  const route = useRoute();
  const isDetail = route.startsWith("log/");
  const current = useCurrentSection(!isDetail);
  const cameFromPage = useRef(false);
  useReveal(!isDetail);

  useEffect(() => {
    const entry = isDetail ? log.find((e) => e.slug === route.slice(4) && e.fullPage) : null;
    document.title = entry ? `${entry.title} | ${profile.name}` : profile.name;

    const target = !isDetail && route ? document.getElementById(route) : null;
    // smooth when moving around the home page, instant when arriving from another page
    if (target) target.scrollIntoView({ behavior: cameFromPage.current || prefersReducedMotion() ? "auto" : "smooth" });
    else window.scrollTo({ top: 0, behavior: "auto" });
    cameFromPage.current = isDetail;
  }, [route, isDetail]);

  return (
    <div className="app">
      <TopBar route={route} current={current} />
      {isDetail ? <LogDetail slug={route.slice(4)} /> : <Home />}
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
