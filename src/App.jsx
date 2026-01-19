import React from 'react';
import React, { useState, useEffect } from 'react';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(60);
  const [expandedExp, setExpandedExp] = useState(null);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPerfectFit, setIsPerfectFit] = useState(false);

  const phrases = ["computer engineering @ u-m '28", "research assistant @ clasp lab", "hardware systems enthusiast"];

  useEffect(() => {
    if (!hasEntered) return;
    const handleType = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];
      setDisplayText(isDeleting ? fullText.substring(0, displayText.length - 1) : fullText.substring(0, displayText.length + 1));
      setTypingSpeed(isDeleting ? 30 : 60);
      if (!isDeleting && displayText === fullText) { setTypingSpeed(2500); setIsDeleting(true); }
      else if (isDeleting && displayText === "") { setIsDeleting(false); setLoopNum(loopNum + 1); setTypingSpeed(500); }
    };
    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, hasEntered, typingSpeed]);

  const handlePortalMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    // Perfect sync check
    const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
    setIsPerfectFit(distance < 15); 
  };

  const handleEntry = () => {
    if (isPerfectFit) {
      setIsBooting(true);
      setTimeout(() => { setHasEntered(true); setIsBooting(false); }, 800);
    }
  };

  const experiences = [
    {
      id: 1,
      title: "Solar Wind Telemetry Pipeline",
      short: "Automation of plasma data processing for CLASP Lab streams.",
      details: "Developing Python-based automated pipelines to process high-frequency plasma data from satellite streams. Focused on reducing latency in telemetry interpretation for space weather modeling."
    },
    {
      id: 2,
      title: "Mathematics Dept Tutor",
      short: "Guiding students through Calculus and Differential Equations.",
      details: "Facilitating weekly sessions for engineering students. Explaining complex concepts in vector calculus, linear algebra, and ordinary differential equations."
    }
  ];

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

        /* SYNCED HEART SVG */
        .heart-svg { width: 50px; height: 50px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .outline-path { fill: none; stroke: #2A1B13; stroke-width: 2; opacity: 0.1; transition: 0.3s; }
        .outline-path.active { opacity: 1; stroke: #E63946; filter: drop-shadow(0 0 10px rgba(230, 57, 70, 0.4)); }

        .cursor-heart {
          position: fixed; pointer-events: none; z-index: 100;
          width: 50px; height: 50px; transform: translate(-50%, -50%);
        }
        .filled-path { fill: #2A1B13; transition: 0.3s; }
        .filled-path.perfect { fill: #E63946; }

        /* FADE-UP ANIMATIONS */
        .fade-up { opacity: 0; transform: translateY(30px); animation: fUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fUp { to { opacity: 1; transform: translateY(0); } }
        .delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; } .delay-4 { animation-delay: 0.4s; }

        /* SLIDE-RIGHT CARDS */
        .exp-card {
          padding: 30px; border-bottom: 1px solid rgba(42, 27, 19, 0.1);
          cursor: pointer; transition: all 0.4s ease;
          background: transparent;
        }
        .exp-card:hover {
          transform: translateX(20px);
          background: rgba(42, 27, 19, 0.02);
        }
        .exp-details {
          max-height: 0; overflow: hidden; transition: max-height 0.5s ease, opacity 0.5s ease;
          opacity: 0; padding-top: 0;
        }
        .exp-details.open {
          max-height: 500px; opacity: 1; padding-top: 20px;
        }

        .nav-btn { background: none; border: none; font-family: 'Space Grotesk'; font-size: 14px; color: #2A1B13; opacity: 0.4; cursor: pointer; letter-spacing: 2px; text-transform: uppercase; transition: 0.3s; }
        .nav-btn.active { opacity: 1; font-weight: 700; text-decoration: underline; text-underline-offset: 8px; }
      `}</style>

      <div className={`boot-screen ${isBooting ? 'active' : ''}`} />

      {!hasEntered ? (
        <div className="portal-wrapper" onMouseMove={handlePortalMouseMove} onClick={handleEntry}>
          <div className="cursor-heart" style={{ left: mousePos.x, top: mousePos.y }}>
            <svg viewBox="0 0 32 32" width="100%" height="100%">
              <path className={`filled-path ${isPerfectFit ? 'perfect' : ''}`} d="M16 28.5L14.1 26.7C7.35 20.6 3 16.65 3 11.85C3 7.9 6.1 4.8 10.05 4.8C12.3 4.8 14.45 5.85 15.9 7.55C17.35 5.85 19.5 4.8 21.75 4.8C25.7 4.8 28.8 7.9 28.8 11.85C28.8 16.65 24.45 20.6 17.7 26.75L16 28.5Z" />
            </svg>
          </div>

          <svg className="heart-svg" viewBox="0 0 32 32">
            <path className={`outline-path ${isPerfectFit ? 'active' : ''}`} d="M16 28.5L14.1 26.7C7.35 20.6 3 16.65 3 11.85C3 7.9 6.1 4.8 10.05 4.8C12.3 4.8 14.45 5.85 15.9 7.55C17.35 5.85 19.5 4.8 21.75 4.8C25.7 4.8 28.8 7.9 28.8 11.85C28.8 16.65 24.45 20.6 17.7 26.75L16 28.5Z" />
          </svg>

          <p style={{fontFamily: 'Space Grotesk', fontSize: '10px', letterSpacing: '8px', opacity: 0.3, marginTop: '80px'}}>
            {isPerfectFit ? 'click to complete' : 'fill the heart'}
          </p>
        </div>
      ) : (
        <main style={styles.mainContainer}>
          <header className="fade-up delay-1" style={styles.header}>
            <div style={styles.headerLayout}>
              <img src="/avatar.jpeg" style={styles.avatarImg} />
              <div style={styles.textStack}>
                <h1 style={styles.hugeTitle}>viola<br/>sembiring</h1>
                <div style={styles.typeRow}>
                  <span style={{opacity: 0.4, marginRight: '15px'}}>currently</span>
                  <span>{displayText}</span>
                </div>
                <div style={{marginTop: '30px', display: 'flex'}}>
                  {['LinkedIn', 'GitHub', 'Instagram'].map(s => <a key={s} href="#" style={styles.socialLink}>{s}</a>)}
                </div>
              </div>
            </div>
          </header>

          <div className="fade-up delay-3">
            <nav style={styles.navBar}>
              {['home', 'about', 'experience', 'quotes'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`nav-btn ${activeTab === tab ? 'active' : ''}`}>{tab}</button>
              ))}
            </nav>

            <section style={styles.contentCard} className="fade-up delay-4">
              {activeTab === 'home' && (
                <div>
                  <span style={styles.tag}>// Status</span>
                  <h4 style={styles.itemTitle}>U-M Class of 2028</h4>
                  <p style={styles.itemDesc}>Computer Engineering. Researching space-physics telemetry.</p>
                </div>
              )}

              {activeTab === 'experience' && (
                <div>
                  <span style={styles.tag}>// Work History</span>
                  {experiences.map((exp) => (
                    <div 
                      key={exp.id} 
                      className="exp-card"
                      onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
                    >
                      <h4 style={styles.itemTitle}>{exp.title}</h4>
                      <p style={styles.itemDesc}>{exp.short}</p>
                      <div className={`exp-details ${expandedExp === exp.id ? 'open' : ''}`}>
                        <p style={{...styles.itemDesc, opacity: 0.8}}>{exp.details}</p>
                      </div>
                    </div>
                  ))}
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
  appContainer: { minHeight: "100vh", backgroundColor: "#F2F0ED", color: "#2A1B13", fontFamily: "'Space Grotesk', sans-serif" },
  mainContainer: { maxWidth: "1400px", margin: "0 auto", padding: "100px 8vw" },
  header: { marginBottom: "80px" },
  headerLayout: { display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" },
  avatarImg: { width: "240px", borderRadius: "40px" },
  hugeTitle: { fontSize: "clamp(60px, 10vw, 140px)", fontWeight: "800", lineHeight: "0.85", letterSpacing: "-0.05em", margin: 0 },
  typeRow: { marginTop: "30px", fontSize: "28px", fontWeight: "500" },
  socialLink: { marginRight: "30px", opacity: 0.4, fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#2A1B13", textDecoration: "none" },
  navBar: { display: "flex", gap: "40px", paddingBottom: "25px", borderBottom: "1px solid rgba(42, 27, 19, 0.15)" },
  contentCard: { padding: "50px 0" },
  tag: { fontSize: "11px", textTransform: "uppercase", letterSpacing: "3px", opacity: 0.4, display: "block", marginBottom: "20px" },
  itemTitle: { margin: "0 0 8px 0", fontSize: "28px", fontWeight: "700" },
  itemDesc: { margin: 0, opacity: 0.6, fontSize: "20px", fontWeight: "300" }
};
