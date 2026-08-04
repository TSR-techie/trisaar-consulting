import { createElement } from "../../js/utils.js";

export default {

    render(section) {

        const data = section.data || {};
        const variant = section.variant || "strip";

        const root = createElement("section", {
            className: `cs-section outcomes outcomes--${variant} cs-animate`,
            id: section.id
        });

        const container = createElement("div", {
            className: "case-study-container"
        });

        const header = createElement("div", {
            className: "outcomes-header"
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
                className: "outcomes-metrics"
            });

            data.metrics.forEach((metric) => {
                const item = createElement("div", {
                    className: "outcomes-metric"
                });

                item.append(
                    createElement("strong", {
                        className: "outcomes-metric-value",
                        text: metric.value
                    }),
                    createElement("span", {
                        className: "outcomes-metric-label",
                        text: metric.label
                    })
                );

                if (metric.note) {
                    item.append(createElement("p", {
                        className: "outcomes-metric-note",
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

};
