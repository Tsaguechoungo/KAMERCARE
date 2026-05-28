/* 
   KAMERCARE – app.js
    */
// 
// SLIDER
// 
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('sliderDots');
const counter = document.getElementById('slideCounter');
let current = 0;
let autoTimer = null;
// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Slide ' + (i + 1));
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});
function goToSlide(index) {
  if (index === current) return;
  slides[current].classList.remove('active');
  slides[current].classList.add('exiting');
  const prevIdx = current;
  setTimeout(() => slides[prevIdx].classList.remove('exiting'), 900);
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
  counter.textContent = (current + 1) + ' / ' + slides.length;
}
function changeSlide(dir) {
  resetAuto();
  goToSlide(current + dir);
}
function startAuto() {
  autoTimer = setInterval(() => goToSlide(current + 1), 5500);
}
function resetAuto() {
  clearInterval(autoTimer);
  startAuto();
}
startAuto();
// Keyboard nav
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') changeSlide(-1);
  if (e.key === 'ArrowRight') changeSlide(1);
});
// Touch / swipe
let touchStartX = 0;
const sliderEl = document.querySelector('.hero-slider');
sliderEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
sliderEl.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) changeSlide(diff > 0 ? 1 : -1);
});
// 
// SEARCH
// 
const products = [
  { name: 'Advanced Toothpaste', category: 'Oral Hygiene', id: 'toothpaste', keywords: ['tooth', 'paste', 'oral',
'mouth', 'brush', 'teeth', 'dental', 'fluoride'] },
  { name: 'Hand Sanitizer',       category: 'Hand Hygiene',  id: 'sanitizer',  keywords: ['hand', 'sanitizer',
'sanitise', 'germ', 'alcohol', 'clean', 'disinfect', 'wash'] },
  { name: 'Medicated Soap',       category: 'Skin Cleansing',id: 'soap',       keywords: ['soap', 'medicated',
'skin', 'bar', 'wash', 'clean', 'antibacterial'] },
  { name: 'Daily Skin Cream',     category: 'Skin Care',     id: 'cream',      keywords: ['cream', 'skin',
'moisturizer', 'lotion', 'hydration', 'daily', 'face', 'body'] },
  { name: 'Hygiene Powder',       category: 'Body Hygiene',  id: 'powder',     keywords: ['powder', 'hygiene',
'fresh', 'odor', 'sweat', 'moisture', 'talc'] },
];
const searchInput = document.getElementById('searchInput');
const dropdown = document.getElementById('searchDropdown');
searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase().trim();
  dropdown.innerHTML = '';
  if (!q) { dropdown.classList.add('hidden'); return; }
  const matches = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.keywords.some(k => k.includes(q))
  );
  if (matches.length === 0) {
    dropdown.innerHTML = '<div class="search-item" style="color:rgba(255,255,255,0.4)">No products found</div>';
    dropdown.classList.remove('hidden');
    return;
  }
  matches.forEach(p => {
    const item = document.createElement('a');
    item.className = 'search-item';
    item.href = '#' + p.id;
    item.innerHTML = `<strong>${p.name}</strong> <span style="opacity:.5;font-size:.8em"> — ${p.category}</span>`;
    item.addEventListener('click', () => {
      dropdown.classList.add('hidden');
      searchInput.value = '';
    });
    dropdown.appendChild(item);
  });
  dropdown.classList.remove('hidden');
});
// Close dropdown on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrap')) dropdown.classList.add('hidden');
});
function doSearch() {
  searchInput.dispatchEvent(new Event('input'));
}
// 
// MOBILE MENU
// 
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}
// 
// SCROLL ANIMATIONS (Intersection Observer)
// 
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
// Add fade-in class to cards
document.querySelectorAll('.product-card, .condition-card, .feature-item, .contact-card').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
// Inject fade-in styles dynamically
const style = document.createElement('style');
style.textContent = `
  .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
  .product-card.fade-in { transition-delay: calc(var(--i, 0) * 80ms); }
`;
document.head.appendChild(style);
// Stagger product cards
document.querySelectorAll('.product-card').forEach((el, i) => {
  el.style.setProperty('--i', i);
});
// 
// NAVBAR SCROLL EFFECT
// 
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.35)' : 'none';
});