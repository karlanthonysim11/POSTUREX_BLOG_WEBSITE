/* POSTUREX showcase site — main script (no build step required). */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
   * Site configuration. Fill these in only with verified details.
   * ------------------------------------------------------------------ */
  var CONFIG = {
    // Verified project contact email. Leave empty to hide the email row;
    // the contact form then explains that no address is published yet.
    contactEmail: '',
    youtubeId: 'M0ScVmR_Qwo'
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var icons = function () { if (window.lucide) window.lucide.createIcons(); };
  var escapeHtml = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------------- Theme ---------------- */
  function initTheme() {
    $$('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('posturex-theme', next); } catch (e) {}
      });
    });
  }

  /* ---------------- Navigation ---------------- */
  function initNav() {
    var nav = $('#nav');
    var toggle = $('.menu-toggle');
    var menu = $('#mobile-menu');
    if (!nav) return;

    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (toggle && menu) {
      var setOpen = function (open) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        menu.hidden = !open;
        nav.classList.toggle('menu-open', open);
        toggle.innerHTML = '<i data-lucide="' + (open ? 'x' : 'menu') + '"></i>';
        icons();
      };
      toggle.addEventListener('click', function () { setOpen(menu.hidden); });
      $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); }
      });
      window.addEventListener('resize', function () { if (window.innerWidth > 1080 && !menu.hidden) setOpen(false); });
    }

    // Active-section highlighting
    var links = $$('.nav-links a[data-section]');
    var sections = links.map(function (a) { return document.getElementById(a.dataset.section); }).filter(Boolean);
    if (!('IntersectionObserver' in window) || !sections.length) return;
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) current = en.target.id;
      });
      links.forEach(function (a) {
        var on = a.dataset.section === current;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------------- Reveal + counters ---------------- */
  function initReveal() {
    var els = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      $$('[data-count]').forEach(function (el) { el.textContent = format(el); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        $$('[data-count]', en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el, i) {
      el.style.setProperty('--d', (i % 4) * 70 + 'ms');
      io.observe(el);
    });
  }

  function format(el, v) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.decimals || '0', 10);
    return (v === undefined ? target : v).toFixed(dec);
  }

  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var target = parseFloat(el.dataset.count);
    var start = performance.now();
    var dur = 1400;
    var tick = function (now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(el, target * eased);
      if (p < 1) requestAnimationFrame(tick); else el.textContent = format(el);
    };
    requestAnimationFrame(tick);
  }

  /* ---------------- How it works timeline ---------------- */
  var STEPS = [
    {
      icon: 'gauge', title: 'Sensor Data Collection',
      text: 'Four Force-Sensing Resistors (FSRs) collect pressure-related measurements, while an HC-SR04 ultrasonic sensor obtains distance-related information.',
      detail: ['FSRs at the left-back, right-back, seat-left and seat-right areas', 'HC-SR04 at the top of the backrest measures upper-back separation', 'Seat FSRs also detect whether the chair is occupied']
    },
    {
      icon: 'cpu', title: 'Embedded AI Classification',
      text: 'The ESP32 processes sensor information using an Edge Impulse TinyML model to classify upright, slouched, and leaning sitting postures.',
      detail: ['Inference runs locally on the ESP32', 'Three project-defined classes: upright, slouched, leaning', 'Classification works without the cloud']
    },
    {
      icon: 'bluetooth', title: 'Bluetooth Communication',
      text: 'The ESP32 communicates posture information to the POSTUREX mobile application through Bluetooth Low Energy.',
      detail: ['Built-in ESP32 BLE radio', 'App shows connected and disconnected states', 'Connection-status notice refined after Beta testing']
    },
    {
      icon: 'smartphone', title: 'Real-Time Monitoring',
      text: 'The mobile application displays posture status and applicable corrective feedback during monitoring sessions.',
      detail: ['Start and stop monitoring sessions', 'Live posture status and pressure states', 'App-based corrective feedback, with no buzzer on the chair']
    },
    {
      icon: 'bar-chart-3', title: 'Posture Analytics',
      text: 'Users can review recorded monitoring sessions, posture history, and daily, weekly, and monthly analytics.',
      detail: ['Sessions stored with Supabase', 'Account-scoped records with Row-Level Security', 'Goals and progress views']
    },
    {
      icon: 'message-circle-heart', title: 'AI-Assisted Coaching',
      text: 'The application provides supplementary, non-diagnostic posture-awareness guidance based on summarized monitoring information.',
      detail: ['Uses summarized session data, never raw sensor readings', 'Suggestions, wellness reminders and exercises', 'Not a diagnosis or medical advice']
    }
  ];

  function initTimeline() {
    var list = $('.timeline-steps');
    var panel = $('#timeline-panel');
    var progress = $('.timeline-progress');
    if (!list || !panel) return;

    list.innerHTML = STEPS.map(function (s, i) {
      return '<li class="t-step" role="presentation">' +
        '<button class="t-node" role="tab" type="button" id="t-tab-' + i + '" aria-controls="timeline-panel" aria-selected="false" tabindex="-1" data-i="' + i + '">' +
          '<span class="t-dot"><i data-lucide="' + s.icon + '"></i></span>' +
          '<span class="t-num">Step ' + (i + 1) + '</span>' +
          '<span class="t-title">' + s.title + '</span>' +
        '</button>' +
        '<p class="t-text">' + s.text + '</p>' +
      '</li>';
    }).join('');

    var tabs = $$('.t-node', list);
    var auto = null;

    var select = function (i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        t.parentElement.classList.toggle('active', on);
        t.parentElement.classList.toggle('done', j < i);
      });
      var s = STEPS[i];
      panel.setAttribute('aria-labelledby', 't-tab-' + i);
      panel.innerHTML =
        '<div class="tp-icon"><i data-lucide="' + s.icon + '"></i></div>' +
        '<div class="tp-body"><p class="kicker">Step ' + (i + 1) + ' of ' + STEPS.length + '</p>' +
        '<h3>' + s.title + '</h3><p>' + s.text + '</p>' +
        '<ul>' + s.detail.map(function (d) { return '<li><i data-lucide="check"></i>' + d + '</li>'; }).join('') + '</ul></div>';
      if (progress) progress.style.setProperty('--p', (i / (STEPS.length - 1)) * 100 + '%');
      icons();
      if (focus) tabs[i].focus();
    };

    var stopAuto = function () { if (auto) { clearInterval(auto); auto = null; } };

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { stopAuto(); select(i); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); stopAuto(); select(n, true); }
      });
    });
    select(0);

    // Gently auto-advance once visible until the user interacts.
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var idx = 0;
      var io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting && !auto && !list.dataset.touched) {
          auto = setInterval(function () { idx = (idx + 1) % STEPS.length; select(idx); }, 4200);
        } else if (!en[0].isIntersecting) stopAuto();
      }, { threshold: 0.4 });
      io.observe(list);
      ['pointerdown', 'focusin'].forEach(function (ev) {
        list.addEventListener(ev, function () { list.dataset.touched = '1'; stopAuto(); });
      });
    }
  }

  /* ---------------- App screenshot carousel ---------------- */
  var SCREENS = [
    { src: 'assets/img/app/auth.webp', contain: true, title: 'Authentication', text: 'Create an account and sign in so posture records stay tied to the user.' },
    { src: 'assets/img/app/ble-connect.webp', title: 'BLE device connection', text: 'Connect to the chair sleeve over Bluetooth Low Energy and see the connection state.' },
    { src: 'assets/img/app/live-upright.webp', title: 'Live monitoring: upright', text: 'Live posture status, session time, distance and seat-pressure states.' },
    { src: 'assets/img/app/live-slouched.webp', title: 'Live monitoring: slouched', text: 'App-based corrective feedback when a slouched posture is detected.' },
    { src: 'assets/img/app/live-leaning.webp', title: 'Live monitoring: leaning', text: 'Feedback for a detected leaning posture.' },
    { src: 'assets/img/app/analytics.webp', title: 'Session history & analytics', text: 'Daily, weekly and monthly posture distribution.' },
    { src: 'assets/img/app/goals.webp', title: 'Goals & progress', text: 'Track posture goals over time.' },
    { src: 'assets/img/app/coaching.webp', title: 'AI-assisted coaching', text: 'Supplementary, non-diagnostic posture-awareness guidance.' },
    { src: 'assets/img/app/ai-suggestions.webp', title: 'AI suggestions', text: 'Coaching suggestions based on summarized monitoring information.' }
  ];

  function initCarousel() {
    var track = $('#carousel');
    var dots = $('#carousel-dots');
    if (!track) return;

    track.innerHTML = SCREENS.map(function (s, i) {
      return '<figure class="slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + SCREENS.length + ': ' + s.title + '">' +
        '<div class="phone"><span class="notch" aria-hidden="true"></span>' +
        '<img' + (s.contain ? ' class="contain"' : '') + ' src="' + s.src + '" alt="POSTUREX app screenshot: ' + s.title + '" loading="lazy" /></div>' +
        '<figcaption><strong>' + s.title + '</strong><span>' + s.text + '</span></figcaption></figure>';
    }).join('');
    dots.innerHTML = SCREENS.map(function (s, i) {
      return '<button type="button" aria-label="Show ' + s.title + '" data-i="' + i + '"></button>';
    }).join('');

    var slides = $$('.slide', track);
    var dotBtns = $$('button', dots);

    var go = function (i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      var slide = slides[i];
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft - (track.clientWidth - slide.clientWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    var currentIndex = function () {
      var center = track.scrollLeft + track.clientWidth / 2;
      var best = 0, dist = Infinity;
      slides.forEach(function (s, i) {
        var c = s.offsetLeft - track.offsetLeft + s.clientWidth / 2;
        var d = Math.abs(c - center);
        if (d < dist) { dist = d; best = i; }
      });
      return best;
    };
    var sync = function () {
      var i = currentIndex();
      slides.forEach(function (s, j) { s.classList.toggle('active', i === j); });
      dotBtns.forEach(function (d, j) { d.setAttribute('aria-current', i === j ? 'true' : 'false'); });
    };

    var raf;
    track.addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true });
    $$('[data-carousel]').forEach(function (b) {
      b.addEventListener('click', function () { go(currentIndex() + (b.dataset.carousel === 'next' ? 1 : -1)); });
    });
    dotBtns.forEach(function (d) { d.addEventListener('click', function () { go(+d.dataset.i); }); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(currentIndex() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(currentIndex() - 1); }
    });
    sync();
  }

  /* ---------------- Charts ---------------- */
  var tip = null;
  function showTip(e, html) {
    if (!tip) return;
    tip.innerHTML = html;
    tip.hidden = false;
    var r = e.currentTarget.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = Math.min(window.innerWidth - tw - 8, Math.max(8, r.left + r.width / 2 - tw / 2));
    var y = r.top - th - 10;
    if (y < 8) y = r.bottom + 10;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }
  function hideTip() { if (tip) tip.hidden = true; }
  function bindTips(root) {
    $$('[data-tip]', root).forEach(function (el) {
      var h = function (e) { showTip(e, el.dataset.tip); };
      el.addEventListener('mouseenter', h);
      el.addEventListener('focus', h);
      el.addEventListener('mouseleave', hideTip);
      el.addEventListener('blur', hideTip);
    });
  }

  function initCharts() {
    tip = $('#tooltip');

    // Chart 1: grouped horizontal bars, 0–100% scale, 80% target line.
    var acc = [
      { k: 'CT1', e: [12, 15], f: [25, 30] },
      { k: 'CT2', e: [12, 15], f: [25, 30] },
      { k: 'CT3', e: [13, 15], f: [26, 30] },
      { k: 'Overall', e: [37, 45], f: [76, 90] }
    ];
    var pct = function (a) { return (a[0] / a[1]) * 100; };
    var c1 = $('#chart-accuracy');
    if (c1) {
      c1.innerHTML =
        '<div class="hbar-chart" role="img" aria-label="Accuracy by participant. Earlier: CT1 80.00%, CT2 80.00%, CT3 86.67%, overall 82.22%. September 18: CT1 83.33%, CT2 83.33%, CT3 86.67%, overall 84.44%. Target 80%.">' +
        acc.map(function (r) {
          var ep = pct(r.e), fp = pct(r.f);
          return '<div class="hb-row' + (r.k === 'Overall' ? ' total' : '') + '"><span class="hb-label">' + r.k + '</span><div class="hb-bars">' +
            '<div class="hb-track"><span class="hb-bar earlier" style="--w:' + ep + '%" tabindex="0" data-tip="<b>' + r.k + ' · Earlier</b><br>' + r.e[0] + ' of ' + r.e[1] + ' correct · ' + ep.toFixed(2) + '%"></span><em>' + ep.toFixed(2) + '%</em></div>' +
            '<div class="hb-track"><span class="hb-bar final" style="--w:' + fp + '%" tabindex="0" data-tip="<b>' + r.k + ' · Sept. 18</b><br>' + r.f[0] + ' of ' + r.f[1] + ' correct · ' + fp.toFixed(2) + '%"></span><em>' + fp.toFixed(2) + '%</em></div>' +
          '</div></div>';
        }).join('') +
        '<div class="hb-target" style="--x:80%"><span>80% target</span></div>' +
        '<div class="hb-axis"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>' +
        '</div>';
      bindTips(c1);
    }

    // Chart 2: vertical bars, UAT mean per participant on 0–5 scale.
    var uat = [['P1', 50], ['P2', 50], ['P3', 40], ['P4', 45], ['P5', 50], ['P6', 50], ['P7', 39]];
    var c2 = $('#chart-uat');
    if (c2) {
      c2.innerHTML =
        '<div class="vbar-chart" role="img" aria-label="UAT questionnaire means: P1 5.00, P2 5.00, P3 4.00, P4 4.50, P5 5.00, P6 5.00, P7 3.90. Overall mean 4.63 of 5.">' +
        '<div class="vb-grid"><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div>' +
        '<div class="vb-mean" style="--y:' + (4.63 / 5) * 100 + '%"><span>Mean 4.63</span></div>' +
        '<div class="vb-cols">' +
        uat.map(function (u) {
          var m = u[1] / 10;
          return '<div class="vb-col"><span class="vb-bar" style="--h:' + (m / 5) * 100 + '" tabindex="0" data-tip="<b>' + u[0] + '</b><br>' + u[1] + ' / 50 points · mean ' + m.toFixed(2) + '"><span class="vb-val">' + m.toFixed(2) + '</span></span><span class="vb-label">' + u[0] + '</span></div>';
        }).join('') +
        '</div></div>';
      bindTips(c2);
    }

    // Chart 3: task outcomes out of 55 answered assessments.
    var tasks = [['Easy to complete', 49], ['Completed with difficulty', 5], ['Needed help', 1], ['Could not complete', 0]];
    var c3 = $('#chart-tasks');
    if (c3) {
      c3.innerHTML = '<div class="task-chart" role="img" aria-label="Of 55 answered task assessments: 49 easy to complete, 5 completed with difficulty, 1 needed help, 0 could not complete.">' +
        tasks.map(function (t) {
          var p = (t[1] / 55) * 100;
          return '<div class="tc-row"><div class="tc-top"><span>' + t[0] + '</span><b>' + t[1] + ' <small>(' + p.toFixed(2) + '%)</small></b></div>' +
            '<div class="tc-track"><span class="tc-bar" style="--w:' + Math.max(p, t[1] ? 1.2 : 0) + '%" tabindex="0" data-tip="<b>' + t[0] + '</b><br>' + t[1] + ' of 55 answered"></span></div></div>';
        }).join('') +
        '<p class="tc-note">Unanswered: 1 of 56 possible assessments (excluded)</p></div>';
      bindTips(c3);
    }

    // Table toggles
    $$('[data-table-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var t = document.getElementById(btn.dataset.tableToggle);
        var open = t.hidden;
        t.hidden = !open;
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? 'Hide table' : 'View table';
      });
    });

    window.addEventListener('scroll', hideTip, { passive: true });
  }

  /* ---------------- Blog ---------------- */
  function readingTime(html) {
    var words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  }

  function articleCard(a) {
    return '<article class="blog-card reveal" data-cat="' + escapeHtml(a.category) + '">' +
      '<a href="article.html?id=' + encodeURIComponent(a.id) + '" class="blog-link">' +
        '<div class="blog-img"><img src="' + a.image + '" alt="' + escapeHtml(a.imageAlt) + '" loading="lazy" /></div>' +
        '<div class="blog-body">' +
          '<span class="tag">' + escapeHtml(a.category) + '</span>' +
          '<h3>' + escapeHtml(a.title) + '</h3>' +
          '<p>' + escapeHtml(a.excerpt) + '</p>' +
          '<div class="blog-meta"><span><i data-lucide="calendar"></i>' + escapeHtml(a.period) + '</span><span><i data-lucide="clock"></i>' + readingTime(a.body) + ' min read</span></div>' +
        '</div>' +
      '</a></article>';
  }

  function initBlog() {
    var grid = $('#blog-grid');
    var filters = $('#blog-filters');
    var arts = window.POSTUREX_ARTICLES || [];
    if (!grid) return;
    grid.innerHTML = arts.map(articleCard).join('');

    var cats = (window.POSTUREX_CATEGORIES || []).filter(function (c) {
      return arts.some(function (a) { return a.category === c; });
    });
    filters.innerHTML = ['All'].concat(cats).map(function (c, i) {
      return '<button type="button" class="chip-btn" aria-pressed="' + (i === 0) + '" data-cat="' + escapeHtml(c) + '">' + escapeHtml(c) + '</button>';
    }).join('');
    $$('button', filters).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', filters).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        $$('.blog-card', grid).forEach(function (card) {
          card.hidden = !(b.dataset.cat === 'All' || card.dataset.cat === b.dataset.cat);
        });
      });
    });
  }

  function initArticlePage() {
    var root = $('#article-root');
    if (!root) return;
    var arts = window.POSTUREX_ARTICLES || [];
    var id = new URLSearchParams(location.search).get('id');
    var idx = arts.findIndex(function (a) { return a.id === id; });
    if (idx < 0) {
      root.innerHTML = '<div class="article-missing"><h1>Article not found</h1><p>The article you are looking for does not exist.</p><a class="btn btn-primary" href="index.html#blog">Back to the blog</a></div>';
      icons();
      return;
    }
    var a = arts[idx];
    document.title = a.title + ' — POSTUREX';
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', a.excerpt);
    var ogt = $('meta[property="og:title"]'); if (ogt) ogt.setAttribute('content', a.title);
    var ogd = $('meta[property="og:description"]'); if (ogd) ogd.setAttribute('content', a.excerpt);

    var prev = arts[idx - 1], next = arts[idx + 1];
    root.innerHTML =
      '<header class="article-hero">' +
        '<a href="index.html#blog" class="back-link"><i data-lucide="arrow-left"></i> All articles</a>' +
        '<span class="tag">' + escapeHtml(a.category) + '</span>' +
        '<h1>' + escapeHtml(a.title) + '</h1>' +
        '<p class="article-excerpt">' + escapeHtml(a.excerpt) + '</p>' +
        '<div class="blog-meta"><span><i data-lucide="users"></i>' + escapeHtml(a.author) + '</span><span><i data-lucide="calendar"></i>' + escapeHtml(a.period) + '</span><span><i data-lucide="clock"></i>' + readingTime(a.body) + ' min read</span></div>' +
      '</header>' +
      '<figure class="article-cover"><img src="' + a.image + '" alt="' + escapeHtml(a.imageAlt) + '" /></figure>' +
      '<div class="prose">' + a.body + '</div>' +
      '<p class="article-source"><i data-lucide="book-open"></i> Source: POSTUREX capstone manuscript, Assumption College of Davao. POSTUREX is a research prototype for posture awareness, not a medical diagnostic or treatment system.</p>' +
      '<nav class="article-nav" aria-label="More articles">' +
        (prev ? '<a href="article.html?id=' + prev.id + '"><small>Previous</small>' + escapeHtml(prev.title) + '</a>' : '<span></span>') +
        (next ? '<a class="next" href="article.html?id=' + next.id + '"><small>Next</small>' + escapeHtml(next.title) + '</a>' : '<span></span>') +
      '</nav>';
    icons();
  }

  /* ---------------- AVP video (YouTube, loads on click) ---------------- */
  function initVideo() {
    var facade = $('#video-facade');
    var frame = $('#video-frame');
    var thumb = $('#video-thumb');
    if (!facade || !frame) return;

    // maxresdefault is not generated for every upload; fall back to hqdefault.
    if (thumb) {
      thumb.addEventListener('error', function () {
        if (thumb.src.indexOf('hqdefault') === -1) thumb.src = 'https://i.ytimg.com/vi/' + CONFIG.youtubeId + '/hqdefault.jpg';
      });
      thumb.addEventListener('load', function () {
        // YouTube returns a 120px placeholder instead of 404 when maxres is missing.
        if (thumb.naturalWidth <= 120 && thumb.src.indexOf('hqdefault') === -1) thumb.src = 'https://i.ytimg.com/vi/' + CONFIG.youtubeId + '/hqdefault.jpg';
      });
    }

    var play = function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + CONFIG.youtubeId + '?autoplay=1&rel=0&modestbranding=1';
      iframe.title = 'POSTUREX Audio-Visual Presentation';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.innerHTML = '';
      frame.appendChild(iframe);
      iframe.focus();
    };
    facade.addEventListener('click', play);

    // "Watch Our AVP" buttons scroll to the player and move focus to it.
    $$('[data-play-avp]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        $('#avp').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        setTimeout(function () { var f = $('#video-facade'); if (f) f.focus({ preventScroll: true }); }, reduceMotion ? 0 : 700);
      });
    });
  }

  /* ---------------- Lightbox ---------------- */
  function initLightbox() {
    var box = $('#lightbox');
    if (!box) return;
    var img = $('#lightbox-img'), cap = $('#lightbox-cap'), close = $('.lightbox-close', box);
    var last = null;
    var open = function (src, caption, alt) {
      last = document.activeElement;
      img.src = src; img.alt = alt || caption; cap.textContent = caption;
      box.hidden = false;
      document.body.style.overflow = 'hidden';
      close.focus();
    };
    var shut = function () {
      box.hidden = true;
      document.body.style.overflow = '';
      if (last) last.focus();
    };
    $$('.zoomable').forEach(function (b) {
      b.addEventListener('click', function () { var i = $('img', b); open(b.dataset.full, b.dataset.caption, i && i.alt); });
    });
    close.addEventListener('click', shut);
    box.addEventListener('click', function (e) { if (e.target === box) shut(); });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') shut();
      if (e.key === 'Tab') { e.preventDefault(); close.focus(); }
    });
  }

  /* ---------------- Contact ---------------- */
  function initContact() {
    var form = $('#contact-form');
    if (!form) return;
    var status = $('#form-status');
    if (CONFIG.contactEmail) {
      var row = $('#contact-email-row'), link = $('#contact-email-link');
      row.hidden = false;
      link.href = 'mailto:' + CONFIG.contactEmail;
      link.textContent = CONFIG.contactEmail;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = $$('[required]', form).filter(function (f) { return !f.checkValidity(); });
      $$('[required]', form).forEach(function (f) { f.setAttribute('aria-invalid', String(!f.checkValidity())); });
      if (bad.length) {
        status.className = 'form-status error';
        status.textContent = 'Please complete all fields with a valid email address.';
        bad[0].focus();
        return;
      }
      if (!CONFIG.contactEmail) {
        status.className = 'form-status';
        status.textContent = 'Thank you! A public project email has not been published yet, so this message could not be sent. Please reach the researchers through the Faculty of Information Technology, Assumption College of Davao.';
        return;
      }
      var d = new FormData(form);
      var subject = '[POSTUREX] ' + d.get('topic') + ' from ' + d.get('name');
      var body = d.get('message') + '\n\n— ' + d.get('name') + ' (' + d.get('email') + ')';
      window.location.href = 'mailto:' + CONFIG.contactEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      status.className = 'form-status success';
      status.textContent = 'Your email app should open with the message ready to send.';
    });
  }

  /* ---------------- Boot ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initNav();
    initTimeline();
    initCarousel();
    initCharts();
    initBlog();
    initArticlePage();
    initVideo();
    initLightbox();
    initContact();
    icons();
    initReveal();
    var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  });
})();
