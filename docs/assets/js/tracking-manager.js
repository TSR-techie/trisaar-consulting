/**
 * ==========================================================
 * Tracking Manager
 * TriSaar Consulting
 *
 * Responsible for enabling all tracking providers.
 * ==========================================================
 */

const providers = [
            TriSaar.Providers.GoogleAnalytics,
            TriSaar.Providers.MicrosoftClarity
        ];

const TrackingManager = (() => {

    let analyticsEnabled = false;

    /**
     * Enable analytics providers.
     * Runs only once.
     */
    function enableAnalytics() {

        if (analyticsEnabled) {
            return;
        }

        analyticsEnabled = true;

        console.log("Initializing analytics...");

        // Initialize each provider
        providers.forEach(provider => {

            if (provider && typeof provider.load === "function") {
                provider.load();
            }

        });

        console.log("Analytics initialized.");
    }

    /**
     * Returns current state.
     */
    function isAnalyticsEnabled() {
        return analyticsEnabled;
    }

    return {
        enableAnalytics,
        isAnalyticsEnabled
    };

})();

window.TriSaar = window.TriSaar || {};
//window.TriSaar.TrackingManager = TrackingManager;

TriSaar.Tracking.Manager = TrackingManager;