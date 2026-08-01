import { createElement } from "../../js/utils.js";

const BRIEF_ICONS = {
    client: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    duration: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
    outcome: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>`,
    technology: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/></svg>`,
    dataset: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v4c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 10v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4"/></svg>`,
    confidentiality: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3l7 3v5c0 4.5-2.8 7.8-7 9-4.2-1.2-7-4.5-7-9V6l7-3z"/><path d="M9.5 12l1.8 1.8L15 10"/></svg>`,
    document: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>`,
    book: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 5a2 2 0 0 1 2-2h11v18H6a2 2 0 0 0-2 2V5z"/><path d="M6 3a2 2 0 0 0-2 2v14"/><path d="M9 7h6"/></svg>`,
    github: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 7.5c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.38-.01 2.49-.01 2.83 0 .26.18.59.69.48A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/></svg>`
};

function icon(name, className = "hero-icon") {
    return createElement("span", {
        className,
        html: BRIEF_ICONS[name] || BRIEF_ICONS.document
    });
}

function renderIdentity(identity) {
    const line = createElement("p", {
        className: "hero-identity"
    });

    const parts = String(identity).split(/([0-9\u0966-\u096F]+)/);

    parts.forEach((part) => {
        if (!part) return;

        const isNumeral = /^[0-9\u0966-\u096F]+$/.test(part);
        const isSeparator = !isNumeral && /^[\s·•.\-–—|/]+$/.test(part);

        line.append(createElement("span", {
            className: (isNumeral || isSeparator)
                ? "hero-identity-num"
                : "hero-identity-text",
            text: part
        }));
    });

    return line;
}

function renderActionLink(action) {
    const isExternal = /^https?:\/\//i.test(action.target || "");
    const attributes = { href: action.target || "#" };

    if (isExternal) {
        attributes.target = "_blank";
        attributes.rel = "noopener noreferrer";
    }

    const link = createElement("a", {
        className: `btn btn-${action.type || "primary"}`,
        attributes
    });

    if (action.icon && BRIEF_ICONS[action.icon]) {
        link.append(icon(action.icon, "btn-icon"));
    }

    link.append(document.createTextNode(action.label || ""));
    return link;
}

function renderBriefField(field) {
    const row = createElement("div", {
        className: "hero-brief-row"
    });

    const labelWrap = createElement("div", {
        className: "hero-brief-label"
    });

    if (field.icon) {
        labelWrap.append(icon(field.icon, "hero-brief-icon"));
    }

    labelWrap.append(createElement("span", {
        text: field.label
    }));

    row.append(labelWrap);

    const valueWrap = createElement("div", {
        className: "hero-brief-value"
    });

    if (Array.isArray(field.values) && field.values.length) {
        const list = createElement("ul", {
            className: "hero-brief-list"
        });

        field.values.forEach((item) => {
            list.append(createElement("li", { text: item }));
        });

        valueWrap.append(list);
    } else if (field.value) {
        valueWrap.append(createElement("span", {
            text: field.value
        }));
    }

    row.append(valueWrap);
    return row;
}

function renderBrief(brief) {
    const panel = createElement("aside", {
        className: "hero-brief"
    });

    const header = createElement("div", {
        className: "hero-brief-header"
    });

    header.append(
        icon("document", "hero-brief-header-icon"),
        createElement("span", {
            text: brief.title || "Case Brief"
        })
    );

    panel.append(header);

    const body = createElement("div", {
        className: "hero-brief-body"
    });

    (brief.fields || []).forEach((field) => {
        body.append(renderBriefField(field));
    });

    panel.append(body);
    return panel;
}

export default {

    render(section) {

        const data = section.data || {};
        const variant = section.variant || "immersive";

        const heroSection = createElement("section", {
            className: `hero hero--${variant} cs-animate`,
            id: section.id
        });

        const container = createElement("div", {
            className: "hero-container"
        });

        const grid = createElement("div", {
            className: "hero-grid"
        });

        const main = createElement("div", {
            className: "hero-main"
        });

        if (Array.isArray(data.taxonomy) && data.taxonomy.length) {
            main.append(createElement("span", {
                className: "hero-eyebrow",
                text: data.taxonomy.join(" • ")
            }));
        }

        if (data.identity) {
            main.append(renderIdentity(data.identity));
        }

        if (data.title) {
            main.append(createElement("h1", {
                className: "hero-title",
                text: data.title
            }));
        }

        if (data.subtitle) {
            main.append(createElement("p", {
                className: "hero-subtitle",
                text: data.subtitle
            }));
        }

        const actions = createElement("div", {
            className: "hero-actions"
        });

        (data.actions || []).forEach((action) => {
            actions.append(renderActionLink(action));
        });

        if (typeof data.repository === "string" && data.repository.trim()) {
            actions.append(renderActionLink({
                label: "View Repository",
                type: "secondary",
                target: data.repository.trim(),
                icon: "github"
            }));
        }

        if (actions.childNodes.length) {
            main.append(actions);
        }

        if (data.description) {
            main.append(createElement("p", {
                className: "hero-description",
                text: data.description
            }));
        }

        grid.append(main);

        if (data.brief && Array.isArray(data.brief.fields) && data.brief.fields.length) {
            grid.append(renderBrief(data.brief));
        }

        container.append(grid);
        heroSection.append(container);

        return heroSection;

    }

};
