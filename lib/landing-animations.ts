/* eslint-disable no-var, @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initLandingAnimations(): () => void {
  const root = document.documentElement;
  const hdr = document.getElementById("hdr");
  const onScroll = () => {
    hdr?.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  const cleanups: Array<() => void> = [() => window.removeEventListener("scroll", onScroll)];

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    root.classList.remove("gs");
    const li = document.querySelector(".steps .line i") as HTMLElement | null;
    if (li) li.style.transform = "none";
    return () => {
      cleanups.forEach((fn) => fn());
    };
  }
  gsap.registerPlugin(ScrollTrigger);
  var fine = window.matchMedia('(pointer: fine)').matches;
  var q = function(sel, ctx){ return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  // Woorden in een masker zetten
  function splitWords(el){
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function(w){ return '<span class="wm"><span class="wi">' + w + '</span></span>'; }).join(' ');
    return q('.wi', el);
  }

  /* ---------------- HERO ---------------- */
  var hx = document.querySelector('.hx') as HTMLElement | null;
  if (!hx) {
    root.classList.remove("gs");
    return () => cleanups.forEach((fn) => fn());
  }
  var heroWords: Element[] = [];
  q(':scope > span:not(.tiles)', hx).forEach(function(sp){ heroWords = heroWords.concat(splitWords(sp as HTMLElement)); });
  var tiles = q('.tile', hx);
  root.classList.remove('gs');

  var intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .from('.pill', { autoAlpha: 0, y: 16, scale: .96, duration: .7 })
    .from(heroWords, { yPercent: 115, duration: .9, stagger: .06 }, '-=.35')
    .from(tiles, { autoAlpha: 0, scale: .2, y: 30, rotation: function(i){ return i % 2 ? 24 : -24; }, duration: .8, ease: 'back.out(2.2)', stagger: .08 }, '-=.75')
    .from('.hero .sub', { autoAlpha: 0, y: 18, duration: .7 }, '-=.4')
    .from('.ctas.hero-hide .btn', { autoAlpha: 0, y: 18, stagger: .08, duration: .6 }, '-=.45')
    .from('.ticks span', { autoAlpha: 0, y: 10, stagger: .07, duration: .5 }, '-=.35')
    .from('.ticks svg', { scale: 0, rotation: -45, stagger: .07, duration: .5, ease: 'back.out(3)' }, '<')
    .from('.stage', { autoAlpha: 0, y: 80, duration: 1.1 }, '-=.6')
    .from('.mascot-float', { autoAlpha: 0, y: 40, scale: .6, rotation: -20, duration: .9, ease: 'back.out(2)' }, '-=.5')
    .add(chat(), '-=.2');

  // Chat: typen, bericht, afspraak
  function chat(){
    var msgs = q('.msg'), typing = document.querySelector('.typing');
    gsap.set(msgs, { autoAlpha: 0, y: 12, scale: .92 });
    gsap.set('.booked', { autoAlpha: 0, scale: .6, rotation: -8, y: 20 });
    var tl = gsap.timeline();
    msgs.forEach(function(m){
      var out = m.classList.contains('out');
      if (out) {
        tl.call(function(){ m.parentNode.insertBefore(typing, m); typing.style.display = 'flex'; })
          .fromTo(q('i', typing), { y: 0, opacity: .4 }, { y: -4, opacity: 1, stagger: .12, yoyo: true, repeat: 3, duration: .2, ease: 'sine.inOut' })
          .call(function(){ typing.style.display = 'none'; });
      } else {
        tl.to({}, { duration: .35 });
      }
      tl.to(m, { autoAlpha: 1, y: 0, scale: 1, duration: .45, ease: 'back.out(1.8)', transformOrigin: out ? '100% 100%' : '0% 100%' });
    });
    tl.to('.booked', { autoAlpha: 1, scale: 1, rotation: -2, y: 0, duration: .7, ease: 'back.out(2.2)' }, '+=.2')
      .from('.booked .ok svg', { scale: 0, rotation: -90, duration: .5, ease: 'back.out(3)' }, '-=.35')
      .to('.booked', { y: -6, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    return tl;
  }

  // Mascotte in de hero zweeft zachtjes
  gsap.to('.mascot-float', { y: -10, rotation: -2, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 });

  // App-venster trekt recht tijdens scroll
  gsap.fromTo('.app', { rotationX: 12, scale: .95, transformPerspective: 1400, transformOrigin: '50% 0%' },
    { rotationX: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.stage', start: 'top 85%', end: 'top 25%', scrub: .6 } });

  // Geanimeerd icoon (zelfde loop als de video)
  (function(){
    var body = document.querySelector('.as-body'), look = document.querySelector('.as-look');
    var open = document.querySelector('.as-open'), happy = document.querySelector('.as-happy'), sleepy = document.querySelector('.as-sleepy');
    gsap.set(body, { rotation: -8, svgOrigin: '60 64' });
    function eyes(state){ return function(){ gsap.set(open, { opacity: state === 'open' ? 1 : 0 }); gsap.set(happy, { opacity: state === 'happy' ? 1 : 0 }); gsap.set(sleepy, { opacity: state === 'sleepy' ? 1 : 0 }); }; }
    var tl = gsap.timeline({ repeat: -1, delay: 1.2 });
    tl.to(body, { rotation: 0, duration: .7, ease: 'back.out(2)', svgOrigin: '60 64' })
      .call(eyes('happy'), null, .25).call(eyes('open'), null, .6)
      .to(look, { x: 3, duration: .3, ease: 'power2.out' }, 1.1)
      .to(look, { x: -3, y: 1, duration: .35, ease: 'power2.inOut' }, 1.8)
      .to(look, { x: 0, y: 0, duration: .3 }, 2.3)
      .call(eyes('happy'), null, 2.4).call(eyes('open'), null, 2.8)
      .to(look, { x: -2, y: -2, duration: .3 }, 3.1)
      .to(body, { rotation: 30, y: -2, duration: .55, ease: 'power2.inOut', svgOrigin: '60 64' }, 3.5)
      .to(look, { x: 2, y: -1, duration: .3 }, 3.6)
      .to(body, { rotation: 24, duration: .4, ease: 'sine.inOut', svgOrigin: '60 64' }, 4.2)
      .to(body, { rotation: 0, y: 0, duration: .6, ease: 'back.out(2.4)', svgOrigin: '60 64' }, 4.7)
      .to(look, { x: 0, y: 0, duration: .3 }, 4.8)
      .call(eyes('sleepy'), null, 5.2).call(eyes('open'), null, 5.6)
      .to(body, { rotation: -8, duration: .4, ease: 'power2.inOut', svgOrigin: '60 64' }, 5.6);
  })();

  // Logo-groepen maken af en toe een sprongetje
  var groups = q('.tiles', hx).filter(function(g){ return g.children.length > 1; });
  gsap.timeline({ repeat: -1, repeatDelay: 1.2, delay: 3.5 })
    .add(groups.map(function(g){
      return gsap.timeline()
        .to(g.children, { y: '-0.14em', rotation: 0, duration: .28, ease: 'power2.out', stagger: .07 })
        .to(g.children, { y: 0, rotation: function(i, el){ return getComputedStyle(el).getPropertyValue('--rot').trim(); }, duration: .5, ease: 'bounce.out', stagger: .07 }, '-=.1');
    }), '+=0')
    .to({}, { duration: 1 });

  // Tegels reageren op hover
  if (fine) tiles.forEach(function(t){
    t.addEventListener('mouseenter', function(){ gsap.to(t, { y: '-0.12em', scale: 1.1, rotation: 0, zIndex: 5, duration: .35, ease: 'back.out(3)' }); });
    t.addEventListener('mouseleave', function(){ gsap.to(t, { y: 0, scale: 1, rotation: getComputedStyle(t).getPropertyValue('--rot').trim(), zIndex: '', duration: .5, ease: 'elastic.out(1,.5)' }); });
  });

  /* ---------------- SECTIES ---------------- */
  // Scroll-voortgang
  gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

  // Koppen woord voor woord
  q('section h2').forEach(function(h){
    var ws = splitWords(h);
    gsap.from(ws, { yPercent: 115, duration: .9, ease: 'power3.out', stagger: .045, scrollTrigger: { trigger: h, start: 'top 85%' } });
  });
  q('.label').forEach(function(l){
    gsap.from(l, { autoAlpha: 0, x: -16, duration: .6, ease: 'power2.out', scrollTrigger: { trigger: l, start: 'top 88%' } });
    gsap.from(q('i', l), { scale: 0, duration: .5, ease: 'back.out(4)', delay: .2, scrollTrigger: { trigger: l, start: 'top 88%' } });
  });
  q('section .sub, .head .btn, .guide .copy .btn').forEach(function(el){
    gsap.from(el, { autoAlpha: 0, y: 24, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  // Logo-rij
  gsap.from('.logos p', { autoAlpha: 0, y: 12, duration: .6, scrollTrigger: { trigger: '.logos', start: 'top 85%' } });
  gsap.from('.logo-row span', { autoAlpha: 0, y: 24, scale: .9, duration: .6, ease: 'back.out(2)', stagger: .08, scrollTrigger: { trigger: '.logo-row', start: 'top 88%' } });

  // Kaarten in batches
  gsap.set('.cards .card', { autoAlpha: 0, y: 60, rotation: function(i){ return i % 2 ? 2 : -2; } });
  ScrollTrigger.batch('.cards .card', { start: 'top 88%', once: true,
    onEnter: function(b){ gsap.to(b, { autoAlpha: 1, y: 0, rotation: 0, duration: .9, ease: 'power3.out', stagger: .12 }); } });
  q('.chan .card svg').forEach(function(ic){
    gsap.from(ic, { scale: 0, rotation: -30, duration: .6, ease: 'back.out(3)', scrollTrigger: { trigger: ic, start: 'top 85%' }, delay: .3 });
  });

  // Gids: features schuiven in
  gsap.set('.feat', { autoAlpha: 0, x: 40 });
  ScrollTrigger.batch('.feat', { start: 'top 90%', once: true,
    onEnter: function(b){ gsap.to(b, { autoAlpha: 1, x: 0, duration: .8, ease: 'power3.out', stagger: .1 });
      gsap.from(b.map(function(f){ return f.querySelector('.ico'); }), { scale: 0, rotation: -40, duration: .6, ease: 'back.out(3)', stagger: .1, delay: .2 }); } });
  gsap.from('.quote', { autoAlpha: 0, y: 40, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.quote', start: 'top 88%' } });
  gsap.from('.quote figcaption', { autoAlpha: 0, x: 20, duration: .7, delay: .3, scrollTrigger: { trigger: '.quote', start: 'top 88%' } });

  // Bewijs
  gsap.from('.stat', { autoAlpha: 0, y: 40, scale: .95, duration: .8, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '.stats', start: 'top 85%' } });
  gsap.from('.clogos span', { autoAlpha: 0, y: 16, duration: .5, stagger: .07, scrollTrigger: { trigger: '.clogos', start: 'top 90%' } });
  // Manifest: woorden lichten op tijdens scroll
  gsap.fromTo('.manifest .wi', { opacity: .15 }, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.manifest', start: 'top 75%', end: 'bottom 55%', scrub: .5 } });

  // Stappen: lijn tekent mee, nummers ploppen
  gsap.to('.steps .line i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 75%', end: 'center 45%', scrub: .5 } });
  q('.step').forEach(function(st, i){
    var tl = gsap.timeline({ scrollTrigger: { trigger: st, start: 'top 82%' } });
    tl.from(st, { autoAlpha: 0, y: 40, duration: .8, ease: 'power3.out', delay: i * .12 })
      .from(st.querySelector('.num'), { scale: 0, rotation: -90, duration: .6, ease: 'back.out(2.5)' }, '-=.5')
      .from(q('.mini .r', st), { autoAlpha: 0, x: -20, duration: .45, stagger: .1, ease: 'power2.out' }, '-=.2')
      .from(q('.mini .r .tag', st), { scale: .5, autoAlpha: 0, duration: .4, stagger: .1, ease: 'back.out(3)' }, '-=.3')
      .from(q('.cal i', st), { scale: 0, duration: .35, ease: 'back.out(3)', stagger: { each: .03, from: 'random' } }, '-=.4');
  });

  // Verschil
  gsap.from('.col.no', { autoAlpha: 0, x: -50, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.compare', start: 'top 85%' } });
  gsap.from('.col.yes', { autoAlpha: 0, x: 50, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.compare', start: 'top 85%' } });
  q('.col').forEach(function(c){
    gsap.from(q('.it', c), { autoAlpha: 0, y: 14, duration: .5, stagger: .1, delay: .35, scrollTrigger: { trigger: c, start: 'top 85%' } });
    gsap.from(q('.it svg', c), { scale: 0, rotation: -60, duration: .5, stagger: .1, delay: .45, ease: 'back.out(3)', scrollTrigger: { trigger: c, start: 'top 85%' } });
  });

  // FAQ: items in beeld en zacht open/dicht
  gsap.from('.faq details', { autoAlpha: 0, y: 20, duration: .6, stagger: .08, ease: 'power2.out', scrollTrigger: { trigger: '.faq', start: 'top 80%' } });
  q('.faq details').forEach(function(d){
    var sum = d.querySelector('summary'), p = d.querySelector('p');
    sum.addEventListener('click', function(e){
      e.preventDefault();
      if (d.open) {
        gsap.to(p, { height: 0, autoAlpha: 0, paddingBottom: 0, duration: .35, ease: 'power2.in', onComplete: function(){ d.open = false; gsap.set(p, { clearProps: 'all' }); } });
        gsap.to(d.querySelector('.pl'), { rotation: 0, duration: .35 });
      } else {
        d.open = true;
        gsap.fromTo(p, { height: 0, autoAlpha: 0, paddingBottom: 0 }, { height: 'auto', autoAlpha: 1, paddingBottom: 22, duration: .45, ease: 'power3.out' });
        gsap.fromTo(d.querySelector('.pl'), { rotation: 0 }, { rotation: 135, duration: .45, ease: 'back.out(2)' });
      }
    });
  });

  // CTA groeit in beeld, mascotte zwaait
  gsap.fromTo('.cta', { scale: .9, y: 60, borderRadius: 80 }, { scale: 1, y: 0, borderRadius: 36, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top 95%', end: 'top 55%', scrub: .6 } });
  gsap.from('.cta-mascot-3d', { autoAlpha: 0, scale: .4, rotation: -30, y: 40, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: '.cta', start: 'top 70%' } });
  gsap.from('.cta .btn', { autoAlpha: 0, y: 16, stagger: .1, duration: .6, scrollTrigger: { trigger: '.cta', start: 'top 70%' } });

  /* ---------------- MICRO ---------------- */
  if (fine) {
    // Magnetische knoppen
    q('.btn').forEach(function(b){
      var xTo = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), yTo = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
      b.addEventListener('mousemove', function(e){ var r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .35); });
      b.addEventListener('mouseleave', function(){ xTo(0); yTo(0); });
    });
    // Kaarten kantelen licht mee met de muis
    q('.card, .col, .feat').forEach(function(c){
      gsap.set(c, { transformPerspective: 900 });
      var rx = gsap.quickTo(c, 'rotationX', { duration: .5, ease: 'power3' }), ry = gsap.quickTo(c, 'rotationY', { duration: .5, ease: 'power3' });
      c.addEventListener('mousemove', function(e){ var r = c.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 6); rx(-((e.clientY - r.top) / r.height - .5) * 6); });
      c.addEventListener('mouseleave', function(){ rx(0); ry(0); });
    });
    // Icoontjes wiebelen bij hover
    q('.feat').forEach(function(f){
      var ic = f.querySelector('.ico');
      f.addEventListener('mouseenter', function(){ gsap.fromTo(ic, { rotation: 0 }, { keyframes: { rotation: [-12, 10, -6, 0] }, duration: .6, ease: 'power1.inOut' }); });
    });
    q('.num').forEach(function(n){
      n.addEventListener('mouseenter', function(){ gsap.fromTo(n, { rotation: 0 }, { rotation: 360, duration: .7, ease: 'back.out(1.6)' }); });
    });
    // Mascotte in de hero kijkt een beetje naar je muis
    var mf = document.querySelector('.mascot-float');
    var mx = gsap.quickTo(mf, 'x', { duration: .8, ease: 'power3' });
    window.addEventListener('mousemove', function(e){ mx((e.clientX / window.innerWidth - .5) * 18); });
  }
  // Logo-pills en tegels in de stappen: klein veertje bij hover
  q('.logo-row span').forEach(function(sp){
    sp.addEventListener('mouseenter', function(){ gsap.to(sp, { y: -4, duration: .3, ease: 'back.out(3)' }); });
    sp.addEventListener('mouseleave', function(){ gsap.to(sp, { y: 0, duration: .4, ease: 'power2.out' }); });
  });

  const onLoad = () => ScrollTrigger.refresh();
  window.addEventListener("load", onLoad);
  cleanups.push(() => window.removeEventListener("load", onLoad));
  cleanups.push(() => ScrollTrigger.getAll().forEach((t) => t.kill()));

  return () => {
    cleanups.forEach((fn) => fn());
  };
}
