import { ComponentRegistry } from "./component-registry.js";
import { createElement } from "./utils.js";

function getCaseStudyId() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    return id && /^[a-zA-Z0-9_-]+$/.test(id) ? id : "sara-0001";
}

function renderError(root, message) {
    root.innerHTML = "";

    const error = createElement("section", {
        className: "case-study-error"
    });

    const container = createElement("div", {
        className: "case-study-container"
    });

    container.append(
        createElement("h1", {
            className: "case-study-error-title",
            text: "Case study not found"
        }),
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

function renderPublicationDivider(meta = {}) {
    const hasMeta = meta.edition || meta.version || meta.published || meta.readTime;

    if (!hasMeta) return null;

    const wrap = createElement("div", {
        className: "cs-publication"
    });

    const container = createElement("div", {
        className: "case-study-container"
    });

    const rule = createElement("div", {
        className: "cs-publication-rule"
    });

    const badge = createElement("div", {
        className: "cs-publication-badge"
    });

    badge.append(
        createElement("span", {
            className: "cs-publication-icon",
            html: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>`
        }),
        createElement("span", {
            className: "cs-publication-badge-text",
            text: meta.publicationLabel || "Sāra Publication"
        })
    );

    rule.append(
        createElement("span", { className: "cs-publication-node" }),
        createElement("span", { className: "cs-publication-line" }),
        badge,
        createElement("span", { className: "cs-publication-line" }),
        createElement("span", { className: "cs-publication-node" })
    );

    container.append(rule);

    const details = [
        meta.edition,
        meta.version ? `Version ${meta.version}` : null,
        meta.published,
        meta.readTime
    ].filter(Boolean);

    if (details.length) {
        const metaRow = createElement("p", {
            className: "cs-publication-meta"
        });

        details.forEach((detail, index) => {
            if (index > 0) {
                metaRow.append(createElement("span", {
                    className: "cs-publication-sep",
                    text: "|"
                }));
            }

            metaRow.append(createElement("span", {
                className: "cs-publication-meta-item",
                text: detail
            }));
        });

        container.append(metaRow);
    }

    wrap.append(container);
    return wrap;
}

export async function renderCaseStudy() {
    const root = document.getElementById("case-study-root");

    if (!root) {
        console.error("Missing #case-study-root");
        return;
    }

    const id = getCaseStudyId();

    try {
        const response = await fetch(`./docs/assets/data/${id}.json`);

        if (!response.ok) {
            throw new Error(`Unable to load case study "${id}" (${response.status}).`);
        }

        const page = await response.json();

        if (page.meta?.title) {
            document.title = page.meta.title;
        }

        root.innerHTML = "";

        let publicationInserted = false;

        for (const section of page.sections || []) {
            if (section.visible === false) continue;

            const component = ComponentRegistry[section.component];

            if (!component) {
                console.warn(`Unknown component: ${section.component}`);
                continue;
            }

            const element = component.render(section);

            if (element instanceof Node) {
                root.appendChild(element);
            }

            if (!publicationInserted && section.component === "hero") {
                const divider = renderPublicationDivider(page.meta || {});

                if (divider) {
                    root.appendChild(divider);
                }

                publicationInserted = true;
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
