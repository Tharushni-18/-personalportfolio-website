"use strict";


const cursor      = document.getElementById("cursor");
const cursorTrail = document.getElementById("cursorTrail");

let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX; my = e.clientY;
  cursorTrail.style.left = mx + "px";
  cursorTrail.style.top  = my + "px";
});

(function animCursor() {
  cx += (mx - cx) * 0.1;
  cy += (my - cy) * 0.1;
  cursor.style.left = cx + "px";
  cursor.style.top  = cy + "px";
  requestAnimationFrame(animCursor);
})();

/* Scale cursor on hover */
document.querySelectorAll("a, button, .sk-card, .project-card, .exp-card, .cert-item").forEach(el => {
  el.addEventListener("mouseenter", () => cursor.style.transform = "translate(-50%,-50%) scale(1.7)");
  el.addEventListener("mouseleave", () => cursor.style.transform = "translate(-50%,-50%) scale(1)");
});


const canvas = document.getElementById("particleCanvas");
const ctx    = canvas.getContext("2d");

let particles = [];
const PARTICLE_COUNT = 60;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function randomBetween(a, b) { return a + Math.random() * (b - a); }

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = randomBetween(0, canvas.width);
    this.y    = randomBetween(0, canvas.height);
    this.r    = randomBetween(0.8, 2.2);
    this.vx   = randomBetween(-0.18, 0.18);
    this.vy   = randomBetween(-0.22, -0.05);
    this.life = randomBetween(0.3, 1);
    this.col  = Math.random() < 0.5 ? "255,127,107" : "124,106,255";
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.0018;
    if (this.life <= 0 || this.y < -10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.col},${this.life * 0.7})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

(function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animParticles);
})();


const navbar  = document.getElementById("navbar");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  highlightNav();
});

function highlightNav() {
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
}


const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileNav.classList.toggle("open");
});

mobileNav.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileNav.classList.remove("open");
  });
});


const revealEls = document.querySelectorAll(".reveal");

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger children in same parent
      const siblings = [...entry.target.parentElement.querySelectorAll(".reveal:not(.visible)")];
      const delay    = siblings.indexOf(entry.target) * 90;
      setTimeout(() => entry.target.classList.add("visible"), delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObs.observe(el));


const roles = [
  "Web Developer",
  "Java Programmer",
  "Frontend Developer",
  "IT Student",
  "Problem Solver",
];
const typingEl = document.getElementById("typingText");
let rIdx = 0, cIdx = 0, isDeleting = false;

function typeEffect() {
  const word = roles[rIdx];
  typingEl.textContent = isDeleting
    ? word.substring(0, cIdx - 1)
    : word.substring(0, cIdx + 1);

  isDeleting ? cIdx-- : cIdx++;

  if (!isDeleting && cIdx === word.length) {
    isDeleting = true;
    setTimeout(typeEffect, 1700);
    return;
  }
  if (isDeleting && cIdx === 0) {
    isDeleting = false;
    rIdx = (rIdx + 1) % roles.length;
  }

  setTimeout(typeEffect, isDeleting ? 52 : 95);
}
typeEffect();


const statNums   = document.querySelectorAll(".qs-num");
let statsStarted = false;

function runCounters() {
  if (statsStarted) return;
  const heroRect = document.getElementById("home").getBoundingClientRect();
  if (heroRect.bottom > window.innerHeight * 0.3) {
    statsStarted = true;
    statNums.forEach(num => {
      const target = +num.getAttribute("data-target");
      let val = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const t = setInterval(() => {
        val = Math.min(val + step, target);
        num.textContent = val;
        if (val >= target) clearInterval(t);
      }, 40);
    });
  }
}
window.addEventListener("scroll", runCounters);
window.addEventListener("load",   runCounters);
setTimeout(runCounters, 800);


const skillFills = document.querySelectorAll(".skill-fill");
let   skillsDone = false;

const skillsObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !skillsDone) {
      skillsDone = true;
      skillFills.forEach(fill => {
        const w = fill.getAttribute("data-w");
        setTimeout(() => { fill.style.width = w + "%"; }, 200);
      });
    }
  });
}, { threshold: 0.2 });

const skillsSec = document.getElementById("skills");
if (skillsSec) skillsObs.observe(skillsSec);


document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});


function sendMessage(e) {
  e.preventDefault();

  const name    = document.getElementById("fname").value.trim();
  const email   = document.getElementById("femail").value.trim();
  const message = document.getElementById("fmsg").value.trim();
  const btn     = document.getElementById("sendBtn");
  const success = document.getElementById("successMsg");

  if (!name || !email || !message) { shakeElement(btn); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    shakeElement(btn);
    document.getElementById("femail").focus();
    return;
  }

  btn.textContent = "Sending…";
  btn.disabled    = true;

  setTimeout(() => {
    btn.style.display = "none";
    success.classList.add("show");
    ["fname","femail","fsubject","fmsg"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  }, 1800);
}

function shakeElement(el) {
  el.classList.remove("shake");
  void el.offsetWidth; // reflow
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 600);
}

// Inject shake keyframes
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX( 8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX( 5px); }
  }
  .shake { animation: shake 0.55s ease !important; }
`;
document.head.appendChild(shakeStyle);


const yearEl = document.getElementById("footerYear");
if (yearEl) yearEl.textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", function(e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


const staggerObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll(".cert-item, .exp-card, .cinfo-card");
      items.forEach((item, i) => {
        setTimeout(() => {
          item.style.opacity    = "1";
          item.style.transform  = "translateY(0)";
        }, i * 100);
      });
      staggerObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".cert-list, .exp-cards, .contact-info-col").forEach(el => {
  el.querySelectorAll(".cert-item, .exp-card, .cinfo-card").forEach(item => {
    item.style.opacity   = "0";
    item.style.transform = "translateY(20px)";
    item.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });
  staggerObs.observe(el);
});
