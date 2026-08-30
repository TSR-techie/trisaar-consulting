import { ComponentRegistry } from "./component-registry.js";
import { createElement } from "./utils.js";
import { applyCaseStudySeo } from "./seo.js";

function getCaseStudyId() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    return id && /^[a-zA-Z0-9_-]+$/.test(id) ? id : "sara-0001";
}

function resolveNeighbors(caseId, cases = []) {
    const index = cases.indexOf(caseId);

    if (index === -1) {
        return { prevId: null, nextId: null };
    }

    return {
        prevId: index > 0 ? cases[index - 1] : null,
        nextId: index < cases.length - 1 ? cases[index + 1] : null
    };
}

async function loadSaraIndex() {
    try {
        const response = await fetch("./docs/assets/data/sara-index.json");

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return Array.isArray(data.cases) ? data.cases : [];
    } catch (error) {
        console.warn("Unable to load sara-index.json", error);
        return [];
    }
}

function takeCaseHeading(root) {
    return root.querySelector("#case-study-heading")
        || root.querySelector("h1.cs-hero-title")
        || root.querySelector("h1");
}

function clearRootKeepHeading(root) {
    const heading = takeCaseHeading(root);

    Array.from(root.childNodes).forEach((child) => {
        if (child !== heading) child.remove();
    });

    return heading;
}

function renderError(root, message) {
    const heading = takeCaseHeading(root);
    clearRootKeepHeading(root);

    const error = createElement("section", {
        className: "case-study-error"
    });

    const container = createElement("div", {
        className: "case-study-container"
    });

    const title = heading || createElement("h1", {
        className: "case-study-error-title",
        attributes: { id: "case-study-heading" }
    });
    title.className = "case-study-error-title";
    title.id = "case-study-heading";
    title.textContent = "Case study not found";

    container.append(
        title,
        createElement("p", {
            className: "case-study-error-body",
            text: message
        }),
        createElement("a", {
            className: "btn btn-primary",
            text: "Back to home",
            attributes: { href: "index.html" }
        })
    );

    error.append(container);
    root.append(error);
}

export async function renderCaseStudy() {
    const root = document.getElementById("case-study-root");

    if (!root) {
        console.error("Missing #case-study-root");
        return;
    }

    const id = getCaseStudyId();

    try {
        const [caseResponse, cases] = await Promise.all([
            fetch(`./docs/assets/data/${id}.json`),
            loadSaraIndex()
        ]);

        if (!caseResponse.ok) {
            throw new Error(`Unable to load case study "${id}" (${caseResponse.status}).`);
        }

        const page = await caseResponse.json();
        const { prevId, nextId } = resolveNeighbors(id, cases);

        applyCaseStudySeo(page, id);

        clearRootKeepHeading(root);

        const context = { caseId: id, prevId, nextId };

        for (const section of page.sections || []) {
            if (section.visible === false) continue;

            const component = ComponentRegistry[section.component];

            if (!component) {
                console.warn(`Unknown component: ${section.component}`);
                continue;
            }

            const element = component.render(section, context);

            if (element instanceof Node) {
                root.appendChild(element);
            }
        }
    } catch (error) {
        console.error(error);
        renderError(
            root,
            error.message || `Unable to load case study "${id}".`
        );
    }
}
