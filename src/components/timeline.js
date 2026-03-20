import { $, $$ } from '../utils/dom.js';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initTimeline() {
    gsap.registerPlugin(ScrollTrigger);

    const items = $$('.timeline-item');
    const line = $('.timeline-inner-line'); // Ensure you add this element in HTML if using dynamic line growth

    items.forEach((item, index) => {
        // Different animation direction based on left/right class is handled by CSS mostly,
        // but let's add a nice fade-up with GSAP

        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });
}
