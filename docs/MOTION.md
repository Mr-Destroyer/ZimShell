# NIGHTFALL — Motion & Feature Register

100 additions to the base build. House rules, enforced on every item:

- **GPU-cheap only** — `transform`, `opacity`, `stroke-dashoffset`, `filter`.
  No animated `width`/`height`/`top`/`left`/`margin`.
- **One entrance style per element type** (§5). Repeated elements reuse one
  vocabulary rather than each inventing its own.
- **Glitch is a hover or reveal accent, never ambient** (§5).
- **Scroll-scrubbed beats autoplay** (§5).
- **Every animation declares its reduced-motion fallback** in an inline
  comment at the rule (§5). The `RM:` column below is the summary of that.
- **No fourth typeface, no new palette entries** (§2). Existing tokens only.
- **CSP-safe** — `style-src` has no `'unsafe-inline'`, so generated markup must
  never contain a `style="…"` attribute (`style-src-attr` blocks it).
  Per-element variation is applied through CSSOM `setProperty()` onto a custom
  property, which is a different mechanism and is permitted.
- **`body.perf`** kills every canvas loop; **`body.reduced`** replaces motion
  with the stated static state.

---

### 01 · BOOT & LOADER

| # | Feature | RM: |
|---|---|---|
| 1 | CRT power-on — loader opens as a 2px line expanding via `scaleY`, white flash | instant |
| 2 | Boot-log per-char typing, variable latency (2–14ms, longer after punctuation) | full text |
| 3 | Boot bar with ember sparks trailing the fill edge | static bar |
| 4 | `ACCESS GRANTED` stamp thunk — scale 1.6→1, rotate −8°→−3° | static |
| 5 | Completion glitch flash — 3-frame RGB-split before fade | plain fade |
| 6 | Single bright scanline sweeps the loader once | none |
| 7 | Hex-dump column scrolling beside the boot log | none |
| 8 | Boot checklist ticks pop in staggered | all ticks shown |
| 9 | Loader exit — `clip-path` inset collapse from bottom (curtain up) | instant hide |
| 10 | Return-visitor fast path (<2s) — skips typing, 400ms glitch flash only | instant |

### 02 · HERO

| # | Feature | RM: |
|---|---|---|
| 11 | Title one-time RGB-split reveal, staggered per line | plain fade-up |
| 12 | Blood drip — one droplet forms at the baseline and falls, ≤1 per 30s | none |
| 13 | Portrait breathing — `scale` 1.0↔1.008, 6s | none |
| 14 | Portrait scanline overlay drifting slowly | static overlay |
| 15 | Fog parallax — canvas fog shifts at 0.3× scroll | static |
| 16 | Ember field — 24 rising embers with sine sway (canvas) | static |
| 17 | Vignette breathe — radial opacity 0.55↔0.75, 8s | static |
| 18 | Magnetic nav links (extend magnetic buttons to nav) | none |
| 19 | Bat flyby with wing-flap keyframe | none |
| 20 | Glow pulse on a 4s double-beat heartbeat | static glow |

### 03 · NAV & CHROME

| # | Feature | RM: |
|---|---|---|
| 21 | Active-link underline slides between items (FLIP) | instant move |
| 22 | Nav shrink + backdrop-blur past 80px | instant |
| 23 | Section counter `03/09` ticking with scroll | static |
| 24 | Minimap tick hover → section-name tooltip | tooltip on focus |
| 25 | Minimap active tick elongates + glows | static |
| 26 | Back-to-top ring — SVG `stroke-dashoffset` tracks progress | static ring |
| 27 | Mobile menu stagger, 40ms apart | instant |
| 28 | Nav link hover RGB-split (hover accent — permitted) | colour only |
| 29 | Status dot ping ring | static dot |
| 30 | Hamburger → X two-bar rotate morph | instant |

### 04 · SCROLL & TRANSITION

| # | Feature | RM: |
|---|---|---|
| 31 | Divider ember trail spawning along section dividers | none |
| 32 | Scroll-velocity glitch — fast scroll briefly raises glitch intensity | none |
| 33 | Sticky section eyebrow pins while its section scrolls | static |
| 34 | Section entrance — eyebrow slides left, title up, body staggers | all visible |
| 35 | Card parallax depth, 0.06× | none |
| 36 | Scanline density grows with page depth | static |
| 37 | Reveal variants — fade-up / wipe-right (lists) / scale-in (cards) | all visible |
| 38 | Anchor scroll with landing highlight flash | instant jump |
| 39 | Nav moon icon rotates through phases with scroll | static |
| 40 | Section stamp presses in at 40% viewport | static |

### 05 · CONSTELLATION (signature piece)

| # | Feature | RM: |
|---|---|---|
| 41 | Edge draw-in via `stroke-dashoffset` on entry | edges drawn |
| 42 | Pulse travels an edge on node select | none |
| 43 | Node hover — scale 1.35 + glow ring | colour only |
| 44 | Idle drift — whole graph rotates 0.4°/s | static |
| 45 | Radial arc per node showing level 0–100 | arc filled |
| 46 | Selecting a node dims unconnected nodes to 0.25 | static |
| 47 | Boot sequence — nodes pop in staggered 60ms | all shown |
| 48 | Focus-ring pulse for keyboard nav | static ring |
| 49 | Starfield backdrop — 60 dots, varied opacity | static |
| 50 | Readout values type in per-char | instant text |

### 06 · DOSSIER & REDACTION

| # | Feature | RM: |
|---|---|---|
| 51 | Stamp thunk with ink bleed (blur→sharp) | static |
| 52 | Redaction bars staggered wipe-reveal, 60ms apart | all revealed |
| 53 | Dossier metadata typewriter | instant |
| 54 | File number scramble-decode over 800ms | final value |
| 55 | Paper grain overlay on the dossier card | none |
| 56 | Light sweep passes over bars on hover | none |
| 57 | Corner fold triangle on the top-right | static |
| 58 | `CLASSIFIED` watermark parallaxing behind the bio | static |
| 59 | Bio reveal via declassify mask wipe | visible |
| 60 | Dossier border draws itself on entry | border shown |

### 07 · PROJECTS

| # | Feature | RM: |
|---|---|---|
| 61 | Modal open — scale 0.96→1 + backdrop blur-in | instant |
| 62 | Modal content stagger reveal | instant |
| 63 | Card 3D tilt on pointer move (±4°) | none |
| 64 | Corner brackets draw in on hover, 80ms stagger | none |
| 65 | GH strip flash when live values land | none |
| 66 | Filter FLIP — cards animate to new positions | instant |
| 67 | Archive row hover — crimson bleed + name shift | colour only |
| 68 | Card icon glitch on hover, 2 frames | none |
| 69 | Modal scroll progress bar | static |
| 70 | Modal close reverses the open | instant |

### 08 · RECON FEED

| # | Feature | RM: |
|---|---|---|
| 71 | Detail text types in per-char | instant |
| 72 | Newest row glitch flash on insert | none |
| 73 | Row age decay — older rows dim progressively | uniform |
| 74 | Live dot blink with occasional double-blink | static dot |
| 75 | Row hover cross-highlights its repo card | colour only |
| 76 | Event badge pop-in with scale bounce | instant |
| 77 | Feed scanline overlay drifting | static |
| 78 | New rows slide down from −8px + fade | instant |
| 79 | Last-sync timestamp counting up | static |
| 80 | Feed fade-in on empty→populated | instant |

### 09 · TERMINAL

| # | Feature | RM: |
|---|---|---|
| 81 | Per-char output latency with punctuation pauses | instant |
| 82 | Boot sequence on first open (banner + prompt) | instant |
| 83 | Crimson `visitor@nightfall:~$` prompt echo | static |
| 84 | CRT flicker — subtle brightness oscillation | none |
| 85 | 3-bar visual equalizer while "processing" | static |
| 86 | Matrix rain with 3 depth layers | none |
| 87 | History navigation with ghost preview | instant |
| 88 | Tab-completion dropdown of matches | instant |
| 89 | Window chrome — title bar, dots, label | static |
| 90 | `exit` → `connection closed` glitch | plain text |

### 10 · AMBIENCE, A11Y & SYSTEM

| # | Feature | RM: |
|---|---|---|
| 91 | Global scanline overlay, 3px repeat, 4% | none |
| 92 | Film grain via SVG `feTurbulence`, 3% | none |
| 93 | Cursor trail — 3 ghost rings lagging behind | none |
| 94 | Blood-Moon cross-fade, 600ms across all tokens | instant |
| 95 | Performance mode audit — enforce canvas/grain/trail kill | n/a |
| 96 | Reduced-motion audit — verify every new rule has a fallback | n/a |
| 97 | Unified `:focus-visible` crimson ring everywhere | n/a |
| 98 | Skip-link verified untouched (`top:-60px` until `:focus`) | n/a |
| 99 | Konami code — full blood-moon takeover + bat frenzy | n/a |
| 100 | Console banner — styled view-source pledge, no trackers | n/a |

---

**Explicitly out of scope** (would fight the tone or the constraints):
audio of any kind, WebGL, a build step, any new dependency, any network call
beyond the existing GitHub pair, and any animation that implies the terminal
touches a real system.
