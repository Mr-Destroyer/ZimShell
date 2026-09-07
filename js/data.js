/* =========================================================
   NIGHTFALL PROTOCOL :: Portfolio Data
   ---------------------------------------------------------
   All editable content lives here. Replace [PLACEHOLDERS].
   ========================================================= */

const PROFILE = {
  name: "Mohammad Zim",
  handle: "MR_DESTROYER",
  role: "Ethical Hacker",
  fullTitle: "Ethical Hacker • Security Researcher • Cybersecurity Engineer",
  taglines: [
    "I find weaknesses before they become disasters.",
    "Turning shadows into insight, one vulnerability at a time."
  ],
  heroLabel: "ETHICAL HACKER / SECURITY RESEARCHER",
  heroHeading: "I hunt vulnerabilities in the dark.",
  heroSupport: "I design, test, and strengthen digital systems through ethical security research, penetration testing, and defensive engineering — authorized work only, documented end to end.",
  location: "Dhaka, Bangladesh (UTC+6)",
  email: "[YOUR EMAIL]",
  github: "https://github.com/Mr-Destroyer",
  tryhackme: "https://tryhackme.com/p/MohammadZim",
  youtube: "https://youtube.com/@Study_Hard69",
  resume: "[YOUR RESUME URL]",
  availability: "Open to selected projects",
  // Profile animation — the ORIGINAL animated GIF in plain <img> tags (native,
  // always-looping browser animation — no codecs, no autoplay policy). It
  // animates unconditionally, and PROFILE.avatar below is the single editable
  // source wired into BOTH the hero and about portraits. A motion watchdog
  // guarantees playback: if a browser ever freezes the GIF, JS swaps in the
  // identical looping video (assets/elias-motion.webm/.mp4). The static poster
  // assets/elias-poster.jpg exists only as a load-error fallback and og:image.
  // Replace with [YOUR PROFILE GIF URL], or drop any .gif in assets/ and update paths here.
  avatar: "assets/elias.gif?v=8",
  avatarPoster: "assets/elias-poster.jpg",
  bio: "I'm a cybersecurity professional focused on discovering weaknesses, understanding how systems fail, and helping teams build stronger defenses. My work combines offensive security techniques, secure development, threat modeling, and clear technical reporting — always inside authorized scope, always with responsible disclosure.",
  facts: [
    { label: "Years of experience", value: "4+ Years" },
    { label: "Security assessments", value: "40+ Done" },
    { label: "CTF rank", value: "Top 1% on TryHackMe" },
    { label: "Certifications", value: "8" },
    { label: "Location", value: "Dhaka, Bangladesh" },
    { label: "Availability", value: "Open to selected projects" }
  ],
  principles: [
    { icon: "🗡", title: "Think like an attacker", text: "Map every path an adversary would walk — then close each one." },
    { icon: "🛡", title: "Build like a defender", text: "Controls, hardening, and monitoring that hold under pressure." },
    { icon: "📜", title: "Document everything", text: "Findings matter when they are clear, reproducible, actionable." },
    { icon: "🕊", title: "Disclose responsibly", text: "Coordinated disclosure. Owners first. Credit when earned." }
  ],
  vials: [
    { label: "Curiosity", value: 96 },
    { label: "Precision", value: 92 },
    { label: "Persistence", value: 94 },
    { label: "Creativity", value: 88 }
  ]
};

const STATS = [
  { value: 25, suffix: "+", label: "Open-source security tools" },
  { value: 4, suffix: "", label: "CVE & vuln research writeups" },
  { value: 50, suffix: "+", label: "GitHub stars earned" },
  { value: 8, suffix: "", label: "TryHackMe badges" },
  { value: 300, suffix: "+", label: "CTF challenges solved" }
];

const SKILLS = [
  { name: "Web Application Security", level: 95, icon: "🕸", desc: "OWASP Top 10, authentication and session flaws, injection classes, and business-logic abuse — found and fixed in authorized engagements.", tools: ["Burp Suite", "OWASP ZAP", "Nmap"] },
  { name: "Network Security", level: 88, icon: "🛰", desc: "Host and service discovery, traffic analysis, and segmentation review across Linux infrastructure.", tools: ["Nmap", "Wireshark", "Linux"] },
  { name: "Cloud Security", level: 78, icon: "☁", desc: "Architecture review, IAM least-privilege analysis, exposed storage, and misconfiguration hunting.", tools: ["AWS", "Azure", "Docker"] },
  { name: "Secure Code Review", level: 90, icon: "🩸", desc: "Hunting risky patterns early in the SDLC — injection sinks, unsafe deserialization, broken access control.", tools: ["Python", "Git", "Semgrep"] },
  { name: "Threat Modeling", level: 85, icon: "🗺", desc: "STRIDE and attack-tree analysis to rank what matters before a single test packet is sent.", tools: ["STRIDE", "Attack Trees", "DREAD"] },
  { name: "Digital Forensics", level: 72, icon: "🔍", desc: "Log analysis, artifact triage, and timeline reconstruction for incident-readiness exercises.", tools: ["Wireshark", "Splunk", "Linux"] },
  { name: "OSINT", level: 93, icon: "👁", desc: "Passive reconnaissance, exposure auditing, dorking methodology, and threat-intel pipelines built for defenders.", tools: ["Google Dorks", "theHarvester", "Shodan"] },
  { name: "Social Engineering Awareness", level: 80, icon: "🎭", desc: "Authorized awareness campaigns and phishing-simulation design that harden the human layer.", tools: ["GoPhish", "Training", "Reporting"] },
  { name: "Security Automation", level: 91, icon: "⚙", desc: "Python tooling that turns manual recon and scanning into repeatable, audited pipelines.", tools: ["Python", "Bash", "Docker"] },
  { name: "CTF & Red Team Techniques", level: 89, icon: "🦇", desc: "Top-ranked TryHackMe player — privilege boundaries, reverse engineering, and lab-only adversary simulation.", tools: ["Metasploit", "TryHackMe", "GDB"] }
];

/* Constellation edges — index pairs into SKILLS[] */
const SKILL_LINKS = [[0,4],[0,3],[0,1],[0,6],[1,5],[2,4],[3,8],[6,7],[6,8],[9,1],[9,0],[8,2],[5,8],[4,2]];

/* Project categories for the filter bar */
const PROJECT_CATS = {
  all: "All", redteam: "Red Team", recon: "Recon", web: "Web Security",
  osint: "OSINT", cve: "CVE Research", dev: "Dev & Learning"
};

const PROJECTS = [
  {
    name: "villain", featured: true, cat: "redteam", lang: "Python", stars: 12, forks: 3, status: "Ongoing",
    url: "https://github.com/Mr-Destroyer/villain", icon: "🦇",
    tagline: "Flagship red-team research toolkit",
    desc: "A red-team toolkit for studying payload delivery and detection surfaces — built for authorized lab work so defenders can see what evasion actually looks like.",
    tags: ["red-team", "payloads", "evasion", "lab-only"],
    caseStudy: {
      problem: "Blue teams rarely see how attacker-side tradecraft evolves, so detections lag behind reality.",
      approach: "Modular toolkit for studying payload generation and handler behaviour inside isolated, authorized lab environments — every module documented with its defensive counterpoint.",
      outcome: "Sharper detection logic and YARA/EDR lab rules; doubles as a teaching aid for understanding adversary simulation.",
      lessons: "Offense teaches defense. Every lab technique pairs with a detection idea in the README.",
      disclosure: "Designed for authorized labs only — never use against systems without explicit written permission."
    }
  },
  {
    name: "endpointhunter", featured: true, cat: "recon", lang: "Python", stars: 11, forks: 1, status: "Completed",
    url: "https://github.com/Mr-Destroyer/endpointhunter", icon: "🎯",
    tagline: "Endpoint & secret discovery for bug bounty",
    desc: "Hunts API endpoints, LFI paths, secrets, and cloud-storage URLs hidden in JS, CSS, and HTML — multi-threaded for fast, authorized attack-surface mapping.",
    tags: ["recon", "api-enumeration", "endpoint-discovery", "bug-bounty"],
    caseStudy: {
      problem: "Modern front-ends leak endpoints and keys in shipped JavaScript; manually reading bundles does not scale.",
      approach: "Multi-threaded crawler parsing JS/CSS/HTML for endpoint patterns, LFI paths, and cloud URLs — deduplicated and ranked for manual review.",
      outcome: "Faster recon inside bug-bounty scope; forgotten endpoints and leaked keys surfaced and reported to owners for revocation.",
      lessons: "Recon is 80% of the work. Ranking noise well matters more than raw regex count."
    }
  },
  {
    name: "CredStalker", featured: true, cat: "recon", lang: "Python", stars: 10, forks: 1, status: "Completed",
    url: "https://github.com/Mr-Destroyer/CredStalker-", icon: "🔑",
    tagline: "Exposed-secret & credential-exposure auditing",
    desc: "Automated sweep for API keys, tokens, passwords, and sensitive data exposed on web assets — so owners can rotate them before someone else finds them.",
    tags: ["secret-detection", "exposure-audit", "osint", "web-crawler"],
    caseStudy: {
      problem: "Leaked keys in public web assets are a top real-world breach vector, yet most owners never audit for them.",
      approach: "Crawler + pattern engine fingerprinting high-signal secret formats (API keys, tokens, private-key blocks) across in-scope targets, with strict scope guards.",
      outcome: "Exposure reports handed to asset owners for rotation; repeat scans verify the leak is actually dead.",
      lessons: "Secret detection is a hygiene problem — automation plus verified disclosure closes the loop.",
      disclosure: "Reports go to the asset owner first. Nothing is published until the secret is revoked."
    }
  },
  {
    name: "vulnx", featured: true, cat: "web", lang: "Python", stars: 9, forks: 0, status: "Completed",
    url: "https://github.com/Mr-Destroyer/vulnx", icon: "🕸",
    tagline: "Automated vulnerability assessment",
    desc: "Detects common web weaknesses and demonstrates impact with safe, non-destructive proof-of-concept checks on systems you are authorized to test.",
    tags: ["scanner", "dast", "web", "assessment"],
    caseStudy: {
      problem: "Manual scanning of large estates wastes assessor hours on the same known classes of flaws.",
      approach: "Modular checks for misconfigurations, outdated components, and common injection classes — safe PoCs only, every result reproducible for the report.",
      outcome: "Cut assessment time on repeated engagements; findings fed directly into prioritized remediation lists.",
      lessons: "A scanner is a triage assistant, not a verdict. Human validation stays mandatory."
    }
  },
  {
    name: "WPGhost", featured: true, cat: "cve", lang: "Python", stars: 3, forks: 0, status: "Completed",
    url: "https://github.com/Mr-Destroyer/WPGhost", icon: "👻",
    tagline: "CVE-2024-10924 research — WordPress",
    desc: "Scanner and research tool for a critical WordPress plugin vulnerability (CVE-2024-10924) — built to study the flaw and help admins detect unpatched installs.",
    tags: ["cve-2024-10924", "wordpress", "research", "detection"],
    caseStudy: {
      problem: "Thousands of WordPress sites ran a vulnerable plugin with no easy way to check exposure.",
      approach: "Passive version fingerprinting plus a documented root-cause analysis (missing capability check), published for defenders.",
      outcome: "Admins could locate and patch affected installs quickly; the writeup covers fix and hardening steps.",
      lessons: "CVE research is most valuable when it ends in a patch and a detection note, not just a PoC.",
      disclosure: "Published after the vendor fix was available, in line with coordinated disclosure practice."
    }
  },
  {
    name: "CVE-2025-55182", featured: true, cat: "cve", lang: "Python", stars: 0, forks: 0, status: "Research",
    url: "https://github.com/Mr-Destroyer/CVE-2025-55182", icon: "🩸",
    tagline: "React-ecosystem RCE research",
    desc: "Analysis and proof-of-concept research for a React-ecosystem vulnerability (CVE-2025-55182) — a command-injection chain studied to improve framework-level defenses.",
    tags: ["cve", "research", "reactjs", "tryhackme-ctf"],
    caseStudy: {
      problem: "Framework-level RCE chains are hard to reason about until someone documents the anatomy end to end.",
      approach: "Root-cause analysis of the injection path, minimized PoC for lab validation, and mitigation guidance for affected versions.",
      outcome: "A writeup defenders and developers can act on: what to patch, what to monitor, what to test.",
      lessons: "Responsible publication timing matters as much as the technical content itself."
    }
  },
  { name: "EmailSpoofer", cat: "redteam", lang: "Python", stars: 2, forks: 1, status: "Completed", url: "https://github.com/Mr-Destroyer/EmailSpoofer", icon: "✉", tagline: "SMTP spoofing awareness", desc: "Demonstrates email-spoofing risk for awareness training and mail-server hardening (SPF/DKIM/DMARC checks).", tags: ["smtp", "awareness", "testing"] },
  { name: "SQLZ", cat: "web", lang: "Python", stars: 1, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/SQLZ", icon: "🗄", tagline: "SQL injection learning lab", desc: "All-in-one SQLi practice toolkit for learning injection classes hands-on in your own lab.", tags: ["sqli", "learning", "lab"] },
  { name: "God_Scanner", cat: "recon", lang: "Python", stars: 1, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/God_Scanner", icon: "⚡", tagline: "Attack-surface overview", desc: "One command for a full surface overview — ports, headers, tech stack, misconfigurations on authorized targets.", tags: ["recon", "automation"] },
  { name: "sessionexploit", cat: "web", lang: "Python", stars: 0, forks: 0, status: "Research", url: "https://github.com/Mr-Destroyer/sessionexploit", icon: "🍪", tagline: "Session & auth research", desc: "Studies cookie-session encoding patterns (base64/md5 chains) for auth-bypass research in labs.", tags: ["sessions", "auth", "research"] },
  { name: "JWT-MODIFY", cat: "web", lang: "Python", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/JWT-MODIFY", icon: "🎫", tagline: "JWT lab toolkit", desc: "Decode, modify, and re-sign JWTs in your own lab to test auth assumptions.", tags: ["jwt", "auth", "lab"] },
  { name: "Admin-Finder", cat: "recon", lang: "Perl", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/Admin-Finder", icon: "🛠", tagline: "Admin surface discovery", desc: "Fast wordlist-based discovery of login and admin surfaces during authorized tests.", tags: ["fuzzing", "discovery"] },
  { name: "Recon-Search-Assistant", cat: "osint", lang: "HTML", stars: 0, forks: 1, status: "Completed", url: "https://github.com/Mr-Destroyer/Recon-Search-Assistant", icon: "🔎", tagline: "Smarter security dorking", desc: "Structured Google-dork assistant turning broad questions into precise, ethical recon queries.", tags: ["dorking", "osint"] },
  { name: "ZimPwn", cat: "web", lang: "Python", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/ZimPwn", icon: "📂", tagline: "LFI / RFI detection", desc: "Quick file-inclusion scanner for your own labs — learn path traversal safely.", tags: ["lfi", "rfi", "lab"] },
  { name: "leaker", cat: "osint", lang: "Go", stars: 0, forks: 1, status: "Prototype", url: "https://github.com/Mr-Destroyer/leaker", icon: "💧", tagline: "Passive leak enumeration", desc: "Quiet, passive checks for exposed data tied to an in-scope target — OSINT-friendly.", tags: ["osint", "leaks"] },
  { name: "ohcti-threatexposure", cat: "osint", lang: "Python", stars: 0, forks: 0, status: "Prototype", url: "https://github.com/Mr-Destroyer/ohcti-threatexposure", icon: "🕵", tagline: "Threat-intel exposure lookup", desc: "Openhunting CTI — threat-exposure and breach-account lookup bot for Telegram, for monitoring your own exposure.", tags: ["threat-intel", "cti", "telegram"] },
  { name: "DIONAEA_FTP_SCANNER", cat: "recon", lang: "Python", stars: 1, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/DIONAEA_FTP_SCANNER", icon: "🍯", tagline: "Honeypot audit tool", desc: "Audits Dionaea FTP honeypots for anonymous-login exposure and basic misconfiguration — tooling for sensor owners.", tags: ["honeypot", "ftp", "research"] },
  { name: "cai", cat: "dev", lang: "Python", stars: 0, forks: 0, status: "Ongoing", url: "https://github.com/Mr-Destroyer/cai", icon: "🧠", tagline: "AI security framework", desc: "Cybersecurity AI (CAI) framework — exploring AI-assisted security analysis and automation.", tags: ["ai-security", "framework", "automation"] },
  { name: "PageKite", cat: "dev", lang: "Python", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/PageKite", icon: "🪁", tagline: "Secure localhost tunneling", desc: "Reverse-proxy tooling that exposes localhost servers safely for authorized remote testing.", tags: ["reverse-proxy", "tunneling", "networking"] },
  { name: "cybersecurity_course", cat: "dev", lang: "HTML", stars: 0, forks: 0, status: "Ongoing", url: "https://github.com/Mr-Destroyer/cybersecurity_course", icon: "🎓", tagline: "Free cybersecurity course", desc: "Beginner-to-intermediate course manual — the on-ramp I wish I had, defensive-first and legal by design.", tags: ["course", "education", "beginner"] },
  { name: "0x41haz-writeup", cat: "dev", lang: "Markdown", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/0x41haz-writeup", icon: "📖", tagline: "Reverse-engineering writeup", desc: "Beginner-friendly RE walkthrough — registers, stack frames, and patching, explained clearly.", tags: ["reverse-engineering", "writeup", "beginner"] },
  { name: "ZIMTHEGOAT", cat: "dev", lang: "Shell", stars: 1, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/ZIMTHEGOAT", icon: "🦾", tagline: "Hacker-style desktop theme", desc: "Hyprland desktop theme — daily-driver ricing for focus and security demos.", tags: ["hyprland", "linux", "ricing"] },
  { name: "Jarvis_Zim", cat: "dev", lang: "Shell", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/Jarvis_Zim", icon: "🤖", tagline: "Text-to-voice experiments", desc: "Iron-Man-inspired TTS playground built with shell scripting.", tags: ["tts", "automation", "fun"] },
  { name: "DarkWeb", cat: "dev", lang: "HTML", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/DarkWeb", icon: "🌑", tagline: "Front-end showcase", desc: "A dark-themed site in HTML/CSS/JS — front-end skills on display.", tags: ["webdev", "frontend", "ui"] },
  { name: "CALCULATOR", cat: "dev", lang: "Python", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/CALCULATOR", icon: "🧮", tagline: "Beginner Python build", desc: "A simple Python calculator — where the coding journey started.", tags: ["beginner", "python"] },
  { name: "portfolio", cat: "dev", lang: "HTML", stars: 0, forks: 0, status: "Ongoing", url: "https://github.com/Mr-Destroyer/portfolio", icon: "🌐", tagline: "This very site", desc: "The repository for this portfolio — pure HTML/CSS/JS, no frameworks, no AI slop.", tags: ["portfolio", "webdev", "frontend"] }
];

/* TryHackMe achievement badges */
const THM_BADGES = [
  { icon: "🛡", name: "Pre Security" },
  { icon: "🌱", name: "Complete Beginner" },
  { icon: "🌐", name: "Web Fundamentals" },
  { icon: "💻", name: "Intro to Cyber Sec" },
  { icon: "🗡", name: "Jr. Pentester" },
  { icon: "🎄", name: "Advent of Cyber" },
  { icon: "🔥", name: "Red Teamer" },
  { icon: "💥", name: "Offensive Pentest" }
];

/* The Hunt Cycle — security methodology */
const HUNT_CYCLE = [
  { n: "01", icon: "🔭", name: "Reconnaissance", text: "Map the authorized scope: assets, surfaces, and exposure — passive first, active only with permission." },
  { n: "02", icon: "🗺", name: "Threat Modeling", text: "Rank what matters. Attack trees and STRIDE turn a scope into a prioritized test plan." },
  { n: "03", icon: "⚔", name: "Validation", text: "Verify each suspected weakness with safe, reproducible checks — no destructive payloads, ever." },
  { n: "04", icon: "⚖", name: "Risk Analysis", text: "Score impact and likelihood so owners can fix what actually threatens them first." },
  { n: "05", icon: "📜", name: "Reporting", text: "Clear, reproducible findings with business context, evidence, and remediation guidance." },
  { n: "06", icon: "🛠", name: "Remediation", text: "Work alongside developers — patches, hardening, and control improvements that stick." },
  { n: "07", icon: "🔁", name: "Retesting", text: "Verify the fixes closed the door. Regression checks confirm nothing new opened." },
  { n: "08", icon: "🕊", name: "Knowledge Sharing", text: "Writeups, detections, and lessons shared — coordinated disclosure, credit where due." }
];

/* Experience timeline — placeholders, no invented employers */
const EXPERIENCE = [
  {
    date: "2026", role: "Independent Security Researcher", org: "[ORGANIZATION / INDEPENDENT]",
    desc: "Open-source tooling, CVE research, and authorized assessments for selected clients.",
    points: ["Released and maintained 25+ open-source security tools", "Documented CVE research with defensive detection notes", "Provided vulnerability assessment and remediation guidance"],
    tools: ["Python", "Burp Suite", "Nmap"]
  },
  {
    date: "2025", role: "Junior Penetration Tester", org: "[COMPANY PLACEHOLDER]",
    desc: "Executed web and network assessments inside scoped, authorized engagements.",
    points: ["Delivered client-ready findings reports with reproducible PoCs", "Assisted cloud IAM reviews and misconfiguration audits", "Built internal automation for repetitive recon tasks"],
    tools: ["Burp Suite", "OWASP ZAP", "Wireshark"]
  },
  {
    date: "2024", role: "Security Lab Contributor", org: "[LAB / COMMUNITY PLACEHOLDER]",
    desc: "Designed legal practice labs and wrote learning content for aspiring defenders.",
    points: ["Built CTF-style lab environments for web security practice", "Published beginner-friendly walkthroughs and course material", "Mentored newcomers through their first authorized assessments"],
    tools: ["Docker", "Linux", "TryHackMe"]
  },
  {
    date: "2023", role: "CTF & Defensive Researcher", org: "[TEAM PLACEHOLDER]",
    desc: "Competed in capture-the-flag events and studied defensive engineering fundamentals.",
    points: ["Solved 300+ challenges across web, crypto, forensics, and RE", "Reached top-ranked status on TryHackMe", "Documented every solution as a personal knowledge base"],
    tools: ["TryHackMe", "GDB", "Python"]
  }
];

/* Certifications & achievements — all placeholders, verify before claiming */
const CERTS = [
  { icon: "🛡", title: "Ethical Hacking Fundamentals", issuer: "[ISSUER]", date: "[DATE]", verify: "[VERIFICATION URL]" },
  { icon: "🕸", title: "Web Security Specialist", issuer: "[ISSUER]", date: "[DATE]", verify: "[VERIFICATION URL]" },
  { icon: "☁", title: "Cloud Security Foundations", issuer: "[ISSUER]", date: "[DATE]", verify: "[VERIFICATION URL]" },
  { icon: "🐧", title: "Linux Security", issuer: "[ISSUER]", date: "[DATE]", verify: "[VERIFICATION URL]" },
  { icon: "🕊", title: "Responsible Disclosure", issuer: "[ISSUER]", date: "[DATE]", verify: "[VERIFICATION URL]" },
  { icon: "🚩", title: "CTF Competition Finalist", issuer: "[ISSUER]", date: "[DATE]", verify: "[VERIFICATION URL]" }
];

/* Decorative boot sequence for the loading screen (no unauthorized-access wording) */
const BOOT_LINES = [
  "INITIALIZING NIGHTFALL PROTOCOL...",
  "ESTABLISHING SECURE SESSION...",
  "LOADING SECURITY PROFILE...",
  "SCANNING DIGITAL SHADOWS...",
  "ACCESS GRANTED."
];

/* NIGHTFALL TERMINAL — decorative demo only, executes nothing */
const TERMINAL_BOOT = [
  "NIGHTFALL TERMINAL v2.1 — decorative interface",
  "no system commands are executed :: sandboxed demo",
  "type 'help' to list available commands"
];

const TERMINAL_CMDS = {
  help: [
    "Available commands:",
    "  whoami     — who is behind the terminal",
    "  skills     — core capability list",
    "  projects   — featured open-source work",
    "  contact    — how to reach me",
    "  status     — current system status",
    "  clear      — wipe the screen"
  ],
  whoami: [
    "Mohammad Zim — ethical security researcher",
    "Focus: application security, threat modeling, defensive engineering",
    "Mode: authorized testing only"
  ],
  skills: [
    "web_app_security ......... [=====-----] advanced",
    "network_security ......... [====------] advanced",
    "cloud_security ........... [===-------] intermediate",
    "secure_code_review ....... [=====-----] advanced",
    "threat_modeling .......... [====------] advanced",
    "osint .................... [=====-----] advanced",
    "security_automation ....... [=====-----] advanced",
    "ctf_red_team ............. [====------] advanced"
  ],
  projects: [
    "villain ............ red-team research toolkit",
    "endpointhunter ..... endpoint & secret discovery",
    "CredStalker ........ credential-exposure auditing",
    "vulnx .............. automated vulnerability assessment",
    "WPGhost ............ CVE-2024-10924 research",
    "CVE-2025-55182 ..... react-ecosystem research",
    "→ full archive in the Projects section"
  ],
  contact: [
    "github ....... github.com/Mr-Destroyer",
    "tryhackme .... tryhackme.com/p/MohammadZim",
    "youtube ...... youtube.com/@Study_Hard69",
    "email ........ [YOUR EMAIL]",
    "→ or use the contact form below"
  ],
  status: [
    "SYSTEM STATUS: ONLINE",
    "SECURITY POSTURE: VIGILANT",
    "CURRENT MODE: RESPONSIBLE DISCLOSURE",
    "UPTIME: [UPTIME]"
  ]
};

/* Attach everything to window for main.js */
window.NF_DATA = { PROFILE, STATS, SKILLS, SKILL_LINKS, PROJECT_CATS, PROJECTS, THM_BADGES, HUNT_CYCLE, EXPERIENCE, CERTS, BOOT_LINES, TERMINAL_BOOT, TERMINAL_CMDS };
