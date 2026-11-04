// All of the site's text lives in this file. Edit it here and the site updates.

export const profile = {
  name: "Viola Sembiring",
  fullName: "Viola Charissa Diana Sembiring",
  pageTitle: "Viola Sembiring | Computer Engineering, University of Michigan",
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
    study: {
      why: "The solar wind isn’t one thing. Different kinds of it come from different places on the Sun, and telling them apart usually depends on hand-picked thresholds. I wanted to see whether an algorithm could find those types on its own from plasma measurements, and whether a simple model could then predict how the heliospheric current sheet (HCS) tilts across the solar cycle.",
      findings: [
        { value: "4 wind types", text: "K-Means sorted 30,602 Solar Orbiter observations into four groups, using 7 plasma parameters and no human-defined thresholds." },
        { value: "92% vs 0%", text: "Of the fast coronal hole group, 92% falls below a published threshold from Zhao et al. (2009). None of the ICME group does. The model was never told it." },
        { value: "72% within ±1σ", text: "Ridge regression predicted 29 of 40 Carrington Rotations within ±1σ on 2022–2025 data it never trained on." },
      ],
      clustering: {
        label: "Clustering: wind types",
        pipeline: [
          { title: "Collect", text: "30,602 observations of 7 plasma parameters from Solar Orbiter HIS, January 2022 to April 2023: O⁷⁺/O⁶⁺, C⁶⁺/C⁴⁺, C⁶⁺/C⁵⁺, Fe/O, mean oxygen charge, velocity, and density." },
          { title: "Transform", text: "The parameters sit on very different scales, so I log₁₀-transformed 5 of the 7 (all but velocity and mean oxygen charge)." },
          { title: "Standardize", text: "I z-scored all 7 so each has a mean of 0 and a standard deviation of 1, then boosted density and mean oxygen charge by ×2.5." },
          { title: "Cluster", text: "K-Means with k = 4 and 15 initializations assigns each observation to its nearest centroid in 7-dimensional space." },
          { title: "Label", text: "Clusters are sorted by median density and labeled, then checked against the physical wind types they correspond to." },
        ],
        pcaNote: "PCA shows what drives the differences. PC1 explains 52.3% of the variance, led by the charge-state ratios (O⁷⁺/O⁶⁺, C⁶⁺/C⁴⁺, C⁶⁺/C⁵⁺). PC2 explains 18.1%, led by density, Fe/O, and velocity.",
        silhouette: [
          { k: 2, score: 0.292, figure: "k2" },
          { k: 3, score: 0.23, figure: "k3" },
          { k: 4, score: 0.247, figure: "k4" },
          { k: 5, score: 0.224, figure: "k5" },
          { k: 6, score: 0.184 },
        ],
        kNote: "k = 2 scores highest, but it only splits the wind in two. k = 4 is the next peak, and it’s the split that keeps the types physically distinct.",
        threshold: "Zhao et al. (2009) use O⁷⁺/O⁶⁺ = 0.145 to separate coronal hole wind from non-coronal hole wind. K-Means never saw that number, but its groups line up with it.",
        clusters: [
          { id: "blue", color: "#5b94d6", name: "Fast coronal hole wind", n: 11317, share: 37, velocity: 502, density: "8.4", ratio: "0.079", below: 92, note: "Low charge states, from the cool corona." },
          { id: "yellow", color: "#d9b44a", name: "Sector reversal / HCS plasma", n: 9276, share: 30, velocity: 378, density: "42", ratio: "0.150", below: 47, note: "The highest density, marking HCS crossings." },
          { id: "green", color: "#5fb592", name: "Streamer belt / active region", n: 8459, share: 28, velocity: 367, density: "12.7", ratio: "0.238", below: 7, note: "Hot composition, from closed-field regions." },
          { id: "red", color: "#bd4f4f", name: "ICME / transient ejecta", n: 1550, share: 5, velocity: 396, density: "11.2", ratio: "0.626", below: 0, note: "Extreme charge states from ejecta." },
        ],
        boundary: "To draw a boundary between two neighboring clusters, I build a KDE curve for each, find where the curves intersect, and take the intersection closest to the midpoint of the two medians.",
        blue: "Looking closer, the fast wind group isn’t one clean population. Its velocity splits at 450 km/s: 25% of it (2,810 points) sits below, with a median of 409 km/s, and 75% (8,507 points) sits above, with a median of 526 km/s.",
      },
      prediction: {
        label: "Prediction: HCS tilt",
        intro: "Next, I predicted two measures of HCS tilt, SD₇₀ and SL₇₀. They rise and fall with the roughly 11-year solar cycle, so I gave a regression model features that repeat on that same period.",
        pipeline: [
          { title: "Load", text: "596 Carrington Rotations of SD₇₀ and SL₇₀ from 1976 to 2022, which covers Solar Cycles 21 to 24." },
          { title: "Clip", text: "Cap outliers at the 99th percentile for SD₇₀ (22.1°) and the 97th for SL₇₀ (1,899°). The raw SL₇₀ maximum was 8,275°." },
          { title: "Smooth", text: "Apply a Savitzky-Golay filter with a window of 27 rotations and a polynomial order of 3 to create the training target." },
          { title: "Engineer", text: "Build 7 features per time step: t, plus sine and cosine at three harmonics of the 11.05-year cycle. Degree-2 polynomial features expand them to 35." },
          { title: "Fit", text: "Ridge regression with α = 5 keeps coefficients stable when extrapolating. The fit on the training data has R² = 0.782." },
          { title: "Validate", text: "Hold out Carrington Rotations from 2022 to 2025, then compare the predictions with what was actually observed." },
        ],
        metrics: [
          { id: "sd", label: "SD₇₀ × 10", figure: "valSd", within1: "29/40", pct1: 72, within2: "34/40", pct2: 85, mae: "17.91", rmse: "23.32", r2: "−1.626", bias: "+10.66", note: "On this ×10 scale, an MAE of 17.91 means an average miss of about 1.8°." },
          { id: "sl", label: "log₁₀(SL₇₀)", figure: "valSl", within1: "28/40", pct1: 70, within2: "37/40", pct2: 92, mae: "0.23", rmse: "0.32", r2: "−0.015", bias: "+0.01", note: "This is on a log scale, so 0.23 is a multiplicative error rather than a fixed number of degrees." },
        ],
        limits: "The model follows the overall level, but it isn’t perfect. R² is negative on the test window for both measures, so it doesn’t capture the rotation-to-rotation swings. SD₇₀ errors also grow over time, at +11.43 per year on the ×10 scale (p = 0.0003). Solar Cycle 25 is stronger than the Solar Cycle 24-dominated training data, so the model under-predicts as the cycle peaks.",
        forecast: "Retrained on all 634 Carrington Rotations from 1976 to 2025, the model projects a decline in tilt through the end of Solar Cycle 25, with a minimum around 2031.",
      },
      figures: {
        preprocess: { src: "/research/sum-preprocess.jpg", alt: "Box plots of the 7 parameters as raw values, after log transform, and after standardizing", caption: "The 7 parameters as raw values, after log₁₀, and after standardizing." },
        pca: { src: "/research/sum-pca.jpg", alt: "PCA scree plot, loadings heatmap, and biplot", caption: "PCA diagnostics: variance per component, feature loadings, and biplot." },
        k2: { src: "/research/sum-k2.jpg", alt: "Observations in PCA space, colored by time and by 2 clusters", caption: "k = 2 in PCA space, colored by time (left) and by cluster (right)." },
        k3: { src: "/research/sum-k3.jpg", alt: "Observations in PCA space, colored by time and by 3 clusters", caption: "k = 3 in PCA space, colored by time (left) and by cluster (right)." },
        k4: { src: "/research/sum-k4.jpg", alt: "Observations in PCA space, colored by time and by 4 clusters", caption: "k = 4 in PCA space, colored by time (left) and by cluster (right)." },
        k5: { src: "/research/sum-k5.jpg", alt: "Observations in PCA space, colored by time and by 5 clusters", caption: "k = 5 in PCA space, colored by time (left) and by cluster (right)." },
        charge: { src: "/research/sum-charge.jpg", alt: "Log C6+/C4+ against log O7+/O6+ colored by cluster, with the Zhao threshold marked", caption: "Charge-state ratios by cluster, with the Zhao threshold as a dotted line. Red sits at the extreme." },
        density: { src: "/research/sum-density.jpg", alt: "Log density against velocity colored by cluster", caption: "Density against velocity by cluster. Yellow has the highest density, and blue is the fastest." },
        boundaries: { src: "/research/sum-boundaries.jpg", alt: "Distributions of mean oxygen charge and velocity for each cluster, with black KDE boundary lines", caption: "Mean oxygen charge and velocity, with KDE boundaries in black. Colors differ here: red is the HCS group, green the streamer group, and yellow the ICME group." },
        blue: { src: "/research/sum-blue.jpg", alt: "Velocity distribution of the fast wind cluster, split at 450 km/s", caption: "Velocity within the fast wind group, split at 450 km/s." },
        fourier: { src: "/research/sum-fourier.jpg", alt: "Three sine waves at harmonics of the 11.05-year solar cycle from 1976 to 2027", caption: "The Fourier features that encode the 11.05-year cycle." },
        valSd: { src: "/research/sum-val-sd.jpg", alt: "SD70 times 10 predicted against observed from 2022 to 2025, with uncertainty bands", caption: "SD₇₀ × 10, predicted against observed. Green points are within ±1σ, and red points are outside." },
        valSl: { src: "/research/sum-val-sl.jpg", alt: "Log SL70 predicted against observed from 2022 to 2025, with uncertainty bands", caption: "log₁₀(SL₇₀), predicted against observed. Green points are within ±1σ, and red points are outside." },
        residuals: { src: "/research/sum-residuals.jpg", alt: "SD70 times 10 residuals from 2022 to 2025 with an upward trend line", caption: "SD₇₀ × 10 residuals drift upward as Solar Cycle 25 strengthens." },
        forecast: { src: "/research/sum-forecast.jpg", alt: "Sunspot number and observed tilt from 1976 to 2025, with predicted tilt through 2035", caption: "Observed tilt since 1976 and the forecast through 2035, with ±1σ and ±2σ bands." },
      },
    },
    title: "Clustering and predicting solar wind behavior",
    type: "Research",
    dates: "May 2026 – Sep 2026",
    summary: "Applied dimensionality reduction and machine learning to multi-layered space physics datasets.",
    role: "Data Engineer",
    where: "University of Michigan Climate and Space (hybrid)",
    overview:
      "Follow-on work from my research internship: finding natural solar wind types in Solar Orbiter data, then predicting how the heliospheric current sheet tilts across the solar cycle.",
    did: [
      "Preprocessed 30,602 Solar Orbiter HIS observations across 7 plasma parameters and explored them with PCA.",
      "Used K-Means to cluster the solar wind into 4 types, with KDE to define the boundaries between them.",
      "Built a Ridge regression model with Fourier features to predict HCS tilt, and validated it on 40 Carrington Rotations it hadn’t seen.",
    ],
    tools: ["Python", "scikit-learn", "PCA", "K-Means", "KDE", "Ridge regression", "Fourier features", "Savitzky-Golay smoothing"],
  },
  {
    slug: "solar-wind-ml-pipelines",
    fullPage: true,
    research: {
      posterTitle: "Unveiling Hidden Signatures in in-situ Solar Wind Measurements through Machine Learning and Artificial Intelligence",
      poster: "/research/poster.jpg",
      why: "The solar wind is a stream of charged particles from the Sun that shapes space weather and affects Earth’s magnetic environment. Its composition influences geomagnetic disturbances, so understanding how it varies matters. I looked at it through two spacecraft datasets: what the wind is made of, and how its magnetic field changes with distance from the Sun.",
      findings: [
        { value: "Cycle-dependent", text: "Solar wind composition differs significantly between solar maxima, but stays consistent between solar minima." },
        { value: "Oct 23, 2011", text: "A space weather event degraded the ACE SWICS instrument, so later data had to be filtered before comparing." },
        { value: "k ≈ 1.884", text: "Below about 0.2 AU, this exponent fits the Parker Solar Probe magnetic field data better than the expected k = 2." },
      ],
      ace: {
        label: "ACE SWICS: composition",
        method: "I preprocessed ACE SWICS time-series data in Python (filtering, cleaning, and parameter selection), then compared charge-state ratios (O⁷⁺/O⁶⁺ and C⁶⁺/C⁵⁺) between solar cycles using scatter plots, t-tests, and chi-square tests.",
        comparisons: [
          { id: "max1", label: "Maximum: 2000 vs 2012", years: ["2000", "2012"], means: [-0.624, -0.762], t: "16.7724", tp: "0.0001", chi: "753.1978", chip: "0.0001", dof: "4443.321", verdict: "Statistically significant difference", text: "2000 shows a higher mean and stronger high-temperature spikes because Cycle 23 was much more energetic. The 2012 maximum is cooler and less extreme.", figure: "cycle20002012" },
          { id: "max2", label: "Maximum: 2002 vs 2014", years: ["2002", "2014"], means: [-0.665, -0.804], verdict: "2002 runs hotter than 2014", text: "2002 shows a higher mean and larger spikes because Cycle 23’s second peak was stronger, with hotter and more active coronal conditions.", figure: "cycle20022014" },
          { id: "min", label: "Minimum: 2009 vs 2020", years: ["2009", "2020"], means: [-1.016, -1.013], t: "-0.6146", tp: "0.5388", chi: "571.0571", chip: "1", dof: "7948.375", verdict: "No statistically significant difference", text: "The two minima have nearly identical means. 2020 looks noisier, which may relate to the higher peak of the next cycle.", figure: "cycle20092020" },
        ],
        instrument: "O⁷⁺/O⁶⁺ and C⁶⁺/C⁵⁺ should be correlated, but the degradation introduced a cutoff in data after it. Values pile up at hard limits, so I measured those limits from histograms and fit only the points inside them.",
        cutoff: [
          { label: "Limits for 2014", value: "O⁷⁺/O⁶⁺ ≥ −1.270, C⁶⁺/C⁵⁺ ≤ 0.150" },
          { label: "Points kept", value: "2,507 of 4,368" },
          { label: "Slope after filtering", value: "0.127" },
          { label: "Correlation", value: "0.199" },
        ],
      },
      psp: {
        label: "Parker Solar Probe: magnetic field",
        method: "The radial magnetic field Bᵣ should fall off as r⁻², which keeps Bᵣ·R² roughly constant with distance. Using PSP/FIELDS data from Encounter 12, I cleaned the measurements and checked whether that holds close to the Sun.",
        stepOne: "The data has two clear edges, at about +3.39 and −3.18. The upper edge is the one I fit.",
        views: [
          { id: "k2", label: "k = 2 (expected)", figure: "pspK2", text: "With k = 2, the upper edge climbs until a break at 0.2056 AU. The left fit has a slope of 3.331 and the right fit −1.384, so it isn’t constant near the Sun." },
          { id: "k1884", label: "k = 1.884 (best fit)", figure: "pspK1884", text: "Optimizing k only for R < 0.2056 AU flattens the upper edge, which sits near its median of 4.314 all the way across that region." },
        ],
        best: "1.884",
        sets: [
          {
            id: "bins",
            label: "Grouped into 34 bins",
            note: "Binning gives a sharper comparison. The t-test p-value is 0.7367 for k = 1.884, against 0.0085 for k = 2 and 0.0003 for k = 2.2.",
            rows: [
              { k: "1.884", chi: "0.0018", dof: "34", chip: "1", t: "-0.339", tp: "0.7367", rmse: 7.9448, sse: 2209.2 },
              { k: "2", chi: "0.0042", dof: "34", chip: "1", t: "2.7921", tp: "0.0085", rmse: 12.1736, sse: 5186.9 },
              { k: "2.2", chi: "0.0211", dof: "34", chip: "1", t: "4.0498", tp: "0.0003", rmse: 27.3282, sse: 26139 },
            ],
          },
          {
            id: "all",
            label: "All data points",
            note: "On the full dataset, both tests accept all three exponents, but k = 1.884 has the highest chi-square p-value and the lowest RMSE and SSE.",
            rows: [
              { k: "1.884", chi: "0.854", dof: "988", chip: "0.9997", t: "-0.362", tp: "0.717", rmse: 25.183, sse: 627195 },
              { k: "2", chi: "0.8936", dof: "988", chip: "0.9926", t: "-0.485", tp: "0.628", rmse: 25.72, sse: 654396.88 },
              { k: "2.2", chi: "0.985", dof: "988", chip: "0.6185", t: "-0.705", tp: "0.48", rmse: 26.93, sse: 717545.974 },
            ],
          },
        ],
      },
      figures: {
        cycle20002012: { src: "/research/cycle-2000-2012.jpg", alt: "Log O7+/O6+ for 2000 and 2012, above sunspot number from 1950 to 2025 with both years marked", caption: "Log O⁷⁺/O⁶⁺ for 2000 and 2012, with both years marked on the sunspot cycle." },
        cycle20022014: { src: "/research/cycle-2002-2014.jpg", alt: "Log O7+/O6+ for 2002 and 2014, above sunspot number from 1950 to 2025 with both years marked", caption: "Log O⁷⁺/O⁶⁺ for 2002 and 2014, with both years marked on the sunspot cycle." },
        cycle20092020: { src: "/research/cycle-2009-2020.jpg", alt: "Log O7+/O6+ for 2009 and 2020, above sunspot number from 1950 to 2025 with both years marked", caption: "Log O⁷⁺/O⁶⁺ for 2009 and 2020, with both years marked on the sunspot cycle." },
        cutoff: { src: "/research/cutoff-2014.jpg", alt: "Scatter plot of 2014 charge-state ratios with histograms showing values piled up at the limits", caption: "2014 data with histograms on each axis. The purple lines mark the cutoffs, and the red line is the fit." },
        scatter: { src: "/research/scatter-2002-2014.jpg", alt: "Oxygen versus carbon scatter plots for 2002 and 2014, above the sunspot number", caption: "2002 and 2014, with the limits marked in purple. Blue points are the primary distribution, and red points are the lower tail." },
        pspEdges: { src: "/research/psp-edges.jpg", alt: "B times R squared against distance for PSP Encounter 12, with histograms and dashed lines at the upper and lower edges", caption: "B·R² against distance for Encounter 12, with histograms on each axis." },
        pspK2: { src: "/research/psp-k2.jpg", alt: "B times R squared with a piecewise linear fit along the upper edge, breaking at 0.2056 AU", caption: "B·R² with a piecewise linear fit of the upper edge." },
        pspK1884: { src: "/research/psp-k1884.jpg", alt: "B times R to the 1.884 with a flat dashed line at 4.314 and a vertical line at 0.2056 AU", caption: "B·R¹·⁸⁸⁴, with the median for R < 0.2056 AU as a dashed line." },
        envelope: { src: "/research/psp-envelope.jpg", alt: "98th percentile of B times R to the k for k of 1.884, 2, and 2.2 below 0.2 AU", caption: "Upper envelope below 0.2 AU. k = 1.884 stays level, while k = 2 and k = 2.2 drift upward with distance." },
        fit: { src: "/research/psp-fit.jpg", alt: "Magnetic field magnitude against distance with C over R to the 1.884 and C over R squared overlaid", caption: "The two models against the magnetic field magnitude |B|, with the fit region shaded." },
      },
      next: "Next, I want to apply more advanced machine learning to space data to improve pattern recognition and give deeper insight into the underlying physics.",
    },
    title: "Solar wind machine learning pipelines",
    type: "Research",
    dates: "Oct 2025 – May 2026",
    summary: "Built Python pipelines to preprocess, analyze, and predict patterns in NASA solar wind data.",
    role: "Research Intern",
    where: "University of Michigan Climate and Space (on-site)",
    with: "Associate Professor Liang Zhao",
    overview:
      "Research applying machine learning to analyze and predict solar wind behavior, using large-scale in-situ measurements from ACE SWICS and the Parker Solar Probe.",
    did: [
      "Built a pipeline to filter and preprocess NASA space data.",
      "Built machine learning pipelines to predict and analyze patterns in solar wind behavior.",
      "Cleaned the data, extracted features, and made publication-ready plots.",
      "Summarized the work in a research poster.",
    ],
    tools: ["Python", "Matplotlib", "Seaborn", "Piecewise linear fitting", "t-tests and chi-square tests"],
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

// The short "What's next" line.
export const nextUp = "Working with a startup and doing research at Michigan, then planning a master’s focused on embedded systems after I graduate.";

// The room at the bottom of the home page. The drawings live in Room.jsx.
export const room = {
  title: "My room",
  intro: "The part of me that isn’t on my resume.",
  hint: "Click on anything in the room. I’m here too if you want to talk.",
  items: [
    { id: "music", name: "Music", text: "What I’m listening to right now.", url: "https://open.spotify.com/playlist/1vHnZpoh3TbeXlvnFfp7Uf", link: "Open my Spotify" },
    { id: "guitar", name: "Guitar", text: "I learned guitar." },
    { id: "piano", name: "Piano", text: "I learned piano, too." },
    { id: "bed", name: "Bed", text: "Constantly running on five hours of sleep." },
    { id: "barbell", name: "Barbell", text: "I go to the gym and try to lift weights." },
    { id: "tv", name: "TV", text: "What I’ve been watching.", url: "https://letterboxd.com/violasem/", link: "Open my Letterboxd" },
    { id: "photos", name: "Polaroids", text: "A few little moments.", url: "https://www.instagram.com/vgiola/", link: "Open my Instagram" },
    { id: "lamp", name: "Lamp", text: "Click it to switch the room between day and night." },
    { id: "flag", name: "Indonesia", text: "Born and raised in Medan." },
  ],
};

export const education = {
  school: "University of Michigan College of Engineering",
  degree: "B.S.E. in Computer Engineering, minor in Data Science",
  dates: "Aug 2024 – May 2028",
  note: "GPA 3.94/4.0.",
  honors: "James B. Angell Scholar, Dean’s List, and University Honors.",
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
  // The conversation that starts when someone clicks a "contact me" sign in the room.
  dialogue: {
    copiedText: "You got: Viola’s email! It’s copied to your clipboard.",
    start: {
      text: "Oh hi! You found me. What brings you here?",
      choices: [
        { label: "I have an opportunity for you", next: "opportunity" },
        { label: "I’d love to talk about your research", next: "research" },
        { label: "Just wanted to say hi", next: "hi" },
        { label: "I’m just here for the dog", next: "dog" },
      ],
      actions: ["close"],
    },
    opportunity: {
      text: "Ooh, tell me more!",
      email: {
        label: "Write me an email",
        subject: "An opportunity for you",
        body: "Hi Viola,\n\nI came across your website (violasem.com) and would love to talk to you about an opportunity.\n\nBest,\n",
      },
      actions: ["email", "copy", "links", "back"],
    },
    research: {
      text: "I’d love to! Send me a message.",
      email: {
        label: "Write me an email",
        subject: "Your research",
        body: "Hi Viola,\n\nI saw your research on your website (violasem.com) and would love to talk about it.\n\nBest,\n",
      },
      actions: ["email", "copy", "links", "back"],
    },
    hi: {
      text: "Hi!",
      happy: true,
      email: {
        label: "Send me a hi to my email",
        subject: "Hi Viola!",
        body: "Hi Viola!\n\nI stopped by your website (violasem.com) and wanted to say hi.\n",
      },
      actions: ["email", "back"],
    },
    dog: {
      text: "Good choice. Say hi!",
      dog: true,
      actions: ["back"],
    },
  },
  // To update your resume, replace public/resume.pdf and public/resume.jpg (a picture of the page).
  resumePdf: "/resume.pdf",
  resumeImage: "/resume.jpg",
};
