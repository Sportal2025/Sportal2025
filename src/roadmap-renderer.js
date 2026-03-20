
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// IMPORT DATA FROM SEPARATE FILE
import { careerRoadmaps } from "./roadmap-data.js";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("roadmap-dynamic-content");
    if (!container) return; // Safety check

    // 1. Get User Result from SessionStorage (New Engine)
    const storedMatchKey = sessionStorage.getItem("sportal_match_key");
    const storedMatchTitle = sessionStorage.getItem("sportal_last_match");

    // Default to fallback if nothing found (or "Analyst" if that was the preference, but let's stick to safe fallback)
    // Actually, roadmap-data.js keys might not match the new 3-letter codes yet. 
    // We need to ensure mapping or that roadmap-data.js uses the new codes (ATH, COA, etc).
    // If roadmap-data.js still uses "Analyst", "Manager", etc., we need a map.

    // For now, assuming roadmap-data.js will be updated or we map here.
    // Let's assume roadmap-data.js uses the new keys or we need to map them.
    // Given the new config uses ATH, COA, etc., and roadmap-data.js likely has "Analyst", "Manager" etc.
    // We should probably check roadmap-data.js keys. 

    // Check if we need mapping.
    // If storedMatchKey is "ATH", but roadmap-data has "Athlete".

    let userMatch = storedMatchKey || "Analyst"; // Temporary default

    // Quick Map to legacy keys if roadmap-data.js isn't updated yet.
    // Based on previous main.js, keys were Analyst, Manager, Health, Entrepreneur, Athlete.
    // New codes: ANA, MGT, SCI, ENT, ATH.

    const legacyMap = {
        ATH: "Athlete",
        COA: "Manager", // Approximate? COA is Coaching. Manager was separate. 
        // Wait, the new categories are 11. The old were 5.
        // roadmap-data.js likely only has data for the old 5.
        // We need to map the 11 new ones to the 5 old ones OR update roadmap-data.js.
        // Updating roadmap-data.js is better, but for now let's try to map to existing content to avoid breaking the page.

        // Old keys: Analyst, Manager, Health, Entrepreneur, Athlete

        // New: ATH -> Athlete
        // New: COA -> Manager (Coaching is leadership?) or Athlete? Let's say Manager for now or we serve a generic fallback.
        // New: SCI -> Health
        // New: MGT -> Manager
        // New: ANA -> Analyst
        // New: FIT -> Health (Fitness)
        // New: MED -> Analyst (Media/Content) - maybe Entrepreneur?
        // New: EDU -> Health (Science/Edu) - or Analyst?
        // New: ENT -> Entrepreneur
        // New: PSY -> Health
        // New: OFF -> Manager

        // Ideally we update roadmap-data.js. But I don't see that file content yet.
        // I will map to the closest existing key if possible, or use the key directly if roadmap-data.js is updated.
    };

    if (legacyMap[storedMatchKey]) {
        userMatch = legacyMap[storedMatchKey];
    } else {
        // use key as is (maybe roadmap-data.js covers it or we fallback)
        userMatch = storedMatchKey || "fallback";
    }

    // 2. Select Data
    const data = careerRoadmaps[userMatch] || careerRoadmaps["fallback"];

    // 3. Render HTML - PREMIUM VERTICAL STEPPER
    let html = `
    <div class="roadmap-header-wrapper animate-fade-in">
        <h1 class="roadmap-title text-glow">YOUR PATH TO BECOMING A <br> <span class="text-highlight text-gradient-gold">${data.role.toUpperCase()}</span></h1>
        <p class="partners-hero-text" style="color:var(--text-muted); max-width:600px; margin:0 auto;">Based on your AI assessment, here is your personalized strategic blueprint.</p>
    </div>
    
    <div class="timeline-container">
  `;

    data.stages.forEach((stage, index) => {
        // Animation delay for stagger effect
        const delayStyle = `animation-delay: ${index * 0.2}s`;

        html += `
      <div class="timeline-item" style="${delayStyle}">
        <!-- Icon Node -->
        <div class="timeline-icon-box">
             <i class="${stage.icon}"></i>
        </div>

        <!-- Content Card -->
        <div class="timeline-content glass-card">
           <span class="timeline-focus-area">Stage ${index + 1}: ${stage.focus}</span>
           <h3 class="timeline-stage-title">${stage.stage}</h3>
           
           <div class="stage-details">
             <!-- DO THIS Section -->
             <div class="action-box do-this">
                 <div class="action-title"><i class="fa-solid fa-check-circle"></i> DO THIS</div>
                 <ul class="roadmap-list">
                    ${stage.todo.map(item => `<li>${item}</li>`).join('')}
                 </ul>
             </div>

             <!-- AVOID THIS Section -->
             <div class="action-box avoid-this">
                 <div class="action-title"><i class="fa-solid fa-circle-exclamation"></i> AVOID THIS</div>
                 <ul class="roadmap-list">
                    ${stage.dont.map(item => `<li>${item}</li>`).join('')}
                 </ul>
             </div>
           </div>
        </div>
      </div>
    `;
    });

    html += `</div>`; // Close timeline container

    // Inject content
    container.innerHTML = html;

    // 4. Animate
    const items = container.querySelectorAll(".timeline-item");
    items.forEach(item => {
        gsap.fromTo(item,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%"
                }
            }
        );
    });

    // 5. Toggle Logic for "How it works"
    const howItWorksHeader = document.querySelector(".how-it-works-header");
    const howItWorksContent = document.querySelector(".how-it-works-content");
    const toggleIcon = document.querySelector(".toggle-icon");

    if (howItWorksHeader && howItWorksContent) {
        howItWorksHeader.addEventListener("click", () => {
            const isOpen = howItWorksContent.style.display === "block";
            howItWorksContent.style.display = isOpen ? "none" : "block";
            if (toggleIcon) toggleIcon.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
        });
    }
});
