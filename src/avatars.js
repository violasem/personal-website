// The pixel me in the room. Each letter in a row is a color; the outline is added for you.
export const AVATAR_COLORS = {
  O: "#141216", // outline, and the eyes
  W: "#fffaf2", // sparkle
  s: "#c58e62", // tan skin
  r: "#d9806a", // blush
  b: "#2a2e38", // black shirt
  p: "#9398a2", // grey pants
  f: "#4a3a2e", // shoes
  k: "#6b4a36", // hair
  K: "#93704f", // hair highlight
};

const eyeRow = (eye) => `kkksss${eye}sss${eye}ssskkk`;
const EYES_OPEN = ["sOs", "OWO", "OOO", "OOO", "OOO", "sOs"].map(eyeRow);
const EYES_SHUT = ["sss", "sss", "sss", "sss", "OOO", "sss"].map(eyeRow);

const head = (eyes) => [
  "......kkkkkkkkk......",
  "....kkkkKKKkkkkkk....",
  "..kkkkKKKkkkkkkkkkk..",
  ".kkkKKKkkkkkkkkkkkkk.",
  ".kkKKkkkkkkkkkkkkkkk.",
  "kkKKkkkkkkskkkkkkkkkk",
  "kkKkkkkkksssKkkkkkkkk".replace("K", "k").replace("K", "k"),
  "kkkkkkkksssssKkkkkkkk".replace("K", "k"),
  "kkkkkksssssssssKkkkkk".replace("K", "k"),
  "kkkkssssssssssssskkkk",
  "kkksssssssssssssssskk".slice(0, 18) + "kkk",
  ...eyes,
  "kkkrrrsssssssssrrrkkk",
  ".kkkssssssssssssskkk.",
  "...kkssssssssssskk...",
  "......ksssssssk......",
];

const HAIR_BACK = ["kkkk", "kKkk", "kkkk", "kKkk", "kkKk", "kkkk", "kKkk", ".kkk", ".kk."];
const mirror = (rows) => rows.map((row) => [...row].reverse().join(""));

const NECK = ["...bbsssssbb...", "...bbsssssbb..."];
const ARMS_DOWN = [".ssbbbbbbbbbss.", "ss.bbbbbbbbb.ss", "ss.bbbbbbbbb.ss"];
const ARM_UP = ["...bbbbbbbbbss.", "...bbbbbbbbb.ss", "...bbbbbbbbb.ss"];
const LEGS_SITTING = [".ppppppppppppp.", "ffpppppppppppff"];
const LEGS_STANDING = ["....ppppppp....", "....ppp.ppp....", "....ppp.ppp....", "....ppp.ppp....", "....fff.fff...."];

const WIDTH = 35;
const HEAD_X = 7;
const HEAD_ROWS = 21;
const put = (grid, rows, x, y) =>
  rows.forEach((row, j) =>
    [...row].forEach((c, i) => {
      if (c !== ".") grid[y + j][x + i] = c;
    }),
  );

const compose = (legs, armUp, wiggle, blink) => {
  const body = [...NECK, ...(armUp ? ARM_UP : ARMS_DOWN), ...legs];
  const grid = Array.from({ length: HEAD_ROWS + body.length }, () => Array(WIDTH).fill("."));
  put(grid, HAIR_BACK, HEAD_X, 15);
  put(grid, mirror(HAIR_BACK), HEAD_X + 17, 15);
  put(grid, body, HEAD_X + 3, HEAD_ROWS);
  put(grid, head(blink ? EYES_SHUT : EYES_OPEN), HEAD_X, 0);
  if (armUp) {
    put(grid, ["ssssss", "sss"], HEAD_X - 3, HEAD_ROWS + 2);
    put(grid, Array(8).fill("sss"), HEAD_X - 3, HEAD_ROWS - 6);
    put(grid, Array(4).fill("sssss"), HEAD_X - (wiggle ? 5 : 4), HEAD_ROWS - 10);
  }
  // draw the outline around every filled pixel, with one spare pixel on each side
  const pad = [Array(WIDTH + 2).fill("."), ...grid.map((row) => [".", ...row, "."]), Array(WIDTH + 2).fill(".")];
  return pad.map((row, j) =>
    row
      .map((c, i) => {
        if (c !== ".") return c;
        const near = [pad[j - 1]?.[i], pad[j + 1]?.[i], row[i - 1], row[i + 1]];
        return near.some((n) => n && n !== ".") ? "O" : ".";
      })
      .join(""),
  );
};

const POSES = {
  sit: [LEGS_SITTING, false],
  sitwave: [LEGS_SITTING, true],
  stand: [LEGS_STANDING, false],
  wave: [LEGS_STANDING, true],
};

const cache = {};
// One picture of me: pose is "sit", "sitwave", "stand" or "wave".
export const avatarPose = (pose, wiggle = false, blink = false) => {
  const key = `${pose}-${wiggle}-${blink}`;
  cache[key] ??= compose(...POSES[pose], wiggle, blink);
  return cache[key];
};
