
import { $ } from '../utils/dom.js';
import { supabase } from '../config/supabase.js';

/**
 * Handles form submissions for #lead-form using Supabase.
 * Replaces formsubmit.co logic while keeping the UI consistent.
 */
export function initFormSubmit() {
    // Target both main lead form and the brochure form
    const forms = [$("#lead-form")];
    const successMessage = $("#success-message");

    forms.forEach(leadForm => {
        if (leadForm && successMessage) {
            leadForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                // 1. Prepare Data
                const formData = new FormData(leadForm);


                // Match key for Quiz result tracking
                const matchKey = sessionStorage.getItem("sportal_match_key") || "general";
                const userName = formData.get("name");
                if (userName) sessionStorage.setItem("sportal_user_name", userName);

                // Extract standard fields
                // Fix: Pack extra data into 'message' since 'career_match' column might not exist yet
                const name = formData.get("name");
                const email = formData.get("email");
                const phone = formData.get("phone");
                const qualification = formData.get("qualification");
                const whatsapp = formData.get("whatsapp");
                const careerMatch = formData.get("career_match");
                const scoresJson = formData.get("scores_json");

                // Pack extra data into 'message' to avoid schema errors and missing columns
                const messageContent = `
Query from: ${window.location.href}
WhatsApp: ${whatsapp || 'N/A'}
Match: ${careerMatch || 'N/A'}
Scores: ${scoresJson || 'N/A'}
Qualification: ${qualification || 'N/A'}
`.trim();

                const leadData = {
                    name,
                    email,
                    phone,
                    course_interest: qualification || "General Inquiry",
                    // NOTE: 'whatsapp', 'career_match', 'scores_json' are EXCLUDED to prevent Supabase errors
                    message: messageContent
                };

                // 2. UI Updates (Disable Button)
                const submitBtn = leadForm.querySelector('button[type="submit"], input[type="submit"]');
                const originalBtnText = submitBtn ? submitBtn.innerHTML : "Submit";

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
                }

                // Clear previous errors
                const errorBox = document.querySelector("#leadFormError");
                if (errorBox) errorBox.style.display = "none";

                try {
                    // 3. Insert into Supabase
                    const { error } = await supabase
                        .from('leads')
                        .insert([leadData]);

                    if (error) throw error;

                    // 4. Success UI
                    leadForm.style.display = "none";
                    successMessage.style.display = "block";

                    // SPECIAL LOGIC: Quiz Teaser "Unlock" -> Auto Redirect
                    // If this submission was from the Quiz/Career Match flow
                    if (window.location.pathname.includes("quiz") || document.getElementById("contact-modal")) {

                        // Update UI to show redirection
                        const title = successMessage.querySelector("h2");
                        const icon = successMessage.querySelector(".fa-circle-check");
                        const desc = successMessage.querySelector("p");

                        if (title) title.innerText = "Access Granted!";
                        if (icon) {
                            icon.classList.remove("fa-circle-check");
                            icon.classList.add("fa-unlock-keyhole");
                        }
                        if (desc) desc.innerHTML = "Unlocking your personalized career roadmap...<br>Redirecting you now.";

                        // Hide close button
                        const closeBtn = document.getElementById("close-success-btn");
                        if (closeBtn) closeBtn.style.display = "none";

                        // Auto Redirect after 1.5s
                        setTimeout(() => {
                            window.location.href = "/roadmap.html";
                        }, 1500);
                    }

                } catch (err) {
                    console.error("Supabase Error:", err);
                    if (errorBox) {
                        errorBox.textContent = "Submission failed. Please try again.";
                        errorBox.style.display = "block";
                    } else {
                        alert("Submission failed. Please check your internet connection.");
                    }

                    // Allow retry
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }

                }
            });
        }
    });
}
