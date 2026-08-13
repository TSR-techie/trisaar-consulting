import { createElement } from "../../js/utils.js";
import { icon } from "../../js/icons.js";

const DEFAULT_VARIANT = "challenge-simple";
const FRICTION_ASSET = "challenge-friction-map.png";

function resolveVariant(variant) {
    if (!variant || variant === "default" || variant === "callout") {
        return DEFAULT_VARIANT;
    }

    return variant;
}

function caseAsset(caseId, filename) {
    if (!caseId || !filename) return "";
    return `./docs/assets/images/sara/${caseId}/${filename}`;
}

function challengePoints(data = {}) {
    if (Array.isArray(data.points) && data.points.length) {
        return data.points;
    }

    if (Array.isArray(data.bullets) && data.bullets.length) {
        return data.bullets.map((bullet) => (
            typeof bullet === "string" ? { body: bullet } : bullet
        ));
    }

    return [];
}

function createNetworkFallback() {
    const visual = createElement("div", {
        className: "challenge-map-visual-fallback",
        attributes: { "aria-hidden": "true" }
    });

    visual.innerHTML = `
        <svg class="challenge-map-network" viewBox="0 0 320 240" fill="none">
            <circle cx="214" cy="118" r="72" fill="rgba(239,68,68,0.12)"></circle>
            <g stroke="#D1D5DB" stroke-width="1.6">
                <path d="M42 48L96 72L78 128L42 48Z"></path>
                <path d="M96 72L168 58L214 96"></path>
                <path d="M78 128L132 156L168 112"></path>
                <path d="M42 176L78 128"></path>
                <path d="M132 156L96 204"></path>
                <path d="M214 96L268 64"></path>
                <path d="M268 148L214 178"></path>
                <path d="M168 58L214 28"></path>
            </g>
            <g fill="#9CA3AF">
                <circle cx="42" cy="48" r="5.5"></circle>
                <circle cx="96" cy="72" r="5.5"></circle>
                <circle cx="78" cy="128" r="5.5"></circle>
                <circle cx="42" cy="176" r="5"></circle>
                <circle cx="132" cy="156" r="5.5"></circle>
                <circle cx="96" cy="204" r="5"></circle>
                <circle cx="168" cy="58" r="5.5"></circle>
                <circle cx="214" cy="28" r="5"></circle>
                <circle cx="268" cy="64" r="5.5"></circle>
                <circle cx="268" cy="148" r="5"></circle>
            </g>
            <g stroke="#EF4444" stroke-width="3.2" stroke-linecap="round">
                <path d="M96 72L168 112L214 96L248 128L214 178"></path>
            </g>
            <g fill="#EF4444">
                <circle cx="96" cy="72" r="6.5"></circle>
                <circle cx="168" cy="112" r="7"></circle>
                <circle cx="214" cy="96" r="7"></circle>
                <circle cx="248" cy="128" r="6.5"></circle>
                <circle cx="214" cy="178" r="6.5"></circle>
            </g>
        </svg>
    `;

    return visual;
}

function createFrictionVisual(caseId) {
    const frame = createElement("div", {
        className: "challenge-map-visual"
    });

    const src = caseAsset(caseId, FRICTION_ASSET);

    if (!src) {
        frame.append(createNetworkFallback());
        return frame;
    }

    const image = createElement("img", {
        className: "challenge-map-visual-image",
        attributes: {
            src,
            alt: "",
            loading: "lazy"
        }
    });

    image.addEventListener("error", () => {
        frame.replaceChildren(createNetworkFallback());
    }, { once: true });

    frame.append(image);
    return frame;
}

function renderEyebrow(text) {
    const wrap = createElement("div", {
        className: "challenge-map-eyebrow"
    });

    wrap.append(createElement("span", {
        className: "cs-eyebrow",
        text
    }));

    return wrap;
}

function renderChallengeSimple(section, data) {
    const root = createElement("section", {
        className: "cs-section challenge challenge--challenge-simple cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container"
    });

    const callout = createElement("div", {
        className: "challenge-callout"
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

    const points = challengePoints(data);

    if (points.length) {
        const list = createElement("ul", {
            className: "cs-list"
        });

        points.forEach((point) => {
            list.append(createElement("li", {
                text: point.body || point.title || ""
            }));
        });

        content.append(list);
    }

    callout.append(content);
    container.append(callout);
    root.append(container);
    return root;
}

function renderFrictionPoint(point, index) {
    const item = createElement("article", {
        className: `challenge-map-point cs-animate cs-animate-delay-${Math.min(index + 1, 3)}`
    });

    if (point.icon) {
        item.append(icon(point.icon, "challenge-map-point-icon"));
    }

    if (point.title) {
        item.append(createElement("h3", {
            className: "challenge-map-point-title",
            text: point.title
        }));
    }

    if (point.body) {
        item.append(createElement("p", {
            className: "challenge-map-point-body",
            text: point.body
        }));
    }

    return item;
}

function renderFrictionMapRow(data) {
    const map = createElement("div", {
        className: "challenge-map-grid"
    });

    const core = data.core || {};
    const coreCard = createElement("article", {
        className: "challenge-map-core"
    });

    if (core.icon) {
        coreCard.append(icon(core.icon, "challenge-map-core-icon"));
    }

    if (core.label) {
        coreCard.append(createElement("h3", {
            className: "challenge-map-core-label",
            text: core.label
        }));
    }

    if (core.body) {
        coreCard.append(createElement("p", {
            className: "challenge-map-core-body",
            text: core.body
        }));
    }

    coreCard.append(icon("chevron-right", "challenge-map-core-arrow"));
    map.append(coreCard);

    challengePoints(data).forEach((point, index) => {
        map.append(renderFrictionPoint(point, index));
    });

    return map;
}

function renderFrictionImpact(impact = {}) {
    if (!impact.label && !impact.body && !Array.isArray(impact.metrics)) {
        return null;
    }

    const bar = createElement("div", {
        className: "challenge-map-impact"
    });

    const copy = createElement("div", {
        className: "challenge-map-impact-copy"
    });

    copy.append(icon(impact.icon || "quote", "challenge-map-impact-quote"));

    const text = createElement("div", {
        className: "challenge-map-impact-text"
    });

    if (impact.label) {
        text.append(createElement("span", {
            className: "challenge-map-impact-label",
            text: impact.label
        }));
    }

    if (impact.body) {
        text.append(createElement("p", {
            className: "challenge-map-impact-body",
            text: impact.body
        }));
    }

    copy.append(text);
    bar.append(copy);

    const metrics = Array.isArray(impact.metrics) ? impact.metrics : [];

    if (metrics.length) {
        const list = createElement("div", {
            className: "challenge-map-metrics"
        });

        metrics.forEach((metric) => {
            const item = createElement("div", {
                className: "challenge-map-metric"
            });

            if (metric.icon) {
                item.append(icon(metric.icon, "challenge-map-metric-icon"));
            }

            const stack = createElement("div", {
                className: "challenge-map-metric-stack"
            });

            if (metric.value) {
                stack.append(createElement("strong", {
                    className: "challenge-map-metric-value",
                    text: metric.value
                }));
            }

            if (metric.label) {
                stack.append(createElement("span", {
                    className: "challenge-map-metric-label",
                    text: metric.label
                }));
            }

            item.append(stack);
            list.append(item);
        });

        bar.append(list);
    }

    return bar;
}

function padOptionIndex(index) {
    return String(index + 1).padStart(2, "0");
}

function renderAccentTitle(title, className) {
    const heading = createElement("h2", {
        className
    });

    const parts = String(title || "").split(/(?<=\.)\s+/).filter(Boolean);

    if (parts.length < 2) {
        heading.textContent = title || "";
        return heading;
    }

    const last = parts.pop();
    heading.append(document.createTextNode(`${parts.join(" ")} `));
    heading.append(createElement("span", {
        className: "challenge-title-accent",
        text: last
    }));

    return heading;
}

function createModernDecor() {
    const decor = createElement("div", {
        className: "challenge-modern-decor",
        attributes: { "aria-hidden": "true" }
    });

    decor.innerHTML = `
        <svg class="challenge-modern-mesh" viewBox="0 0 1200 720" fill="none">
            <g stroke="#E5E7EB" stroke-width="1.2">
                <path d="M80 120L260 90L420 210L310 340L140 300Z"></path>
                <path d="M420 210L640 160L780 280"></path>
                <path d="M310 340L520 430L780 280L900 420"></path>
                <path d="M140 300L80 470L260 520"></path>
                <path d="M520 430L480 600L680 560"></path>
                <path d="M900 420L1040 300L1120 480"></path>
            </g>
            <g fill="#D1D5DB">
                <circle cx="80" cy="120" r="4"></circle>
                <circle cx="260" cy="90" r="4"></circle>
                <circle cx="420" cy="210" r="4.5"></circle>
                <circle cx="310" cy="340" r="4"></circle>
                <circle cx="640" cy="160" r="4"></circle>
                <circle cx="480" cy="600" r="4"></circle>
                <circle cx="1040" cy="300" r="4"></circle>
            </g>
            <g fill="#EF4444">
                <circle cx="780" cy="280" r="5"></circle>
                <circle cx="520" cy="430" r="5"></circle>
                <circle cx="900" cy="420" r="4.5"></circle>
                <circle cx="260" cy="520" r="4.5"></circle>
            </g>
        </svg>
    `;

    return decor;
}

function renderModernOption(point, index) {
    const card = createElement("article", {
        className: `challenge-modern-option challenge-modern-option--${index + 1} cs-animate cs-animate-delay-${Math.min(index + 1, 3)}`
    });

    const top = createElement("div", {
        className: "challenge-modern-option-top"
    });

    top.append(createElement("span", {
        className: "challenge-modern-option-kicker",
        text: `Option ${padOptionIndex(index)}`
    }));

    if (point.icon) {
        const badge = createElement("span", {
            className: "challenge-modern-option-badge"
        });
        badge.append(icon(point.icon, "challenge-modern-option-icon"));
        top.append(badge);
    }

    card.append(top);

    if (point.title) {
        card.append(createElement("h3", {
            className: "challenge-modern-option-title",
            text: point.title
        }));
    }

    if (point.body) {
        card.append(createElement("p", {
            className: "challenge-modern-option-body",
            text: point.body
        }));
    }

    return card;
}

function renderModernImpact(data) {
    const impact = data.impact || {};

    if (!impact.label && !Array.isArray(impact.metrics)) {
        return null;
    }

    const bar = createElement("div", {
        className: "challenge-modern-impact"
    });

    const heading = createElement("div", {
        className: "challenge-modern-impact-heading"
    });

    heading.append(icon(data.core?.icon || impact.icon || "warning", "challenge-modern-impact-icon"));

    if (impact.label) {
        heading.append(createElement("span", {
            className: "challenge-modern-impact-label",
            text: impact.label
        }));
    }

    bar.append(heading);

    const metrics = Array.isArray(impact.metrics) ? impact.metrics : [];

    if (metrics.length) {
        const list = createElement("div", {
            className: "challenge-modern-metrics"
        });

        metrics.forEach((metric) => {
            const item = createElement("div", {
                className: "challenge-modern-metric"
            });

            if (metric.icon) {
                item.append(icon(metric.icon, "challenge-modern-metric-icon"));
            }

            const phrase = [metric.value, metric.label].filter(Boolean).join(" ");
            item.append(createElement("span", {
                className: "challenge-modern-metric-text",
                text: phrase
            }));

            list.append(item);
        });

        bar.append(list);
    }

    return bar;
}

function renderFrictionModern(section, data) {
    const root = createElement("section", {
        className: "cs-section challenge challenge--challenge-friction-modern cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container challenge-modern-container"
    });

    const stage = createElement("div", {
        className: "challenge-modern-stage"
    });

    stage.append(createModernDecor());

    const copy = createElement("header", {
        className: "challenge-modern-copy"
    });

    if (data.eyebrow) {
        copy.append(renderEyebrow(data.eyebrow));
    }

    if (data.title) {
        copy.append(renderAccentTitle(data.title, "cs-title challenge-modern-title"));
    }

    if (data.body) {
        copy.append(createElement("p", {
            className: "cs-body challenge-modern-body",
            text: data.body
        }));
    }

    stage.append(copy);

    const points = challengePoints(data);
    const cluster = createElement("div", {
        className: "challenge-modern-cluster"
    });

    cluster.append(createElement("div", {
        className: "challenge-modern-panel",
        attributes: { "aria-hidden": "true" }
    }));

    points.forEach((point, index) => {
        cluster.append(renderModernOption(point, index));
    });

    if (points.length) {
        stage.append(cluster);
    }

    const impact = renderModernImpact(data);
    if (impact) stage.append(impact);

    container.append(stage);
    root.append(container);
    return root;
}

function renderColoredCore(core = {}) {
    if (!core.label && !core.body) return null;

    const card = createElement("aside", {
        className: "challenge-colored-core"
    });

    if (core.icon) {
        const badge = createElement("span", {
            className: "challenge-colored-core-badge"
        });
        badge.append(icon(core.icon, "challenge-colored-core-icon"));
        card.append(badge);
    }

    const copy = createElement("div", {
        className: "challenge-colored-core-copy"
    });

    if (core.label) {
        copy.append(createElement("h3", {
            className: "challenge-colored-core-label",
            text: core.label
        }));
    }

    if (core.body) {
        copy.append(createElement("p", {
            className: "challenge-colored-core-body",
            text: core.body
        }));
    }

    card.append(copy);
    return card;
}

function renderColoredCard(point, index) {
    const card = createElement("article", {
        className: `challenge-colored-card challenge-colored-card--${index + 1} cs-animate cs-animate-delay-${Math.min(index + 1, 3)}`
    });

    card.append(createElement("span", {
        className: "challenge-colored-card-index",
        text: padOptionIndex(index)
    }));

    if (point.icon) {
        card.append(icon(point.icon, "challenge-colored-card-icon"));
    }

    if (point.title) {
        card.append(createElement("h3", {
            className: "challenge-colored-card-title",
            text: point.title
        }));
    }

    if (point.body) {
        card.append(createElement("p", {
            className: "challenge-colored-card-body",
            text: point.body
        }));
    }

    return card;
}

function renderColoredImpact(data) {
    const impact = data.impact || {};

    if (!impact.label && !impact.body && !Array.isArray(impact.metrics)) {
        return null;
    }

    const bar = createElement("div", {
        className: "challenge-colored-impact"
    });

    const lead = createElement("div", {
        className: "challenge-colored-impact-lead"
    });

    lead.append(icon("outcome", "challenge-colored-impact-icon"));

    const leadCopy = createElement("div", {
        className: "challenge-colored-impact-lead-copy"
    });

    if (impact.label) {
        leadCopy.append(createElement("span", {
            className: "challenge-colored-impact-label",
            text: impact.label
        }));
    }

    if (impact.body) {
        leadCopy.append(createElement("p", {
            className: "challenge-colored-impact-body",
            text: impact.body
        }));
    }

    lead.append(leadCopy);
    bar.append(lead);

    const metrics = Array.isArray(impact.metrics) ? impact.metrics : [];

    metrics.forEach((metric) => {
        const item = createElement("div", {
            className: "challenge-colored-metric"
        });

        if (metric.icon) {
            item.append(icon(metric.icon, "challenge-colored-metric-icon"));
        }

        const text = createElement("p", {
            className: "challenge-colored-metric-text"
        });

        if (metric.value) {
            text.append(createElement("strong", {
                className: "challenge-colored-metric-value",
                text: metric.value
            }));
        }

        if (metric.label) {
            text.append(document.createTextNode(` ${metric.label}`));
        }

        item.append(text);
        bar.append(item);
    });

    return bar;
}

function renderFrictionColored(section, data) {
    const root = createElement("section", {
        className: "cs-section challenge challenge--challenge-friction-colored cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container challenge-colored-container"
    });

    const layout = createElement("div", {
        className: "challenge-colored-layout"
    });

    const copy = createElement("div", {
        className: "challenge-colored-copy"
    });

    if (data.eyebrow) {
        copy.append(renderEyebrow(data.eyebrow));
    }

    if (data.title) {
        copy.append(renderAccentTitle(data.title, "cs-title challenge-colored-title"));
    }

    if (data.body) {
        copy.append(createElement("p", {
            className: "cs-body challenge-colored-body",
            text: data.body
        }));
    }

    const core = renderColoredCore(data.core || {});
    if (core) copy.append(core);

    layout.append(copy);

    const points = challengePoints(data);

    if (points.length) {
        const grid = createElement("div", {
            className: "challenge-colored-grid"
        });

        points.forEach((point, index) => {
            grid.append(renderColoredCard(point, index));
        });

        layout.append(grid);
    }

    container.append(layout);

    const impact = renderColoredImpact(data);
    if (impact) container.append(impact);

    root.append(container);
    return root;
}

function renderFrictionMap(section, data, caseId) {
    const root = createElement("section", {
        className: "cs-section challenge challenge--challenge-friction-base cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container challenge-map-container"
    });

    const header = createElement("header", {
        className: "challenge-map-header"
    });

    const copy = createElement("div", {
        className: "challenge-map-copy"
    });

    if (data.eyebrow) {
        copy.append(renderEyebrow(data.eyebrow));
    }

    if (data.title) {
        copy.append(createElement("h2", {
            className: "cs-title challenge-map-title",
            text: data.title
        }));
    }

    if (data.body) {
        copy.append(createElement("p", {
            className: "cs-body challenge-map-body",
            text: data.body
        }));
    }

    header.append(copy, createFrictionVisual(caseId));
    container.append(header);

    if (data.core || challengePoints(data).length) {
        container.append(renderFrictionMapRow(data));
    }

    const impact = renderFrictionImpact(data.impact || {});
    if (impact) container.append(impact);

    root.append(container);
    return root;
}

export default {

    render(section, context = {}) {
        const data = section.data || {};
        const variant = resolveVariant(section.variant);
        const caseId = context.caseId || "";

        if (variant === "challenge-friction-base") {
            return renderFrictionMap(section, data, caseId);
        }

        if (variant === "challenge-friction-modern") {
            return renderFrictionModern(section, data);
        }

        if (variant === "challenge-friction-colored") {
            return renderFrictionColored(section, data);
        }

        return renderChallengeSimple(section, data);
    }

};
