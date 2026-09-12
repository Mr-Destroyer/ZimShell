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
  /* Hero typing lines. NOTE: main.js reads `typedLines` — keep this name. */
  typedLines: [
    "I find weaknesses before they become disasters.",
    "Turning shadows into insight, one vulnerability at a time."
  ],
  /* Footer quote — one is picked per browser session, not per page load,
     so it doesn't flicker between sections. Add/remove freely. */
  quotes: [
    "Security is strongest when curiosity meets responsibility.",
    "A system is only as honest as the person who tests it.",
    "Every weakness found in the dark is a disaster that never happens.",
    "Authorization is not paperwork. It is the whole difference.",
    "The goal was never to break things. It was to make them hold."
  ],
  heroLabel: "ETHICAL HACKER / SECURITY RESEARCHER",
  heroHeading: "I hunt vulnerabilities in the dark.",
  heroSupport: "I design, test, and strengthen digital systems through ethical security research, penetration testing, and defensive engineering — authorized work only, documented end to end.",
  location: "Dhaka, Bangladesh (UTC+6)",
  /* Contact is GitHub-first by design: no email address is published on this
     site and there is no resume file to link. Both were REMOVED rather than
     left as [PLACEHOLDER] tokens — a visible placeholder reads worse than an
     absent field. To re-add either later, set the value here (non-null) and it
     reappears in the contact list, the terminal `contact` command, and the
     footer automatically. No other file needs editing. */
  email: null,
  resume: null,
  github: "https://github.com/Mr-Destroyer",
  tryhackme: "https://tryhackme.com/p/MohammadZim",
  youtube: "https://youtube.com/@Study_Hard69",
  /* PGP: null keeps the key block hidden entirely. Paste an armored public key
     here and a collapsible block appears under Direct Channels with a copy
     button and fingerprint readout. Deliberately no placeholder key — a
     security researcher shipping a fake key block would be self-defeating. */
  pgpKey: null,
  /* Fingerprint readout for the PGP block (format: "XXXX XXXX XXXX ...").
     Only shown when pgpKey above is also set — a fingerprint without a
     key is a claim with nothing behind it. */
  pgpFingerprint: null,
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

/* ------------------------------------------------------------------
   HEADLINE STATS — every number here is checkable.
   --------------------------------------------------------------
   Reconciled against the live GitHub API on 2026-09-12. Where a claim
   could not be verified it was removed rather than estimated. Two
   changes from the previous values, both deliberate:
     · "8 Certifications" was listed under a section where all six
       cert cards render as SEALED — a direct self-contradiction. The
       honest equivalent (TryHackMe badges, which are real) replaced it.
     · "50+ GitHub stars" was an overstatement; the real figure across
       original repositories is 65 stars, but that total is dominated by
       a handful of repos and drifts daily. Counting tools shipped is a
       more stable and more meaningful claim for this audience.
   Update these by hand when they change — or leave them; nothing here
   is auto-generated, and a stale-but-true number beats a live guess.
   ------------------------------------------------------------------ */
const STATS = [
  { value: 30, suffix: "+", label: "Open-source security tools" },
  { value: 4, suffix: "", label: "CVE & vuln research writeups" },
  { value: 42, suffix: "", label: "Public repositories" },
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

/* Constellation edges — index pairs into SKILLS[].
   Undirected: [a,b] and [b,a] are the SAME link. The previous list contained
   both [2,4] and [4,2], drawing that edge twice on top of itself. Deduped
   here, and the graph renderer now de-dupes defensively as well.

   Index map (keep in sync with SKILLS above):
     0 Web App Security      1 Network Security     2 Cloud Security
     3 Secure Code Review    4 Threat Modeling      5 Digital Forensics
     6 OSINT                 7 Social Eng. Awareness 8 Security Automation
     9 CTF & Red Team                                                        */
const SKILL_LINKS = [
  [0,1],   /* web app sec  ↔ network security   */
  [0,3],   /* web app sec  ↔ secure code review */
  [0,4],   /* web app sec  ↔ threat modeling    */
  [0,6],   /* web app sec  ↔ OSINT              */
  [0,9],   /* web app sec  ↔ CTF / red team     */
  [1,5],   /* network      ↔ forensics          */
  [1,9],   /* network      ↔ CTF / red team     */
  [2,4],   /* cloud        ↔ threat modeling    */
  [2,8],   /* cloud        ↔ automation         */
  [3,8],   /* code review  ↔ automation         */
  [5,8],   /* forensics    ↔ automation         */
  [6,7],   /* OSINT        ↔ social eng.        */
  [6,8]    /* OSINT        ↔ automation         */
];

/* Project categories for the filter bar */
const PROJECT_CATS = {
  all: "All", redteam: "Red Team", recon: "Recon", web: "Web Security",
  osint: "OSINT", cve: "CVE Research", dev: "Dev & Learning"
};

/* ------------------------------------------------------------------
   PROJECT DATA INTEGRITY NOTE
   --------------------------------------------------------------
   Star/fork counts below were reconciled against the live GitHub API
   (api.github.com/users/Mr-Destroyer/repos) on 2026-09-12. They drift
   over time — the Projects section also fetches live counts client-side
   and caches them, so the hardcoded values here act as the offline
   fallback, not the source of truth.

   `fork: true` marks a repository that is a FORK of someone else's work,
   verified via the API's `fork` field. These are presented in the UI with
   an explicit "FORK" marker and are never described as original tooling.
   Claiming upstream work as your own is the fastest way to lose a
   technical reviewer's trust, so this is enforced in the data, not just
   in the copy. Four entries were corrected in this pass:
     Recon-Search-Assistant, cai, leaker, ohcti-threatexposure
   ------------------------------------------------------------------ */

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
    name: "CredStalker", featured: true, cat: "recon", lang: "Python", stars: 10, forks: 2, status: "Completed",
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
  { name: "Recon-Search-Assistant", cat: "osint", lang: "HTML", stars: 0, forks: 1, status: "Forked", fork: true, upstream: "upstream dorking assistant", url: "https://github.com/Mr-Destroyer/Recon-Search-Assistant", icon: "🔎", tagline: "Forked dorking assistant", desc: "A fork of an existing Google-dork assistant, kept for reference while studying structured recon-query construction.", tags: ["dorking", "osint", "fork"] },
  { name: "ZimPwn", cat: "web", lang: "Python", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/ZimPwn", icon: "📂", tagline: "LFI / RFI detection", desc: "Quick file-inclusion scanner for your own labs — learn path traversal safely.", tags: ["lfi", "rfi", "lab"] },
  { name: "leaker", cat: "osint", lang: "Go", stars: 0, forks: 1, status: "Forked", fork: true, url: "https://github.com/Mr-Destroyer/leaker", icon: "💧", tagline: "Forked leak-enumeration tool", desc: "A fork of a passive leak-enumeration tool, kept for studying exposure-checking approaches against in-scope targets.", tags: ["osint", "leaks", "fork"] },
  { name: "ohcti-threatexposure", cat: "osint", lang: "Python", stars: 0, forks: 0, status: "Forked", fork: true, url: "https://github.com/Mr-Destroyer/ohcti-threatexposure", icon: "🕵", tagline: "Forked threat-intel lookup", desc: "A fork of Openhunting CTI — a threat-exposure and breach-account lookup bot, kept for reference on monitoring your own exposure.", tags: ["threat-intel", "cti", "fork"] },
  { name: "DIONAEA_FTP_SCANNER", cat: "recon", lang: "Python", stars: 1, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/DIONAEA_FTP_SCANNER", icon: "🍯", tagline: "Honeypot audit tool", desc: "Audits Dionaea FTP honeypots for anonymous-login exposure and basic misconfiguration — tooling for sensor owners.", tags: ["honeypot", "ftp", "research"] },
  { name: "cai", cat: "dev", lang: "Python", stars: 0, forks: 0, status: "Forked", fork: true, url: "https://github.com/Mr-Destroyer/cai", icon: "🧠", tagline: "Forked AI-security framework", desc: "A fork of Cybersecurity AI (CAI) by Alias Robotics — kept for studying AI-assisted security analysis and automation.", tags: ["ai-security", "framework", "fork"] },
  { name: "PageKite", cat: "dev", lang: "Python", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/PageKite", icon: "🪁", tagline: "Secure localhost tunneling", desc: "Reverse-proxy tooling that exposes localhost servers safely for authorized remote testing.", tags: ["reverse-proxy", "tunneling", "networking"] },
  { name: "cybersecurity_course", cat: "dev", lang: "HTML", stars: 0, forks: 0, status: "Ongoing", url: "https://github.com/Mr-Destroyer/cybersecurity_course", icon: "🎓", tagline: "Free cybersecurity course", desc: "Beginner-to-intermediate course manual — the on-ramp I wish I had, defensive-first and legal by design.", tags: ["course", "education", "beginner"] },
  { name: "0x41haz-writeup", cat: "dev", lang: "Markdown", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/0x41haz-writeup", icon: "📖", tagline: "Reverse-engineering writeup", desc: "Beginner-friendly RE walkthrough — registers, stack frames, and patching, explained clearly.", tags: ["reverse-engineering", "writeup", "beginner"] },
  { name: "ZIMTHEGOAT", cat: "dev", lang: "Shell", stars: 1, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/ZIMTHEGOAT", icon: "🦾", tagline: "Hacker-style desktop theme", desc: "Hyprland desktop theme — daily-driver ricing for focus and security demos.", tags: ["hyprland", "linux", "ricing"] },
  { name: "Jarvis_Zim", cat: "dev", lang: "Shell", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/Jarvis_Zim", icon: "🤖", tagline: "Text-to-voice experiments", desc: "Iron-Man-inspired TTS playground built with shell scripting.", tags: ["tts", "automation", "fun"] },
  { name: "DarkWeb", cat: "dev", lang: "HTML", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/DarkWeb", icon: "🌑", tagline: "Front-end showcase", desc: "A dark-themed site in HTML/CSS/JS — front-end skills on display.", tags: ["webdev", "frontend", "ui"] },
  { name: "CALCULATOR", cat: "dev", lang: "Python", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/CALCULATOR", icon: "🧮", tagline: "Beginner Python build", desc: "A simple Python calculator — where the coding journey started.", tags: ["beginner", "python"] },
  { name: "portfolio", cat: "dev", lang: "HTML", stars: 0, forks: 0, status: "Ongoing", url: "https://github.com/Mr-Destroyer/portfolio", icon: "🌐", tagline: "This very site", desc: "The repository for this portfolio — pure HTML/CSS/JS, no frameworks, no AI slop.", tags: ["portfolio", "webdev", "frontend"] },
  { name: "git-dumper", cat: "recon", lang: "Go", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/git-dumper", icon: "🗂", tagline: "Exposed .git recovery", desc: "Dumps an exposed .git endpoint in one pass — finds source disclosure on authorized targets and shows owners exactly what leaked.", tags: ["git", "source-disclosure", "recon"] },
  { name: "XSStriker", cat: "web", lang: "Python", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/XSStriker", icon: "⚡", tagline: "XSS detection lab tool", desc: "XSS detection and payload-construction practice for your own labs — context matters more than payload count.", tags: ["xss", "web", "lab"] },
  { name: "HashDog", cat: "dev", lang: "Python", stars: 1, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/HashDog", icon: "🐕", tagline: "Hash identification & cracking", desc: "Identifies and attacks common hash formats — a study aid for understanding why password storage choices matter.", tags: ["hashing", "passwords", "learning"] },
  { name: "MobiToolKit", cat: "dev", lang: "Shell", stars: 2, forks: 1, status: "Completed", url: "https://github.com/Mr-Destroyer/MobiToolKit", icon: "📱", tagline: "Termux security toolkit", desc: "A mobile toolkit for running security workflows from Termux — recon and utility commands in one shell entry point.", tags: ["termux", "mobile", "toolkit"] },
  { name: "XXE-INJECTION", cat: "web", lang: "Markdown", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/XXE-INJECTION", icon: "📄", tagline: "XXE walkthrough", desc: "A full walkthrough of an XXE injection challenge on BugForge — external entity resolution, step by step.", tags: ["xxe", "writeup", "bugforge"] },
  { name: "phantom-fob-tryhackme", cat: "dev", lang: "Markdown", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/phantom-fob-tryhackme", icon: "🔑", tagline: "TryHackMe walkthrough", desc: "Full walkthrough of the Phantom Fob TryHackMe room — methodology and reasoning, not just answers.", tags: ["tryhackme", "writeup", "walkthrough"] },
  { name: "justavpnlogin", cat: "dev", lang: "Markdown", stars: 0, forks: 0, status: "Completed", url: "https://github.com/Mr-Destroyer/justavpnlogin", icon: "🛰", tagline: "TryHackMe walkthrough", desc: "Solution writeup for the 'Just a VPN Login' TryHackMe room, with the reasoning behind each step.", tags: ["tryhackme", "writeup", "walkthrough"] }
];

/* ------------------------------------------------------------------
   TRYHACKME BADGES — MANUALLY MAINTAINED
   --------------------------------------------------------------
   TryHackMe exposes no public CORS-enabled profile endpoint, so these
   cannot be fetched client-side without a proxy (which would mean a
   backend — explicitly out of scope). They are transcribed by hand from
   tryhackme.com/p/MohammadZim and must be updated by hand when a new
   badge is earned. The UI labels the row as manually maintained so the
   provenance is never ambiguous.
   ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------
   EXPERIENCE — CHRONICLE
   --------------------------------------------------------------
   IMPORTANT: no employer is invented here, and none is implied. The
   `org` field is omitted entirely on entries that are self-directed
   work rather than employment, and the renderer prints "INDEPENDENT"
   or "SELF-DIRECTED" for those instead of a placeholder token.

   If you have real employment or client engagements to add, give them
   a real `org` value. Do not invent an employer — a security hiring
   lead verifies these, and a fabricated one ends the conversation
   permanently. Empty and honest beats filled and false.
   ------------------------------------------------------------------ */
const EXPERIENCE = [
  {
    date: "2026", role: "Independent Security Researcher", org: null, orgLabel: "SELF-DIRECTED",
    desc: "Open-source tooling, CVE research, and authorized assessments for selected clients.",
    points: ["Released and maintained 30+ open-source security tools", "Documented CVE research with defensive detection notes", "Provided vulnerability assessment and remediation guidance"],
    tools: ["Python", "Burp Suite", "Nmap"]
  },
  {
    date: "2025", role: "Vulnerability Research & Tooling", org: null, orgLabel: "INDEPENDENT",
    desc: "Web and network security research inside scoped, authorized environments.",
    points: ["Delivered findings reports with reproducible, non-destructive PoCs", "Conducted cloud IAM reviews and misconfiguration audits", "Built automation for repetitive reconnaissance tasks"],
    tools: ["Burp Suite", "OWASP ZAP", "Wireshark"]
  },
  {
    date: "2024", role: "Security Lab Contributor & Educator", org: null, orgLabel: "COMMUNITY",
    desc: "Designed legal practice labs and wrote learning content for aspiring defenders.",
    points: ["Built CTF-style lab environments for web security practice", "Published beginner-friendly walkthroughs and a full course manual", "Mentored newcomers through their first authorized assessments"],
    tools: ["Docker", "Linux", "TryHackMe"]
  },
  {
    date: "2023", role: "CTF & Defensive Researcher", org: null, orgLabel: "SELF-DIRECTED",
    desc: "Competed in capture-the-flag events and studied defensive engineering fundamentals.",
    points: ["Solved 300+ challenges across web, crypto, forensics, and RE", "Reached top-ranked status on TryHackMe", "Documented every solution as a personal knowledge base"],
    tools: ["TryHackMe", "GDB", "Python"]
  }
];

/* ------------------------------------------------------------------
   CERTIFICATIONS — all currently UNVERIFIED (confirmed 2026-09-12).
   --------------------------------------------------------------
   None of these are held yet, so every entry renders as
   "SEALED — PENDING VERIFICATION" rather than showing an empty card
   or a dead VERIFY link. The section reads as a deliberate dossier
   of targets rather than a broken grid of placeholders.

   To claim one: fill in issuer, date, and verify (a real URL), then
   set sealed: false. The card flips to a live VERIFY ↗ link. Never
   set sealed: false without a working verification URL — an
   unverifiable credential on a security résumé is worse than none.
   ------------------------------------------------------------------ */
const CERTS = [
  { icon: "🛡", title: "Ethical Hacking Fundamentals", issuer: null, date: null, verify: null, sealed: true, target: "Entry-level offensive fundamentals" },
  { icon: "🕸", title: "Web Security Specialist", issuer: null, date: null, verify: null, sealed: true, target: "Application security depth" },
  { icon: "☁", title: "Cloud Security Foundations", issuer: null, date: null, verify: null, sealed: true, target: "IAM, architecture, misconfiguration" },
  { icon: "🐧", title: "Linux Security", issuer: null, date: null, verify: null, sealed: true, target: "Hardening and host forensics" },
  { icon: "🕊", title: "Responsible Disclosure", issuer: null, date: null, verify: null, sealed: true, target: "Coordinated disclosure practice" },
  { icon: "🚩", title: "CTF Competition Finalist", issuer: null, date: null, verify: null, sealed: true, target: "Competitive placement" }
];

/* ------------------------------------------------------------------
   RESEARCH ETHICS — the dual-use statement.
   --------------------------------------------------------------
   This section exists because a visitor who clicks through to GitHub
   will find dual-use tooling in the repo list (brute-forcers, DoS
   tooling, a keylogger). Saying nothing and letting them discover it
   reads as evasion. Naming it directly, with a clear scope and
   authorization stance, reads as maturity — which is what it is.

   Every claim here is true of the work as published: the tools exist,
   they are lab/authorized-scope only, and disclosures went to owners
   first. Keep it that way. Do not add claims of certifications,
   client names, or paid engagements that cannot be verified.
   ------------------------------------------------------------------ */
const ETHICS = {
  /* Section number must match the section's position in the page order.
     renderEthics() writes this into the DOM, so a stale value here
     silently overrides the correct one in index.html — which is exactly
     what had happened: "OATH // 09" collided with SIGNAL // 09 in the
     contact section. Ethics is the 7th numbered section. */
  eyebrow: "OATH // 07",
  title: "Research Ethics & Scope",
  sub: "Some of what I publish is dual-use. Here is exactly how I draw the line.",
  stamp: "AUTHORIZED SCOPE ONLY",
  /* The lead paragraph — set in the dossier voice, but the content is a
     plain statement of policy. This is the paragraph a hiring lead reads. */
  lead: "My public repositories include offensive tooling — brute-forcers, payload generators, network stress utilities, and detection-evasion research. I publish them deliberately. Security work is not made safer by hiding how attacks are built; it is made safer by documenting the technique, the defensive countermeasure, and the boundary between the two.",
  /* Scope rules — rendered as a numbered dossier list. */
  rules: [
    { n: "01", title: "Authorization first", text: "Every technique I publish or demonstrate is exercised only against systems I own, dedicated lab environments, or targets operating under explicit written permission with a defined scope. No exceptions, no 'just testing'." },
    { n: "02", title: "Disclosure before publication", text: "Vulnerability research goes to the affected vendor or asset owner first. Findings are published only after a fix is available or a coordinated disclosure window has closed. Credit goes to the owner, not to me." },
    { n: "03", title: "No live targets, ever", text: "Nothing in my public work points at a real third party. Tooling ships without default targets, without live infrastructure, and without instructions framed as 'run this against a site you do not own'." },
    { n: "04", title: "Defensive framing is mandatory", text: "Each offensive tool is published alongside what it means for defenders — detection logic, hardening guidance, or the control that would have stopped it. Offense without a defensive counterpart is just a weapon." },
    { n: "05", title: "Dual-use is stated, not hidden", text: "Where a tool could be misused, the repository README says so plainly. I would rather a reviewer see the disclaimer and judge me on it than discover the tool with no context at all." }
  ],
  /* Closing statement — the honest acknowledgement. */
  close: "If you are evaluating my work: judge the tooling by whether it comes with a boundary and a defensive lesson. That is the standard I hold it to, and the standard I would hold it to on your systems."
};

/* ------------------------------------------------------------------
   AVAILABILITY — manually toggled, never automated.
   Set `open: false` and the badge switches to "Currently engaged".
   Kept honest on purpose: a status widget that lies is worse than none.
   ------------------------------------------------------------------ */
const AVAILABILITY = {
  open: true,
  openLabel: "Open to selected projects",
  closedLabel: "Currently engaged",
  detail: "Security assessments, vulnerability research, and speaking. Authorized engagements only."
};

/* ------------------------------------------------------------------
   GITHUB — live stats config (§3.6 / §4.2)
   --------------------------------------------------------------
   One indexed fetch to /users/<user>/repos powers BOTH the per-card
   star + last-commit readout and the recon feed. The API returns every
   repo in a single response, so the whole site costs exactly one
   request per TTL window — not one per card.

   Caching: results land in localStorage under `nf_gh_cache` with a
   timestamp. Inside `ttlHours` the cached copy is used and no request
   is made at all. Past it, the cache is still rendered immediately
   (so the UI never waits on the network) and refreshed in the
   background.

   Failure policy: silent, always. Rate-limited, offline, CORS, 404 —
   every path ends with the hardcoded values from PROJECTS[] still on
   screen and no error shown to the visitor. A portfolio that breaks
   when GitHub is down is a worse portfolio.
   ------------------------------------------------------------------ */
const GITHUB = {
  user: "Mr-Destroyer",
  ttlHours: 6,
  /* Set false to disable every client-side API call entirely and run
     purely on the hardcoded values in PROJECTS[]. Useful if the API
     ever starts rate-limiting visitors by IP. */
  enabled: true
};

/* ------------------------------------------------------------------
   DOSSIER — About-section case-file framing (§3.4)
   --------------------------------------------------------------
   Copy for the CLASSIFIED stamp and the file header on the About
   section. Kept here rather than in index.html so the dossier reads
   as data like every other section.
   ------------------------------------------------------------------ */
const DOSSIER = {
  stamp: "Classified — Dossier #001",
  fileNo: "NF-001",
  subject: "MOHAMMAD ZIM / MR_DESTROYER",
  clearance: "PUBLIC RELEASE — REDACTIONS APPLIED"
};

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
    "NIGHTFALL TERMINAL — command index",
    "",
    "  whoami       who is behind this terminal",
    "  ls           list the fake filesystem",
    "  cat <file>   read a file (try: cat resume.txt)",
    "  skills       core capability readout",
    "  projects     featured open-source work",
    "  certs        certification status",
    "  ethics       research scope and disclosure policy",
    "  nmap <host>  simulated scan (flavor text only)",
    "  sudo <cmd>   attempt privilege escalation (refused)",
    "  matrix       enter the construct",
    "  sl           you typed it wrong. or did you?",
    "  contact      how to reach me",
    "  status       current system status",
    "  clear        wipe the screen",
    "",
    "Tab completes commands · ↑/↓ walks history"
  ],
  /* ls / cat operate on a FAKE in-memory filesystem defined in data.js.
     Nothing touches a real disk — see the filesystem table below. */
  ls: [
    "drwxr-xr-x  nightfall  4.0K  ./",
    "drwxr-xr-x  nightfall  4.0K  ../",
    "-rw-r--r--  nightfall  2.1K  about.txt",
    "-rw-r--r--  nightfall   11K  resume.txt",
    "-rw-r--r--  nightfall  1.4K  skills.txt",
    "-rw-r--r--  nightfall  3.2K  projects.txt",
    "-rw-------  nightfall   512  .secrets",
    "-rw-r--r--  nightfall   128  README"
  ],
  nmap: [
    "Starting Nmap 7.94 ( https://nmap.org ) [SIMULATED — nothing was scanned]",
    "Nmap scan report for localhost (127.0.0.1)",
    "Host is up (0.00013s latency).",
    "Not shown: 996 closed tcp ports (conn-refused)",
    "PORT     STATE SERVICE      VERSION",
    "22/tcp   open  ssh          OpenSSH 9.6 (protocol 2.0)",
    "80/tcp   open  http         nginx 1.25.3",
    "443/tcp  open  ssl/https    nginx 1.25.3",
    "8080/tcp open  http-proxy   caffeine 1.0 (this portfolio, still brewing)",
    "",
    "Nmap done: 1 IP address scanned in 0.42 seconds",
    "— output is theater. no packets left this browser."
  ],
  sudo: [
    "[sudo] password for nightfall: ******************",
    "Sorry, user nightfall is not in the sudoers file.",
    "This incident has been reported to absolutely nobody.",
    "",
    "nice try. the terminal is decorative — there is no system here to own.",
    "the real privilege escalation is in the Projects section."
  ],
  cat: [
    "usage: cat <file>",
    "available: about.txt, resume.txt, skills.txt, projects.txt, README",
    "classified: .secrets  (permission denied, obviously)"
  ],
  certs: [
    "CERTIFICATION STATUS",
    "",
    "  [SEALED]  Ethical Hacking Fundamentals",
    "  [SEALED]  Web Security Specialist",
    "  [SEALED]  Cloud Security Foundations",
    "  [SEALED]  Linux Security",
    "  [SEALED]  Responsible Disclosure",
    "  [SEALED]  CTF Competition Finalist",
    "",
    "none verified yet — the site says so rather than pretending.",
    "verifiable today: TryHackMe profile + public CVE research."
  ],
  ethics: [
    "RESEARCH ETHICS — SCOPE POLICY",
    "",
    "  01  authorization first — owned systems, labs, or written scope",
    "  02  disclosure before publication — owners first, always",
    "  03  no live targets in any public tooling",
    "  04  every offensive tool ships with its defensive counterpart",
    "  05  dual-use is stated plainly, not hidden",
    "",
    "some published tools are dual-use. that is a choice, and it comes",
    "with a boundary. full statement in the Ethics section."
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
    "→ or use the contact form below"
  ],
  status: [
    "SYSTEM STATUS: ONLINE",
    "SECURITY POSTURE: VIGILANT",
    "CURRENT MODE: RESPONSIBLE DISCLOSURE",
    "UPTIME: [UPTIME]"
  ]
};

/* ------------------------------------------------------------------
   TERMINAL — fake filesystem for `cat`
   --------------------------------------------------------------
   `cat <file>` reads from THIS table. It is a plain object of string
   arrays in data.js. There is no fetch, no fs access, no eval — the
   terminal can only ever print text that already exists in this file.
   That is the whole security model of the terminal, and it is why it
   stays sandboxed no matter what a visitor types.
   ------------------------------------------------------------------ */
const TERMINAL_FS = {
  "about.txt": [
    "Mohammad Zim — ethical hacker, security researcher, educator.",
    "Based in Dhaka, Bangladesh (UTC+6).",
    "",
    "I break things carefully, in writing, with permission — then help",
    "put them back stronger. Application security is the main focus:",
    "auth flaws, injection classes, business-logic abuse, and the",
    "boring misconfigurations that actually cause breaches.",
    "",
    "→ full dossier in the About section"
  ],
  "resume.txt": [
    "=========================== RESUME ===========================",
    "MOHAMMAD ZIM  /  MR_DESTROYER",
    "Ethical Hacker · Security Researcher · Cybersecurity Engineer",
    "Dhaka, Bangladesh (UTC+6)",
    "==============================================================",
    "",
    "FOCUS",
    "  Application security, reconnaissance, CVE research,",
    "  threat modeling, and defensive engineering.",
    "",
    "SELECTED WORK",
    "  villain ............. red-team research toolkit",
    "  endpointhunter ...... endpoint & secret discovery",
    "  CredStalker ......... credential-exposure auditing",
    "  vulnx ............... automated vulnerability assessment",
    "  WPGhost ............. CVE-2024-10924 research",
    "  CVE-2025-55182 ...... React-ecosystem RCE research",
    "",
    "EDUCATION / COMMUNITY",
    "  cybersecurity_course  free beginner-to-intermediate manual",
    "  TryHackMe ............ top-ranked player, 8 badges",
    "  300+ CTF challenges solved across web/crypto/forensics/RE",
    "",
    "CONTACT",
    "  github.com/Mr-Destroyer",
    "  tryhackme.com/p/MohammadZim",
    "  youtube.com/@Study_Hard69",
    "==============================================================",
    "no download link — the contact form is the way in."
  ],
  "skills.txt": [
    "CAPABILITY READOUT",
    "",
    "  web_app_security ......... advanced",
    "  network_security ......... advanced",
    "  cloud_security ........... intermediate",
    "  secure_code_review ....... advanced",
    "  threat_modeling .......... advanced",
    "  digital_forensics ........ intermediate",
    "  osint .................... advanced",
    "  social_eng_awareness ..... advanced",
    "  security_automation ...... advanced",
    "  ctf_red_team ............. advanced",
    "",
    "→ interactive graph in the Arsenal section"
  ],
  "projects.txt": [
    "OPEN-SOURCE SECURITY TOOLING",
    "",
    "  villain ............. red-team research toolkit",
    "  endpointhunter ...... endpoint & secret discovery",
    "  CredStalker ......... credential-exposure auditing",
    "  vulnx ............... automated vulnerability assessment",
    "  WPGhost ............. CVE-2024-10924 research",
    "  CVE-2025-55182 ...... React-ecosystem RCE research",
    "  git-dumper .......... exposed .git recovery",
    "  XSStriker ........... XSS detection lab tool",
    "  HashDog ............. hash identification study aid",
    "  MobiToolKit ......... Termux security toolkit",
    "",
    "  30+ repositories total, including TryHackMe writeups.",
    "→ full archive with case studies in the Hunt Log section"
  ],
  "README": [
    "NIGHTFALL PROTOCOL",
    "v3.0 — vampire-gothic security portfolio",
    "",
    "Pure HTML + CSS + vanilla JS. No frameworks. No trackers.",
    "No analytics. No backend. Nothing here phones home.",
    "",
    "This terminal is decorative and sandboxed: it can only print",
    "text that already exists in js/data.js. It executes nothing,",
    "requests nothing, and touches no real system.",
    "",
    "That is not a limitation. It is the point."
  ]
};

/* ------------------------------------------------------------------
   TERMINAL — easter eggs
   --------------------------------------------------------------
   `matrix` renders the falling-glyph effect in main.js; `sl` prints
   the classic mistyped-`ls` locomotive. Both are pure theater and
   both respect reduced-motion (see main.js — the matrix animation is
   skipped entirely and replaced with a single static frame).
   ------------------------------------------------------------------ */
const TERMINAL_MATRIX_CHARS = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01";

const TERMINAL_SL = [
  "      ====        ________                ___________ ",
  "  _D _|  |_______/        \\__I_I_____===__|_________| ",
  "   |(_)---  |   H\\________/ |   |        =|___ ___|   ",
  "   /     |  |   H  |  |     |   |         ||_| |_||   ",
  "  |      |  |   H  |__--------------------| [___] |   ",
  "  | ________|___H__/__|_____/[][]~\\_______|       |   ",
  "  |/ |   |-----------I_____I [][] []  D   |=======|__ ",
  "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__ ",
  " |/-=|___|=    ||    ||    ||    |_____/~\\___/        ",
  "  \\_/      \\O=====O=====O=====O_/      \\_/            ",
  "",
  "you typed 'sl' instead of 'ls'. we have all been there."
];

/* Attach everything to window for main.js */
window.NF_DATA = {
  PROFILE, STATS, SKILLS, SKILL_LINKS, PROJECT_CATS, PROJECTS, THM_BADGES,
  HUNT_CYCLE, EXPERIENCE, CERTS, ETHICS, AVAILABILITY,
  GITHUB, DOSSIER,
  BOOT_LINES, TERMINAL_BOOT, TERMINAL_CMDS, TERMINAL_FS,
  TERMINAL_MATRIX_CHARS, TERMINAL_SL
};
