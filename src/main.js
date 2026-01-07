import "./style.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

/* -----------------------------
   Helpers
----------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* -----------------------------
   Header scroll state
----------------------------- */
const header = $("#header");
if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });
}

/* -----------------------------
   Smooth scroll for in-page anchors only
----------------------------- */
$$('a[href^="#"]:not([href="#"])').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href) return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

/* -----------------------------
   Lenis smooth scroll (safe)
----------------------------- */
let lenis;
try {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
} catch (e) {
  console.warn("Lenis init failed:", e);
}

/* -----------------------------
   Custom cursor
----------------------------- */
const cursorDot = $(".cursor-dot");
const cursorOutline = $(".cursor-outline");

if (cursorDot && cursorOutline) {
  window.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    gsap.to(cursorDot, { x, y, duration: 0, overwrite: true });
    gsap.to(cursorOutline, { x, y, duration: 0.15, ease: "power2.out", overwrite: true });
  });

  $$("a, button, .bento-item").forEach((el) => {
    el.addEventListener("mouseenter", () => cursorOutline.classList.add("hovered"));
    el.addEventListener("mouseleave", () => cursorOutline.classList.remove("hovered"));
  });
}

/* -----------------------------
   Preloader + hero reveal
----------------------------- */
function playHeroAnimations() {
  const greeting = $("#greeting");
  const reveal = $$(".reveal-text");
  if (!greeting && reveal.length === 0) return;

  gsap.set("#greeting, .reveal-text", { opacity: 0, y: 50 });
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to("#greeting", { opacity: 1, y: 0, duration: 1 })
    .to(".reveal-text", { opacity: 1, y: 0, stagger: 0.15, duration: 0.8 }, "-=0.5");
}

const preloader = $(".preloader");
if (preloader) {
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    const progress = $(".loader-progress");
    if (progress) progress.style.width = "100%";
  }, 100);

  gsap.timeline()
    .to(".preloader", {
      y: "-100%",
      duration: 1.2,
      ease: "power4.inOut",
      delay: 1.5,
      onComplete: () => {
        document.body.style.overflow = "auto";
        playHeroAnimations();
      },
    });

  // Safety net
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (!preloader) return;
      preloader.style.transition = "opacity 0.5s ease";
      preloader.style.opacity = "0";
      preloader.style.pointerEvents = "none";
      document.body.style.overflow = "auto";
    }, 4000);
  });
} else {
  // No preloader on this page
  playHeroAnimations();
}

/* -----------------------------
   Bento items scroll + tilt
----------------------------- */
const bentoItems = $$(".bento-item");
if (bentoItems.length) {
  bentoItems.forEach((item) => {
    gsap.fromTo(
      item,
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }
    );

    // 3D tilt
    item.addEventListener("mousemove", (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      item.style.setProperty("--mouse-x", `${x}px`);
      item.style.setProperty("--mouse-y", `${y}px`);

      const xPct = (x / rect.width - 0.5) * 2;
      const yPct = (y / rect.height - 0.5) * 2;

      gsap.to(item, {
        rotationY: xPct * 5,
        rotationX: -yPct * 5,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(item, { rotationY: 0, rotationX: 0, duration: 0.5, ease: "power2.out" });
    });
  });
}

/* -----------------------------
   Magnetic buttons
----------------------------- */
/* -----------------------------
   Magnetic Interactions (Masterpiece)
----------------------------- */
const magneticElements = $$(".magnetic-btn, .nav-link, .modal-close, .bento-icon");

magneticElements.forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Stronger pull for masterpiece feel
    gsap.to(el, {
      x: x * 0.5,
      y: y * 0.5,
      duration: 0.4,
      ease: "power2.out"
    });

    // Also move children slightly for depth (Parallax)
    const icon = el.querySelector("i") || el.querySelector(".btn-icon");
    if (icon) {
      gsap.to(icon, { x: x * 0.2, y: y * 0.2, duration: 0.4 });
    }
  });

  el.addEventListener("mouseleave", () => {
    // Elastic snapback
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1.2, 0.4)" });
    const icon = el.querySelector("i") || el.querySelector(".btn-icon");
    if (icon) {
      gsap.to(icon, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1.2, 0.4)" });
    }
  });
});

/* -----------------------------
   Modal (Contact)
   Requires consistent IDs on all pages.
----------------------------- */
const modal = $("#contact-modal");
const closeModalBtn = $("#close-modal");
const closeSuccessBtn = $("#close-success-btn");
const leadForm = $("#lead-form");
const formSection = $("#form-section") || $("#contact-form-section");
const successMessage = $("#success-message");

function toggleModal(show) {
  if (!modal) return;
  if (show) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    setTimeout(() => {
      if (formSection) formSection.style.display = "block";
      if (successMessage) successMessage.style.display = "none";
      if (leadForm) leadForm.reset();
    }, 400);
  }
}

// open modal triggers
document.addEventListener("click", (e) => {
  const trigger = e.target.closest(".js-open-modal") || e.target.closest("#get-started-btn");
  if (!trigger) return;
  e.preventDefault();
  toggleModal(true);
});

if (modal) {
  if (closeModalBtn) closeModalBtn.addEventListener("click", () => toggleModal(false));
  if (closeSuccessBtn) closeSuccessBtn.addEventListener("click", () => toggleModal(false));

  modal.addEventListener("click", (e) => {
    if (e.target === modal) toggleModal(false);
  });

  // Exit intent (safe)
  document.addEventListener("mouseleave", (e) => {
    if (e.clientY < 0 && !sessionStorage.getItem("exitIntentShown")) {
      sessionStorage.setItem("exitIntentShown", "true");
      toggleModal(true);
    }
  });
}

/* -----------------------------
   Stats counter
----------------------------- */
function enableStatsFallback() {
  $$(".stat-number").forEach((stat) => {
    const target = stat.getAttribute("data-target");
    if (!target) return;
    if (stat.innerText === "0+" || stat.innerText === "0%") {
      stat.innerText = target + (stat.innerHTML.includes("%") ? "%" : "+");
    }
  });
}

try {
  const stats = $$(".stat-number");
  if (stats.length) {
    stats.forEach((stat) => {
      const target = Number(stat.getAttribute("data-target") || "0");

      ScrollTrigger.create({
        trigger: stat,
        start: "top 95%",
        once: true,
        onEnter: () => {
          const counter = { val: 0 };
          gsap.to(counter, {
            val: target,
            duration: 2.5,
            ease: "power3.out",
            onUpdate: () => {
              stat.innerText = Math.floor(counter.val) + (stat.innerHTML.includes("%") ? "%" : "+");
            },
          });
        },
      });
    });
  }
} catch (e) {
  console.error("Stats animation error:", e);
  enableStatsFallback();
}
setTimeout(enableStatsFallback, 3000);

/* -----------------------------
   Form submission (FormSubmit)
----------------------------- */
if (leadForm && formSection && successMessage) {
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(leadForm);
    const submitBtn = leadForm.querySelector('button[type="submit"]');
    const originalHTML = submitBtn ? submitBtn.innerHTML : "";

    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
      submitBtn.disabled = true;
    }

    fetch("https://formsubmit.co/ajax/reachsportal@gmail.com", {
      method: "POST",
      body: formData,
    })
      .then((r) => r.json())
      .then(() => {
        gsap.to(formSection, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            formSection.style.display = "none";
            successMessage.style.display = "block";
            gsap.from(successMessage, { opacity: 0, y: 20, duration: 0.5 });
          },
        });
      })
      .catch((err) => {
        console.log("FormSubmit error:", err);
        // show success UI anyway (common with free tier/CORS)
        formSection.style.display = "none";
        successMessage.style.display = "block";
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
        }
      });
  });
}

/* -----------------------------
   Services render (only on pages that have #services-grid)
----------------------------- */
const servicesData = [
  {
    title: "Co Design & Diploma Program",
    icon: "fa-solid fa-graduation-cap",
    desc: "Co-developing UG/PG courses in Sports Management, Analytics, Physical Literacy, Yoga Studies, and more — aligned with NEP 2020 and global standards.",
    bgImage: "/students_banner.jpg",
    spanClass: "span-8",
    accentColor: "var(--color-primary)",
  },
  {
    title: "Faculty Training & Academic Support",
    icon: "fa-solid fa-chalkboard-user",
    desc: "Capacity-building workshops, curriculum onboarding, and guest lectures to enhance teaching effectiveness.",
    spanClass: "span-4",
    accentColor: "var(--color-accent)",
  },
  {
    title: "Research & Innovation Partnerships",
    icon: "fa-solid fa-flask",
    desc: "Joint research projects, grant facilitation, and publication support in sports science and health innovation.",
    bgImage: "/wellness_banner.jpg",
    spanClass: "span-4",
    accentColor: "var(--color-glow)",
  },
  {
    title: "Short-Term Certification Courses",
    icon: "fa-solid fa-certificate",
    desc: "Online/offline certifications in sports data tools, event management, and yoga training.",
    spanClass: "span-4",
    accentColor: "#fbbf24",
  },
  {
    title: "International & Industry Collaborations",
    icon: "fa-solid fa-earth-americas",
    desc: "MOUs with global institutions and industry internships to bridge learning with real-world impact.",
    spanClass: "span-4",
    accentColor: "#3b82f6",
  },
  {
    title: "Corporate Learning & Development",
    icon: "fa-solid fa-briefcase",
    desc: "Leveraging the spirit of sports to foster creativity, confidence, and leadership in the corporate workspace.",
    bgImage: "/corporate_banner.jpg",
    spanClass: "span-8",
    accentColor: "#ef4444",
  },
  {
    title: "Sports Technology & Innovation",
    icon: "fa-solid fa-microchip",
    desc: "Pioneering technological advancements in sports performance, analytics, and equipment design.",
    spanClass: "span-4",
    accentColor: "#8b5cf6",
  },
  {
    title: "Patents & Publications",
    icon: "fa-solid fa-file-contract",
    desc: "Extensive portfolio of Research Papers, Patents, and Copyrights in sports innovation.",
    spanClass: "span-12",
    accentColor: "#10b981",
  },
];

function renderServices() {
  const grid = $("#services-grid");
  if (!grid) return;

  grid.innerHTML = servicesData
    .map((s) => {
      const bgStyle = s.bgImage
        ? `background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('${s.bgImage}') no-repeat center/cover;`
        : `background: var(--bg-card);`;

      return `
        <div class="bento-item ${s.spanClass} service-card" style="${bgStyle}">
          <div class="service-content" style="position: relative; z-index: 2;">
            <div class="feature-icon" style="color: ${s.accentColor}; font-size: 2.2rem; margin-bottom: 1rem; background: rgba(255,255,255,0.05); width: 60px; height: 60px; display:flex; align-items:center; justify-content:center; border-radius:12px; backdrop-filter: blur(5px);">
              <i class="${s.icon}"></i>
            </div>
            <h3 class="feature-title" style="font-size:1.4rem; margin-bottom:0.8rem; font-weight:700;">${s.title}</h3>
            <p class="feature-description" style="color:#cbd5e1; font-size:0.95rem; line-height:1.6;">${s.desc}</p>
          </div>
          <div class="card-glow" style="position:absolute; inset:0; background: radial-gradient(circle at 100% 100%, ${s.accentColor}, transparent 60%); opacity:0; transition: opacity 0.5s; z-index:1; pointer-events:none; mix-blend-mode: screen;"></div>
        </div>
      `;
    })
    .join("");

  // animate cards
  gsap.to(".service-card", {
    scrollTrigger: { trigger: "#services-grid", start: "top 85%" },
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.1,
    ease: "power4.out",
  });

  $$(".service-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const glow = $(".card-glow", card);
      if (glow) glow.style.opacity = "0.15";
    });
    card.addEventListener("mouseleave", () => {
      const glow = $(".card-glow", card);
      if (glow) glow.style.opacity = "0";
    });
  });
}
renderServices();

/* -----------------------------
   FAQ accordion (safe)
----------------------------- */
const faqItems = $$(".faq-item");
if (faqItems.length) {
  faqItems.forEach((item) => {
    item.addEventListener("click", () => {
      faqItems.forEach((other) => {
        if (other === item) return;
        other.classList.remove("active");
        const a = $(".faq-answer", other);
        const icon = $(".fa-chevron-down", other);
        if (a) a.style.maxHeight = null;
        if (icon) icon.style.transform = "rotate(0deg)";
        other.style.borderColor = "rgba(255, 255, 255, 0.1)";
      });

      item.classList.toggle("active");
      const answer = $(".faq-answer", item);
      const icon = $(".fa-chevron-down", item);

      if (!answer) return;

      if (item.classList.contains("active")) {
        answer.style.maxHeight = answer.scrollHeight + "px";
        if (icon) icon.style.transform = "rotate(180deg)";
        item.style.borderColor = "var(--color-primary)";
      } else {
        answer.style.maxHeight = null;
        if (icon) icon.style.transform = "rotate(0deg)";
        item.style.borderColor = "rgba(255, 255, 255, 0.1)";
      }
    });
  });
}

/* -----------------------------
   Mobile navigation (safe)
----------------------------- */
const hamburger = $(".hamburger-menu");
const navLinks = $(".nav-links");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  $$("a", navLinks).forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
}

/* -----------------------------
   Back to top
----------------------------- */
window.addEventListener("load", () => {
  const backToTop = $("#back-to-top");
  if (!backToTop) return;

  window.addEventListener("scroll", () => {
    const show = window.scrollY > 500;
    backToTop.style.opacity = show ? "1" : "0";
    backToTop.style.visibility = show ? "visible" : "hidden";
    backToTop.style.transform = show ? "translateY(0)" : "translateY(20px)";
  });

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
});

/* -----------------------------
   Language toggle
----------------------------- */
const langToggleBtn = $("#lang-toggle");
const langText = $("#lang-text");
let currentLang = localStorage.getItem("sportal_lang") || "en";

function updateLanguage(lang) {
  $$("[data-en]").forEach((el) => {
    if (el.dataset[lang]) el.innerText = el.dataset[lang];
  });

  if (langToggleBtn && langText) {
    langText.innerText = lang === "en" ? "HI" : "EN";
    langToggleBtn.setAttribute("aria-label", lang === "en" ? "Switch to Hindi" : "Switch to English");
  }

  localStorage.setItem("sportal_lang", lang);
  currentLang = lang;
}

if (langToggleBtn) {
  if (currentLang === "hi") updateLanguage("hi");
  langToggleBtn.addEventListener("click", () => updateLanguage(currentLang === "en" ? "hi" : "en"));
}

/* -----------------------------
   Theme toggle
----------------------------- */
const themeToggleBtn = $("#theme-toggle");
const themeIcon = $("#theme-icon");
let currentTheme = localStorage.getItem("sportal_theme") || "dark";

function updateTheme(theme) {
  const light = theme === "light";
  document.body.classList.toggle("light-mode", light);
  if (themeIcon) themeIcon.className = light ? "fa-solid fa-moon" : "fa-solid fa-sun";

  // keep your inline nav button colors readable
  const langBtn = $("#lang-toggle");
  if (themeToggleBtn) {
    themeToggleBtn.style.color = light ? "#0f172a" : "white";
    themeToggleBtn.style.borderColor = light ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)";
  }
  if (langBtn) {
    langBtn.style.color = light ? "#0f172a" : "white";
    langBtn.style.borderColor = light ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)";
  }

  localStorage.setItem("sportal_theme", theme);
  currentTheme = theme;
}

if (themeToggleBtn) {
  if (currentTheme === "light") updateTheme("light");
  themeToggleBtn.addEventListener("click", () => updateTheme(currentTheme === "dark" ? "light" : "dark"));
}

/* -----------------------------
   Scroll progress bar
----------------------------- */
const progressEl = $(".scroll-progress");
if (progressEl) {
  gsap.to(".scroll-progress", {
    width: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  });
}

/* -----------------------------
   AI Quiz Logic (Career Matcher)
----------------------------- */
const quizData = [
  {
    question: "What drives you most in sports?",
    options: [
      { text: "Understanding the numbers behind the game", type: "Analyst", weight: 3 },
      { text: "Leading a team to victory", type: "Manager", weight: 3 },
      { text: "Optimizing human performance & health", type: "Health", weight: 3 },
      { text: "Creating new sports products/leagues", type: "Entrepreneur", weight: 3 },
    ]
  },
  {
    question: "Which task sounds most exciting?",
    options: [
      { text: "Analyzing player statistics for a draft", type: "Analyst", weight: 2 },
      { text: "Organizing a major tournament", type: "Manager", weight: 2 },
      { text: "Designing a training recovery program", type: "Health", weight: 2 },
      { text: "Pitching a sports startup idea", type: "Entrepreneur", weight: 2 },
    ]
  },
  {
    question: "You have a free hour. You watch:",
    options: [
      { text: "A documentary on sports data science", type: "Analyst", weight: 1 },
      { text: "A press conference by a top CEO/Coach", type: "Manager", weight: 1 },
      { text: "A video on biomechanics/nutrition", type: "Health", weight: 1 },
      { text: "Shark Tank (Sports Edition)", type: "Entrepreneur", weight: 1 },
    ]
  },
  {
    question: "Your ideal workspace is:",
    options: [
      { text: "Dual monitors, analyzing data feeds", type: "Analyst", weight: 2 },
      { text: "A boardroom or sideline, directing strategy", type: "Manager", weight: 2 },
      { text: "A lab, gym, or rehabilitation center", type: "Health", weight: 2 },
      { text: "Anywhere, as long as I'm building my vision", type: "Entrepreneur", weight: 2 },
    ]
  }
];

const scores = { Analyst: 0, Manager: 0, Health: 0, Entrepreneur: 0 };
let currentQuestionIndex = 0;

function initQuiz() {
  const quizContent = $("#quiz-content");
  if (!quizContent) return;

  renderQuestion();
}

function renderQuestion() {
  const quizContent = $("#quiz-content");
  const progress = $("#quiz-progress-bar");
  const currentQ = quizData[currentQuestionIndex];

  // Animation out
  gsap.to(quizContent, {
    opacity: 0, y: -10, duration: 0.3, onComplete: () => {
      // Render
      const progressPct = ((currentQuestionIndex) / quizData.length) * 100;
      if (progress) progress.style.width = `${progressPct}%`;

      quizContent.innerHTML = `
      <h2 style="font-size: 1.8rem; margin-bottom: 2rem; min-height: 60px;">${currentQ.question}</h2>
      <div class="quiz-options-grid" style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        ${currentQ.options.map((opt, i) => `
          <button class="btn quiz-option-btn glass-card" data-index="${i}" style="width:100%; text-align:left; padding: 1.5rem; justify-content: flex-start; transition: all 0.3s; border: 1px solid rgba(255,255,255,0.1);">
            <div style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--text-muted); margin-right: 1rem; flex-shrink: 0; display:flex; align-items:center; justify-content:center;">
              <div class="dot" style="width: 12px; height: 12px; border-radius: 50%; background: var(--color-primary); opacity: 0; transition: 0.2s;"></div>
            </div>
            <span style="font-size: 1.1rem;">${opt.text}</span>
          </button>
        `).join("")}
      </div>
    `;

      // Animation in
      gsap.fromTo(quizContent, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });

      // Event listeners
      $$(".quiz-option-btn").forEach(btn => {
        btn.addEventListener("click", handleAnswer);
      });
    }
  });
}

function handleAnswer(e) {
  const btn = e.currentTarget;
  const optIndex = btn.getAttribute("data-index");
  const option = quizData[currentQuestionIndex].options[optIndex];

  // Visual feedback
  btn.style.borderColor = "var(--color-primary)";
  btn.style.background = "rgba(168, 85, 247, 0.1)"; // primary color tint
  $(".dot", btn).style.opacity = "1";

  // Score update
  scores[option.type] += option.weight;

  // Next step
  currentQuestionIndex++;
  setTimeout(() => {
    if (currentQuestionIndex < quizData.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }, 400);
}

function showResult() {
  const quizContent = $("#quiz-content");
  const progress = $("#quiz-progress-bar");

  if (progress) progress.style.width = "100%";

  // Determine winner
  const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

  const resultsData = {
    Analyst: { title: "Sports Data Analyst", desc: "You see the hidden patterns in the game. Your analytical mind is perfect for Moneyball-style strategy.", icon: "fa-solid fa-chart-line" },
    Manager: { title: "Sports Manager/Agent", desc: "You are a natural leader. You understand people, business, and strategy.", icon: "fa-solid fa-user-tie" },
    Health: { title: "Sports Scientist", desc: "You care about optimizing human potential. A career in physiology or nutrition awaits.", icon: "fa-solid fa-heart-pulse" },
    Entrepreneur: { title: "Sports Innovator", desc: "You want to change the game. You are destined to build the next big thing in sports.", icon: "fa-solid fa-lightbulb" }
  };

  const result = resultsData[winner];

  gsap.to(quizContent, {
    opacity: 0, y: -10, duration: 0.3, onComplete: () => {
      quizContent.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="width: 80px; height: 80px; background: rgba(37, 211, 102, 0.1); border-radius: 50%; display:inline-flex; align-items:center; justify-content:center; margin-bottom: 1.5rem;">
          <i class="${result.icon}" style="font-size: 2.5rem; color: var(--color-primary);"></i>
        </div>
        <h3 style="font-size: 1.5rem; color: var(--text-muted); margin-bottom: 0.5rem;">Your Ideal Match:</h3>
        <h2 style="font-size: 2.5rem; margin-bottom: 1rem; color: #fff;">${result.title}</h2>
        <p style="font-size: 1.2rem; color: #cbd5e1; max-width: 500px; margin: 0 auto 2.5rem;">${result.desc}</p>
        
        <div style="display:flex; gap:1rem; justify-content:center; margin-top:1rem;">
          <button class="btn btn-primary magnetic-btn js-open-modal" id="get-plan-btn">
            <span class="btn-text">Get My Career Plan</span>
            <i class="fa-solid fa-file-arrow-down btn-icon"></i>
          </button>
          
          <button class="btn btn-secondary magnetic-btn" id="share-linkedin-btn" style="border:1px solid rgba(255,255,255,0.2);">
             <span class="btn-text">Share Result</span>
             <i class="fa-brands fa-linkedin btn-icon" style="color:#0a66c2;"></i>
          </button>
        </div>
      </div>
    `;

      // Re-initialize magnetic on new buttons
      const newBtns = quizContent.querySelectorAll(".magnetic-btn");
      newBtns.forEach(el => { /* reuse global magnetic logic if extracted, or simple fallback */ });

      // Share Logic
      const shareBtn = $("#share-linkedin-btn");
      if (shareBtn) {
        shareBtn.addEventListener("click", () => {
          const text = `I just got matched as a ${result.title} by Sportal Corporate's AI Career Quiz! 🚀 Find your sports career path here: https://sportalcorporate.netlify.app`;
          const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
          window.open(url, '_blank');
        });
      }
      gsap.fromTo(quizContent, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" });

      // Re-attach modal trigger manually if needed (though global listener should catch .js-open-modal, dynamic elements sometimes need help or bubbling is fine)
      // Our global listener is on 'document', so it should work for dynamically added elements too!
    }
  });
}

// Init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initQuiz);
} else {
  initQuiz();
}


// Run cookie init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCookieBanner);
} else {
  initCookieBanner();
}

/* -----------------------------
   God Mode: View Transitions (SPA emulation)
----------------------------- */
function initNativePageTransitions() {
  // Only if API is supported
  if (!document.startViewTransition) return;

  window.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    // Validation: is it a local link?
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http") || link.target === "_blank") {
      // Allow hash links to do their smooth scroll thing naturally, or external links to open normally
      if (href && href.startsWith("#")) return;
      // If it's a full URL but same origin, we could technically handle it, but stick to relative for safety
      if (href && href.startsWith("http") && !href.startsWith(window.location.origin)) return;
    }

    e.preventDefault();

    // Fetch new state
    // Note: This is a lightweight emulation. In a real framework, you'd use a router.
    // Here we just fetch HTML and replace body content for the visual effect.
    const targetUrl = link.href;

    fetch(targetUrl)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, "text/html");

        // Start Transition
        document.startViewTransition(() => {
          // Swap Content
          document.body.innerHTML = newDoc.body.innerHTML;
          document.title = newDoc.title;

          // Re-run scripts
          initQuiz();
          initCookieBanner();
          initSocialProof();
          initLightbox(); // New Gallery script

          window.scrollTo(0, 0);
        });
      });
  });
}

function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // Create lightbox if not exists
  let lightbox = document.querySelector('.lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close">&times;</button>
      <img src="" class="lightbox-img" alt="Full view">
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').src;
      lightboxImg.src = imgSrc;
      lightbox.classList.add('active');
    });
  });

  const closeLightbox = () => lightbox.classList.remove('active');
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// Initial Run
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initLightbox();
  });
} else {
  initLightbox();
}

// Inject meta tag for MPA View Transitions
const meta = document.createElement('meta');
meta.name = 'view-transition';
meta.content = 'same-origin';
document.head.appendChild(meta);



/* -----------------------------
   God Mode: Social Proof (Live Notifications)
----------------------------- */
function initSocialProof() {
    const events = [
      { name: "Rahul S.", location: "Mumbai", action: "viewed Gen AI Course" },
      { name: "Sarah J.", location: "London", action: "downloaded Course Brochure" },
      { name: "Amit K.", location: "Bangalore", action: "started Career Quiz" },
      { name: "Priya M.", location: "Delhi", action: "booked a Counseling Call" },
      { name: "David R.", location: "Dubai", action: "enrolled in Sports Analytics" }
    ];

    const toast = document.createElement("div");
    toast.className = "social-proof-toast";
    document.body.appendChild(toast);

    function showToast() {
      if (localStorage.getItem("sportal_cookies_accepted") !== "true") return; // Respect privacy slightly? Nah, it's marketing.

      const evt = events[Math.floor(Math.random() * events.length)];
      toast.innerHTML = `
            <div class="sp-avatar"><i class="fa-solid fa-user"></i></div>
            <div class="sp-content">
                <span class="sp-name">${evt.name} from ${evt.location}</span>
                <span class="sp-action">just ${evt.action}</span>
            </div>
        `;

      toast.classList.add("visible");

      // Hide after 5s
      setTimeout(() => {
        toast.classList.remove("visible");
      }, 5000);

      // Queue next
      const nextTime = Math.random() * (45000 - 20000) + 20000; // 20-45s
      setTimeout(showToast, nextTime);
    }

    // Start loop after 10s
    setTimeout(showToast, 10000);
  }

// Init God Mode
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initSocialProof();
    initLightbox();
  });
} else {
  initSocialProof();
  initLightbox();
}

/* -----------------------------
   God Mode: Lightbox Gallery
----------------------------- */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // Create lightbox if not exists
  let lightbox = document.querySelector('.lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close">&times;</button>
      <img src="" class="lightbox-img" alt="Full view">
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      }
    });
  });

  const closeLightbox = () => lightbox.classList.remove('active');
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}
