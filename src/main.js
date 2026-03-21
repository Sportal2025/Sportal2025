import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";
import Lenis from "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/+esm";

gsap.registerPlugin(ScrollTrigger);

/* -----------------------------
   Helpers
----------------------------- */
import { supabase } from "./config/supabase.js";

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
   Form submission & Filters (Supabase)
   Wait for DOM components to be ready
----------------------------- */
import { initFormSubmit } from "./components/form_backend.js";
import { initBrochureModal } from "./components/brochure.js";

document.addEventListener("DOMContentLoaded", () => {
  initFormSubmit();
  initFilters();
  initBrochureModal();
});

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
   Using new Engine from quizEngine.js
----------------------------- */
import { QUIZ_CONFIG, CAREER_CATEGORIES } from "./quizConfig.js";
import { scoreQuiz, persistResult } from "./quizEngine.js";

// Quiz State
let currentQuestionIndex = 0;
let userAnswers = {}; // Store { q1: "A", q2: "B" }

function initQuiz() {
  const quizContent = $("#quiz-content");
  if (!quizContent) return;

  // TEASER STRATEGY: Start Quiz Immediately (skip intro form)
  // Ensure intro modal is closed if it exists (just in case default CSS shows it)
  const introModal = $("#intro-modal");
  if (introModal) introModal.classList.remove("active");

  startQuizSession();
}

function startQuizSession() {
  currentQuestionIndex = 0;
  userAnswers = {};
  renderQuestion();
}

function renderQuestion() {
  const quizContent = $("#quiz-content");
  const progress = $("#quiz-progress-fill"); // Updated ID to match HTML
  const currentQ = QUIZ_CONFIG.questions[currentQuestionIndex];

  // Animation out
  gsap.to(quizContent, {
    opacity: 0, y: -10, duration: 0.3, onComplete: () => {
      // Render
      const totalQs = QUIZ_CONFIG.questions.length;
      const progressPct = ((currentQuestionIndex) / totalQs) * 100;
      if (progress) progress.style.width = `${progressPct}%`;

      quizContent.innerHTML = `
      <div class="animate-fade-in" style="max-width: 800px; margin: 0 auto;">
          <h2 class="text-glow" style="font-size: 2rem; margin-bottom: 2.5rem; min-height: 60px; text-align:center; font-weight: 700;">${currentQ.prompt}</h2>
          
          <div class="quiz-options-grid" style="display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
            ${currentQ.options.map((opt) => `
              <button class="btn quiz-option-btn glass-card glass-card-hover" data-qid="${currentQ.id}" data-oid="${opt.id}" 
                style="width:100%; text-align:left; padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: flex-start; transition: all 0.3s; border-radius: 16px;">
                
                <div style="width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--text-muted); margin-right: 1.25rem; flex-shrink: 0; display:flex; align-items:center; justify-content:center; transition: all 0.3s;" class="option-check-circle">
                  <div class="dot" style="width: 14px; height: 14px; border-radius: 50%; background: var(--color-primary); opacity: 0; transform: scale(0); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
                </div>
                
                <span style="font-size: 1.15rem; font-weight: 500; letter-spacing: 0.3px; color: rgba(255, 255, 255, 0.95);">${opt.text}</span>
              </button>
            `).join("")}
          </div>
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
  const qId = btn.getAttribute("data-qid");
  const oId = btn.getAttribute("data-oid");

  // Visual feedback
  const circle = btn.querySelector(".option-check-circle");

  btn.style.borderColor = "var(--color-primary)";
  btn.style.boxShadow = "0 0 20px rgba(255, 183, 0, 0.2)";
  btn.style.background = "rgba(255, 183, 0, 0.1)"; // gold tint
  btn.style.transform = "scale(1.02)";

  if (circle) circle.style.borderColor = "var(--color-primary)";

  const dot = $(".dot", btn);
  if (dot) {
    dot.style.opacity = "1";
    dot.style.transform = "scale(1)";
  }

  // Store Answer
  userAnswers[qId] = oId;

  // Next step
  currentQuestionIndex++;
  setTimeout(() => {
    if (currentQuestionIndex < QUIZ_CONFIG.questions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }, 400);
}

function showResult() {
  const quizContent = $("#quiz-content");
  const progress = $("#quiz-progress-fill");

  if (progress) progress.style.width = "100%";

  // 1. Score Quiz
  const resultObj = scoreQuiz(userAnswers);
  persistResult(resultObj); // Saves to sessionStorage

  // 2. Prepare Display Data
  const primaryKey = resultObj.primary.key;
  const secondaryKey = resultObj.secondary ? resultObj.secondary.key : null;

  // Calculate confidence % relative to max possible score (approximate or just standard max)
  // Or just use the score relative to the total accumulated score for distribution visualization
  // For the UI, let's use the score itself or normalize it if needed.
  // The old logic calculated a percentage. Let's replicate a simple percentage for display logic.
  const totalScore = Object.values(resultObj.scores).reduce((a, b) => a + b, 0);
  const safeTotal = totalScore > 0 ? totalScore : 1;
  const primaryConfidence = Math.round((resultObj.primary.score / safeTotal) * 100) || 0;
  const secondaryConfidence = secondaryKey ? (Math.round((resultObj.secondary.score / safeTotal) * 100) || 0) : 0;

  // Confidence Bands
  function getConfidenceLabel(percent) {
    if (percent >= 25) return "Very High Alignment";
    if (percent >= 15) return "High Alignment";
    if (percent >= 10) return "Moderate Alignment";
    return "Exploratory";
  }

  const primaryLabel = getConfidenceLabel(primaryConfidence);
  const secondaryLabel = getConfidenceLabel(secondaryConfidence);

  // 3. Athlete Warning Rule
  let showTransitionWarning = false;
  if (primaryKey === "ATH" && primaryConfidence < 40) { // Keep threshold logic, maybe adjust if scoring scale changed
    showTransitionWarning = true;
  }

  // Content Data (Merged with titles from config mostly, but icons need defining)
  // We can use CAREER_CATEGORIES titles, but need icons.
  const categoryIcons = {
    ATH: "fa-solid fa-medal",
    COA: "fa-solid fa-whistle",
    SCI: "fa-solid fa-heart-pulse",
    MGT: "fa-solid fa-user-tie",
    ANA: "fa-solid fa-chart-line",
    FIT: "fa-solid fa-dumbbell",
    MED: "fa-solid fa-microphone",
    EDU: "fa-solid fa-graduation-cap",
    ENT: "fa-solid fa-rocket",
    PSY: "fa-solid fa-brain",
    OFF: "fa-solid fa-scale-balanced"
  };

  const primaryTitle = CAREER_CATEGORIES[primaryKey]?.title || resultObj.primary.title;
  const secondaryTitle = secondaryKey ? (CAREER_CATEGORIES[secondaryKey]?.title || resultObj.secondary.title) : "";

  const primaryIcon = categoryIcons[primaryKey] || "fa-solid fa-star";

  gsap.to(quizContent, {
    opacity: 0, y: -10, duration: 0.3, onComplete: () => {
      quizContent.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        
        <!-- Primary Result -->
        <div style="width: 80px; height: 80px; background: rgba(37, 211, 102, 0.1); border-radius: 50%; display:inline-flex; align-items:center; justify-content:center; margin-bottom: 1rem; border:1px solid var(--color-primary);">
          <i class="${primaryIcon}" style="font-size: 2.5rem; color: var(--color-primary);"></i>
        </div>
        <h3 style="font-size: 1.2rem; color: var(--text-muted); margin-bottom: 0.2rem;">Primary Match (${primaryConfidence}%)</h3>
        <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem; color: #fff;">${primaryTitle}</h2>
        <div style="display:inline-block; padding: 0.3rem 0.8rem; background: rgba(255,255,255,0.1); border-radius: 20px; font-size: 0.9rem; margin-bottom: 1.5rem; color: var(--color-accent); border: 1px solid rgba(255,255,255,0.2);">
            ${primaryLabel}
        </div>
        
        <!-- Secondary Result -->
        ${secondaryKey ? `
        <div style="margin-bottom: 2rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px; max-width: 500px; margin-left: auto; margin-right: auto;">
            <p style="margin:0; font-size: 0.95rem; color: var(--text-muted);">
                <strong>Secondary Match:</strong> ${secondaryTitle} (${secondaryConfidence}% - ${secondaryLabel})
            </p>
        </div>` : ''}

        ${showTransitionWarning ? `
        <div style="margin-bottom: 2rem; padding: 1rem; background: rgba(255, 150, 0, 0.1); border-left: 3px solid orange; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto;">
            <p style="margin:0; font-size: 0.9rem; color: #ffcc00;">
                <i class="fa-solid fa-triangle-exclamation"></i> <strong>Note:</strong> Athlete careers are performance-dependent. This roadmap includes parallel pathways to ensure stability.
            </p>
        </div>` : ''}
        
        <div style="display:flex; gap:1rem; justify-content:center; margin-top:1rem; flex-wrap: wrap;">
          <button class="btn btn-primary magnetic-btn" id="get-plan-btn">
            <span class="btn-text">Get My Career Plan</span>
            <i class="fa-solid fa-arrow-right btn-icon"></i>
          </button>
          
          <button class="btn btn-secondary magnetic-btn" id="save-badge-btn" style="border:1px solid rgba(255,255,255,0.2);">
             <span class="btn-text">Save Badge</span>
             <i class="fa-solid fa-download btn-icon"></i>
          </button>

          <button class="btn btn-secondary magnetic-btn" id="share-linkedin-btn" style="border:1px solid rgba(255,255,255,0.2);">
             <span class="btn-text">Share Result</span>
             <i class="fa-brands fa-linkedin btn-icon" style="color:#0a66c2;"></i>
          </button>
        </div>
        
        <div style="margin-top: 2rem;">
            <button id="retake-quiz-btn" style="background: transparent; border: none; color: var(--text-muted); font-size: 0.9rem; text-decoration: underline; cursor: pointer; transition: color 0.3s;" onmouseover="this.style.color='var(--color-primary)'" onmouseout="this.style.color='var(--text-muted)'">
                <i class="fa-solid fa-rotate-left"></i> Retake Quiz
            </button>
        </div>
      </div>
    `;

      // Re-initialize magnetic on new buttons
      const newBtns = quizContent.querySelectorAll(".magnetic-btn");
      newBtns.forEach(el => {
        // Simple magnetic fallback provided by CSS or if we want JS we'd need to extract the function
      });

      // Get Plan (Redirect to Roadmap)
      // Get Plan (Open Lead Modal - Teaser Strategy)
      const getPlanBtn = $("#get-plan-btn");
      if (getPlanBtn) {
        getPlanBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const modal = $("#contact-modal");

          // Pre-fill hidden fields 
          const hiddenMatch = $("#career-match-hidden");
          const hiddenScores = $("#scores-hidden"); // if we want to send full object

          if (hiddenMatch) hiddenMatch.value = primaryKey;
          if (hiddenScores) hiddenScores.value = JSON.stringify(resultObj);

          // Update modal title for context
          const modalTitle = $(".section-title", modal);
          if (modalTitle) modalTitle.innerHTML = `Unlock Your <span style="color:var(--color-primary)">${primaryTitle}</span> Roadmap`;

          if (modal) {
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
          }
        });
      }

      // Badge Logic
      const saveBadgeBtn = $("#save-badge-btn");
      if (saveBadgeBtn) {
        saveBadgeBtn.addEventListener("click", () => {
          const badge = $("#hidden-square-badge");
          if (!badge) return;

          // Update badge text
          const badgeTitle = $(".badge-title", badge);
          if (badgeTitle) badgeTitle.innerText = primaryTitle;

          // Personalize Name
          const userName = localStorage.getItem("sportal_user_name");
          const existingSub = $(".badge-sub", badge);
          if (userName && existingSub) {
            existingSub.innerText = `Awarded to ${userName}`;
            existingSub.style.color = "#fbbf24";
            existingSub.style.fontWeight = "600";
          }

          const originalText = saveBadgeBtn.innerHTML;
          saveBadgeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

          // 1. Ensure library exists
          if (typeof html2canvas === 'undefined') {
            alert("Error: html2canvas library not found. Please add the script tag.");
            saveBadgeBtn.innerHTML = originalText;
            return;
          }

          // 2. Capture
          window.html2canvas(badge, {
            scale: 2, // Retinas resolution
            backgroundColor: "#020617", // Force background color
            useCORS: true // Allow loading cross-origin images
          }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Sportal-Career-${primaryTitle.replace(/\s+/g, '-')}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            saveBadgeBtn.innerHTML = originalText;
          }).catch(err => {
            console.error("Badge generation failed:", err);
            saveBadgeBtn.innerHTML = "Try Again";
          });
        });
      }

      // Share Logic
      const shareBtn = $("#share-linkedin-btn");
      if (shareBtn) {
        shareBtn.addEventListener("click", () => {
          const text = `I just got matched as a ${primaryTitle} by Sportal Corporate's AI Career Quiz! 🚀 Find your sports career path here: https://www.sportalcorporate.org`;
          const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
          window.open(url, '_blank');
        });
      }

      // 4. Retake Quiz Logic
      const retakeBtn = $("#retake-quiz-btn");
      if (retakeBtn) {
        retakeBtn.addEventListener("click", () => {
          startQuizSession();
        });
      }

      gsap.fromTo(quizContent, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" });
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



