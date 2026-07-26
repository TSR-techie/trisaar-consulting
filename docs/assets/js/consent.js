/**
 * ==========================================================
 * Cookie Consent Manager
 * TriSaar Consulting
 *
 * Responsibilities:
 * - Show banner
 * - Hide banner
 * - Read consent
 * - Save consent
 * - Notify Tracking Manager
 * ==========================================================
 */

const Consent = (() => {

    let banner;
    let acceptButton;
    let rejectButton;

    let initialized = false;

    /**
     * Initialize the consent system.
     */
    function initialize() {

        if (initialized) return;
            initialized = true;

        banner = document.getElementById("cookie-consent");

        console.log("Banner Content: " & banner);
        
        acceptButton = document.getElementById("cookie-accept");
        rejectButton = document.getElementById("cookie-reject");

        if (!banner) {
            console.warn("Cookie banner not found.");
            return;
        }

        acceptButton?.addEventListener("click", accept);
        rejectButton?.addEventListener("click", reject);

        const consent = TriSaar.Storage.Consent.load();

        // No previous choice
        if (!consent) {
            show();
            return;
        }

        // Previous choice accepted
        if (consent.analytics === true) {
            hide();
            TriSaar.Tracking.Manager.enableAnalytics();
            return;
        }

        // Previous choice rejected
        hide();
    }

    /**
     * User accepted analytics.
     */
    function accept() {

        TriSaar.Storage.Consent.save({
            version: 1,
            analytics: true,
            date: new Date().toISOString()
        });

        hide();

        TriSaar.Tracking.Manager.enableAnalytics();
    }

    /**
     * User rejected analytics.
     */
    function reject() {

        TriSaar.Storage.Consent.save({
            version: 1,
            analytics: false,
            date: new Date().toISOString()
        });

        hide();
    }

    /**
     * Show banner.
     */
    function show() {
        banner.classList.remove("hidden");
    }

    /**
     * Hide banner.
     */
    function hide() {
        banner.classList.add("hidden");
    }

    /**
     * Optional helper for future footer link.
     */
    function reset() {
        TriSaar.Storage.Consent.clear();
        window.location.reload();
    }

    return {
        initialize,
        show,
        hide,
        reset
    };

})();

window.TriSaar = window.TriSaar || {};
//window.TriSaar.Consent = Consent;

TriSaar.Consent.Manager = Consent;