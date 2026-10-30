/* ===== LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);
});

/* ===== CURSOR ===== */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animateFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top = fy + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .project-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
});

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ===== HERO TYPEWRITER ===== */
const roles = ['Full Stack Developer', 'UI/UX Designer', 'Creative Technologist', 'Problem Solver', 'Open Source Contributor'];
let ri = 0, ci = 0, deleting = false;
const roleEl = document.getElementById('roleText');

function typeRole() {
  const current = roles[ri];
  if (!deleting) {
    roleEl.textContent = current.slice(0, ++ci);
    if (ci === current.length) { deleting = true; setTimeout(typeRole, 1800); return; }
  } else {
    roleEl.textContent = current.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typeRole, deleting ? 60 : 100);
}
setTimeout(typeRole, 2200);

/* ===== THREE.JS HERO CANVAS ===== */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  // Particles
  const count = 2000;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    const t = Math.random();
    colors[i * 3] = t < 0.5 ? 0.49 : 0.02;
    colors[i * 3 + 1] = t < 0.5 ? 0.23 : 0.71;
    colors[i * 3 + 2] = t < 0.5 ? 0.93 : 0.84;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.8 });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Wireframe sphere
  const sphereGeo = new THREE.IcosahedronGeometry(1.5, 2);
  const sphereMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.08 });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphere);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0003;
    sphere.rotation.y += 0.003;
    sphere.rotation.x += 0.001;
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    renderer.render(scene, camera);
  }
  animate();
})();

/* ===== ABOUT 3D CARD TILT ===== */
const aboutCard = document.getElementById('aboutCard');
if (aboutCard) {
  aboutCard.addEventListener('mousemove', e => {
    const rect = aboutCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    aboutCard.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg)`;
  });
  aboutCard.addEventListener('mouseleave', () => {
    aboutCard.style.transform = 'rotateY(0) rotateX(0)';
  });
}

/* ===== SKILL BARS ANIMATION ===== */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('animated'));
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

/* ===== PROJECTS RENDER ===== */
function sanitize(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function renderProjects(filter = 'all') {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '';
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card' + (p.featured ? ' featured' : '');
    card.style.setProperty('--thumb-color', p.color);

    const thumb = document.createElement('div');
    thumb.className = 'project-thumb';
    thumb.style.setProperty('--thumb-color', p.color);
    thumb.innerHTML = `<span>${sanitize(p.image)}</span><span class="project-year">${sanitize(p.year)}</span>`;

    const tagsHtml = p.tags.map(t => `<span class="project-tag">${sanitize(t)}</span>`).join('');
    const body = document.createElement('div');
    body.className = 'project-body';
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'project-tags';
    tagsDiv.innerHTML = tagsHtml;
    const title = document.createElement('h3');
    title.textContent = p.title;
    const desc = document.createElement('p');
    desc.textContent = p.description;
    body.appendChild(tagsDiv);
    body.appendChild(title);
    body.appendChild(desc);

    const footer = document.createElement('div');
    footer.className = 'project-footer';
    footer.innerHTML = `<span>Click to explore</span><div class="project-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>`;

    card.appendChild(thumb);
    card.appendChild(body);
    card.appendChild(footer);
    card.addEventListener('click', () => openModal(p));
    grid.appendChild(card);
  });
}

renderProjects();

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

/* ===== PROJECT MODAL ===== */
function openModal(p) {
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  content.innerHTML = '';

  const thumbDiv = document.createElement('div');
  thumbDiv.className = 'modal-thumb';
  thumbDiv.style.background = `linear-gradient(135deg, ${p.color}22, ${p.color}44)`;
  const thumbSpan = document.createElement('span');
  thumbSpan.textContent = p.image;
  thumbDiv.appendChild(thumbSpan);

  const h2 = document.createElement('h2');
  h2.textContent = p.title;

  const tagsDiv = document.createElement('div');
  tagsDiv.className = 'modal-tags';
  p.tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'project-tag';
    span.textContent = t;
    tagsDiv.appendChild(span);
  });

  const descP = document.createElement('p');
  descP.textContent = p.longDesc;

  const btnsDiv = document.createElement('div');
  btnsDiv.className = 'modal-btns';
  const liveA = document.createElement('a');
  liveA.href = p.liveUrl;
  liveA.target = '_blank';
  liveA.rel = 'noopener noreferrer';
  liveA.className = 'btn btn-primary';
  liveA.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Live Demo';
  const ghA = document.createElement('a');
  ghA.href = p.githubUrl;
  ghA.target = '_blank';
  ghA.rel = 'noopener noreferrer';
  ghA.className = 'btn btn-outline';
  ghA.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg> Source Code';
  btnsDiv.appendChild(liveA);
  btnsDiv.appendChild(ghA);

  content.appendChild(thumbDiv);
  content.appendChild(h2);
  content.appendChild(tagsDiv);
  content.appendChild(descP);
  content.appendChild(btnsDiv);

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== SCROLL ANIMATIONS ===== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-card, .testimonial-card, .contact-card, .skill-category').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

/* ===== CONTACT FORM ===== */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  success.classList.add('show');
  e.target.reset();
  setTimeout(() => success.classList.remove('show'), 4000);
});

/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
themeToggle.addEventListener('click', () => {
  body.classList.toggle('light');
  localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light');
}

/* ===== STATS COUNTER ===== */
const counters = document.querySelectorAll('.counter');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else el.textContent = Math.floor(current);
      }, 16);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => statsObserver.observe(c));

/* ===== SCROLL ANIMATIONS FOR NEW SECTIONS ===== */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .tech-item, .blog-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});
