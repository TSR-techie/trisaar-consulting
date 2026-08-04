import { createElement } from "../../js/utils.js";

export default {

    render(section) {

        const data = section.data || {};
        const variant = section.variant || "default";

        const root = createElement("section", {
            className: `cs-section summary summary--${variant} cs-animate`,
            id: section.id
        });

        const container = createElement("div", {
            className: "case-study-container"
        });

        const content = createElement("div", {
            className: "summary-content"
        });

        if (data.eyebrow) {
            content.append(createElement("span", {
                className: "cs-eyebrow",
                text: data.eyebrow
            }));
        }

        if (data.title) {
            content.append(createElement("h2", {
                className: "cs-title",
                text: data.title
            }));
        }

        (data.paragraphs || []).forEach((paragraph) => {
            content.append(createElement("p", {
                className: "cs-body",
                text: paragraph
            }));
        });

        container.append(content);

        if (Array.isArray(data.highlights) && data.highlights.length) {
            const highlights = createElement("ul", {
                className: "summary-highlights"
            });

            data.highlights.forEach((item) => {
                highlights.append(createElement("li", {
                    text: item
                }));
            });

            if (variant === "split") {
                container.append(highlights);
            } else {
                content.append(highlights);
            }
        }

        root.append(container);
        return root;

    }

};
