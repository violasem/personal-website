// All of the site's text lives in this file. Edit it here and the site updates.

export const profile = {
  name: "Viola Sembiring",
  greeting: "Hi, I’m Viola.",
  statement:
    "Computer engineering student growing into embedded and control systems, with a background in data and machine learning.",
  facts: [
    {
      label: "Studying",
      lines: ["B.S.E. in Computer Engineering, minor in Data Science", "University of Michigan, class of 2028"],
    },
    {
      label: "Right now",
      lines: ["Instructional Aide, EECS 215", "Tutor, Mathematics Learning Center", "Co-Director, PERMIAS Michigan"],
    },
    { label: "Focus", lines: ["Circuits, embedded systems, and data"] },
  ],
  links: [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/violasem/" },
    { name: "GitHub", url: "https://github.com/violasem" },
  ],
};

// The things on the banner's desk. x and y are 0 to 1 within the desk area; rot is the tilt in degrees.
// phone sets a different spot on small screens, and phone: null hides the item there.
// kind can be "photo", "note", or "object" (the drawings live in App.jsx).
// desc is what shows up when someone picks the item up.
export const deskItems = [
  { id: "stadium", kind: "photo", src: "/potrait.jpeg", focus: "42% 30%", caption: "Michigan Stadium", alt: "Viola at Michigan Stadium with the marching band behind her", desc: "Game day at Michigan Stadium.", at: { x: 1, y: 0, rot: 4 }, phone: { x: 1, y: 0, rot: 4 } },
  { id: "me", kind: "photo", src: "/avatar.jpeg", caption: "me, with ears", alt: "Illustrated portrait of Viola with glasses and puppy ears", desc: "That’s me. Tap to boop my nose!", at: { x: 0, y: 0.03, rot: -5 }, phone: { x: 0, y: 0, rot: -4 } },
  { id: "pennant", kind: "object", art: "pennant", label: "A Go Blue pennant", desc: "Computer engineering at Michigan, class of 2028.", at: { x: 0, y: 0.66, rot: -8 }, phone: { x: 0, y: 0.46, rot: -7 } },
  { id: "multimeter", kind: "object", art: "multimeter", label: "A digital multimeter", desc: "Instructional Aide for EECS 215. I lead weekly lab sections of 20+ students, debugging circuits with tools like this.", at: { x: 0.33, y: 0.62, rot: -6 }, phone: { x: 0.5, y: 0.47, rot: 6 } },
  { id: "duck", kind: "object", art: "duck", label: "A rubber duck", desc: "Rubber duck debugging: explain your bug to the duck. Tap me!", at: { x: 0.47, y: 0.66, rot: 5 }, phone: { x: 0.8, y: 0.46, rot: 6 } },
  { id: "sticker", kind: "object", art: "sticker", label: "An EECS sticker", desc: "Electrical Engineering and Computer Science at U-M.", at: { x: 0.6, y: 0.6, rot: -10 }, phone: { x: 1, y: 0.6, rot: -10 } },
  { id: "resistor", kind: "object", art: "resistor", label: "A resistor", desc: "Brown, black, red, gold: 1 kΩ, ±5%.", at: { x: 0.71, y: 0.53, rot: 12 }, phone: null },
  { id: "treat", kind: "object", art: "treat", label: "A dog treat", desc: "Drop me and see who comes running.", at: { x: 0.74, y: 0.71, rot: 14 }, phone: { x: 0.3, y: 0.62, rot: 14 } },
  { id: "gpa", kind: "note", text: "3.94 GPA, Dean's List", color: "#f0e3b8", desc: "3.94/4.0 so far, with University Honors.", at: { x: 0.415, y: 0, rot: -3 }, phone: { x: 0, y: 0.79, rot: 3 } },
  { id: "scholarship", kind: "note", text: "Full-ride scholarship, BIM", color: "#d7e3d8", desc: "Beasiswa Indonesia Maju, a government-funded scholarship.", at: { x: 1, y: 0.56, rot: 5 }, phone: { x: 1, y: 0.79, rot: -3 } },
  { id: "embedded", kind: "note", text: "Embedded systems", color: "#d6e0eb", desc: "Where I want to grow next.", at: { x: 0.425, y: 0.27, rot: 3 }, phone: { x: 0.05, y: 1, rot: -2 } },
  { id: "control", kind: "note", text: "Control systems", color: "#e4dcee", desc: "The other half of where I’m headed.", at: { x: 0.7, y: 1, rot: 4 }, phone: { x: 0.95, y: 1, rot: 3 } },
  { id: "dog", kind: "note", text: "Dog person", color: "#ebd4d6", desc: "Hence the dog at the bottom of your screen.", at: { x: 0.02, y: 1, rot: 3 }, phone: null },
  { id: "medan", kind: "note", text: "Born and raised in Medan", color: "#f3dfc9", desc: "Medan, Indonesia, and now Ann Arbor.", at: { x: 0.36, y: 1, rot: -3 }, phone: null },
];

// The project log. Every entry opens in place as a card. Add fullPage: true to give it its own page too.
//
// Newest first. To add an entry, copy one of these blocks to the top of the list. Only slug,
// title, type, dates and summary are required: leave out anything else and that
// part won't show.
//
//   links:   [{ name: "Research poster", url: "https://..." }]
//   updates: [{ date: "Nov 2026", text: "What happened" }]   a running log for the project
export const logTypes = ["Research", "Engineering", "Teaching", "Leadership"];

export const log = [
  {
    slug: "teaching-circuits",
    title: "Teaching circuits in the EECS 215 lab",
    type: "Teaching",
    dates: "Aug 2026 – present",
    summary: "Lead weekly lab sections of 20+ students through circuit construction, measurement, and hardware debugging.",
    role: "Instructional Aide",
    where: "Electrical and Computer Engineering, University of Michigan",
    overview: "I’m an instructional aide for EECS 215, Introduction to Electronic Circuits.",
    did: [
      "Lead weekly lab sections of 20+ students, guiding circuit construction, measurement, and hardware debugging.",
      "Grade weekly lab assignments, with detailed feedback on circuit analysis and experimental results.",
      "Hold weekly office hours for the 370+ students in the course.",
    ],
    learned:
      "Explaining not just how a circuit works but why has pushed me to understand the material far more deeply. It also showed me how much I enjoy the moment when theory turns into a working physical system.",
    tools: ["Oscilloscopes", "Function generators", "Multimeters"],
  },
  {
    slug: "permias-external-relations",
    title: "External relations for PERMIAS Michigan",
    type: "Leadership",
    dates: "Jul 2026 – present",
    summary: "Handle outreach to alumni and partner organizations for the Indonesian student organization at U-M.",
    role: "Co-Director of External Relations",
    where: "PERMIAS Michigan, Ann Arbor",
    overview: "PERMIAS is the Indonesian student organization at U-M. I handle its outreach to alumni and partner organizations.",
    did: ["Handle outreach to alumni and partner organizations."],
  },
  {
    slug: "full-stack-ai-saas",
    title: "Full-stack AI SaaS website",
    type: "Engineering",
    dates: "Jun 2026 – Sep 2026",
    summary: "Architected and launched a full-stack AI SaaS website end to end at a startup in Jakarta.",
    role: "Developer Intern",
    where: "Stealth startup, Jakarta (hybrid)",
    overview:
      "A summer as a developer intern at an AI startup building software with large language models to automate workflows, improve customer experiences, and solve real-world business challenges.",
    did: [
      "Architected and launched a full-stack AI SaaS website end to end.",
      "Used LLMs to speed up every stage of the process, from design to development to deployment.",
    ],
    learned:
      "Working at a startup showed me how quickly an idea can become something real, and how much ownership each person has over the result.",
    tools: ["Large language models", "Full-stack web development"],
  },
  {
    slug: "space-physics-clustering",
    fullPage: true,
    title: "Clustering and predicting solar wind behavior",
    type: "Research",
    dates: "May 2026 – Sep 2026",
    summary: "Applied dimensionality reduction and machine learning to multi-layered space physics datasets.",
    role: "Data Engineer",
    where: "University of Michigan Climate and Space (hybrid)",
    overview:
      "Follow-on work from my research internship, focused on finding structure in multi-layered space physics datasets with 7 parameters.",
    did: [
      "Applied dimensionality reduction techniques to datasets with 7 parameters.",
      "Used machine learning models to cluster, classify, and predict plasma and solar wind behavior.",
    ],
    tools: ["Python", "Machine learning", "Dimensionality reduction", "Clustering"],
  },
  {
    slug: "solar-wind-ml-pipelines",
    fullPage: true,
    title: "Solar wind machine learning pipelines",
    type: "Research",
    dates: "Oct 2025 – May 2026",
    summary: "Built Python pipelines to preprocess, analyze, and predict patterns in NASA solar wind data.",
    role: "Research Intern",
    where: "University of Michigan Climate and Space (on-site)",
    with: "Associate Professor Liang Zhao",
    overview:
      "Research applying machine learning to analyze and predict solar wind behavior, using large-scale in-situ measurements from SWICS and the Parker Solar Probe.",
    did: [
      "Built a pipeline to filter and preprocess NASA space data.",
      "Built machine learning pipelines to predict and analyze patterns in solar wind behavior.",
      "Cleaned the data, extracted features, and made publication-ready plots.",
      "Summarized the work in a research poster.",
    ],
    tools: ["Python", "Machine learning", "Data cleaning", "Feature extraction", "Data visualization"],
  },
  {
    slug: "math-tutoring",
    title: "Tutoring calculus and differential equations",
    type: "Teaching",
    dates: "Aug 2025 – present",
    summary: "Tutor 20 to 30 students a week at the Mathematics Learning Center and facilitate study groups.",
    role: "Tutor and Study Group Facilitator",
    where: "University of Michigan Department of Mathematics (on-site)",
    overview:
      "I tutor Calculus I, Calculus II, and Differential Equations, and facilitate study groups for engineering students.",
    did: [
      "Tutor 20 to 30 students each week.",
      "Run study groups that break down topics in vector calculus, linear algebra, and differential equations.",
    ],
    learned:
      "Differential equations sit at the heart of circuits and control systems, so teaching them keeps me sharp in the math that embedded work depends on. Tutoring has also made me a patient, clear communicator.",
  },
];

// The experience timeline. from/to are "year-month"; leave out "to" if the role is ongoing.
export const timeline = [
  { role: "Instructional Aide, EECS 215", org: "U-M Electrical and Computer Engineering", from: "2026-08", dates: "Aug 2026 – present", log: "teaching-circuits" },
  { role: "Co-Director of External Relations", org: "PERMIAS Michigan", from: "2026-07", dates: "Jul 2026 – present", log: "permias-external-relations" },
  { role: "Developer Intern", org: "Stealth startup, Jakarta", from: "2026-06", to: "2026-09", dates: "Jun 2026 – Sep 2026", log: "full-stack-ai-saas" },
  { role: "Data Engineer", org: "U-M Climate and Space", from: "2026-05", to: "2026-09", dates: "May 2026 – Sep 2026", log: "space-physics-clustering" },
  { role: "Differential Equations Tutor", org: "U-M Mathematics", from: "2026-01", dates: "Jan 2026 – present", log: "math-tutoring" },
  { role: "Research Intern", org: "U-M Climate and Space", from: "2025-10", to: "2026-05", dates: "Oct 2025 – May 2026", log: "solar-wind-ml-pipelines" },
  { role: "Calculus I & II Tutor", org: "U-M Mathematics", from: "2025-08", dates: "Aug 2025 – present", log: "math-tutoring" },
  { role: "Study Group Facilitator", org: "U-M Mathematics", from: "2025-08", dates: "Aug 2025 – present", log: "math-tutoring" },
];

export const education = {
  school: "University of Michigan College of Engineering",
  degree: "B.S.E. in Computer Engineering, minor in Data Science",
  dates: "Aug 2024 – May 2028",
  note: "GPA 3.94/4.0. Dean’s List and University Honors to date.",
  scholarship: "Beasiswa Indonesia Maju (BIM)",
  scholarshipNote: "Full-ride, government-funded scholarship and pre-university program.",
  scholarshipDates: "May 2024 – present",
  coursework: [
    "EECS 280: Programming and Data Structures",
    "EECS 270: Logic Design",
    "EECS 215: Electronic Circuits",
    "EECS 203: Discrete Math",
    "ENGR 101: Computers and Programming",
    "DATASCI 101: Intro to Data Science",
    "ROB 101: Computational Linear Algebra",
    "MATH 216: Differential Equations",
    "MATH 215: Multivariable and Vector Calculus",
    "PHYSICS 140 and 240: General Physics I and II",
  ],
  courseworkNow: ["EECS 370: Computer Organization", "EECS 216: Signals and Systems", "IOE 202: Operations Engineering and Analytics"],
};

export const skills = [
  { group: "Languages", items: "C++, Python, Verilog, MATLAB" },
  { group: "Hardware", items: "Arduino, FPGA, circuits" },
  { group: "Data", items: "Machine learning pipelines, dimensionality reduction, clustering" },
  { group: "Tools", items: "Git, Linux, React" },
];

export const contact = {
  email: "violasem@umich.edu",
  lead: "Email is the best way to reach me.",
  // To update your resume, replace public/resume.pdf and public/resume.jpg (a picture of the page).
  resumePdf: "/resume.pdf",
  resumeImage: "/resume.jpg",
};
