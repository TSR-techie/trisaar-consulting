import { createElement } from "../../js/utils.js";

export default {

    render(section) {

        const data = section.data || {};
        const variant = section.variant || "default";

        const root = createElement("section", {
            className: `cs-section challenge challenge--${variant} cs-animate`,
            id: section.id
        });

        const container = createElement("div", {
            className: "case-study-container"
        });

        const content = createElement("div", {
            className: "challenge-content"
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

        if (data.body) {
            content.append(createElement("p", {
                className: "cs-body",
                text: data.body
            }));
        }

        if (Array.isArray(data.bullets) && data.bullets.length) {
            const list = createElement("ul", {
                className: "cs-list"
            });

            data.bullets.forEach((bullet) => {
                list.append(createElement("li", { text: bullet }));
            });

            content.append(list);
        }

        if (variant === "callout") {
            const callout = createElement("div", {
                className: "challenge-callout"
            });
            callout.append(content);
            container.append(callout);
        } else {
            container.append(content);
        }

        root.append(container);
        return root;

    }

};
