import { createElement } from "../../js/utils.js";
import { icon } from "../../js/icons.js";

const DEFAULT_VARIANT = "impact-simple";

function resolveVariant(variant) {
    if (!variant || variant === "default" || variant === "strip") {
        return DEFAULT_VARIANT;
    }

    return variant;
}

function renderHighlightTitle(title, highlight, className) {
    const heading = createElement("h2", { className });
    const text = String(title || "");
    const mark = String(highlight || "").trim();

    if (mark && text.includes(mark)) {
        const index = text.indexOf(mark);
        heading.append(document.createTextNode(text.slice(0, index)));
        heading.append(createElement("span", {
            className: "impact-title-accent",
            text: mark
        }));
        heading.append(document.createTextNode(text.slice(index + mark.length)));
        return heading;
    }

    return renderAccentTitle(title, className);
}

function renderAccentTitle(title, className) {
    const heading = createElement("h2", { className });
    const text = String(title || "");

    if (text.endsWith(".")) {
        heading.append(document.createTextNode(text.slice(0, -1)));
        heading.append(createElement("span", {
            className: "impact-title-accent",
            text: "."
        }));
        return heading;
    }

    heading.textContent = text;
    return heading;
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

function renderScorecardCard(metric, index) {
    const card = createElement("article", {
        className: `impact-score-card cs-animate cs-animate-delay-${Math.min(index + 1, 3)}`
    });

    if (metric.icon) {
        const badge = createElement("span", {
            className: "impact-score-card-badge"
        });
        badge.append(icon(metric.icon, "impact-score-card-icon"));
        card.append(badge);
    }

    if (metric.value) {
        card.append(createElement("h3", {
            className: "impact-score-card-title",
            text: metric.value
        }));
    }

    if (metric.note) {
        card.append(createElement("p", {
            className: "impact-score-card-body",
            text: metric.note
        }));
    }

    if (metric.tag?.text) {
        const tag = createElement("div", {
            className: "impact-score-card-tag"
        });

        if (metric.tag.icon) {
            tag.append(icon(metric.tag.icon, "impact-score-card-tag-icon"));
        }

        tag.append(createElement("span", {
            text: metric.tag.text
        }));

        card.append(tag);
    }

    return card;
}

function renderImpactScorecard(section, data) {
    const root = createElement("section", {
        className: "cs-section impact impact--impact-scorecard cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container impact-score-container"
    });

    const header = createElement("header", {
        className: "impact-score-header"
    });

    if (data.eyebrow) {
        header.append(createElement("span", {
            className: "cs-eyebrow",
            text: data.eyebrow
        }));
    }

    if (data.title) {
        header.append(renderAccentTitle(data.title, "cs-title impact-score-title"));
    }

    if (data.intro) {
        header.append(createElement("p", {
            className: "cs-body impact-score-intro",
            text: data.intro
        }));
    }

    container.append(header);

    if (Array.isArray(data.metrics) && data.metrics.length) {
        const grid = createElement("div", {
            className: "impact-score-grid"
        });

        data.metrics.forEach((metric, index) => {
            grid.append(renderScorecardCard(metric, index));
        });

        container.append(grid);
    }

    if (data.summary?.text) {
        const summary = createElement("div", {
            className: "impact-score-summary"
        });

        if (data.summary.icon) {
            const badge = createElement("span", {
                className: "impact-score-summary-badge"
            });
            badge.append(icon(data.summary.icon, "impact-score-summary-icon"));
            summary.append(badge);
        }

        summary.append(createElement("p", {
            className: "impact-score-summary-text",
            text: data.summary.text
        }));

        container.append(summary);
    }

    root.append(container);
    return root;
}

const ORBIT_COLORS = ["#EF4444", "#7C3AED", "#14B8A6", "#3B82F6"];

function polarPoint(cx, cy, radius, deg) {
    const angle = (deg - 90) * (Math.PI / 180);
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

function donutSlice(cx, cy, inner, outer, start, end) {
    const large = end - start > 180 ? 1 : 0;
    const [x0, y0] = polarPoint(cx, cy, outer, start);
    const [x1, y1] = polarPoint(cx, cy, outer, end);
    const [x2, y2] = polarPoint(cx, cy, inner, end);
    const [x3, y3] = polarPoint(cx, cy, inner, start);

    return `M ${x0} ${y0} A ${outer} ${outer} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${inner} ${inner} 0 ${large} 0 ${x3} ${y3} Z`;
}

function orbitFlag(source = {}, key, fallback) {
    if (source[key] === undefined) return fallback;
    return Boolean(source[key]);
}

function orbitMetrics(metrics = []) {
    const selected = metrics.filter((metric) => metric.orbit === true);

    if (selected.length) return selected;
    return metrics.filter((metric) => Number(metric.weight) > 0);
}

function orbitSlices(metrics = []) {
    const items = orbitMetrics(metrics);
    const source = items.length ? items : metrics.slice(0, 3);
    const weights = source.map((metric) => {
        const value = Number(metric.weight);
        return Number.isFinite(value) && value > 0 ? value : 1;
    });
    const total = weights.reduce((sum, value) => sum + value, 0) || source.length;
    const gap = Math.min(2.6, 10 / Math.max(source.length, 1));
    let cursor = 0;

    return source.map((metric, index) => {
        const span = (weights[index] / total) * 360;
        const start = cursor + gap / 2;
        const end = cursor + span - gap / 2;
        cursor += span;

        return {
            metric,
            index,
            start,
            end: Math.max(end, start + 1),
            mid: cursor - span / 2,
            percent: Math.round((weights[index] / total) * 100)
        };
    });
}

function renderOrbitGlance(data) {
    const glance = data.glance || {};
    const items = Array.isArray(glance.items) ? glance.items : [];

    if (!glance.label && !items.length) return null;

    const card = createElement("aside", {
        className: "impact-orbit-glance"
    });

    if (glance.label) {
        card.append(createElement("span", {
            className: "impact-orbit-glance-label",
            text: glance.label
        }));
    }

    if (items.length) {
        const list = createElement("ul", {
            className: "impact-orbit-glance-list"
        });

        items.forEach((item) => {
            const row = createElement("li", {
                className: "impact-orbit-glance-item"
            });

            if (item.icon) {
                row.append(icon(item.icon, "impact-orbit-glance-icon"));
            }

            row.append(createElement("span", {
                text: item.text || item.title || item.body || ""
            }));

            list.append(row);
        });

        card.append(list);
    }

    return card;
}

function renderOrbitWheel(data) {
    const orbit = data.orbit || {};
    const slices = orbitSlices(data.metrics || []);
    const wrap = createElement("div", {
        className: "impact-orbit-wheel"
    });

    const paths = slices.map((slice) => {
        const color = ORBIT_COLORS[slice.index % ORBIT_COLORS.length];
        return `<path d="${donutSlice(100, 100, 46, 96, slice.start, slice.end)}" fill="${color}"></path>`;
    }).join("");

    wrap.innerHTML = `
        <svg class="impact-orbit-wheel-svg" viewBox="0 0 200 200" aria-hidden="true">${paths}</svg>
    `;

    slices.forEach((slice) => {
        const metric = slice.metric || {};
        const showKpi = orbitFlag(metric, "showKpi", orbitFlag(orbit, "showKpi", false));
        const showPercent = orbitFlag(metric, "showPercent", orbitFlag(orbit, "showPercent", false));
        const labeled = (showKpi && Boolean(metric.value)) || showPercent;
        const [x, y] = polarPoint(100, 100, labeled ? 73 : 71, slice.mid);
        const marker = createElement("div", {
            className: `impact-orbit-marker impact-orbit-marker--${slice.index + 1}${labeled ? " impact-orbit-marker--labeled" : ""}`
        });
        marker.style.left = `${(x / 200) * 100}%`;
        marker.style.top = `${(y / 200) * 100}%`;

        if (metric.icon) {
            const badge = createElement("span", {
                className: "impact-orbit-marker-badge"
            });
            badge.append(icon(metric.icon, "impact-orbit-marker-icon"));
            marker.append(badge);
        }

        if (showKpi && metric.value) {
            marker.append(createElement("strong", {
                className: "impact-orbit-marker-kpi",
                text: metric.value
            }));
        }

        if (showPercent) {
            marker.append(createElement("span", {
                className: "impact-orbit-marker-percent",
                text: `${slice.percent}%`
            }));
        }

        wrap.append(marker);
    });

    const core = createElement("div", {
        className: "impact-orbit-core"
    });

    core.append(icon(orbit.icon || "outcome", "impact-orbit-core-icon"));

    if (orbit.label) {
        core.append(createElement("span", {
            className: "impact-orbit-core-label",
            text: orbit.label
        }));
    }

    if (orbit.body) {
        core.append(createElement("p", {
            className: "impact-orbit-core-body",
            text: orbit.body
        }));
    }

    wrap.append(core);
    return wrap;
}

function renderOrbitCard(slice) {
    const metric = slice.metric || {};
    const card = createElement("article", {
        className: `impact-orbit-card impact-orbit-card--${slice.index + 1} cs-animate cs-animate-delay-${Math.min(slice.index + 1, 3)}`
    });

    if (metric.icon) {
        const badge = createElement("span", {
            className: "impact-orbit-card-badge"
        });
        badge.append(icon(metric.icon, "impact-orbit-card-icon"));
        card.append(badge);
    }

    const copy = createElement("div", {
        className: "impact-orbit-card-copy"
    });

    if (metric.value) {
        copy.append(createElement("h3", {
            className: "impact-orbit-card-title",
            text: metric.value
        }));
    }

    if (metric.note) {
        copy.append(createElement("p", {
            className: "impact-orbit-card-body",
            text: metric.note
        }));
    }

    card.append(copy);
    return card;
}

function renderOrbitKpis(kpis = []) {
    if (!kpis.length) return null;

    const bar = createElement("div", {
        className: "impact-orbit-kpis"
    });

    kpis.forEach((kpi) => {
        const item = createElement("div", {
            className: "impact-orbit-kpi"
        });

        if (kpi.icon) {
            item.append(icon(kpi.icon, "impact-orbit-kpi-icon"));
        }

        const copy = createElement("div", {
            className: "impact-orbit-kpi-copy"
        });

        if (kpi.value) {
            copy.append(createElement("strong", {
                className: "impact-orbit-kpi-value",
                text: kpi.value
            }));
        }

        if (kpi.label) {
            copy.append(createElement("span", {
                className: "impact-orbit-kpi-label",
                text: kpi.label
            }));
        }

        item.append(copy);
        bar.append(item);
    });

    return bar;
}

function renderImpactOrbit(section, data) {
    const slices = orbitSlices(data.metrics || []);
    const root = createElement("section", {
        className: "cs-section impact impact--impact-value-orbit cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container impact-orbit-container"
    });

    const stage = createElement("div", {
        className: "impact-orbit-stage"
    });

    const copy = createElement("div", {
        className: "impact-orbit-copy"
    });

    if (data.eyebrow) {
        copy.append(createElement("span", {
            className: "cs-eyebrow",
            text: data.eyebrow
        }));
    }

    if (data.title) {
        copy.append(renderAccentTitle(data.title, "cs-title impact-orbit-title"));
    }

    if (data.intro) {
        copy.append(createElement("p", {
            className: "cs-body impact-orbit-intro",
            text: data.intro
        }));
    }

    const glance = renderOrbitGlance(data);
    if (glance) copy.append(glance);

    stage.append(copy, renderOrbitWheel(data));

    if (slices.length) {
        const cards = createElement("div", {
            className: "impact-orbit-cards"
        });

        slices.forEach((slice) => {
            cards.append(renderOrbitCard(slice));
        });

        stage.append(cards);
    }

    container.append(stage);

    const kpis = renderOrbitKpis(Array.isArray(data.kpis) ? data.kpis : []);
    if (kpis) container.append(kpis);

    if (data.summary?.text) {
        const quote = createElement("figure", {
            className: "impact-orbit-quote"
        });

        quote.append(createElement("span", {
            className: "impact-orbit-quote-mark",
            text: "“",
            attributes: { "aria-hidden": "true" }
        }));
        quote.append(createElement("span", {
            className: "impact-orbit-quote-rule",
            attributes: { "aria-hidden": "true" }
        }));
        quote.append(createElement("blockquote", {
            className: "impact-orbit-quote-text",
            text: data.summary.text
        }));
        quote.append(createElement("span", {
            className: "impact-orbit-quote-mark",
            text: "”",
            attributes: { "aria-hidden": "true" }
        }));

        container.append(quote);
    }

    root.append(container);
    return root;
}

const BRIDGE_SLOTS = ["top", "start", "end"];
const BRIDGE_COLORS = {
    top: "#EF4444",
    start: "#7C3AED",
    end: "#14B8A6"
};

function bridgeCards(metrics = []) {
    const selected = orbitMetrics(metrics);
    const source = (selected.length ? selected : metrics.slice(0, 3)).slice(0, 3);
    const used = new Set();

    return BRIDGE_SLOTS.map((slot, index) => {
        const match = source.find((metric, metricIndex) => {
            if (used.has(metricIndex)) return false;
            return metric.bridgeSlot === slot;
        });

        if (match) {
            used.add(source.indexOf(match));
            return { metric: match, slot };
        }

        const fallbackIndex = source.findIndex((_, metricIndex) => !used.has(metricIndex));
        if (fallbackIndex < 0) return { metric: source[index] || {}, slot };
        used.add(fallbackIndex);
        return { metric: source[fallbackIndex], slot };
    }).filter((item) => item.metric);
}

function renderBridgeGlance(data) {
    const glance = data.glance || {};
    const items = Array.isArray(glance.items) ? glance.items : [];

    if (!glance.label && !items.length) return null;

    const card = createElement("aside", {
        className: "impact-bridge-glance"
    });
    const heading = createElement("div", {
        className: "impact-bridge-glance-heading"
    });

    heading.append(icon(glance.icon || "outcome", "impact-bridge-glance-icon"));
    heading.append(createElement("span", {
        className: "impact-bridge-glance-label",
        text: glance.label || "The Impact"
    }));
    card.append(heading);

    if (items.length) {
        const list = createElement("ul", {
            className: "impact-bridge-glance-list"
        });

        items.forEach((item) => {
            const row = createElement("li", {
                className: "impact-bridge-glance-item"
            });

            if (item.icon) {
                row.append(icon(item.icon, "impact-bridge-glance-icon"));
            }

            const copy = createElement("div", {
                className: "impact-bridge-glance-copy"
            });

            if (item.title) {
                copy.append(createElement("strong", {
                    className: "impact-bridge-glance-title",
                    text: item.title
                }));
            }

            copy.append(createElement("span", {
                className: "impact-bridge-glance-text",
                text: item.body || item.text || ""
            }));

            row.append(copy);
            list.append(row);
        });

        card.append(list);
    }

    return card;
}

function renderBridgeCard(item) {
    const metric = item.metric || {};
    const card = createElement("article", {
        className: `impact-bridge-card impact-bridge-card--${item.slot}`
    });
    card.style.setProperty("--bridge-accent", BRIDGE_COLORS[item.slot] || BRIDGE_COLORS.top);

    if (metric.icon) {
        const badge = createElement("span", {
            className: "impact-bridge-card-badge"
        });
        badge.append(icon(metric.icon, "impact-bridge-card-icon"));
        card.append(badge);
    }

    const copy = createElement("div", {
        className: "impact-bridge-card-copy"
    });

    if (metric.value) {
        copy.append(createElement("h3", {
            className: "impact-bridge-card-title",
            text: metric.value
        }));
    }

    if (metric.note) {
        copy.append(createElement("p", {
            className: "impact-bridge-card-body",
            text: metric.note
        }));
    }

    card.append(copy);
    return card;
}

function renderBridgeHub(orbit = {}) {
    const hub = createElement("div", {
        className: "impact-bridge-hub"
    });
    const label = String(orbit.label || "Business Impact").trim();
    const parts = label.split(/\s+/);
    const kicker = createElement("span", {
        className: "impact-bridge-hub-kicker",
        text: parts.length > 1 ? parts.slice(0, -1).join(" ") : ""
    });
    const word = createElement("strong", {
        className: "impact-bridge-hub-word",
        text: parts.at(-1) || label
    });

    hub.append(kicker, word);
    hub.append(createElement("p", {
        className: "impact-bridge-hub-body",
        text: orbit.tagline || orbit.body || ""
    }));

    return hub;
}

function renderImpactBridge(section, data) {
    const orbit = data.orbit || {};
    const bridge = data.bridge || {};
    const cards = bridgeCards(data.metrics || []);
    const uid = `bridge-${section.id || "impact"}`;
    const root = createElement("section", {
        className: "cs-section impact impact--impact-bridge cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container impact-bridge-container"
    });

    const stage = createElement("div", {
        className: "impact-bridge-stage"
    });

    const copy = createElement("div", {
        className: "impact-bridge-copy"
    });

    if (data.eyebrow) {
        copy.append(createElement("span", {
            className: "cs-eyebrow",
            text: data.eyebrow
        }));
    }

    if (data.title) {
        copy.append(renderHighlightTitle(data.title, data.titleHighlight, "cs-title impact-bridge-title"));
    }

    if (data.intro) {
        copy.append(createElement("p", {
            className: "cs-body impact-bridge-intro",
            text: data.intro
        }));
    }

    const glance = renderBridgeGlance(data);
    if (glance) copy.append(glance);

    const scene = createElement("div", {
        className: "impact-bridge-scene"
    });

    scene.innerHTML = `
        <svg class="impact-bridge-arms" viewBox="0 0 400 400" aria-hidden="true">
            <defs>
                <linearGradient id="${uid}-red" x1="200" y1="200" x2="200" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#EF4444" stop-opacity="0.12"></stop>
                    <stop offset="100%" stop-color="#EF4444"></stop>
                </linearGradient>
                <linearGradient id="${uid}-purple" x1="200" y1="200" x2="70" y2="350" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.12"></stop>
                    <stop offset="100%" stop-color="#7C3AED"></stop>
                </linearGradient>
                <linearGradient id="${uid}-teal" x1="200" y1="200" x2="330" y2="350" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.12"></stop>
                    <stop offset="100%" stop-color="#14B8A6"></stop>
                </linearGradient>
            </defs>
            <path d="M200 188 C 200 120 200 70 200 42" fill="none" stroke="url(#${uid}-red)" stroke-width="26" stroke-linecap="round"></path>
            <path d="M188 214 C 130 250 90 300 78 348" fill="none" stroke="url(#${uid}-purple)" stroke-width="26" stroke-linecap="round"></path>
            <path d="M212 214 C 270 250 310 300 322 348" fill="none" stroke="url(#${uid}-teal)" stroke-width="26" stroke-linecap="round"></path>
            <circle cx="200" cy="42" r="7" fill="#fff" stroke="#EF4444" stroke-width="2.5"></circle>
            <circle cx="78" cy="348" r="7" fill="#fff" stroke="#7C3AED" stroke-width="2.5"></circle>
            <circle cx="322" cy="348" r="7" fill="#fff" stroke="#14B8A6" stroke-width="2.5"></circle>
            <path d="M248 188 C 290 170 318 150 338 128" fill="none" stroke="#CBD5E1" stroke-width="1.4" stroke-dasharray="3 4"></path>
        </svg>
    `;

    scene.append(renderBridgeHub(orbit));

    cards.forEach((item) => {
        scene.append(renderBridgeCard(item));
    });

    if (bridge.quote) {
        scene.append(createElement("p", {
            className: "impact-bridge-quote",
            text: bridge.quote
        }));
    }

    stage.append(copy, scene);
    container.append(stage);

    const kpis = renderOrbitKpis(Array.isArray(data.kpis) ? data.kpis : []);
    if (kpis) {
        kpis.classList.add("impact-bridge-kpis");
        container.append(kpis);
    }

    if (data.summary?.text) {
        const footer = createElement("div", {
            className: "impact-bridge-footer"
        });
        footer.append(
            createElement("span", {
                className: "impact-bridge-footer-rule",
                attributes: { "aria-hidden": "true" }
            }),
            createElement("p", {
                className: "impact-bridge-footer-text",
                text: data.summary.text
            }),
            createElement("span", {
                className: "impact-bridge-footer-rule",
                attributes: { "aria-hidden": "true" }
            })
        );
        container.append(footer);
    }

    root.append(container);
    return root;
}

export default {

    render(section) {
        const data = section.data || {};
        const variant = resolveVariant(section.variant);

        if (variant === "impact-scorecard") {
            return renderImpactScorecard(section, data);
        }

        if (variant === "impact-value-orbit") {
            return renderImpactOrbit(section, data);
        }

        if (variant === "impact-bridge") {
            return renderImpactBridge(section, data);
        }

        return renderImpactSimple(section, data);
    }

};
