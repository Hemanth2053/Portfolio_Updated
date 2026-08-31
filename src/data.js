// All portfolio copy lives here. Edit text without touching components.

export const identity = {
  initials: "HR",
  name: "Hemanthkumar R",
  roles: ["Senior Frontend Engineer", "Frontend Team Lead"],
  location: "Chennai, India",
  status: "Available now",
  statusNote: "Left last role Jul 2026",
  thesis:
    "I lead frontend teams without leaving the codebase. Six years on enterprise monitoring and automation software — dense, data-heavy interfaces people keep open all day.",
  email: "hemanthr2053@gmail.com",
  phone: "+91 8072733799",
  github: "github.com/Hemanth2053",
  githubUrl: "https://github.com/Hemanth2053",
  linkedin: "linkedin.com/in/hemanth-kumar-444b81210",
  linkedinUrl: "https://linkedin.com/in/hemanth-kumar-444b81210",
};

export const stats = [
  { value: "6+", unit: "years", label: "Frontend engineering" },
  { value: "8", unit: "engineers", label: "Led as UI team lead" },
  { value: "3", unit: "product lines", label: "Concurrent delivery" },
  { value: "2\u00d7", unit: "promoted", label: "In 19 months" },
];

export const nav = [
  { id: "overview", label: "Overview" },
  { id: "runlog", label: "Run log" },
  { id: "products", label: "Products" },
  { id: "demos", label: "Demos" },
  { id: "builds", label: "Builds" },
  { id: "stack", label: "Stack" },
  { id: "close", label: "Contact" },
];

export const runLog = [
  {
    entry: "04",
    role: "Team Lead, UI Engineering",
    org: "Perpetuuiti Technosoft",
    place: "Chennai",
    period: "Apr 2024 — Jul 2026",
    from: "2024-04",
    to: "2026-07",
    duration: "2 yr 3 mo",
    status: "PROMOTED",
    summary:
      "Led 8 UI developers across 3 concurrent product lines while implementing the hardest modules myself.",
    bullets: [
      "Led 8 UI developers across 3 concurrent product lines — sprint planning, task allocation, Agile delivery — while staying hands-on in the codebase",
      "Owned frontend delivery for Continuity Patrol, Bot Patrol (React + TypeScript) and the MHADA government housing portal",
      "Implemented the most complex UI modules personally rather than delegating them",
      "Ran code review through GitHub pull requests: coding standards, type safety, maintainable component architecture",
      "Required unit and end-to-end test coverage for every new feature",
      "Worked with product managers, QA and backend engineers on API contracts",
      "Mentored junior developers; handled production debugging",
    ],
    tech: ["React", "TypeScript", "Redux", "GitHub PR review", "Agile / Scrum", "Mentoring"],
  },
  {
    entry: "03",
    role: "Senior UI Developer",
    org: "Perpetuuiti Technosoft",
    place: "Chennai",
    period: "Sep 2023 — Mar 2024",
    from: "2023-09",
    to: "2024-03",
    duration: "7 mo",
    status: "PROMOTED",
    summary:
      "Complex React modules, measured performance work, and one Redux pattern across every page.",
    bullets: [
      "Built complex React UI modules",
      "Improved load and rendering performance: route-level code splitting, lazy loading, raster assets replaced with SVG — validated in Lighthouse",
      "Standardised Redux state management across all application pages",
      "Built reusable UI components adopted across product modules",
      "Unit tests with Jest; defects tracked in JIRA",
      "Containerised the frontend with Docker",
    ],
    tech: ["React", "Redux", "Code splitting", "Lighthouse", "Jest", "Docker", "JIRA"],
  },
  {
    entry: "02",
    role: "UI Developer",
    org: "Perpetuuiti Technosoft",
    place: "Chennai",
    period: "Sep 2022 — Aug 2023",
    from: "2022-09",
    to: "2023-08",
    duration: "1 yr",
    status: "CLOSED",
    summary:
      "Responsive product components across two build systems, plus a cross-platform mobile app.",
    bullets: [
      "Responsive components in HTML, CSS, JavaScript, React and Angular across Vite and Webpack setups",
      "Built the Flame Detection cross-platform mobile app for Android and iOS with Ionic + React",
    ],
    tech: ["React", "Angular", "Ionic", "Vite", "Webpack", "HTML5", "CSS3"],
  },
  {
    entry: "01",
    role: "Frontend Developer",
    org: "Tawny Solutions",
    place: "Chennai",
    period: "Jul 2020 — Jul 2022",
    from: "2020-07",
    to: "2022-07",
    duration: "2 yr",
    status: "CLOSED",
    summary: "Client websites and web apps built to spec, working directly with the client.",
    bullets: [
      "Built client websites and web applications to spec",
      "Worked directly with clients to translate requirements into delivery",
      "Integrated backend services and databases",
    ],
    tech: ["JavaScript", "HTML5", "CSS3", "REST APIs"],
  },
];

export const productsNote =
  "Continuity Patrol, Bot Patrol and MHADA are commercial products owned by Perpetuuiti Technosoft, my employer. I led and delivered their frontend; the products are theirs. No screenshots, no customer data, no architecture internals appear on this page \u2014 only the problem shape and the engineering decisions that were mine.";

export const products = [
  {
    index: "P1",
    name: "Continuity Patrol",
    role: "Frontend owner · UI team lead",
    span: "Apr 2024 — Jul 2026",
    scale: "8 developers",
    surface: "Monitoring dashboards, run history, alert states",
    kind: "Business continuity monitoring",
    stack: "React + TypeScript",
    problem:
      "An employer product whose screens stay open all day: dense, data-heavy monitoring surfaces where state, runs and status have to stay legible under load.",
    decisions: [
      "Owned frontend delivery end to end as UI team lead",
      "Implemented the most complex UI modules personally",
      "Type safety and component architecture enforced at pull-request review",
      "Unit and end-to-end coverage required before a feature shipped",
    ],
  },
  {
    index: "P2",
    name: "Bot Patrol",
    role: "Frontend owner · UI team lead",
    span: "Apr 2024 — Jul 2026",
    scale: "3 concurrent lines",
    surface: "Automation authoring, run tracking, queues",
    kind: "Automation platform",
    stack: "React + TypeScript",
    problem:
      "Automation tooling where the interface has to represent long-running work — what ran, what state it is in, what a human needs to do next.",
    decisions: [
      "Owned frontend delivery alongside two other concurrent product lines",
      "Standardised Redux state management across application pages",
      "Reusable UI components built once and adopted across product modules",
      "API contracts agreed with product, QA and backend before build",
    ],
  },
  {
    index: "P3",
    name: "MHADA housing portal",
    role: "Frontend delivery",
    span: "Apr 2024 — Jul 2026",
    scale: "Public-facing",
    surface: "Applicant flows, responsive forms, cross-browser",
    kind: "Government housing portal",
    stack: "React",
    problem:
      "A public-facing government portal delivered on the same team and sprint cadence as the two enterprise product lines.",
    decisions: [
      "Frontend delivery owned as part of the three-product portfolio",
      "Responsive, cross-browser delivery to spec",
      "Same review bar as the product lines: standards, type safety, tests",
    ],
  },
];

export const builds = [
  {
    name: "Sentivue",
    tag: "Featured",
    kind: "Video surveillance & AI monitoring",
    body:
      "Finished, running and mine end to end. Manages IP cameras, streams live video into the browser and draws AI detections and ANPR reads on the frame as they arrive, with dashboards and reports over the event history. I designed, built and shipped every layer of it myself.",
    tech: ["React", "Live video", "Realtime", "ANPR"],
    url: "https://github.com/Hemanth2053/Sentivue",
    repo: "github.com/Hemanth2053/Sentivue",
    featured: true,
  },
  {
    name: "FlowForge Enterprise",
    kind: "Workflow & automation platform",
    body:
      "A strictly layered React single-page app over a Node/TypeScript service. Visual composer for authoring automations, a durable server-side execution engine, per-run tracking, authentication, multi-tenancy and versioned workflow definitions.",
    tech: ["React", "TypeScript", "Node", "Multi-tenancy"],
    url: "https://github.com/Hemanth2053/FlowForge",
    repo: "github.com/Hemanth2053/FlowForge",
    featured: false,
  },
  {
    name: "Quentrixx",
    kind: "Assessment generation",
    body:
      "Upload a document and generate question batches to review, edit and approve into a question bank. Role-based approval workflow, generation history, recurring schedules and user admin.",
    tech: ["React", "Workflow", "Roles"],
    url: "https://github.com/Hemanth2053/QuestGen",
    repo: "github.com/Hemanth2053/QuestGen",
    featured: false,
  },
  {
    name: "GenAI Assistant",
    kind: "Enterprise AI assistant",
    body:
      "React SPA with an Express demo API and an external Python service. Cookie sessions, admin/user roles with document-level access control, streamed responses with a typing indicator and a figure gallery.",
    tech: ["React", "Express", "Python", "Streaming"],
    url: "",
    repo: "",
    featured: false,
  },
];

export const stack = [
  {
    group: "Primary",
    items: ["React", "TypeScript", "JavaScript", "Redux", "Node", "Vite"],
  },
  {
    group: "Frontend engineering",
    items: [
      "Component architecture",
      "Reusable component libraries",
      "State management",
      "HTML5 & CSS3",
      "Code splitting",
      "Lazy loading",
      "Responsive design",
      "Cross-browser compatibility",
      "REST API integration",
    ],
  },
  {
    group: "Build, test, tooling",
    items: ["Webpack", "Jest", "Unit & E2E coverage", "Lighthouse", "Chrome DevTools profiling", "Docker", "Git", "GitHub", "SVN", "JIRA"],
  },
  {
    group: "Practices",
    items: [
      "Code review",
      "Mentoring",
      "Sprint planning",
      "Agile / Scrum",
      "Production debugging",
      "Cross-functional collaboration",
      "AI-assisted development (Claude, Augment Code)",
    ],
  },
];

export const alsoWorkedWith = [
  "Angular",
  "Ionic",
  "React Native",
  "Bootstrap",
  "Express.js",
  "MongoDB",
  "Python",
];

export const education = [
  { degree: "M.Sc. Physics", school: "D. G. Vaishnav College, Chennai", years: "2017 — 2019" },
  {
    degree: "B.Sc. Physics",
    school: "Govt. Thirumagal Mills College, Vellore",
    years: "2014 — 2017",
  },
];


export const demos = {
  heading: "Interface demos",
  note: "Written for this page, not lifted from any employer. Synthetic data throughout — the point is the interface behaviour my products depend on: thousands of rows staying interactive, and long-running work you can author and watch execute.",
  table: {
    title: "Virtualised run monitor",
    body: "10,000 runs in memory, windowed rendering, sortable columns and live status transitions. The counters underneath are measured from the running page, not written in.",
    jobs: [
      "Replication check",
      "Failover drill",
      "Nightly backup",
      "Bot: invoice sync",
      "Health probe",
      "Config drift scan",
      "Bot: ticket triage",
      "Log rotation",
      "Certificate renewal",
      "Readiness report",
    ],
    hosts: ["chn-app-01", "chn-app-02", "chn-db-01", "chn-edge-03", "blr-app-01", "blr-db-02"],
  },
  composer: {
    title: "Workflow composer",
    body: "Drag nodes on a snapped grid, then execute the flow and watch each step change state. The pattern behind FlowForge's visual authoring surface.",
    nodes: [
      { id: "n1", label: "Trigger", kind: "EVENT", x: 40, y: 40 },
      { id: "n2", label: "Transform", kind: "TASK", x: 232, y: 132 },
      { id: "n3", label: "Approval", kind: "GATE", x: 424, y: 40 },
      { id: "n4", label: "Notify", kind: "TASK", x: 616, y: 132 },
    ],
  },
};

export const closing = {
  heading: "Open to senior frontend and frontend lead roles",
  body: "Hands-on senior work preferred. Chennai-based, available now.",
};

export default {
  identity,
  stats,
  nav,
  runLog,
  productsNote,
  products,
  builds,
  stack,
  alsoWorkedWith,
  education,
  demos,
  closing,
};
