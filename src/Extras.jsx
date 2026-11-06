import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { dogBus } from "./dogBus.js";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasMouse = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// The headline: letters lean toward your cursor and get bolder as it comes near.
export const ReactiveTitle = ({ text }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!hasMouse() || reducedMotion()) return;
    const letters = [...ref.current.querySelectorAll(".title-letter")];
    const reach = 190;
    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        letters.forEach((letter) => {
          const box = letter.getBoundingClientRect();
          const dx = e.clientX - (box.left + box.width / 2);
          const dy = e.clientY - (box.top + box.height / 2);
          const near = Math.max(0, 1 - Math.hypot(dx, dy) / reach);
          letter.style.fontVariationSettings = `"wght" ${Math.round(450 + near * 230)}, "SOFT" 100, "WONK" 1`;
          letter.style.translate = `${(dx * near * 0.05).toFixed(1)}px ${(dy * near * 0.09 - near * 6).toFixed(1)}px`;
        });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  let index = 0;
  return (
    <h1 ref={ref} aria-label={text}>
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
      onClick={() => {
        setPulled(true);
        setDark((d) => !d);
      }}
      onAnimationEnd={() => setPulled(false)}
    >
      <span className="light-cord" aria-hidden="true" />
      <span className="light-knob" aria-hidden="true" />
    </button>
  );
};

// A circuit trace down the side of the page. It lights up as you scroll,
// with a solder pad at each section.
export const CircuitTrace = ({ selectors }) => {
  const svgRef = useRef(null);
  const litRef = useRef(null);
  const dotRef = useRef(null);
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
          <path className="trace-lit" ref={litRef} d={shape.d} />
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
