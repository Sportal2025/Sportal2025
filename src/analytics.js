export const GA_MEASUREMENT_ID = 'G-W4D09W38JJ';

export function initAnalytics() {
    if (window.location.hostname === 'localhost') {
        // console.log('Analytics: Running on localhost, tracking disabled/mocked.');
        return;
    }

    // Load the Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);

    // Expose gtag globally for other scripts to use
    window.gtag = gtag;

    // console.log('Analytics: Initialized with ID', GA_MEASUREMENT_ID);
}

export function trackEvent(eventName, params = {}) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
    } else {
        // console.log(`Analytics (Mock): Event '${eventName}'`, params);
    }
}

// Auto-init via main check or manual call
// We'll export init and call it from the main entry point or inline module
