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
    if (seen) return finishLoader();
    try { sessionStorage.setItem('nf_booted', '1'); } catch {}

    const lines = $('#loaderLines'), bar = $('#loaderBar'), skip = $('#skipIntro');
    const seq = D.BOOT_LINES || [];
    let done = false, i = 0;
    const finish = () => { if (done) return; done = true; finishLoader(); };
    const tick = () => {
      if (done) return;
      if (i < seq.length) {
        const div = document.createElement('div');
        div.className = 'll' + (seq[i].includes('GRANTED') ? ' ok' : '');
        div.textContent = '> ' + seq[i];
        lines.appendChild(div);
        requestAnimationFrame(() => div.classList.add('on'));
        if (bar) bar.style.width = Math.round(((i + 1) / seq.length) * 100) + '%';
        /* occasional glitch-flash between lines, reusing the RGB-split
           text-shadow trick from the motif vocabulary. Fires on roughly
           one line in three so it reads as unstable signal, not as a
           broken animation. */
        if (i > 0 && Math.random() < 0.34) {
          div.classList.add('glitch-once');
          setTimeout(() => div.classList.remove('glitch-once'), 520);
        }
        i++;
        setTimeout(tick, 380);
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
    /* Hard cap, derived from the actual line count rather than a magic
       number: at 380ms/line a longer BOOT_LINES list would otherwise
       outrun a fixed timeout and get cut off mid-sentence. The +900ms
       covers the flash beat. Whichever comes first wins — the user is
       never trapped behind the intro. */
    setTimeout(finish, 260 + seq.length * 380 + 900);
  }
  function finishLoader() {
    const loader = $('#loader');
    if (loader) { loader.classList.add('done'); setTimeout(() => loader.remove(), 900); }
    document.body.classList.remove('no-scroll');
    /* one-time hero glitch reveal — fires when the loader clears */
    const h1 = $('.hero-title');
    if (h1 && !state.reduced) {
      h1.classList.add('glitch-once');
      setTimeout(() => h1.classList.remove('glitch-once'), 560);
    }
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
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => spy.observe(s));
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
    [[0, 36], [32, 36], [64, 36]].forEach(([top, h], i) => {
      const bar = document.createElement('span');
      bar.className = 'redact-bar';
      bar.setAttribute('aria-hidden', 'true');
      bar.style.top = top + '%';
      bar.style.height = h + '%';
      bar.style.transitionDelay = (i * 0.12) + 's';
      bio.appendChild(bar);
    });
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      bio.classList.add('in');
      io.disconnect();
    }, { threshold: 0.35 });
    io.observe(bio);
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

    /* --- edges --- */
    const edgeEls = edges.map(([a, b]) => {
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', pts[a][0]); ln.setAttribute('y1', pts[a][1]);
      ln.setAttribute('x2', pts[b][0]); ln.setAttribute('y2', pts[b][1]);
      ln.setAttribute('class', 'cg-edge');
      ln.dataset.a = a; ln.dataset.b = b;
      /* draw-in: dash the full length, then retract to zero.
         Reduced motion → skipped (handled in the reveal block). */
      if (!state.reduced) {
        const len = Math.hypot(pts[b][0] - pts[a][0], pts[b][1] - pts[a][1]);
        ln.style.strokeDasharray = len;
        ln.style.strokeDashoffset = len;
      }
      svg.appendChild(ln);
      return ln;
    });

    /* --- decorative signal travelling the edges --- */
    const signal = document.createElementNS(NS, 'circle');
    signal.setAttribute('r', '1.1');
    signal.setAttribute('class', 'cg-signal');
    signal.setAttribute('cx', pts[0][0]);
    signal.setAttribute('cy', pts[0][1]);
    if (!state.reduced) svg.appendChild(signal);

    /* --- nodes --- */
    const nodeEls = [];
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

      /* fade-in, staggered — skipped under reduced motion */
      if (!state.reduced) {
        g.style.opacity = '0';
        g.style.transition = 'opacity .4s ease';
      }
      svg.appendChild(g);
      nodeEls.push(g);
    });

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
    function select(i) {
      current = i;
      const s = skills[i];
      const conns = [...adj[i]].map(x => skills[x].name);
      readout.innerHTML = `
        <div class="cg-readout-head">
          <span class="cg-readout-icon" aria-hidden="true">${s.icon}</span>
          <span class="cg-readout-name">${esc(s.name)}</span>
          <span class="cg-readout-level">${s.level}%</span>
        </div>
        <p class="cg-readout-desc">${esc(s.desc)}</p>
        <div class="cg-readout-tools">${s.tools.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <p class="cg-readout-links">LINKED TO: <b>${conns.length ? esc(conns.join(' · ')) : 'no links'}</b></p>`;
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
    }
    function clear() {
      current = -1;
      nodeEls.forEach(el => {
        el.classList.remove('is-lit', 'is-dim');
        el.setAttribute('aria-pressed', 'false');
      });
      edgeEls.forEach(ln => ln.classList.remove('is-lit', 'is-dim'));
      readout.innerHTML = `<p class="cg-readout-desc" style="margin:0">Select a node to inspect a discipline — its level, tooling, and what it connects to.</p>`;
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

    /* --- entrance: reveal when scrolled into view ---
       Reduced motion → everything visible immediately, no transition. */
    if (state.reduced) {
      nodeEls.forEach(el => { el.style.opacity = '1'; });
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
        /* …then nodes fade in */
        nodeEls.forEach((el, k) => {
          setTimeout(() => { el.style.opacity = '1'; }, 180 + k * 60);
        });
        startSignal();
      }, { threshold: 0.25 });
      io.observe(box);
    }

    /* --- signal dot: walks the edge list, pauses offscreen --- */
    let signalRaf = null, running = false, seg = 0, t = 0;
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
    return `
      <article class="project-card reveal" data-cat="${p.cat}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="${esc(p.name)} case study">
        <div class="project-thumb"><span class="pt-number">// ${String(i + 1).padStart(2, '0')}</span><span class="pt-status ${status}">${esc(p.status)}</span><span class="pt-glyph" aria-hidden="true">${p.icon}</span></div>
        ${p.fork ? `<p class="fork-flag" title="${esc(p.upstream ? 'Fork of ' + p.upstream : 'A fork, not original work')}"><span aria-hidden="true">⑂</span> FORK${p.upstream ? ' — ' + esc(p.upstream) : ''}</p>` : ''}
        <div class="project-body">
          <p class="project-cat">${esc(cat)}</p>
          <h3 class="project-name">${esc(p.name)}</h3>
          <p class="project-tagline">${esc(p.tagline)}</p>
          <p class="project-desc">${esc(p.desc)}</p>
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
      `<a class="archive-card" href="${p.url}" target="_blank" rel="noopener noreferrer"><span class="ac-head"><span class="ac-name">${p.icon} ${esc(p.name)}${p.fork ? ' <em class="ac-fork">FORK</em>' : ''}</span><span class="ac-stars">★ ${p.stars}</span></span><span class="ac-desc">${esc(p.desc)}</span></a>`).join('');
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
      const magnets = $$('.hero-cta .btn');
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
    let raf = null;
    const track = () => {
      raf = null;
      const max = document.documentElement.scrollHeight - innerHeight;
      const frac = max > 0 ? scrollY / max : 0;
      if (bar) bar.style.transform = `scaleY(${frac})`;
      if (top) top.classList.toggle('show', scrollY > 600);

      /* Light the minimap ticks that have been scrolled past (§3.2).
         Compared by offsetTop rather than by index so it stays correct
         regardless of DOM order or how many sections exist. */
      const ticks = $$('.sp-tick');
      for (let i = 0; i < ticks.length; i++) {
        const at = ticks[i].dataset.at;
        const sec = at && document.getElementById(at);
        ticks[i].classList.toggle('is-passed', !!sec && sec.offsetTop <= scrollY + innerHeight * 0.4);
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
        v.setAttribute('aria-label', old.alt);
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
    renderHunt();
    renderExperience();
    renderCerts();
    renderEthics();
    renderContactChannels();
    initTerminal();
    spawnBats();
    initPointerFX();
    initScrollFX();
    initTyped();
    initForm();
    initFooter();
    initModal();
    initEasterEggs();
    initReveal();
    initLoader();
  });
})();
