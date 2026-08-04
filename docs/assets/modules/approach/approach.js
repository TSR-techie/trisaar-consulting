import { createElement } from "../../js/utils.js";

export default {

    render(section) {

        const data = section.data || {};
        const variant = section.variant || "numbered";

        const root = createElement("section", {
            className: `cs-section approach approach--${variant} cs-animate`,
            id: section.id
        });

        const container = createElement("div", {
            className: "case-study-container"
        });

        const header = createElement("div", {
            className: "approach-header"
        });

        if (data.eyebrow) {
            header.append(createElement("span", {
                className: "cs-eyebrow",
                text: data.eyebrow
            }));
        }

        if (data.title) {
            header.append(createElement("h2", {
                className: "cs-title",
                text: data.title
            }));
        }

        if (data.intro) {
            header.append(createElement("p", {
                className: "cs-body",
                text: data.intro
            }));
        }

        container.append(header);

        if (Array.isArray(data.steps) && data.steps.length) {
            const steps = createElement("div", {
                className: "approach-steps"
            });

            data.steps.forEach((step, index) => {
                const item = createElement("article", {
                    className: "approach-step"
                });

                item.append(
                    createElement("span", {
                        className: "approach-step-number",
                        text: String(index + 1).padStart(2, "0")
                    }),
                    createElement("h3", {
                        className: "approach-step-title",
                        text: step.title
                    }),
                    createElement("p", {
                        className: "approach-step-body",
                        text: step.body
                    })
                );

                steps.append(item);
            });

            container.append(steps);
        }

        root.append(container);
        return root;

    }

};
