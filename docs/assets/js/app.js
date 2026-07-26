/**
 * ==========================================================
 * TriSaar Application Bootstrap
 * ==========================================================
 */

const App = (() => {

    async function initialize() {

        try {

            console.log("Starting TriSaar...");

            // Load HTML components first
            await TriSaar.Components.load();

            // Initialize Cookie Consent
            TriSaar.Consent.Manager.initialize();

            const resetButton = document.getElementById("reset-cookie-consent");

            if (resetButton) {
                resetButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    TriSaar.Consent.Manager.reset();
                });
            }

            // Future modules
            // TriSaar.Navigation.initialize();
            // TriSaar.Animations.initialize();
            // TriSaar.Dashboard.initialize();

            console.log("TriSaar ready.");

        }
        catch (error) {

            console.error(
                "Application failed to initialize.",
                error
            );

        }

    }

    return {
        initialize
    };

})();

window.TriSaar = window.TriSaar || {};
window.TriSaar.App = App;

document.addEventListener("DOMContentLoaded", () => {
    TriSaar.App.initialize();
});