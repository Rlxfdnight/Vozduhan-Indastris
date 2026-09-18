(function(){
'use strict';
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* ---- Навигация ---- */
const nav = $('#nav'), burger = $('#burger'), mMenu = $('#mMenu');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), {passive:true});
burger.addEventListener('click', () => {
  const open = mMenu.classList.toggle('open');
  burger.classList.toggle('on', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
mMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => burger.click()));

/* ---- Reveal ---- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}), {threshold:.15});
$$('.rv, .sec-head').forEach(el => io.observe(el));

/* ---- Scramble-заголовок ---- */
const CHARS = '▮ВОЗДХИНСТЯ#_/01';
function scramble(el, delay){
  const final = el.dataset.text;
  if(RM){ el.textContent = final; return; }
  el.textContent = '';
  setTimeout(() => {
    let f = 0;
    const t = setInterval(() => {
      f++;
      el.textContent = final.split('').map((c,i) =>
        c === ' ' ? ' ' : (i < (f-6)/2 ? c : CHARS[Math.random()*CHARS.length|0])
      ).join('');
      if((f-6)/2 >= final.length){ el.textContent = final; clearInterval(t); }
    }, 42);
  }, delay);
}
$$('.scr').forEach((el,i) => scramble(el, 300 + i*450));

/* ---- Счётчики ---- */
const days = Math.floor((Date.now() - new Date(2010,0,1)) / 864e5);
$$('[data-days]').forEach(el => el.dataset.count = days);
function countUp(el){
  const target = +el.dataset.count;
  if(RM){ el.textContent = target.toLocaleString('ru-RU'); return; }
  const t0 = performance.now(), dur = 1600;
  (function tick(now){
    const p = Math.min((now - t0)/dur, 1), e = 1 - Math.pow(1-p, 4);
    el.textContent = Math.round(target * e).toLocaleString('ru-RU');
    if(p < 1) requestAnimationFrame(tick);
  })(t0);
}
const cio = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); }
}), {threshold:.5});
$$('[data-count]').forEach(el => cio.observe(el));

/* ---- Аудио-движок ---- */
let actx = null;
function audio(){
  actx = actx || new (window.AudioContext||window.webkitAudioContext)();
  if(actx.state === 'suspended') actx.resume();
  return actx;
}
/* Клик печатной машинки — на каждый символ */
function typeTick(){
  try{
    const ctx = audio(), t = ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'square';
    o.frequency.value = 1200 + Math.random()*700;
    f.type = 'highpass'; f.frequency.value = 600;
    g.gain.setValueAtTime(.028, t);
    g.gain.exponentialRampToValueAtTime(.0001, t + .045);
    o.connect(f).connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + .05);
  }catch(e){}
}
/* «Каретка» — завершение печати */
function typeDone(){
  try{
    const ctx = audio(), t = ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(520, t);
    o.frequency.exponentialRampToValueAtTime(260, t + .12);
    g.gain.setValueAtTime(.05, t);
    g.gain.exponentialRampToValueAtTime(.0001, t + .15);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + .16);
  }catch(e){}
}

/* ---- Генератор ---- */
const PHRASES = [
  'Кто-то читает эти инсайты?.',
  'Не стоит доверять пользователям Arch Linux.',
  'Через левое плечо плевал? Я посчитал ты не 3 раза плюнул.',
  'Мы не помогаем, мы могаем.',
  'Как глупо было верить в связь.',
  'Вентилятор дует воздухан индастрис!.',
  'Мы "точно" не имеем доступ к вашим картам.',
  'Сила тока - когда ума нет, но есть тока сила.',
  'Закон Ома - денег нет, сиди дома.',
  'Мы уволили менеджера за то что он мастурбировал (и без нас).'
];
const genOut = $('#genOut'), genBtn = $('#genBtn'), genCount = $('#genCount');
let genN = 0, typeTimer = null;
function typeText(text){
  clearInterval(typeTimer);
  if(RM){ genOut.innerHTML = text + '<span class="caret"></span>'; return; }
  genOut.innerHTML = '<span class="caret"></span>';
  let i = 0;
  typeTimer = setInterval(() => {
    i++;
    genOut.innerHTML = text.slice(0,i) + '<span class="caret"></span>';
    const ch = text[i-1];
    if(ch && ch !== ' ') typeTick();
    if(i >= text.length){
      clearInterval(typeTimer);
      typeDone();
    }
  }, 26);
}
genBtn.addEventListener('click', () => {
  audio();
  genN++;
  genCount.textContent = String(genN).padStart(3,'0');
  const n = String(41 + genN).padStart(4,'0');
  const phrase = PHRASES[Math.random()*PHRASES.length|0];
  typeText(`ИНСАЙТ №${n} // «${phrase}»`);
  if(genN === 1) toast('Генератор прогрет. Воздух пошёл!');
});

/* ---- Тосты ---- */
function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = '✔ ' + msg;
  $('#toasts').appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 500); }, 3600);
}

/* ---- Форма ---- */
$('#orderForm').addEventListener('submit', e => {
  e.preventDefault();
  const b = $('#orderBtn');
  b.textContent = 'Передаём в цех...'; b.disabled = true;
  setTimeout(() => {
    b.textContent = 'Передать в цех ↗'; b.disabled = false;
    e.target.reset();
    toast('Заявка принята! Воздухан свяжется после проветривания.');
  }, 1100);
});

/* ---- Цеховой гул (музыка) ---- */
const musicBtn = $('#musicBtn');
let hum = null;
musicBtn.addEventListener('click', () => {
  const ctx = audio();
  if(hum){
    hum.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + .4);
    const src = hum.src; setTimeout(() => src.stop(), 500);
    hum = null;
    musicBtn.classList.remove('playing');
    musicBtn.setAttribute('aria-pressed','false');
    toast('Цеховой гул остановлен.');
    return;
  }
  const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  let last = 0;
  for(let i=0;i<len;i++){ const w = Math.random()*2-1; last = (last + .02*w)/1.02; d[i] = last*3.5; }
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const lp = ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value = 170;
  const g = ctx.createGain(); g.gain.value = 0;
  const lfo = ctx.createOscillator(), lg = ctx.createGain();
  lfo.frequency.value = .4; lg.gain.value = .015;
  lfo.connect(lg).connect(g.gain);
  src.connect(lp).connect(g).connect(ctx.destination);
  src.start(); lfo.start();
  g.gain.linearRampToValueAtTime(.06, ctx.currentTime + .6);
  hum = {src, gain:g};
  musicBtn.classList.add('playing');
  musicBtn.setAttribute('aria-pressed','true');
  toast('Цеховой гул включён. Смена началась.');
});

/* ---- Дисклеймер ---- */
const modal = $('#modal');
function openModal(){ modal.classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(){ modal.classList.remove('open'); document.body.style.overflow=''; sessionStorage.setItem('vi-brief','1'); }
$('#tbOpen').addEventListener('click', openModal);
$('#tbClose').addEventListener('click', closeModal);
$('#tbAccept').addEventListener('click', () => { closeModal(); toast('Инструктаж пройден. Добро пожаловать в цех!'); });
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
addEventListener('keydown', e => { if(e.key === 'Escape'){ closeModal(); if(mMenu.classList.contains('open')) burger.click(); } });
if(!sessionStorage.getItem('vi-brief')) setTimeout(openModal, 700);
})();
