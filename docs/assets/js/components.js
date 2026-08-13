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

function initNavbar() {
    const root = document.getElementById("navbar");
    const header = root?.querySelector(".navbar");
    const toggle = header?.querySelector(".nav-toggle");
    const panel = header?.querySelector(".nav-panel");

    if (!header || !toggle || !panel) return;

    const setOpen = (open) => {
        header.classList.toggle("is-open", open);
        document.body.classList.toggle("nav-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    const close = () => setOpen(false);
    const toggleMenu = () => setOpen(!header.classList.contains("is-open"));

    toggle.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleMenu();
    });

    panel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", close);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") close();
    });

    document.addEventListener("click", (event) => {
        if (!header.classList.contains("is-open")) return;
        if (!header.contains(event.target)) close();
    });

    window.addEventListener("resize", () => {
        if (window.matchMedia("(min-width: 721px)").matches) {
            close();
        }
    });
}

const Components = (() => {

    async function load() {

        await loadComponent("navbar", "./partials/navbar.html");
        await loadComponent("footer", "./partials/footer.html");
        await loadComponent("consent-banner", "./partials/consent-banner.html");

        initNavbar();

    }

    return {
        load
    };

})();

window.TriSaar = window.TriSaar || {};
window.TriSaar.Components = Components;
