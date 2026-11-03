import React, { useEffect, useRef, useState } from "react";
import { contact, profile } from "./content.js";

const ROWS = 46;
const FPS = 12;

const COLORS = {
  k: "#2b2230", // hair
  K: "#463a4f", // hair highlight
  s: "#ecc7a2", // skin
  d: "#d7a981", // skin shadow
  g: "#6d6170", // glasses
  w: "#f1f6f8", // lens
  e: "#23262e", // eye
  m: "#c9828a", // mouth
  b: "#20232b", // black shirt
  B: "#3a3f4a", // shirt highlight
  p: "#8f949e", // grey pants
  P: "#6f747e", // pants shadow
  h: "#3b3128", // shoes
};

const FRONT = [
  ".....kkkkk.....",
  "...kkKKKkkkk...",
  "..kkKkkkkkkkk..",
  ".kkKkkkkkkkkkk.",
  ".kkkkssssskkkk.",
  ".kkksssssssskk.",
  ".kkssssssssskk.",
  ".kkggggsggggkk.",
  ".kkgsegggesgkk.",
  ".kkgsegsgesgkk.",
  ".kkggggsggggkk.",
  ".kkssssssssskk.",
  ".kkdssmmmssdkk.",
  ".kkkdsssssdkkk.",
  ".kkkkkssskkkkk.",
  ".kkbbsssssbbkk.",
  ".kkbbsssssbbkk.",
  ".kkbBbbbbbbbkk.",
  ".ssbbbbbbbbbss.",
  ".ssbbbbbbbbbss.",
  ".ssbbbbbbbbbss.",
  "..sbbbbbbbbbs..",
  "...bbbbbbbbb...",
  "...ppppppppp...",
  "...ppppPpppp...",
  "...pppp.Pppp...",
  "...pppp.Pppp...",
  "...pppp.Pppp...",
  "...pppp.Pppp...",
  "...pppp.Pppp...",
  "...hhhh.hhhh...",
  "...hhhh.hhhh...",
];
// the same pose with the right arm taken away, for waving
const FRONT_WAVE = FRONT.map((row, j) => (j >= 18 && j <= 21 ? `${row.slice(0, 12)}...` : row));

// side view, walking right; the legs are swapped in below this
const SIDE_TOP = [
  ".....kkkkkk....",
  "...kkKKKkkkkk..",
  "..kkKkkkkkkkkk.",
  ".kkkkkkkkkkkkk.",
  ".kkkkkkkkksssk.",
  ".kkkkkkksssssss",
  ".kkkkkkksssssss",
  ".kkkkkkssggggss",
  ".kkkkkkssgsegss",
  ".kkkkkkssgsegss",
  ".kkkkkkssggggss",
  ".kkkkkkssssssss",
  ".kkkkkkdsssmmss",
  ".kkkkkkkdsssss.",
  ".kkkkkkkkssss..",
  ".kkkkbbbbssss..",
  ".kkkkbbbbsssb..",
  ".kkkkbbBbbbbb..",
  "....bbbbbbbbb..",
  "....bbbbbbbbb..",
  "....bbbbbbbbb..",
  "....bbbbbbbbb..",
  "....bbbbbbbbb..",
];
const LEGS_APART = [
  "....ppppppp....",
  "...pppp.pppp...",
  "...ppp...ppp...",
  "..ppp.....ppp..",
  "..ppp.....ppp..",
  "..pp.......pp..",
  "..pp.......pp..",
  ".hhh.......hhh.",
  ".hhh.......hhh.",
];
const LEGS_TOGETHER = [
  "....ppppppp....",
  "....pppPppp....",
  "....pppPpp.....",
  "....pppPpp.....",
  "....pppPpp.....",
  "....pppPpp.....",
  "....pppPpp.....",
  "....hhhhhh.....",
  "....hhhhhh.....",
];

const WALL = "#d6dde4";
const WALL_DOT = "#ccd4dc";

export default function Contact() {
  const dialogue = contact.dialogue;
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const scene = useRef({ x: -18, arrived: false, started: false, hop: 0, wave: 0 });

  const [arrived, setArrived] = useState(false);
  const [nodeId, setNodeId] = useState("start");
  const [typed, setTyped] = useState(0);
  const [copied, setCopied] = useState(false);
  const [topic, setTopic] = useState(null);

  const node = dialogue[nodeId];
  const text = copied ? dialogue.copiedText : node.text;
  const done = typed >= text.length;
  const subject = encodeURIComponent(topic?.subject || contact.defaultSubject);
  const mailto = `mailto:${contact.email}?subject=${subject}`;

  // the scene: a little room with me walking in from the left
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = scene.current;
    let W = 200;
    let scale = 5;
    let frame = 0;
    let timer;

    const draw = () => {
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      const R = (c, x, y, w, h) => {
        ctx.fillStyle = c;
        ctx.fillRect(x, y, w, h);
      };
      const sprite = (rows, x, y) => {
        rows.forEach((row, j) => {
          for (let i = 0; i < row.length; i++) {
            const c = COLORS[row[i]];
            if (c) R(c, x + i, y + j, 1, 1);
          }
        });
      };

      // wall and floor
      R(WALL, 0, 0, W, 28);
      for (let y = 4; y < 26; y += 8) for (let x = y % 16 === 4 ? 2 : 6; x < W; x += 8) R(WALL_DOT, x, y, 1, 1);
      R("#bcc6d0", 0, 26, W, 2);
      R("#f1ece1", 0, 28, W, 2);
      for (let row = 0; row < 4; row++) {
        const y = 30 + row * 4;
        R(row % 2 ? "#ad8359" : "#b98f66", 0, y, W, 4);
        R("#8f6a49", 0, y + 3, W, 1);
        for (let x = (row * 23) % 41; x < W; x += 41) R("#8f6a49", x, y, 1, 3);
      }

      const walking = !s.arrived;
      const y = 12 - (s.hop > 0 ? [0, 2, 4, 5, 4, 2][s.hop % 6] : 0);
      const x = Math.round(s.x);
      R("#8f6a49", x + 1, 44, 13, 1);

      if (walking) {
        const step = frame % 4;
        const legs = step % 2 === 0 ? LEGS_APART : LEGS_TOGETHER;
        const bob = step % 2 === 0 ? 0 : -1;
        sprite(SIDE_TOP, x, y + bob);
        sprite(legs, x, y + SIDE_TOP.length + bob);
        // the arm swings as I walk
        const armX = x + (step === 0 ? 5 : step === 2 ? 10 : 7);
        R(COLORS.b, armX, y + bob + 17, 2, 2);
        R(COLORS.s, armX, y + bob + 19, 2, 4);
      } else {
        const waving = s.wave > 0;
        sprite(waving ? FRONT_WAVE : FRONT, x, y);
        // blink now and then
        if (frame % 46 < 2) {
          R(COLORS.s, x + 5, y + 8, 1, 2);
          R(COLORS.s, x + 9, y + 8, 1, 2);
          R(COLORS.e, x + 5, y + 9, 1, 1);
          R(COLORS.e, x + 9, y + 9, 1, 1);
        }
        // wave after you pick something
        if (waving) {
          const lean = s.wave % 4 < 2 ? 0 : 1;
          R(COLORS.b, x + 12, y + 17, 2, 2);
          R(COLORS.s, x + 13 + lean, y + 11, 2, 6);
          R(COLORS.s, x + 13, y + 16, 2, 2);
        }
      }
    };

    const tick = () => {
      frame += 1;
      if (s.started && !s.arrived) {
        s.x += s.speed;
        if (s.x >= s.target) {
          s.x = s.target;
          s.arrived = true;
          setArrived(true);
        }
      }
      if (s.hop > 0) s.hop -= 1;
      if (s.wave > 0) s.wave -= 1;
      draw();
    };

    const size = () => {
      const width = wrapRef.current.clientWidth;
      scale = width < 640 ? 3 : 6;
      W = Math.ceil(width / scale);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * ratio;
      canvas.height = ROWS * scale * ratio;
      canvas.style.height = `${ROWS * scale}px`;
      scale *= ratio;
      W = Math.ceil(canvas.width / scale);
      s.target = Math.round(W * 0.44);
      s.speed = (s.target + 16) / 26;
      if (s.arrived) s.x = s.target;
      draw();
    };

    const resize = new ResizeObserver(size);
    resize.observe(wrapRef.current);
    size();

    if (reduced) {
      s.started = true;
      s.arrived = true;
      s.x = s.target;
      setArrived(true);
      setTyped(Infinity);
      draw();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) s.started = true;
      },
      { threshold: 0.45 }
    );
    observer.observe(canvas);
    timer = setInterval(tick, 1000 / FPS);

    return () => {
      clearInterval(timer);
      resize.disconnect();
      observer.disconnect();
    };
  }, []);

  // the words type out once I've stopped walking
  useEffect(() => {
    if (!arrived || done) return;
    const t = setTimeout(() => setTyped((n) => n + 1), 24);
    return () => clearTimeout(t);
  }, [arrived, done, typed]);

  const say = (next) => {
    setCopied(false);
    setNodeId(next);
    setTyped(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? Infinity : 0);
    scene.current.hop = 6;
    scene.current.wave = 10;
  };

  const choose = (choice) => {
    setTopic(choice);
    say(choice.next);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
    } catch {
      window.location.href = mailto;
      return;
    }
    setCopied(true);
    setTyped(0);
    scene.current.hop = 6;
  };

  const moveFocus = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = [...e.currentTarget.querySelectorAll("a, button")];
    const i = items.indexOf(document.activeElement);
    const next = items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length];
    next?.focus();
    e.preventDefault();
  };

  return (
    <section id="contact" className="block reveal">
      <h2 className="game-title">Contact</h2>
      <div className="game" ref={wrapRef}>
        <canvas ref={canvasRef} role="img" aria-label="A pixel art Viola, with glasses, a black square-neck shirt, and grey pants, walks into the room and waves" />
        <div className="game-box" onClick={() => !done && setTyped(Infinity)}>
          <p className="game-name">Viola</p>
          <p className="game-text" aria-hidden="true">
            {arrived ? text.slice(0, typed) : ""}
            {arrived && !done && <span className="game-caret" />}
          </p>
          <p className="sr-only" aria-live="polite">
            {arrived ? text : ""}
          </p>
          {arrived && done && (
            <div className="game-choices" onKeyDown={moveFocus}>
              {node.choices?.map((choice) => (
                <button key={choice.label} type="button" onClick={() => choose(choice)}>
                  {choice.label}
                </button>
              ))}
              {node.actions && (
                <>
                  <a href={mailto}>Write me an email</a>
                  <button type="button" onClick={copy}>
                    Copy my email address
                  </button>
                  {profile.links.map((l) => (
                    <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.name}
                    </a>
                  ))}
                  <button type="button" onClick={() => say("start")}>
                    Start over
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <p className="game-plain">
        Rather skip the game? <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </p>
    </section>
  );
}
