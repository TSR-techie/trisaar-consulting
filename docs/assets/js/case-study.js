import { renderCaseStudy } from "./renderer.js";
import { createElement } from "./utils.js";
import { icon } from "./icons.js";

function initBackToTop() {
    const hero = document.querySelector(".cs-hero");

    if (!hero) return;

    const existing = document.querySelector(".cs-back-to-top");
    if (existing) existing.remove();

    const button = createElement("button", {
        className: "cs-back-to-top",
        attributes: {
            type: "button",
            "aria-label": "Back to top",
            title: "Back to top",
            "aria-hidden": "true"
        }
    });

    button.append(
        icon("chevron-up", "cs-back-to-top-icon"),
        createElement("span", {
            className: "cs-back-to-top-caption",
            attributes: { "aria-hidden": "true" },
            text: "Back to top"
        })
    );

    button.tabIndex = -1;

    button.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.body.append(button);

    const observer = new IntersectionObserver(
        ([entry]) => {
            const pastHero = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;

            button.classList.toggle("is-visible", pastHero);
            button.setAttribute("aria-hidden", pastHero ? "false" : "true");
            button.tabIndex = pastHero ? 0 : -1;
        },
        { threshold: 0 }
    );

    observer.observe(hero);
}

async function bootCaseStudy() {
    await renderCaseStudy();
    initBackToTop();
}

bootCaseStudy();
