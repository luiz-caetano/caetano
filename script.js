// PAGE ROUTING
const navEls = document.querySelectorAll('[data-page]');

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');

  // "Início", "Sobre", "Social Media" (and any element with data-page) sync normally
  document.querySelectorAll('.nav-link, .mobile-menu-link, .footer-link[data-page]').forEach(l=>{
    l.classList.toggle('active', l.dataset.page === id);
  });

  // "Projetos" only lights up while we're on the home page AND scrolled into that section —
  // it's controlled by updateActiveNav(), so whenever we switch pages we reset it here.
  document.querySelectorAll('[data-section="projetos"]').forEach(l=>l.classList.remove('active'));

  window.scrollTo(0,0);
  history.replaceState(null,null,'#'+id);
  requestAnimationFrame(()=>requestAnimationFrame(()=> pageEnterAnim(id) ));
}

navEls.forEach(el=>{
  el.addEventListener('click', (e)=>{
    e.preventDefault();
    showPage(el.dataset.page);
    closeMobileMenu();
  });
});

window.addEventListener('load', ()=>{
  const hash = location.hash.replace('#','');
  const initial = (hash && document.getElementById('page-'+hash)) ? hash : 'home';
  showPage(initial);
});

// ==================== HAMBURGER / MOBILE MENU ====================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

function openMobileMenu(){ mobileMenuOverlay.classList.add('open'); document.body.style.overflow='hidden'; }
function closeMobileMenu(){ mobileMenuOverlay.classList.remove('open'); document.body.style.overflow=''; }

hamburgerBtn.addEventListener('click', openMobileMenu);
mobileMenuClose.addEventListener('click', closeMobileMenu);
mobileMenuOverlay.addEventListener('click', (e)=>{
  if(e.target === mobileMenuOverlay) closeMobileMenu();
});

// ==================== PROJETOS (scroll-to-section) ====================
// Clicking "Projetos" always ends up showing the project index:
// - if we're already on the home page, it just smooth-scrolls to it
// - if we're on Sobre/Social Media/any other page, it switches back to
//   home first, then smooth-scrolls to the project list
function goToProjetos(){
  const onHome = document.getElementById('page-home').classList.contains('active');
  if(!onHome){
    showPage('home');
  }
  // wait a frame so the (now visible) section has real layout/position before measuring it
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const target = document.getElementById('indexList');
    if(!target) return;
    const offset = 90; // ajuste se precisar
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }));
}

document.querySelectorAll('[data-section="projetos"]').forEach(link=>{
  link.addEventListener('click', (e)=>{
    e.preventDefault();
    goToProjetos();
    closeMobileMenu();
  });
});

// Highlight "Projetos" (and un-highlight "Início") as the user scrolls
// past the project list — only while the home page is actually active.
function updateActiveNav(){
  const homePage = document.getElementById('page-home');
  const projetosLinks = document.querySelectorAll('[data-section="projetos"]');
  const inicioLinks = document.querySelectorAll('[data-page="home"]');

  if(!homePage || !homePage.classList.contains('active')){
    projetosLinks.forEach(l=>l.classList.remove('active'));
    return;
  }

  const indexList = document.getElementById('indexList');
  if(!indexList) return;

  const scrollY = window.scrollY + 120; // ajuste fino
  const pastThreshold = scrollY >= indexList.offsetTop;

  projetosLinks.forEach(l=>l.classList.toggle('active', pastThreshold));
  inicioLinks.forEach(l=>l.classList.toggle('active', !pastThreshold));
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// CURSOR-FOLLOW PREVIEW
const previewFloat = document.getElementById('previewFloat');
const previewImg = document.getElementById('previewImg');
let targetX=0, targetY=0, curX=0, curY=0;
document.querySelectorAll('.has-preview').forEach(el=>{
  el.addEventListener('mouseenter', ()=>{
    previewImg.src = el.dataset.preview;
    previewFloat.classList.add('show');
  });
  el.addEventListener('mouseleave', ()=>{
    previewFloat.classList.remove('show');
  });
  el.addEventListener('mousemove', (e)=>{
    targetX = e.clientX; targetY = e.clientY;
  });
});
function raf(){
  curX += (targetX-curX)*0.18;
  curY += (targetY-curY)*0.18;
  previewFloat.style.left = curX+'px';
  previewFloat.style.top = curY+'px';
  requestAnimationFrame(raf);
}
raf();

// ==================== GALLERY ====================
// Array de imagens (9 itens)
const galleryItems = [
  { image: "img/1.png" },
  { image: "img/5.png" },
  { image: "img/3.png" },
  { image: "img/22.png" },
  { image: "img/15.png" },
  { image: "img/17.png" },
  { image: "img/13.png" },
  { image: "img/16.png" },
  { image: "img/2859049.png" }
];

// Gerar os cards UMA ÚNICA VEZ
const grid = document.getElementById('gallery-grid');
if(grid){
  grid.innerHTML = ''; // Limpa qualquer conteúdo anterior
  galleryItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'g-item';
    div.innerHTML = `
      <img src="${item.image}" alt="Social Media" loading="lazy">
    `;
    grid.appendChild(div);
  });
}

/* ---------------- GSAP ANIMATIONS ---------------- */
gsap.registerPlugin(ScrollTrigger);

// entrance for whichever section is inside the active page's .wrap
function pageEnterAnim(id){
  const page = document.getElementById('page-'+id);
  if(!page) return;

  // gallery: stagger each tile individually
  const tiles = page.querySelectorAll('.g-item');
  if(tiles.length){
    gsap.fromTo(tiles, {y:16, opacity:0}, {y:0, opacity:1, duration:.5, ease:'power2.out', stagger:.035, overwrite:true});
  }

  // every other direct block inside .wrap, skipping the index list
  // (that one gets its own scroll-based reveal below)
  const blocks = Array.from(page.querySelectorAll(':scope > .wrap > *'))
    .filter(el => !el.classList.contains('index-list') && !el.classList.contains('gallery-grid'));
  gsap.fromTo(blocks, {y:22, opacity:0}, {y:0, opacity:1, duration:.65, ease:'power3.out', stagger:.09, overwrite:true});

  if(id === 'home'){
    const rows = page.querySelectorAll('.index-row');
    gsap.fromTo(rows, {y:16, opacity:0}, {y:0, opacity:1, duration:.4, ease:'power2.out', stagger:.05, overwrite:true});
  }
}

// top chrome: nav + floating whatsapp button pop in once on load
gsap.fromTo('.topnav', {y:-18, opacity:0}, {y:0, opacity:1, duration:.6, ease:'power2.out'});
gsap.fromTo('.wa-fab', {scale:.7, opacity:0}, {scale:1, opacity:1, duration:.55, delay:.4, ease:'back.out(1.8)'});

// footer reveals as it scrolls into view (shared across every page)
gsap.fromTo('.footer-inner > *', {y:22, opacity:0}, {
  y:0, opacity:1, duration:.7, ease:'power3.out', stagger:.08,
  scrollTrigger:{ trigger:'.site-footer', start:'top 92%' }
});