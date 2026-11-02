// All of the site's text lives in this file. Edit it here and the site updates.

export const profile = {
  name: "Viola Sembiring",
  partLine: "VS-2028 Computer engineer, in development",
  statement:
    "Computer engineering student at the University of Michigan, growing into embedded and control systems, with a background in data and machine learning.",
  release: "PRODUCTION RELEASE EXPECTED MAY 2028",
  links: [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/violasem/" },
    { name: "GitHub", url: "https://github.com/violasem" },
  ],
};

// The chip's pins, numbered the way a real DIP is: down the left side, then back up the right.
export const pins = [
  { name: "SPECS", href: "#/specs", note: "The numbers, in a table." },
  { name: "PROJECT LOG", href: "#/log", note: "What I’ve worked on, with what I did and learned on each." },
  { name: "EXPERIENCE", href: "#/experience", note: "Every role, drawn as a timing diagram." },
  { name: "EDUCATION", href: "#/education", note: "University of Michigan, B.S.E. in Computer Engineering." },
  { name: "ABOUT", href: "#/about", note: "Who I am outside of the datasheet." },
  { name: "NOTES", href: "#/notes", note: "Reflections while I learn." },
  { name: "GITHUB", href: "https://github.com/violasem", external: true, note: "Opens GitHub in a new tab." },
  { name: "LINKEDIN", href: "https://www.linkedin.com/in/violasem/", external: true, note: "Opens LinkedIn in a new tab." },
];

export const features = [
  "Python machine learning pipelines for solar wind data",
  "Full-stack AI web development",
  "Verilog and FPGA design",
  "Teaches circuits in the EECS 215 lab",
];

export const applications = ["Embedded systems", "Control systems", "Data and machine learning"];

// Only real numbers go here. Leave a column empty ("") if it doesn't apply.
export const specs = [
  { parameter: "GPA", conditions: "University of Michigan, to date", min: "", typ: "3.94", max: "4.00", unit: "points" },
  { parameter: "Tutoring load", conditions: "Mathematics Learning Center", min: "20", typ: "", max: "30", unit: "students/wk" },
  { parameter: "Dataset dimensions", conditions: "Space physics datasets, before reduction", min: "", typ: "7", max: "", unit: "parameters" },
  { parameter: "Graduation", conditions: "B.S.E. in Computer Engineering", min: "", typ: "May 2028", max: "", unit: "" },
];

// The project log. Each entry gets its own page at #/log/<slug>.
//
// Newest first. To add an entry, copy one of these blocks to the top of the list. Only slug,
// title, type, dates and summary are required: leave out anything else and that
// part of the page won't show.
//
//   links:   [{ name: "Research poster", url: "https://..." }]
//   updates: [{ date: "Nov 2026", text: "What happened" }]   shows as a revision history on the page
export const logTypes = ["Research", "Engineering", "Teaching", "Leadership"];

export const log = [
  {
    slug: "teaching-circuits",
    title: "Teaching circuits in the EECS 215 lab",
    type: "Teaching",
    dates: "Aug 2026 – present",
    summary: "Course staff for a lab section, helping students turn circuit theory into working hardware.",
    role: "Instructional Aide",
    where: "Electrical and Computer Engineering, University of Michigan",
    overview: "I help students work through circuit concepts in EECS 215, Introduction to Electronic Circuits.",
    did: [
      "Support a lab section as course staff.",
      "Help students through labs on components and breadboarding, R-2R ladder DACs, MOSFET audio amplifiers, and op-amps.",
    ],
    learned:
      "Explaining not just how a circuit works but why has pushed me to understand the material far more deeply. It also showed me how much I enjoy the moment when theory turns into a working physical system.",
    tools: ["Circuit analysis", "Breadboarding", "Digital multimeter"],
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
    title: "Solar wind machine learning pipelines",
    type: "Research",
    dates: "Oct 2025 – May 2026",
    summary: "Built Python pipelines to preprocess, analyze, and predict patterns in NASA solar wind data.",
    role: "Research Intern",
    where: "University of Michigan Climate and Space (on-site)",
    with: "Associate Professor Liang Zhao",
    overview:
      "Research applying machine learning to analyze and predict solar wind behavior, using large-scale in-situ measurements from spacecraft including the Parker Solar Probe.",
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
  {
    slug: "logic-design-fpga",
    title: "Digital design in Verilog",
    type: "Engineering",
    dates: "Coursework",
    summary: "Learned how digital systems make decisions, and built skills in Verilog and FPGA design.",
    where: "Introduction to Logic Design, University of Michigan",
    overview:
      "Coursework that became the start of my hardware foundation, alongside circuits: how digital systems make decisions, and how to describe them in hardware.",
    did: ["Built skills in Verilog and FPGA design."],
    tools: ["Verilog", "FPGA"],
  },
];

// The timing diagram. from/to are "year-month"; leave out "to" if the role is ongoing.
export const timing = [
  { signal: "Instructional Aide, EECS 215", org: "U-M Electrical and Computer Engineering", from: "2026-08", dates: "Aug 2026 – present", log: "teaching-circuits" },
  { signal: "Co-Director of External Relations", org: "PERMIAS Michigan", from: "2026-07", dates: "Jul 2026 – present", log: "permias-external-relations" },
  { signal: "Developer Intern", org: "Stealth startup, Jakarta", from: "2026-06", to: "2026-09", dates: "Jun 2026 – Sep 2026", log: "full-stack-ai-saas" },
  { signal: "Data Engineer", org: "U-M Climate and Space", from: "2026-05", to: "2026-09", dates: "May 2026 – Sep 2026", log: "space-physics-clustering" },
  { signal: "Differential Equations Tutor", org: "U-M Mathematics", from: "2026-01", dates: "Jan 2026 – present", log: "math-tutoring" },
  { signal: "Research Intern", org: "U-M Climate and Space", from: "2025-10", to: "2026-05", dates: "Oct 2025 – May 2026", log: "solar-wind-ml-pipelines" },
  { signal: "Calculus I & II Tutor", org: "U-M Mathematics", from: "2025-08", dates: "Aug 2025 – present", log: "math-tutoring" },
  { signal: "Study Group Facilitator", org: "U-M Mathematics", from: "2025-08", dates: "Aug 2025 – present", log: "math-tutoring" },
];

export const education = {
  school: "University of Michigan College of Engineering",
  degree: "B.S.E. in Computer Engineering, minor in Data Science",
  dates: "Aug 2024 – May 2028",
  note: "GPA 3.94/4.0. Dean’s List and University Honors to date.",
  coursework: [
    "Programming and data structures",
    "Logic design",
    "Computer organization",
    "Electronic circuits",
    "Discrete math",
    "Differential equations",
    "Computational linear algebra",
  ],
};

export const skills = [
  { group: "Languages", items: "C++, Python, Verilog, MATLAB" },
  { group: "Hardware", items: "Arduino, FPGA, circuits" },
  { group: "Data", items: "Machine learning pipelines, dimensionality reduction, clustering" },
  { group: "Tools", items: "Git, Linux, React" },
];

export const about = {
  intro:
    "I’m Viola Charissa Diana Sembiring. I love building things that are both logical and alive: circuits, embedded systems, and data that tells a story, especially space plasma and solar wind.",
  more: "I’m curious about how systems behave, how they fail, and how they can be designed more thoughtfully. I like hardware debugging, clean architecture, CAD, and making hard things feel simple.",
  figure: "Figure 1. Device in its operating environment, Michigan Stadium.",
  outside: "Born and raised in Medan, Indonesia. Always looking for good fantasy manga and manhwa. Dog person.",
};
