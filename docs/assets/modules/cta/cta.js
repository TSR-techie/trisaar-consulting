import { createElement } from "../../js/utils.js";

export default {

    render(section) {

        const data = section.data || {};
        const variant = section.variant || "default";

        const root = createElement("section", {
            className: `cs-section cta cta--${variant} cs-animate`,
            id: section.id
        });

        const container = createElement("div", {
            className: "case-study-container"
        });

        const panel = createElement("div", {
            className: "cta-panel"
        });

        if (data.title) {
            panel.append(createElement("h2", {
                className: "cta-title",
                text: data.title
            }));
        }

        if (data.body) {
            panel.append(createElement("p", {
                className: "cta-body",
                text: data.body
            }));
        }

        if (Array.isArray(data.actions) && data.actions.length) {
            const actions = createElement("div", {
                className: "cta-actions"
            });

            data.actions.forEach((action) => {
                const isExternal = /^https?:\/\//i.test(action.target || "");
                const attributes = { href: action.target || "#" };

                if (isExternal) {
                    attributes.target = "_blank";
                    attributes.rel = "noopener noreferrer";
                }

                actions.append(createElement("a", {
                    className: `btn btn-${action.type || "primary"}`,
                    text: action.label,
                    attributes
                }));
            });

            panel.append(actions);
        }

        container.append(panel);
        root.append(container);
        return root;

    }

};
