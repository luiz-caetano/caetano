/* ============================================================
   site.js — script compartilhado por todas as páginas.
   Cada bloco só roda se os elementos dele existirem, então o
   mesmo arquivo serve tanto o index (SPA: Início/Sobre/Contato)
   quanto as páginas de projeto e a landing /metodo.
   ============================================================ */

/* ---------------- MENU MOBILE ---------------- */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
function openMobileMenu(){ if(mobileMenuOverlay){ mobileMenuOverlay.classList.add('open'); document.body.style.overflow='hidden'; } }
function closeMobileMenu(){ if(mobileMenuOverlay){ mobileMenuOverlay.classList.remove('open'); document.body.style.overflow=''; } }
if(hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileMenu);
if(mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
if(mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', (e)=>{ if(e.target === mobileMenuOverlay) closeMobileMenu(); });

/* ---------------- LINHAS CLICÁVEIS (data-href) ---------------- */
document.querySelectorAll('[data-href]').forEach(el=>{
  el.addEventListener('click', ()=>{ window.location.href = el.dataset.href; });
});

/* ---------------- PREVIEW QUE SEGUE O CURSOR (home) ---------------- */
const previewFloat = document.getElementById('previewFloat');
const previewImg = document.getElementById('previewImg');
if(previewFloat && previewImg){
  let targetX=0, targetY=0, curX=0, curY=0;
  document.querySelectorAll('.has-preview').forEach(el=>{
    el.addEventListener('mouseenter', ()=>{ previewImg.src = el.dataset.preview; previewFloat.classList.add('show'); });
    el.addEventListener('mouseleave', ()=>{ previewFloat.classList.remove('show'); });
    el.addEventListener('mousemove', (e)=>{ targetX = e.clientX; targetY = e.clientY; });

    // Touch: mobile has no mouseleave, so mouseenter's synthetic tap left the
    // preview stuck open until the user tapped elsewhere. Show it while the
    // finger is down and hide it the instant it lifts, no outside tap needed.
    el.addEventListener('touchstart', (e)=>{
      const t = e.touches[0];
      previewImg.src = el.dataset.preview;
      targetX = curX = t.clientX;
      targetY = curY = t.clientY;
      previewFloat.classList.add('show');
    }, {passive:true});
    el.addEventListener('touchmove', (e)=>{
      const t = e.touches[0];
      targetX = t.clientX; targetY = t.clientY;
    }, {passive:true});
    el.addEventListener('touchend', ()=> previewFloat.classList.remove('show'));
    el.addEventListener('touchcancel', ()=> previewFloat.classList.remove('show'));
  });
  (function raf(){
    curX += (targetX-curX)*0.18;
    curY += (targetY-curY)*0.18;
    previewFloat.style.left = curX+'px';
    previewFloat.style.top = curY+'px';
    requestAnimationFrame(raf);
  })();
}

/* ---------------- HOME (SPA: Início / Sobre / Contato) ---------------- */
const isHome = !!document.getElementById('page-home');
if(isHome){
  const showPage = (id)=>{
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    const target = document.getElementById('page-'+id);
    if(!target) return;
    target.classList.add('active');
    document.querySelectorAll('.nav-link[data-page], .mobile-menu-link[data-page], .footer-link[data-page]').forEach(l=>{
      l.classList.toggle('active', l.dataset.page === id);
    });
    document.querySelectorAll('[data-section="projetos"]').forEach(l=>l.classList.remove('active'));
    window.scrollTo(0,0);
    history.replaceState(null,null,'#'+id);
    requestAnimationFrame(()=>requestAnimationFrame(()=> pageEnterAnim(id) ));
  };
  window.__showPage = showPage;

  document.querySelectorAll('[data-page]').forEach(el=>{
    el.addEventListener('click', (e)=>{ e.preventDefault(); showPage(el.dataset.page); closeMobileMenu(); });
  });

  const goToProjetos = ()=>{
    if(!document.getElementById('page-home').classList.contains('active')) showPage('home');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const t = document.getElementById('indexList');
      if(!t) return;
      const pos = t.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }));
  };
  document.querySelectorAll('[data-section="projetos"]').forEach(link=>{
    link.addEventListener('click', (e)=>{ e.preventDefault(); goToProjetos(); closeMobileMenu(); });
  });

  const updateActiveNav = ()=>{
    const homePage = document.getElementById('page-home');
    const projetosLinks = document.querySelectorAll('[data-section="projetos"]');
    const inicioLinks = document.querySelectorAll('[data-page="home"]');
    if(!homePage.classList.contains('active')){ projetosLinks.forEach(l=>l.classList.remove('active')); return; }
    const indexList = document.getElementById('indexList');
    if(!indexList) return;
    const pastThreshold = (window.scrollY + 120) >= indexList.offsetTop;
    projetosLinks.forEach(l=>l.classList.toggle('active', pastThreshold));
    inicioLinks.forEach(l=>l.classList.toggle('active', !pastThreshold));
  };
  window.addEventListener('scroll', updateActiveNav);
  window.addEventListener('load', updateActiveNav);

  window.addEventListener('load', ()=>{
    const hash = location.hash.replace('#','');
    const initial = (hash && document.getElementById('page-'+hash)) ? hash : 'home';
    showPage(initial);
  });
}

/* ---------------- GSAP ---------------- */
if(window.gsap){
  gsap.registerPlugin(ScrollTrigger);

  window.pageEnterAnim = function(id){
    const page = document.getElementById('page-'+id);
    if(!page) return;
    const tiles = page.querySelectorAll('.g-item');
    if(tiles.length){
      gsap.fromTo(tiles, {y:16, opacity:0}, {y:0, opacity:1, duration:.5, ease:'power2.out', stagger:.035, overwrite:true});
    }
    const blocks = Array.from(page.querySelectorAll(':scope > .wrap > *'))
      .filter(el => !el.classList.contains('index-list') && !el.classList.contains('gallery-grid'));
    gsap.fromTo(blocks, {y:22, opacity:0}, {y:0, opacity:1, duration:.65, ease:'power3.out', stagger:.09, overwrite:true});
    if(id === 'home'){
      const rows = page.querySelectorAll('.index-row');
      gsap.fromTo(rows, {y:16, opacity:0}, {y:0, opacity:1, duration:.4, ease:'power2.out', stagger:.05, overwrite:true});
    }
  };

  // chrome comum a todas as páginas
  gsap.fromTo('.topnav', {y:-18, opacity:0}, {y:0, opacity:1, duration:.6, ease:'power2.out'});
  gsap.fromTo('.wa-fab', {scale:.7, opacity:0}, {scale:1, opacity:1, duration:.55, delay:.4, ease:'back.out(1.8)'});
  if(document.querySelector('.footer-inner')){
    gsap.fromTo('.footer-inner > *', {y:22, opacity:0}, {
      y:0, opacity:1, duration:.7, ease:'power3.out', stagger:.08,
      scrollTrigger:{ trigger:'.site-footer', start:'top 92%' }
    });
  }

  // páginas normais (projeto / landing): revela blocos com .reveal ao entrar na viewport
  if(!isHome){
    gsap.utils.toArray('.reveal').forEach(el=>{
      gsap.fromTo(el, {y:24, opacity:0}, {
        y:0, opacity:1, duration:.7, ease:'power3.out',
        scrollTrigger:{ trigger:el, start:'top 90%' }
      });
    });
  }
}
