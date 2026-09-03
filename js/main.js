/* ============================================
   ZIM :: SYSTEM_OPERATOR — Motion Engine
   Core: Three.js matrix rain, GSAP scroll,
   Locomotive smooth scroll, custom cursor,
   terminal boot, tilt, reveals.
   ============================================ */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const state = { booted: false, loco: null, matrix: null, activeFilter: "all" };

  /* ============ HELPERS ============ */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ============================================
     1. CUSTOM CURSOR
     ============================================ */
  function initCursor() {
    if (isTouch || prefersReduced) return;
    const dot = $("[data-cursor-dot]");
    const ring = $("[data-cursor-ring]");
    if (!dot || !ring) return;

    let mx = -100, my = -100, rx = -100, ry = -100;
    const interactives = "a, button, .btn, .filter-btn, .node-card, .project-card, .skill-card, .lang-chip";

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
    });

    document.addEventListener("mousedown", () => ring.classList.add("clicking"));
    document.addEventListener("mouseup", () => ring.classList.remove("clicking"));

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(interactives)) ring.classList.add("hovering");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(interactives)) ring.classList.remove("hovering");
    });

    (function followRing() {
      rx = lerp(rx, mx, 0.14);
      ry = lerp(ry, my, 0.14);
      ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      requestAnimationFrame(followRing);
    })();
  }

  /* ============================================
     2. 3D MATRIX RAIN (Three.js)
     ============================================ */
  function initMatrix() {
    const canvas = $("#matrix-canvas");
    if (!canvas || !window.THREE) return;
    if (prefersReduced) { canvas.style.display = "none"; return; }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 18;

    // --- Glyph atlas ---
    const glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFXYZ#@$%&";
    const GLYPH_COUNT = 32;
    const atlasCanvas = document.createElement("canvas");
    atlasCanvas.width = 256 * GLYPH_COUNT;
    atlasCanvas.height = 256;
    const ctx = atlasCanvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, atlasCanvas.width, atlasCanvas.height);
    ctx.font = "200px 'Share Tech Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < GLYPH_COUNT; i++) {
      const ch = glyphs[i % glyphs.length];
      ctx.fillStyle = "#00ff41";
      ctx.fillText(ch, i * 256 + 128, 128);
    }
    const atlas = new THREE.CanvasTexture(atlasCanvas);
    atlas.minFilter = THREE.LinearFilter;
    atlas.magFilter = THREE.LinearFilter;

    // --- Points ---
    const COLS = 46, ROWS = 90, DEPTH_SPREAD = 22;
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const baseY = new Float32Array(count);
    const speeds = new Float32Array(count);
    const seeds = new Float32Array(count);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);

    let idx = 0;
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        positions[idx * 3] = (c / (COLS - 1) - 0.5) * 32;
        baseY[idx] = (r / (ROWS - 1)) * 40 - 20;
        positions[idx * 3 + 1] = baseY[idx];
        positions[idx * 3 + 2] = (Math.random() - 0.5) * DEPTH_SPREAD;
        speeds[idx] = 3 + Math.random() * 9;
        seeds[idx] = Math.random();
        alphas[idx] = 0.25 + Math.random() * 0.75;
        sizes[idx] = 0.5 + Math.random() * 1.1;
        idx++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aBaseY", new THREE.BufferAttribute(baseY, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uAtlas: { value: atlas },
        uGlyphs: { value: GLYPH_COUNT },
        uRange: { value: 40 },
        uPixelRatio: { value: renderer.getPixelRatio() }
      },
      vertexShader: `
        attribute float aBaseY;
        attribute float aSpeed;
        attribute float aSeed;
        attribute float aAlpha;
        attribute float aSize;
        uniform float uTime;
        uniform float uRange;
        uniform float uPixelRatio;
        varying float vAlpha;
        varying float vSeed;
        void main() {
          float y = mod(aBaseY - uTime * aSpeed, uRange) - uRange * 0.5;
          vec3 pos = vec3(position.x, y, position.z);
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * (24.0 / -mv.z) * uPixelRatio;
          vAlpha = aAlpha;
          vSeed = aSeed;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uAtlas;
        uniform float uGlyphs;
        varying float vAlpha;
        varying float vSeed;
        void main() {
          float g = floor(fract(vSeed) * uGlyphs);
          vec2 uv = vec2(gl_PointCoord.x / uGlyphs + g / uGlyphs, gl_PointCoord.y);
          vec4 tex = texture2D(uAtlas, uv);
          if (tex.a < 0.1) discard;
          float glow = vAlpha * (0.6 + 0.4 * sin(vSeed * 40.0 + g));
          gl_FragColor = vec4(0.0, 1.0, 0.25, glow * tex.a);
        }
      `
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Subtle background particles for depth
    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 300;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 50;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      dustPos[i * 3 + 2] = -10 - Math.random() * 30;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x00ff41, size: 0.12, transparent: true, opacity: 0.25
    });
    scene.add(new THREE.Points(dustGeo, dustMat));

    // Mouse parallax
    let mx = 0, my = 0, tx = 0, ty = 0;
    document.addEventListener("mousemove", (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const clock = new THREE.Clock();
    let visible = true;
    document.addEventListener("visibilitychange", () => {
      visible = !document.hidden;
      clock.getDelta();
    });

    (function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      const t = clock.getElapsedTime();
      mat.uniforms.uTime.value = t;
      tx = lerp(tx, mx, 0.03);
      ty = lerp(ty, my, 0.03);
      camera.position.x = tx * 1.4;
      camera.position.y = -ty * 0.9;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    })();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      mat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    });

    state.matrix = { scene, camera, renderer };
  }

  /* ============================================
     3. BOOT SEQUENCE
     ============================================ */
  function bootSequence(callback) {
    const boot = $("#boot");
    const log = $("#bootLog");
    const bar = $("#bootBar");
    const status = $("#bootStatus");
    if (!boot) { callback(); return; }

    const lines = (window.BOOT_LINES || []).slice(0, prefersReduced ? 4 : undefined);
    let i = 0;

    const typeLine = () => {
      if (i >= lines.length) { finishBoot(); return; }
      const line = lines[i];
      const p = document.createElement("p");
      p.className = `boot__${line.type}`;
      p.textContent = (i === 0 ? "" : "  ") + line.text;
      log.appendChild(p);
      log.scrollTop = log.scrollHeight;
      bar.style.width = Math.round(((i + 1) / lines.length) * 100) + "%";
      status.textContent = line.text.split(".")[0].toUpperCase() + "...";
      i++;
      setTimeout(typeLine, prefersReduced ? 30 : 120 + Math.random() * 180);
    };

    const finishBoot = () => {
      bar.style.width = "100%";
      status.textContent = "BOOT_COMPLETE :: ACCESS_GRANTED";
      setTimeout(() => {
        boot.classList.add("hidden");
        state.booted = true;
        document.body.classList.add("booted");
        callback();
      }, prefersReduced ? 100 : 500);
    };

    setTimeout(typeLine, prefersReduced ? 50 : 300);
  }

  /* ============================================
     4. LOCOMOTIVE SCROLL + SCROLLTRIGGER
     ============================================ */
  function initScroll() {
    if (prefersReduced || !window.LocomotiveScroll) {
      if (window.gsap) {
        gsap.registerPlugin(ScrollTrigger);
        $$("[data-split]").forEach((el) => splitHeadline(el));
      }
      initScrollAnimations();
      return;
    }

    const loco = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]"),
      smooth: true,
      multiplier: 1,
      lerp: 0.09,
      smartphone: { smooth: false },
      tablet: { smooth: false }
    });
    state.loco = loco;

    gsap.registerPlugin(ScrollTrigger);
    loco.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("[data-scroll-container]", {
      scrollTop(value) {
        return arguments.length
          ? loco.scrollTo(value, { duration: 0, disableLerp: true })
          : loco.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: document.querySelector("[data-scroll-container]").style.transform
        ? "transform"
        : "fixed"
    });

    ScrollTrigger.addEventListener("refresh", () => loco.update());
    ScrollTrigger.defaults({ scroller: "[data-scroll-container]" });

    $$("[data-split]").forEach((el) => splitHeadline(el));
    initScrollAnimations();

    setTimeout(() => {
      ScrollTrigger.refresh();
      loco.update();
    }, 100);
  }

  /* ============================================
     5. SPLIT TEXT REVEAL
     ============================================ */
  function splitHeadline(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = "1";
    const text = el.textContent.trim();
    const words = text.split(" ");
    el.innerHTML = words
      .map((word) =>
        `<span class="split-word" aria-hidden="true">${word
          .split("")
          .map((ch) => `<span class="split-char" style="display:inline-block">${ch}</span>`)
          .join("")}</span>`
      )
      .join(" ");
    el.setAttribute("aria-label", text);
  }

  /* ============================================
     6. SCROLL-TRIGGERED ANIMATIONS
     ============================================ */
  function initScrollAnimations() {
    if (!window.gsap) return;

    // Section title reveal
    $$("[data-split]").forEach((el) => {
      const chars = $$(".split-char", el);
      if (!chars.length) return;
      gsap.fromTo(chars, {
        opacity: 0.1, y: 20, filter: "blur(6px)"
      }, {
        opacity: 1, y: 0, filter: "blur(0px)",
        stagger: 0.025,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });

    // Skill bars
    $$(".skill-card__bar-fill").forEach((bar) => {
      const target = parseInt(bar.dataset.skill, 10) || 0;
      const label = bar.closest(".skill-card").querySelector(".skill-card__bar-label");
      gsap.to(bar, {
        width: target + "%",
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: { trigger: bar, start: "top 90%", once: true },
        onUpdate() {
          if (label) label.textContent = Math.round(this.progress * target) + "%";
        }
      });
    });

    // Lang chips pop-in
    $$(".lang-chip").forEach((chip, i) => {
      gsap.fromTo(chip, { opacity: 0, scale: 0.6, y: 20 }, {
        opacity: 1, scale: 1, y: 0,
        delay: (i % 5) * 0.06,
        duration: 0.5,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: ".skills__langs", start: "top 90%", once: true }
      });
    });

    // Section reveals
    $$(".section").forEach((section) => {
      gsap.fromTo(section.querySelectorAll(".about__info, .about__terminal, .thm__card, .contact__terminal, .projects__footer, .contact__grid, .skills__sub"), {
        opacity: 0, y: 50
      }, {
        opacity: 1, y: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%", once: true }
      });
    });

    // Project cards stagger
    $$(".project-card").forEach((card) => {
      gsap.fromTo(card, { opacity: 0, y: 40, scale: 0.98 }, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 92%", once: true }
      });
    });

    // Nav hide/show
    let lastY = 0;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        const nav = $(".nav");
        if (!nav) return;
        if (self.scroll() > lastY && self.scroll() > 200) nav.classList.add("hidden");
        else nav.classList.remove("hidden");
        lastY = self.scroll();
      }
    });

    // Active nav highlighting
    const links = $$(".nav__link");
    $$("section[id]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onToggle(self) {
          if (!self.isActive) return;
          links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + section.id));
        }
      });
    });

    // Parallax on THM bg
    gsap.fromTo(".thm__bg", { y: -30 }, {
      y: 30,
      ease: "none",
      scrollTrigger: { trigger: ".section--dark", start: "top bottom", end: "bottom top", scrub: 1 }
    });

    // Footer ascii reveal
    gsap.fromTo(".footer__ascii pre", { opacity: 0, letterSpacing: "-4px" }, {
      opacity: 0.7, letterSpacing: "0px",
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: { trigger: ".footer", start: "top 85%", once: true }
    });

    // Hero entrance (delayed until boot completes)
    gsap.set(".hero__status-line, .hero__title-line--1 .glitch, .hero__title-line--2 .glitch, .hero__typing, .hero__badges, .hero__cta, .hero__terminal, .hero__scroll-indicator", {
      opacity: 0, y: 40
    });
  }

  /* ============================================
     7. HERO ANIMATIONS (after boot)
     ============================================ */
  function initHero() {
    if (!window.gsap) {
      // Fallback: reveal everything
      $$(".hero__status-line, .hero__title-line, .hero__typing, .hero__badges, .hero__cta, .hero__terminal, .hero__scroll-indicator")
        .forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
      startTyping();
      return;
    }

    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(".hero__status-line", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .to(".hero__title-line--1 .glitch", { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }, "-=0.3")
      .to(".hero__title-line--2 .glitch", { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }, "-=0.6")
      .to(".hero__typing", { opacity: 1, y: 0, duration: 0.5 }, "-=0.5")
      .add(() => startTyping())
      .to(".hero__badges", { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: "back.out(1.7)" }, "-=0.2")
      .to(".hero__cta .btn", { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }, "-=0.2")
      .to(".hero__terminal", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.3")
      .to(".hero__scroll-indicator", { opacity: 1, y: 0, duration: 0.5 }, "-=0.4");
  }

  /* ============================================
     8. TERMINAL TYPING (hero)
     ============================================ */
  function startTyping() {
    const el = $("#heroTyping");
    const lines = window.TYPING_LINES || [];
    if (!el || !lines.length) return;

    let lineIdx = 0, charIdx = 0, deleting = false;
    let timer;

    const tick = () => {
      const full = lines[lineIdx];
      el.innerHTML = "";
      const span = document.createElement("span");
      span.textContent = full.slice(0, charIdx);
      const cursor = document.createElement("span");
      cursor.className = "cursor-typed";
      cursor.textContent = "▌";
      el.appendChild(span);
      el.appendChild(cursor);

      if (!deleting && charIdx < full.length) {
        charIdx++;
        timer = setTimeout(tick, 28 + Math.random() * 45);
      } else if (deleting && charIdx > 0) {
        charIdx--;
        timer = setTimeout(tick, 12);
      } else if (!deleting) {
        deleting = true;
        timer = setTimeout(tick, 2200);
      } else {
        deleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
        timer = setTimeout(tick, 300);
      }
    };
    tick();
  }

  /* ============================================
     9. PROJECT RENDERING + FILTERS
     ============================================ */
  function renderProjects() {
    const grid = $("#projectsGrid");
    if (!grid) return;
    const repos = (window.REPOS || []).filter((r) => r.cat !== "dev" || true);
    grid.innerHTML = repos.map(projectCardHTML).join("");
    bindTilt();
    if (window.gsap) {
      // Re-stagger after render
      $$(".project-card", grid).forEach((card) => {
        gsap.fromTo(card, { opacity: 0, y: 40, scale: 0.98 }, {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 92%", once: true }
        });
      });
      if (state.loco) ScrollTrigger.refresh();
    }
  }

  function projectCardHTML(r) {
    const tags = (r.tags || []).slice(0, 4).map((t) => `<span class="project-card__tag">#${t}</span>`).join("");
    return `
      <article class="project-card" data-cat="${r.cat}" data-tilt>
        <div class="project-card__top">
          <span class="project-card__icon">${r.icon || "⚙️"}</span>
          <span class="project-card__stars">★ ${r.stars || 0} &nbsp;⑂ ${r.forks || 0}</span>
        </div>
        <h3 class="project-card__name">
          <a href="${r.url}" target="_blank" rel="noopener" aria-label="Open ${r.name} on GitHub">${r.name}</a>
        </h3>
        <p class="project-card__desc">${r.desc}</p>
        <div class="project-card__tags">
          <span class="project-card__lang">${r.lang || "N/A"}</span>
          ${tags}
        </div>
      </article>
    `;
  }

  function initFilters() {
    $$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".filter-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const filter = btn.dataset.filter;
        state.activeFilter = filter;
        $$(".project-card").forEach((card) => {
          const show = filter === "all" || card.dataset.cat === filter;
          gsap.to(card, {
            opacity: show ? 1 : 0,
            scale: show ? 1 : 0.9,
            duration: 0.3,
            ease: "power2.out",
            onComplete() {
              card.style.display = show ? "" : "none";
              if (show) gsap.fromTo(card, { y: 20 }, { y: 0, duration: 0.4, ease: "power3.out" });
              if (state.loco) ScrollTrigger.refresh();
            }
          });
        });
      });
    });
  }

  /* ============================================
     10. 3D TILT
     ============================================ */
  function bindTilt() {
    if (isTouch || prefersReduced) return;
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ============================================
     11. COUNT-UP STATS
     ============================================ */
  function initCounters() {
    $$("[data-count]").forEach((el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || "";
      const animate = () => {
        if (prefersReduced) { el.textContent = target + suffix; return; }
        const duration = 1800;
        const start = performance.now();
        const step = (now) => {
          const p = clamp((now - start) / duration, 0, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      if (window.gsap && window.ScrollTrigger) {
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: animate
        });
      } else {
        // Fallback: animate when scrolled into view
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) { animate(); io.disconnect(); }
          });
        }, { threshold: 0.5 });
        io.observe(el);
      }
    });
  }

  /* ============================================
     12. ABOUT TERMINAL TYPING
     ============================================ */
  function initAboutTerminal() {
    const body = $(".about__terminal-body");
    if (!body) return;
    const lines = window.ABOUT_LINES || [];

    const reveal = (i) => {
      if (i >= lines.length) return;
      const line = lines[i];
      const p = document.createElement("p");
      p.className = "term-line";

      if (line.out === ">") {
        p.classList.add("term-sep");
        p.textContent = "  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓";
      } else if (line.out) {
        p.classList.add("term-out");
        p.textContent = line.out;
      } else {
        const prompt = document.createElement("span");
        prompt.className = "term-prompt";
        prompt.textContent = line.prompt + " ";
        const cmd = document.createElement("span");
        cmd.textContent = line.cmd;
        p.appendChild(prompt);
        p.appendChild(cmd);
      }

      body.appendChild(p);
      body.scrollTop = body.scrollHeight;
      setTimeout(() => reveal(i + 1), prefersReduced ? 20 : 240 + Math.random() * 160);
    };

    if (window.gsap && window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: body,
        start: "top 80%",
        once: true,
        onEnter: () => reveal(0)
      });
    } else {
      reveal(0);
    }
  }

  /* ============================================
     13. THM BADGES POP-IN
     ============================================ */
  function initThmBadges() {
    $$(".thm__badge").forEach((badge, i) => {
      if (!window.gsap) return;
      gsap.fromTo(badge, { opacity: 0, scale: 0.5, y: 20 }, {
        opacity: 1, scale: 1, y: 0,
        delay: (i % 4) * 0.1 + Math.floor(i / 4) * 0.05,
        duration: 0.5,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".thm__badges-grid", start: "top 88%", once: true }
      });
    });
  }

  /* ============================================
     14. NAVIGATION
     ============================================ */
  function initNav() {
    const toggle = $("[data-nav-toggle]");
    const links = $(".nav__links");
    if (toggle) {
      toggle.addEventListener("click", () => links.classList.toggle("is-open"));
    }
    $$("[data-scroll-to]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.getAttribute("href");
        if (state.loco) {
          state.loco.scrollTo(target, { offset: 0, duration: 1200, easing: [0.16, 1, 0.3, 1] });
        } else {
          const el = $(target);
          if (el) el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
        }
        links.classList.remove("is-open");
      });
    });
  }

  /* ============================================
     15. GLITCH STATUS RANDOMIZER
     ============================================ */
  function initGlitchRandomizer() {
    const statuses = ["ACCESS GRANTED", "ROOT PRIVILEGES", "CHANNEL SECURE", "TRACE MASKED", "DOJO ONLINE"];
    const el = $("#heroStatus");
    if (!el) return;
    setInterval(() => {
      el.textContent = statuses[Math.floor(Math.random() * statuses.length)];
    }, 4000);
  }

  /* ============================================
     BOOT
     ============================================ */
  document.addEventListener("DOMContentLoaded", () => {
    // Pre-build everything hidden, then boot
    initMatrix();
    initCursor();
    renderProjects();

    bootSequence(() => {
      initScroll();
      initHero();
      initAboutTerminal();
      initNav();
      initFilters();
      initCounters();
      initThmBadges();
      initGlitchRandomizer();

      // Hide loader
      const loader = $("#loader");
      if (loader) loader.classList.add("hidden");

      // Force hero reveal even if GSAP failed to load
      setTimeout(() => {
        if (!window.gsap) initHero();
      }, 500);
    });
  });

  window.__ZIM_STATE__ = state;
})();
