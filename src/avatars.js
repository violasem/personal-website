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

const eyeRows = (left, right) => left.map((row, i) => `kksss${row}sss${right[i]}ssskk`);
const mirrorRow = (row) => [...row].reverse().join("");
const OPEN = ["OOW", "OOO", "OOO", "OOO", "OOO"];
const SHUT = ["sss", "sss", "sss", "sss", "OOO"];
const HAPPY = ["sssss", "ssOss", "sOsOs", "OsssO", "sssss"].map((row) => `kks${row}sss${row}skk`);
const EYES = {
  open: eyeRows(OPEN, OPEN.map(mirrorRow)),
  shut: eyeRows(SHUT, SHUT),
  happy: HAPPY,
};

const head = (eyes) => [
  "......kkkkkkk......",
  "....kkkKKKkkkkk....",
  "..kkkKKKkkkkkkkkk..",
  ".kkKKKkkkkkkkkkkkk.",
  ".kKKkkkkkskkkkkkkk.",
  "kkKkkkkksssskkkkkkk".replace("ssss", "sss") + "k",
  "kkkkkksssssssskkkkk".replace("ssssssss", "sssssss") + "k",
  "kkkksssssssssssskkk".replace("ssssssssssss", "sssssssssss") + "k",
  ...eyes,
  "kkrrrsssssssssrrrkk",
  ".kksssssssssssssKk.".replace("Kk", "kk"),
  "...kksssssssssskk..".replace("ssssssssss", "sssssssss") + ".",
];

const HAIR_BACK = ["kkk", "kKk", "kkk", "kKk", "kkk", "kKk", ".kk", ".k."];
const mirror = (rows) => rows.map(mirrorRow);

const TOP = ["..bbsssssbb..", "..bbsssssbb..", ".sbbbbbbbbbs.", "ss.bbbbbbb.ss", "ss.bbbbbbb.ss"];
const LEGS = {
  sit: [".ppppppppppp.", "ffpppppppppff"],
  stand: ["...ppppppp...", "...ppp.ppp...", "...ppp.ppp...", "...fff.fff..."],
};

const WIDTH = 19;
const HEAD_ROWS = 16;
const put = (grid, rows, x, y) =>
  rows.forEach((row, j) =>
    [...row].forEach((c, i) => {
      if (c !== ".") grid[y + j][x + i] = c;
    }),
  );

const compose = (pose, eyes) => {
  const body = [...TOP, ...LEGS[pose]];
  const grid = Array.from({ length: HEAD_ROWS + body.length }, () => Array(WIDTH).fill("."));
  put(grid, HAIR_BACK, 0, 12);
  put(grid, mirror(HAIR_BACK), 16, 12);
  put(grid, body, 3, HEAD_ROWS);
  put(grid, head(EYES[eyes]), 0, 0);
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

const cache = {};
// One picture of me: pose is "sit" or "stand"; eyes are "open", "shut" or "happy".
export const avatarPose = (pose, eyes = "open") => {
  const key = `${pose}-${eyes}`;
  cache[key] ??= compose(pose, eyes);
  return cache[key];
};
