import { createElement } from "../../js/utils.js";

const DEFAULT_VARIANT = "impact-simple";

function resolveVariant(variant) {
    if (!variant || variant === "default" || variant === "strip") {
        return DEFAULT_VARIANT;
    }

    return variant;
}

function renderImpactSimple(section, data) {
    const root = createElement("section", {
        className: "cs-section impact impact--impact-simple cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container"
    });

    const header = createElement("div", {
        className: "impact-header"
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

    container.append(header);

    if (Array.isArray(data.metrics) && data.metrics.length) {
        const metrics = createElement("div", {
            className: "impact-metrics"
        });

        data.metrics.forEach((metric) => {
            const item = createElement("div", {
                className: "impact-metric"
            });

            item.append(
                createElement("strong", {
                    className: "impact-metric-value",
                    text: metric.value
                }),
                createElement("span", {
                    className: "impact-metric-label",
                    text: metric.label
                })
            );

            if (metric.note) {
                item.append(createElement("p", {
                    className: "impact-metric-note",
                    text: metric.note
                }));
            }

            metrics.append(item);
        });

        container.append(metrics);
    }

    root.append(container);
    return root;
}

export default {

    render(section) {
        const data = section.data || {};
        const variant = resolveVariant(section.variant);

        if (variant === "impact-simple") {
            return renderImpactSimple(section, data);
        }

        return renderImpactSimple(section, data);
    }

};
