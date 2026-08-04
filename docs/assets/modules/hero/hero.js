import { createElement } from "../../js/utils.js";
import { icon, ICONS } from "../../js/icons.js";

function renderTaxonomy(part) {
    const items = part.data?.items;

    if (!Array.isArray(items) || !items.length) return null;

    return createElement("span", {
        className: "cs-hero-eyebrow",
        text: items.join(" • ")
    });
}

function renderIdentity(part) {
    const text = part.data?.text;

    if (!text) return null;

    const variant = part.variant || "dualTone";
    const line = createElement("p", {
        className: `cs-hero-identity cs-hero-identity--${variant}`
    });

    if (variant !== "dualTone") {
        line.append(createElement("span", {
            className: "cs-hero-identity-text",
            text
        }));
        return line;
    }

    String(text).split(/([0-9\u0966-\u096F]+)/).forEach((chunk) => {
        if (!chunk) return;

        const isNumeral = /^[0-9\u0966-\u096F]+$/.test(chunk);
        const isSeparator = !isNumeral && /^[\s·•.\-–—|/]+$/.test(chunk);

        line.append(createElement("span", {
            className: (isNumeral || isSeparator)
                ? "cs-hero-identity-num"
                : "cs-hero-identity-text",
            text: chunk
        }));
    });

    return line;
}

function renderTitle(part) {
    const text = part.data?.text;

    if (!text) return null;

    return createElement("h1", {
        className: "cs-hero-title",
        text
    });
}

function renderSubtitle(part) {
    const text = part.data?.text;

    if (!text) return null;

    return createElement("p", {
        className: "cs-hero-subtitle",
        text
    });
}

function renderDescription(part) {
    const text = part.data?.text;

    if (!text) return null;

    return createElement("p", {
        className: "cs-hero-description",
        text
    });
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

    if (action.icon && ICONS[action.icon]) {
        link.append(icon(action.icon, "btn-icon"));
    }

    link.append(document.createTextNode(action.label || ""));
    return link;
}

function renderActions(part) {
    const items = part.data?.items;

    if (!Array.isArray(items) || !items.length) return null;

    const actions = createElement("div", {
        className: "cs-hero-actions"
    });

    items.forEach((action) => {
        actions.append(renderActionLink(action));
    });

    return actions;
}

function renderBriefField(field) {
    const row = createElement("div", {
        className: "cs-hero-brief-row"
    });

    const labelWrap = createElement("div", {
        className: "cs-hero-brief-label"
    });

    if (field.icon) {
        labelWrap.append(icon(field.icon, "cs-hero-brief-icon"));
    }

    labelWrap.append(createElement("span", {
        text: field.label
    }));

    row.append(labelWrap);

    const valueWrap = createElement("div", {
        className: "cs-hero-brief-value"
    });

    if (Array.isArray(field.values) && field.values.length) {
        const list = createElement("ul", {
            className: "cs-hero-brief-list"
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

function renderBrief(part) {
    const data = part.data || {};
    const briefVariant = part.variant || "rail";

    if (!Array.isArray(data.fields) || !data.fields.length) return null;

    const panel = createElement("aside", {
        className: `cs-hero-brief cs-hero-brief--${briefVariant}`
    });

    const header = createElement("div", {
        className: "cs-hero-brief-header"
    });

    header.append(
        icon("document", "cs-hero-brief-header-icon"),
        createElement("span", {
            text: data.title || "Case Brief"
        })
    );

    panel.append(header);

    const body = createElement("div", {
        className: "cs-hero-brief-body"
    });

    data.fields.forEach((field) => {
        body.append(renderBriefField(field));
    });

    panel.append(body);
    return panel;
}

const PART_RENDERERS = {
    taxonomy: renderTaxonomy,
    identity: renderIdentity,
    title: renderTitle,
    subtitle: renderSubtitle,
    actions: renderActions,
    description: renderDescription,
    brief: renderBrief
};

function legacyPartsFromData(data = {}) {
    const parts = [];

    if (Array.isArray(data.taxonomy) && data.taxonomy.length) {
        parts.push({ type: "taxonomy", data: { items: data.taxonomy } });
    }

    if (data.identity) {
        parts.push({
            type: "identity",
            variant: "dualTone",
            data: { text: data.identity }
        });
    }

    if (data.title) {
        parts.push({ type: "title", data: { text: data.title } });
    }

    if (data.subtitle) {
        parts.push({ type: "subtitle", data: { text: data.subtitle } });
    }

    const actionItems = [...(data.actions || [])];

    if (typeof data.repository === "string" && data.repository.trim()) {
        actionItems.push({
            label: "View Repository",
            type: "secondary",
            target: data.repository.trim(),
            icon: "github"
        });
    }

    if (actionItems.length) {
        parts.push({ type: "actions", data: { items: actionItems } });
    }

    if (data.description) {
        parts.push({ type: "description", data: { text: data.description } });
    }

    if (data.brief) {
        parts.push({
            type: "brief",
            variant: "rail",
            data: data.brief
        });
    }

    return parts;
}

function resolveParts(section) {
    let parts = [];

    if (Array.isArray(section.parts) && section.parts.length) {
        parts = section.parts;
    } else if (section.data) {
        parts = legacyPartsFromData(section.data);
    }

    return parts.filter((part) => part.visible !== false);
}

function renderPart(part) {
    const renderer = PART_RENDERERS[part.type];

    if (!renderer) {
        console.warn(`Unknown hero part: ${part.type}`);
        return null;
    }

    return renderer(part);
}

export default {

    render(section) {

        const variant = section.variant || "immersive";
        const parts = resolveParts(section);

        const heroSection = createElement("section", {
            className: `cs-hero cs-hero--${variant} cs-animate`,
            id: section.id
        });

        const container = createElement("div", {
            className: "cs-hero-container"
        });

        const mainParts = [];
        let briefPart = null;

        parts.forEach((part) => {
            
            if (part.type === "brief") {
                briefPart = part;
            } else {
                mainParts.push(part);
            }
        });

        const main = createElement("div", {
            className: "cs-hero-main"
        });

        mainParts.forEach((part) => {
            const node = renderPart(part);
            if (node) main.append(node);
        });

        const briefNode = briefPart ? renderPart(briefPart) : null;

        if (variant === "compact") {
            const stack = createElement("div", {
                className: "cs-hero-stack"
            });

            stack.append(main);

            if (briefNode) {
                stack.append(briefNode);
            }

            container.append(stack);
        } else {
            const grid = createElement("div", {
                className: "cs-hero-grid"
            });

            grid.append(main);

            if (briefNode) {
                grid.append(briefNode);
            }

            container.append(grid);
        }

        heroSection.append(container);
        return heroSection;

    }

};
