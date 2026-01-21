import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // typewriter
  const phrases = [
    "computer engineering @ u-m '28",
    "research assistant @ clasp lab",
    "hardware systems enthusiast",
  ];
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(60);

  // experiences expand
  const [expandedExp, setExpandedExp] = useState(null);

  // interactive home console
  const [consoleInput, setConsoleInput] = useState("");
  const [consoleLines, setConsoleLines] = useState([{ type: "sys", text: "type 'help' to begin" }]);
  const consoleBoxRef = useRef(null);

  // avatar hover 3D
  const avatarRef = useRef(null);
  const [avatarStyle, setAvatarStyle] = useState({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
  });
  const [shineStyle, setShineStyle] = useState({
    opacity: 0,
    background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.35), transparent 55%)",
  });

  // data
  const experiences = [
    {
      id: 1,
      title: "Research Assistant @ U-M CLASP",
      short: "Automation of plasma data processing for CLASP Lab streams.",
      details:
        "Supporting Prof. Liang Zhao in research applying ML/AI methods to analyze and predict solar wind behavior. Processing and visualizing space plasma datasets using Python (data cleaning, feature extraction, and publication-ready plots).",
    },
    {
      id: 2,
      title: "Mathematics Tutor @ U-M Math Dept",
      short: "Guiding students through Calculus I, II and Differential Equations.",
      details:
        "Facilitating weekly tutoring sessions and study groups for engineering students, helping break down challenging topics in vector calculus, linear algebra, and ordinary differential equations. I also offer drop-in tutoring for Calculus I, II, and III, focusing on helping students feel more confident with the material and approach problems more effectively."
    },
  ];

  const toolbox = [
    { name: "C++", note: "data structures + systems" },
    { name: "Python", note: "data + automation" },
    { name: "Verilog", note: "FPGA logic" },
    { name: "Arduino", note: "embedded prototyping" },
    { name: "MATLAB", note: "signals + math" },
    { name: "Git", note: "version control" },
    { name: "Linux", note: "terminal + workflows" },
    { name: "React", note: "personal site UI" },
  ];

  // --- console helpers ---
  useEffect(() => {
    const el = consoleBoxRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [consoleLines]);

  const pushLine = (type, text) => {
    setConsoleLines((prev) => [...prev, { type, text }]);
  };

  const runCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    pushLine("user", `> ${raw.trim()}`);

    if (cmd === "help") {
      pushLine("sys", "commands: help | info | funfact | courses | now | clear");
      return;
    }
    if (cmd === "info") {
      pushLine("sys", "hello. viola here.");
      pushLine("sys", "computer engineering major who likes building things");
      pushLine("sys", "that are fun, useful, and occasionally confusing (at first).");
      return;
    }
    if (cmd === "courses") {
      pushLine("sys", "current relevant courses loaded:");
      pushLine("sys", "- programming & intro data structures");
      pushLine("sys", "- logic design");
      pushLine("sys", "- discrete math");
      pushLine("sys", "- differential equation");
      pushLine("sys", "- computational linear algebra");
      pushLine("sys", "- electric circuit");
      pushLine("sys", "etc :)");
      return;
    }
    if (cmd === "now") {
      pushLine("sys", "- making the most out of college");
      pushLine("sys", "- always looking for opportunity to grow");
      pushLine("sys", "- saying yes, learning fast, figuring things out");
      return;
    }
    if (cmd === "funfact") {
      pushLine("sys", "- born and raised in medan, indonesia");
      pushLine("sys", "- always looking for good fantasy manga/manhwa");
      pushLine("sys", "- i enjoy when hard things finally click");
      pushLine("sys", "- i'm a dog person");
      return;
    }
    if (cmd === "clear") {
      setConsoleLines([{ type: "sys", text: "type 'help' to begin" }]);
      return;
    }

    pushLine("err", `unknown command: '${raw.trim()}'. try 'help'.`);
  };
useEffect(() => {
  if (hasEntered) return;

  // optional: a quick boot flash near the end
  const bootOn = setTimeout(() => setIsBooting(true), 2200);
  const enter = setTimeout(() => {
    setHasEntered(true);
    setIsBooting(false);
  }, 3000);

  return () => {
    clearTimeout(bootOn);
    clearTimeout(enter);
  };
}, [hasEntered]);

  // --- typewriter loop ---
  useEffect(() => {
    if (!hasEntered) return;

    const i = loopNum % phrases.length;
    const fullText = phrases[i];

    const tick = () => {
      setDisplayText((prev) =>
        isDeleting ? fullText.substring(0, prev.length - 1) : fullText.substring(0, prev.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 60);

      // when done typing a phrase
      if (!isDeleting && displayText === fullText) {
        setTypingSpeed(2500);
        setIsDeleting(true);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setLoopNum((n) => n + 1);
        setTypingSpeed(500);
      }
    };

    const timer = setTimeout(tick, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, hasEntered, typingSpeed, phrases]);



  // --- avatar 3D hover handlers ---
  const handleAvatarMove = (e) => {
    const el = avatarRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    const rotateY = (px - 0.5) * 18;
    const rotateX = (0.5 - py) * 18;
    const lift = 10;

    setAvatarStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${lift}px)`,
    });

    setShineStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${Math.round(px * 100)}% ${Math.round(
        py * 100
      )}%, rgba(255,255,255,0.38), transparent 55%)`,
    });
  };

  const handleAvatarLeave = () => {
    setAvatarStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
    });
    setShineStyle({
      opacity: 0,
      background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.35), transparent 55%)",
    });
  };

  return (
    <div style={styles.appContainer}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;800&display=swap');

        body { margin: 0; padding: 0; background-color: #F2F0ED; overflow-x: hidden; }

        .boot-screen {
          position: fixed; inset: 0; background: #2A1B13; z-index: 200;
          transform: scaleY(0); transform-origin: center;
          transition: transform 0.8s cubic-bezier(0.85, 0, 0.15, 1);
        }
        .boot-screen.active { transform: scaleY(1); }

        .portal-wrapper {
          height: 100vh; width: 100vw; display: flex; flex-direction: column;
          align-items: center; justify-content: center; background: #F2F0ED;
          cursor: none;
        }

        /* heart */
        .heart-svg { width: 50px; height: 50px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .outline-path { fill: none; stroke: #2A1B13; stroke-width: 2; opacity: 0.1; transition: 0.3s; }
        .outline-path.active { opacity: 1; stroke: #E63946; filter: drop-shadow(0 0 10px rgba(230, 57, 70, 0.4)); }
        .cursor-heart { position: fixed; pointer-events: none; z-index: 100; width: 50px; height: 50px; transform: translate(-50%, -50%); }
        .filled-path { fill: #2A1B13; transition: 0.3s; }
        .filled-path.perfect { fill: #E63946; }

        /* fade up */
        .fade-up { opacity: 0; transform: translateY(30px); animation: fUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fUp { to { opacity: 1; transform: translateY(0); } }
        .delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; } .delay-4 { animation-delay: 0.4s; }

        /* experiences */
        .exp-card {
          padding: 30px; border-bottom: 1px solid rgba(42, 27, 19, 0.1);
          cursor: pointer; transition: all 0.4s ease; background: transparent;
        }
        .exp-card:hover { transform: translateX(20px); background: rgba(42, 27, 19, 0.02); }
        .exp-details { max-height: 0; overflow: hidden; transition: max-height 0.5s ease, opacity 0.5s ease; opacity: 0; padding-top: 0; }
        .exp-details.open { max-height: 500px; opacity: 1; padding-top: 20px; }

        /* nav */
        .nav-btn {
          background: none; border: none; font-family: 'Space Grotesk'; font-size: 14px; color: #2A1B13;
          opacity: 0.4; cursor: pointer; letter-spacing: 2px; text-transform: uppercase; transition: 0.3s;
        }
        .nav-btn.active { opacity: 1; font-weight: 700; text-decoration: underline; text-underline-offset: 8px; }

        /* avatar */
        .avatar-card {
          position: relative; width: 240px; border-radius: 40px; overflow: hidden;
          transform-style: preserve-3d;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          box-shadow: 0 12px 30px rgba(42, 27, 19, 0.12);
          will-change: transform;
        }
        .avatar-card:hover { box-shadow: 0 20px 45px rgba(42, 27, 19, 0.18); }
        .avatar-img { width: 100%; display: block; border-radius: 40px; transform: translateZ(25px); }
        .avatar-shine { position: absolute; inset: 0; mix-blend-mode: screen; pointer-events: none; transition: opacity 0.2s ease; }
        .avatar-border { position: absolute; inset: 0; border-radius: 40px; border: 1px solid rgba(255,255,255,0.35); pointer-events: none; opacity: 0.25; transform: translateZ(30px); }

        /* chips */
        .chip-grid { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 18px; }
        .chip {
          border: 1px solid rgba(42, 27, 19, 0.12);
          padding: 10px 12px;
          border-radius: 999px;
          font-size: 12px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          opacity: 0.85;
          cursor: default;
          transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
          user-select: none;
        }
        .chip:hover { transform: translateY(-3px); background: rgba(42, 27, 19, 0.03); border-color: rgba(42, 27, 19, 0.18); }
        .chip small { display: block; font-size: 10px; letter-spacing: 0.8px; text-transform: none; opacity: 0.55; margin-top: 4px; }

        /* mini cards */
        .mini-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; margin-top: 26px; }
        @media (max-width: 900px) { .mini-grid { grid-template-columns: 1fr; } }
        .mini-card {
          padding: 22px 24px;
          border: 1px solid rgba(42, 27, 19, 0.12);
          border-radius: 24px;
          background: rgba(255,255,255,0.25);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .mini-card:hover { transform: translateY(-4px); box-shadow: 0 14px 30px rgba(42, 27, 19, 0.10); }
        .mini-title { margin: 0 0 8px 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.6; }
        .mini-text { margin: 0; font-size: 18px; font-weight: 300; opacity: 0.75; line-height: 1.5; }

        /* console */
        .console-shell{
          margin-top: 26px;
          border: 1px solid rgba(42, 27, 19, 0.14);
          border-radius: 28px;
          overflow: hidden;
          background: rgba(255,255,255,0.22);
          box-shadow: 0 14px 40px rgba(42, 27, 19, 0.10);
        }
        .console-top{
          display:flex; align-items:center; justify-content: space-between;
          padding: 14px 18px; border-bottom: 1px solid rgba(42, 27, 19, 0.12);
        }
        .dots{ display:flex; gap:8px; }
        .dot{ width:9px; height:9px; border-radius:999px; background: rgba(42,27,19,0.20); }
        .console-title{
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase; opacity: 0.55;
        }
        .console-body{ position: relative; padding: 18px; }
        .console-lines{
          display:flex; flex-direction: column; gap: 8px;
          min-height: 170px; max-height: 260px; overflow:auto;
        }
        .line{ font-size: 14px; line-height: 1.45; }
        .line.sys{ opacity: 0.7; }
        .line.user{ opacity: 0.85; }
        .line.err{ color: #E63946; }
        .console-inputRow{ display:flex; gap:12px; margin-top:14px; }
        .console-input{
          flex:1;
          border: 1px solid rgba(42, 27, 19, 0.16);
          border-radius: 16px;
          padding: 12px 14px;
          font-family: 'Space Grotesk';
          background: rgba(255,255,255,0.35);
        }
        .console-btn{
          border: 1px solid rgba(42, 27, 19, 0.16);
          background: rgba(255,255,255,0.25);
          border-radius: 16px;
          padding: 12px 14px;
          cursor:pointer;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .hl{ color: #E63946; font-weight: 500; }

        .console-input{
          color: #2A1B13;
          caret-color: #2A1B13;
        }
        .console-input::placeholder{
          color: rgba(42, 27, 19, 0.45);
        }
      `}</style>

      <div className={`boot-screen ${isBooting ? "active" : ""}`} />

      {!hasEntered ? (
        <div className="intro-wrapper">
  <div className="intro-heart" aria-label="heart" role="img">❤</div>

  <p
    style={{
      fontFamily: "Space Grotesk",
      fontSize: "10px",
      letterSpacing: "8px",
      opacity: 0.3,
      marginTop: "24px",
      textTransform: "uppercase",
    }}
  >
    entering…
  </p>
</div>


          <svg className="heart-svg" viewBox="0 0 32 32">
            <path
              className={`outline-path ${isPerfectFit ? "active" : ""}`}
              d="M16 28.5L14.1 26.7C7.35 20.6 3 16.65 3 11.85C3 7.9 6.1 4.8 10.05 4.8C12.3 4.8 14.45 5.85 15.9 7.55C17.35 5.85 19.5 4.8 21.75 4.8C25.7 4.8 28.8 7.9 28.8 11.85C28.8 16.65 24.45 20.6 17.7 26.75L16 28.5Z"
            />
          </svg>

          <p
            style={{
              fontFamily: "Space Grotesk",
              fontSize: "10px",
              letterSpacing: "8px",
              opacity: 0.3,
              marginTop: "80px",
            }}
          >
            {isPerfectFit ? "click to complete" : "fill the heart"}
          </p>
        </div>
      ) : (
        <main style={styles.mainContainer}>
          <header className="fade-up delay-1" style={styles.header}>
            <div style={styles.headerLayout}>
              <div
                ref={avatarRef}
                className="avatar-card"
                style={avatarStyle}
                onMouseMove={handleAvatarMove}
                onMouseLeave={handleAvatarLeave}
              >
                <img src="/avatar.jpeg" alt="avatar" className="avatar-img" />
                <div className="avatar-shine" style={shineStyle} />
                <div className="avatar-border" />
              </div>

              <div style={styles.textStack}>
                <h1 style={styles.hugeTitle}>
                  viola
                  <br />
                  sembiring
                </h1>
                <div style={styles.typeRow}>
                  <span style={{ opacity: 0.4, marginRight: "15px" }}>currently</span>
                  <span>{displayText}</span>
                </div>

                <div style={{ marginTop: "30px", display: "flex", flexWrap: "wrap" }}>
                  {["LinkedIn", "GitHub", "Instagram"].map((s) => (
                    <a key={s} href="#" style={styles.socialLink}>
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <div className="fade-up delay-3">
            <nav style={styles.navBar}>
              {["home", "about", "experiences", "out loud", "resume"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`nav-btn ${activeTab === tab ? "active" : ""}`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <section style={styles.contentCard} className="fade-up delay-4">
              {activeTab === "home" && (
                <div>
                  <span style={styles.tag}>// Home</span>
                  <h4 style={styles.itemTitle}>hi there! welcome! :D</h4>
                  <p style={styles.itemDesc}>
                    I’m studying computer engineering at the university of michigan, class of 2028. I’m
                    curious about systems, how they behave, how they fail, and how they can be designed
                    more thoughtfully. this space is part project log, part experiment, and part place to
                    think out loud while i’m learning. type a command to explore.
                  </p>

                  <div className="console-shell">
                    <div className="console-top">
                      <div className="dots">
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                      </div>
                    </div>

                    <div className="console-body">
                      <div className="console-lines" ref={consoleBoxRef}>
                        {consoleLines.map((l, idx) => (
                          <div key={idx} className={`line ${l.type}`}>
                            {l.text}
                          </div>
                        ))}
                      </div>

                      <div className="console-inputRow">
                        <input
                          className="console-input"
                          value={consoleInput}
                          onChange={(e) => setConsoleInput(e.target.value)}
                          placeholder="type: help / info / courses / funfact / now / clear"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              runCommand(consoleInput);
                              setConsoleInput("");
                            }
                          }}
                        />
                        <button
                          className="console-btn"
                          onClick={() => {
                            runCommand(consoleInput);
                            setConsoleInput("");
                          }}
                        >
                          run
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "32px" }}>
                    <span style={styles.tag}>// Toolbox</span>
                    <div className="chip-grid">
                      {toolbox.map((t) => (
                        <div key={t.name} className="chip" title={t.note}>
                          {t.name}
                          <small>{t.note}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ ABOUT LEFT AS-IS (unchanged from your version) */}
              {activeTab === "about" && (
                <div>
                  <span style={styles.tag}>// About</span>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "24px",
                      marginTop: "18px",
                      textAlign: "left",
                      flexWrap: "nowrap", // prevents stacking
                    }}
                  >
                    <img
                      src="/potrait.jpeg"
                      style={{
                        width: "350px",
                        height: "450px",
                        objectFit: "cover",
                        borderRadius: "14px",
                        flexShrink: 0,
                      }}
                    />

                    <div style={{ marginLeft: "16px" }}>
                      <h4 style={styles.itemTitle}>Hi, I’m Viola Charissa Diana Sembiring</h4>
                      <p style={styles.itemDesc}>
                        I’m a U-M computer engineering student who loves building things that are both
                        logical and alive — circuits, embedded systems, and data that tells a story
                        (especially space plasma + solar wind).
                      </p>
                    </div>
                  </div>

                  <div className="mini-grid">
                    <div className="mini-card">
                      <p className="mini-title">I like</p>
                      <p className="mini-text">
                        hardware debugging • clean architecture • CAD/design • making hard stuff feel
                        simple
                      </p>
                    </div>
                    <div className="mini-card">
                      <p className="mini-title">I’m learning</p>
                      <p className="mini-text">
                        stronger systems thinking • clearer communication • better engineering taste
                      </p>
                    </div>
                  </div>

                  <div style={{ marginTop: "48px" }}>
                    <p
                      style={{
                        fontSize: "13px",
                        opacity: 0.6,
                        letterSpacing: "0.04em",
                        marginBottom: "12px",
                      }}
                    >
                      currently listening to
                    </p>

                    <iframe
                      title="Currently Listening Playlist"
                      data-testid="embed-iframe"
                      style={{ borderRadius: "12px", border: "none" }}
                      src="https://open.spotify.com/embed/playlist/1vHnZpoh3TbeXlvnFfp7Uf?utm_source=generator"
                      width="100%"
                      height="352"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

             {activeTab === "experiences" && (
  <div>
    <p style={{ marginBottom: 8, opacity: 0.7, fontSize: 13 }}>
  Click to expand each role for more details.
</p>

    <span style={styles.tag}>// Work History</span>

    {experiences.map((exp) => (
      <div
        key={exp.id}
        className="exp-card"
        onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
      >
        <h4 style={styles.itemTitle}>{exp.title}</h4>
        <p style={styles.itemDesc}>{exp.short}</p>
        <div className={`exp-details ${expandedExp === exp.id ? "open" : ""}`}>
          <p style={{ ...styles.itemDesc, opacity: 0.8 }}>{exp.details}</p>
        </div>
      </div>
    ))}

    <div style={{ marginTop: "42px" }}>
      <span style={styles.tag}>// Projects</span>
      <h4 style={styles.itemTitle}>coming soon</h4>
      <p style={styles.itemDesc}>
        I’m organizing a few builds + writeups — will drop them here soon.
      </p>
    </div>
  </div>
)}


              {/* ✅ OUT LOUD NOW = ONLY NOTION EMBED */}
              {activeTab === "out loud" && (
                <div>
                  <span style={styles.tag}>// Out Loud</span>
                  <h4 style={styles.itemTitle}>notes & reflections</h4>
                  <p style={{ ...styles.itemDesc, marginBottom: "18px" }}>
                    embedded from Notion.
                  </p>

<iframe src="https://lopsided-passbook-280.notion.site/ebd//2ed826ec6ca8800ab28edaef165b6909" width="100%" height="600" frameborder="0" allowfullscreen />

                </div>
              )}

              {activeTab === "resume" && (
                <div>
                  <span style={styles.tag}>// Resume</span>
                  <h4 style={styles.itemTitle}>coming soon</h4>
                </div>
              )}
            </section>
          </div>
        </main>
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    minHeight: "100vh",
    backgroundColor: "#F2F0ED",
    color: "#2A1B13",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  mainContainer: { maxWidth: "1400px", margin: "0 auto", padding: "100px 8vw" },
  header: { marginBottom: "80px" },
  headerLayout: { display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" },
  textStack: { minWidth: 0 },
  hugeTitle: {
    fontSize: "clamp(60px, 10vw, 140px)",
    fontWeight: "800",
    lineHeight: "0.85",
    letterSpacing: "-0.05em",
    margin: 0,
  },
  typeRow: { marginTop: "30px", fontSize: "28px", fontWeight: "500" },
  socialLink: {
    marginRight: "30px",
    opacity: 0.4,
    fontSize: "12px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#2A1B13",
    textDecoration: "none",
  },
  navBar: {
    display: "flex",
    gap: "40px",
    paddingBottom: "25px",
    borderBottom: "1px solid rgba(42, 27, 19, 0.15)",
  },
  contentCard: { padding: "50px 0" },
  tag: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "3px",
    opacity: 0.4,
    display: "block",
    marginBottom: "20px",
  },
  itemTitle: { margin: "0 0 8px 0", fontSize: "28px", fontWeight: "700" },
  itemDesc: { margin: 0, opacity: 0.6, fontSize: "20px", fontWeight: "300" },
};
