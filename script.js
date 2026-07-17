// Theme toggle
const themeBtn = document.querySelector('.theme-toggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dd-theme', next);
  });
}

// Scroll reveal
const revealTargets = [...document.querySelectorAll('.reveal-on-scroll')];
if (revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); } }),
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  revealTargets.forEach((target, index) => { target.style.transitionDelay = `${(index % 4) * 60}ms`; revealObserver.observe(target); });
}

// Lightweight particle background
(function initParticles() {
  const canvas = document.querySelector('.particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles;
  const COUNT = 46;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function makeParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    }));
  }

  function isLight() { return document.documentElement.getAttribute('data-theme') === 'light'; }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    const dotColor = isLight() ? 'rgba(37,99,235,0.35)' : 'rgba(139,181,255,0.55)';
    const lineColor = isLight() ? 'rgba(37,99,235,0.08)' : 'rgba(139,181,255,0.12)';
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i]; const b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  resize();
  makeParticles();
  window.addEventListener('resize', () => { resize(); makeParticles(); });
  if (!prefersReducedMotion) requestAnimationFrame(tick);
})();

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });
document.querySelectorAll('nav a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));
const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; });
const heroArt = document.querySelector('.hero-art');
heroArt.addEventListener('pointermove', (event) => { const box = heroArt.getBoundingClientRect(); heroArt.style.setProperty('--tilt-y', `${((event.clientX - box.left) / box.width - .5) * 8}deg`); heroArt.style.setProperty('--tilt-x', `${((event.clientY - box.top) / box.height - .5) * -8}deg`); });
heroArt.addEventListener('pointerleave', () => { heroArt.style.setProperty('--tilt-x', '0deg'); heroArt.style.setProperty('--tilt-y', '0deg'); });
const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('nav a:not(.contact-link)')];
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)); }), { rootMargin: '-45% 0px -45% 0px' });
sections.forEach((section) => observer.observe(section));

const projects = {
  scholarship: { title: 'AI-Powered Scholarship Finder', status: 'COMPLETED', summary: 'A student-centered scholarship discovery concept that reduces manual searching through AI-driven relevance filtering.', goal: 'Help students spend less time scanning long scholarship lists and more time finding opportunities that fit their profile.', build: 'A search-and-recommendation workflow that filters opportunities by relevance and surfaces the strongest matches first.', stack: ['Python', 'AI Filtering', 'Recommendation Logic'], link: 'https://github.com/deenathayalan-d4/scholarship-finder' },
  coach: { title: 'AI Coach', status: 'COMPLETED', summary: 'A sports performance system that converts athlete data into personalized training suggestions.', goal: 'Make performance data easier to act on for athletes who need focused, individual feedback.', build: 'A model-driven concept that analyzes athlete performance inputs and produces tailored training recommendations.', stack: ['Python', 'Machine Learning', 'Data Analysis'], link: 'https://github.com/deenathayalan-d4/AI-Coach-App' },
  leetcode: { title: 'LeetCode Tracker', status: 'COMPLETED', summary: 'A personal DSA practice companion designed to make consistent problem-solving visible and measurable.', goal: 'Replace unstructured coding practice with a clear record of progress, topics, and habits.', build: 'A tracker for logging, tagging, and visualizing solved problems over time.', stack: ['Python', 'Data Tracking', 'Visualization'], link: 'https://github.com/deenathayalan-d4/Leetcode-Tracker' },
  caloriegram: { title: 'CalorieGram', status: 'IN PROGRESS', summary: 'An AI food-recognition app that aims to estimate calorie content directly from a meal image.', goal: 'Make basic nutrition awareness more accessible with a simple camera-first experience.', build: 'An early AI application concept combining food recognition with calorie estimation.', stack: ['Python', 'Computer Vision', 'AI / ML'], link: null }
};
const modal = document.querySelector('.project-modal');
const fillModal = (id) => {
  const project = projects[id];
  if (!project) return;
  document.querySelector('#modal-title').textContent = project.title;
  document.querySelector('#modal-status').textContent = project.status;
  document.querySelector('#modal-summary').textContent = project.summary;
  document.querySelector('#modal-goal').textContent = project.goal;
  document.querySelector('#modal-build').textContent = project.build;
  document.querySelector('#modal-stack').innerHTML = project.stack.map((item) => `<span>${item}</span>`).join('');
  document.querySelector('#modal-contact').href = `mailto:d.deenathayalan5407@gmail.com?subject=${encodeURIComponent(project.title)}%20project`;
  const githubBtn = document.querySelector('#modal-github');
  if (project.link) {
    githubBtn.href = project.link;
    githubBtn.style.display = 'inline-block';
  } else {
    githubBtn.style.display = 'none';
  }
  modal.showModal();
};
document.querySelectorAll('.project-trigger').forEach((trigger) => { trigger.addEventListener('click', () => fillModal(trigger.dataset.project)); trigger.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fillModal(trigger.dataset.project); } }); });
document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
