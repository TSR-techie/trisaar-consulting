/**
 * ==========================================================
 * Consent Storage
 * TriSaar Consulting
 *
 * Responsible only for reading and writing
 * cookie consent from localStorage.
 * ==========================================================
 */

const ConsentStorage = (() => {

    const STORAGE_KEY = "trisaar_cookie_consent";

    /**
     * Load consent object from localStorage.
     * @returns {Object|null}
     */
    function load() {
        try {
            const value = localStorage.getItem(STORAGE_KEY);

            if (!value) {
                return null;
            }

            return JSON.parse(value);

        } catch (error) {
            console.error("Failed to load cookie consent.", error);
            return null;
        }
    }

    /**
     * Save consent object.
     * @param {Object} consent
     */
    function save(consent) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(consent)
            );
        } catch (error) {
            console.error("Failed to save cookie consent.", error);
        }
    }

    /**
     * Remove stored consent.
     */
    function clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error("Failed to clear cookie consent.", error);
        }
    }

    /**
     * Returns true if user has already made a choice.
     */
    function hasChoice() {
        return load() !== null;
    }

    return {
        load,
        save,
        clear,
        hasChoice
    };

})();

window.TriSaar = window.TriSaar || {};
//window.TriSaar.ConsentStorage = ConsentStorage;

TriSaar.Storage.Consent = ConsentStorage;