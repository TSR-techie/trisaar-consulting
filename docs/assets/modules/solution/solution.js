import { createElement } from "../../js/utils.js";

const DEFAULT_VARIANT = "solution-simple";

function resolveVariant(variant) {
    if (!variant || variant === "default" || variant === "numbered") {
        return DEFAULT_VARIANT;
    }

    return variant;
}

function renderSolutionSimple(section, data) {
    const root = createElement("section", {
        className: "cs-section solution solution--solution-simple cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container"
    });

    const header = createElement("div", {
        className: "solution-header"
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
            className: "solution-steps"
        });

        data.steps.forEach((step, index) => {
            const item = createElement("article", {
                className: "solution-step"
            });

            item.append(
                createElement("span", {
                    className: "solution-step-number",
                    text: String(index + 1).padStart(2, "0")
                }),
                createElement("h3", {
                    className: "solution-step-title",
                    text: step.title
                }),
                createElement("p", {
                    className: "solution-step-body",
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

export default {

    render(section) {
        const data = section.data || {};
        const variant = resolveVariant(section.variant);

        if (variant === "solution-simple") {
            return renderSolutionSimple(section, data);
        }

        return renderSolutionSimple(section, data);
    }

};
