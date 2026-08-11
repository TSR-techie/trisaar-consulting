import { createElement } from "../../js/utils.js";
import { icon } from "../../js/icons.js";

const FLOW_VARIANTS = new Set([
    "executive-flow",
    "executive-flow-light"
]);

function isLightFlow(variant) {
    return variant === "executive-flow-light";
}

function metricChecklistText(metric = {}) {
    const value = String(metric.value || "").trim();
    const label = String(metric.label || "").trim();

    if (!value) return label;
    if (/^[\d.%+\-→\s]+$/.test(value) && label) return label;
    return value;
}

function renderHeader(data) {
    const header = createElement("header", {
        className: "summary-header"
    });

    if (data.eyebrow) {
        header.append(createElement("span", {
            className: "cs-eyebrow",
            text: data.eyebrow
        }));
    }

    if (data.title) {
        header.append(createElement("h2", {
            className: "cs-title summary-title",
            text: data.title
        }));
    }

    if (data.subtitle) {
        header.append(createElement("p", {
            className: "cs-body summary-subtitle",
            text: data.subtitle
        }));
    } else {
        (data.paragraphs || []).forEach((paragraph) => {
            header.append(createElement("p", {
                className: "cs-body summary-subtitle",
                text: paragraph
            }));
        });
    }

    return header;
}

function renderPoints(points = []) {
    const list = createElement("ul", {
        className: "summary-points"
    });

    points.forEach((point) => {
        const item = createElement("li", {
            className: "summary-point"
        });

        if (point.icon) {
            item.append(icon(point.icon, "summary-point-icon"));
        }

        item.append(createElement("span", {
            text: point.text || point
        }));

        list.append(item);
    });

    return list;
}

function renderSteps(steps = []) {
    const list = createElement("ol", {
        className: "summary-steps"
    });

    steps.forEach((step, index) => {
        const item = createElement("li", {
            className: "summary-step"
        });

        item.append(createElement("span", {
            className: "summary-step-index",
            text: String(index + 1)
        }));

        if (step.icon) {
            item.append(icon(step.icon, "summary-step-icon"));
        }

        item.append(createElement("span", {
            className: "summary-step-text",
            text: step.text || step
        }));

        list.append(item);
    });

    return list;
}

function renderMetrics(metrics = []) {
    const grid = createElement("div", {
        className: "summary-metrics"
    });

    metrics.forEach((metric) => {
        const card = createElement("div", {
            className: "summary-metric"
        });

        if (metric.icon) {
            card.append(icon(metric.icon, "summary-metric-icon"));
        }

        card.append(
            createElement("strong", {
                className: "summary-metric-value",
                text: metric.value
            }),
            createElement("span", {
                className: "summary-metric-label",
                text: metric.label
            })
        );

        grid.append(card);
    });

    return grid;
}

function renderChecklist(metrics = []) {
    const list = createElement("ul", {
        className: "summary-checklist"
    });

    metrics.forEach((metric) => {
        const item = createElement("li", {
            className: "summary-checklist-item"
        });

        item.append(
            icon("check", "summary-checklist-icon"),
            createElement("span", {
                text: metricChecklistText(metric)
            })
        );

        list.append(item);
    });

    return list;
}

function renderPillar(pillar, index, variant) {
    const key = pillar.key || `pillar-${index + 1}`;
    const light = isLightFlow(variant);

    const article = createElement("article", {
        className: `summary-pillar summary-pillar--${key} cs-animate cs-animate-delay-${Math.min(index + 1, 3)}`
    });

    const top = createElement("div", {
        className: "summary-pillar-top"
    });

    if (pillar.icon) {
        top.append(icon(pillar.icon, "summary-pillar-icon"));
    }

    top.append(createElement("span", {
        className: "summary-pillar-label",
        text: pillar.label || key
    }));

    article.append(top);

    if (pillar.title) {
        article.append(createElement("h3", {
            className: "summary-pillar-title",
            text: pillar.title
        }));
    }

    const showBody = !light || key !== "impact";

    if (showBody && pillar.body) {
        article.append(createElement("p", {
            className: "summary-pillar-body",
            text: pillar.body
        }));
    }

    if (!light) {
        if (Array.isArray(pillar.points) && pillar.points.length) {
            article.append(renderPoints(pillar.points));
        }

        if (Array.isArray(pillar.steps) && pillar.steps.length) {
            article.append(renderSteps(pillar.steps));
        }

        if (Array.isArray(pillar.metrics) && pillar.metrics.length) {
            article.append(renderMetrics(pillar.metrics));
        }
    } else if (Array.isArray(pillar.metrics) && pillar.metrics.length) {
        article.append(renderChecklist(pillar.metrics));
    }

    return article;
}

function renderFlow(pillars = [], variant) {
    const flow = createElement("div", {
        className: "summary-flow",
        attributes: { role: "list" }
    });

    pillars.forEach((pillar, index) => {
        const item = createElement("div", {
            className: "summary-flow-item",
            attributes: { role: "listitem" }
        });

        item.append(renderPillar(pillar, index, variant));

        if (index < pillars.length - 1) {
            item.append(createElement("span", {
                className: "summary-flow-arrow",
                attributes: { "aria-hidden": "true" },
                html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>`
            }));
        }

        flow.append(item);
    });

    return flow;
}

function renderBottomLineStatement(bottomLine = {}) {
    const statement = createElement("p", {
        className: "summary-bottomline-text"
    });

    if (Array.isArray(bottomLine.parts) && bottomLine.parts.length) {
        bottomLine.parts.forEach((part) => {
            statement.append(createElement("span", {
                className: part.emphasis ? "summary-emphasis" : undefined,
                text: part.text
            }));
        });
    } else if (bottomLine.text) {
        statement.textContent = bottomLine.text;
    }

    return statement;
}

function renderBottomLine(bottomLine = {}, variant) {
    const light = isLightFlow(variant);
    const label = bottomLine.label || "Bottom line";

    const bar = createElement("div", {
        className: "summary-bottomline"
    });

    const main = createElement("div", {
        className: "summary-bottomline-main"
    });

    const badge = createElement("div", {
        className: "summary-bottomline-badge"
    });

    badge.append(icon(bottomLine.icon || "star", "summary-bottomline-icon"));

    const statement = renderBottomLineStatement(bottomLine);

    if (light) {
        const copy = createElement("div", {
            className: "summary-bottomline-copy"
        });

        copy.append(
            createElement("span", {
                className: "summary-bottomline-label",
                text: label
            }),
            statement
        );

        main.append(badge, copy);
    } else {
        badge.append(createElement("span", {
            className: "summary-bottomline-label",
            text: label
        }));

        main.append(badge, statement);
    }

    bar.append(main);

    if (bottomLine.cta?.label && bottomLine.cta?.target) {
        const cta = createElement("a", {
            className: light
                ? "summary-bottomline-cta summary-bottomline-cta--link"
                : "btn btn-primary summary-bottomline-cta",
            attributes: { href: bottomLine.cta.target }
        });

        if (bottomLine.cta.icon) {
            cta.append(icon(bottomLine.cta.icon, "summary-cta-icon"));
        }

        cta.append(document.createTextNode(bottomLine.cta.label));

        if (light) {
            cta.append(createElement("span", {
                className: "summary-cta-chevron",
                attributes: { "aria-hidden": "true" },
                text: ">"
            }));
        }

        bar.append(cta);
    }

    return bar;
}

function renderMeta(meta = []) {
    const row = createElement("footer", {
        className: "summary-meta"
    });

    meta.forEach((item) => {
        const cell = createElement("div", {
            className: "summary-meta-item"
        });

        if (item.icon) {
            cell.append(icon(item.icon, "summary-meta-icon"));
        }

        cell.append(
            createElement("span", {
                className: "summary-meta-label",
                text: item.label
            }),
            createElement("strong", {
                className: "summary-meta-value",
                text: item.value
            })
        );

        row.append(cell);
    });

    return row;
}

function renderExecutiveFlow(section, data, variant) {
    const root = createElement("section", {
        className: `cs-section summary summary--${variant} cs-animate`,
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container summary-container"
    });

    container.append(renderHeader(data));

    if (Array.isArray(data.pillars) && data.pillars.length) {
        container.append(renderFlow(data.pillars, variant));
    }

    if (data.bottomLine) {
        container.append(renderBottomLine(data.bottomLine, variant));
    }

    if (Array.isArray(data.meta) && data.meta.length) {
        container.append(renderMeta(data.meta));
    }

    root.append(container);
    return root;
}

function renderSplit(section, data, variant) {
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

export default {

    render(section) {
        const data = section.data || {};
        const variant = section.variant || "default";

        if (FLOW_VARIANTS.has(variant)) {
            return renderExecutiveFlow(section, data, variant);
        }

        return renderSplit(section, data, variant);
    }

};
