/* gallery.js — renderiza a grade de social media (página /socialmedia).
   As imagens ficam em /img, então usamos caminho relativo "../img/". */
const galleryItems = [
  "1.png", "5.png", "3.png", "22.png", "15.png",
  "17.png", "13.png", "16.png", "2859049.png"
];

const grid = document.getElementById('gallery-grid');
if(grid){
  grid.innerHTML = '';
  galleryItems.forEach(file=>{
    const div = document.createElement('div');
    div.className = 'g-item';
    div.innerHTML = `<img src="../img/${file}" alt="Social Media" loading="lazy">`;
    grid.appendChild(div);
  });

  // stagger de entrada (se o GSAP estiver disponível)
  if(window.gsap){
    gsap.fromTo('.g-item', {y:16, opacity:0}, {y:0, opacity:1, duration:.5, ease:'power2.out', stagger:.035});
  }
}
