import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { dogBus } from "./dogBus.js";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasMouse = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// The headline: letters lean toward your cursor and get bolder as it comes near.
export const ReactiveTitle = ({ text, onSwitch, switchLabel }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!hasMouse() || reducedMotion()) return;
    const hero = ref.current.closest(".hero") || ref.current;
    const letters = [...ref.current.querySelectorAll(".title-letter")];
    const reach = 170;
    let centers = [];
    let lit = new Set();
    let frame = 0;
    let x = 0;
    let y = 0;
    // measure once when the cursor arrives, not on every move
    const measure = () => {
      centers = letters.map((l) => {
        const b = l.getBoundingClientRect();
        return [b.left + b.width / 2 + window.scrollX, b.top + b.height / 2 + window.scrollY];
      });
    };
    const draw = () => {
      frame = 0;
      const next = new Set();
      letters.forEach((letter, i) => {
        const dx = x + window.scrollX - centers[i][0];
        const dy = y + window.scrollY - centers[i][1];
        const near = Math.max(0, 1 - Math.hypot(dx, dy) / reach);
        if (near > 0) {
          next.add(i);
          letter.style.translate = `0 ${(-near * 7).toFixed(1)}px`;
          letter.style.color = `color-mix(in srgb, #f8d568 ${Math.round(near * 100)}%, #f4f1e8)`;
        } else if (lit.has(i)) {
          letter.style.translate = "";
          letter.style.color = "";
        }
      });
      lit = next;
    };
    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const onEnter = () => measure();
    const onLeave = () => {
      x = -9999;
      y = -9999;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    measure();
    hero.addEventListener("pointerenter", onEnter);
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointerenter", onEnter);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", measure);
    };
  }, []);

  let index = 0;
  return (
    <h1
      ref={ref}
      aria-label={text}
      className="switchable"
      role="button"
      tabIndex={0}
      title={switchLabel}
      onClick={onSwitch}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSwitch?.();
        }
      }}
    >
      {text.split(" ").map((word) => (
        <span className="title-word" aria-hidden="true" key={word}>
          {[...word].map((ch, i) => (
            <span className="title-letter" key={i} style={{ "--n": index++ }}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
};

// A pull cord that turns the whole site's lights off, and the room's with it.
export const LightSwitch = () => {
  const [dark, setDark] = useState(() => {
    try {
      return window.localStorage.getItem("lights") === "off";
    } catch {
      return false;
    }
  });
  const [pulled, setPulled] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    dogBus.dispatchEvent(new CustomEvent("lights", { detail: { off: dark } }));
    try {
      window.localStorage.setItem("lights", dark ? "off" : "on");
    } catch {
      // the choice just won't be remembered
    }
  }, [dark]);

  return (
    <button
      type="button"
      className={`light-switch${pulled ? " pulled" : ""}`}
      aria-pressed={dark}
      aria-label={dark ? "Turn the lights on" : "Turn the lights off"}
      onClick={(e) => {
        setPulled(true);
        const next = !dark;
        const change = () => {
          document.documentElement.dataset.theme = next ? "dark" : "light";
          flushSync(() => setDark(next));
        };
        if (!document.startViewTransition || reducedMotion()) {
          change();
          return;
        }
        // the new lighting spreads out from the cord in a circle
        const box = e.currentTarget.getBoundingClientRect();
        const x = box.left + box.width / 2;
        const y = box.bottom;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        const transition = document.startViewTransition(change);
        transition.ready
          .then(() => {
            document.documentElement.animate(
              { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
              { duration: 750, easing: "cubic-bezier(0.3, 0.7, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
            );
          })
          .catch(() => {});
      }}
      onAnimationEnd={() => setPulled(false)}
    >
      <span className="light-cord" aria-hidden="true" />
      <span className="light-knob" aria-hidden="true" />
    </button>
  );
};

const point0 = (path, at) => path.getPointAtLength(at).y;

// A circuit trace down the side of the page. It lights up as you scroll,
// with a solder pad at each section.
export const CircuitTrace = ({ selectors }) => {
  const svgRef = useRef(null);
  const litRef = useRef(null);
  const dotRef = useRef(null);
  const clipRef = useRef(null);
  const [shape, setShape] = useState(null);

  useLayoutEffect(() => {
    const parent = svgRef.current.parentElement;
    const measure = () => {
      const top = parent.getBoundingClientRect().top;
      const pads = selectors
        .map((s) => document.querySelector(s))
        .filter(Boolean)
        .map((el) => Math.round(el.getBoundingClientRect().top - top + 24));
      const height = parent.offsetHeight;
      const left = 8;
      const right = 26;
      let d = `M${left} 0`;
      pads.forEach((y) => {
        d += ` L${left} ${y - 34} L${right} ${y - 16} L${right} ${y} L${right} ${y + 16} L${left} ${y + 34}`;
      });
      d += ` L${left} ${height}`;
      setShape({ d, height, pads, right });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!shape) return;
    const lit = litRef.current;
    const length = lit.getTotalLength();
    let frame = 0;
    const draw = () => {
      const svgTop = svgRef.current.getBoundingClientRect().top;
      const y = Math.max(0, Math.min(shape.height, window.innerHeight * 0.6 - svgTop));
      // walk along the path to the point at this height
      let low = 0;
      let high = length;
      for (let i = 0; i < 16; i++) {
        const mid = (low + high) / 2;
        if (lit.getPointAtLength(mid).y < y) low = mid;
        else high = mid;
      }
      lit.style.strokeDasharray = `${low} ${length}`;
      clipRef.current.setAttribute("height", point0(lit, low));
      const point = lit.getPointAtLength(low);
      dotRef.current.setAttribute("cx", point.x);
      dotRef.current.setAttribute("cy", point.y);
      svgRef.current.querySelectorAll(".trace-pad").forEach((pad) => {
        pad.classList.toggle("on", Number(pad.getAttribute("cy")) <= y);
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [shape]);

  return (
    <svg ref={svgRef} className="trace" width="34" height={shape?.height ?? 0} aria-hidden="true">
      {shape && (
        <>
          <path className="trace-base" d={shape.d} />
          <clipPath id="trace-clip">
            <rect ref={clipRef} x="-10" y="0" width="60" height="0" />
          </clipPath>
          <path className="trace-lit" ref={litRef} d={shape.d} />
          <path className="trace-current" d={shape.d} clipPath="url(#trace-clip)" />
          {shape.pads.map((y) => (
            <circle key={y} className="trace-pad" cx={shape.right} cy={y} r="5" />
          ))}
          <circle className="trace-dot" ref={dotRef} r="3.5" />
        </>
      )}
    </svg>
  );
};

// Project cards tilt toward the cursor, with a shine that follows it.
export const useCardTilt = () => {
  const current = useRef(null);
  const clear = () => {
    const card = current.current;
    if (!card) return;
    card.style.removeProperty("--rx");
    card.style.removeProperty("--ry");
    card.classList.remove("tilting");
    current.current = null;
  };
  return {
    onPointerMove: (e) => {
      if (e.pointerType !== "mouse" || reducedMotion()) return;
      const card = e.target.closest(".log-card");
      if (card !== current.current) clear();
      if (!card || card.classList.contains("open")) return;
      current.current = card;
      const box = card.getBoundingClientRect();
      const x = (e.clientX - box.left) / box.width;
      const y = (e.clientY - box.top) / box.height;
      card.classList.add("tilting");
      card.style.setProperty("--rx", `${((0.5 - y) * 7).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${((x - 0.5) * 7).toFixed(2)}deg`);
      card.style.setProperty("--sx", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--sy", `${(y * 100).toFixed(1)}%`);
    },
    onPointerLeave: clear,
  };
};

// The time where I am, in the footer.
export const LocalTime = () => {
  const format = () =>
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Detroit", hour: "numeric", minute: "2-digit" }).format(new Date()).toLowerCase();
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="local-time">
      <i aria-hidden="true" />
      It’s {time} in Ann Arbor
    </span>
  );
};

// A quick menu: press Ctrl K (or ⌘K on a Mac) or "/" to jump anywhere.
export const QuickMenu = ({ commands }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [note, setNote] = useState("");
  const inputRef = useRef(null);
  const lastFocus = useRef(null);
  const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  const show = () => {
    lastFocus.current = document.activeElement;
    setQuery("");
    setIndex(0);
    setNote("");
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    lastFocus.current?.focus?.();
  };

  useEffect(() => {
    const onKey = (e) => {
      const typing = /input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing && !open)) {
        e.preventDefault();
        if (open) hide();
        else show();
      }
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-quick-menu", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-quick-menu", onOpen);
    };
  });

  useEffect(() => {
    if (open) inputRef.current?.focus();
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const shown = commands.filter((c) => words.every((w) => `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase().includes(w)));
  const groups = [...new Set(shown.map((c) => c.group))];

  const run = (command) => {
    const result = command.run();
    if (typeof result === "string") {
      setNote(result);
      setTimeout(hide, 900);
    } else {
      hide();
    }
  };

  if (!open) return null;
  let n = -1;
  return (
    <div className="qm-backdrop" onMouseDown={(e) => e.target === e.currentTarget && hide()}>
      <div className="qm" role="dialog" aria-modal="true" aria-label="Quick menu">
        <div className="qm-search">
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M13 13l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            placeholder="Where to?"
            aria-label="Search the site"
            aria-controls="qm-list"
            aria-activedescendant={shown[index] ? `qm-${index}` : undefined}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => Math.min(i + 1, shown.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && shown[index]) {
                e.preventDefault();
                run(shown[index]);
              } else if (e.key === "Escape") {
                e.preventDefault();
                hide();
              }
            }}
          />
          <kbd>esc</kbd>
        </div>
        {note ? (
          <p className="qm-note" role="status">
            {note}
          </p>
        ) : (
          <ul className="qm-list" id="qm-list" role="listbox">
            {groups.map((group) => (
              <li key={group} role="presentation">
                <p className="qm-group">{group}</p>
                <ul role="presentation">
                  {shown
                    .filter((c) => c.group === group)
                    .map((c) => {
                      n += 1;
                      const i = shown.indexOf(c);
                      return (
                        <li
                          key={c.label}
                          id={`qm-${i}`}
                          role="option"
                          aria-selected={i === index}
                          className={i === index ? "on" : undefined}
                          onMouseMove={() => i !== index && setIndex(i)}
                          onClick={() => run(c)}
                        >
                          <span>{c.label}</span>
                          {c.hint && <small>{c.hint}</small>}
                        </li>
                      );
                    })}
                </ul>
              </li>
            ))}
            {shown.length === 0 && <li className="qm-empty">Nothing matches “{query}”. Try “research” or “email”.</li>}
          </ul>
        )}
        <p className="qm-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> to move, <kbd>enter</kbd> to go
          </span>
          <span>
            <kbd>{mac ? "⌘" : "Ctrl"}</kbd>
            <kbd>K</kbd> any time
          </span>
        </p>
      </div>
    </div>
  );
};

// A soft dot that follows the cursor and turns into a ring that says what a click will do.
const cursorLabel = (el) => {
  if (!el?.closest) return null;
  if (el.closest("input:not([type=range]), textarea, [contenteditable=true]")) return { kind: "text" };
  if (el.closest(".desk-item")) return { kind: "label", text: "Drag" };
  const title = el.closest("h1.switchable");
  if (title) return { kind: "label", text: title.getAttribute("aria-label").startsWith("Halo") ? "Hi!" : "Halo!" };
  const head = el.closest(".card-head");
  if (head) return { kind: "label", text: head.getAttribute("aria-expanded") === "true" ? "Close" : "Open" };
  const hit = el.closest(".room-hit");
  if (hit) return { kind: "label", text: hit.getAttribute("aria-label") === "Contact me" ? "Say hi" : "Play" };
  if (el.closest(".timeline")) return { kind: "label", text: "Slide" };
  if (el.closest(".puppy")) return { kind: "label", text: "Pet" };
  if (el.closest("a[target=_blank]")) return { kind: "label", text: "Visit" };
  if (el.closest("a, button, [role=option], input[type=range], label, summary")) return { kind: "link" };
  return null;
};

export const Cursor = () => {
  const ref = useRef(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    let showing = false;
    const draw = () => {
      frame = 0;
      if (ref.current) ref.current.style.transform = `translate(${x + 16}px, ${y + 18}px)`;
    };
    const onMove = (e) => {
      if (!showing) return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    // only when the pointer moves onto a new element, not on every move
    const onOver = (e) => {
      if (e.pointerType !== "mouse") return;
      const hint = cursorLabel(e.target);
      const label = hint?.kind === "label" ? hint.text : "";
      showing = Boolean(label);
      x = e.clientX;
      y = e.clientY;
      draw();
      setText(label);
    };
    const onLeave = () => {
      showing = false;
      setText("");
    };
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={`cursor-hint${text ? " on" : ""}`} aria-hidden="true">
      {text}
    </div>
  );
};
