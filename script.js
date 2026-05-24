const container = document.getElementById('container');
const starCanvas = document.getElementById('starfield');
const centerText = document.querySelector('.center-text');
const ctx = starCanvas.getContext('2d');

const messages = [
  'TE AMO',
  '💞',
  '✨',
  'FOREVER',
  'MI NIÑO',
  'TU Y YO POR SIEMPRE',
  '❤️'
];

const photoUrls = [
  'photos/foto1.png',
  'photos/foto2.png',
  'photos/foto3.jpeg',
  'photos/foto4.jpeg',
  'photos/foto5.jpeg',
  'photos/image.png',
  'photos/images.png'
].map(src => encodeURI(src));

let width = window.innerWidth;
let height = window.innerHeight;
const stars = [];
let lastTrail = 0;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  starCanvas.width = width;
  starCanvas.height = height;
}

function createStar() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    z: Math.random() * width,
    alpha: 0.2 + Math.random() * 0.8,
    size: 0.8 + Math.random() * 1.8,
    speed: 0.7 + Math.random() * 1.4
  };
}

function resetStars() {
  stars.length = 0;
  for (let i = 0; i < 170; i += 1) {
    stars.push(createStar());
  }
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  stars.forEach((star) => {
    star.z -= star.speed;
    if (star.z <= 0) {
      Object.assign(star, createStar());
      star.z = width;
    }

    const k = 128.0 / star.z;
    const x = (star.x - width / 2) * k + width / 2;
    const y = (star.y - height / 2) * k + height / 2;
    const size = star.size * k * 0.8;
    const alpha = star.alpha * (1 - star.z / width);

    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function animateStars() {
  drawStars();
  requestAnimationFrame(animateStars);
}

function createText() {
  const text = document.createElement('div');
  text.classList.add('text');
  text.innerText = messages[Math.floor(Math.random() * messages.length)];

  const rotateX = Math.random() * 40 - 20;
  const rotateY = Math.random() * 360;
  const x = Math.random() * 90 + 5;
  const size = Math.random() * 40 + 20;
  const duration = Math.random() * 5 + 5;

  text.style.left = `${x}vw`;
  text.style.top = '100vh';
  text.style.fontSize = `${size}px`;
  text.style.setProperty('--rotate-x', `${rotateX}deg`);
  text.style.setProperty('--rotate-y', `${rotateY}deg`);
  text.style.animationDuration = `${duration}s`;

  container.appendChild(text);
  setTimeout(() => text.remove(), duration * 1000);
}

function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.innerText = '💖';

  const rotateX = Math.random() * 40 - 20;
  const rotateY = Math.random() * 360;
  const x = Math.random() * 90 + 5;
  const size = Math.random() * 30 + 10;
  const duration = Math.random() * 4 + 4;

  heart.style.left = `${x}vw`;
  heart.style.top = '100vh';
  heart.style.fontSize = `${size}px`;
  heart.style.setProperty('--rotate-x', `${rotateX}deg`);
  heart.style.setProperty('--rotate-y', `${rotateY}deg`);
  heart.style.animationDuration = `${duration}s`;

  container.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}

function createTrailHeart(clientX, clientY) {
  const now = Date.now();
  if (now - lastTrail < 35) return;
  lastTrail = now;

  const heart = document.createElement('div');
  heart.classList.add('trail-heart');
  heart.innerText = '💖';
  const size = 12 + Math.random() * 14;
  heart.style.fontSize = `${size}px`;
  heart.style.left = `${clientX}px`;
  heart.style.top = `${clientY}px`;
  heart.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 40 - 20}deg)`;

  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 800);
}

function showZoom(src) {
  let overlay = document.querySelector('.photo-zoom-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'photo-zoom-overlay';
    overlay.innerHTML = `
      <div class="photo-zoom-content">
        <button class="close-zoom" type="button">×</button>
        <img src="" alt="Foto ampliada" />
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay || event.target.classList.contains('close-zoom')) {
        overlay.classList.remove('visible');
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        overlay.classList.remove('visible');
      }
    });
  }

  const image = overlay.querySelector('img');
  image.src = src;
  overlay.classList.add('visible');
}

function createPhoto() {
  const layer = document.getElementById('photoLayer');
  if (!layer) return;

  const card = document.createElement('div');
  card.className = 'photo-card';
  const img = document.createElement('img');
  img.src = photoUrls[Math.floor(Math.random() * photoUrls.length)];
  img.alt = 'Foto';
  card.appendChild(img);

  card.addEventListener('click', (event) => {
    event.stopPropagation();
    showZoom(img.src);
  });

  const x = Math.random() * 80 + 10;
  const size = Math.random() * 32 + 110;
  const duration = 9 + Math.random() * 4;

  card.style.left = `${x}vw`;
  card.style.width = `${size}px`;
  card.style.height = `${size}px`;
  card.style.animationDuration = `${duration}s`;

  layer.appendChild(card);
  setTimeout(() => card.remove(), 14500);
}

function handleMouseMove(event) {
  const x = (event.clientX / width - 0.5) * 18;
  const y = (event.clientY / height - 0.5) * 16;
  container.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;

  const background = document.querySelector('.background');
  if (background) {
    background.style.transform = `translate3d(${x * 0.4}px, ${y * 0.4}px, 0)`;
  }

  if (centerText) {
    centerText.style.transform = `translate(-50%, -50%) rotateY(${x / 2}deg) rotateX(${y / 2}deg)`;
  }

  createTrailHeart(event.clientX, event.clientY);
}

window.addEventListener('resize', () => {
  resize();
  resetStars();
});
window.addEventListener('mousemove', handleMouseMove);

resize();
resetStars();
animateStars();
setInterval(createText, 300);
setInterval(createHeart, 500);
setInterval(createPhoto, 4200);
createPhoto();
createPhoto();
createPhoto();
