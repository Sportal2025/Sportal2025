
import { supabase } from "../config/supabase.js";
import { trackEvent } from "../analytics.js";
import { lockScroll, unlockScroll } from "../utils/scroll-lock.js";

// Config
const BROCHURE_URL = "/brochure.pdf";
const LEADS_TABLE = "leads"; // Using existing leads table

function openModal() {
    const modal = document.getElementById("brochure-modal");
    if (!modal) return;
    modal.classList.add("active");
    lockScroll();
}

function closeModal() {
    const modal = document.getElementById("brochure-modal");
    if (!modal) return;
    modal.classList.remove("active");
    unlockScroll();
}

function setStatus(msg, isError = false) {
    const el = document.getElementById("brochure-status");
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? "#ef4444" : "rgba(148,163,184,0.95)";
}

function sanitizePhone(phone) {
    return String(phone || "")
        .replace(/[^\d+]/g, "")
        .slice(0, 20);
}

export function initBrochureModal() {
    const modal = document.getElementById("brochure-modal");
    const openBtns = document.querySelectorAll(".js-open-brochure-modal");
    const closeBtn = document.getElementById("close-brochure-modal");
    const form = document.getElementById("brochure-form");

    if (!modal) return;

    // Open Buttons (IMPORTANT: remove inline onclick in HTML)
    openBtns.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        })
    );

    // Close Button
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    // Close on outside click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
    });

    // Form handler
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        setStatus("Submitting...");

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        // ✅ Open a blank tab immediately to avoid popup blockers
        // If the browser blocks popups, this will be null and we fallback later.
        const brochureTab = window.open("about:blank", "_blank");

        try {
            const name = form.querySelector("#b-name")?.value?.trim();
            const email = form.querySelector("#b-email")?.value?.trim();
            const phone = sanitizePhone(form.querySelector("#b-phone")?.value);
            const page = window.location.pathname;

            if (!name || !email || !phone) {
                throw new Error("Please fill all required fields.");
            }

            // ✅ Schema-safe payload (no source/page/created_at unless your table has them)
            const payload = {
                name,
                email,
                phone,
                course_interest: "Gen AI Brochure",
                message: `Brochure download request from ${page}`,
            };

            const { error } = await supabase.from(LEADS_TABLE).insert([payload]);
            if (error) throw error;

            // Non-blocking analytics
            try {
                trackEvent("brochure_download", { page });
            } catch (_) { }

            setStatus("Success! Opening brochure...");

            // Close modal + reset
            closeModal();
            form.reset();
            setStatus("");

            // ✅ Navigate the already-opened tab
            if (brochureTab && !brochureTab.closed) {
                brochureTab.location.href = BROCHURE_URL;
            } else {
                // Fallback if popup was blocked
                window.location.href = BROCHURE_URL;
            }
        } catch (err) {
            console.error("Brochure lead submit failed:", err);
            setStatus(err.message || "Something went wrong. Please try again.", true);

            // If we opened a blank tab and the submit failed, close that tab
            if (brochureTab && !brochureTab.closed) brochureTab.close();
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}
