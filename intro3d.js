/* Ottoman 3D intro: drip -> dive -> inside the pipes -> bathroom -> door closes -> home page */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('intro-on')) return;
  var T = window.THREE, el, renderer, raf = 0, dead = false;

  function webglOK() {
    try { var c = document.createElement('canvas'); return !!(T && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
  }
  function fallback() {
    dead = true; cancelAnimationFrame(raf);
    try { if (renderer) renderer.dispose(); } catch (e) {}
    if (el && el.parentNode) el.parentNode.removeChild(el);
    if (window.ottoIntro2D) window.ottoIntro2D();
  }
  if (!webglOK() || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    if (window.ottoIntro2D) window.ottoIntro2D(); return;
  }
  try { init(); } catch (e) { if (window.console) console.error(e); fallback(); }

  function init() {
    var DBG = /[?&]introAt=([A-D])/.exec(location.search), FIXM = /[?&]introT=([\d.]+)/.exec(location.search), FIX = FIXM ? parseFloat(FIXM[1]) : 0;
    function clamp01(x) { return Math.max(0, Math.min(1, x)); }
    function ease(t) { t = clamp01(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function V(x, y, z) { return new T.Vector3(x, y, z); }
    var small = Math.min(window.innerWidth, window.innerHeight) < 600;

    /* ---------- DOM ---------- */
    el = document.createElement('div');
    el.id = 'intro'; el.className = 'i3d';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Ottoman intro');
    el.innerHTML =
      '<canvas class="i3"></canvas><div class="vig"></div><div class="grain"></div><div class="bar t"></div><div class="bar b"></div>' +
      '<div class="cap cap3 top" data-c="a"><small>Ottoman Construction &amp; Water Solutions</small><h2>Everything begins with a drop.</h2></div>' +
      '<div class="cap cap3" data-c="b"><small>Behind the tiles</small><h2>Every joint is doing quiet work.</h2></div>' +
      '<div class="cap cap3" data-c="c1"><small>Precision taps &amp; fittings</small><h2>Water, exactly where you want it.</h2></div>' +
      '<div class="cap cap3" data-c="c2"><small>Finished, as imagined</small><h2>Modern fittings. Quietly perfect.</h2></div>' +
      '<div class="cap cap3" data-c="c3"><small>Ottoman Water Solutions</small><h2>Welcome in.</h2></div>' +
      '<div class="flash"></div>' +
      '<div class="load">Loading</div>' +
      '<div class="dots"><i class="on"></i><i></i><i></i><i></i></div>' +
      '<button class="skip" type="button">Skip intro &rsaquo;</button>' +
      '<button class="tap" type="button">Click to explore</button>';
    document.body.appendChild(el);
    var canvas = el.querySelector('canvas'), flash = el.querySelector('.flash'), tapBtn = el.querySelector('.tap');
    var caps = {}; [].forEach.call(el.querySelectorAll('.cap'), function (c) { caps[c.getAttribute('data-c')] = c; });
    var dots = [].slice.call(el.querySelectorAll('.dots i'));
    function showCap(id) { for (var k in caps) caps[k].classList.toggle('show', k === id); }
    function setDot(n) { dots.forEach(function (d, i) { d.classList.toggle('on', i === n); }); }

    /* ---------- renderer ---------- */
    renderer = new T.WebGLRenderer({ canvas: canvas, antialias: !small, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    var camera = new T.PerspectiveCamera(45, 1, 0.1, 400);
    var scene = new T.Scene();
    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize); resize();

    /* ---------- textures ---------- */
    function ctex(w, h, draw, rx, ry, srgb) {
      var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
      var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx || 1, ry || 1);
      if (srgb !== false) t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t;
    }
    function rnd(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
    var concrete = ctex(512, 512, function (g, w, h) {
      var r = rnd(7); g.fillStyle = '#5a4743'; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 2600; i++) { g.fillStyle = 'rgba(' + (r() > .5 ? '255,241,220' : '20,10,8') + ',' + (r() * .08).toFixed(3) + ')'; g.fillRect(r() * w, r() * h, 1 + r() * 14, 1 + r() * 14); }
    }, 10, 10);
    var tiles = ctex(512, 512, function (g, w, h) {
      var r = rnd(11); g.fillStyle = '#c9bb8c'; g.fillRect(0, 0, w, h);
      for (var row = 0; row < 8; row++) for (var col = 0; col < 4; col++) {
        var off = row % 2 ? 64 : 0, x = col * 128 - off, y = row * 64, v = 232 + Math.floor(r() * 14);
        g.fillStyle = 'rgb(' + v + ',' + (v - 8) + ',' + (v - 46) + ')';
        g.fillRect(x + 2, y + 2, 124, 60); g.fillRect(x + 128 + 2, y + 2, 124, 60);
        var gr = g.createLinearGradient(0, y, 0, y + 64); gr.addColorStop(0, 'rgba(255,255,255,.28)'); gr.addColorStop(1, 'rgba(0,0,0,.06)');
        g.fillStyle = gr; g.fillRect(x + 2, y + 2, 124, 60); g.fillRect(x + 130, y + 2, 124, 60);
      }
    }, 1, 1);
    var terrazzo = ctex(512, 512, function (g, w, h) {
      var r = rnd(5); g.fillStyle = '#4a3431'; g.fillRect(0, 0, w, h);
      var cols = ['#FFF1B5', '#C1DBE8', '#8c6a62', '#2f211f', '#d9c7bd'];
      for (var i = 0; i < 520; i++) { g.fillStyle = cols[Math.floor(r() * 5)]; g.globalAlpha = .55 + r() * .4; g.beginPath(); var x = r() * w, y = r() * h, s = 2 + r() * 8; g.moveTo(x, y); g.lineTo(x + s, y + r() * s); g.lineTo(x + r() * s, y + s); g.closePath(); g.fill(); }
      g.globalAlpha = 1;
    }, 6, 6);
    var stripes = ctex(16, 128, function (g, w, h) {
      var gr = g.createLinearGradient(0, 0, 0, h);
      for (var i = 0; i <= 8; i++) gr.addColorStop(i / 8, i % 2 ? 'rgba(255,255,255,.95)' : 'rgba(193,219,232,.35)');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }, 1, 3, false);
    var dotTex = ctex(64, 64, function (g) {
      var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.4, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    }, 1, 1, false);
    var coneAlpha = ctex(4, 128, function (g, w, h) {
      var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#000'); gr.addColorStop(.55, '#aaa'); gr.addColorStop(1, '#555');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }, 1, 1, false);
    var logoTex = new T.TextureLoader().load('logo.png'); logoTex.encoding = T.sRGBEncoding;

    /* ---------- environment (reflections) ---------- */
    var envMain, envPipe;
    (function () {
      var pm = new T.PMREMGenerator(renderer);
      function makeEnv(top, mid, bot, panels) {
        var es = new T.Scene();
        es.add(new T.Mesh(new T.SphereGeometry(50, 32, 16), new T.MeshBasicMaterial({
          side: T.BackSide, map: ctex(8, 256, function (g, w, h) {
            var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, top); gr.addColorStop(.5, mid); gr.addColorStop(1, bot);
            g.fillStyle = gr; g.fillRect(0, 0, w, h);
          }, 1, 1)
        })));
        panels.forEach(function (p) { var m = new T.Mesh(new T.PlaneGeometry(p[3], p[4]), new T.MeshBasicMaterial({ color: p[5], side: T.DoubleSide })); m.position.set(p[0], p[1], p[2]); m.lookAt(0, 0, 0); es.add(m); });
        return pm.fromScene(es, 0.03).texture;
      }
      envMain = makeEnv('#9fb8c6', '#4a3a36', '#17100f', [[0, 30, 0, 30, 30, 0xffffff], [-30, 8, 12, 14, 24, 0xfff1d0], [30, 6, -10, 10, 26, 0xc1dbe8], [0, 4, -35, 40, 8, 0xffe9b0]]);
      envPipe = makeEnv('#0b141a', '#0f1c24', '#070b0e', [[0, 20, -30, 40, 3, 0x8fc4dc], [25, 0, 10, 3, 30, 0xC1DBE8], [-25, -4, 0, 3, 30, 0xFFF1B5]]);
      scene.environment = envMain;
    })();

    /* ---------- helpers ---------- */
    function mat(c, m, r, ei) { return new T.MeshStandardMaterial({ color: c, metalness: m, roughness: r, envMapIntensity: ei == null ? 1 : ei }); }
    var chromeB = mat(0xcfcfd2, 1, .25, .35), chrome = mat(0xe8e8ea, 1, .12, 1.4), copper = mat(0xbf9485, .9, .36, 1.1), white = mat(0xf7f5ee, .05, .12, .8), dark = mat(0x2a1d1b, .2, .6, .4);
    var pastel = new T.Color(0xC1DBE8);
    function mesh(g, m, x, y, z, parent) { var o = new T.Mesh(g, m); o.position.set(x, y, z); if (parent) parent.add(o); return o; }
    function points(n, size, color, opacity) {
      var g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(new Float32Array(n * 3), 3));
      var p = new T.Points(g, new T.PointsMaterial({ map: dotTex, size: size, color: color, transparent: true, opacity: opacity, depthWrite: false, blending: T.AdditiveBlending, sizeAttenuation: true }));
      p.frustumCulled = false; return p;
    }

    var gA = new T.Group(), gB = new T.Group(), gC = new T.Group();
    gA.position.set(0, 0, 0); gB.position.set(300, 0, 0); gC.position.set(-300, 0, 0);
    scene.add(gA, gB, gC);
    var updaters = [];

    /* ================= WORLD A: the drip ================= */
    var dropMesh, puddleHit, rips = [], splash, splashVel = [], dust;
    (function () {
      var floor = mesh(new T.PlaneGeometry(80, 80), new T.MeshStandardMaterial({ map: concrete, color: 0x66524d, roughness: .3, metalness: .15, envMapIntensity: .5 }), 0, 0, 0, gA);
      floor.rotation.x = -Math.PI / 2;
      var back = mesh(new T.PlaneGeometry(80, 30), mat(0x1b1311, .1, .9, .1), 0, 15, -16, gA);
      // crates and pipes in the dark for depth
      var r = rnd(3);
      for (var i = 0; i < 9; i++) {
        var s = 1.2 + r() * 2.4, x = (i % 2 ? 1 : -1) * (5 + r() * 8), z = -2 - r() * 11;
        var b = mesh(new T.BoxGeometry(s, s * (.6 + r() * .9), s), new T.MeshStandardMaterial({ map: concrete, color: 0x5d4a45, roughness: .75, metalness: .05, envMapIntensity: .2 }), x, s * .4, z, gA);
        b.rotation.y = r() * 3;
      }
      [-9, 9, -13].forEach(function (x, i) { mesh(new T.CylinderGeometry(.35, .35, 30, 16), copper, x, 15, -10 - i * 2, gA); });
      // the leaking pipe
      mesh(new T.CylinderGeometry(.34, .34, 10, 32), copper, 0, 9.2, 0, gA);
      mesh(new T.CylinderGeometry(.54, .54, .7, 32), mat(0x9d7a6c, .9, .3, 1.2), 0, 5.2, 0, gA);
      for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2; mesh(new T.SphereGeometry(.07, 10, 8), chrome, Math.cos(a) * .5, 5.2, Math.sin(a) * .5, gA); }
      mesh(new T.TorusGeometry(.5, .06, 10, 32), mat(0xd9c1b4, 1, .25), 0, 5.55, 0, gA).rotation.x = Math.PI / 2;
      mesh(new T.CylinderGeometry(.3, .26, .4, 24), mat(0x5c4640, .9, .4), 0, 4.05, 0, gA);
      // puddle
      var pud = mesh(new T.CircleGeometry(1.9, 64), new T.MeshStandardMaterial({ color: 0x3f7f9f, metalness: .7, roughness: .03, transparent: true, opacity: .85, envMapIntensity: .9 }), 0, .015, 0, gA);
      pud.rotation.x = -Math.PI / 2;
      puddleHit = mesh(new T.CircleGeometry(2.8, 24), new T.MeshBasicMaterial({ visible: false }), 0, .03, 0, gA); puddleHit.rotation.x = -Math.PI / 2;
      for (var q = 0; q < 3; q++) {
        var rg = mesh(new T.RingGeometry(.96, 1, 64), new T.MeshBasicMaterial({ color: pastel, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending }), 0, .03, 0, gA);
        rg.rotation.x = -Math.PI / 2; rips.push(rg);
      }
      // the drop
      var dg = new T.SphereGeometry(.17, 28, 20), pos = dg.attributes.position;
      for (var v = 0; v < pos.count; v++) { var y = pos.getY(v); if (y > 0) { var kk = y / .17; pos.setY(v, y * (1 + 1.35 * kk)); pos.setX(v, pos.getX(v) * (1 - .75 * kk * kk)); pos.setZ(v, pos.getZ(v) * (1 - .75 * kk * kk)); } }
      dg.computeVertexNormals();
      dropMesh = mesh(dg, new T.MeshStandardMaterial({ color: 0x9fd0ea, metalness: 0, roughness: .02, transparent: true, opacity: .88, envMapIntensity: 2.2, emissive: 0x2a6a92, emissiveIntensity: .5 }), 0, 3.9, 0, gA);
      // splash particles
      splash = points(18, .09, 0xdff0f8, .9); gA.add(splash);
      for (var s2 = 0; s2 < 18; s2++) { var an = s2 / 18 * Math.PI * 2; splashVel.push(V(Math.cos(an) * (.5 + r() * .8), 2.2 + r() * 2, Math.sin(an) * (.5 + r() * .8))); }
      // light + volumetric cone
      var sp = new T.SpotLight(0xdcecf5, 3.4, 40, .42, .9, 1); sp.position.set(0, 13, 0); sp.target.position.set(0, 0, 0); gA.add(sp, sp.target);
      gA.add(new T.HemisphereLight(0x2a1f1d, 0x0a0605, .5));
      var rim = new T.PointLight(0xffcf9a, .9, 18, 1); rim.position.set(-5, 3, 3); gA.add(rim);
      var cone = mesh(new T.ConeGeometry(2.9, 12.6, 40, 1, true), new T.MeshBasicMaterial({ color: 0xaed2e4, transparent: true, opacity: .2, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, alphaMap: coneAlpha }), 0, 6.3, 0, gA);
      dust = points(small ? 140 : 260, .11, 0xFFF1B5, .55); gA.add(dust);
      var seeds = []; for (var d = 0; d < 260; d++) seeds.push([r() * 6.28, r() * 3.2, r() * 11, r() * 6.28]);
      updaters.push(function (now) {
        var ps = dust.geometry.attributes.position, n = ps.count;
        for (var i = 0; i < n; i++) { var s = seeds[i]; ps.setXYZ(i, Math.cos(s[0] + now * .08) * s[1], (s[2] + now * .15 * (1 + s[1] * .2)) % 11 + .3, Math.sin(s[0] + now * .08 + s[3]) * s[1]); }
        ps.needsUpdate = true;
      });
      updaters.push(function (now, dt, ch) {
        if (ch !== 'A' && ch !== 'D') return;
        var P = 2.8, t = now % P, G = 14;
        if (t < .55) { var s = ease(t / .55); dropMesh.visible = true; dropMesh.scale.set(s, s * (1 + .15 * s), s); dropMesh.position.y = 3.88 - s * .12; }
        else if (t < .75) { dropMesh.visible = true; dropMesh.scale.set(1 - (t - .55) * .4, 1.15 + (t - .55) * 1.2, 1 - (t - .55) * .4); dropMesh.position.y = 3.76 - (t - .55) * .35; }
        else {
          var tf = t - .75, y = 3.68 - .5 * G * tf * tf;
          if (y > .06) { dropMesh.visible = true; dropMesh.scale.set(.9, 1.45, .9); dropMesh.position.y = y; } else dropMesh.visible = false;
        }
        var hit = .75 + Math.sqrt(2 * 3.62 / G), age = t - hit;
        rips.forEach(function (rg, i) {
          var a = age - i * .22;
          if (age > 0 && a > 0 && a < 1.7) { rg.scale.setScalar(.05 + a * 1.2); rg.material.opacity = .85 * Math.pow(1 - a / 1.7, 1.6); } else rg.material.opacity = 0;
        });
        var sp2 = splash.geometry.attributes.position;
        for (var i = 0; i < 18; i++) { var v = splashVel[i]; if (age > 0 && age < .7) sp2.setXYZ(i, v.x * age, .04 + v.y * age - 4.9 * age * age, v.z * age); else sp2.setXYZ(i, 0, -5, 0); }
        sp2.needsUpdate = true; splash.material.opacity = age > 0 && age < .7 ? .9 * (1 - age / .7) : 0;
      });
    })();

    /* ================= WORLD B: inside the pipes ================= */
    var curve, SN = 1000, P = [], Tn = [], Nn = [], Bn = [], pipeParticles, pipeSeeds = [];
    (function () {
      var pts = [V(0, 0, 0), V(0, 0, -10), V(0, 2, -20), V(6, 4, -30), V(14, 4, -38), V(18, 0, -46), V(15, -4, -56), V(8, -6, -64), V(2, -4, -72), V(0, 0, -82), V(0, 3, -92), V(0, 6, -104)];
      curve = new T.CatmullRomCurve3(pts, false, 'centripetal');
      var fr = curve.computeFrenetFrames(SN, false);
      for (var i = 0; i <= SN; i++) { P.push(curve.getPointAt(i / SN)); Tn.push(curve.getTangentAt(i / SN)); Nn.push(fr.normals[Math.min(i, fr.normals.length - 1)]); Bn.push(fr.binormals[Math.min(i, fr.binormals.length - 1)]); }
      var L = curve.getLength(), hubs = [.26, .5, .74], gap = 2.1 / L, R = 1.15;
      function seg(a, b) {
        var q = []; for (var k = 0; k <= 24; k++) q.push(curve.getPointAt(a + (b - a) * k / 24));
        return new T.CatmullRomCurve3(q);
      }
      var pm = new T.MeshStandardMaterial({ color: 0x4a5c68, metalness: .55, roughness: .42, side: T.BackSide, envMapIntensity: 1 });
      var edges = [0].concat(hubs.reduce(function (a, h) { a.push(h - gap, h + gap); return a; }, [])).concat([1]);
      for (var e = 0; e < edges.length; e += 2) mesh(new T.TubeGeometry(seg(edges[e], edges[e + 1]), 90, R, 24, false), pm, 0, 0, 0, gB);
      // collars every few metres (chrome rings + glowing bands)
      var N = Math.floor(L / 3.4);
      for (var i = 1; i < N; i++) {
        var u = i / N, near = hubs.some(function (h) { return Math.abs(u - h) < gap * 1.6; }); if (near) continue;
        var p = curve.getPointAt(u), tg = curve.getTangentAt(u);
        var ring = mesh(new T.TorusGeometry(R + .02, .11, 12, 36), chromeB, p.x, p.y, p.z, gB); ring.quaternion.setFromUnitVectors(V(0, 0, 1), tg);
        if (i % 2 === 1) { var band = mesh(new T.TorusGeometry(R - .06, .035, 8, 36), new T.MeshBasicMaterial({ color: pastel }), p.x, p.y, p.z, gB); band.quaternion.copy(ring.quaternion); band.position.addScaledVector(tg, .45); }
      }
      // hubs: tee / valve / reducer bulges
      hubs.forEach(function (h, idx) {
        var p = curve.getPointAt(h), tg = curve.getTangentAt(h);
        mesh(new T.SphereGeometry(2.1, 36, 24), new T.MeshStandardMaterial({ color: 0x3a4650, metalness: .6, roughness: .35, side: T.BackSide, envMapIntensity: 1 }), p.x, p.y, p.z, gB);
        var glow = mesh(new T.TorusGeometry(2.05, .06, 8, 48), new T.MeshBasicMaterial({ color: idx === 1 ? 0xFFF1B5 : pastel }), p.x, p.y, p.z, gB); glow.quaternion.setFromUnitVectors(V(0, 0, 1), tg);
        // valve wheel / bolts visible from inside
        for (var b = 0; b < 8; b++) { var a = b / 8 * 6.283; var bolt = mesh(new T.CylinderGeometry(.09, .09, .22, 10), chrome, 0, 0, 0, gB); var off = V(Math.cos(a), Math.sin(a), 0).multiplyScalar(2.02); var q = new T.Quaternion().setFromUnitVectors(V(0, 0, 1), tg); off.applyQuaternion(q); bolt.position.copy(p).add(off); bolt.lookAt(p); bolt.rotateX(Math.PI / 2); }
        var pl = new T.PointLight(idx === 1 ? 0xffe3a8 : 0xaed2e4, .7, 10, 1); pl.position.copy(p); gB.add(pl);
      });
      // exit light
      var end = curve.getPointAt(1), etg = curve.getTangentAt(1);
      var exit = mesh(new T.CircleGeometry(R, 32), new T.MeshBasicMaterial({ color: 0xb9d8e6, side: T.DoubleSide }), end.x, end.y, end.z, gB); exit.quaternion.setFromUnitVectors(V(0, 0, 1), etg); exit.position.addScaledVector(etg, 1.5);
      var pl2 = new T.PointLight(0xe6f6ff, 1.2, 16, 1); pl2.position.copy(end); gB.add(pl2);
      gB.add(new T.HemisphereLight(0x9fc3d6, 0x1c1312, .35));
      // water bubbles streaming with us
      var nP = small ? 380 : 800; pipeParticles = points(nP, .075, 0xC1DBE8, .7); gB.add(pipeParticles);
      var r = rnd(19); for (var s = 0; s < nP; s++) pipeSeeds.push([r(), r() * 6.283, Math.sqrt(r()) * .95, .08 + r() * .1]);
      var camLight = new T.PointLight(0xC1DBE8, 2.2, 14, 1); gB.add(camLight); gB.userData.camLight = camLight;
    })();
    function pipeAt(u, out) {
      u = clamp01(u); var f = u * SN, i = Math.min(Math.floor(f), SN - 1), k = f - i;
      out.p = P[i].clone().lerp(P[i + 1], k); out.t = Tn[i].clone().lerp(Tn[i + 1], k).normalize();
      out.n = Nn[i].clone().lerp(Nn[i + 1], k).normalize(); out.b = Bn[i].clone().lerp(Bn[i + 1], k).normalize(); return out;
    }
    updaters.push(function (now, dt, ch) {
      if (ch !== 'B') return;
      var ps = pipeParticles.geometry.attributes.position, tmp = {};
      for (var i = 0; i < ps.count; i++) {
        var s = pipeSeeds[i], u = (s[0] + now * s[3]) % 1; pipeAt(u, tmp);
        var a = s[1] + now * .4;
        ps.setXYZ(i, tmp.p.x + (tmp.n.x * Math.cos(a) + tmp.b.x * Math.sin(a)) * s[2], tmp.p.y + (tmp.n.y * Math.cos(a) + tmp.b.y * Math.sin(a)) * s[2], tmp.p.z + (tmp.n.z * Math.cos(a) + tmp.b.z * Math.sin(a)) * s[2]);
      }
      ps.needsUpdate = true;
    });

    /* ================= WORLD C: the bathroom ================= */
    var door, doorLight, plantLeaves = [], pend = [], rain, steam, stream, rainSeeds = [];
    (function () {
      function wall(w, h, x, y, z, ry, rx, ry2) {
        var tx = tiles.clone(); tx.needsUpdate = true; tx.repeat.set(w / 2, h / 2);
        var m = mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({ map: tx, roughness: .3, metalness: 0, envMapIntensity: .18 }), x, y, z, gC); m.rotation.y = ry || 0; return m;
      }
      var HH = 5.4;
      var tt = terrazzo.clone(); tt.needsUpdate = true; tt.repeat.set(3, 3);
      var floor = mesh(new T.PlaneGeometry(14, 12), new T.MeshStandardMaterial({ map: tt, roughness: .2, metalness: .1, envMapIntensity: .5 }), 0, 0, 0, gC); floor.rotation.x = -Math.PI / 2;
      var ceil = mesh(new T.PlaneGeometry(14, 12), mat(0x2f211f, .1, .8, .3), 0, HH, 0, gC); ceil.rotation.x = Math.PI / 2;
      wall(14, HH, 0, HH / 2, -6, 0); wall(12, HH, -7, HH / 2, 0, Math.PI / 2); wall(14, HH, 0, HH / 2, 6, Math.PI);
      wall(6.3, HH, 7, HH / 2, -2.85, -Math.PI / 2); wall(3.3, HH, 7, HH / 2, 4.35, -Math.PI / 2); wall(2.4, HH - 3.6, 7, 3.6 + (HH - 3.6) / 2, 1.5, -Math.PI / 2);
      // feature panel behind vanity
      mesh(new T.BoxGeometry(5.4, 4.2, .06), new T.MeshStandardMaterial({ color: 0x9fc4d8, roughness: .4, metalness: .05, envMapIntensity: .4 }), 0, 2.7, -5.97, gC);
      // vanity
      mesh(new T.BoxGeometry(3.4, .95, 1.4), mat(0x5b413d, .1, .45, .6), 0, 1.45, -5.25, gC);
      mesh(new T.BoxGeometry(3.7, .1, 1.55), mat(0xf4efe0, .05, .2, .9), 0, 2.0 - .0, -5.22, gC).position.y = 1.97;
      var bowl = mesh(new T.SphereGeometry(.55, 40, 20, 0, 6.283, Math.PI / 2, Math.PI / 2), new T.MeshStandardMaterial({ color: 0xffffff, roughness: .08, metalness: 0, side: T.DoubleSide, envMapIntensity: 1 }), 0, 2.34, -5.1, gC); bowl.scale.set(1, .6, 1);
      mesh(new T.CircleGeometry(.5, 32), new T.MeshStandardMaterial({ color: 0xbfdeed, roughness: .02, metalness: .5, transparent: true, opacity: .8, envMapIntensity: 2 }), 0, 2.2, -5.1, gC).rotation.x = -Math.PI / 2;
      // tap
      mesh(new T.CylinderGeometry(.07, .07, .85, 20), chrome, 0, 2.45, -5.82, gC);
      var spout = new T.CatmullRomCurve3([V(0, 2.8, -5.82), V(0, 3.0, -5.82), V(0, 3.12, -5.72), V(0, 3.14, -5.5), V(0, 3.06, -5.28), V(0, 2.98, -5.22)]);
      mesh(new T.TubeGeometry(spout, 40, .05, 14, false), chrome, 0, 0, 0, gC);
      mesh(new T.CylinderGeometry(.065, .06, .09, 16), mat(0x777a80, 1, .3), 0, 2.94, -5.22, gC);
      var lever = mesh(new T.BoxGeometry(.32, .05, .06), chrome, .16, 2.78, -5.82, gC); lever.rotation.z = .35;
      stream = mesh(new T.CylinderGeometry(.022, .022, .78, 10, 1, true), new T.MeshBasicMaterial({ map: stripes, transparent: true, opacity: .85, depthWrite: false, color: 0xe6f3fa }), 0, 2.56, -5.22, gC);
      // mirror
      var mir = mesh(new T.CircleGeometry(1, 64), new T.MeshStandardMaterial({ color: 0xdcebf3, metalness: 1, roughness: .03, envMapIntensity: 1.6, emissive: 0x6f8fa0, emissiveIntensity: .55 }), 0, 3.85, -5.92, gC); mir.scale.set(.95, 1.2, 1);
      var frame = mesh(new T.TorusGeometry(1, .045, 10, 64), new T.MeshBasicMaterial({ color: 0xFFF1B5 }), 0, 3.85, -5.9, gC); frame.scale.set(.95, 1.2, 1);
      // pendants
      [-1.9, 1.9].forEach(function (x) {
        var g = new T.Group(); g.position.set(x, HH, -4.1); gC.add(g);
        mesh(new T.CylinderGeometry(.01, .01, 1.1, 6), dark, 0, -.55, 0, g);
        mesh(new T.SphereGeometry(.2, 20, 14), new T.MeshBasicMaterial({ color: 0xfff1c8 }), 0, -1.2, 0, g);
        var l = new T.PointLight(0xffdca0, 1.0, 12, 1); l.position.set(0, -1.25, 0); g.add(l); pend.push(g);
      });
      var mirLight = new T.PointLight(0xffe9b0, .7, 8, 1); mirLight.position.set(0, 3.8, -5.3); gC.add(mirLight);
      gC.add(new T.HemisphereLight(0xfff1d0, 0x3b2927, .28));
      var key = new T.DirectionalLight(0xfff4e0, .22); key.position.set(-4, 7, 6); gC.add(key);
      // shower enclosure (back-right)
      var glassM = new T.MeshStandardMaterial({ color: 0xc1dbe8, transparent: true, opacity: .16, roughness: .03, metalness: .4, envMapIntensity: 1.6, side: T.DoubleSide, depthWrite: false });
      mesh(new T.BoxGeometry(.05, 4.4, 3.4), glassM, 3.2, 2.2, -4.3, gC); mesh(new T.BoxGeometry(3.8, 4.4, .05), glassM, 5.1, 2.2, -2.6, gC);
      mesh(new T.BoxGeometry(3.8, .12, 3.4), mat(0xe9e3d3, .05, .25, .8), 5.1, .06, -4.3, gC);
      mesh(new T.CylinderGeometry(.03, .03, 1.1, 10), chrome, 5.3, 4.85, -4.3, gC);
      var head = mesh(new T.CylinderGeometry(.62, .62, .07, 40), chrome, 5.3, 4.3, -4.3, gC);
      var rnz = rnd(23), nR = small ? 220 : 420; rain = points(nR, .06, 0xe6f4fa, .75); gC.add(rain);
      for (var i = 0; i < nR; i++) { var a = rnz() * 6.283, rr = Math.sqrt(rnz()) * .56; rainSeeds.push([Math.cos(a) * rr, Math.sin(a) * rr, rnz(), 3.2 + rnz() * 1.2]); }
      steam = points(30, 1.1, 0xffffff, .035); gC.add(steam);
      mesh(new T.CylinderGeometry(.05, .05, 1.1, 8), chrome, 7 - .05, 3.0, -1.2, gC).rotation.z = Math.PI / 2; // mixer
      // toilet (wall-hung look)
      mesh(new T.BoxGeometry(.9, 1.1, .38), white, -4.8, 2.3, -5.75, gC);
      var bw = mesh(new T.SphereGeometry(.5, 32, 20), white, -4.8, 1.4, -5.15, gC); bw.scale.set(.85, .55, 1.35);
      mesh(new T.CylinderGeometry(.28, .3, .8, 20), white, -4.8, 1.0, -5.7, gC);
      var lid = mesh(new T.SphereGeometry(.5, 32, 14, 0, 6.283, 0, 1.2), white, -4.8, 1.62, -5.15, gC); lid.scale.set(.85, .3, 1.35);
      mesh(new T.CylinderGeometry(.09, .09, .05, 20), chrome, -4.8, 2.88, -5.75, gC);
      // plant
      var pot = mesh(new T.CylinderGeometry(.35, .27, .7, 24), mat(0xC1DBE8, .1, .5, .6), -3.2, .35, -5.4, gC);
      var lm = mat(0x6d8f60, .1, .55, .6), lr = rnd(41);
      for (var l = 0; l < 9; l++) { var lf = mesh(new T.SphereGeometry(.18, 12, 10), lm, -3.2, .95, -5.4, gC); lf.scale.set(.35, 1.5 + lr(), .12); var an = l / 9 * 6.283; lf.position.x += Math.cos(an) * .22; lf.position.z += Math.sin(an) * .22; lf.position.y += .45; lf.rotation.z = Math.cos(an) * .45; lf.rotation.x = -Math.sin(an) * .45; plantLeaves.push([lf, an]); }
      // freestanding bath
      var bath = mesh(new T.SphereGeometry(1, 40, 24), white, -4.2, .55, -1.4, gC); bath.scale.set(1.0, .55, 2.0);
      mesh(new T.CylinderGeometry(.04, .04, 1.9, 10), chrome, -4.2, 1.05, -2.95, gC);
      // door in the right wall
      var jam = mat(0x1d1412, .2, .6, .3);
      mesh(new T.BoxGeometry(.2, 3.65, .1), jam, 6.95, 1.82, .3, gC); mesh(new T.BoxGeometry(.2, 3.65, .1), jam, 6.95, 1.82, 2.7, gC); mesh(new T.BoxGeometry(.2, .1, 2.5), jam, 6.95, 3.65, 1.5, gC);
      var outside = mesh(new T.PlaneGeometry(3.4, 5), new T.MeshBasicMaterial({ color: 0xfff6dc }), 7.8, 2.2, 1.5, gC); outside.rotation.y = -Math.PI / 2;
      doorLight = new T.PointLight(0xfff0d0, 1.4, 12, 1); doorLight.position.set(8.4, 2.4, 1.5); gC.add(doorLight);
      door = new T.Group(); door.position.set(6.94, 0, 2.7); gC.add(door);
      var leaf = mesh(new T.BoxGeometry(.12, 3.6, 2.4), new T.MeshStandardMaterial({ color: 0x35221f, roughness: .4, metalness: .1, envMapIntensity: .3 }), 0, 1.8, -1.2, door);
      [.95, 2.7].forEach(function (y) { mesh(new T.BoxGeometry(.03, 1.3, 1.7), mat(0x382724, .1, .5, .5), -.06, y, -1.2, door); });
      var plaque = mesh(new T.PlaneGeometry(1.05, 1.05), new T.MeshBasicMaterial({ map: logoTex, transparent: true }), -.1, 2.75, -1.2, door); plaque.rotation.y = -Math.PI / 2;
      mesh(new T.CylinderGeometry(.03, .03, .5, 10), mat(0xd7b36a, 1, .25, 1.4), -.12, 1.8, -2.1, door);
      mesh(new T.SphereGeometry(.07, 12, 10), mat(0xd7b36a, 1, .25, 1.4), -.2, 1.8, -2.1, door);
    })();
    updaters.push(function (now, dt, ch) {
      if (ch !== 'C') return;
      stripes.offset.y -= dt * 2.6;
      var ps = rain.geometry.attributes.position;
      for (var i = 0; i < ps.count; i++) { var s = rainSeeds[i], y = 4.25 - ((s[2] * 4.2 + now * s[3]) % 4.15); ps.setXYZ(i, 5.3 + s[0] * (1 + (4.25 - y) * .05), y, -4.3 + s[1] * (1 + (4.25 - y) * .05)); }
      ps.needsUpdate = true;
      var st = steam.geometry.attributes.position;
      for (var j = 0; j < st.count; j++) { var u = (j * .137 + now * .09) % 1; st.setXYZ(j, 4.6 + Math.sin(j * 1.7 + now * .3) * 1.5, .3 + u * 3.4, -4.1 + Math.cos(j * 2.3 + now * .25) * 1.2); }
      st.needsUpdate = true;
      plantLeaves.forEach(function (p) { p[0].rotation.z = Math.cos(p[1]) * .45 + Math.sin(now * 1.1 + p[1]) * .05; });
      pend.forEach(function (g, i) { g.rotation.z = Math.sin(now * .7 + i) * .012; g.rotation.x = Math.cos(now * .6 + i) * .01; });
    });

    /* ---------- camera paths ---------- */
    var cPos = new T.CatmullRomCurve3([V(.7, 2.72, -3.7), V(.55, 2.82, -4.25), V(-1.2, 2.9, -2.6), V(-.5, 2.95, 3.3), V(2.4, 2.65, .4), V(3.0, 2.3, 1.4), V(3.9, 2.15, 1.5)]);
    var cLook = new T.CatmullRomCurve3([V(0, 2.75, -5.3), V(0, 2.9, -5.3), V(-4.7, 1.5, -5.0), V(0, 2.4, -4), V(5.3, 3.4, -4.2), V(7, 2.1, 1.5), V(7, 2.1, 1.5)]);
    cPos.points = cPos.points.map(function (p) { return p.add(V(-300, 0, 0)); });
    cLook.points = cLook.points.map(function (p) { return p.add(V(-300, 0, 0)); });

    /* ---------- state machine ---------- */
    var clock = new T.Clock(), state = { ch: 'A', t0: 0, lt: 0 }, startPose = null, dive = null, finished = false;
    var raycaster = new T.Raycaster(), ptr = new T.Vector2(), tmpV = V(0, 0, 0);
    var TB = 10.5, TC = 17;
    function setCh(ch) {
      state.ch = ch; state.t0 = clock.getElapsedTime(); state.lt = 0;
      gA.visible = ch === 'A' || ch === 'D'; gB.visible = ch === 'B'; gC.visible = ch === 'C';
      var bg = ch === 'B' ? 0x0d1820 : ch === 'C' ? 0x2a1e1c : 0x110a09;
      renderer.toneMappingExposure = ch === 'C' ? .75 : ch === 'B' ? 1.1 : 1.15;
      scene.environment = ch === 'B' ? envPipe : envMain;
      scene.background = new T.Color(bg);
      scene.fog = ch === 'C' ? null : new T.FogExp2(bg, ch === 'B' ? .03 : .038);
      setDot(ch === 'A' ? 0 : ch === 'D' ? 0 : ch === 'B' ? 2 : 3);
      if (ch === 'B') showCap('b'); else if (ch === 'C') showCap('c1'); else if (ch === 'D') showCap(null); else showCap('a');
      tapBtn.style.display = ch === 'A' ? '' : 'none';
    }
    function cut(then) {
      flash.classList.add('on');
      setTimeout(function () { then(); setTimeout(function () { flash.classList.remove('on'); }, 140); }, 480);
    }
    function startDive() {
      if (state.ch !== 'A') return;
      startPose = { p: camera.position.clone(), l: V(0, 2.5, 0) };
      dive = new T.CatmullRomCurve3([camera.position.clone(), V(0, 1.0, 3.6), V(0, .32, 1.35)]);
      setCh('D'); setDot(1);
    }
    function finish() {
      if (finished) return; finished = true;
      try { sessionStorage.setItem('ottoIntro', '1'); } catch (e) {}
      root.classList.remove('intro-on'); el.classList.add('out');
      setTimeout(function () { dead = true; cancelAnimationFrame(raf); try { renderer.dispose(); } catch (e) {} if (el.parentNode) el.parentNode.removeChild(el); }, 1300);
    }
    el.querySelector('.skip').addEventListener('click', finish);
    tapBtn.addEventListener('click', startDive);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });
    function pick(ev) {
      var r = canvas.getBoundingClientRect(); ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ptr, camera); return raycaster.intersectObject(puddleHit).length > 0;
    }
    canvas.addEventListener('pointermove', function (e) { canvas.style.cursor = state.ch === 'A' && pick(e) ? 'pointer' : ''; });
    canvas.addEventListener('pointerdown', function (e) { if (state.ch === 'A' && pick(e)) startDive(); });

    /* ---------- loop ---------- */
    var noise = function (t, s) { return Math.sin(t * 1.1 * s) * .5 + Math.sin(t * 2.3 * s + 1.7) * .3 + Math.sin(t * 3.7 * s + .4) * .2; };
    var cutting = false, capShown = '', lastNow = 0;
    function frame() {
      if (dead) return; raf = requestAnimationFrame(frame);
      var now = clock.getElapsedTime(), dt = Math.min(Math.max(now - lastNow, 0), DBG ? 1 : .1), ch = state.ch; lastNow = now;
      state.lt += dt; if (FIX) state.lt = FIX; var lt = state.lt;
      var hx = noise(now, 1) * .012, hy = noise(now + 9, 1.2) * .01;
      if (ch === 'A') {
        var ca = ease(lt / 16);
        camera.position.set(Math.sin(now * .17) * .9 + hx, lerp(1.9, 1.5, ca) + hy, lerp(10, 7.9, ca));
        camera.lookAt(0, lerp(2.1, 1.9, ca), 0); camera.fov = lerp(44, 40, ca);
        if (lt > 18 && !cutting) startDive();
      } else if (ch === 'D') {
        var u = lt / 2.7, e = ease(u);
        camera.position.copy(dive.getPoint(e)); tmpV.set(0, lerp(2.5, .02, e), 0); camera.lookAt(tmpV); camera.fov = lerp(34, 28, e);
        if (u > .88 && !cutting) { cutting = true; cut(function () { setCh('B'); cutting = false; }); }
      } else if (ch === 'B') {
        var ub = ease(lt / TB) * .985, o = {}, o2 = {}; pipeAt(ub, o); pipeAt(ub + .02, o2);
        camera.position.copy(o.p).add(gB.position).addScaledVector(o.n, noise(now, 1.3) * .12).addScaledVector(o.b, noise(now + 4, 1.1) * .1);
        camera.lookAt(o2.p.clone().add(gB.position).addScaledVector(o2.n, noise(now + 2, .8) * .15));
        camera.fov = 58 + 24 * Math.sin(Math.PI * clamp01(lt / TB));
        camera.up.copy(o.n).lerp(V(0, 1, 0), .6).normalize();
        gB.userData.camLight.position.copy(o.p).addScaledVector(o.t, .5);
        if (lt > TB - .8 && !cutting) { cutting = true; cut(function () { setCh('C'); cutting = false; camera.up.set(0, 1, 0); }); }
      } else if (ch === 'C') {
        var uc = clamp01(lt / TC), u2 = uc * .8 + ease(uc) * .2;
        camera.position.copy(cPos.getPoint(u2)).add(V(hx * 2, hy * 2, 0)); camera.lookAt(cLook.getPoint(u2));
        camera.fov = lerp(46, 52, Math.sin(uc * Math.PI * .5));
        var dd = ease((lt - 12.2) / 2.2), ang = 1.75 * (1 - dd);
        door.rotation.y = ang + (lt > 14.3 && lt < 14.9 ? Math.sin((lt - 14.3) / .6 * Math.PI) * .035 : 0);
        doorLight.intensity = 1.4 * (ang / 1.75) + .03;
        if (capShown !== 'c1' && lt < 3.2) { capShown = 'c1'; showCap('c1'); }
        if (capShown !== 'c2' && lt >= 4.6 && lt < 12) { capShown = 'c2'; showCap('c2'); }
        if (capShown !== 'c3' && lt >= 14.4) { capShown = 'c3'; showCap('c3'); }
        if (lt >= TC && !finished) finish();
      }
      camera.updateProjectionMatrix();
      for (var i = 0; i < updaters.length; i++) updaters[i](now, dt, ch);
      renderer.render(scene, camera);
    }

    if (DBG) window.__i3 = { gB: gB, renderer: renderer, camera: camera, scene: scene, gA: gA, drop: function () { return dropMesh; }, puddle: puddleHit };
    gA.visible = gB.visible = gC.visible = true;
    try { renderer.compile(scene, camera); camera.position.set(0, 2, 8); camera.lookAt(0, 2, 0); renderer.render(scene, camera); } catch (e) {}
    lastNow = clock.getElapsedTime();
    var start = DBG ? DBG[1] : 'A';
    setCh(start === 'D' ? 'A' : start);
    if (start === 'D') startDive();
    var ld = el.querySelector('.load'); setTimeout(function () { ld.classList.add('gone'); }, 600);
    frame();
  }
})();
