/* Product viewer: big product code behind the photo, page colour follows the finish.
   Use: openProduct('8011', ['8011','8014H', ...])  (second argument = list for the arrows) */
(function () {
  try { CSS.registerProperty({ name: '--v1', syntax: '<color>', inherits: true, initialValue: '#43302E' });
        CSS.registerProperty({ name: '--v2', syntax: '<color>', inherits: true, initialValue: '#6a4a46' }); } catch (e) {}

  var css = '\
.pv{position:fixed;inset:0;z-index:3000;display:none;color:var(--ink,#FFF1B5);font-family:Montserrat,Arial,sans-serif;\
background:radial-gradient(circle at 72% 28%,var(--v2),transparent 62%),var(--v1);transition:--v1 .7s ease,--v2 .7s ease,color .5s;overflow-y:auto;overscroll-behavior:contain}\
.pv.on{display:block;animation:pvin .45s cubic-bezier(.2,.8,.2,1)}\
@keyframes pvin{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:none}}\
.pv-wrap{min-height:100%;max-width:1100px;margin:0 auto;padding:84px 22px 40px;display:grid;gap:26px;align-content:center}\
.pv-stagebox{position:relative;display:grid;place-items:center;padding-top:clamp(40px,12vw,90px)}\
.pv-word{position:absolute;top:0;left:50%;transform:translateX(-50%);white-space:nowrap;font-family:"Bricolage Grotesque",Montserrat,Arial,sans-serif;font-weight:800;letter-spacing:-.04em;line-height:.8;font-size:clamp(4.2rem,21vw,12rem);color:var(--ink);opacity:.26;pointer-events:none;user-select:none;transition:transform .15s ease-out}\
.pv-stage{position:relative;z-index:2;width:min(84vw,440px);aspect-ratio:1;background:#fff;border-radius:34px;box-shadow:0 40px 80px rgba(0,0,0,.35),0 8px 20px rgba(0,0,0,.2);display:grid;place-items:center;transition:transform .15s ease-out}\
.pv-stage img{position:absolute;inset:6%;width:88%;height:88%;object-fit:contain;animation:pvimg .6s .1s cubic-bezier(.2,.8,.2,1) both}\
@keyframes pvimg{from{opacity:0;transform:translateY(34px) scale(.9)}to{opacity:1;transform:none}}\
.pv-stagebox.cutmode{padding-top:0}\
.pv-stagebox.cutmode .pv-word{top:20%}\
.pv-stage.cut{background:transparent;box-shadow:none;border-radius:0;display:flex;align-items:center;justify-content:center}\
.pv-stage.cut img{position:relative;inset:auto;width:auto;height:auto;max-width:100%;max-height:100%;filter:drop-shadow(0 34px 28px rgba(0,0,0,.38))}\
.pv-noimg{color:#7a6a60;font-size:.9rem}\
.pv-info{display:flex;flex-direction:column;gap:12px;text-align:center;align-items:center}\
.pv-meta{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}\
.pv-chip{font-size:.74rem;font-weight:700;padding:6px 13px;border-radius:30px;border:1px solid currentColor;opacity:.9}\
.pv-name{font-family:"Bricolage Grotesque",Montserrat,Arial,sans-serif;font-weight:800;font-size:clamp(1.6rem,5vw,2.4rem);letter-spacing:-.02em;line-height:1.08;margin:0;max-width:20ch}\
.pv-cat{margin:0;opacity:.75;font-size:.85rem}\
.pv-price{font-size:clamp(1.6rem,5vw,2.2rem);font-weight:800;margin:4px 0}\
.pv-price.ask{font-size:1.05rem;font-weight:600;opacity:.8}\
.pv-btns{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:6px}\
.pv-btn{border:0;border-radius:40px;padding:14px 26px;font:700 .92rem Montserrat,Arial,sans-serif;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:transform .2s}\
.pv-btn:hover{transform:translateY(-2px)}\
.pv-btn.main{background:var(--ink);color:var(--v1)}\
.pv-btn.wa{background:#25d366;color:#04210f}\
.pv-x,.pv-nav{position:fixed;z-index:3;width:50px;height:50px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:rgba(0,0,0,.28);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#fff;font-size:1.4rem;cursor:pointer;display:grid;place-items:center}\
.pv-x{top:16px;right:16px}\
.pv-nav.prev{left:12px;top:50%}.pv-nav.next{right:12px;top:50%}\
.pv-count{position:fixed;top:28px;left:0;right:0;text-align:center;font-size:.78rem;font-weight:700;opacity:.7;pointer-events:none}\
@media(min-width:900px){.pv-wrap{grid-template-columns:1.1fr 1fr;align-items:center;gap:40px;padding:60px 90px}.pv-info{text-align:left;align-items:flex-start}.pv-meta,.pv-btns{justify-content:flex-start}.pv-nav.prev{left:20px}.pv-nav.next{right:20px}}\
@media(max-width:899px){.pv-nav.prev,.pv-nav.next{top:auto;bottom:18px}.pv-nav.prev{left:18px}.pv-nav.next{right:18px}.pv-wrap{padding-bottom:96px}}\
@media(prefers-reduced-motion:reduce){.pv.on,.pv-stage img{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var THEMES = [
    ['black', '#c9c2b6', '#efe9de', '#1b1a1a'], ['gold', '#a87a2c', '#e4c474', '#2a1d05'],
    ['nickel', '#6f7378', '#b4b8bc', '#ffffff'], ['chrome', '#8ea2b4', '#dbe5ee', '#14212d'],
    ['silver', '#8ea2b4', '#dbe5ee', '#14212d'], ['grey', '#555c66', '#8a929c', '#ffffff'],
    ['gray', '#555c66', '#8a929c', '#ffffff'], ['white', '#d9e2e7', '#f6f9fa', '#1a2630'],
    ['blue', '#2d5f9a', '#6fa4de', '#ffffff'], ['pink', '#b85f7f', '#f2b8cb', '#ffffff'],
    ['brown', '#6d4c3a', '#b08968', '#fff4e6'], ['wood', '#6d4c3a', '#b08968', '#fff4e6']
  ];
  function theme(f) {
    f = (f || '').toLowerCase();
    for (var i = 0; i < THEMES.length; i++) if (f.indexOf(THEMES[i][0]) >= 0) return THEMES[i];
    return ['', '#43302E', '#6a4a46', '#FFF1B5'];
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function all() { return (window.PRODUCTS || []).concat(window.TOILETS || []); }
  function cutOf(p) { return p.replace(/^.*\/([^\/]+)\.\w+$/, 'img/cut/$1.webp'); }
  function find(code) { var a = all(); for (var i = 0; i < a.length; i++) if (a[i].code === code) return a[i]; }

  var el = document.createElement('div');
  el.className = 'pv'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Product details');
  el.innerHTML = '<div class="pv-count" id="pvCount"></div><button class="pv-x" aria-label="Close">&times;</button><button class="pv-nav prev" aria-label="Previous product">&#8249;</button><button class="pv-nav next" aria-label="Next product">&#8250;</button><div class="pv-wrap" id="pvWrap"></div>';
  document.body.appendChild(el);

  var list = [], idx = 0, lastFocus = null;
  function render(first) {
    var code = list[idx], it = find(code); if (!it) return;
    var t = theme(it.finish);
    el.style.setProperty('--v1', t[1]); el.style.setProperty('--v2', t[2]); el.style.setProperty('--ink', t[3]);
    var size = it.size ? '<span class="pv-chip">' + esc(it.size) + '</span>' : '';
    var fin = it.finish ? '<span class="pv-chip">' + esc(it.finish) + '</span>' : '';
    var price = it.price ? '<div class="pv-price">KES ' + Number(it.price).toLocaleString('en-KE') + '</div>' : '<div class="pv-price ask">Ask for price</div>';
    var msg = "Hello Ottoman Water Solutions, I'd like to order " + it.code + ' (' + it.name + (it.finish ? ', ' + it.finish : '') + ')' + (it.price ? ' at KES ' + Number(it.price).toLocaleString('en-KE') : '') + '. Please confirm availability and delivery.';
    var canAdd = typeof window.viewerAdd === 'function';
    var q = canAdd && window.viewerQty ? window.viewerQty(it.code) : 0;
    document.getElementById('pvWrap').innerHTML =
      '<div class="pv-stagebox' + (it.img ? ' cutmode' : '') + '" id="pvBox"><div class="pv-word" id="pvWord">' + esc(it.code) + '</div><div class="pv-stage' + (it.img ? ' cut' : '') + '" id="pvStage">' +
      (it.img ? '<img id="pvImg" src="' + esc(cutOf(it.img)) + '" alt="' + esc(it.code + ' ' + it.name) + '">' : '<div class="pv-noimg">Photo coming soon</div>') + '</div></div>' +
      '<div class="pv-info"><div class="pv-meta">' + fin + size + '</div><h2 class="pv-name">' + esc(it.name) + '</h2><p class="pv-cat">' + esc(it.cat) + '</p>' + price +
      '<div class="pv-btns">' + (canAdd ? '<button class="pv-btn main" id="pvAdd">' + (q ? '&#10003; In cart (' + q + ') &middot; add one more' : '+ Add to cart') + '</button>' : '') +
      '<a class="pv-btn wa" target="_blank" rel="noopener" href="https://wa.me/254112406467?text=' + encodeURIComponent(msg) + '">Order on WhatsApp</a></div></div>';
    (function fit() {
      var w = document.getElementById('pvWord'), b = document.getElementById('pvBox'); if (!w || !b) return;
      w.style.fontSize = ''; var fs = parseFloat(getComputedStyle(w).fontSize), max = b.clientWidth * 1.04;
      if (w.scrollWidth > max) w.style.fontSize = Math.max(36, fs * max / w.scrollWidth) + 'px';
    })();
    var im = document.getElementById('pvImg');
    if (im) {
      im.onerror = function () { im.onerror = null; im.src = it.img; var b = document.getElementById('pvBox'); b.classList.remove('cutmode'); document.getElementById('pvStage').classList.remove('cut'); };
      im.onload = function () { if (document.getElementById('pvStage').classList.contains('cut')) im.style.maxWidth = 'min(100%,' + Math.round(im.naturalWidth * 2.4) + 'px)'; };
    }
    document.getElementById('pvCount').textContent = list.length > 1 ? (idx + 1) + ' / ' + list.length : '';
    el.querySelector('.prev').style.display = el.querySelector('.next').style.display = list.length > 1 ? '' : 'none';
    var add = document.getElementById('pvAdd');
    if (add) add.onclick = function () { window.viewerAdd(it.code); render(); };
    el.scrollTop = 0;
  }
  function step(d) { if (list.length < 2) return; idx = (idx + d + list.length) % list.length; render(); }
  function close() { el.classList.remove('on'); document.body.style.overflow = ''; if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {} }
  window.openProduct = function (code, codes) {
    list = (codes && codes.length ? codes : [code]).filter(function (c) { return find(c); });
    idx = Math.max(0, list.indexOf(code)); if (!list.length) return;
    lastFocus = document.activeElement; el.classList.add('on'); document.body.style.overflow = 'hidden'; render(true);
    el.querySelector('.pv-x').focus();
  };
  addEventListener('resize', function () { if (el.classList.contains('on')) render(); });
  el.querySelector('.pv-x').onclick = close;
  el.querySelector('.prev').onclick = function () { step(-1); };
  el.querySelector('.next').onclick = function () { step(1); };
  document.addEventListener('keydown', function (e) {
    if (!el.classList.contains('on')) return;
    if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1);
  });
  var sx = null;
  el.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 70) step(dx < 0 ? 1 : -1); sx = null; });
  // depth: word and card move a little against each other with the pointer
  if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    el.addEventListener('pointermove', function (e) {
      var w = document.getElementById('pvWord'), s = document.getElementById('pvStage'); if (!w || !s) return;
      var x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
      w.style.transform = 'translateX(calc(-50% + ' + (-x * 40) + 'px)) translateY(' + (-y * 14) + 'px)';
      s.style.transform = 'translate(' + (x * 12) + 'px,' + (y * 8) + 'px)';
    });
  }
})();
