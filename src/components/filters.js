import { $, $$ } from '../utils/dom.js';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initFilters() {
    const filterControls = $('.filter-controls');
    if (!filterControls) return; // Not on courses page

    const buttons = $$('.filter-btn');
    const items = $$('.bento-item[data-category]');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Filter items
            items.forEach(item => {
                const category = item.getAttribute('data-category');

                // Kill any conflicting animations (e.g. initial scroll trigger or previous filter)
                gsap.killTweensOf(item);

                if (filterValue === 'all' || category === filterValue) {
                    // Show
                    item.classList.remove('hidden');
                    // Reset to visible state immediately
                    gsap.set(item, { display: 'block' }); // Ensure display is correct

                    gsap.fromTo(item,
                        { opacity: 0, scale: 0.9 },
                        { opacity: 1, scale: 1, duration: 0.4, clearProps: "transform" } // Don't clear opacity
                    );
                } else {
                    // Hide
                    item.classList.add('hidden');
                }
            });

            // Refresh ScrollTrigger to account for layout shifts
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500);
        });
    });
}
