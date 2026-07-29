/* metodo.js — modal de aplicação (aberto pelos CTAs da página) + envio direto pro WhatsApp */
const mFormOverlay = document.getElementById('mFormOverlay');
const mFormClose = document.getElementById('mFormClose');

function openApplicationModal(){
  if(!mFormOverlay) return;
  if(typeof closeMobileMenu === 'function') closeMobileMenu();
  mFormOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeApplicationModal(){
  if(!mFormOverlay) return;
  mFormOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-open-modal]').forEach(el=>{
  el.addEventListener('click', (e)=>{ e.preventDefault(); openApplicationModal(); });
});
if(mFormClose) mFormClose.addEventListener('click', closeApplicationModal);
if(mFormOverlay) mFormOverlay.addEventListener('click', (e)=>{ if(e.target === mFormOverlay) closeApplicationModal(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeApplicationModal(); });

const aplicacaoForm = document.getElementById('aplicacaoForm');
if(aplicacaoForm){
  aplicacaoForm.addEventListener('submit', function(e){
    e.preventDefault();
    var f = e.target;
    var msg =
      "*Nova aplicação — Método Presença Digital*%0A%0A" +
      "*Nome e negócio:* " + encodeURIComponent(f.nome.value) + "%0A" +
      "*Instagram:* " + encodeURIComponent(f.instagram.value) + "%0A" +
      "*WhatsApp:* " + encodeURIComponent(f.whatsapp.value) + "%0A" +
      "*Investimento mensal:* " + encodeURIComponent(f.investimento.value) + "%0A" +
      "*Prazo para começar:* " + encodeURIComponent(f.prazo.value) + "%0A" +
      "*Maior dificuldade:* " + encodeURIComponent(f.dificuldade.value);
    window.open("https://wa.me/5535999902059?text=" + msg, "_blank");
    closeApplicationModal();
  });
}

/* fecha o menu mobile ao clicar num link de âncora da própria página */
document.querySelectorAll('.mobile-menu-link').forEach(el=>{
  el.addEventListener('click', ()=>{ if(typeof closeMobileMenu === 'function') closeMobileMenu(); });
});

/* ---------------- PARALLAX ---------------- */
if(window.gsap && window.ScrollTrigger){
  gsap.to('.m-hero-bg', {
    yPercent: 22, ease:'none',
    scrollTrigger:{ trigger:'.m-hero', start:'top top', end:'bottom top', scrub:true }
  });
  gsap.to('.m-final-bg', {
    yPercent: 16, ease:'none',
    scrollTrigger:{ trigger:'.m-final', start:'top bottom', end:'bottom top', scrub:true }
  });
  gsap.utils.toArray('.m-pain .n, .m-step .sn, .m-pillar .pn').forEach(el=>{
    gsap.fromTo(el, {y:24}, {
      y:-14, ease:'none',
      scrollTrigger:{ trigger:el, start:'top bottom', end:'bottom top', scrub:true }
    });
  });
}
