/**
 * ==========================================================
 * Components Loader
 * TriSaar Consulting
 * ==========================================================
 */

async function loadComponent(id, file) {

    const element = document.getElementById(id);

    if (!element) {
        console.warn(`Component placeholder '${id}' not found.`);
        return;
    }

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load ${file} (${response.status})`);
        }

        element.innerHTML = await response.text();

    } catch (error) {

        console.error(error);

    }

}

const Components = (() => {

    async function load() {

        await loadComponent("navbar", "./partials/navbar.html");
        await loadComponent("footer", "./partials/footer.html");
        await loadComponent("consent-banner", "./partials/consent-banner.html");

    }

    return {
        load
    };

})();

window.TriSaar.Components = Components;