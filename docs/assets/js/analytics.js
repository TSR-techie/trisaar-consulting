/**
 * ==========================================================
 * Google Analytics Provider
 * TriSaar Consulting
 *
 * Responsible only for loading Google Analytics.
 * ==========================================================
 */

const GoogleAnalytics = (() => {

    let loaded = false;

    // Replace with your Measurement ID
    const MEASUREMENT_ID = window.TriSaar.Config.googleAnalyticsId;

    function load() {

        if (loaded) {
            return;
        }

        loaded = true;

        // Load gtag.js
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;

        document.head.appendChild(script);

        // Initialize dataLayer
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        window.gtag = gtag;

        gtag("js", new Date());

        gtag("config", MEASUREMENT_ID, {
            anonymize_ip: true,
            send_page_view: true
        });

        console.log("Google Analytics loaded.");
    }

    function isLoaded() {
        return loaded;
    }

    return {
        load,
        isLoaded
    };

})();

window.TriSaar = window.TriSaar || {};
//window.TriSaar.GoogleAnalytics = GoogleAnalytics; 

TriSaar.Providers.GoogleAnalytics = GoogleAnalytics;