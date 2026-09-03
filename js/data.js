/* ============================================
   ZIM :: SYSTEM_OPERATOR — Mission Data
   ============================================ */

const REPOS = [
  {
    name: "CredStalker-",
    url: "https://github.com/Mr-Destroyer/CredStalker-",
    desc: "CredStalker is a powerful automated security tool designed to hunt down exposed credentials, API keys, passwords, tokens, and sensitive data lurking in websites. Perfect for bug bounty hunters, penetration testers, and security auditors.",
    lang: "Python",
    stars: 10,
    forks: 1,
    cat: "offsec",
    tags: ["bug-bounty", "credential-scanner", "osint", "web-crawler"],
    icon: "🔑"
  },
  {
    name: "endpointhunter",
    url: "https://github.com/Mr-Destroyer/endpointhunter",
    desc: "EndpointHunter is a powerful bug bounty tool designed to hunt and extract API endpoints, LFI paths, secrets, and cloud storage URLs from JS, CSS, and HTML files. Built for efficiency with multi-threaded scanning.",
    lang: "Python",
    stars: 11,
    forks: 1,
    cat: "osint",
    tags: ["api-enumeration", "endpoint-discovery", "bugbounty", "reconnaissance"],
    icon: "🎯"
  },
  {
    name: "villain",
    url: "https://github.com/Mr-Destroyer/villain",
    desc: "The Undetectable Payload/Shell generator and executor. Craft payloads that evade detection and execute remotely.",
    lang: "Python",
    stars: 12,
    forks: 3,
    cat: "offsec",
    tags: ["payload", "shell", "evasion", "red-team"],
    icon: "💀"
  },
  {
    name: "vulnx",
    url: "https://github.com/Mr-Destroyer/vulnx",
    desc: "Auto Vulnerability Finder — automatically detects vulnerabilities and injects shells.",
    lang: "Python",
    stars: 9,
    forks: 0,
    cat: "web",
    tags: ["vulnerability-scanner", "auto-exploit", "shell-injection"],
    icon: "🧨"
  },
  {
    name: "Fucker",
    url: "https://github.com/Mr-Destroyer/Fucker",
    desc: "Fucker is a Web Application Vulnerability Scanner. Sweep targets and map the attack surface in seconds.",
    lang: "Python",
    stars: 6,
    forks: 0,
    cat: "web",
    tags: ["web-scanner", "vulnerability", "offsec"],
    icon: "🔍"
  },
  {
    name: "CVE-2025-55182",
    url: "https://github.com/Mr-Destroyer/CVE-2025-55182",
    desc: "Simple exploit for CVE-2025-55182 — RCE, command injection and other vulnerabilities in ReactJS.",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "cve",
    tags: ["cve", "poc", "rce", "reactjs-vulnerability", "tryhackme-ctf"],
    icon: "🩸"
  },
  {
    name: "WPGhost",
    url: "https://github.com/Mr-Destroyer/WPGhost",
    desc: "A vulnerability Scanner and Exploiter for WordPress based on CVE-2024-10924.",
    lang: "Python",
    stars: 3,
    forks: 0,
    cat: "cve",
    tags: ["cve-2024-10924", "wordpress", "scanner", "exploiter"],
    icon: "👻"
  },
  {
    name: "SQLZ",
    url: "https://github.com/Mr-Destroyer/SQLZ",
    desc: "SQL Injection all-in-one tool. Inject, extract, and exfiltrate from databases with precision.",
    lang: "Python",
    stars: 1,
    forks: 0,
    cat: "web",
    tags: ["sql-injection", "database", "exploitation"],
    icon: "🗄️"
  },
  {
    name: "God_Scanner",
    url: "https://github.com/Mr-Destroyer/God_Scanner",
    desc: "The God Scanner — sweep the entire attack surface and find every weak point.",
    lang: "Python",
    stars: 1,
    forks: 0,
    cat: "web",
    tags: ["scanner", "recon", "offsec"],
    icon: "⚡"
  },
  {
    name: "ALL_IN_ONE",
    url: "https://github.com/Mr-Destroyer/ALL_IN_ONE",
    desc: "Find EVERY hacking tool in ONE tool. The ultimate swiss-army knife of offensive security.",
    lang: "Python",
    stars: 2,
    forks: 2,
    cat: "offsec",
    tags: ["all-in-one", "toolkit", "automation"],
    icon: "🔧"
  },
  {
    name: "0x41haz-writeup",
    url: "https://github.com/Mr-Destroyer/0x41haz-writeup",
    desc: "A simple writeup for beginners in reverse engineering — explained very well.",
    lang: "Markdown",
    stars: 0,
    forks: 0,
    cat: "dev",
    tags: ["reverse-engineering", "writeup", "beginner"],
    icon: "📖"
  },
  {
    name: "ohcti-threatexposure",
    url: "https://github.com/Mr-Destroyer/ohcti-threatexposure",
    desc: "Openhunting CTI — Threat Exposure Data Breach Account lookup for Telegram.",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "osint",
    tags: ["threat-intel", "data-breach", "telegram"],
    icon: "🕵️"
  },
  {
    name: "Jarvis_Zim",
    url: "https://github.com/Mr-Destroyer/Jarvis_Zim",
    desc: "This tool can convert text to voice like Jarvis (Iron Man).",
    lang: "Shell",
    stars: 0,
    forks: 0,
    cat: "dev",
    tags: ["tts", "jarvis", "automation"],
    icon: "🤖"
  },
  {
    name: "EmailSpoofer",
    url: "https://github.com/Mr-Destroyer/EmailSpoofer",
    desc: "SMTP email spoofing with an easy method.",
    lang: "Python",
    stars: 2,
    forks: 1,
    cat: "offsec",
    tags: ["smtp", "spoofing", "phishing"],
    icon: "✉️"
  },
  {
    name: "sessionexploit",
    url: "https://github.com/Mr-Destroyer/sessionexploit",
    desc: "A solid cookie exploiter that decodes url_encode(base64(md5(username))) patterned sessions — capable of encoding too.",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "web",
    tags: ["session", "cookie", "hijack", "tryhackme"],
    icon: "🍪"
  },
  {
    name: "ufonet",
    url: "https://github.com/Mr-Destroyer/ufonet",
    desc: "A tool as simple as it is powerful — used for DDoS, botnet and mining and more crazy stuff.",
    lang: "JavaScript",
    stars: 2,
    forks: 0,
    cat: "offsec",
    tags: ["ddos", "botnet", "offensive"],
    icon: "🛸"
  },
  {
    name: "torshammer",
    url: "https://github.com/Mr-Destroyer/torshammer",
    desc: "A DDoS Attack Tool for stress-testing resilience under fire.",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "offsec",
    tags: ["ddos", "stress-test", "tor"],
    icon: "🔨"
  },
  {
    name: "cybersecurity_course",
    url: "https://github.com/Mr-Destroyer/cybersecurity_course",
    desc: "A basic cybersecurity course that will turn any beginner into an intermediate hacker.",
    lang: "HTML",
    stars: 0,
    forks: 0,
    cat: "dev",
    tags: ["course", "education", "beginner"],
    icon: "🎓"
  },
  {
    name: "seeker",
    url: "https://github.com/Mr-Destroyer/seeker",
    desc: "Accurately locate smartphones using social engineering.",
    lang: "CSS",
    stars: 0,
    forks: 0,
    cat: "offsec",
    tags: ["social-engineering", "geo-location", "phishing"],
    icon: "📡"
  },
  {
    name: "b11",
    url: "https://github.com/Mr-Destroyer/b11",
    desc: "11 digit Facebook accounts password cracker for Bangladeshi Termux users.",
    lang: "Python",
    stars: 1,
    forks: 0,
    cat: "offsec",
    tags: ["brute-force", "termux", "facebook"],
    icon: "🔐"
  },
  {
    name: "ZIMTHEGOAT",
    url: "https://github.com/Mr-Destroyer/ZIMTHEGOAT",
    desc: "A Hyprland Desktop custom theme made to look like an unrealistic hacking machine.",
    lang: "Shell",
    stars: 1,
    forks: 0,
    cat: "dev",
    tags: ["hyprland", "theme", "desktop"],
    icon: "🦾"
  },
  {
    name: "ZForce",
    url: "https://github.com/Mr-Destroyer/ZForce",
    desc: "One of the best brute-force tools for social media accounts.",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "offsec",
    tags: ["brute-force", "social-media", "automation"],
    icon: "💪"
  },
  {
    name: "leaker",
    url: "https://github.com/Mr-Destroyer/leaker",
    desc: "Passive leak enumeration tool.",
    lang: "Go",
    stars: 0,
    forks: 1,
    cat: "osint",
    tags: ["leak-enumeration", "osint", "passive"],
    icon: "💧"
  },
  {
    name: "XXE-INJECTION",
    url: "https://github.com/Mr-Destroyer/XXE-INJECTION",
    desc: "A full walkthrough of tundra XXE injection on bugforge.",
    lang: "Markdown",
    stars: 0,
    forks: 0,
    cat: "cve",
    tags: ["xxe", "walkthrough", "bugforge"],
    icon: "🧪"
  },
  {
    name: "ZimPwn",
    url: "https://github.com/Mr-Destroyer/ZimPwn",
    desc: "Quick LFI - RFI Scanner. Scan like a pro.",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "web",
    tags: ["lfi", "rfi", "scanner"],
    icon: "📂"
  },
  {
    name: "XSStriker",
    url: "https://github.com/Mr-Destroyer/XSStriker",
    desc: "The best tool for XSS attack.",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "web",
    tags: ["xss", "injection", "web"],
    icon: "🎯"
  },
  {
    name: "cai",
    url: "https://github.com/Mr-Destroyer/cai",
    desc: "Cybersecurity AI (CAI) — the framework for AI Security.",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "dev",
    tags: ["ai-security", "framework", "automation"],
    icon: "🧠"
  },
  {
    name: "RED_HAWK",
    url: "https://github.com/Mr-Destroyer/RED_HAWK",
    desc: "RED HAWK — recon and vulnerability scanner.",
    lang: "PHP",
    stars: 0,
    forks: 0,
    cat: "web",
    tags: ["recon", "scanner", "php"],
    icon: "🦅"
  },
  {
    name: "Recon-Search-Assistant",
    url: "https://github.com/Mr-Destroyer/Recon-Search-Assistant",
    desc: "Dorking on a next level — advanced Google dorking assistant.",
    lang: "HTML",
    stars: 0,
    forks: 1,
    cat: "osint",
    tags: ["google-dorking", "osint", "recon"],
    icon: "🔎"
  },
  {
    name: "Ransomware",
    url: "https://github.com/Mr-Destroyer/Ransomware",
    desc: "This tool is the best tool for ransomware attack (educational/research).",
    lang: "Python",
    stars: 1,
    forks: 0,
    cat: "offsec",
    tags: ["ransomware", "research", "encryption"],
    icon: "💰"
  },
  {
    name: "PageKite",
    url: "https://github.com/Mr-Destroyer/PageKite",
    desc: "PageKite is a reverse proxy tool that lets you securely expose localhost servers to the public internet, even behind firewalls or NAT.",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "dev",
    tags: ["reverse-proxy", "tunneling", "networking"],
    icon: "🪁"
  },
  {
    name: "JWT-MODIFY",
    url: "https://github.com/Mr-Destroyer/JWT-MODIFY",
    desc: "Modify JWT payloads with ease.",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "web",
    tags: ["jwt", "token", "auth-exploit"],
    icon: "🎫"
  },
  {
    name: "Keylogger",
    url: "https://github.com/Mr-Destroyer/Keylogger",
    desc: "A keylogger in C++ — easy to decompile and run (educational).",
    lang: "C++",
    stars: 2,
    forks: 0,
    cat: "offsec",
    tags: ["keylogger", "c++", "research"],
    icon: "⌨️"
  },
  {
    name: "MobiToolKit",
    url: "https://github.com/Mr-Destroyer/MobiToolKit",
    desc: "A simple tool that can hack into any Android device — works for Android above version 6.",
    lang: "Shell",
    stars: 2,
    forks: 1,
    cat: "offsec",
    tags: ["android", "mobile", "toolkit"],
    icon: "📱"
  },
  {
    name: "DarkWeb",
    url: "https://github.com/Mr-Destroyer/DarkWeb",
    desc: "A webpage in HTML, CSS and JavaScript. I showed my web development skills here 😁",
    lang: "HTML",
    stars: 0,
    forks: 0,
    cat: "dev",
    tags: ["webdev", "darkweb", "frontend"],
    icon: "🌑"
  },
  {
    name: "HashDog",
    url: "https://github.com/Mr-Destroyer/HashDog",
    desc: "Hash cracking tool.",
    lang: "Python",
    stars: 1,
    forks: 0,
    cat: "offsec",
    tags: ["hashcracking", "crypto", "password"],
    icon: "🐕"
  },
  {
    name: "DigitalSparkUsbController",
    url: "https://github.com/Mr-Destroyer/DigitalSparkUsbController",
    desc: "A script for Spark USB and USB Rubber Ducky — easy to decompile and run.",
    lang: "C++",
    stars: 0,
    forks: 0,
    cat: "offsec",
    tags: ["usb-rubber-ducky", "hardware", "payload"],
    icon: "🐤"
  },
  {
    name: "FaceBoom",
    url: "https://github.com/Mr-Destroyer/FaceBoom",
    desc: "A Python script for brute-force attack on Facebook accounts.",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "offsec",
    tags: ["brute-force", "facebook"],
    icon: "💥"
  },
  {
    name: "FB-Hack",
    url: "https://github.com/Mr-Destroyer/FB-Hack",
    desc: "Hack any Facebook account in one tool.",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "offsec",
    tags: ["facebook", "social-engineering"],
    icon: "📘"
  },
  {
    name: "DIONAEA_FTP_SCANNER",
    url: "https://github.com/Mr-Destroyer/DIONAEA_FTP_SCANNER",
    desc: "A lightweight tool for security researchers to test and audit Dionaea FTP honeypots for anonymous login exposure and basic misconfiguration.",
    lang: "Python",
    stars: 1,
    forks: 0,
    cat: "osint",
    tags: ["honeypot", "ftp", "research"],
    icon: "🍯"
  },
  {
    name: "CALCULATOR",
    url: "https://github.com/Mr-Destroyer/CALCULATOR",
    desc: "A simple calculator in Python — beginner friendly.",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "dev",
    tags: ["beginner", "python", "fun"],
    icon: "🧮"
  },
  {
    name: "DDos_Zim",
    url: "https://github.com/Mr-Destroyer/DDos_Zim",
    desc: "This tool is coded for DDoS attack to a website server — can jam wifi, DDoS web server, and more.",
    lang: "Python",
    stars: 1,
    forks: 0,
    cat: "offsec",
    tags: ["ddos", "wifi", "offensive"],
    icon: "🌊"
  },
  {
    name: "Admin-Finder",
    url: "https://github.com/Mr-Destroyer/Admin-Finder",
    desc: "Admin Panel Finder.",
    lang: "Perl",
    stars: 0,
    forks: 0,
    cat: "web",
    tags: ["admin-finder", "recon", "panel"],
    icon: "🛠️"
  },
  {
    name: "blackeye",
    url: "https://github.com/Mr-Destroyer/blackeye",
    desc: "The ultimate phishing tool with 38 websites available!",
    lang: "HTML",
    stars: 1,
    forks: 0,
    cat: "offsec",
    tags: ["phishing", "social-engineering", "toolkit"],
    icon: "👁️"
  },
  {
    name: "wifi_hacker",
    url: "https://github.com/Mr-Destroyer/wifi_hacker",
    desc: "This tool is for wifi hacking — only works on Windows!",
    lang: "Python",
    stars: 0,
    forks: 0,
    cat: "offsec",
    tags: ["wifi", "windows", "network"],
    icon: "📶"
  },
  {
    name: "course_manual",
    url: "https://github.com/Mr-Destroyer/course_manual",
    desc: "Course manual for cybersecurity learning.",
    lang: "HTML",
    stars: 0,
    forks: 0,
    cat: "dev",
    tags: ["course", "manual", "education"],
    icon: "📚"
  },
  {
    name: "portfolio",
    url: "https://github.com/Mr-Destroyer/portfolio",
    desc: "The repository for this very site — pure graphics, pure motion, no AI slop.",
    lang: "HTML",
    stars: 0,
    forks: 0,
    cat: "dev",
    tags: ["portfolio", "webdev", "frontend"],
    icon: "🌐"
  }
];

// Categories for filtering
const CATEGORIES = {
  all: "ALL",
  offsec: "OFFSEC",
  web: "WEB",
  osint: "OSINT",
  cve: "CVE",
  dev: "DEV"
};

// Boot sequence lines
const BOOT_LINES = [
  { text: "ZIM BIOS v4.2.0 — SYSTEM_OPERATOR EDITION", type: "info" },
  { text: "CPU: QUAD-CORE HUSTLE @ 4.20GHz ............ [ OK ]", type: "ok" },
  { text: "MEMORY: 16GB GIGABYTES OF BAD IDEAS ......... [ OK ]", type: "ok" },
  { text: "DISK: /dev/sda1 MOUNTED AT /VAR/ARROGANCE .... [ OK ]", type: "ok" },
  { text: "GPU: MATRIX RAIN ACCELERATOR ................ [ OK ]", type: "ok" },
  { text: "NET: ESTABLISHING SECURE CHANNEL ............. [ OK ]", type: "ok" },
  { text: "NET: TOR CIRCUIT 0xDEADBEEF ................. [ OK ]", type: "info" },
  { text: "SEC: LOADING ZERO-DAY ARCHITECTURE ........... [ OK ]", type: "ok" },
  { text: "SEC: EVADING ANTIVIRUS ...................... [ OK ]", type: "ok" },
  { text: "SEC: BYPASSING FIREWALL ...................... [ OK ]", type: "ok" },
  { text: "WRN: HACKING INTENSITY EXCEEDS RECOMMENDED .. [ WARN ]", type: "warn" },
  { text: "SEC: ROOT PRIVILEGES ACQUIRED ............... [ OK ]", type: "ok" },
  { text: "SYS: INITIALIZING DOJO ...................... [ OK ]", type: "ok" },
  { text: "SYS: LOADING TOOL ARSENAL (48 WEAPONS) ...... [ OK ]", type: "ok" },
  { text: "SYS: SYNCING TRYHACKME PROFILE .............. [ OK ]", type: "ok" },
  { text: "USR: WELCOME BACK, ZIM.", type: "info" },
  { text: "USR: ACCESS GRANTED :: WELCOME TO THE DOJO.", type: "ok" },
];

// About terminal text
const ABOUT_LINES = [
  { prompt: "zim@dojo:~$", cmd: "cat profile.txt" },
  { out: ">" },
  { out: "NAME          :: MOHAMMAD ZIM" },
  { out: "HANDLE        :: MR_DESTROYER" },
  { out: "ROLE          :: OFFENSIVE_SECURITY_ENGINEER" },
  { out: "CLEARANCE     :: TOP_SECRET//NOFORN" },
  { out: "ALIAS         :: ZERO_DAY_ARCHITECT" },
  { out: ">" },
  { out: "STATS:" },
  { out: "  + 40+ OFFENSIVE TOOLS BUILT & RELEASED" },
  { out: "  + TOP-RANKED TRYHACKME USER" },
  { out: "  + RED TEAM / OFFSEC / OSINT / CVE RESEARCH" },
  { out: "  + 'YOU TURNED THE PAGE, I BURNED THE BOOK'" },
  { out: ">" },
  { prompt: "zim@dojo:~$", cmd: "chmod 777 /etc/passwd 2>/dev/null; echo $?" },
  { out: "0" },
  { prompt: "zim@dojo:~$", cmd: "whoami" },
  { out: "root" },
];

// Typing lines for hero
const TYPING_LINES = [
  "> offensive_security_engineer",
  "> zero-day_architect & exploit_smith",
  "> top-ranked tryhackme user",
  "> 40+ open source hacking tools",
  "> turning vulnerabilities into masterpieces",
];

// TryHackMe badges
const THM_BADGES = [
  { icon: "🛡️", name: "Pre Security" },
  { icon: "🌱", name: "Complete Beginner" },
  { icon: "🌐", name: "Web Fundamentals" },
  { icon: "💻", name: "Intro to Cyber Sec" },
  { icon: "🗡️", name: "Jr. Pentester" },
  { icon: "🎄", name: "Advent of Cyber" },
  { icon: "🔥", name: "Red Teamer" },
  { icon: "💥", name: "Offensive Pentest" },
];
