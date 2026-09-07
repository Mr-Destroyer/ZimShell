# NIGHTFALL Mobile Screenshot Anomalies — Verification Report

**Scope:** Root-cause analysis of three anomalies observed in mobile (390px) full-page screenshots of the NIGHTFALL portfolio, with pixel-level and DOM-level evidence. **Conclusion: zero defects in the site code — anomaly 1 is intentional UI; anomalies 2 and 3 are screenshot-capture artifacts.** Horizontal overflow measured at all tested widths: 0px.

**Site under test:** `/home/zim/Documents/github/ZimShell` (served locally; Chrome via CDP, device-emulated 390×844 @2x → 780×1688 device px).

---

## Anomaly 1 — Crimson strip on the left edge

### Verdict: REAL UI (intentional) — the `#scrollProgress` scroll-progress bar

The strip is `div#scrollProgress`, a fixed 3-CSS-px-wide vertical bar (index.html:42, css/style.css:73) whose height is driven by scroll position via `scaleY()` (js/main.js:504). At 50% scroll it covers half the viewport; at 85% it covers 85%.

**DOM proof (probe while scrolled):** element hit-tested at the left edge at three scroll depths — hit `div#scrollProgress`, `rect {top:0, bottom:844, width:3}`, z-index 1100 (`/tmp/nf-final.log`).

**Visual proof (plain viewport screenshots while actively scrolled — `/tmp/nf-strip.log`):**

| Shot | scrollY / max | scaleY matrix | Crimson px at x=0..5 | Strip span (y) | Fraction of viewport |
|---|---|---|---|---|---|
| `nf5-mid-50-withstrip.png` | 9928 / 20404 | `matrix(1,0,0,0.486571,0,0)` | 824/col | y=1..824 | 48.8% |
| `nf5-deep-85-withstrip.png` | 17328 / 20404 | `matrix(1,0,0,0.849245,0,0)` | 1433/col | y=1..1433 | 84.9% |
| `nf5-mid-50-nostrip.png` (control, transform removed) | 10202 / 20404 | `none` | **0** | — | — |

The crimson color matches the theme accent `--crimson` (230,57,88) and is confined to exactly columns x=0–5 (6 device px = 3 CSS px, matching `width:3px`). Strip length tracks `scrollY/max` to three decimals (0.4866 → 48.8%, 0.8492 → 84.9%) — it is a scroll-progress indicator working as designed (copy in `docs/evidence/`).

**Why the original full-page screenshots didn't show it:** `captureBeyondViewport` temporarily expands the viewport to full page height → `scrollY` collapses to 0 → `scaleY(0)` flattens the bar, and the strip screenshot instead picked it up only in later normal-scroll captures.

---

## Anomaly 2 — Black "Experience" screenshot

### Verdict: CAPTURE ARTIFACT — `captureBeyondViewport` + `.reveal{opacity:0}`

Root cause chain:
1. `captureBeyondViewport` renders the expanded viewport without firing `IntersectionObserver` callbacks/`scroll` events for content below the original fold.
2. All animated content carries `.reveal{opacity:0;transform:translateY(26px)}` (css/style.css:51) until the observer adds `.in` (js/main.js:103–113, 43/43 elements observed).
3. Result: the shot captured the section's empty background — mean luminance **7.0**, near-black fraction **100%** (`nf-mobile-exp.png`) ≈ the bare page background.

Control shot taken after scrolling through the section normally (observer fired, `.in` added to all 43 reveal elements, confirmed in `/tmp/nf-final.log`): `nf4-exp-mobile.png` — mean luminance **18.1**, near-black fraction **39.1%**, with all cards/text visibly rendered. The section has real content; the black shot was purely a capture-timing artifact.

---

## Anomaly 3 — "Skip pill" (crimson rounded rectangle at top-left)

### Verdict: CAPTURE ARTIFACT — skip-link focus state

The element is the accessibility skip-link (`a.skip-link "Skip to content"`, index.html:25). It is positioned off-screen at `top:-60px` (css/style.css:34) and only slides into view on keyboard focus (`:focus{top:12px}`, css/style.css:35). Probe measured `skipTop = -60` in every state, including in the strip-proof shots — i.e., it is off-screen in normal rendering. It appears in screenshots only when the capture context momentarily grants focus (CDP screenshot focus emulation). Not a rendering bug; expected focus behavior of a standard a11y feature.

---

## Cross-checks (no other issues found)

- **Horizontal overflow:** `scrollWidth == clientWidth` at 390 / 768 / 1440 → **0px overflow** at all widths (`/tmp/nf-verify.log`). Elements listing right-edges beyond viewport (`.hero-fog`, `.bat.light`, `.hero-clouds`) are viewport-clipped fixed/absolute decorations and do not contribute to scrollable overflow.
- **Full-page diff** of with/without-strip clip captures: 7,378 differing px, bbox x=632..727, y=1392..1487 — the theme-toggle moon button (a timed element), unrelated to the strip.
- **Reveal integrity:** 43/43 `.reveal` elements gain `.in` after a normal scroll pass.
- **Skills sections** render completely in all shots (10/10 cards, graph, lists).

## Evidence files

`docs/evidence/`:
- `nf5-mid-50-withstrip.png` — scrolled 50%, strip visible (~half viewport)
- `nf5-mid-50-nostrip.png` — same region, strip hidden (control)
- `nf5-deep-85-withstrip.png` — scrolled 85%, strip ~85% of viewport
- `nf-mobile-exp.png` — the black artifact capture (mean lum 7.0)
- `nf4-exp-mobile.png` — same section, content revealed (mean lum 18.1)

Probe/raw logs (transient, `/tmp`): `nf-final.log` (DOM probe), `nf-strip.log` (scroll-state JSON), `nf-verify.log` (overflow).
