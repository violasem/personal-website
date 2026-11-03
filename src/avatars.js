// The pixel me in the room. Every row is 21 pixels wide; each letter is a color.
export const AVATAR_COLORS = {
  s: "#c58e62", // tan skin
  d: "#ad7850", // skin shadow
  r: "#d9806a", // blush
  g: "#2a1c17", // lashes
  e: "#17120f", // pupil
  W: "#fffaf2", // white of the eye
  b: "#20232b", // black shirt
  B: "#3a3f4a", // shirt highlight
  p: "#8f949e", // grey pants
  P: "#6f747e", // pants shadow
  f: "#3b3128", // shoes
  k: "#5f4232", // hair
  K: "#8a6548", // hair highlight
};

const pad = (row) => {
  const left = Math.floor((21 - row.length) / 2);
  return ".".repeat(left) + row + ".".repeat(21 - row.length - left);
};
const face = (middle) => `.kk${middle}kk.`;

const LEFT_EYE = ["sgggs", "WeWeW", "WeeeW", "WeeeW", "sWWWs"];
const RIGHT_EYE = LEFT_EYE;

const HEAD = [
  ".......kkkkkkk.......",
  ".....kkKKKkkkkkk.....",
  "...kkkKKkkkkkkkkkk...",
  "..kkKKkkkkkkkkkkkkk..",
  "..kKKkkkkkkkkkkkkkk..",
  ".kkKkkkkkkkkkkkkkkkk.",
  face("kkkkkkkkkssssss"),
  face("kkkkkssssssssss"),
  face("sssssssssssssss"),
  ...LEFT_EYE.map((eye, i) => face(`s${eye}sss${RIGHT_EYE[i]}s`)),
  face("srrrsssssssrrrs"),
  face("sssssssssssssss"),
  ".kkkdsssssssssssdkkk.",
  ".kkkkkkdsssssdkkkkkk.",
  ".kKkkkkkksssskkkkkKk.",
];

const BODY = [
  "kKkkbbsssssbbkkKk",
  "kKkbbbsssssbbbkKk",
  "KkkbBbbbbbbbbbkkK",
  "kKssbbbbbbbbbssKk",
  ".kssbbbbbbbbbssk.",
  "..ssbbbbbbbbbss..",
].map(pad);

const SITTING_LEGS = ["ppppppppppppppppp", "ffPpppPPPPPpppPff"].map(pad);
const STANDING_LEGS = [
  "bbbbbbbbb",
  "ppppppppp",
  "ppppPpppp",
  "pppp.Pppp",
  "pppp.Pppp",
  "pppp.Pppp",
  "ffff.ffff",
].map(pad);

// where things are on the sprite, so the room can blink the eyes and raise a hand
export const AVATAR_EYES = { top: 9, height: 5, width: 5, left: 4, right: 12 };
export const AVATAR_SHOULDER = HEAD.length + 2;

export const avatarPose = (pose) => {
  if (pose === "sit") return [...HEAD, ...BODY, ...SITTING_LEGS];
  if (pose === "wave") {
    // the arm is drawn raised by the room, so take it off her side
    const arm = BODY.map((row, i) => (i >= 3 ? row.replace("ss", i === 5 ? ".." : "kk") : row));
    return [...HEAD, ...arm, ...STANDING_LEGS];
  }
  return [...HEAD, ...BODY, ...STANDING_LEGS];
};
