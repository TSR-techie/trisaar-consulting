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

function renderFrictionMap(section, data, caseId) {
    const root = createElement("section", {
        className: "cs-section challenge challenge--challenge-frictionMap cs-animate",
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

        if (variant === "challenge-frictionMap") {
            return renderFrictionMap(section, data, caseId);
        }

        return renderChallengeSimple(section, data);
    }

};
