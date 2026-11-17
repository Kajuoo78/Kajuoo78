/* Ottoman intro: one drop -> inside the pipes -> taps -> finished bathroom -> door closes -> home page */
window.ottoIntro2D = function () {
  var root = document.documentElement;
  if (!root.classList.contains('intro-on')) return;

  var VB = 'viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"';
  var chrome = '<linearGradient id="chr" x1="0" x2="1"><stop offset="0" stop-color="#8d8f94"/><stop offset=".35" stop-color="#f4f6f8"/><stop offset=".7" stop-color="#b9bcc2"/><stop offset="1" stop-color="#6d7076"/></linearGradient>';

  /* ---------- scene 1: the leak ---------- */
  var dust = '';
  for (var i = 0; i < 16; i++) {
    dust += '<circle cx="' + (560 + (i * 73) % 480) + '" cy="' + (220 + (i * 131) % 520) + '" r="' + (1.5 + (i % 3)) + '" style="animation-delay:-' + (i * 0.7) + 's;animation-duration:' + (7 + i % 5) + 's"/>';
  }
  var s1 = '<div class="sc sc1 on"><svg class="art" ' + VB + '><defs>' +
    '<linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#150e0d"/><stop offset="1" stop-color="#2f211f"/></linearGradient>' +
    '<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C1DBE8" stop-opacity=".5"/><stop offset="1" stop-color="#C1DBE8" stop-opacity=".02"/></linearGradient>' +
    '<linearGradient id="pipeG" x1="0" x2="1"><stop offset="0" stop-color="#4a3632"/><stop offset=".3" stop-color="#bfa699"/><stop offset="1" stop-color="#5a433d"/></linearGradient>' +
    '<linearGradient id="floor1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2927"/><stop offset="1" stop-color="#150e0d"/></linearGradient>' +
    '</defs>' +
    '<rect width="1600" height="900" fill="url(#bg1)"/>' +
    '<path class="glow" d="M735 0H865L1130 790H470Z" fill="url(#cone)" opacity=".6"/>' +
    '<rect y="780" width="1600" height="120" fill="url(#floor1)"/>' +
    '<rect y="778" width="1600" height="3" fill="rgba(255,241,181,.12)"/>' +
    '<g class="dust">' + dust + '</g>' +
    '<rect x="770" y="-10" width="60" height="300" fill="url(#pipeG)"/>' +
    '<rect x="754" y="238" width="92" height="38" rx="7" fill="#8a6f64"/><rect x="754" y="238" width="92" height="8" rx="4" fill="#d7c1b6" opacity=".7"/>' +
    '<circle cx="772" cy="257" r="4" fill="#2f211f"/><circle cx="828" cy="257" r="4" fill="#2f211f"/>' +
    '<rect x="772" y="276" width="56" height="54" fill="url(#pipeG)"/>' +
    '<rect x="780" y="326" width="40" height="10" rx="4" fill="#3b2927"/>' +
    '<path d="M792 282Q790 300 794 326" stroke="#C1DBE8" stroke-opacity=".45" stroke-width="3" fill="none"/>' +
    '<g transform="translate(800 340)"><g class="drop"><path d="M0-18C10-3 14 4 14 10A14 14 0 0 1-14 10C-14 4-10-3 0-18Z" fill="#C1DBE8"/><path d="M-5 4Q-6 11-2 13" stroke="#fff" stroke-width="2.5" fill="none" opacity=".8" stroke-linecap="round"/></g></g>' +
    '<g class="puddle" id="puddle">' +
    '<ellipse cx="800" cy="796" rx="230" ry="44" fill="transparent"/>' +
    '<ellipse cx="800" cy="796" rx="190" ry="20" fill="rgba(193,219,232,.16)" stroke="rgba(193,219,232,.5)" stroke-width="2"/>' +
    '<ellipse cx="770" cy="792" rx="60" ry="5" fill="rgba(255,255,255,.28)"/>' +
    '<g transform="translate(800 796)"><ellipse class="rip a" rx="170" ry="22"/><ellipse class="rip b" rx="170" ry="22"/><ellipse class="rip c" rx="170" ry="22"/></g></g>' +
    '</svg>' +
    '<div class="cap top"><small>Ottoman Construction &amp; Water Solutions</small><h2>Every home has a story you never see.</h2></div>' +
    '<button class="tap" type="button">Tap the puddle to look inside</button></div>';

  /* ---------- scene 2: inside the pipes ---------- */
  var pathR = 'M800 940V600', pathL = 'M800 600H670Q620 600 620 550V345', pathRt = 'M800 600H930Q1000 600 1000 550V345';
  function pipe(d, delay) {
    var st = ' pathLength="100" fill="none" stroke-linejoin="round" style="animation-delay:' + delay + 's"';
    return '<path class="draw" d="' + d + '"' + st + ' stroke="#1b1211" stroke-width="48"/>' +
      '<path class="draw" d="' + d + '"' + st + ' stroke="#a58a7f" stroke-width="40"/>' +
      '<path class="draw" d="' + d + '"' + st + ' stroke="#2b1d1b" stroke-width="24"/>';
  }
  function water(d) {
    return '<path d="' + d + '" fill="none" stroke="#C1DBE8" stroke-opacity=".25" stroke-width="22"/>' +
      '<path class="flow" d="' + d + '" pathLength="100" fill="none" stroke="#C1DBE8" stroke-width="12" stroke-linecap="round"/>';
  }
  function pop(delay, inner) { return '<g class="pop" style="animation-delay:' + delay + 's">' + inner + '</g>'; }
  var grid = '';
  for (var gx = 0; gx <= 1600; gx += 100) grid += '<path d="M' + gx + ' 0V900" />';
  for (var gy = 0; gy <= 900; gy += 100) grid += '<path d="M0 ' + gy + 'H1600" />';
  var s2 = '<div class="sc sc2"><svg class="art" ' + VB + '><defs>' + chrome +
    '<linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f211f"/><stop offset="1" stop-color="#43302E"/></linearGradient></defs>' +
    '<rect width="1600" height="900" fill="url(#bg2)"/>' +
    '<g stroke="rgba(193,219,232,.07)" stroke-width="1">' + grid + '</g>' +
    '<g fill="rgba(255,241,181,.04)"><rect x="470" width="36" height="900"/><rect x="1090" width="36" height="900"/><rect x="250" width="36" height="900"/><rect x="1330" width="36" height="900"/></g>' +
    pipe(pathR, 0) + pipe(pathL, .5) + pipe(pathRt, .5) +
    water(pathR) + water(pathL) + water(pathRt) +
    pop(1.2, '<rect x="776" y="790" width="48" height="26" rx="5" fill="#d9c7bd" stroke="#1b1211" stroke-width="3"/>') +
    pop(1.5, '<circle cx="800" cy="720" r="30" fill="#43302E" stroke="#FFF1B5" stroke-width="4"/><rect x="826" y="711" width="64" height="18" rx="9" fill="#C1DBE8"/><circle cx="800" cy="720" r="9" fill="#FFF1B5"/>') +
    pop(1.8, '<circle cx="800" cy="600" r="34" fill="#43302E" stroke="#FFF1B5" stroke-width="4"/><circle cx="800" cy="600" r="12" fill="#C1DBE8"/>') +
    pop(2.1, '<circle cx="620" cy="600" r="28" fill="#43302E" stroke="#FFF1B5" stroke-width="4"/>') +
    pop(2.1, '<circle cx="1000" cy="600" r="28" fill="#43302E" stroke="#FFF1B5" stroke-width="4"/>') +
    pop(2.3, '<rect x="598" y="450" width="44" height="24" rx="5" fill="#d9c7bd" stroke="#1b1211" stroke-width="3"/>') +
    pop(2.3, '<rect x="978" y="450" width="44" height="24" rx="5" fill="#d9c7bd" stroke="#1b1211" stroke-width="3"/>') +
    pop(2.6, '<rect x="594" y="320" width="52" height="30" rx="6" fill="url(#chr)" stroke="#1b1211" stroke-width="3"/>') +
    pop(2.6, '<rect x="974" y="320" width="52" height="30" rx="6" fill="url(#chr)" stroke="#1b1211" stroke-width="3"/>') +
    '<g><path class="lead" style="animation-delay:2.2s" d="M830 880H850"/><text class="lbl" style="animation-delay:2.4s" x="858" y="886">COLD MAIN</text>' +
    '<path class="lead" style="animation-delay:2.4s" d="M893 735V775"/><text class="lbl" style="animation-delay:2.6s" x="852" y="800">BALL VALVE</text>' +
    '<path class="lead" style="animation-delay:2.6s" d="M820 570L850 545"/><text class="lbl" style="animation-delay:2.8s" x="856" y="548">TEE JOINT</text>' +
    '<path class="lead" style="animation-delay:2.8s" d="M640 626L660 650"/><text class="lbl" style="animation-delay:3s" x="640" y="676">90&deg; ELBOW</text>' +
    '<path class="lead" style="animation-delay:3s" d="M620 440V400"/><text class="lbl" style="animation-delay:3.2s" x="540" y="390">COUPLING</text></g>' +
    '</svg>' +
    '<div class="cap top"><small>Behind the tiles</small><h2>Every joint is doing quiet work.</h2></div></div>';

  /* ---------- scene 3: taps and rain ---------- */
  var rain = '', steam = '';
  for (var r = 0; r < 12; r++) {
    var x = 904 + r * 14.5;
    rain += '<line class="rain" x1="' + x + '" y1="218" x2="' + x + '" y2="752" stroke="#C1DBE8" stroke-width="3" stroke-linecap="round" style="animation-delay:-' + (r * 0.13).toFixed(2) + 's"/>';
  }
  for (var m = 0; m < 6; m++) steam += '<circle cx="' + (900 + m * 34) + '" cy="740" r="' + (40 + m * 6) + '" style="animation-delay:-' + m + 's"/>';
  var s3 = '<div class="sc sc3"><svg class="art" ' + VB + '><defs>' + chrome +
    '<linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2927"/><stop offset="1" stop-color="#241816"/></linearGradient>' +
    '<radialGradient id="halo3" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#C1DBE8" stop-opacity=".28"/><stop offset="1" stop-color="#C1DBE8" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="1600" height="900" fill="url(#bg3)"/><circle cx="800" cy="360" r="520" fill="url(#halo3)" class="glow"/>' +
    '<rect x="500" y="770" width="340" height="140" fill="#5b413d"/><rect x="500" y="762" width="340" height="10" fill="#d9c7bd"/>' +
    '<ellipse cx="690" cy="764" rx="140" ry="18" fill="#EAF2F6"/><ellipse cx="690" cy="766" rx="108" ry="9" fill="#C1DBE8" opacity=".75"/>' +
    '<rect x="674" y="640" width="32" height="122" rx="9" fill="url(#chr)"/>' +
    '<path d="M690 650V600Q690 562 730 562H760Q782 562 782 584V612" fill="none" stroke="url(#chr)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<rect x="768" y="608" width="28" height="14" rx="4" fill="#6d7076"/><rect x="640" y="606" width="46" height="11" rx="5" fill="url(#chr)" transform="rotate(-18 690 612)"/>' +
    '<line class="stream" x1="782" y1="624" x2="782" y2="764" stroke="#C1DBE8" stroke-width="7" stroke-linecap="round"/>' +
    '<g transform="translate(782 766)"><ellipse class="rip a" rx="46" ry="6"/><ellipse class="rip b" rx="46" ry="6"/></g>' +
    '<rect x="976" y="-10" width="9" height="210" fill="url(#chr)"/><rect x="896" y="196" width="190" height="20" rx="10" fill="url(#chr)"/><rect x="904" y="214" width="174" height="5" rx="2" fill="#3a3d46"/>' +
    rain +
    '<rect x="870" y="762" width="240" height="22" rx="4" fill="#d9c7bd"/><g transform="translate(990 764)"><ellipse class="rip a" rx="90" ry="8"/><ellipse class="rip c" rx="90" ry="8"/></g>' +
    '<g class="steam">' + steam + '</g>' +
    '</svg><div class="cap"><small>Precision taps &amp; showers</small><h2>Water, exactly where you want it.</h2></div></div>';

  /* ---------- scene 4: finished bathroom ---------- */
  var s4 = '<div class="sc sc4"><svg class="art" ' + VB + '><defs>' + chrome +
    '<pattern id="tile" width="110" height="55" patternUnits="userSpaceOnUse"><rect width="110" height="55" fill="#F0E3BC"/><path d="M0 .5H110M0 55V0M55 55V27.5M55 27.5H0M110 27.5H55" stroke="rgba(67,48,46,.14)" stroke-width="1.6" fill="none"/></pattern>' +
    '<linearGradient id="floor4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b413d"/><stop offset="1" stop-color="#2f211f"/></linearGradient>' +
    '<linearGradient id="mir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eaf4f8"/><stop offset=".5" stop-color="#c7dde8"/><stop offset="1" stop-color="#9fbfd0"/></linearGradient>' +
    '<radialGradient id="lamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF1B5" stop-opacity=".95"/><stop offset="1" stop-color="#FFF1B5" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C1DBE8" stop-opacity=".35"/><stop offset="1" stop-color="#C1DBE8" stop-opacity=".08"/></linearGradient></defs>' +
    '<rect width="1600" height="900" fill="url(#tile)"/>' +
    '<rect x="560" y="0" width="480" height="720" fill="#C1DBE8" opacity=".55"/>' +
    '<rect y="720" width="1600" height="180" fill="url(#floor4)"/><rect y="718" width="1600" height="6" fill="#FFF1B5" opacity=".5"/>' +
    '<g class="mist"><circle cx="700" cy="40" r="170" fill="url(#lamp)"/><circle cx="900" cy="40" r="170" fill="url(#lamp)"/></g>' +
    '<path d="M700 0V70M900 0V70" stroke="#2f211f" stroke-width="3"/><circle cx="700" cy="78" r="16" fill="#FFF1B5"/><circle cx="900" cy="78" r="16" fill="#FFF1B5"/>' +
    '<rect x="682" y="190" width="236" height="340" rx="118" fill="url(#mir)" stroke="#FFF1B5" stroke-width="8"/><path d="M730 440L800 250M770 470L860 280" stroke="#fff" stroke-opacity=".5" stroke-width="12" stroke-linecap="round"/>' +
    '<rect x="600" y="560" width="400" height="32" rx="7" fill="#F6F2E6"/><rect x="630" y="592" width="340" height="96" rx="10" fill="#5b413d"/><rect x="640" y="610" width="150" height="3" fill="#FFF1B5" opacity=".6"/>' +
    '<path d="M720 562Q730 520 800 520Q870 520 880 562Z" fill="#fff"/><rect x="793" y="470" width="14" height="52" rx="6" fill="url(#chr)"/><path d="M800 478H836Q846 478 846 490V504" fill="none" stroke="url(#chr)" stroke-width="12" stroke-linecap="round"/>' +
    '<line class="stream" x1="846" y1="506" x2="846" y2="562" stroke="#C1DBE8" stroke-width="5" stroke-linecap="round"/>' +
    '<rect x="1090" y="150" width="320" height="570" fill="url(#glass)" stroke="rgba(255,255,255,.55)" stroke-width="3"/><path d="M1110 200L1160 160M1110 300L1220 160" stroke="#fff" stroke-opacity=".35" stroke-width="6"/>' +
    '<rect x="1246" y="120" width="8" height="70" fill="url(#chr)"/><rect x="1176" y="186" width="148" height="14" rx="7" fill="url(#chr)"/>' +
    '<g stroke="#C1DBE8" stroke-width="2.5" stroke-linecap="round"><line class="rainlite" x1="1196" y1="206" x2="1196" y2="710"/><line class="rainlite" x1="1224" y1="206" x2="1224" y2="710" style="animation-delay:-.3s"/><line class="rainlite" x1="1252" y1="206" x2="1252" y2="710" style="animation-delay:-.5s"/><line class="rainlite" x1="1280" y1="206" x2="1280" y2="710" style="animation-delay:-.2s"/><line class="rainlite" x1="1308" y1="206" x2="1308" y2="710" style="animation-delay:-.6s"/></g>' +
    '<path d="M300 610H420Q448 610 440 650Q420 700 360 700Q296 700 300 650Z" fill="#fff"/><rect x="316" y="470" width="88" height="140" rx="12" fill="#F6F2E6"/><circle cx="360" cy="494" r="9" fill="url(#chr)"/><rect x="300" y="700" width="128" height="20" rx="8" fill="#e5dcc4"/>' +
    '<path d="M520 720Q480 620 500 560M520 720Q540 610 580 570M520 720Q510 640 460 600" stroke="#4f6b4a" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="500" cy="556" rx="14" ry="36" fill="#6a8a5f" transform="rotate(-8 500 556)"/><ellipse cx="582" cy="566" rx="14" ry="36" fill="#6a8a5f" transform="rotate(25 582 566)"/><ellipse cx="458" cy="596" rx="12" ry="32" fill="#7a9a6d" transform="rotate(-40 458 596)"/><path d="M496 720L504 668H540L548 720Z" fill="#C1DBE8"/>' +
    '</svg><div class="cap"><small>Finished, the way you imagined it</small><h2>Modern fittings. Quietly perfect.</h2></div></div>';

  /* ---------- door ---------- */
  var door = '<div class="door"><div class="leaf"><div class="plaque"><img src="logo.png" alt=""><b>Ottoman</b><span>Water Solutions</span></div><div class="handle"></div></div></div>';

  var el = document.createElement('div');
  el.id = 'intro';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Ottoman intro');
  el.innerHTML = s1 + s2 + s3 + s4 + door +
    '<div class="dots"><i class="on"></i><i></i><i></i><i></i><i></i></div>' +
    '<button class="skip" type="button">Skip intro &rsaquo;</button>';
  document.body.appendChild(el);

  var scenes = [].slice.call(el.querySelectorAll('.sc'));
  var dots = [].slice.call(el.querySelectorAll('.dots i'));
  var timers = [], done = false;
  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function clear() { timers.forEach(clearTimeout); timers = []; }
  function show(n) {
    scenes.forEach(function (s, i) { s.classList.toggle('on', i === n - 1 || (n === 5 && i === 3)); });
    dots.forEach(function (d, i) { d.classList.toggle('on', i === n - 1); });
  }
  function finish() {
    if (done) return; done = true; clear();
    try { sessionStorage.setItem('ottoIntro', '1'); } catch (e) {}
    root.classList.remove('intro-on');
    el.classList.add('out');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1300);
  }
  function s5() { show(5); el.classList.add('door'); at(3200, finish); }
  function s4f() { show(4); at(5000, s5); }
  function s3f() { show(3); at(4600, s4f); }
  function s2f() { show(2); at(6000, s3f); }
  function dive() {
    if (done || scenes[0].classList.contains('dive')) return;
    clear(); scenes[0].classList.add('dive'); at(800, s2f);
  }
  el.querySelector('.skip').addEventListener('click', finish);
  el.querySelector('.tap').addEventListener('click', dive);
  el.querySelector('#puddle').addEventListener('click', dive);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });
  at(16000, dive); /* nobody tapped: carry on by itself */
};
/* safety net: if the 3D intro never started, play this 2D one */
window.addEventListener('load', function () { if (!document.getElementById('intro') && document.documentElement.classList.contains('intro-on')) window.ottoIntro2D(); });
