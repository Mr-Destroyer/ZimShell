## NIGHTFALL PROTOCOL — Vampire-Gothic Security Portfolio

Cinematic single-page portfolio for an ethical hacker / security researcher.
Pure HTML + CSS + vanilla JS. No frameworks, no trackers, no Sentry.

### Structure
- `index.html` — all 12 sections (loader, nav, hero, about, skills, projects, methodology, experience, certs, terminal, contact, footer)
- `css/style.css` — gothic theme, CSS-variable tokens, Blood-Moon theme, performance mode, responsive breakpoints
- `js/data.js` — **ALL editable content lives here** (profile, skills, projects, certs, terminal commands)
- `js/main.js` — loader, scroll FX, filters, modal, demo terminal, counters, theme/perf toggles, form validation
- `assets/` — `elias.gif` (the ORIGINAL 800×450 · 47-frame · 10 fps animated GIF, byte-identical to the master at repo root — plays natively in plain `<img>` tags, **animates unconditionally**, `object-fit:contain`, nothing crops it), `elias-poster.jpg` static frame (load-error fallback + `og:image` only — the portrait is never downgraded to it), and `elias-motion.webm/.mp4` — identical muted looping videos that JS swaps in automatically if any browser ever fails to animate the GIF (motion watchdog in `main.js`).

### Editing
1. Replace every `[YOUR ...]` placeholder in `js/data.js` (name, email, location, resume URL, cert issuers).
2. Swap the avatar by editing `PROFILE.avatar` in `js/data.js` (any GIF URL — animation plays everywhere, and containers never crop the frame).
3. Toggle **Blood-Moon theme**, **performance mode**, and **reduced motion** from the nav; choices persist.

### Run locally
```
python3 -m http.server 8000
# open http://localhost:8000
```

The terminal is decorative — it executes nothing. The contact form validates locally and sends nothing.
