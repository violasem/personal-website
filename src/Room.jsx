import React, { useEffect, useRef, useState } from "react";
import { room } from "./content.js";

const W = 236;
const H = 120;
const FPS = 10;

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
      gain.gain.exponentialRampToValueAtTime(0.04, at + 0.012);
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
  piano: () => playNotes([261.6, 329.6, 392, 523.3], 0.14, "square", 0.3),
  guitar: () => playNotes([164.8, 246.9, 329.6, 392, 493.9], 0.05, "triangle", 0.7),
  lamp: () => playNotes([1400], 0.01, "square", 0.04),
};

const C = {
  ink: "#2a2f3a",
  wall: "#d6dde4",
  wallDot: "#ccd4dc",
  wallShade: "#bcc6d0",
  trim: "#f1ece1",
  trimShade: "#d5cec0",
  floorA: "#b98f66",
  floorB: "#ad8359",
  floorLine: "#8f6a49",
  woodL: "#b98a60",
  wood: "#9a6e4b",
  woodD: "#74503a",
  navyL: "#4c6685",
  navy: "#34475f",
  navyD: "#232f42",
  maize: "#f0c84a",
  rose: "#b25a68",
  roseL: "#d98a96",
  roseD: "#8c4350",
  blueL: "#9db6cd",
  blue: "#7596b5",
  blueD: "#587792",
  sheet: "#f5f1e6",
  sheetD: "#d9d3c6",
  sky: ["#9fcdea", "#b4d9ef", "#cbe6f3", "#e0f1f5"],
  sun: "#f4cf63",
  cloud: "#ffffff",
  guitarL: "#e0ab66",
  guitar: "#c78d4c",
  guitarD: "#94642f",
  hole: "#2a1f18",
  metal: "#b7c0c8",
  metalD: "#7f8995",
  plate: "#2c323c",
  leafL: "#6fa877",
  leaf: "#4f8a5c",
  leafD: "#386a47",
  pot: "#b86f50",
  potD: "#935439",
};

const Z_SPRITE = ["#####", "   # ", "  #  ", " #   ", "#####"];
const NOTE_SPRITE = ["  ##", "  # ", "  # ", "### ", "### "];
const M_SPRITE = ["##   ##", "### ###", "#######", "## # ##", "##   ##", "##   ##"];

// One drawing pass of the whole room. `s` holds the active item and animation clock.
const drawRoom = (ctx, s) => {
  const R = (c, x, y, w, h) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
  };
  const sprite = (rows, c, x, y) => {
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) if (row[i] !== " ") R(c, x + i, y + j, 1, 1);
    });
  };
  // a rounded shape from a list of half-widths, one per row
  const blob = (cx, y, widths, fill, line) => {
    widths.forEach((hw, j) => {
      R(line, cx - hw, y + j, hw * 2 + 1, 1);
      const above = widths[j - 1] ?? -1;
      const below = widths[j + 1] ?? -1;
      const inner = Math.min(hw - 1, above - 0, below - 0);
      if (inner >= 0) R(fill, cx - inner, y + j, inner * 2 + 1, 1);
    });
  };
  const since = (id) => (s.plays[id] === undefined ? Infinity : s.time - s.plays[id]);
  const frame = Math.floor(s.time * FPS);

  // wall
  R(C.wall, 0, 0, W, 84);
  for (let y = 4; y < 80; y += 8) for (let x = (y % 16 === 4 ? 2 : 6); x < W; x += 8) R(C.wallDot, x, y, 1, 1);
  R(C.wallShade, 0, 82, W, 2);
  R(C.trim, 0, 84, W, 3);
  R(C.trimShade, 0, 87, W, 1);

  // floor
  for (let row = 0; row < 6; row++) {
    const y = 88 + row * 6;
    R(row % 2 ? C.floorB : C.floorA, 0, y, W, 6);
    R(C.floorLine, 0, y + 5, W, 1);
    for (let x = (row * 23) % 41; x < W; x += 41) R(C.floorLine, x, y, 1, 5);
  }

  // window, with a cloud drifting past
  R(C.ink, 19, 7, 37, 37);
  R(C.trim, 20, 8, 35, 35);
  C.sky.forEach((c, i) => R(c, 22, 10 + i * 8, 31, 8));
  R(C.sky[3], 22, 40, 31, 1);
  ctx.save();
  ctx.beginPath();
  ctx.rect(22, 10, 31, 31);
  ctx.clip();
  blob(44, 13, [2, 3, 4, 4, 4, 3, 2], C.sun, C.sun);
  const cloudX = 14 + (s.time * 1.5) % 50;
  const cx = Math.floor(cloudX);
  R(C.cloud, cx, 28, 13, 3);
  R(C.cloud, cx + 2, 26, 7, 2);
  R(C.cloud, cx + 4, 25, 3, 1);
  ctx.restore();
  R(C.trim, 37, 10, 2, 31);
  R(C.trim, 22, 24, 31, 2);
  R(C.ink, 17, 44, 41, 1);
  R(C.trim, 17, 43, 41, 2);
  R(C.trimShade, 17, 45, 41, 1);
  // curtains
  R(C.ink, 13, 4, 49, 1);
  [14, 53].forEach((x) => {
    R(C.rose, x, 5, 8, 42);
    R(C.roseL, x + 1, 5, 1, 42);
    R(C.roseD, x + 3, 5, 1, 42);
    R(C.roseL, x + 5, 5, 1, 42);
    R(C.roseD, x + 7, 5, 1, 42);
    R(C.roseD, x, 47, 8, 1);
  });

  // Go Blue pennant
  R(C.woodD, 69, 8, 2, 20);
  for (let i = 0; i < 30; i++) {
    const half = Math.round(9 - (i * 9) / 30);
    R(C.navy, 71 + i, 18 - half, 1, half * 2);
    R(C.maize, 71 + i, 18 - half - 1, 1, 1);
    R(C.maize, 71 + i, 18 + half, 1, 1);
  }
  sprite(M_SPRITE, C.maize, 74, 15);

  // shelf with books
  R(C.woodD, 72, 44, 30, 1);
  R(C.wood, 72, 42, 30, 2);
  [[74, 11, C.rose], [77, 13, C.navy], [80, 10, C.leaf], [83, 13, C.guitar], [86, 11, C.blue]].forEach(([x, h, c]) => {
    R(c, x, 42 - h, 3, h);
    R(C.sheet, x + 1, 42 - h + 2, 1, 2);
  });
  blob(96, 33, [1, 3, 4, 4, 3], C.leaf, C.leafD);
  R(C.pot, 93, 38, 6, 4);
  R(C.potD, 93, 41, 6, 1);

  // polaroids on a string
  R(C.ink, 106, 4, 50, 1);
  [
    [108, ["#9fcdea", "#7596b5", "#4f8a5c"]],
    [120, ["#f0c84a", "#b25a68", "#74503a"]],
    [132, ["#2b3f5c", "#f0c84a", "#2b3f5c"]],
    [144, ["#d98a96", "#f5f1e6", "#6fa877"]],
  ].forEach(([x, colors], i) => {
    const wiggle = s.active === "photos" && (frame + i) % 6 < 3 ? 1 : 0;
    const y = 5 + (i % 2) + wiggle;
    R(C.ink, x - 1, y, 11, 14);
    R(C.cloud, x, y + 1, 9, 12);
    colors.forEach((c, j) => R(c, x + 1, y + 2 + j * 2 + (j ? 1 : 0), 7, j ? 2 : 3));
    R(C.rose, x + 4, y - 1, 1, 2);
  });

  // Indonesian flag, which waves when you pick it
  R(C.ink, 206, 7, 2, 32);
  R(C.maize, 206, 6, 2, 1);
  for (let i = 0; i < 20; i++) {
    const wave = s.active === "flag" && (i + frame) % 8 < 4 ? 1 : 0;
    R(C.ink, 208 + i, 9 + wave, 1, 18);
    R("#c8423a", 208 + i, 10 + wave, 1, 8);
    R(C.cloud, 208 + i, 18 + wave, 1, 8);
  }

  // bed
  const inBed = s.active === "bed";
  R(C.ink, 5, 56, 8, 42);
  R(C.wood, 6, 57, 6, 40);
  R(C.woodL, 7, 58, 1, 38);
  R(C.ink, 59, 70, 6, 28);
  R(C.wood, 60, 71, 4, 26);
  R(C.ink, 12, 85, 48, 8);
  R(C.wood, 12, 86, 48, 6);
  R(C.woodD, 12, 90, 48, 2);
  R(C.ink, 12, 75, 48, 11);
  R(C.sheet, 13, 76, 46, 9);
  R(C.sheetD, 13, 83, 46, 2);
  R(C.ink, 13, 67, 16, 11);
  R(C.cloud, 14, 68, 14, 9);
  R(C.sheetD, 14, 75, 14, 2);
  R(C.ink, 28, 71, 32, 15);
  R(C.blue, 29, 72, 30, 13);
  R(C.blueL, 29, 72, 30, 2);
  R(C.blueD, 29, 83, 30, 2);
  for (let x = 34; x < 59; x += 8) R(C.blueL, x, 74, 2, 9);
  R(C.sheet, 29, 72, 4, 13);
  R(C.sheetD, 32, 72, 1, 13);
  if (inBed) {
    const p = frame % 30;
    [[32, 0, 0], [40, 9, 2], [48, 18, 4]].forEach(([x, delay, drift]) => {
      const f = (p - delay + 30) % 30;
      if (f < 18) sprite(Z_SPRITE, C.navy, x + drift, 62 - Math.floor(f * 0.7) - delay / 2);
    });
  }

  // cabinet and record player
  R(C.ink, 71, 73, 32, 24);
  R(C.wood, 72, 74, 30, 22);
  R(C.woodL, 72, 74, 30, 1);
  R(C.woodL, 74, 77, 12, 16);
  R(C.wood, 75, 78, 10, 14);
  R(C.woodL, 88, 77, 12, 16);
  R(C.wood, 89, 78, 10, 14);
  R(C.maize, 84, 84, 1, 2);
  R(C.maize, 89, 84, 1, 2);
  R(C.ink, 73, 97, 3, 2);
  R(C.ink, 98, 97, 3, 2);
  R(C.ink, 69, 71, 36, 3);
  R(C.woodD, 70, 72, 34, 1);
  R(C.ink, 72, 59, 30, 13);
  R(C.navyL, 73, 60, 28, 6);
  R(C.navy, 73, 66, 28, 5);
  R(C.maize, 76, 68, 2, 1);
  R(C.roseL, 80, 68, 2, 1);
  const on = s.active === "music" || since("music") < 2;
  const disc = [5, 8, 9, 9, 8, 5];
  disc.forEach((hw, j) => R(C.plate, 84 - hw, 60 + j, hw * 2 + 1, 1));
  R("#444b57", 77, 62, 2, 2);
  R("#444b57", 89, 62, 2, 2);
  R(C.rose, 81, 62, 6, 2);
  R(C.sheet, 83, 62, 2, 1);
  const spin = [[-6, 1], [-2, 0], [2, 0], [6, 1], [5, 4], [2, 5], [-2, 5], [-5, 4]][on ? frame % 8 : 0];
  R(C.metal, 84 + spin[0], 60 + spin[1], 2, 1);
  R(C.metalD, 98, 60, 2, 5);
  R(C.metal, 97, 60, 1, 1);
  R(C.metal, 95, 61, 2, 1);
  R(C.metal, 93, 62, 2, 1);
  if (on) {
    const p = frame % 24;
    [[74, 0], [92, 12]].forEach(([x, delay]) => {
      const f = (p - delay + 24) % 24;
      if (f < 16) sprite(NOTE_SPRITE, C.roseD, x + (f % 8 < 4 ? 0 : 1), 54 - Math.floor(f * 0.6));
    });
  }

  // piano
  R(C.ink, 109, 43, 47, 55);
  R(C.navy, 110, 44, 45, 53);
  R(C.navyL, 110, 44, 45, 2);
  R(C.navyD, 110, 77, 45, 20);
  R(C.navy, 113, 80, 39, 13);
  R(C.navyD, 114, 81, 37, 11);
  R(C.maize, 127, 94, 3, 1);
  R(C.maize, 134, 94, 3, 1);
  R(C.ink, 123, 49, 19, 14);
  R(C.sheet, 124, 50, 17, 12);
  [52, 55, 58].forEach((y, i) => R(C.sheetD, 126, y, i === 2 ? 8 : 13, 1));
  const metronome = since("piano") < 1.3 ? (frame % 4 < 2 ? -1 : 1) : 0;
  blob(148, 36, [1, 1, 2, 2, 3, 3, 4], C.woodL, C.ink);
  R(C.ink, 148 + metronome, 38, 1, 4);
  R(C.ink, 106, 64, 53, 5);
  R(C.navyD, 107, 65, 51, 3);
  R(C.ink, 107, 69, 51, 9);
  const pressed = since("piano") < 1 ? Math.floor(since("piano") * 12) : -1;
  for (let k = 0; k < 16; k++) {
    const x = 108 + k * 3 + (k > 7 ? 1 : 0);
    const down = pressed >= 0 && (pressed === k || pressed === 15 - k);
    R(down ? C.roseL : C.sheet, x, down ? 71 : 70, 2, down ? 7 : 7);
  }
  [1, 2, 4, 5, 6, 9, 10, 12, 13, 14].forEach((k) => R(C.ink, 110 + k * 3 - 1 + (k > 7 ? 1 : 0), 70, 2, 4));

  // piano lamp
  R(C.ink, 114, 41, 9, 3);
  R(C.maize, 115, 42, 7, 1);
  R(C.ink, 118, 33, 2, 8);
  blob(118, 26, [3, 4, 4, 5, 5, 6, 6, 7], s.night ? "#ffe9a8" : "#e6cf9a", C.ink);

  // guitar, leaning on the wall
  const sway = since("guitar") < 0.8 ? (frame % 4 < 2 ? 1 : 0) : 0;
  const gx = 172 + sway;
  R(C.ink, gx - 3, 22, 7, 10);
  R(C.woodD, gx - 2, 23, 5, 8);
  [24, 27].forEach((y) => {
    R(C.metal, gx - 5, y, 2, 1);
    R(C.metal, gx + 4, y, 2, 1);
  });
  R(C.ink, gx - 2, 32, 5, 30);
  R(C.woodD, gx - 1, 32, 3, 30);
  for (let y = 36; y < 62; y += 6) R(C.woodL, gx - 1, y, 3, 1);
  const body = [5, 7, 8, 9, 9, 9, 8, 7, 6, 6, 7, 9, 10, 11, 11, 12, 12, 12, 12, 12, 12, 11, 11, 10, 9, 7, 5];
  blob(gx, 62, body, C.guitar, C.ink);
  R(C.guitarL, gx - 7, 66, 2, 5);
  R(C.guitarL, gx - 10, 76, 2, 7);
  R(C.guitarD, gx + 8, 76, 2, 9);
  blob(gx, 67, [2, 3, 3, 3, 3, 3, 2], C.hole, C.ink);
  R(C.woodD, gx - 4, 81, 9, 2);
  const buzz = since("guitar") < 0.8;
  [-1, 1].forEach((d, i) => {
    const xo = buzz && (frame + i) % 2 ? (d < 0 ? -1 : 1) : 0;
    R(buzz ? C.cloud : C.sheetD, gx + d, 32, 1, 30);
    R(buzz ? C.cloud : C.sheetD, gx + d + xo, 62, 1, 20);
  });
  R(C.floorLine, gx - 12, 89, 25, 1);

  // plant
  blob(190, 66, [1, 3, 5, 6, 7, 7, 7, 6, 5], C.leaf, C.leafD);
  R(C.leafL, 186, 69, 2, 2);
  R(C.leafL, 191, 72, 2, 2);
  R(C.leafL, 193, 68, 1, 2);
  R(C.ink, 184, 74, 13, 15);
  R(C.pot, 185, 75, 11, 13);
  R(C.potD, 192, 75, 4, 13);
  R(C.ink, 183, 74, 15, 3);
  R(C.pot, 184, 75, 13, 1);

  // TV on a stand; the screen is drawn last so it glows at night
  R(C.ink, 205, 80, 26, 18);
  R(C.wood, 206, 81, 24, 16);
  R(C.woodL, 206, 81, 24, 1);
  R(C.woodD, 208, 85, 20, 5);
  R(C.ink, 211, 87, 14, 1);
  R(C.ink, 207, 98, 3, 2);
  R(C.ink, 226, 98, 3, 2);
  R(C.ink, 210, 44, 1, 1);
  R(C.ink, 209, 42, 1, 2);
  R(C.ink, 208, 40, 1, 2);
  R(C.ink, 225, 44, 1, 1);
  R(C.ink, 226, 42, 1, 2);
  R(C.ink, 227, 40, 1, 2);
  R(C.ink, 201, 45, 34, 35);
  R("#4d5563", 202, 46, 32, 33);
  R("#646d7c", 202, 46, 32, 1);
  R(C.metal, 229, 52, 3, 3);
  R(C.metal, 229, 58, 3, 3);
  R(C.metalD, 229, 66, 3, 1);
  R(C.metalD, 229, 68, 3, 1);
  R(C.metalD, 229, 70, 3, 1);

  // rug
  R(C.sheet, 54, 101, 2, 17);
  R(C.sheet, 126, 101, 2, 17);
  R(C.rose, 56, 101, 70, 17);
  R(C.roseD, 56, 101, 70, 1);
  R(C.roseD, 56, 117, 70, 1);
  R(C.roseL, 58, 103, 66, 13);
  R(C.rose, 59, 104, 64, 11);
  R(C.sheet, 61, 106, 60, 7);
  R(C.roseL, 62, 107, 58, 5);

  // bench
  R(C.ink, 121, 91, 26, 5);
  R(C.rose, 122, 92, 24, 2);
  R(C.woodD, 122, 94, 24, 1);
  R(C.ink, 124, 96, 3, 7);
  R(C.ink, 141, 96, 3, 7);

  // barbell, with a little shadow when it's up
  const t = since("barbell");
  let lift = 0;
  if (t < 1.2) {
    const f = Math.floor(t * FPS);
    lift = [0, -3, -7, -11, -13, -14, -14, -14, -11, -6, -2, 0][f] ?? 0;
  }
  if (lift < 0) {
    R(C.roseD, 67, 114, 10, 1);
    R(C.roseD, 105, 114, 10, 1);
  }
  const by = 104 + lift;
  R(C.ink, 63, by + 4, 56, 3);
  R(C.metal, 64, by + 5, 54, 1);
  [[68, 0, 4, 13, C.plate], [72, 2, 3, 9, C.rose], [75, 3, 2, 7, C.navyL]].forEach(([x, top, w, h, c]) => {
    R(C.ink, x - 1, by - 1 + top - 1, w + 2, h + 3);
    R(c, x, by + top - 1, w, h + 1);
    const mx = 182 - x - w;
    R(C.ink, mx - 1, by - 1 + top - 1, w + 2, h + 3);
    R(c, mx, by + top - 1, w, h + 1);
  });

  // night: dim the room, then light the sky and the lamp
  if (s.night) {
    ctx.globalCompositeOperation = "multiply";
    R("#4a5488", 0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    [[46, "rgba(44,30,12,0.3)"], [36, "rgba(48,33,13,0.35)"], [26, "rgba(56,39,15,0.4)"], [16, "rgba(70,50,20,0.45)"]].forEach(([r, c]) => {
      for (let dy = -r; dy <= r; dy += 1) {
        const hw = Math.round(Math.sqrt(r * r - dy * dy) * 1.25);
        R(c, 118 - hw, 40 + dy, hw * 2, 1);
      }
    });
    ctx.globalCompositeOperation = "source-over";
    R("#121a3a", 22, 10, 31, 31);
    R("#1c2750", 22, 26, 31, 15);
    [[25, 13], [30, 19], [34, 12], [41, 21], [47, 30], [26, 33], [50, 16], [35, 36], [44, 35]].forEach(([x, y], i) => {
      if (s.reduced || (frame + i * 3) % 12 > 1) R("#fff6cf", x, y, 1, 1);
    });
    blob(44, 13, [2, 3, 4, 4, 4, 3, 2], "#f2eedc", "#f2eedc");
    R("#121a3a", 46, 13, 3, 6);
    R("#7d8197", 37, 10, 2, 31);
    R("#7d8197", 22, 24, 31, 2);
    blob(118, 26, [3, 4, 4, 5, 5, 6, 6, 7], "#ffe9a8", "#6b5a35");
  }

  // the TV screen, with letterbox bars around a little film when it's on
  R(C.ink, 204, 49, 24, 26);
  R("#1b2029", 205, 50, 22, 24);
  if (s.active === "tv") {
    const on = s.reduced ? 1 : s.time - s.activeAt;
    if (on < 0.5) {
      for (let y = 50; y < 74; y += 2) {
        for (let x = 205; x < 227; x += 2) {
          R((x * 7 + y * 13 + frame * 31) % 5 < 2 ? "#e8e8e8" : "#59606c", x, y, 2, 2);
        }
      }
    } else {
      ["#f0c84a", "#ec9f53", "#d9705c", "#a4506e"].forEach((c, i) => R(c, 205, 54 + i * 4, 22, 4));
      blob(217, 60, [2, 3, 3, 3, 2], "#fff0b8", "#fff0b8");
      R("#3a2240", 205, 68, 22, 2);
      const walker = 205 + (frame % 44) / 2;
      const wx = Math.floor(walker);
      if (wx < 225) {
        R("#3a2240", wx, 62, 2, 2);
        R("#3a2240", wx, 64, 2, 3);
        R("#3a2240", wx + (frame % 4 < 2 ? 0 : 1), 67, 1, 1);
      }
      R(C.ink, 205, 50, 22, 4);
      R(C.ink, 205, 70, 22, 4);
    }
  } else {
    R("#39414e", 207, 52, 5, 1);
    R("#39414e", 207, 53, 2, 2);
  }

  // a bobbing arrow over whatever you've picked
  const spot = s.active && ROOM_SPOTS[s.active];
  if (spot) {
    const bob = frame % 8 < 4 ? 0 : 1;
    const ax = spot.arrow[0];
    const ay = spot.arrow[1] + bob + (s.active === "barbell" ? lift : 0);
    R(C.ink, ax - 4, ay, 9, 1);
    R(C.ink, ax - 3, ay + 1, 7, 1);
    R(C.maize, ax - 3, ay + 1, 7, 1);
    R(C.ink, ax - 4, ay + 1, 1, 1);
    R(C.ink, ax + 4, ay + 1, 1, 1);
    R(C.ink, ax - 3, ay + 2, 1, 1);
    R(C.maize, ax - 2, ay + 2, 5, 1);
    R(C.ink, ax + 3, ay + 2, 1, 1);
    R(C.ink, ax - 2, ay + 3, 1, 1);
    R(C.maize, ax - 1, ay + 3, 3, 1);
    R(C.ink, ax + 2, ay + 3, 1, 1);
    R(C.ink, ax - 1, ay + 4, 1, 1);
    R(C.maize, ax, ay + 4, 1, 1);
    R(C.ink, ax + 1, ay + 4, 1, 1);
    R(C.ink, ax, ay + 5, 1, 1);
  }
};

// Where each item can be clicked, and where its arrow sits, on the 200 × 120 grid.
const ROOM_SPOTS = {
  bed: { box: [4, 54, 62, 46], arrow: [21, 60] },
  music: { box: [68, 52, 38, 47], arrow: [87, 50] },
  piano: { box: [106, 44, 54, 56], arrow: [134, 37] },
  guitar: { box: [159, 20, 26, 72], arrow: [172, 13] },
  barbell: { box: [56, 100, 70, 20], arrow: [91, 96] },
  tv: { box: [200, 40, 36, 60], arrow: [218, 36] },
  photos: { box: [106, 2, 50, 20], arrow: [131, 21] },
  lamp: { box: [108, 24, 20, 20], arrow: [118, 18] },
  flag: { box: [204, 4, 26, 26], arrow: [218, 29] },
};

export default function Room() {
  const [active, setActive] = useState(null);
  const canvasRef = useRef(null);
  const state = useRef({ active: null, plays: {}, time: 0, activeAt: 0, night: false, reduced: false });
  const wasActive = useRef(false);
  const current = room.items.find((item) => item.id === active);

  useEffect(() => {
    state.current.active = active;
    state.current.activeAt = state.current.time;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduced = reducedMotion();
    state.current.reduced = reduced;
    let timer;
    let visible = true;
    const began = performance.now();

    const draw = () => {
      state.current.time = reduced ? 0 : (performance.now() - began) / 1000;
      ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      drawRoom(ctx, state.current);
    };
    // every pixel of the art stays the same size at any screen width
    const size = () => {
      const scale = Math.max(2, Math.ceil((canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 2)) / W));
      canvas.width = W * scale;
      canvas.height = H * scale;
      draw();
    };
    const start = () => {
      clearInterval(timer);
      if (!reduced && visible) timer = setInterval(draw, 1000 / FPS);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    observer.observe(canvas);
    const resize = new ResizeObserver(size);
    resize.observe(canvas);
    size();
    start();
    state.current.redraw = draw;
    return () => {
      clearInterval(timer);
      observer.disconnect();
      resize.disconnect();
    };
  }, []);

  useEffect(() => {
    state.current.redraw?.();
  }, [active]);

  const play = (id) => {
    setActive(id);
    if (id === "lamp") {
      state.current.night = !state.current.night;
      state.current.redraw?.();
    }
    if (reducedMotion()) return;
    state.current.plays[id] = state.current.time;
    SOUNDS[id]?.();
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
        <div className="room-scene">
          <canvas ref={canvasRef} width={W} height={H} role="img" aria-label="A pixel art drawing of my room, with a bed, a record player, a piano, a guitar, a barbell, a TV, polaroids, a lamp, and an Indonesian flag" />
          {room.items.map((item) => {
            const [x, y, w, h] = ROOM_SPOTS[item.id].box;
            const place = {
              left: `${(x / W) * 100}%`,
              top: `${(y / H) * 100}%`,
              width: `${(w / W) * 100}%`,
              height: `${(h / H) * 100}%`,
            };
            const shared = {
              className: "room-hit",
              style: place,
              "aria-label": `${item.name}. ${item.text}`,
              onPointerEnter: (e) => e.pointerType === "mouse" && setActive(item.id),
              onFocus: () => setActive(item.id),
            };
            return item.url ? (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                {...shared}
                onPointerDown={() => {
                  wasActive.current = active === item.id;
                }}
                onClick={(e) => {
                  // on a phone, the first tap explains it; a second tap or the caption link opens it
                  if (isTouch() && !wasActive.current) e.preventDefault();
                  setActive(item.id);
                }}
              />
            ) : (
              <button key={item.id} type="button" {...shared} onClick={() => play(item.id)} />
            );
          })}
        </div>

        <div className="room-caption" aria-live="polite">
          {current ? (
            <p key={current.id}>
              <strong>{current.name}:</strong> {current.text}
              {current.url && (
                <a href={current.url} target="_blank" rel="noopener noreferrer">
                  {current.link}
                </a>
              )}
            </p>
          ) : (
            <p>{room.hint}</p>
          )}
        </div>
      </div>

    </section>
  );
}
