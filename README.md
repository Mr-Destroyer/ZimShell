## NIGHTFALL PROTOCOL — Vampire-Gothic Security Portfolio

Cinematic single-page portfolio for an ethical hacker / security researcher.
Pure HTML + CSS + vanilla JS. No frameworks, no trackers, no Sentry.

### Structure
- `index.html` — all 12 sections (loader, nav, hero, about, skills, projects, methodology, experience, certs, terminal, contact, footer)
- `css/style.css` — gothic theme, CSS-variable tokens, Blood-Moon theme, performance mode, responsive breakpoints
- `js/data.js` — **ALL editable content lives here** (profile, skills, projects, certs, terminal commands, GitHub/dossier/availability config)
- `js/main.js` — loader, scroll FX, filters, modal, demo terminal, counters, theme/perf toggles, form validation, GitHub widgets
- `assets/` — `elias.gif` (the ORIGINAL 800×450 · 47-frame · 10 fps animated GIF, byte-identical to the master at repo root — plays natively in plain `<img>` tags, **animates unconditionally**, `object-fit:contain`, nothing crops it), `elias-poster.jpg` static frame (load-error fallback + `og:image` only — the portrait is never downgraded to it), and `elias-motion.webm/.mp4` — identical muted looping videos that JS swaps in automatically if any browser ever fails to animate the GIF (motion watchdog in `main.js`).

### Security posture
The page ships a real Content-Security-Policy in a `<meta http-equiv>` tag (see `index.html`),
with a comment justifying each directive. It is deliberately strict — no `'unsafe-inline'` for
scripts, no wildcard sources, `object-src 'none'`, `form-action 'none'`. There are **zero inline
event handlers** in the markup; the portrait fallbacks are bound in JS instead. Compliance is
verifiable by listening for `securitypolicyviolation` while scrolling the whole page (currently 0
violations). Note that a meta-tag CSP cannot express `frame-ancestors`, `report-uri`, or `sandbox`
— those need a real HTTP header, which is a server-config concern, not a markup one.

### Live GitHub data (optional)
The project cards and the recon feed are enriched at runtime from the **public, unauthenticated**
GitHub API — two requests total, never one per card.

- Configure it in `js/data.js` → `GITHUB` (`user`, `ttlHours`, `enabled`). Set `enabled: false` to
  disable every client-side call and run purely on the hardcoded `PROJECTS[]` values.
- Responses are cached in `localStorage` under `nf_gh_cache` with a TTL. A fresh cache means **no
  network request at all**; a stale one is rendered immediately and refreshed in the background, so
  the page never blocks on the network.
- Failure is **silent on every path** — offline, CORS, rate-limited (HTTP 403), non-200, malformed
  JSON, or `localStorage` disabled all leave the hardcoded values on screen and show the visitor
  nothing. Verified against a genuine exhausted rate limit, not just a mock.
- Repo names are derived from each project's `url` (last path segment), because the repo name and
  the display name differ (`CredStalker-` vs `CredStalker`).

### Editing
1. Replace every `[YOUR ...]` placeholder in `js/data.js` (name, email, location, resume URL, cert issuers).
2. Swap the avatar by editing `PROFILE.avatar` in `js/data.js` (any GIF URL — animation plays everywhere, and containers never crop the frame).
3. Toggle **Blood-Moon theme**, **performance mode**, and **reduced motion** from the nav; choices persist.
4. Update the availability badge via `AVAILABILITY` and the case-file header via `DOSSIER` in `js/data.js` — both are manually set, never inferred from the network.
5. TryHackMe badges in `THM_BADGES` are **manually transcribed**: TryHackMe exposes no CORS-enabled public profile endpoint, so a live fetch would require a proxy backend, which this project deliberately does not have.

### Run locally
```
python3 -m http.server 8000
# open http://localhost:8000
```

The terminal is decorative — it executes nothing. The contact form validates locally and sends nothing.
