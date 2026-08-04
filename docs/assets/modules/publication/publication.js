import { createElement } from "../../js/utils.js";

const DOCUMENT_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>`;

export default {

    render(section) {

        const data = section.data || {};
        const variant = section.variant || "rule";

        const root = createElement("section", {
            className: `publication publication--${variant} cs-animate`,
            id: section.id
        });

        const container = createElement("div", {
            className: "case-study-container"
        });

        const rule = createElement("div", {
            className: "publication-rule"
        });

        const badge = createElement("div", {
            className: "publication-badge"
        });

        badge.append(
            createElement("span", {
                className: "publication-icon",
                html: DOCUMENT_ICON
            }),
            createElement("span", {
                className: "publication-badge-text",
                text: data.label || "Sāra Publication"
            })
        );

        rule.append(
            createElement("span", { className: "publication-node" }),
            createElement("span", { className: "publication-line" }),
            badge,
            createElement("span", { className: "publication-line" }),
            createElement("span", { className: "publication-node" })
        );

        container.append(rule);

        const details = [
            data.edition,
            data.version ? `Version ${data.version}` : null,
            data.published,
            data.readTime
        ].filter(Boolean);

        if (details.length) {
            const metaRow = createElement("p", {
                className: "publication-meta"
            });

            details.forEach((detail, index) => {
                if (index > 0) {
                    metaRow.append(createElement("span", {
                        className: "publication-sep",
                        text: "|"
                    }));
                }

                metaRow.append(createElement("span", {
                    className: "publication-meta-item",
                    text: detail
                }));
            });

            container.append(metaRow);
        }

        root.append(container);
        return root;

    }

};
