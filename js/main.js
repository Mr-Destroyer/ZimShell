/* =========================================================
   NIGHTFALL PROTOCOL — main.js
   Vanilla JS. No dependencies. Decorative effects only.
   ========================================================= */
(() => {
  'use strict';
  /* JS is running: flip the class the CSS no-JS fallback keys off of
     (html:not(.js) shows all .reveal content unprompted). Set before
     any observer so there is no flash of unhidden content. */
  document.documentElement.classList.add('js');
  const D = window.NF_DATA || {};
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  /* Clipboard with a legacy fallback. navigator.clipboard needs a secure
     context (https or localhost); file:// and plain http lose it, so the
     textarea+execCommand path keeps the copy button working everywhere
     the site itself works. Returns a boolean instead of throwing — the
     button renders its own failure state. */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        return ok;
      } catch { return false; }
    }
  }

  const state = {
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    perf: false,
    filter: 'all'
  };

  const store = {
    get(k, fb) { try { const v = localStorage.getItem('nf_' + k); return v === null ? fb : JSON.parse(v); } catch { return fb; } },
    set(k, v) { try { localStorage.setItem('nf_' + k, JSON.stringify(v)); } catch {} }
  };

  /* ---------- Loading screen / boot sequence ----------
     §3.1 — the boot plays once per SESSION, not once ever.

     The old code stored `skipIntro` in localStorage, which meant a
     returning visitor never saw the boot again for the life of the
     browser profile. A visitor who reloads mid-read should not sit
     through the intro twice; a visitor who comes back tomorrow
     should still get the full entrance. sessionStorage is the right
     scope, so that is what this uses now.

     Reduced motion → boot is skipped entirely and the hero appears
     immediately (no typewriter, no flash). That is the documented
     fallback and it is deliberate, not an oversight.
     ------------------------------------------------------------ */
  function initLoader() {
    const loader = $('#loader');
    if (!loader) return finishLoader();
    if (state.reduced) return finishLoader();
    /* sessionStorage, not localStorage — full boot once per session */
    let seen = false;
    try { seen = sessionStorage.getItem('nf_booted') === '1'; } catch {}
    /* 10. Return-visitor fast path. A visitor reloading inside the same
       session has already watched the boot, so they get a short glitch
       flash instead of the full typewriter — well under 2s. Previously
       this skipped the loader outright, which lost the transition beat
       and made a reload feel like a hard cut. RM: reduced motion
       returned above, so this path never runs for those visitors. */
    if (seen) {
      const flash = document.createElement('div');
      flash.className = 'loader-flash';
      loader.appendChild(flash);
      requestAnimationFrame(() => flash.classList.add('go'));
      return setTimeout(finishLoader, 400);
    }
    try { sessionStorage.setItem('nf_booted', '1'); } catch {}

    const lines = $('#loaderLines'), bar = $('#loaderBar'), skip = $('#skipIntro');
    const seq = D.BOOT_LINES || [];
    let done = false, i = 0;
    const finish = () => { if (done) return; done = true; finishLoader(); };

    /* 6. One bright scanline sweeps the loader. RM: CSS hides it. */
    if (!state.reduced) {
      const sweep = document.createElement('div');
      sweep.className = 'loader-sweep';
      sweep.setAttribute('aria-hidden', 'true');
      loader.appendChild(sweep);
      setTimeout(() => sweep.remove(), 2200);
    }
    /* 7 + 8 — the hex column and the checklist. */
    initLoaderHex();
    spawnBootChecks();

    /* 2. Per-character typing with variable latency, replacing the old
       fixed 380ms-per-line beat. Two things make it read as a real
       terminal rather than a metronome:
         · per-char delay jitters between 8 and 22ms
         · punctuation adds a pause, because a shell does not print a
           full stop any faster than a letter
       RM: the whole line is written at once instead. */
    const typeLine = (div, text, onDone) => {
      if (state.reduced) { div.textContent = '> ' + text; onDone(); return; }
      let k = 0;
      const step = () => {
        if (done) return;
        div.textContent = '> ' + text.slice(0, ++k);
        if (k >= text.length) return onDone();
        const ch = text[k - 1];
        const pause = /[.:!?]/.test(ch) ? 90 + Math.random() * 90
          : /[,;]/.test(ch) ? 40 + Math.random() * 40
            : 8 + Math.random() * 14;
        setTimeout(step, pause);
      };
      step();
    };

    const tick = () => {
      if (done) return;
      if (i < seq.length) {
        const raw = seq[i];
        const div = document.createElement('div');
        div.className = 'll' + (raw.includes('GRANTED') ? ' ok' : '');
        lines.appendChild(div);
        requestAnimationFrame(() => div.classList.add('on'));
        i++;
        typeLine(div, raw, () => {
          if (done) return;
          if (bar) bar.style.width = Math.round((i / seq.length) * 100) + '%';
          /* 3. sparks trailing the fill edge */
          spawnBarSparks(bar);
          /* 4. The GRANTED line earns a stamp, not just a colour change. */
          if (raw.includes('GRANTED') && !state.reduced && !$('.loader-stamp')) {
            const st = document.createElement('div');
            st.className = 'loader-stamp';
            st.setAttribute('aria-hidden', 'true');
            st.textContent = 'ACCESS GRANTED';
            $('.loader-terminal').appendChild(st);
          }
          /* occasional glitch-flash between lines, reusing the RGB-split
             text-shadow trick from the motif vocabulary. Fires on roughly
             one line in three so it reads as unstable signal, not as a
             broken animation. */
          if (Math.random() < 0.34) {
            div.classList.add('glitch-once');
            setTimeout(() => div.classList.remove('glitch-once'), 520);
          }
          /* a short beat between lines, so they do not run together */
          setTimeout(tick, 150 + Math.random() * 120);
        });
      } else {
        /* final beat: crimson flash to black, then reveal the hero */
        const flash = document.createElement('div');
        flash.className = 'loader-flash';
        loader.appendChild(flash);
        requestAnimationFrame(() => flash.classList.add('go'));
        setTimeout(finish, 340);
      }
    };
    skip.addEventListener('click', finish);
    setTimeout(tick, 260);
    /* Hard cap — a SAFETY NET, not the normal ending. The animation
       decides when it finishes; this only exists so a stalled timer or
       a throttled background tab can never trap a visitor behind the
       loader. It is therefore deliberately generous: the worst-case
       per-char delay is ~22ms plus a punctuation pause, so the budget
       is computed at the slow end (45ms/char) with slack on top. An
       earlier, tighter budget expired before the last line finished
       typing, set `done`, and silently swallowed the ACCESS GRANTED
       stamp with it. */
    const chars = seq.reduce((n, s) => n + s.length, 0);
    setTimeout(finish, 260 + chars * 45 + seq.length * 400 + 2500);
  }
  function finishLoader() {
    const loader = $('#loader');
    if (loader) {
      /* 9. Curtain up — the clip-path wipe replaces the plain fade when
         motion is allowed. RM: .curtain is never added, so the existing
         opacity transition on .done does the whole job. */
      if (!state.reduced) loader.classList.add('curtain');
      loader.classList.add('done');
      setTimeout(() => loader.remove(), 900);
    }
    document.body.classList.remove('no-scroll');
    /* one-time hero glitch reveal — fires when the loader clears */
    const h1 = $('.hero-title');
    if (h1 && !state.reduced) {
      h1.classList.add('glitch-once');
      setTimeout(() => h1.classList.remove('glitch-once'), 560);
    }
    /* 11. …and the RGB-split line reveal rides the same beat. */
    if (h1 && !state.reduced) {
      h1.classList.add('split-in');
      setTimeout(() => h1.classList.remove('split-in'), 1100);
    }
    /* 12/16/20 — hero ambience starts only once the loader is gone, so
       nothing animates behind a curtain the visitor cannot see. */
    initEmberField();
    initBloodDrip();
    const glow = $('#heroGlow');
    if (glow && !state.reduced && !state.perf) glow.classList.add('beating');
  }

  /* ---------- 7. Hex-dump column ----------
     A rolling column of pseudo-random hex beside the boot log. It is
     generated from Math.random(), NOT from any real data — decoration
     that reads as a memory dump. RM: never created. */
  function initLoaderHex() {
    if (state.reduced) return;
    const term = $('.loader-terminal');
    if (!term || $('.loader-hex')) return;
    const col = document.createElement('div');
    col.className = 'loader-hex';
    col.setAttribute('aria-hidden', 'true');
    term.appendChild(col);
    const hexRow = () => {
      let s = '';
      for (let i = 0; i < 4; i++) {
        s += Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0') + ' ';
      }
      return s.trim() + '\n';
    };
    /* Fill past the mask, then drop the top line each beat so the column
       appears to scroll. textContent, not innerHTML — no parse cost. */
    let buf = '';
    for (let i = 0; i < 14; i++) buf += hexRow();
    col.textContent = buf;
    const iv = setInterval(() => {
      buf = buf.split('\n').slice(1).join('\n') + '\n' + hexRow();
      col.textContent = buf;
    }, 190);
    /* The loader removes itself; stop the interval with it rather than
       leaving a timer running for the life of the page. */
    setTimeout(() => clearInterval(iv), 14000);
  }

  /* ---------- 3. Ember sparks on the boot bar ----------
     Spawned at the fill edge as the bar advances. RM: not created. */
  function spawnBarSparks(bar) {
    if (state.reduced || !bar) return;
    const fill = $('#loaderBar');
    if (!fill) return;
    const pct = parseFloat(fill.style.width) || 0;
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('span');
      s.className = 'bar-spark';
      /* CSSOM custom property, not a style attribute — CSP permits this
         (style-src-attr governs attributes; setProperty does not). */
      s.style.setProperty('--sx', (Math.random() * 22 - 11).toFixed(1) + 'px');
      s.style.left = pct + '%';
      s.style.animationDelay = (i * 70) + 'ms';
      bar.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }
  }

  /* ---------- 8. Boot checklist ----------
     A short fixed list appended under the boot log. RM: all ticks render
     at once, no pop. */
  function spawnBootChecks() {
    const term = $('.loader-terminal');
    if (!term || $('.loader-check')) return;
    const items = ['KERNEL', 'INTERFACE', 'TELEMETRY'];
    const box = document.createElement('div');
    box.setAttribute('aria-hidden', 'true');
    items.forEach((label, i) => {
      const row = document.createElement('div');
      row.className = 'loader-check';
      row.style.animationDelay = state.reduced ? '0ms' : (i * 110 + 'ms');
      row.innerHTML = '<b>✓</b><span>' + esc(label) + ' ONLINE</span>';
      box.appendChild(row);
    });
    term.appendChild(box);
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    const nav = $('#navbar'), burger = $('#hamburger'), menu = $('#mobileMenu');
    addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 24), { passive: true });
    const closeMenu = () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('a', menu).forEach(a => a.addEventListener('click', closeMenu));
    const links = $$('.nav-link');
    const sections = ['home', 'about', 'skills', 'projects', 'methodology', 'experience', 'ethics', 'contact']
      .map(id => document.getElementById(id)).filter(Boolean);
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        /* Every matching link gets the state, so the mobile menu's copy
           highlights too. But the shared underline can only sit on a
           link that is actually laid out: `.nav-links` is display:none
           below 860px and `.mobile-menu` is display:none above it, so
           picking the LAST match (which is what this did) always chose
           the hidden mobile copy, whose offsetParent is null — and
           moveInd then correctly hid the indicator, on every viewport.
           Prefer the first *visible* match instead. */
        let active = null;
        links.forEach(l => {
          const on = l.getAttribute('href') === '#' + e.target.id;
          l.classList.toggle('is-active', on);
          if (on && !active && l.offsetParent) active = l;
        });
        /* 21. slide the shared underline to whichever link won */
        nav._moveInd && nav._moveInd(active);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => spy.observe(s));

    /* 38. Anchor landing flash. The section briefly lifts its own
       background so the eye can find where it arrived. RM: no flash. */
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => {
        const id = a.getAttribute('href').slice(1);
        const sec = id && document.getElementById(id);
        if (!sec || state.reduced) return;
        sec.classList.remove('landed');
        /* force a reflow so the animation restarts on repeat clicks */
        void sec.offsetWidth;
        sec.classList.add('landed');
        setTimeout(() => sec.classList.remove('landed'), 950);
      });
    });
  }

  /* ---------- Theme / perf / motion toggles ---------- */
  function initToggles() {
    const themeBtn = $('#themeBtn'), perfBtn = $('#perfBtn'), motionBtn = $('#motionBtn');
    const setPressed = (btn, on) => btn && btn.setAttribute('aria-pressed', String(on));
    if (store.get('bloodMoon', false)) { document.body.classList.add('blood-moon'); setPressed(themeBtn, true); }
    themeBtn && themeBtn.addEventListener('click', () => {
      const on = document.body.classList.toggle('blood-moon');
      store.set('bloodMoon', on); setPressed(themeBtn, on);
      /* §4.1 — one-shot full-screen pulse: the theme change cross-fades
         through a crimson breath instead of snapping. The class is
         removed on animationend (and on a timer as a belt-and-braces
         fallback in case animationend never fires). Reduced/perf skip
         the pulse — the class swap alone is the reduced-motion
         fallback. */
      if (state.reduced || state.perf) return;
      document.body.classList.remove('theme-pulse');
      void document.body.offsetWidth; /* restart the animation */
      document.body.classList.add('theme-pulse');
      const clear = () => document.body.classList.remove('theme-pulse');
      document.body.addEventListener('animationend', clear, { once: true });
      setTimeout(clear, 1200);
    });
    state.perf = store.get('perf', false);
    if (state.perf) { document.body.classList.add('perf'); setPressed(perfBtn, true); }
    perfBtn && perfBtn.addEventListener('click', () => {
      state.perf = document.body.classList.toggle('perf');
      store.set('perf', state.perf); setPressed(perfBtn, state.perf);
    });
    const applyReduced = (on) => {
      state.reduced = on;
      document.body.classList.toggle('reduced', on);
      setPressed(motionBtn, on);
    };
    if (store.get('reduced', state.reduced)) applyReduced(true);
    motionBtn && motionBtn.addEventListener('click', () => applyReduced(!state.reduced));
    /* OS-level reduced motion. The @media block in style.css already
       neutralises animations without JS, but the class-gated rules
       (`body.reduced .redact-bar`, `.glitch-once`, `.loader-flash`)
       only match when the class is present — so mirror the media query
       onto the body. This keeps the CSS and the JS state agreeing on
       what "reduced" means instead of each having its own idea.
       A live listener is attached too: the OS setting can change while
       the page is open, and the visitor should not have to reload. */
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', e => {
      if (store.get('reduced', null) === null) applyReduced(e.matches);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach((e, idx) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        setTimeout(() => el.classList.add('in'), state.reduced ? 0 : Math.min(idx * 70, 350));
        io.unobserve(el);
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(el => io.observe(el));
  }

  /* ---------- About: facts / principles / vials ---------- */
  function renderAbout() {
    const fg = $('#factsGrid');
    if (fg && D.PROFILE) fg.innerHTML = D.PROFILE.facts.map(f =>
      `<li><span class="f-label">${esc(f.label)}</span><span class="f-value">${esc(f.value)}</span></li>`).join('');
    const cp = $('#corePrinciples');
    if (cp && D.PROFILE) cp.innerHTML = D.PROFILE.principles.map(p =>
      `<div class="principle"><span class="p-icon" aria-hidden="true">${p.icon}</span><span><b>${esc(p.title)}</b><p>${esc(p.text)}</p></span></div>`).join('');
    const v = $('#vials');
    if (v && D.PROFILE) {
      D.PROFILE.vials.forEach(x => {
        const row = document.createElement('div');
        row.className = 'vial-row';
        row.innerHTML = `<span class="vial-label">${esc(x.label)}</span><span class="vial-track"><span class="vial-fill" data-v="${x.value}"></span></span><span class="vial-val">${x.value}%</span>`;
        v.appendChild(row);
      });
      const vio = new IntersectionObserver(es => {
        if (es[0].isIntersecting) {
          $$('.vial-fill', v).forEach((f, i) => setTimeout(() => { f.style.width = f.dataset.v + '%'; }, state.reduced ? 0 : i * 140));
          vio.disconnect();
        }
      }, { threshold: 0.4 });
      vio.observe(v);
    }
  }

  /* ---------- About: dossier bio redaction (§3.4) ----------
     The bio paragraph is covered by three redaction bars (top / middle
     / bottom thirds) that slide away in sequence when the section
     enters view — the CLASSIFIED dossier reading itself. The bars are
     added by JS only, so a no-JS visit simply sees the text. Reduced
     motion → CSS removes the bars outright (body.reduced .redact-bar),
     the bio is just visible. */
  function initBioRedaction() {
    const bio = $('#aboutBio');
    if (!bio || state.reduced) return;
    bio.classList.add('redact');
    /* 52. Three bars, wiped top-to-bottom 60ms apart. The delay is a
       custom property rather than an inline transition-delay so the
       stagger lives with the rest of the motion rules in the CSS. */
    [[0, 36], [32, 36], [64, 36]].forEach(([top, h], i) => {
      const bar = document.createElement('span');
      bar.className = 'redact-bar';
      bar.setAttribute('aria-hidden', 'true');
      bar.style.top = top + '%';
      bar.style.height = h + '%';
      bar.style.setProperty('--bar-delay', (i * 0.06) + 's');
      bio.appendChild(bar);
    });
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      bio.classList.add('in');
      io.disconnect();
    }, { threshold: 0.35 });
    io.observe(bio);

    /* 58. CLASSIFIED watermark behind the bio copy, parallaxed from the
       scroll rAF (see initScrollFX). Decorative only — aria-hidden, so
       it is never announced. RM: never created. Perf: hidden by CSS,
       and not created either. */
    const copy = bio.parentElement;
    if (!copy || state.perf || copy.querySelector('.classified-mark')) return;
    const mark = document.createElement('span');
    mark.className = 'classified-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = 'CLASSIFIED';
    copy.insertBefore(mark, copy.firstChild);
  }

  /* ---------- Skills ---------- */
  function renderSkills() {
    const wrap = $('#skillCards');
    if (!wrap || !D.SKILLS) return;
    wrap.innerHTML = D.SKILLS.map((s, i) => `
      <div class="skill-card reveal" tabindex="0" role="button" aria-expanded="false" data-i="${i}">
        <div class="skill-head"><span class="skill-icon" aria-hidden="true">${s.icon}</span><span class="skill-name">${esc(s.name)}</span></div>
        <p class="skill-desc">${esc(s.desc)}</p>
        <div class="skill-bar"><div class="skill-bar-fill" data-v="${s.level}"></div></div>
        <div class="skill-meta"><span>EXPERIENCE</span><span>${s.level}%</span></div>
        <div class="skill-tools">${s.tools.map(t => `<span>${esc(t)}</span>`).join('')}</div>
      </div>`).join('');
    $$('.skill-card', wrap).forEach(card => {
      const toggle = () => {
        const open = card.classList.toggle('open');
        card.setAttribute('aria-expanded', String(open));
      };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    });
    const bio = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      $$('.skill-bar-fill', wrap).forEach((f, i) => setTimeout(() => { f.style.width = f.dataset.v + '%'; }, state.reduced ? 0 : i * 90));
      bio.disconnect();
    }, { threshold: 0.2 });
    bio.observe(wrap);
  }

  /* ---------- Skill constellation (signature widget) ----------
     A real interactive graph rendered as SVG.

     Why SVG and not canvas: nodes must be focusable for keyboard and
     screen-reader users. Canvas gives no DOM to focus. SVG costs a
     little more in layout but buys real accessibility — the right
     trade for a portfolio whose whole argument is "I build properly".

     Layout: nodes sit on a ring at alternating radius so edges cross
     visibly instead of collapsing into a circle. Radius encodes skill
     level (≈9px → ≈15px in a 100×100 viewBox).

     Motion budget (§5):
       · draw-in on first view — stroke-dashoffset, transform-free
       · a signal dot walks the edges, purely decorative
       · reduced motion → both skipped, graph renders final state
       · perf mode → glow filters and signal dot dropped
     ------------------------------------------------------------ */
  function renderConstellation() {
    const box = $('#constellation');
    if (!box || !D.SKILLS || !D.SKILLS.length) return;
    const NS = 'http://www.w3.org/2000/svg';
    const skills = D.SKILLS;
    const n = skills.length;

    /* --- de-dupe edges defensively. data.js is clean today, but a
           future edit could reintroduce [a,b] + [b,a]; the graph must
           never draw the same link twice. --- */
    const seen = new Set();
    const edges = (D.SKILL_LINKS || []).filter(([a, b]) => {
      if (a === b || a == null || b == null) return false;
      if (a < 0 || b < 0 || a >= n || b >= n) return false;
      const key = a < b ? a + '-' + b : b + '-' + a;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    /* --- geometry --- */
    const CX = 50, CY = 50;
    const pts = skills.map((_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 ? 34 : 42;      /* alternate radius to spread edges */
      return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
    });
    /* node radius from level: 80% → 9px, 100% → 15px */
    const rad = (lv) => 9 + (Math.max(0, Math.min(100, lv)) - 80) * 0.3;

    /* --- adjacency, for highlight-on-select --- */
    const adj = skills.map(() => new Set());
    edges.forEach(([a, b]) => { adj[a].add(b); adj[b].add(a); });

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    /* Structure is decorative; the readout panel below carries the real
       information for assistive tech, and the fallback list carries it
       if this script never runs. */
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');

    /* 49. Starfield backdrop. Deterministic (seeded by index, not
       Math.random) so the field is identical on every load and a
       returning visitor does not see the sky rearrange itself. */
    const stars = document.createElementNS(NS, 'g');
    stars.setAttribute('class', 'cg-stars');
    for (let i = 0; i < 60; i++) {
      const c = document.createElementNS(NS, 'circle');
      /* a cheap hash of i — spread across 0-100 without clustering */
      const hx = ((i * 37) % 97) + 1.5;
      const hy = ((i * 61) % 97) + 1.5;
      c.setAttribute('cx', hx.toFixed(2));
      c.setAttribute('cy', hy.toFixed(2));
      c.setAttribute('r', (i % 7 === 0 ? 0.42 : 0.22).toFixed(2));
      c.style.opacity = (0.12 + ((i * 13) % 40) / 100).toFixed(2);
      c.style.animationDelay = ((i * 170) % 5000) / 1000 + 's';
      stars.appendChild(c);
    }
    svg.appendChild(stars);

    /* 44. Idle drift wraps the edges+signal+nodes (NOT the starfield, so
       the sky stays put while the constellation turns) in one <g>. */
    const drift = document.createElementNS(NS, 'g');
    drift.setAttribute('class', 'cg-drift');

    /* --- edges --- */
    const edgeEls = edges.map(([a, b]) => {
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', pts[a][0]); ln.setAttribute('y1', pts[a][1]);
      ln.setAttribute('x2', pts[b][0]); ln.setAttribute('y2', pts[b][1]);
      ln.setAttribute('class', 'cg-edge');
      ln.dataset.a = a; ln.dataset.b = b;
      /* 41. draw-in: dash the full length, then retract to zero.
         Reduced motion → skipped (handled in the reveal block). */
      if (!state.reduced) {
        const len = Math.hypot(pts[b][0] - pts[a][0], pts[b][1] - pts[a][1]);
        ln.style.strokeDasharray = len;
        ln.style.strokeDashoffset = len;
      }
      drift.appendChild(ln);
      return ln;
    });

    /* --- decorative signal travelling the edges --- */
    const signal = document.createElementNS(NS, 'circle');
    signal.setAttribute('r', '1.1');
    signal.setAttribute('class', 'cg-signal');
    signal.setAttribute('cx', pts[0][0]);
    signal.setAttribute('cy', pts[0][1]);
    if (!state.reduced) drift.appendChild(signal);

    /* --- nodes --- */
    const nodeEls = [];
    const arcEls = [];
    skills.forEach((s, i) => {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'cg-node');
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-pressed', 'false');
      g.setAttribute('aria-label',
        `${s.name}. Level ${s.level} percent. Tools: ${s.tools.join(', ')}.`);
      g.dataset.i = i;

      const r = rad(s.level);

      /* 45. Level arc — one circle, dashed so only the level's fraction
         is drawn. circumference = 2*pi*r; dasharray = "level, rest".
         Cheaper and smoother than an arc path, and it animates by
         opacity alone. */
      const arc = document.createElementNS(NS, 'circle');
      const arcR = r + 1.8;
      const circ = 2 * Math.PI * arcR;
      const frac = Math.max(0, Math.min(100, s.level)) / 100;
      arc.setAttribute('cx', pts[i][0]); arc.setAttribute('cy', pts[i][1]);
      arc.setAttribute('r', arcR.toFixed(2));
      arc.setAttribute('class', 'cg-arc');
      arc.setAttribute('stroke-dasharray',
        (circ * frac).toFixed(2) + ' ' + (circ * (1 - frac)).toFixed(2));
      g.appendChild(arc);
      arcEls.push(arc);

      const ring = document.createElementNS(NS, 'circle');
      ring.setAttribute('cx', pts[i][0]); ring.setAttribute('cy', pts[i][1]);
      ring.setAttribute('r', r); ring.setAttribute('class', 'cg-node-ring');
      g.appendChild(ring);

      const foc = document.createElementNS(NS, 'circle');
      foc.setAttribute('cx', pts[i][0]); foc.setAttribute('cy', pts[i][1]);
      foc.setAttribute('r', r + 2.2); foc.setAttribute('class', 'cg-focus');
      g.appendChild(foc);

      const glyph = document.createElementNS(NS, 'text');
      glyph.setAttribute('x', pts[i][0]); glyph.setAttribute('y', pts[i][1]);
      glyph.setAttribute('class', 'cg-node-glyph');
      glyph.textContent = s.icon;
      g.appendChild(glyph);

      /* 47. boot stagger — the pop animation carries the entrance, so no
         inline opacity is set here. Under reduced motion the class is
         never added and the node is simply present. */
      if (!state.reduced) g.classList.add('cg-pop');

      drift.appendChild(g);
      nodeEls.push(g);
    });

    svg.appendChild(drift);
    box.appendChild(svg);

    /* --- readout panel: the accessible face of the graph --- */
    const readout = document.createElement('div');
    readout.className = 'cg-readout';
    readout.setAttribute('aria-live', 'polite');
    box.appendChild(readout);

    const hint = document.createElement('p');
    hint.className = 'cg-hint';
    hint.textContent = 'HOVER OR TAB THROUGH NODES — ARROW KEYS NAVIGATE';
    box.appendChild(hint);

    /* --- selection logic --- */
    let current = -1;
    /* Signal state lives here, above select(), because select() writes
       to it (item 42 traces the signal down the selected node's edge).
       Declared later it would sit in the temporal dead zone for any
       call that ran before its `let` was reached. */
    let signalRaf = null, running = false, seg = 0, t = 0;
    /* 50. Readout level counts up to its value rather than appearing
       whole. RM: written once, no counting. */
    let countRaf = null;
    function typeLevel(el, target) {
      if (state.reduced || state.perf) { el.textContent = target + '%'; return; }
      cancelAnimationFrame(countRaf);
      const dur = 420, t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        /* ease-out so it decelerates into the final value */
        const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.textContent = v + '%';
        if (p < 1) countRaf = requestAnimationFrame(step);
        else el.textContent = target + '%';
      };
      countRaf = requestAnimationFrame(step);
    }
    function select(i) {
      current = i;
      const s = skills[i];
      const conns = [...adj[i]].map(x => skills[x].name);
      readout.innerHTML = `
        <div class="cg-readout-head">
          <span class="cg-readout-icon" aria-hidden="true">${s.icon}</span>
          <span class="cg-readout-name">${esc(s.name)}</span>
          <span class="cg-readout-level">0%</span>
        </div>
        <p class="cg-readout-desc">${esc(s.desc)}</p>
        <div class="cg-readout-tools">${s.tools.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <p class="cg-readout-links">LINKED TO: <b>${conns.length ? esc(conns.join(' · ')) : 'no links'}</b></p>`;
      const lvEl = readout.querySelector('.cg-readout-level');
      if (lvEl) typeLevel(lvEl, s.level);
      /* highlight this node and its neighbours; dim everything else */
      nodeEls.forEach((el, j) => {
        const lit = j === i || adj[i].has(j);
        el.classList.toggle('is-lit', lit);
        el.classList.toggle('is-dim', !lit);
        el.setAttribute('aria-pressed', String(j === i));
      });
      edgeEls.forEach(ln => {
        const on = +ln.dataset.a === i || +ln.dataset.b === i;
        ln.classList.toggle('is-lit', on);
        ln.classList.toggle('is-dim', !on);
      });
      /* 42. Send the signal down this node's first edge, so selecting a
         node visibly propagates instead of only recolouring. */
      if (!state.reduced && !state.perf) {
        const ei = edges.findIndex(([a, b]) => a === i || b === i);
        if (ei >= 0) { seg = ei; t = 0; signal.classList.add('is-traced'); }
      }
    }
    function clear() {
      current = -1;
      nodeEls.forEach(el => {
        el.classList.remove('is-lit', 'is-dim');
        el.setAttribute('aria-pressed', 'false');
      });
      edgeEls.forEach(ln => ln.classList.remove('is-lit', 'is-dim'));
      /* 42. drop the trace emphasis and let the signal resume its walk
         from the top of the edge list */
      signal.classList.remove('is-traced');
      seg = 0; t = 0;
      /* No inline style here: `style-src` without 'unsafe-inline' blocks
         style attributes, so the zero margin is a class instead. */
      readout.innerHTML = `<p class="cg-readout-desc cg-readout-idle">Select a node to inspect a discipline — its level, tooling, and what it connects to.</p>`;
    }
    clear();

    /* pointer */
    nodeEls.forEach((el, i) => {
      el.addEventListener('mouseenter', () => select(i));
      el.addEventListener('focus', () => select(i));
      el.addEventListener('click', () => select(i));
    });
    box.addEventListener('mouseleave', () => { if (current === -1) return; clear(); });

    /* keyboard: arrow keys walk the ring, Home/End jump, Escape clears */
    svg.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Escape'].includes(e.key)) return;
      e.preventDefault();
      if (e.key === 'Escape') { clear(); return; }
      let next;
      if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = n - 1;
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = current < 0 ? 0 : (current + 1) % n;
      else next = current < 0 ? n - 1 : (current - 1 + n) % n;
      nodeEls[next].focus();
      select(next);
    });

    /* --- 41/47 entrance: reveal when scrolled into view ---
       Reduced motion → the dash was never set and .cg-pop was never
       added, so the graph is already fully drawn; nothing to do. */
    if (state.reduced) {
      edgeEls.forEach(ln => { ln.style.strokeDashoffset = 0; });
    } else {
      const io = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        /* edges draw first… */
        edgeEls.forEach((ln, k) => {
          ln.style.transition = `stroke-dashoffset .5s ease ${k * 0.04}s`;
          ln.style.strokeDashoffset = 0;
        });
        /* …the nodes' pop is on a CSS animation-delay, set here so the
           stagger starts when the graph is actually seen rather than at
           parse time. */
        nodeEls.forEach((el, k) => {
          el.style.animationDelay = (180 + k * 60) + 'ms';
        });
        startSignal();
      }, { threshold: 0.25 });
      io.observe(box);
    }

    /* --- signal dot: walks the edge list, pauses offscreen ---
       (state declared above, next to select(), which writes to it) */
    function startSignal() {
      if (state.reduced || state.perf || !signal.parentNode || running) return;
      running = true;
      const step = () => {
        if (!running) return;
        t += 0.012;
        if (t >= 1) { t = 0; seg = (seg + 1) % edges.length; }
        const [a, b] = edges[seg];
        signal.setAttribute('cx', pts[a][0] + (pts[b][0] - pts[a][0]) * t);
        signal.setAttribute('cy', pts[a][1] + (pts[b][1] - pts[a][1]) * t);
        signalRaf = requestAnimationFrame(step);
      };
      signalRaf = requestAnimationFrame(step);
    }
    /* pause when the graph scrolls away — no work offscreen */
    const vis = new IntersectionObserver(es => {
      es.forEach(e => {
        if (state.reduced || state.perf) return;
        if (e.isIntersecting) startSignal();
        else if (running) { running = false; cancelAnimationFrame(signalRaf); }
      });
    }, { threshold: 0 });
    vis.observe(box);

    /* the fallback list is now redundant for sighted users */
    const fb = $('#constellationFallback');
    if (fb) fb.classList.add('is-hidden');
  }

  /* ---------- Projects: featured grid + archive ---------- */
  function projectCard(p, i) {
    const cat = (D.PROJECT_CATS && D.PROJECT_CATS[p.cat]) || p.cat;
    const status = (p.status || '').toLowerCase();
    /* §3.6 — live GitHub readout. The card ships with the hardcoded
       values from PROJECTS[] already in the DOM (so it is correct with
       JS off, offline, or rate-limited) and carries data-repo so
       ghPaintRepos() can upgrade them in place when the API answers.
       The star count is duplicated as a title attribute so a screen
       reader gets the full sentence, not just "★ 12". */
    const repo = repoOf(p.url);
    return `
      <article class="project-card reveal" data-cat="${p.cat}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="${esc(p.name)} case study">
        <div class="project-thumb"><span class="pt-number">// ${String(i + 1).padStart(2, '0')}</span><span class="pt-status ${status}">${esc(p.status)}</span><span class="pt-glyph" aria-hidden="true">${p.icon}</span></div>
        ${p.fork ? `<p class="fork-flag" title="${esc(p.upstream ? 'Fork of ' + p.upstream : 'A fork, not original work')}"><span aria-hidden="true">⑂</span> FORK${p.upstream ? ' — ' + esc(p.upstream) : ''}</p>` : ''}
        <div class="project-body">
          <p class="project-cat">${esc(cat)}</p>
          <h3 class="project-name">${esc(p.name)}</h3>
          <p class="project-tagline">${esc(p.tagline)}</p>
          <p class="project-desc">${esc(p.desc)}</p>
          <p class="gh-strip mono" data-repo="${esc(repo)}" title="Star count and last push, refreshed from the public GitHub API">
            <span class="gh-stars" title="${p.stars} stars on GitHub${p.forks ? ' · ' + p.forks + ' forks' : ''}">★ ${p.stars}</span>
            <span class="gh-sep" aria-hidden="true">·</span>
            <span class="gh-push">—</span>
            ${p.lang ? `<span class="gh-sep" aria-hidden="true">·</span><span class="gh-lang">${esc(p.lang)}</span>` : ''}
          </p>
          <div class="project-tags">${p.tags.map(t => `<span>#${esc(t)}</span>`).join('')}</div>
          <div class="project-actions">
            <button type="button" class="pbtn primary" data-cs="${i}">View Case Study</button>
            <a class="pbtn" href="${p.url}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
        </div>
      </article>`;
  }
  function renderProjects() {
    const grid = $('#projectGrid'), archive = $('#archiveGrid');
    if (!grid || !D.PROJECTS) return;
    const featured = D.PROJECTS.map((p, i) => ({ p, i })).filter(x => x.p.featured);
    grid.innerHTML = featured.map(x => projectCard(x.p, x.i)).join('');
    if (archive) archive.innerHTML = D.PROJECTS.map((p) =>
      `<a class="archive-card" href="${p.url}" target="_blank" rel="noopener noreferrer"><span class="ac-head"><span class="ac-name">${p.icon} ${esc(p.name)}${p.fork ? ' <em class="ac-fork">FORK</em>' : ''}</span><span class="ac-stars" data-repo="${esc(repoOf(p.url))}" title="${p.stars} stars on GitHub">★ ${p.stars}</span></span><span class="ac-desc">${esc(p.desc)}</span></a>`).join('');
    $$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.filter = btn.dataset.filter;
      applyFilter();
    }));
    $$('.project-card', grid).forEach(card => {
      card.addEventListener('click', e => { if (!e.target.closest('a')) openModal(card); });
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); } });
    });
    $$('.pbtn[data-cs]', grid).forEach(b => b.addEventListener('click', e => { e.stopPropagation(); openModal(b.closest('.project-card')); }));
    applyFilter();
  }
  function applyFilter() {
    const cards = $$('#projectGrid .project-card');
    let shown = 0;
    cards.forEach((c, i) => {
      const show = state.filter === 'all' || c.dataset.cat === state.filter;
      c.style.display = show ? '' : 'none';
      if (show) { c.classList.add('in'); shown++; }
    });
  }

  /* ---------- Project case-study modal ---------- */
  let lastFocus = null;
  function openModal(card) {
    const overlay = $('#modalOverlay'), scroll = $('#modalScroll');
    if (!overlay || !card || !D.PROJECTS) return;
    const idx = $$('#projectGrid .project-card').indexOf(card);
    const p = D.PROJECTS.map((x, i) => ({ x, i })).filter(o => o.x.featured)[idx];
    if (!p) return;
    const pr = p.x;
    const cs = pr.caseStudy || {};
    const cat = (D.PROJECT_CATS && D.PROJECT_CATS[pr.cat]) || pr.cat;
    scroll.innerHTML = `
      <p class="ms-cat">${esc(cat)} — ${esc(pr.status)}</p>
      <h3 id="modalTitle">${esc(pr.name)}</h3>
      <p class="ms-tagline">${esc(pr.tagline)}</p>
      ${cs.problem ? `<div class="ms-section"><h4>The Problem</h4><p>${esc(cs.problem)}</p></div>` : ''}
      ${cs.approach ? `<div class="ms-section"><h4>Approach</h4><p>${esc(cs.approach)}</p></div>` : ''}
      ${cs.outcome ? `<div class="ms-section"><h4>Defensive Outcome</h4><p>${esc(cs.outcome)}</p></div>` : ''}
      ${cs.lessons ? `<div class="ms-section"><h4>Lessons Learned</h4><p>${esc(cs.lessons)}</p></div>` : ''}
      ${cs.disclosure ? `<div class="ms-section ms-disclosure">🕊 ${esc(cs.disclosure)}</div>` : ''}
      <div class="ms-section"><h4>Tools &amp; Tags</h4><div class="ms-tools">${pr.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div></div>
      <div class="ms-links"><a class="btn btn-primary" href="${pr.url}" target="_blank" rel="noopener noreferrer">Open on GitHub ↗</a></div>`;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('open'));
    document.body.classList.add('no-scroll');
    $('#modalClose').focus();
  }
  function closeModal() {
    const overlay = $('#modalOverlay');
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { overlay.hidden = true; }, 300);
    if (lastFocus) lastFocus.focus();
  }
  function initModal() {
    const overlay = $('#modalOverlay');
    if (!overlay) return;
    $('#modalClose').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => {
      if (overlay.hidden) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') {
        const f = $$('button, a[href]', overlay).filter(el => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Hunt Cycle ---------- */
  function renderHunt() {
    const list = $('#huntStages');
    if (!list || !D.HUNT_CYCLE) return;
    list.innerHTML = D.HUNT_CYCLE.map(s =>
      `<li class="hunt-stage" tabindex="0"><span class="hs-dot" aria-hidden="true">${s.icon}</span><span class="hs-n mono">STAGE ${s.n}</span><span class="hs-name">${esc(s.name)}</span><p class="hs-text">${esc(s.text)}</p></li>`).join('');
    const fill = $('#threadFill'), marker = $('#huntMarker');
    if (!fill || state.reduced) return;
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      const track = () => {
        const rect = list.getBoundingClientRect();
        const mid = innerHeight * 0.6;
        let prog = (mid - rect.top) / rect.height;
        prog = Math.max(0, Math.min(1, prog));
        fill.style.width = (prog * 100) + '%';
        if (marker) marker.style.left = (prog * 100) + '%';
      };
      addEventListener('scroll', track, { passive: true });
      track();
    }, { threshold: 0.2 });
    io.observe(list);
  }

  /* ---------- Experience timeline ---------- */
  function renderExperience() {
    const tl = $('#timeline');
    if (!tl || !D.EXPERIENCE) return;
    tl.innerHTML = D.EXPERIENCE.map(j => `
      <div class="tl-item reveal">
        <span class="tl-dot" aria-hidden="true"></span>
        <div class="tl-card">
          <p class="tl-date">${esc(j.date)}</p>
          <h3 class="tl-role">${esc(j.role)}</h3>
          <p class="tl-org">${esc(j.org || j.orgLabel || '')}</p>
          <p class="tl-desc">${esc(j.desc)}</p>
          <ul class="tl-points">${j.points.map(pt => `<li>${esc(pt)}</li>`).join('')}</ul>
          <div class="tl-tools">${j.tools.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        </div>
      </div>`).join('');
    const fill = document.createElement('div');
    fill.className = 'tl-fill';
    tl.prepend(fill);
    if (state.reduced) { fill.style.height = '100%'; return; }
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      const track = () => {
        const r = tl.getBoundingClientRect();
        const prog = Math.max(0, Math.min(1, (innerHeight * 0.65 - r.top) / r.height));
        fill.style.height = (prog * 100) + '%';
      };
      addEventListener('scroll', track, { passive: true });
      track();
    }, { threshold: 0.1 });
    io.observe(tl);
  }

  /* ---------- Stats / certs / THM badges ---------- */
  function renderCerts() {
    const row = $('#statsRow');
    if (row && D.STATS) {
      row.innerHTML = D.STATS.map(s =>
        `<div class="stat"><b data-count="${s.value}" data-suffix="${s.suffix || ''}">0${s.suffix || ''}</b><span>${esc(s.label)}${s.placeholder ? ' <em>[' + esc(s.placeholder) + ']</em>' : ''}</span></div>`).join('');
      const io = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        $$('b[data-count]', row).forEach(el => {
          const target = +el.dataset.count, suf = el.dataset.suffix;
          if (state.reduced) { el.textContent = target + suf; return; }
          const t0 = performance.now(), dur = 1400;
          const step = (t) => {
            const k = Math.min(1, (t - t0) / dur);
            el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))) + suf;
            if (k < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      }, { threshold: 0.35 });
      io.observe(row);
    }
    /* Certifications (§3.9). None are held yet, so none are claimed. A
       sealed card states what the certification WOULD cover and marks
       itself "SEALED — pending verification" rather than rendering an
       empty issuer, a dead VERIFY link, or a fake credential ID. The
       moment `sealed` is dropped and issuer/date/verify are filled in
       data.js, the card flips to its verified form automatically. */
    const bg = $('#badgeGrid');
    if (bg && D.CERTS) bg.innerHTML = D.CERTS.map(c => {
      if (c.sealed) {
        return `<div class="badge badge-sealed reveal">
          <span class="badge-icon" aria-hidden="true">${c.icon}</span>
          <b>${esc(c.title)}</b>
          <p class="b-meta">${esc(c.target || 'Certification track')}</p>
          <span class="stamp stamp-sealed">Sealed — pending verification</span>
        </div>`;
      }
      return `<div class="badge reveal">
        <span class="badge-icon" aria-hidden="true">${c.icon}</span>
        <b>${esc(c.title)}</b>
        <p class="b-meta">${esc(c.issuer || '')}${c.date ? ' · ' + esc(c.date) : ''}</p>
        ${c.verify ? `<a class="b-verify" href="${esc(c.verify)}" target="_blank" rel="noopener noreferrer">VERIFY ↗</a>` : ''}
      </div>`;
    }).join('');
    const tb = $('#thmBadges');
    if (tb && D.THM_BADGES) tb.innerHTML = D.THM_BADGES.map(b =>
      `<li><span aria-hidden="true">${b.icon}</span>${esc(b.name)}</li>`).join('');
  }

  /* ---------- NIGHTFALL TERMINAL (decorative, sandboxed) ----------
     §3.10 — expanded into a real-feeling CLI.

     SECURITY MODEL — the whole reason this is safe to ship:
       · the only text this can ever print is text already present in
         js/data.js (TERMINAL_CMDS, TERMINAL_FS, TERMINAL_SL)
       · no eval, no Function(), no innerHTML with user input — every
         line goes through textContent
       · no fetch/XHR/WebSocket — the terminal cannot touch the network
       · no filesystem access of any kind
     `cat` reads from the TERMINAL_FS object literal. `nmap` and `sudo`
     print fixed flavor text. Nothing is interpreted. That is why the
     "decorative — no system commands executed" banner can stay up
     permanently without it being a lie.

     Reduced motion → boot lines appear instantly, responses print
     without the per-character delay, and `matrix` renders a single
     static frame instead of animating.
     ------------------------------------------------------------ */
  function initTerminal() {
    const body = $('#termBody'), form = $('#termForm'), input = $('#termInput');
    if (!body || !form || !input) return;
    const history = [];
    let hIndex = -1;
    let busy = false;              /* blocks input while a response types */
    let matrixRaf = null;

    const atBottom = () => body.scrollHeight - body.scrollTop - body.clientHeight < 40;
    const scroll = () => { if (atBottom()) body.scrollTop = body.scrollHeight; };

    const add = (text, cls = 't-out') => {
      const div = document.createElement('div');
      div.className = 't-line ' + cls;
      div.textContent = text;      /* textContent, never innerHTML */
      body.appendChild(div);
      scroll();
      return div;
    };

    /* Per-character typing latency. This is what makes the terminal feel
       like a real session rather than a lookup table. Reduced motion →
       printed instantly (no character loop at all). */
    const typeLine = (text, cls = 't-out', done) => {
      if (state.reduced || state.perf) { add(text, cls); done && done(); return; }
      const div = document.createElement('div');
      div.className = 't-line ' + cls;
      body.appendChild(div);
      let i = 0;
      const step = () => {
        div.textContent = text.slice(0, ++i);
        scroll();
        if (i < text.length) setTimeout(step, text.length > 60 ? 3 : 7);
        else done && done();
      };
      step();
    };

    const printBlock = (lines, cls, done) => {
      if (state.reduced || state.perf) {
        lines.forEach(l => add(l, cls));
        done && done();
        return;
      }
      let i = 0;
      const next = () => {
        if (i >= lines.length) { done && done(); return; }
        typeLine(lines[i++], cls, next);
      };
      next();
    };

    /* --- boot banner --- */
    printBlock(D.TERMINAL_BOOT || [], 't-out', () => {
      const last = body.lastElementChild;
      if (last) last.classList.add('ok');
    });

    /* --- matrix easter egg ---
       Renders into the terminal body itself, then clears itself.
       Reduced motion → a single static frame, no animation loop. */
    function runMatrix() {
      const W = 60, H = 12;
      const chars = D.TERMINAL_MATRIX_CHARS || '01';
      const grid = () => Array.from({ length: H }, () =>
        Array.from({ length: W }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
      const pre = document.createElement('pre');
      pre.className = 't-matrix';
      body.appendChild(pre);
      scroll();
      if (state.reduced || state.perf) {
        pre.textContent = grid().join('\n');
        setTimeout(() => { pre.remove(); busy = false; }, 1400);
        return;
      }
      let frames = 0;
      const loop = () => {
        pre.textContent = grid().join('\n');
        scroll();
        if (++frames < 40) matrixRaf = requestAnimationFrame(() => setTimeout(loop, 55));
        else { pre.remove(); busy = false; }
      };
      loop();
    }

    /* --- command dispatch --- */
    const CMDS = Object.keys(D.TERMINAL_CMDS || {}).concat(['clear', 'matrix', 'sl', 'cat']);
    const UNIQUE = [...new Set(CMDS)].sort();

    const run = (raw) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      const cmd = trimmed.toLowerCase();
      add(raw, 't-cmd');
      history.unshift(trimmed); hIndex = -1;

      /* clear */
      if (cmd === 'clear') { body.innerHTML = ''; return; }

      /* matrix — handled here because it animates */
      if (cmd === 'matrix') { busy = true; runMatrix(); return; }

      /* sl — classic mistyped-ls locomotive */
      if (cmd === 'sl') { printBlock(D.TERMINAL_SL || [], 't-out', () => add('')); return; }

      /* cat <file> — reads the fake filesystem in data.js */
      if (cmd === 'cat' || cmd.startsWith('cat ')) {
        const file = trimmed.slice(3).trim();
        if (!file) { printBlock(D.TERMINAL_CMDS.cat || [], 't-out', () => add('')); return; }
        if (file === '.secrets') {
          printBlock([
            "cat: .secrets: Permission denied",
            "",
            "some doors stay shut. that is rather the point of them."
          ], 'err', () => add(''));
          return;
        }
        const content = (D.TERMINAL_FS || {})[file];
        if (content) printBlock(content, 't-out', () => add(''));
        else printBlock([`cat: ${file}: No such file or directory`, "try: ls"], 'err', () => add(''));
        return;
      }

      /* nmap <host> — flavor text only, no packets leave the browser */
      if (cmd === 'nmap' || cmd.startsWith('nmap ')) {
        printBlock(D.TERMINAL_CMDS.nmap || [], 't-out', () => add(''));
        return;
      }

      /* sudo — always refused, always with a joke */
      if (cmd === 'sudo' || cmd.startsWith('sudo ')) {
        printBlock(D.TERMINAL_CMDS.sudo || [], 'err', () => add(''));
        return;
      }

      /* everything else: straight table lookup */
      const out = (D.TERMINAL_CMDS || {})[cmd];
      if (out) { printBlock(out, 't-out', () => add('')); return; }
      printBlock([`command not found: ${cmd}`, "type 'help' for the command index"], 'err', () => add(''));
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (busy) return;
      run(input.value);
      input.value = '';
    });

    /* --- history + tab completion --- */
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (hIndex < history.length - 1) input.value = history[++hIndex] || '';
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (hIndex > 0) input.value = history[--hIndex];
        else { hIndex = -1; input.value = ''; }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const partial = input.value.trim().toLowerCase();
        if (!partial) return;
        /* complete to the first unique match; if several share the
           prefix, print them like a real shell does */
        const matches = UNIQUE.filter(c => c.startsWith(partial));
        if (matches.length === 1) { input.value = matches[0] + (matches[0] === 'cat' ? ' ' : ''); }
        else if (matches.length > 1) {
          add(input.value, 't-cmd');
          add(matches.join('   '), 't-out');
        }
      }
    });

    /* --- block cursor follows focus (decorative only) --- */
    const cursor = $('#termCursor');
    if (cursor) {
      input.addEventListener('focus', () => cursor.classList.add('on'));
      input.addEventListener('blur', () => cursor.classList.remove('on'));
    }
    /* clicking anywhere in the terminal focuses the input — expected
       behaviour for a terminal, and it keeps the whole thing usable
       without a mouse once focused */
    body.addEventListener('click', () => input.focus());
  }

  /* ---------- Atmosphere: bats, parallax, cursor, progress ---------- */
  const BAT_SVG = '<svg viewBox="0 0 40 18" width="W" height="H"><path d="M20 9 C17 3 10 0 1 2 C6 5 8 8 7 13 C11 10 15 10 20 9 C25 10 29 10 33 13 C32 8 34 5 39 2 C30 0 23 3 20 9 Z"/></svg>';  
  function spawnBats() {
    const field = $('#batField');
    if (!field || state.reduced) return;
    const mobile = matchMedia('(max-width: 860px)').matches;
    const count = state.perf ? 0 : (mobile ? 3 : 6);
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'bat' + (i % 2 ? ' light' : '');
      const size = 18 + Math.random() * 22;
      b.innerHTML = BAT_SVG.replace('W', Math.round(size)).replace('H', Math.round(size * 0.45));
      const dur = 14 + Math.random() * 14;
      b.style.opacity = 0.25 + Math.random() * 0.35;
      b.animate([
        { transform: `translate(${-8 + Math.random() * 30}vw, ${8 + Math.random() * 40}vh) rotate(0deg)` },
        { transform: `translate(60vw, ${2 + Math.random() * 30}vh) rotate(6deg)`, offset: 0.35 },
        { transform: `translate(120vw, ${10 + Math.random() * 45}vh) rotate(-5deg)` }
      ], { duration: dur * 1000, delay: -Math.random() * dur * 1000, iterations: Infinity, easing: 'ease-in-out' });
      field.appendChild(b);
      const vis = new IntersectionObserver(es => {
        es.forEach(e => e.target.getAnimations().forEach(a => { state.reduced ? a.pause() : (e.isIntersecting ? a.play() : a.pause()); }));
      });
      vis.observe(b);
      vis.observe(field); /* hero offscreen → pause all */
    }
  }

  function initPointerFX() {
    if (state.reduced || matchMedia('(pointer: coarse)').matches) return;
    const hero = $('#home'), glow = $('#heroGlow'), aura = $('#cursorAura');
    const card = $('#profileCard');
    let px = 0, py = 0, raf = null, magnetRaf = null;
    const apply = () => {
      raf = null;
      if (glow && hero) {
        const r = hero.getBoundingClientRect();
        glow.style.opacity = 1;
        glow.style.left = (px - r.left) + 'px';
        glow.style.top = (py - r.top) + 'px';
      }
      if (aura) { aura.style.opacity = 1; aura.style.left = px + 'px'; aura.style.top = py + 'px'; }  
      if (card && hero) {
        const r = hero.getBoundingClientRect();
        const dx = (px - r.left) / r.width - 0.5, dy = (py - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 4}deg)`;
      }
      $$('[data-depth]').forEach(el => {
        const d = +el.dataset.depth;
        el.style.translate = `${px * d * -0.6}px ${py * d * -0.6}px`;
      });
    }; 
    hero && hero.addEventListener('pointermove', e => {
      px = e.clientX; py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    hero && hero.addEventListener('pointerleave', () => {
      if (glow) glow.style.opacity = 0;
      if (card) card.style.transform = '';
      $$('[data-depth]').forEach(el => { el.style.translate = ''; });
    });
    document.addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; if (aura && !raf && !state.perf) raf = requestAnimationFrame(apply); }, { passive: true });
    document.addEventListener('pointerleave', () => { if (aura) aura.style.opacity = 0; });

    /* --- Magnetic CTAs (§3.3). The hero buttons lean a few pixels
       toward a nearby pointer and settle back when it leaves — a
       physical, tactile detail that costs one rAF per frame for two
       elements. Skipped in performance mode (initPointerFX itself
       already skips reduced motion and coarse pointers) and never
       applied to keyboard focus, which uses the normal focus ring. */
    if (!state.perf) {
      /* 18. Magnetic nav links join the hero CTAs. Deliberately weaker
         (4px vs 7px) — a nav bar that lunges at the cursor would fight
         the reading, where a CTA leaning is an invitation. */
      const magnets = $$('.hero-cta .btn');
      const navMagnets = $$('.nav-links a');
      magnets.forEach(btn => btn.classList.add('magnetic'));
      const pull = () => {
        magnets.forEach(btn => {
          const r = btn.getBoundingClientRect();
          if (!r.width) return;
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const dx = px - cx, dy = py - cy;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            const f = (1 - dist / 140) * 8; /* max 8px displacement */
            btn.style.translate = (dx / dist) * f + 'px ' + (dy / dist) * f + 'px';
          } else {
            btn.style.translate = '';
          }
        });
      };
      hero && hero.addEventListener('pointermove', () => { if (!magnetRaf) magnetRaf = requestAnimationFrame(() => { magnetRaf = null; pull(); }); }, { passive: true });
      hero && hero.addEventListener('pointerleave', () => { magnets.forEach(b => { b.style.translate = ''; }); });

      /* 18. Nav links: same pull, tighter radius (70px) and smaller
         throw (4px) so the bar stays legible while still feeling
         physical. Bound to the nav element, not the document, so
         pointer movement anywhere else costs nothing. */
      const nav = $('#navbar');
      let navRaf = null;
      const navPull = () => {
        navRaf = null;
        navMagnets.forEach(a => {
          const r = a.getBoundingClientRect();
          const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
          const dist = Math.hypot(dx, dy);
          if (dist < 70 && dist > 0) {
            const f = (1 - dist / 70) * 4;
            a.style.translate = (dx / dist) * f + 'px ' + (dy / dist) * f + 'px';
          } else a.style.translate = '';
        });
      };
      nav && nav.addEventListener('pointermove', () => { if (!navRaf) navRaf = requestAnimationFrame(navPull); }, { passive: true });
      nav && nav.addEventListener('pointerleave', () => { navMagnets.forEach(a => { a.style.translate = ''; }); });
    }

    /* --- Cursor ring: a lagging outline that trails the pointer.
       Decorative only — aria-hidden, pointer-events:none, and it never
       touches click targets. It grows over interactive elements so it
       reads as a targeting reticle rather than a second cursor.

       Skipped entirely when reduced motion is on (it is pure motion with
       no informational content) and in performance mode (it is one more
       element following the pointer every frame). */
    const ring = $('#cursorRing');
    if (!ring || state.perf) return;
    let rx = px, ry = py, ringRaf = null;
    const follow = () => {
      rx += (px - rx) * 0.18;
      ry += (py - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      ringRaf = (Math.abs(px - rx) > 0.4 || Math.abs(py - ry) > 0.4) ? requestAnimationFrame(follow) : null;
    };
    document.addEventListener('pointermove', e => {
      px = e.clientX; py = e.clientY;
      ring.classList.add('on');
      if (!ringRaf) ringRaf = requestAnimationFrame(follow);
    }, { passive: true });
    document.addEventListener('pointerover', e => {
      const hot = e.target.closest('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
      ring.classList.toggle('hot', !!hot);
    }, { passive: true });
    document.addEventListener('pointerleave', () => ring.classList.remove('on'));
  }

  function initScrollFX() {
    const bar = $('#scrollProgress'), top = $('#backTop');
    const nav = $('#navbar');
    const scan = initScanlineOverlay();
    initDividerEmbers();
    initSectionDepth();
    initBackTopRing();
    /* 32. Velocity tracker. Fast scrolling tears the signal; the class
       clears itself once the wheel stops. RM: never applied. */
    let lastY = scrollY, lastT = performance.now(), tearTimer = null;
    let raf = null;
    const track = () => {
      raf = null;
      const max = document.documentElement.scrollHeight - innerHeight;
      const frac = max > 0 ? scrollY / max : 0;
      if (bar) bar.style.transform = `scaleY(${frac})`;
      if (top) top.classList.toggle('show', scrollY > 600);
      /* 22. shrink the nav past 80px */
      if (nav) nav.classList.toggle('shrunk', scrollY > 80);
      /* 26. progress ring around back-to-top */
      if (top && top._ring) top._ring(frac);
      /* 23. section counter */
      if (nav && nav._counter) nav._counter();
      /* 39. moon glyph rotation */
      if (nav && nav._moon) nav._moon(frac);
      /* 36. scanline density grows with depth */
      if (scan && !state.perf) scan.style.opacity = (0.28 + frac * 0.22).toFixed(3);
      /* 32. tear on fast scroll (only when motion is allowed) */
      if (!state.reduced && !state.perf) {
        const now = performance.now();
        const dt = now - lastT;
        const v = dt > 0 ? Math.abs(scrollY - lastY) / dt : 0;   /* px/ms */
        lastY = scrollY; lastT = now;
        if (v > 2.2) {
          document.documentElement.classList.add('scroll-tear');
          clearTimeout(tearTimer);
          tearTimer = setTimeout(() => document.documentElement.classList.remove('scroll-tear'), 180);
        }
      }
      /* 35. card parallax — a small offset per card, capped so nothing
         drifts more than a few px and text stays put. */
      if (!state.reduced && !state.perf) {
        const cards = $$('[data-scroll-depth]');
        for (let i = 0; i < cards.length; i++) {
          const c = cards[i];
          const r = c.getBoundingClientRect();
          if (r.bottom < -80 || r.top > innerHeight + 80) continue;
          const d = +c.dataset.scrollDepth || 1;
          const off = ((r.top + r.height / 2) - innerHeight / 2) / innerHeight;
          c.style.setProperty('--py', (off * d * 3.5).toFixed(2) + 'px');
        }
        /* 58. CLASSIFIED watermark drifts against the scroll. Capped to
           ±18px so it can never wander out from behind the copy, and
           skipped entirely when the element is offscreen. */
        const wm = $('.classified-mark');
        if (wm) {
          const r = wm.parentElement.getBoundingClientRect();
          if (r.bottom > -40 && r.top < innerHeight + 40) {
            const off = ((r.top + r.height / 2) - innerHeight / 2) / innerHeight;
            wm.style.setProperty('--wm', (off * -18).toFixed(2) + 'px');
          }
        }
      }

      /* Light the minimap ticks that have been scrolled past (§3.2).
         Compared by offsetTop rather than by index so it stays correct
         regardless of DOM order or how many sections exist. */
      const ticks = $$('.sp-tick');
      let activeTick = null, bestDist = Infinity;
      for (let i = 0; i < ticks.length; i++) {
        const at = ticks[i].dataset.at;
        const sec = at && document.getElementById(at);
        const passed = !!sec && sec.offsetTop <= scrollY + innerHeight * 0.4;
        ticks[i].classList.toggle('is-passed', passed);
        /* 25. The tick nearest the reading line is the active one. */
        if (sec) {
          const d = Math.abs(sec.offsetTop - (scrollY + innerHeight * 0.4));
          if (d < bestDist) { bestDist = d; activeTick = ticks[i]; }
        }
      }
      for (let i = 0; i < ticks.length; i++) {
        ticks[i].classList.toggle('is-active', ticks[i] === activeTick);
      }
      /* §4.1 — heartbeat: when the visitor has scrolled past every
         section into the contact region, the last tick beats. CSS
         animation, so this is just the class toggle; reduced/perf
         kill it at the stylesheet level. */
      if (ticks.length) {
        const last = ticks[ticks.length - 1];
        const lastSec = last.dataset.at && document.getElementById(last.dataset.at);
        const allPassed = ticks.every(t => t.classList.contains('is-passed'));
        last.classList.toggle('heartbeat', !!(allPassed && lastSec));
      }
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(track); }, { passive: true });
    /* Section boundaries move with the viewport, so the minimap is
       measured on load and re-measured on resize (debounced — resize
       fires continuously while dragging a window edge). */
    buildScrollMinimap();
    let rt = null;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { buildScrollMinimap(); track(); }, 180); }, { passive: true });
    addEventListener('load', () => { buildScrollMinimap(); track(); }, { once: true });
    track();
    top && top.addEventListener('click', () => scrollTo({ top: 0, behavior: state.reduced ? 'auto' : 'smooth' }));
  }

  /* ---------- Typed tagline ---------- */
  function initTyped() {
    const el = $('#typedText');
    if (!el || !D.PROFILE) return;
    const lines = D.PROFILE.typedLines || [];
    if (state.reduced || !lines.length) { el.textContent = lines[0] || ''; return; }
    let li = 0, ci = 0, del = false;
    const step = () => {
      const line = lines[li];
      el.textContent = line.slice(0, ci);
      let delay = del ? 26 : 52;
      if (!del && ci === line.length) { del = true; delay = 2200; }
      else if (del && ci === 0) { del = false; li = (li + 1) % lines.length; delay = 350; }
      else ci += del ? -1 : 1;
      setTimeout(step, delay);
    }; 
    setTimeout(step, 900);
  }

  /* ---------- Contact form (local validation only) ---------- */
  function initForm() {
    const form = $('#contactForm');
    if (!form) return;
    const fields = {
      name: { el: $('#cfName'), err: $('#errName'), test: v => v.trim().length >= 2, msg: 'Please enter your name (2+ characters).' },
      email: { el: $('#cfEmail'), err: $('#errEmail'), test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
      type: { el: $('#cfType'), err: $('#errType'), test: v => !!v, msg: 'Please select a project type.' },
      message: { el: $('#cfMsg'), err: $('#errMsg'), test: v => v.trim().length >= 10, msg: 'Message needs at least 10 characters.' }
    }; 
    const show = (f, ok) => {
      f.el.closest('.form-field').classList.toggle('invalid', !ok);
      f.err.hidden = ok;
      f.err.textContent = ok ? '' : f.msg;
      f.el.setAttribute('aria-invalid', String(!ok));
    };
    Object.values(fields).forEach(f => f.el.addEventListener('input', () => show(f, f.test(f.el.value))));
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true, first = null;
      Object.values(fields).forEach(f => {
        const good = f.test(f.el.value);
        show(f, good);
        if (!good && !first) first = f.el;
        ok = ok && good;
      });
      const s = $('#formSuccess'), note = $('.form-note'), submitBtn = form.querySelector('[type="submit"]');
      if (!ok) {
        if (s) s.hidden = true;
        first && first.focus();
        return;
      }
      /* §3.11 — the honest resolution. The form plays a short
         "TRANSMITTING…" static sequence (theater, matching the site's
         voice), then tells the truth: there is no backend, nothing was
         sent, and the real channels are the way in. No fake success
         claim at any point — that is a hard constraint, not a style
         choice. Reduced motion skips the flicker and lands on the
         honest message immediately. */
      form.reset();
      Object.values(fields).forEach(f => show(f, true));
      const finishHonest = () => {
        if (note) note.hidden = true;
        if (submitBtn) submitBtn.disabled = false;
        if (s) {
          s.textContent = 'NO SIGNAL LEFT THIS TERMINAL — THIS FORM HAS NO BACKEND AND NOTHING WAS SENT. USE A DIRECT CHANNEL ABOVE.';
          s.hidden = false;
          s.scrollIntoView({ block: 'nearest', behavior: state.reduced ? 'auto' : 'smooth' });
        }
      };
      if (submitBtn) submitBtn.disabled = true;
      if (state.reduced || state.perf || !s) return finishHonest();
      const GLYPHS = '▮▯▰▱■□▨ pounding-static'.split('');
      let n = 0;
      s.textContent = '▮▮▮ TRANSMITTING ▮▮▮';
      s.hidden = false;
      const flicker = setInterval(() => {
        n++;
        if (n % 2) {
          s.textContent = s.textContent.replace(/[▮▯]/g, () => GLYPHS[Math.floor(Math.random() * 8)]);
        } else {
          s.textContent = '▮▮▮ TRANSMITTING ▮▮▮';
        }
        if (n > 8) { clearInterval(flicker); finishHonest(); }
      }, 130);
    });
  }

  /* ---------- Research Ethics (§3 / ETHICS in data.js) ----------
     This section is the answer to a real question a visitor will have:
     several of the published tools are dual-use. Rather than hide that,
     the section names it and states the operating line. All copy comes
     from D.ETHICS — nothing is hardcoded here.

     Motion: none beyond the shared .reveal entrance. A compliance
     statement that glitches would undercut its own credibility. */
  function renderEthics() {
    const E = D.ETHICS;
    if (!E) return;
    const set = (sel, v) => { const el = $(sel); if (el && v != null) el.textContent = v; };
    set('#ethicsEyebrow', E.eyebrow);
    set('#ethicsTitle', E.title);
    set('#ethicsSub', E.sub);
    set('#ethicsStamp', E.stamp);
    set('#ethicsLead', E.lead);
    set('#ethicsClose', E.close);
    const list = $('#ethicsRules');
    if (!list) return;
    list.innerHTML = '';
    (E.rules || []).forEach(r => {
      const li = document.createElement('li');
      const t = document.createElement('b');
      t.className = 'er-title';
      t.textContent = r.title;
      const p = document.createElement('p');
      p.className = 'er-text';
      p.textContent = r.text;
      li.append(t, p);
      list.appendChild(li);
    });
  }

  /* ---------- Dossier case-file header (§3.4) ----------
     Fills the About section's case-file header from DOSSIER in data.js.
     The stamp itself is static text in the markup (so it is present
     without JS); this only adds the metadata rows and the file number.

     54. The FILE value scramble-decodes instead of appearing: the final
     string is fixed from the first frame, and only the characters
     before it are randomised, so the row never changes width and the
     value is correct the instant the animation is skipped.
     60. The head's rule draws itself when the section is entered. */
  function renderDossier() {
    const Ds = D.DOSSIER;
    if (!Ds) return;
    const stamp = $('#dossierStamp');
    if (stamp && Ds.stamp) stamp.textContent = Ds.stamp;
    const meta = $('#dossierMeta');
    if (!meta) return;
    const rows = [
      ['FILE', Ds.fileNo],
      ['SUBJECT', Ds.subject],
      ['STATUS', Ds.clearance]
    ].filter(r => r[1]);
    meta.innerHTML = rows.map(([k, v]) =>
      `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');

    const head = $('#dossierHead');
    if (!head || head.querySelector('.dossier-draw')) return;
    /* 60. the self-drawing rule */
    const draw = document.createElement('span');
    draw.className = 'dossier-draw';
    draw.setAttribute('aria-hidden', 'true');
    head.appendChild(draw);

    if (state.reduced) { head.classList.add('drawn', 'inked'); return; }

    /* 54. scramble the FILE row only — the other two are prose and
       scrambling them would read as a malfunction, not a decode. */
    const fileDd = meta.querySelector('div:first-child dd');
    const target = Ds.fileNo || '';
    const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789-#';
    const scramble = () => {
      const t0 = performance.now(), dur = 800;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        /* reveal characters left-to-right as the clock runs out */
        const locked = Math.floor(p * target.length);
        let out = '';
        for (let i = 0; i < target.length; i++) {
          out += i < locked || target[i] === ' '
            ? target[i]
            : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        fileDd.textContent = out;
        if (p < 1) requestAnimationFrame(step);
        else fileDd.textContent = target;
      };
      requestAnimationFrame(step);
    };

    /* 51/60. fire once, when the header is actually on screen */
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      head.classList.add('drawn', 'inked');
      if (!state.perf) scramble();
    }, { threshold: 0.4 });
    io.observe(head);
  }

  /* ---------- Availability widget (§4.3) ----------
     Renders AVAILABILITY from data.js into the contact panel AND the nav
     badge, so both always agree. Manually toggled by editing
     `open: true|false` in data.js — deliberately not automated, because
     a status that updates itself can silently become a lie.

     The dot's colour is driven by the data (green when open, muted when
     engaged) and the text is never inferred — whatever the data says is
     what the visitor reads. */
  function renderAvailability() {
    const A = D.AVAILABILITY;
    if (!A) return;
    const label = A.open ? A.openLabel : A.closedLabel;
    /* nav badge */
    const navText = $('#statusText');
    if (navText) navText.textContent = label;
    const navBadge = $('#statusBadge');
    if (navBadge) {
      navBadge.classList.toggle('is-closed', !A.open);
      navBadge.title = label + (A.detail ? ' — ' + A.detail : '');
    }
    /* contact panel widget */
    const w = $('#availWidget');
    if (!w) return;
    w.classList.toggle('is-closed', !A.open);
    const l = $('#availLabel'), d = $('#availDetail');
    if (l) l.textContent = label;
    if (d) d.textContent = A.detail || '';
    /* The dot is decorative; the text carries the meaning, so the widget
       needs no extra ARIA beyond the visible label. */
  }

  /* ---------- Contact channels ----------
     GitHub-only, per the owner's call. Email and résumé are deliberately
     absent rather than stubbed — data.js holds `email: null` / `resume:
     null`, and this renders only what actually exists. A channel with no
     destination is worse than no channel: it looks like a way to reach
     someone and isn't. */
  function renderContactChannels() {
    const box = $('#contactChannels');
    if (!box) return;
    const P = D.PROFILE || {};
    /* meta is the display handle — derived from the URL's last path
       segment so it can never drift out of sync with the link itself. */
    const tail = (u) => { try { return '@' + decodeURIComponent(u.replace(/\/+$/, '').split('/').pop()); } catch { return ''; } };
    const channels = [];
    if (P.github) channels.push({ icon: '⌥', name: 'GitHub', meta: tail(P.github), href: P.github, note: 'Code, writeups, and the tools referenced above.' });
    if (P.tryhackme) channels.push({ icon: '◆', name: 'TryHackMe', meta: tail(P.tryhackme), href: P.tryhackme, note: 'Rooms completed and badges earned.' });
    if (P.youtube) channels.push({ icon: '▶', name: 'YouTube', meta: tail(P.youtube), href: P.youtube, note: 'Walkthroughs and security explainers.' });
    box.innerHTML = '';
    const h = document.createElement('h3');
    h.className = 'mono';
    h.textContent = 'DIRECT CHANNELS';
    box.appendChild(h);
    channels.forEach(c => {
      const a = document.createElement('a');
      a.className = 'contact-link';
      a.href = c.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      const i = document.createElement('span');
      i.className = 'cl-icon';
      i.setAttribute('aria-hidden', 'true');
      i.textContent = c.icon;
      const wrap = document.createElement('div');
      const b = document.createElement('b');
      b.textContent = c.name;
      const m = document.createElement('i');
      m.textContent = c.meta;
      wrap.append(b, m);
      a.append(i, wrap);
      a.setAttribute('aria-label', c.name + ' — ' + c.note + ' (opens in a new tab)');
      box.appendChild(a);
    });
    if (!channels.length) {
      const p = document.createElement('p');
      p.className = 'disclosure-note';
      p.textContent = 'No public channels configured yet.';
      box.appendChild(p);
    }
    /* §3.11 — PGP key block. Renders only when PROFILE.pgpKey is set;
       null keeps it entirely absent (see the comment in data.js — a
       security researcher shipping a placeholder key would be
       self-defeating). Collapsible <details>, copy button on the
       armored block, fingerprint readout when one is provided. */
    if (P.pgpKey) {
      const det = document.createElement('details');
      det.className = 'pgp-block';
      const sum = document.createElement('summary');
      sum.className = 'mono';
      sum.textContent = 'PGP PUBLIC KEY ▾';
      const wrap = document.createElement('div');
      wrap.className = 'pgp-body';
      if (P.pgpFingerprint) {
        const fp = document.createElement('p');
        fp.className = 'pgp-fp mono';
        fp.textContent = 'FINGERPRINT  ' + P.pgpFingerprint;
        wrap.appendChild(fp);
      }
      const pre = document.createElement('pre');
      pre.className = 'pgp-key mono';
      pre.textContent = P.pgpKey;
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'btn btn-ghost pgp-copy';
      copy.textContent = 'COPY KEY';
      copy.addEventListener('click', async () => {
        const ok = await copyText(P.pgpKey);
        copy.textContent = ok ? 'COPIED ✓' : 'COPY FAILED';
        copy.classList.toggle('copied', ok);
        setTimeout(() => { copy.textContent = 'COPY KEY'; copy.classList.remove('copied'); }, 2200);
      });
      wrap.append(pre, copy);
      det.append(sum, wrap);
      box.appendChild(det);
    }
  }

  /* ---------- Moon phase (§4.1) ----------
     Real astronomy from the current date — no API, no library, no
     network. Mean synodic month (29.530588853 days) counted from the
     known new moon of 2000-01-06 18:14 UTC. Accurate to well under a
     day, which is far finer than the eight-phase buckets this maps to.
     Pure function of the clock: nothing here can fail or be stale. */
  function moonPhase(date) {
    const SYNODIC = 29.530588853;
    const NEW_MOON_2000 = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
    const days = (date.getTime() / 86400000) - NEW_MOON_2000;
    let frac = (days % SYNODIC) / SYNODIC;
    if (frac < 0) frac += 1;
    const idx = Math.round(frac * 8) % 8;
    const PHASES = [
      { glyph: '●', name: 'New Moon' },
      { glyph: '◔', name: 'Waxing Crescent' },
      { glyph: '◑', name: 'First Quarter' },
      { glyph: '◕', name: 'Waxing Gibbous' },
      { glyph: '○', name: 'Full Moon' },
      { glyph: '◕', name: 'Waning Gibbous' },
      { glyph: '◐', name: 'Last Quarter' },
      { glyph: '◔', name: 'Waning Crescent' }
    ];
    return PHASES[idx];
  }

  /* ---------- Footer bits ---------- */
  function initFooter() {
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();

    /* §3.12 — rotate the closing quote. One quote per SESSION, drawn
       from PROFILE.quotes, so a reload mid-read keeps the same line but
       a return visit gets a different one. Falls back to the old single
       PROFILE.quote if the array is absent. */
    const q = $('#footerQuote');
    if (q) {
      const lines = (D.PROFILE && D.PROFILE.quotes) || [];
      let pick = null;
      if (lines.length) {
        const n = store.get('quoteIdx', -1);
        pick = (n >= 0 && n < lines.length) ? lines[n] : lines[Math.floor(Math.random() * lines.length)];
        store.set('quoteIdx', lines.indexOf(pick));
      } else if (D.PROFILE && D.PROFILE.quote) {
        pick = D.PROFILE.quote;
      }
      if (pick) q.textContent = '“' + pick + '”';
    }

    /* §4.1 — moon phase. Computed locally; the glyph is decorative and
       hidden from assistive tech, the phase name carries the meaning. */
    const mp = $('#moonPhase');
    if (mp) {
      const p = moonPhase(new Date());
      const g = document.createElement('span');
      g.className = 'mp-glyph';
      g.setAttribute('aria-hidden', 'true');
      g.textContent = p.glyph;
      mp.textContent = '';
      mp.append(g, document.createTextNode(p.name.toUpperCase() + ' TONIGHT'));
    }

    ['#privacyLink', '#disclosureLink'].forEach(sel => {
      const a = $(sel);
      a && a.addEventListener('click', e => { e.preventDefault(); a.textContent += ' — placeholder'; setTimeout(() => { a.textContent = a.textContent.replace(' — placeholder', ''); }, 1200); });
    });
  }

  /* ---------- Section minimap on the scroll strip (§3.2) ----------
     Puts a tick on the progress strip at every section boundary, so the
     strip reads as a map of the document rather than a bare bar. Ticks
     are positioned by each section's offsetTop as a fraction of total
     scrollable height, and lit once scrolled past.

     Positioned from measured layout, so it is rebuilt on resize (the
     page height changes with the viewport). Rebuilding is cheap: it
     writes inline `top` on a handful of 1px divs. */
  function buildScrollMinimap() {
    const strip = $('#scrollProgress'), host = $('#scrollTicks');
    if (!strip || !host) return;
    const sections = $$('section[id]');
    const total = document.documentElement.scrollHeight - innerHeight;
    if (total <= 0) { host.innerHTML = ''; return; }
    host.innerHTML = '';
    sections.forEach(s => {
      const pct = Math.min(100, Math.max(0, (s.offsetTop / total) * 100));
      const t = document.createElement('div');
      t.className = 'sp-tick';
      t.style.top = pct + '%';
      t.dataset.at = s.id;
      /* 24. Label for the hover tooltip. Taken from the section's own
         eyebrow (e.g. "ARSENAL // 02") minus the number, falling back
         to the id. It is a CSS ::after reading data-label, so no extra
         node per tick. */
      const eyebrow = $('.section-eyebrow', s);
      const label = eyebrow
        ? eyebrow.textContent.replace(/\/\/.*$/, '').trim()
        : s.id.toUpperCase();
      t.dataset.label = label;
      t.setAttribute('aria-hidden', 'true');   /* decorative; nav links carry the real targets */
      host.appendChild(t);
    });
  }

  /* ---------- Portrait media ----------
     The portrait is the ORIGINAL animated GIF in plain <img> tags —
     native browser GIF animation, no codecs, no autoplay policy to fight.
     It ALWAYS animates, unconditionally: the portrait is core content and
     is never swapped for the static poster (assets/elias-poster.jpg is a
     load-error fallback and og:image only).
     Motion watchdog: if a browser ever freezes the GIF, JS silently swaps
     in an identical muted looping video (assets/elias-motion.*). */
  function initPortraitMedia() {
    const imgs = $$('#heroPortrait, #aboutPortrait');
    if (!imgs.length) return;
    /* Single editable source of truth: PROFILE.avatar in data.js drives both. */
    const av = D.PROFILE && D.PROFILE.avatar;
    if (av) imgs.forEach(img => { if (img.getAttribute('src') !== av) img.src = av; });

    /* Poster fallback, moved out of the markup. These were inline
       `onerror="this.onerror=null;this.src=..."` attributes, which forced
       'unsafe-inline' into script-src and would have made the CSP
       decorative. Binding here instead keeps the policy strict and
       behaves identically: on a load error, swap once to the static
       poster and clear the handler so a broken poster cannot loop. */
    imgs.forEach(img => {
      const poster = (D.PROFILE && D.PROFILE.avatarPoster) || 'assets/elias-poster.jpg';
      img.addEventListener('error', function onErr() {
        img.removeEventListener('error', onErr);
        if (img.getAttribute('src') !== poster) img.src = poster;
      });
      /* If the GIF already failed before this listener attached (cached
         error, or a fast 404), complete + naturalWidth 0 tells us so. */
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src') !== poster) {
        img.src = poster;
      }
    });
    /* Watchdog — sample the hero GIF through canvas 3x over ~1.6s.
       Three identical samples = the browser isn't animating it. */
    const check = async () => {
      const img = imgs[0];
      if (!img || img.tagName !== 'IMG' || !img.complete || !img.naturalWidth) return;
      const cv = document.createElement('canvas');
      cv.width = 64; cv.height = 36;
      const cx = cv.getContext('2d', { willReadFrequently: true });
      const sig = () => { cx.drawImage(img, 0, 0, 64, 36); const d = cx.getImageData(0, 0, 64, 36).data; let s = 0; for (let i = 0; i < d.length; i += 7) s += d[i]; return s; };
      const a = sig(); await new Promise(r => setTimeout(r, 800));
      const b = sig(); await new Promise(r => setTimeout(r, 800));
      const c = sig();
      if (!(a === b && b === c)) return; /* GIF animating — nothing to do */
      imgs.forEach(old => {
        const v = document.createElement('video');
        v.muted = true; v.loop = true; v.autoplay = true;
        v.setAttribute('playsinline', '');
        v.className = old.className;
        /* Carry the id across. Without this the swap silently removed
           #heroPortrait / #aboutPortrait from the document, so anything
           resolving the portrait by id — including the `imgs` lookup at
           the top of this function on a later call — found nothing. The
           class was copied but the id was not, which made the element
           look correct while being unaddressable. */
        if (old.id) v.id = old.id;
        v.setAttribute('aria-label', old.alt);
        /* Keep the box identical to the <img> it replaces, so the swap
           cannot shift layout or start cropping the artwork. */
        v.style.objectFit = 'contain';
        if (old.width) v.width = old.width;
        if (old.height) v.height = old.height;
        ['assets/elias-motion.webm', 'assets/elias-motion.mp4'].forEach(src => {
          const s = document.createElement('source');
          s.src = src; s.type = src.endsWith('.webm') ? 'video/webm' : 'video/mp4';
          v.appendChild(s);
        });
        old.replaceWith(v);
        v.play().catch(() => {});
      });
    };
    const arm = () => setTimeout(check, 1200);
    if (document.readyState === 'complete') arm();
    else addEventListener('load', arm, { once: true });
  }

  /* ---------- Easter eggs (§4.4 / §4.5) ----------
     Two cheap, quiet ones for the people who look:

     1. A view-source banner — an ASCII bat and a note, printed once to
        the console. Costs nothing at runtime, and on a security
        portfolio it is exactly the audience that opens DevTools.

     2. The Konami code. It toggles Blood-Moon theme (the same code path
        as the nav button, so it respects reduced/perf everywhere) —
        plus a brief flock of extra bats as the "reward" flourish. No
        network, no storage side effects beyond the existing theme
        persistence.

     `/nightfall` hash changelog from §4.5 was considered and skipped:
     a changelog implies release cadence this page doesn't have, and
     the konami + console eggs already cover the discovery itch. */
  function initEasterEggs() {
    const bat = [
      '  ,      ,',
      '  |\\    /|',
      '  |  \\/  |',
      ' ,\'  ¦¦  `.',
      ' ¦¦  ¦¦  ¦¦   N I G H T F A L L',
      '  \\  ¦¦  /    vanilla HTML/CSS/JS — no frameworks, no trackers',
      '   \\ __ /     view source. that is the point.',
      '    \\/\\/      github.com/Mr-Destroyer'
    ].join('\n');
    console.log('%c' + bat, 'color:#E63958;font-family:monospace;font-size:11px;line-height:1.35');

    const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let pos = 0;
    document.addEventListener('keydown', e => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = (key === SEQ[pos]) ? pos + 1 : (key === SEQ[0] ? 1 : 0);
      if (pos < SEQ.length) return;
      pos = 0;
      const on = document.body.classList.toggle('blood-moon');
      store.set('bloodMoon', on);
      const themeBtn = $('#themeBtn');
      themeBtn && themeBtn.setAttribute('aria-pressed', String(on));
      spawnBatFrenzy();
    });
  }

  /* One-off flock for the konami reward — same BAT_SVG, same WAAPI
     pattern as spawnBats, but time-limited so the sky returns to
     normal. Respects reduced (skipped) and perf (2 bats, not 8). */
  function spawnBatFrenzy() {
    const field = $('#batField');
    if (!field || state.reduced) return;
    const count = state.perf ? 2 : 8;
    const spawned = [];
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'bat' + (i % 2 ? ' light' : '');
      const size = 16 + Math.random() * 20;
      b.innerHTML = BAT_SVG.replace('W', Math.round(size)).replace('H', Math.round(size * 0.45));
      b.style.opacity = 0.3 + Math.random() * 0.3;
      const dur = 6 + Math.random() * 5;
      const anim = b.animate([
        { transform: `translate(${-10 + Math.random() * 20}vw, ${15 + Math.random() * 55}vh) rotate(0deg)` },
        { transform: `translate(55vw, ${8 + Math.random() * 50}vh) rotate(5deg)`, offset: 0.5 },
        { transform: `translate(115vw, ${18 + Math.random() * 45}vh) rotate(-4deg)` }
      ], { duration: dur * 1000, delay: i * 220, easing: 'ease-in-out' });
      field.appendChild(b);
      spawned.push({ b, anim });
    }
    const last = spawned[spawned.length - 1];
    const cleanup = () => spawned.forEach(({ b }) => b.remove());
    last.anim.onfinish = cleanup;
    setTimeout(cleanup, 14000); /* fallback sweep */
  }

  /* ---------- GitHub live data (§3.6 stats strip + §4.2 recon feed) ----------
     ONE request powers both widgets.

     The public /users/<user>/repos endpoint returns every repository in a
     single response, so the per-card star counts and last-commit dates
     cost exactly one fetch — not one per card, which would be 30+
     requests and an instant rate-limit.

     Caching (§6): the response is stored in localStorage under
     `nf_gh_cache` with a fetch timestamp and a TTL from GITHUB.ttlHours.
     A fresh cache means NO network request at all. A stale cache is
     rendered immediately and refreshed in the background, so the UI
     never blocks on the network and a slow connection never shows a
     spinner.

     Failure policy (§6): silent, on every path. Rate-limited, offline,
     CORS failure, non-200, malformed JSON, localStorage disabled — all
     of them leave the hardcoded PROJECTS[] values on screen and print
     nothing to the visitor. Console.warn only, for the developer.

     Repo names are derived from each project's own `url` (last path
     segment) rather than its display `name`, because the two differ:
     the repo is `CredStalker-`, the display name is `CredStalker`. The
     URL is the only field guaranteed to be exact.
     ------------------------------------------------------------ */
  const GH_CACHE_KEY = 'gh_cache';
  /* Cache schema version. Bumped when the shape of a cached event
     changes, so a cache written by an older build is discarded instead
     of being read with the wrong field names. v1 events carried `msg`,
     which was always empty (see ghEventDetail below); v2 carries
     `detail`. */
  const GH_CACHE_V = 2;

  /* "3d ago" style relative time. Coarse on purpose — a recon feed that
     says "2 months ago" is more useful than one that says "2026-07-14". */
  function relTime(iso) {
    const then = Date.parse(iso);
    if (isNaN(then)) return '';
    const s = Math.max(0, (Date.now() - then) / 1000);
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    if (s < 2592000) return Math.round(s / 86400) + 'd ago';
    if (s < 31536000) return Math.round(s / 2592000) + 'mo ago';
    return Math.round(s / 31536000) + 'y ago';
  }

  /* Last path segment of a GitHub URL = the exact repo name. */
  function repoOf(url) {
    try { return decodeURIComponent(String(url).replace(/\/+$/, '').split('/').pop()); }
    catch { return ''; }
  }

  /* Read the cache. Returns { at, repos, events } or null.
     A cache from an older schema is treated as absent — cheaper to
     refetch than to render a half-understood object. */
  function ghReadCache() {
    try {
      const raw = localStorage.getItem('nf_' + GH_CACHE_KEY);
      if (!raw) return null;
      const v = JSON.parse(raw);
      if (!v || typeof v !== 'object' || !v.repos) return null;
      if (v.v !== GH_CACHE_V) return null;   /* stale shape → refetch */
      return v;
    } catch { return null; }
  }
  function ghWriteCache(repos, events) {
    try {
      localStorage.setItem('nf_' + GH_CACHE_KEY, JSON.stringify({ v: GH_CACHE_V, at: Date.now(), repos, events }));
    } catch { /* quota or private mode — cache is an optimisation, not a requirement */ }
  }

  /* Build the feed's detail line for one event.

     This deliberately does NOT read payload.commits. The public events
     API used to include commit messages there, but GitHub removed them
     from the unauthenticated feed — a live check shows PushEvent
     payloads now carry only {before, head, push_id, ref, repository_id}.
     Reading commits[0].message therefore always produced '', which left
     the detail cell permanently blank.

     Everything below is derived from fields that are actually present,
     so the line is real rather than a placeholder:
       PushEvent   → branch + short head SHA      "main · 8ce4da8"
       CreateEvent → ref type + ref name          "branch · main"
       DeleteEvent → ref type + ref name          "branch · stale"
       PullRequest → action + PR number           "opened · #12"
       IssuesEvent → action + issue number        "opened · #7"
       ReleaseEvent→ tag name                     "v1.2.0"
       WatchEvent  → "starred"
       ForkEvent   → "forked"
     Returns '' when nothing usable is present; the row still renders
     with its other three cells. */
  function ghEventDetail(e) {
    const p = (e && e.payload) || {};
    const short = (sha) => (typeof sha === 'string' && sha ? sha.slice(0, 7) : '');
    /* refs/heads/main → main ; refs/tags/v1 → v1 */
    const branch = (ref) => String(ref || '').replace(/^refs\/(heads|tags)\//, '');
    switch (e.type) {
      case 'PushEvent': {
        const b = branch(p.ref);
        const sha = short(p.head);
        return [b, sha].filter(Boolean).join(' · ');
      }
      case 'CreateEvent':
      case 'DeleteEvent': {
        const kind = p.ref_type || '';
        const name = branch(p.ref) || p.ref || '';
        /* A branch creation often carries a description worth showing. */
        const desc = (e.type === 'CreateEvent' && p.ref_type === 'repository' && p.description)
          ? String(p.description).split('\n')[0].slice(0, 90) : '';
        return [kind, name].filter(Boolean).join(' · ') || desc;
      }
      case 'PullRequestEvent':
        return [p.action, p.number ? '#' + p.number : ''].filter(Boolean).join(' · ');
      case 'PullRequestReviewEvent':
        return [p.action, p.review && p.review.state].filter(Boolean).join(' · ');
      case 'IssuesEvent':
      case 'IssueCommentEvent':
        return [p.action, p.issue && p.issue.number ? '#' + p.issue.number : ''].filter(Boolean).join(' · ');
      case 'ReleaseEvent':
        return (p.release && (p.release.tag_name || p.release.name)) || '';
      case 'WatchEvent':
        return p.action === 'started' ? 'starred' : (p.action || '');
      case 'ForkEvent':
        return 'forked';
      case 'PublicEvent':
        return 'made public';
      case 'MemberEvent':
        return [p.action, p.member && p.member.login].filter(Boolean).join(' · ');
      default:
        return '';
    }
  }

  /* Fetch both endpoints. Resolves to null on ANY failure — callers must
     treat null as "keep what's on screen", never as an error to show. */
  async function ghFetch(user) {
    try {
      const [rr, er] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=pushed`, { headers: { Accept: 'application/vnd.github+json' } }),
        fetch(`https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=30`, { headers: { Accept: 'application/vnd.github+json' } })
          .catch(() => null)
      ]);
      if (!rr.ok) return null;
      const repos = await rr.json();
      if (!Array.isArray(repos)) return null;
      /* index by lowercased repo name for case-insensitive lookup */
      const index = {};
      repos.forEach(r => {
        if (!r || !r.name) return;
        index[r.name.toLowerCase()] = {
          stars: r.stargazers_count || 0,
          forks: r.forks_count || 0,
          pushed: r.pushed_at || r.updated_at || '',
          lang: r.language || '',
          archived: !!r.archived,
          desc: r.description || '',
          url: r.html_url || ''
        };
      });
      /* events are best-effort: a failure here must not lose the repos */
      let events = [];
      try {
        if (er && er.ok) {
          const ev = await er.json();
          if (Array.isArray(ev)) {
            events = ev
              .filter(e => e && e.type && e.repo && e.created_at)
              .slice(0, 12)
              .map(e => ({
                type: e.type,
                repo: e.repo.name,
                at: e.created_at,
                detail: ghEventDetail(e)
              }));
          }
        }
      } catch { /* events are optional */ }
      return { repos: index, events };
    } catch { return null; }   /* offline, DNS, CORS, abort — all the same to us */
  }

  /* Paint the star/commit readout into every element carrying data-repo.
     Handles both shapes: the featured card (a <p> wrapping .gh-stars and
     .gh-push) and the archive row (the .ac-stars span IS the data-repo
     element itself). Both end up with the same live star count. */
  function ghPaintRepos(index) {
    $$('[data-repo]').forEach(el => {
      const key = el.dataset.repo.toLowerCase();
      const r = index[key];
      if (!r) return;                       /* repo renamed/removed → keep hardcoded value */
      const starText = '★ ' + r.stars;
      const starTitle = r.stars + ' stars on GitHub' + (r.forks ? ' · ' + r.forks + ' forks' : '');
      /* featured card: nested spans */
      const stars = el.querySelector('.gh-stars');
      const push = el.querySelector('.gh-push');
      if (stars) { stars.textContent = starText; stars.title = starTitle; }
      /* archive row: the element itself is the star readout */
      else if (el.classList.contains('ac-stars')) { el.textContent = starText; el.title = starTitle; }
      if (push && r.pushed) {
        push.textContent = relTime(r.pushed);
        push.title = 'Last pushed ' + new Date(r.pushed).toLocaleDateString();
      }
      /* live values now back this element — drops the offline dimming */
      el.classList.add('is-live');
    });
  }

  /* §4.2 — the recon feed. Renders recent public activity as a terminal-
     adjacent readout. Hidden entirely if there is nothing to show, so a
     failed fetch leaves no empty box and no error state. */
  function ghPaintFeed(events) {
    const box = $('#reconFeed');
    if (!box) return;
    if (!events || !events.length) { box.hidden = true; return; }
    const label = {
      PushEvent: 'PUSH', CreateEvent: 'CREATE', PullRequestEvent: 'PR',
      IssuesEvent: 'ISSUE', ReleaseEvent: 'RELEASE', WatchEvent: 'STAR',
      ForkEvent: 'FORK', PublicEvent: 'PUBLIC', DeleteEvent: 'DELETE'
    };
    const rows = events.map(e => {
      const short = e.repo.split('/').pop();
      const kind = label[e.type] || e.type.replace(/Event$/, '').toUpperCase();
      /* The detail cell is always emitted, even when empty. It is a grid
         column: omitting it let auto-placement drop .rf-time into
         column 3 instead of column 4, so the timestamp silently shifted
         left on every row without a message. An empty span holds the
         column open and keeps every row aligned. */
      const detail = e.detail || '';
      return `<li class="rf-row">
        <span class="rf-kind" data-k="${esc(kind)}">${esc(kind)}</span>
        <span class="rf-repo">${esc(short)}</span>
        <span class="rf-msg">${esc(detail)}</span>
        <span class="rf-time">${esc(relTime(e.at))}</span>
      </li>`;
    }).join('');
    box.innerHTML = `<div class="rf-head">
        <span class="rf-title mono">RECON FEED // LIVE</span>
        <span class="rf-src mono">via public GitHub activity</span>
      </div>
      <ul class="rf-list">${rows}</ul>`;
    box.hidden = false;
  }

  /* Orchestrator: cache → paint → (maybe) refresh. */
  function initGitHub() {
    const cfg = D.GITHUB || {};
    const user = cfg.user;
    if (!user) return;
    const ttl = (cfg.ttlHours || 6) * 3600 * 1000;
    const cached = ghReadCache();

    /* 1. Render whatever we already have, immediately. */
    if (cached) {
      ghPaintRepos(cached.repos);
      ghPaintFeed(cached.events);
    }

    /* 2. Decide whether a network request is warranted at all. */
    if (cfg.enabled === false) return;
    const fresh = cached && (Date.now() - cached.at) < ttl;
    if (fresh) return;                       /* inside TTL → zero requests */

    /* 3. Refresh in the background. Nothing waits on this. */
    ghFetch(user).then(res => {
      if (!res) return;                      /* silent: keep cached/hardcoded */
      ghWriteCache(res.repos, res.events);
      ghPaintRepos(res.repos);
      ghPaintFeed(res.events);
    });
  }

  /* ---------- 16. Hero ember field ----------
     Canvas embers rising with a sine sway. Canvas rather than DOM
     because 24 independently-animated nodes is exactly the case where
     the compositor stops helping and layout thrash starts.

     Budget: 24 embers, one rAF loop, DPR-capped at 2. It is created
     only after the loader clears, and destroyed outright under
     reduced-motion or performance mode (checked here AND in CSS, so a
     mode toggle mid-session is honoured — see initToggles' hook).
     RM: never created; the existing CSS .loader-embers remain. */
  let emberRaf = null;
  function initEmberField() {
    if (state.reduced || state.perf) return;
    const hero = $('#home');
    if (!hero || $('#emberField')) return;
    const cv = document.createElement('canvas');
    cv.id = 'emberField';
    cv.setAttribute('aria-hidden', 'true');
    const bg = $('.hero-bg', hero);
    (bg || hero).appendChild(cv);

    const cx = cv.getContext('2d');
    if (!cx) { cv.remove(); return; }
    const DPR = Math.min(2, devicePixelRatio || 1);
    let w = 0, h = 0;
    const resize = () => {
      const r = hero.getBoundingClientRect();
      w = r.width; h = r.height;
      cv.width = Math.round(w * DPR);
      cv.height = Math.round(h * DPR);
      cx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();

    const N = 24;
    const mk = (initial) => ({
      x: Math.random() * w,
      /* start below the fold on first paint so they drift up into view */
      y: initial ? h + Math.random() * h : h + Math.random() * 40,
      r: 0.6 + Math.random() * 1.5,
      vy: 0.18 + Math.random() * 0.42,
      amp: 6 + Math.random() * 16,
      ph: Math.random() * Math.PI * 2,
      sp: 0.004 + Math.random() * 0.008,
      a: 0.25 + Math.random() * 0.5
    });
    const ps = Array.from({ length: N }, () => mk(true));

    const step = () => {
      if (state.reduced || state.perf) { cv.remove(); emberRaf = null; return; }
      cx.clearRect(0, 0, w, h);
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.y -= p.vy;
        p.ph += p.sp;
        const x = p.x + Math.sin(p.ph) * p.amp;
        /* recycle once past the top */
        if (p.y < -12) { ps[i] = mk(false); continue; }
        /* fade in near the bottom edge so nothing pops into existence */
        const fade = Math.min(1, (h - p.y) / 120);
        cx.globalAlpha = p.a * fade;
        cx.fillStyle = '#E39B5A';
        cx.beginPath();
        cx.arc(x, p.y, p.r, 0, Math.PI * 2);
        cx.fill();
      }
      cx.globalAlpha = 1;
      emberRaf = requestAnimationFrame(step);
    };
    emberRaf = requestAnimationFrame(step);
    addEventListener('resize', () => { if (emberRaf) resize(); }, { passive: true });
  }

  /* ---------- 11. Title line split ----------
     Wraps the h1's two sentences in .ht-line spans so they can be
     revealed on separate beats. Done in JS rather than markup so the
     heading keeps its plain semantic text: a screen reader still gets
     one uninterrupted sentence, and a no-JS visitor sees the h1 as
     written. Idempotent — the guard stops a second call from wrapping
     the wrappers. RM: the spans are inert without .split-in. */
  function initHeroTitle() {
    const h1 = $('.hero-title');
    if (!h1 || $('.ht-line', h1)) return;
    /* Split at the crimson word, not at a sentence boundary. An earlier
       version looked for a capital letter starting a new sentence and
       silently did nothing here, because the second sentence begins
       "in the dark." — lowercase. Keying off the .blood element is
       deterministic and matches the design intent: the crimson word
       ends the first line. If that span is ever removed from the
       markup the split simply does not happen, which is the correct
       failure mode — no half-wrapped heading. */
    const blood = $('.blood', h1);
    if (!blood) return;
    const nodes = [...h1.childNodes];
    const cut = nodes.indexOf(blood);
    if (cut < 0 || cut === nodes.length - 1) return;   /* nothing after it */
    const first = nodes.slice(0, cut + 1);
    const rest = nodes.slice(cut + 1);
    /* The whitespace after the span is deliberately NOT stripped.
       .ht-line is display:block, so CSS already collapses leading
       whitespace at the start of the line box — rendering is identical
       either way, but the underlying text keeps its space. An earlier
       version trimmed it, which made textContent read
       "vulnerabilitiesin the dark." and broke both copy-paste and what
       a screen reader announces. */
    h1.textContent = '';
    [first, rest].forEach((group) => {
      const line = document.createElement('span');
      line.className = 'ht-line';
      group.forEach(n => line.appendChild(n));
      h1.appendChild(line);
    });
  }

  /* ---------- 12. Blood drip ----------
     One droplet forms at the title's baseline and falls. Rate-limited
     to at most one per 30s so it stays an event, not a leak. RM: never
     created. */
  let dripTimer = null;
  function initBloodDrip() {
    if (state.reduced || state.perf) return;
    const title = $('.hero-title');
    if (!title) return;
    const drop = () => {
      if (state.reduced || state.perf) return;
      /* Anchor under the crimson word, so the blood appears to come
         from the word that means it. Falls back to the title itself. */
      const blood = $('.blood', title) || title;
      const tr = title.getBoundingClientRect();
      const br = blood.getBoundingClientRect();
      const el = document.createElement('span');
      el.className = 'blood-drip';
      el.setAttribute('aria-hidden', 'true');
      el.style.left = (br.left - tr.left + br.width * (0.3 + Math.random() * 0.4)).toFixed(1) + 'px';
      el.style.top = (br.bottom - tr.top - 2).toFixed(1) + 'px';
      title.appendChild(el);
      setTimeout(() => el.remove(), 1700);
      dripTimer = setTimeout(drop, 30000);
    };
    /* First drip a beat after the loader clears, then every 30s. */
    dripTimer = setTimeout(drop, 2200);
  }

  /* ---------- 21/23/29 · Nav chrome ----------
     A single sliding underline, a section counter, and the moon-phase
     glyph rotation. All three read the same scroll-spy result, so they
     are driven from one place rather than three observers. */
  function initNavChrome() {
    const nav = $('#navbar');
    const links = $$('.nav-link');
    const counter = $('#navCounter');
    const moonGlyph = $('#navMoon');
    if (!nav || !links.length) return;

    /* 21. The indicator is one element moved to the active link's box.
       transform+width only — no layout thrash. Hidden when the active
       link is off-screen (mobile menu collapsed) so it cannot float
       over unrelated chrome. */
    let ind = $('.nav-ind', nav);
    if (!ind) {
      ind = document.createElement('span');
      ind.className = 'nav-ind';
      ind.setAttribute('aria-hidden', 'true');
      nav.appendChild(ind);
    }
    const moveInd = (link) => {
      if (!link || !link.offsetParent) { ind.classList.remove('on'); return; }
      const r = link.getBoundingClientRect();
      const nr = nav.getBoundingClientRect();
      ind.style.width = r.width + 'px';
      ind.style.transform = `translate(${r.left - nr.left}px,0)`;
      ind.classList.add('on');
    };
    /* expose for the spy below */
    nav._moveInd = moveInd;

    /* 23. Section counter — "03/09". RM: static text, no transition. */
    if (counter) {
      const secs = $$('section[id]');
      nav._counter = () => {
        const mid = scrollY + innerHeight * 0.4;
        let idx = 0;
        secs.forEach((s, i) => { if (s.offsetTop <= mid) idx = i; });
        const total = String(secs.length).padStart(2, '0');
        counter.innerHTML = `<b>${String(idx + 1).padStart(2, '0')}</b>/${total}`;
      };
    }

    /* 39. Moon glyph rotates a full turn across the page. RM: static. */
    nav._moon = (frac) => {
      if (!moonGlyph) return;
      moonGlyph.style.transform = `rotate(${(frac * 360).toFixed(1)}deg)`;
    };
  }

  /* ---------- 26 · Back-to-top progress ring ---------- */
  function initBackTopRing() {
    const btn = $('#backTop');
    if (!btn || $('.bt-ring', btn)) return;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'bt-ring');
    svg.setAttribute('viewBox', '0 0 56 56');
    svg.setAttribute('aria-hidden', 'true');
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', '28'); c.setAttribute('cy', '28'); c.setAttribute('r', '26');
    /* circumference = 2πr; the dash offset is driven from scroll */
    const CIRC = 2 * Math.PI * 26;
    c.setAttribute('stroke-dasharray', CIRC.toFixed(2));
    c.setAttribute('stroke-dashoffset', CIRC.toFixed(2));
    svg.appendChild(c);
    btn.appendChild(svg);
    btn._ring = (frac) => {
      c.setAttribute('stroke-dashoffset', (CIRC * (1 - frac)).toFixed(2));
    };
  }

  /* ---------- 31 · Divider embers ----------
     Embers drift up off the crimson rule that sits under every section
     title (`.section-title::after`). That rule IS the page's divider
     motif, so it is the honest anchor for this — an earlier version
     queried `.section-divider`, an element that has never existed, and
     silently did nothing.

     The rule is a pseudo-element and cannot hold children, so the host
     is the `.section-title` itself; `.divider-ember` is absolutely
     positioned to sit on the rule (see the CSS). `.section-title`
     already establishes no stacking context of its own, so the embers
     are given a low z-index there rather than a wrapper element.

     RM: not created. Perf: not created — this is pure decoration and
     is the first thing that should go when the visitor asks for less. */
  function initDividerEmbers() {
    if (state.reduced || state.perf) return;
    const hosts = $$('.section-title');
    if (!hosts.length) return;
    hosts.forEach(h => {
      if (h.querySelector('.divider-ember')) return;
      /* the rule is 64px wide and left-aligned, so the embers are
         confined to that span via --ex */
      for (let i = 0; i < 3; i++) {
        const e = document.createElement('span');
        e.className = 'divider-ember';
        e.setAttribute('aria-hidden', 'true');
        e.style.setProperty('--ex', (6 + Math.random() * 52).toFixed(1) + 'px');
        e.style.animationDelay = (Math.random() * 2.2).toFixed(2) + 's';
        e.style.animationDuration = (1.3 + Math.random() * 0.9).toFixed(2) + 's';
        h.appendChild(e);
      }
    });
  }

  /* ---------- 36 · Scanline overlay ----------
     One fixed overlay for the whole page, its density raised with depth.
     RM: constant opacity, and it stays (it is texture, not motion). */
  function initScanlineOverlay() {
    if ($('.scanline-overlay')) return;
    const el = document.createElement('div');
    el.className = 'scanline-overlay';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
  }

  /* ---------- 33/35/40 · Section depth effects ----------
     Sticky eyebrows are CSS. This handles the per-section parallax and
     the stamp press, both driven from one rAF. RM: neither runs. */
  function initSectionDepth() {
    const secs = $$('section[id]');
    secs.forEach(s => {
      /* 35. opt cards into a small parallax */
      $$('.project-card, .skill-card, .tl-item', s).forEach((c, i) => {
        c.dataset.scrollDepth = String((i % 3) + 1);
      });
    });
    /* 40. stamps press when their section reaches 40% of the viewport */
    const stamps = $$('.stamp-press');
    if (stamps.length) {
      const io = new IntersectionObserver(es => {
        es.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('pressed'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -60% 0px' });
      stamps.forEach(s => io.observe(s));
    }
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('no-scroll');
    initToggles();
    initPortraitMedia();
    renderAbout();
    initBioRedaction();
    renderSkills();
    renderConstellation();
    renderProjects();
    /* after renderProjects — it paints into the cards that renderer made */
    initGitHub();
    renderHunt();
    renderExperience();
    renderCerts();
    renderEthics();
    renderDossier();
    renderAvailability();
    renderContactChannels();
    initTerminal();
    spawnBats();
    initPointerFX();
    /* 21/38. initNav() owns the hamburger, the scroll-spy that sets
       .is-active, and the anchor landing flash. It had been defined but
       never called since commit 3542ac0 — so the mobile menu never
       opened and no link was ever marked active. It must run BEFORE
       initNavChrome(), which publishes nav._moveInd for the spy to use;
       the spy is guarded (`nav._moveInd && …`) so an order slip would
       degrade silently rather than throw. */
    initNav();
    initNavChrome();
    initScrollFX();
    initTyped();
    initForm();
    initFooter();
    initModal();
    initEasterEggs();
    initReveal();
    /* before initLoader — finishLoader() adds .split-in, so the
       .ht-line spans must already exist when it fires */
    initHeroTitle();
    initLoader();
  });
})();
