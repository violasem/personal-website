// Every sound on the site is made in the browser, so there are no audio files to load.
// Each one only plays after someone clicks something.

let shared = null;
const context = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  shared ??= new AudioCtx();
  if (shared.state === "suspended") shared.resume();
  return shared;
};

const shape = (ctx, at, peak, attack, length) => {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  return gain;
};

const tone = (ctx, out, { type = "sine", from, to = from, at, length, peak, attack = 0.008, filter }) => {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, at + length);
  const gain = shape(ctx, at, peak, attack, length);
  let last = osc;
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = filter.type;
    f.frequency.value = filter.frequency;
    f.Q.value = filter.q ?? 1;
    last = osc.connect(f);
  }
  last.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + length + 0.03);
  return osc;
};

const noise = (ctx, out, { at, length, peak, attack = 0.003, type = "bandpass", frequency = 1000, q = 1 }) => {
  const size = Math.ceil(ctx.sampleRate * (length + 0.05));
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = frequency;
  f.Q.value = q;
  const gain = shape(ctx, at, peak, attack, length);
  source.connect(f).connect(gain).connect(out);
  source.start(at);
  source.stop(at + length + 0.03);
  return gain;
};

// a little 8-bit note
const beep = (ctx, out, pitch, at, length, peak) => {
  tone(ctx, out, { type: "square", from: pitch, at, length, peak, attack: 0.006, filter: { type: "lowpass", frequency: 2600 } });
};

export const SOUND_BUILDERS = {
  quack: (ctx, out, t) => {
    // a nasal buzz through a narrow filter, falling in pitch, with a rattle in it
    const gain = shape(ctx, t, 1.9, 0.012, 0.2);
    const rattle = ctx.createOscillator();
    const rattleDepth = ctx.createGain();
    rattle.frequency.value = 48;
    rattleDepth.gain.value = 0.55;
    rattle.connect(rattleDepth).connect(gain.gain);
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.setValueAtTime(1350, t);
    f.frequency.exponentialRampToValueAtTime(850, t + 0.18);
    f.Q.value = 3.5;
    [520, 532].forEach((pitch) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(pitch, t);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.68, t + 0.18);
      osc.connect(f);
      osc.start(t);
      osc.stop(t + 0.22);
    });
    f.connect(gain).connect(out);
    rattle.start(t);
    rattle.stop(t + 0.22);
  },
  woof: (ctx, out, t) => {
    // a low bark: a chesty pitch drop with a puff of breath at the front
    tone(ctx, out, { type: "sawtooth", from: 360, to: 125, at: t, length: 0.19, peak: 0.55, attack: 0.012, filter: { type: "lowpass", frequency: 900, q: 2 } });
    tone(ctx, out, { from: 170, to: 80, at: t, length: 0.17, peak: 0.4, attack: 0.01 });
    noise(ctx, out, { at: t, length: 0.07, peak: 0.16, frequency: 750, q: 0.8 });
  },
  piano: (ctx, out, t) => {
    [261.6, 329.6, 392, 523.3].forEach((pitch, i) => {
      const at = t + i * 0.13;
      tone(ctx, out, { from: pitch, at, length: 1.1, peak: 0.2, attack: 0.005 });
      tone(ctx, out, { type: "triangle", from: pitch * 2, at, length: 0.55, peak: 0.07, attack: 0.005 });
      tone(ctx, out, { from: pitch * 3.01, at, length: 0.22, peak: 0.03, attack: 0.003 });
    });
  },
  guitar: (ctx, out, t) => {
    // an electric power chord, slightly overdriven
    const drive = ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      const x = (i / 511.5) - 1;
      curve[i] = Math.tanh(x * 3.2);
    }
    drive.curve = curve;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 2300;
    const level = ctx.createGain();
    level.gain.value = 0.34;
    drive.connect(f).connect(level).connect(out);
    [82.4, 123.5, 164.8, 246.9].forEach((pitch, i) => {
      tone(ctx, drive, { type: "sawtooth", from: pitch, at: t + i * 0.022, length: 1.25, peak: 0.45, attack: 0.004 });
    });
  },
  music: (ctx, out, t) => {
    // the needle drops, then a beepy take on the chords of Weezer's "Island in the Sun"
    noise(ctx, out, { at: t, length: 0.05, peak: 0.25, type: "highpass", frequency: 1800 });
    const chords = [
      [164.8, 196, 246.9, 329.6], // Em
      [220, 261.6, 329.6, 440], // Am
      [146.8, 220, 293.7, 370], // D
      [196, 246.9, 293.7, 392], // G
    ];
    const step = 0.27;
    const pattern = [0, 2, 1, 3, 2, 1, 3, 2];
    chords.forEach((notes, c) => {
      pattern.forEach((n, i) => {
        const at = t + 0.12 + (c * pattern.length + i) * step * 0.5;
        beep(ctx, out, notes[n], at, step * 0.46, 0.09);
      });
      tone(ctx, out, { type: "triangle", from: notes[0] / 2, at: t + 0.12 + c * pattern.length * step * 0.5, length: step * 3.6, peak: 0.2, attack: 0.01 });
    });
  },
  bed: (ctx, out, t) => {
    // one long snore
    noise(ctx, out, { at: t, length: 0.95, peak: 0.6, attack: 0.45, type: "lowpass", frequency: 340, q: 3 });
    tone(ctx, out, { type: "sawtooth", from: 62, to: 78, at: t, length: 0.9, peak: 0.2, attack: 0.42, filter: { type: "lowpass", frequency: 300 } });
  },
  barbell: (ctx, out, t) => {
    // plates clanking, then the thud of the bar hitting the floor
    [0, 0.13].forEach((delay, i) => {
      [930, 1470, 2360, 3180].forEach((pitch, n) => {
        tone(ctx, out, { from: pitch * (1 + i * 0.03), at: t + delay, length: 0.34 - n * 0.05, peak: 0.1 - n * 0.016, attack: 0.002 });
      });
    });
    tone(ctx, out, { from: 125, to: 58, at: t + 0.13, length: 0.24, peak: 0.42, attack: 0.003 });
  },
  tv: (ctx, out, t) => {
    // the switch, then a burst of static
    noise(ctx, out, { at: t, length: 0.03, peak: 0.28, attack: 0.001, type: "highpass", frequency: 2000 });
    noise(ctx, out, { at: t + 0.04, length: 0.5, peak: 0.13, attack: 0.03, type: "bandpass", frequency: 3400, q: 0.5 });
  },
  photos: (ctx, out, t) => {
    // a camera shutter
    noise(ctx, out, { at: t, length: 0.035, peak: 0.65, attack: 0.001, frequency: 2500, q: 1.2 });
    noise(ctx, out, { at: t + 0.085, length: 0.05, peak: 0.5, attack: 0.001, frequency: 1800, q: 1.2 });
  },
  lamp: (ctx, out, t) => {
    noise(ctx, out, { at: t, length: 0.022, peak: 0.45, attack: 0.001, frequency: 2800, q: 1.5 });
    tone(ctx, out, { from: 1500, to: 900, at: t, length: 0.035, peak: 0.06, attack: 0.001 });
  },
  flag: (ctx, out, t) => {
    // the opening of "Indonesia Raya", in beeps
    const beat = 0.24;
    const line = [
      [370, 1.5], [392, 0.5], [440, 1], [370, 2], [370, 1], [329.6, 1], [329.6, 1], [293.7, 1], [220, 2],
      [220, 1], [220, 1], [246.9, 1], [220, 1], [196, 1], [185, 1], [164.8, 3],
    ];
    let at = t;
    line.forEach(([pitch, beats]) => {
      const length = beats * beat;
      beep(ctx, out, pitch, at, length * 0.88, 0.17);
      at += length;
    });
  },
  meter: (ctx, out, t) => {
    // the multimeter's double beep
    beep(ctx, out, 2093, t, 0.07, 0.07);
    beep(ctx, out, 2093, t + 0.11, 0.07, 0.07);
  },
  me: (ctx, out, t) => {
    // a friendly little pop when you say hi
    tone(ctx, out, { from: 480, to: 840, at: t, length: 0.09, peak: 0.2, attack: 0.006 });
    tone(ctx, out, { from: 720, to: 1080, at: t + 0.075, length: 0.1, peak: 0.16, attack: 0.006 });
  },
};

// A longer sound stops when something else starts, so tunes don't pile up.
let playing = null;
export const playSound = (name) => {
  try {
    const ctx = context();
    if (!ctx) return;
    if (playing) {
      playing.gain.setTargetAtTime(0, ctx.currentTime, 0.015);
      const old = playing;
      setTimeout(() => old.disconnect(), 150);
    }
    playing = ctx.createGain();
    playing.connect(ctx.destination);
    SOUND_BUILDERS[name]?.(ctx, playing, ctx.currentTime + 0.005);
  } catch {
    // no sound available, and everything else still works
  }
};

// Talking: every letter is a tiny animal-style syllable, pitched by the letter.
const VOWEL_TONE = { a: 1150, e: 1750, i: 2300, o: 780, u: 620, y: 2000 };
export const buildTalk = (ctx, out, t, letter) => {
  const ch = letter.toLowerCase();
  const code = ch.charCodeAt(0) - 97;
  const pitch = 460 + ((code * 37) % 170) + Math.random() * 18;
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = VOWEL_TONE[ch] ?? 1000 + ((code * 53) % 800);
  f.Q.value = 2.2;
  const gain = shape(ctx, t, 0.62, 0.006, 0.06);
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(pitch * 1.1, t);
  osc.frequency.exponentialRampToValueAtTime(pitch * 0.92, t + 0.055);
  osc.connect(f).connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + 0.07);
};

export const playTalk = (letter) => {
  try {
    const ctx = context();
    if (!ctx || ctx.state !== "running") return;
    buildTalk(ctx, ctx.destination, ctx.currentTime + 0.002, letter);
  } catch {
    // the words still appear without the voice
  }
};
