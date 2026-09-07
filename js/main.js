/* =========================================================
   NIGHTFALL PROTOCOL — main.js
   Vanilla JS. No dependencies. Decorative effects only.
   ========================================================= */
(() => {
  'use strict';
  const D = window.NF_DATA || {};
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  const state = {
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    perf: false,
    filter: 'all'
  };

  const store = {
    get(k, fb) { try { const v = localStorage.getItem('nf_' + k); return v === null ? fb : JSON.parse(v); } catch { return fb; } },
    set(k, v) { try { localStorage.setItem('nf_' + k, JSON.stringify(v)); } catch {} }
  };

  /* ---------- Loading screen ---------- */
  function initLoader() {
    const loader = $('#loader');
    if (!loader) return finishLoader();
    if (state.reduced || store.get('skipIntro', false)) return finishLoader();
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
        i++;
        setTimeout(tick, 330);
      } else setTimeout(finish, 420);
    };
    skip.addEventListener('click', finish);
    setTimeout(tick, 300);
    setTimeout(finish, 4200); /* hard cap — never trap the user */
  }
  function finishLoader() {
    const loader = $('#loader');
    if (loader) { loader.classList.add('done'); setTimeout(() => loader.remove(), 900); }
    document.body.classList.remove('no-scroll');
    store.set('skipIntro', true); /* auto-skip on repeat visits */
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
    const sections = ['home', 'about', 'skills', 'projects', 'methodology', 'experience', 'contact']
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

  /* ---------- Skill constellation ---------- */
  function renderConstellation() {
    const box = $('#constellation');
    if (!box || !D.SKILLS) return;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    const pts = D.SKILLS.map((_, i) => {
      const a = (i / D.SKILLS.length) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 ? 36 : 43;
      return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r];
    });
    (D.SKILL_LINKS || []).forEach(([a, b]) => {
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', pts[a][0]); ln.setAttribute('y1', pts[a][1]);
      ln.setAttribute('x2', pts[b][0]); ln.setAttribute('y2', pts[b][1]);
      ln.setAttribute('stroke', 'rgba(230,57,88,.28)'); ln.setAttribute('stroke-width', '.4');
      svg.appendChild(ln);
    });
    box.appendChild(svg);
    D.SKILLS.forEach((s, i) => {
      const n = document.createElement('button');
      n.type = 'button'; n.className = 'const-node';
      n.style.left = pts[i][0] + '%'; n.style.top = pts[i][1] + '%';
      n.setAttribute('aria-label', s.name + ' — level ' + s.level + ' percent');
      n.innerHTML = `${s.icon}<span class="const-tip">${esc(s.name)} · ${s.level}%</span>`;
      box.appendChild(n);
    });
  }

  /* ---------- Projects: featured grid + archive ---------- */
  function projectCard(p, i) {
    const cat = (D.PROJECT_CATS && D.PROJECT_CATS[p.cat]) || p.cat;
    const status = (p.status || '').toLowerCase();
    return `
      <article class="project-card reveal" data-cat="${p.cat}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="${esc(p.name)} case study">
        <div class="project-thumb"><span class="pt-number">// ${String(i + 1).padStart(2, '0')}</span><span class="pt-status ${status}">${esc(p.status)}</span><span class="pt-glyph" aria-hidden="true">${p.icon}</span></div>
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
      `<a class="archive-card" href="${p.url}" target="_blank" rel="noopener noreferrer"><span class="ac-head"><span class="ac-name">${p.icon} ${esc(p.name)}</span><span class="ac-stars">★ ${p.stars}</span></span><span class="ac-desc">${esc(p.desc)}</span></a>`).join('');
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
          <p class="tl-org">${esc(j.org)}</p>
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
    const bg = $('#badgeGrid');
    if (bg && D.CERTS) bg.innerHTML = D.CERTS.map(c =>
      `<div class="badge reveal"><span class="badge-icon" aria-hidden="true">${c.icon}</span><b>${esc(c.title)}</b><p class="b-meta">${esc(c.issuer)} · ${esc(c.date)}</p><a class="b-verify" href="${c.verify}">VERIFY ↗</a></div>`).join('');
    const tb = $('#thmBadges');
    if (tb && D.THM_BADGES) tb.innerHTML = D.THM_BADGES.map(b =>
      `<li><span aria-hidden="true">${b.icon}</span>${esc(b.name)}</li>`).join('');
  }

  /* ---------- NIGHTFALL TERMINAL (decorative only) ---------- */
  function initTerminal() {
    const body = $('#termBody'), form = $('#termForm'), input = $('#termInput');
    if (!body || !form || !input) return;
    const history = [];
    let hIndex = -1;
    const add = (text, cls = 't-out') => {
      const div = document.createElement('div');
      div.className = 't-line ' + cls;
      div.textContent = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
      return div;
    };
    (D.TERMINAL_BOOT || []).forEach((l, i) => setTimeout(() => {
      add(l, i === (D.TERMINAL_BOOT.length - 1) ? 'ok' : 't-out');
    }, state.reduced ? 0 : 350 + i * 420));
    const run = (raw) => {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;
      add(raw, 't-cmd');
      history.unshift(raw); hIndex = -1;
      if (cmd === 'clear') { body.innerHTML = ''; return; }
      const out = (D.TERMINAL_CMDS || {})[cmd];
      if (out) out.forEach(l => add(l));
      else add(`command not found: ${cmd} — type 'help'`, 'err');
      add('');
    };
    form.addEventListener('submit', e => {
      e.preventDefault();
      run(input.value);
      input.value = '';
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') { e.preventDefault(); if (hIndex < history.length - 1) input.value = history[++hIndex] || ''; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); if (hIndex > 0) input.value = history[--hIndex]; else { hIndex = -1; input.value = ''; } }
    });
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
    let px = 0, py = 0, raf = null;
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
  }

  function initScrollFX() {
    const bar = $('#scrollProgress'), top = $('#backTop');
    let raf = null;
    const track = () => {
      raf = null;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = `scaleY(${max > 0 ? scrollY / max : 0})`;
      if (top) top.classList.toggle('show', scrollY > 600);
    }; 
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(track); }, { passive: true });
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
      const s = $('#formSuccess');
      if (ok) {
        if (s) { s.hidden = false; } 
        form.reset();
        Object.values(fields).forEach(f => show(f, true));
        s && s.scrollIntoView({ block: 'nearest', behavior: state.reduced ? 'auto' : 'smooth' });
      } else {
        if (s) s.hidden = true;
        first && first.focus();
      }
    });
  }

  /* ---------- Footer bits ---------- */
  function initFooter() {
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
    ['#privacyLink', '#disclosureLink'].forEach(sel => {
      const a = $(sel);
      a && a.addEventListener('click', e => { e.preventDefault(); a.textContent += ' — placeholder'; setTimeout(() => { a.textContent = a.textContent.replace(' — placeholder', ''); }, 1200); });
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

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('no-scroll');
    initToggles();
    initPortraitMedia();
    renderAbout();
    renderSkills();
    renderConstellation();
    renderProjects();
    renderHunt();
    renderExperience();
    renderCerts();
    initTerminal();
    spawnBats();
    initPointerFX();
    initScrollFX();
    initTyped();
    initForm();
    initFooter();
    initModal();
    initReveal();
    initLoader();
  });
})();
