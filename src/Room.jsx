import React, { useState } from "react";
import { room } from "./content.js";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = () => window.matchMedia("(hover: none)").matches;

// A short, quiet sound when you play the piano or the guitar.
const playNotes = (frequencies, gap, type, length) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audio = new AudioCtx();
    const now = audio.currentTime;
    frequencies.forEach((frequency, i) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      const at = now + i * gap;
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, at);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.045, at + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
      osc.connect(gain).connect(audio.destination);
      osc.start(at);
      osc.stop(at + length + 0.02);
    });
    setTimeout(() => audio.close(), (frequencies.length * gap + length + 0.2) * 1000);
  } catch {
    // no sound available, and the animation still plays
  }
};

const SOUNDS = {
  piano: () => playNotes([261.6, 329.6, 392, 523.3], 0.14, "triangle", 0.5),
  guitar: () => playNotes([164.8, 246.9, 329.6, 392, 493.9], 0.05, "triangle", 0.8),
};

const Art = {
  bed: () => (
    <>
      <rect x="44" y="282" width="24" height="168" rx="6" fill="#8a7158" />
      <rect x="326" y="352" width="18" height="98" rx="5" fill="#8a7158" />
      <rect x="60" y="376" width="274" height="56" rx="8" fill="#a58c70" />
      <rect x="62" y="346" width="272" height="44" rx="12" fill="#f3f1ec" />
      <rect x="72" y="326" width="84" height="38" rx="15" fill="#fff" stroke="#d9d8d2" strokeWidth="2" />
      <path d="M148 346 h176 a12 12 0 0 1 12 12 v30 h-188 z" fill="#8ea3b8" />
      <path d="M148 372 h188 M148 356 h188" stroke="#a9bacb" strokeWidth="3" />
      <g className="zzz" fontFamily="Fraunces, Georgia, serif" fill="#5c6670">
        <text x="150" y="312" fontSize="22">z</text>
        <text x="170" y="290" fontSize="28">z</text>
        <text x="194" y="264" fontSize="34">z</text>
      </g>
    </>
  ),
  music: () => (
    <>
      <rect x="388" y="352" width="146" height="98" rx="5" fill="#a58c70" />
      <rect x="398" y="362" width="58" height="78" rx="3" fill="#b89f84" />
      <rect x="466" y="362" width="58" height="78" rx="3" fill="#b89f84" />
      <rect x="378" y="310" width="166" height="42" rx="5" fill="#3c4b5c" />
      <ellipse cx="452" cy="309" rx="58" ry="11" fill="#27303b" />
      <g className="record">
        <circle cx="452" cy="265" r="48" fill="#1e2229" />
        <circle cx="452" cy="265" r="36" fill="none" stroke="#3a404a" strokeWidth="1.5" />
        <circle cx="452" cy="265" r="26" fill="none" stroke="#3a404a" strokeWidth="1.5" />
        <circle cx="452" cy="265" r="15" fill="#9c5a64" />
        <path d="M452 250 a15 15 0 0 1 15 15 h-15 z" fill="#c98f98" />
        <circle cx="452" cy="265" r="3" fill="#f7f7f5" />
      </g>
      <path d="M526 318 V258 L500 232" fill="none" stroke="#c5ccd2" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="526" cy="320" r="7" fill="#c5ccd2" />
      <g className="notes" fill="#9c5a64" fontSize="24" fontFamily="Georgia, serif">
        <text x="382" y="228">♪</text>
        <text x="424" y="196">♫</text>
      </g>
    </>
  ),
  piano: () => (
    <>
      <rect x="578" y="196" width="196" height="150" rx="6" fill="#3c4b5c" />
      <rect x="592" y="210" width="168" height="62" rx="3" fill="#47586a" />
      <rect x="650" y="222" width="52" height="38" rx="1" fill="#f3f1ec" />
      <path d="M658 232 h36 M658 240 h36 M658 248 h24" stroke="#a7adb3" strokeWidth="2" />
      <rect x="566" y="330" width="220" height="20" rx="3" fill="#2f3b49" />
      <rect x="582" y="350" width="188" height="100" rx="3" fill="#3c4b5c" />
      <g className="keys">
        {Array.from({ length: 13 }, (_, i) => (
          <rect key={i} className="key" style={{ "--i": i }} x={572 + i * 16} y="318" width="15" height="24" rx="1.5" fill="#fbfaf7" />
        ))}
      </g>
      {[1, 2, 4, 5, 6, 8, 9, 11, 12].map((i) => (
        <rect key={i} x={566 + i * 16} y="318" width="9" height="14" rx="1" fill="#1e2229" />
      ))}
      <rect x="622" y="412" width="108" height="16" rx="5" fill="#8a7158" />
      <rect x="632" y="426" width="10" height="42" rx="2" fill="#6f5d49" />
      <rect x="710" y="426" width="10" height="42" rx="2" fill="#6f5d49" />
    </>
  ),
  guitar: () => (
    <g className="guitar">
      <rect x="867" y="168" width="16" height="164" rx="2" fill="#5a4635" />
      <rect x="861" y="134" width="28" height="42" rx="5" fill="#3f3226" />
      <circle cx="856" cy="146" r="4" fill="#c5ccd2" />
      <circle cx="856" cy="164" r="4" fill="#c5ccd2" />
      <circle cx="894" cy="146" r="4" fill="#c5ccd2" />
      <circle cx="894" cy="164" r="4" fill="#c5ccd2" />
      <path d="M875 268 c-30 0 -44 20 -36 46 c4 13 -16 26 -16 54 c0 44 25 70 52 70 s52 -26 52 -70 c0 -28 -20 -41 -16 -54 c8 -26 -6 -46 -36 -46 z" fill="#c69a63" stroke="#94703f" strokeWidth="3" />
      <circle cx="875" cy="346" r="19" fill="#3f3226" />
      <rect x="854" y="396" width="42" height="9" rx="2" fill="#3f3226" />
      <g className="strings" stroke="#f1ead8" strokeWidth="1.3">
        <path d="M870 170 V398" />
        <path d="M875 170 V398" />
        <path d="M880 170 V398" />
      </g>
    </g>
  ),
  barbell: () => (
    <g className="barbell">
      <rect x="346" y="497" width="312" height="8" rx="4" fill="#9aa2a9" />
      <rect x="364" y="463" width="20" height="76" rx="5" fill="#27303b" />
      <rect x="386" y="473" width="15" height="56" rx="4" fill="#9c5a64" />
      <rect x="403" y="481" width="10" height="40" rx="3" fill="#3c4b5c" />
      <rect x="620" y="463" width="20" height="76" rx="5" fill="#27303b" />
      <rect x="603" y="473" width="15" height="56" rx="4" fill="#9c5a64" />
      <rect x="591" y="481" width="10" height="40" rx="3" fill="#3c4b5c" />
    </g>
  ),
};

const HIT_AREAS = {
  bed: { x: 36, y: 250, width: 316, height: 208 },
  music: { x: 372, y: 180, width: 180, height: 276 },
  piano: { x: 560, y: 188, width: 232, height: 284 },
  guitar: { x: 816, y: 126, width: 122, height: 322 },
  barbell: { x: 340, y: 456, width: 324, height: 90 },
};

export default function Room() {
  const [active, setActive] = useState(null);
  const [plays, setPlays] = useState({});
  const current = room.items.find((item) => item.id === active);

  const play = (id) => {
    setActive(id);
    if (reducedMotion()) return;
    setPlays((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
    SOUNDS[id]?.();
  };

  const onKey = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      play(id);
    }
  };

  return (
    <section id="room" className="block reveal">
      <div className="block-head">
        <div>
          <h2>{room.title}</h2>
          <p className="block-intro">{room.intro}</p>
        </div>
      </div>

      <div className="room">
        <svg viewBox="0 0 1000 560" role="group" aria-label="An illustration of my room">
          <rect width="1000" height="430" fill="#e4e8ec" />
          <rect y="430" width="1000" height="130" fill="#c8b69f" />
          <path d="M0 462 H1000 M0 498 H1000 M0 532 H1000 M170 430 L120 560 M420 430 L400 560 M660 430 L680 560 M880 430 L950 560" stroke="#b7a48c" strokeWidth="2" />
          <rect y="418" width="1000" height="14" fill="#f4f2ed" />

          {/* window */}
          <rect x="130" y="42" width="170" height="150" rx="4" fill="#f4f2ed" />
          <rect x="140" y="52" width="150" height="130" fill="#bfd2e2" />
          <circle cx="252" cy="88" r="17" fill="#e9c982" />
          <path d="M150 145 q18 -22 38 -8 q20 -14 36 6 q10 0 18 10 h-92 z" fill="#f4f2ed" opacity="0.85" />
          <path d="M215 52 V182 M140 117 H290" stroke="#f4f2ed" strokeWidth="6" />

          {/* pennant */}
          <rect x="365" y="60" width="6" height="74" rx="2" fill="#8a7158" />
          <path d="M371 64 L515 97 L371 130 Z" fill="#26405f" />
          <text x="384" y="104" fontFamily="Figtree, sans-serif" fontSize="20" fontWeight="700" fill="#e7cf85">GO BLUE</text>

          {/* rug */}
          <ellipse cx="502" cy="505" rx="210" ry="44" fill="#a9b7c4" />
          <ellipse cx="502" cy="505" rx="184" ry="35" fill="none" stroke="#c6d0d9" strokeWidth="4" />

          {room.items.map((item) => {
            const Drawing = Art[item.id];
            const isOn = active === item.id;
            const hit = HIT_AREAS[item.id];
            const shared = {
              className: `room-item item-${item.id}${isOn ? " on" : ""}`,
              onPointerEnter: (e) => e.pointerType === "mouse" && setActive(item.id),
              onFocus: () => setActive(item.id),
            };
            const inner = (
              <>
                <rect {...hit} fill="transparent" />
                <g key={plays[item.id] || 0} className={plays[item.id] ? "played" : ""}>
                  <Drawing />
                </g>
              </>
            );
            return item.url ? (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.name}. ${item.text}`}
                {...shared}
                onClick={(e) => {
                  // on a phone, the first tap explains it; the link below the room opens it
                  if (isTouch() && active !== item.id) e.preventDefault();
                  setActive(item.id);
                }}
              >
                {inner}
              </a>
            ) : (
              <g key={item.id} role="button" tabIndex={0} aria-label={`${item.name}. ${item.text}`} {...shared} onClick={() => play(item.id)} onKeyDown={(e) => onKey(e, item.id)}>
                {inner}
              </g>
            );
          })}
        </svg>

        <div className="room-caption" aria-live="polite">
          {current ? (
            <p key={current.id}>
              <strong>{current.name}</strong> {current.text}
              {current.url && (
                <a href={current.url} target="_blank" rel="noopener noreferrer">
                  {current.link}
                </a>
              )}
            </p>
          ) : (
            <p className="muted">{room.hint}</p>
          )}
        </div>
      </div>

      <div className="room-chips" role="group" aria-label="Things in my room">
        {room.items.map((item) => (
          <button key={item.id} type="button" aria-pressed={active === item.id} onClick={() => (item.url ? setActive(item.id) : play(item.id))}>
            {item.name}
          </button>
        ))}
      </div>
    </section>
  );
}
