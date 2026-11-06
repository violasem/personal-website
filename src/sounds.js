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
    // the needle drops, a bit of crackle, then a short tune
    noise(ctx, out, { at: t, length: 0.05, peak: 0.25, type: "highpass", frequency: 1800 });
    for (let i = 0; i < 14; i++) {
      noise(ctx, out, { at: t + 0.05 + Math.random() * 1.3, length: 0.012, peak: 0.08 + Math.random() * 0.08, attack: 0.001, type: "highpass", frequency: 2600 });
    }
    [[329.6, 0.2], [392, 0.45], [440, 0.7], [392, 0.95], [329.6, 1.2]].forEach(([pitch, at]) => {
      tone(ctx, out, { type: "triangle", from: pitch, at: t + at, length: 0.4, peak: 0.16, attack: 0.02, filter: { type: "lowpass", frequency: 1300 } });
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
    // cloth flapping in the wind
    [0, 0.13, 0.25, 0.4, 0.52].forEach((delay, i) => {
      noise(ctx, out, { at: t + delay, length: 0.11, peak: 0.55 - i * 0.05, attack: 0.012, frequency: 560 + i * 45, q: 0.8 });
    });
  },
  me: (ctx, out, t) => {
    // a friendly little pop when you say hi
    tone(ctx, out, { from: 480, to: 840, at: t, length: 0.09, peak: 0.2, attack: 0.006 });
    tone(ctx, out, { from: 720, to: 1080, at: t + 0.075, length: 0.1, peak: 0.16, attack: 0.006 });
  },
};

export const playSound = (name) => {
  try {
    const ctx = context();
    if (!ctx) return;
    SOUND_BUILDERS[name]?.(ctx, ctx.destination, ctx.currentTime + 0.005);
  } catch {
    // no sound available, and everything else still works
  }
};
