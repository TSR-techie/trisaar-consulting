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

function getPillar(pillars = [], key) {
    return pillars.find((pillar) => pillar.key === key) || null;
}

function renderOverviewNarrative(pillars = []) {
    const list = createElement("div", {
        className: "summary-overview-narrative"
    });

    pillars.forEach((pillar, index) => {
        const key = pillar.key || `pillar-${index + 1}`;

        const item = createElement("article", {
            className: `summary-overview-item summary-overview-item--${key} cs-animate cs-animate-delay-${Math.min(index + 1, 3)}`
        });

        if (pillar.icon) {
            item.append(icon(pillar.icon, "summary-overview-item-icon"));
        }

        const copy = createElement("div", {
            className: "summary-overview-item-copy"
        });

        if (pillar.label) {
            copy.append(createElement("span", {
                className: "summary-overview-item-label",
                text: pillar.label
            }));
        }

        if (pillar.title) {
            copy.append(createElement("h3", {
                className: "summary-overview-item-title",
                text: pillar.title
            }));
        }

        if (pillar.body) {
            copy.append(createElement("p", {
                className: "summary-overview-item-body",
                text: pillar.body
            }));
        }

        item.append(copy);
        list.append(item);
    });

    return list;
}

function renderOverviewGlance(metrics = []) {
    const section = createElement("div", {
        className: "summary-overview-glance"
    });

    section.append(createElement("span", {
        className: "summary-overview-panel-label",
        text: "At a glance"
    }));

    const grid = createElement("div", {
        className: "summary-overview-metrics"
    });

    metrics.forEach((metric) => {
        const card = createElement("div", {
            className: "summary-overview-metric"
        });

        if (metric.icon) {
            card.append(icon(metric.icon, "summary-overview-metric-icon"));
        }

        const copy = createElement("div", {
            className: "summary-overview-metric-copy"
        });

        copy.append(
            createElement("strong", {
                className: "summary-overview-metric-value",
                text: metric.value
            }),
            createElement("span", {
                className: "summary-overview-metric-label",
                text: metric.label
            })
        );

        card.append(copy);
        grid.append(card);
    });

    section.append(grid);
    return section;
}

function renderOverviewProcess(steps = []) {
    const section = createElement("div", {
        className: "summary-overview-process"
    });

    section.append(createElement("span", {
        className: "summary-overview-panel-label",
        text: "How it works"
    }));

    const track = createElement("div", {
        className: "summary-overview-steps",
        attributes: { role: "list" }
    });

    steps.forEach((step, index) => {
        const item = createElement("div", {
            className: "summary-overview-step",
            attributes: { role: "listitem" }
        });

        if (step.icon) {
            item.append(icon(step.icon, "summary-overview-step-icon"));
        }

        item.append(createElement("span", {
            className: "summary-overview-step-text",
            text: step.text || step
        }));

        track.append(item);

        if (index < steps.length - 1) {
            track.append(createElement("span", {
                className: "summary-overview-step-arrow",
                attributes: { "aria-hidden": "true" },
                html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>`
            }));
        }
    });

    section.append(track);
    return section;
}

function renderOverviewPanel(pillars = []) {
    const solution = getPillar(pillars, "solution");
    const impact = getPillar(pillars, "impact");
    const metrics = impact?.metrics || [];
    const steps = solution?.steps || [];

    if (!metrics.length && !steps.length) return null;

    const panel = createElement("aside", {
        className: "summary-overview-panel"
    });

    if (metrics.length) {
        panel.append(renderOverviewGlance(metrics));
    }

    if (steps.length) {
        panel.append(renderOverviewProcess(steps));
    }

    return panel;
}

function renderOverviewBottomLine(bottomLine = {}) {
    const label = bottomLine.label || "Bottom line";

    const bar = createElement("div", {
        className: "summary-bottomline summary-bottomline--overview"
    });

    const main = createElement("div", {
        className: "summary-bottomline-main"
    });

    const copy = createElement("div", {
        className: "summary-bottomline-copy"
    });

    copy.append(
        createElement("span", {
            className: "summary-bottomline-label",
            text: label
        }),
        renderBottomLineStatement(bottomLine)
    );

    main.append(
        icon("quote", "summary-bottomline-icon summary-bottomline-icon--quote"),
        copy
    );

    bar.append(main);

    if (bottomLine.cta?.label && bottomLine.cta?.target) {
        const cta = createElement("a", {
            className: "summary-bottomline-cta summary-bottomline-cta--link",
            attributes: { href: bottomLine.cta.target }
        });

        cta.append(
            document.createTextNode(bottomLine.cta.label),
            icon("arrow-circle", "summary-cta-icon")
        );

        bar.append(cta);
    }

    return bar;
}

function renderExecutiveOverview(section, data) {
    const root = createElement("section", {
        className: "cs-section summary summary--executive-overview cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container summary-container"
    });

    container.append(renderHeader(data));

    const layout = createElement("div", {
        className: "summary-overview-layout"
    });

    if (Array.isArray(data.pillars) && data.pillars.length) {
        layout.append(renderOverviewNarrative(data.pillars));

        const panel = renderOverviewPanel(data.pillars);
        if (panel) layout.append(panel);
    }

    container.append(layout);

    if (data.bottomLine) {
        container.append(renderOverviewBottomLine(data.bottomLine));
    }

    if (Array.isArray(data.meta) && data.meta.length) {
        container.append(renderMeta(data.meta));
    }

    root.append(container);
    return root;
}

const BRIEF_CARD_TARGETS = {
    challenge: "#challenge",
    solution: "#approach",
    impact: "#outcomes",
    glance: "#outcomes"
};

function renderBriefHeader(data) {
    const header = createElement("header", {
        className: "summary-brief-header"
    });

    const copy = createElement("div", {
        className: "summary-brief-copy"
    });

    if (data.eyebrow) {
        const eyebrow = createElement("div", {
            className: "summary-brief-eyebrow"
        });

        eyebrow.append(
            createElement("span", { className: "summary-brief-eyebrow-rule", attributes: { "aria-hidden": "true" } }),
            createElement("span", { className: "cs-eyebrow", text: data.eyebrow }),
            createElement("span", { className: "summary-brief-eyebrow-rule", attributes: { "aria-hidden": "true" } })
        );

        copy.append(eyebrow);
    }

    if (data.title) {
        copy.append(createElement("h2", {
            className: "cs-title summary-title",
            text: data.title
        }));
    }

    if (data.subtitle) {
        copy.append(createElement("p", {
            className: "cs-body summary-subtitle",
            text: data.subtitle
        }));
    }

    const visual = createElement("div", {
        className: "summary-brief-visual",
        attributes: { "aria-hidden": "true" }
    });

    visual.innerHTML = `
        <div class="summary-brief-board">
            <span class="summary-brief-board-gear"></span>
            <span class="summary-brief-board-pin"></span>
            <span class="summary-brief-board-node summary-brief-board-node--a"></span>
            <span class="summary-brief-board-node summary-brief-board-node--b"></span>
            <span class="summary-brief-board-node summary-brief-board-node--c"></span>
            <span class="summary-brief-board-node summary-brief-board-node--d"></span>
            <span class="summary-brief-board-line summary-brief-board-line--a"></span>
            <span class="summary-brief-board-line summary-brief-board-line--b"></span>
            <span class="summary-brief-board-line summary-brief-board-line--c"></span>
        </div>
    `;

    header.append(copy, visual);
    return header;
}

function renderBriefCardLink(target, featured = false) {
    const link = createElement("a", {
        className: featured
            ? "summary-brief-card-link summary-brief-card-link--featured"
            : "summary-brief-card-link",
        attributes: { href: target }
    });

    link.append(document.createTextNode("Read more"));
    link.append(createElement("span", {
        attributes: { "aria-hidden": "true" },
        text: " →"
    }));

    return link;
}

function renderBriefPillarCard(pillar, index) {
    const key = pillar.key || `pillar-${index + 1}`;
    const featured = key === "solution";

    const card = createElement("article", {
        className: `summary-brief-card summary-brief-card--${key}${featured ? " summary-brief-card--featured" : ""} cs-animate cs-animate-delay-${Math.min(index + 1, 3)}`
    });

    if (featured) {
        card.append(createElement("div", {
            className: "summary-brief-card-ribbon",
            attributes: { "aria-hidden": "true" }
        }));
    }

    if (pillar.icon) {
        card.append(icon(pillar.icon, "summary-brief-card-icon"));
    }

    if (pillar.label) {
        card.append(createElement("span", {
            className: "summary-brief-card-label",
            text: pillar.label
        }));
    }

    if (pillar.title) {
        card.append(createElement("h3", {
            className: "summary-brief-card-title",
            text: pillar.title
        }));
    }

    if (pillar.body) {
        card.append(createElement("p", {
            className: "summary-brief-card-body",
            text: pillar.body
        }));
    }

    card.append(renderBriefCardLink(BRIEF_CARD_TARGETS[key] || "#challenge", featured));
    return card;
}

function renderBriefGlanceCard(metrics = []) {
    const card = createElement("article", {
        className: "summary-brief-card summary-brief-card--glance cs-animate cs-animate-delay-3"
    });

    card.append(
        icon("shield", "summary-brief-card-icon"),
        createElement("span", {
            className: "summary-brief-card-label",
            text: "At a glance"
        })
    );

    const list = createElement("ul", {
        className: "summary-brief-glance-list"
    });

    metrics.forEach((metric) => {
        const item = createElement("li", {
            className: "summary-brief-glance-item"
        });

        item.append(
            icon("check", "summary-brief-glance-icon"),
            createElement("span", {
                text: metricChecklistText(metric)
            })
        );

        list.append(item);
    });

    card.append(list, renderBriefCardLink(BRIEF_CARD_TARGETS.glance));
    return card;
}

function renderBriefCards(pillars = []) {
    const grid = createElement("div", {
        className: "summary-brief-cards"
    });

    pillars.forEach((pillar, index) => {
        grid.append(renderBriefPillarCard(pillar, index));
    });

    const impact = getPillar(pillars, "impact");
    if (Array.isArray(impact?.metrics) && impact.metrics.length) {
        grid.append(renderBriefGlanceCard(impact.metrics));
    }

    return grid;
}

function renderBriefProcess(steps = []) {
    if (!steps.length) return null;

    const section = createElement("div", {
        className: "summary-brief-process"
    });

    const header = createElement("div", {
        className: "summary-brief-process-header"
    });

    header.append(
        createElement("span", {
            className: "summary-brief-process-eyebrow",
            text: "How it works"
        }),
        createElement("h3", {
            className: "summary-brief-process-title",
            text: "From expert insight to repeatable decisions"
        })
    );

    const body = createElement("div", {
        className: "summary-brief-process-body"
    });

    const media = createElement("div", {
        className: "summary-brief-media",
        attributes: { "aria-hidden": "true" }
    });

    media.innerHTML = `
        <div class="summary-brief-media-back"></div>
        <div class="summary-brief-media-front">
            <span></span><span></span><span></span><span></span>
        </div>
    `;

    const stepsWrap = createElement("div", {
        className: "summary-brief-process-steps",
        attributes: { role: "list" }
    });

    steps.forEach((step, index) => {
        const item = createElement("div", {
            className: "summary-brief-process-step",
            attributes: { role: "listitem" }
        });

        if (step.icon) {
            item.append(icon(step.icon, "summary-brief-process-icon"));
        }

        item.append(
            createElement("span", {
                className: "summary-brief-process-index",
                text: String(index + 1)
            }),
            createElement("span", {
                className: "summary-brief-process-text",
                text: step.text || step
            })
        );

        stepsWrap.append(item);

        if (index < steps.length - 1) {
            stepsWrap.append(createElement("span", {
                className: "summary-brief-process-arrow",
                attributes: { "aria-hidden": "true" }
            }));
        }
    });

    body.append(media, stepsWrap);
    section.append(header, body);
    return section;
}

function renderBriefBottomLine(bottomLine = {}) {
    const label = bottomLine.label || "Bottom line";

    const bar = createElement("div", {
        className: "summary-bottomline summary-bottomline--brief"
    });

    const main = createElement("div", {
        className: "summary-bottomline-main"
    });

    const copy = createElement("div", {
        className: "summary-bottomline-copy"
    });

    copy.append(
        createElement("span", {
            className: "summary-bottomline-label",
            text: label
        }),
        renderBottomLineStatement(bottomLine)
    );

    main.append(
        icon(bottomLine.icon || "star", "summary-bottomline-icon"),
        copy
    );

    bar.append(main);

    if (bottomLine.cta?.label && bottomLine.cta?.target) {
        const cta = createElement("a", {
            className: "summary-bottomline-cta summary-bottomline-cta--outline",
            attributes: { href: bottomLine.cta.target }
        });

        cta.append(document.createTextNode(`${bottomLine.cta.label} →`));
        bar.append(cta);
    }

    return bar;
}

function renderBriefMetrics(metrics = []) {
    if (!metrics.length) return null;

    const row = createElement("div", {
        className: "summary-brief-metrics"
    });

    metrics.forEach((metric) => {
        const item = createElement("div", {
            className: "summary-brief-metric"
        });

        item.append(
            icon(metric.icon || "outcome", "summary-brief-metric-icon")
        );

        const copy = createElement("div", {
            className: "summary-brief-metric-copy"
        });

        copy.append(
            createElement("strong", {
                className: "summary-brief-metric-value",
                text: metric.value
            }),
            createElement("span", {
                className: "summary-brief-metric-label",
                text: metric.label
            })
        );

        item.append(copy);
        row.append(item);
    });

    return row;
}

function renderExecutiveBrief(section, data) {
    const pillars = Array.isArray(data.pillars) ? data.pillars : [];
    const solution = getPillar(pillars, "solution");
    const impact = getPillar(pillars, "impact");

    const root = createElement("section", {
        className: "cs-section summary summary--executive-brief cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container summary-container"
    });

    container.append(renderBriefHeader(data));

    if (pillars.length) {
        container.append(renderBriefCards(pillars));
    }

    const process = renderBriefProcess(solution?.steps || []);
    if (process) container.append(process);

    if (data.bottomLine) {
        container.append(renderBriefBottomLine(data.bottomLine));
    }

    const metrics = renderBriefMetrics(impact?.metrics || []);
    if (metrics) container.append(metrics);

    root.append(container);
    return root;
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

        if (variant === "executive-brief") {
            return renderExecutiveBrief(section, data);
        }

        if (variant === "executive-overview") {
            return renderExecutiveOverview(section, data);
        }

        if (FLOW_VARIANTS.has(variant)) {
            return renderExecutiveFlow(section, data, variant);
        }

        return renderSplit(section, data, variant);
    }

};
