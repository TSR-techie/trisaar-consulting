import { createElement } from "../../js/utils.js";
import { icon } from "../../js/icons.js";

const DEFAULT_VARIANT = "solution-simple";

function resolveVariant(variant) {
    if (!variant || variant === "default" || variant === "numbered") {
        return DEFAULT_VARIANT;
    }

    return variant;
}

function padIndex(index) {
    return String(index + 1).padStart(2, "0");
}

function asTextList(items = []) {
    return items.map((item) => {
        if (typeof item === "string") return item;
        return item.text || item.title || item.body || "";
    }).filter(Boolean);
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
                    text: padIndex(index)
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

function renderPathOutcome(outcome = {}) {
    const items = asTextList(outcome.items || outcome.points || []);

    if (!outcome.label && !items.length) return null;

    const box = createElement("aside", {
        className: "solution-path-outcome"
    });

    const heading = createElement("div", {
        className: "solution-path-outcome-heading"
    });

    heading.append(icon(outcome.icon || "outcome", "solution-path-outcome-icon"));

    if (outcome.label) {
        heading.append(createElement("span", {
            className: "solution-path-outcome-label",
            text: outcome.label
        }));
    }

    box.append(heading);

    if (items.length) {
        const list = createElement("ul", {
            className: "solution-path-outcome-list"
        });

        items.forEach((item) => {
            const row = createElement("li", {
                className: "solution-path-outcome-item"
            });
            row.append(icon("check", "solution-path-outcome-check"));
            row.append(createElement("span", { text: item }));
            list.append(row);
        });

        box.append(list);
    }

    return box;
}

function renderPathStep(step, index, total) {
    const wrap = createElement("div", {
        className: "solution-path-step-wrap"
    });

    const card = createElement("article", {
        className: `solution-path-step cs-animate cs-animate-delay-${Math.min(index + 1, 3)}`
    });

    card.append(createElement("span", {
        className: "solution-path-step-number",
        text: padIndex(index)
    }));

    if (step.icon) {
        card.append(icon(step.icon, "solution-path-step-icon"));
    }

    if (step.title) {
        card.append(createElement("h3", {
            className: "solution-path-step-title",
            text: step.title
        }));
    }

    if (step.body) {
        card.append(createElement("p", {
            className: "solution-path-step-body",
            text: step.body
        }));
    }

    const points = asTextList(step.points || []);

    if (points.length) {
        const list = createElement("ul", {
            className: "solution-path-step-points"
        });

        points.forEach((point) => {
            list.append(createElement("li", { text: point }));
        });

        card.append(list);
    }

    wrap.append(card);

    if (index < total - 1) {
        wrap.append(icon("chevron-right", "solution-path-arrow"));
    }

    return wrap;
}

function renderPathEnablers(enablers = {}) {
    const items = Array.isArray(enablers.items) ? enablers.items : [];

    if (!enablers.label && !items.length) return null;

    const bar = createElement("div", {
        className: "solution-path-enablers"
    });

    const heading = createElement("div", {
        className: "solution-path-enablers-heading"
    });

    heading.append(icon(enablers.icon || "gear", "solution-path-enablers-icon"));

    const copy = createElement("div", {
        className: "solution-path-enablers-copy"
    });

    if (enablers.label) {
        copy.append(createElement("span", {
            className: "solution-path-enablers-label",
            text: enablers.label
        }));
    }

    if (enablers.intro) {
        copy.append(createElement("span", {
            className: "solution-path-enablers-intro",
            text: enablers.intro
        }));
    }

    heading.append(copy);
    bar.append(heading);

    if (items.length) {
        const list = createElement("div", {
            className: "solution-path-enablers-list"
        });

        items.forEach((item) => {
            const chip = createElement("div", {
                className: "solution-path-enabler"
            });

            if (item.icon) {
                chip.append(icon(item.icon, "solution-path-enabler-icon"));
            }

            const text = createElement("div", {
                className: "solution-path-enabler-text"
            });

            if (item.title) {
                text.append(createElement("strong", {
                    className: "solution-path-enabler-title",
                    text: item.title
                }));
            }

            if (item.body) {
                text.append(createElement("span", {
                    className: "solution-path-enabler-body",
                    text: item.body
                }));
            }

            chip.append(text);
            list.append(chip);
        });

        bar.append(list);
    }

    return bar;
}

function renderDecisionPath(section, data) {
    const root = createElement("section", {
        className: "cs-section solution solution--solution-decision-path cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container solution-path-container"
    });

    const header = createElement("header", {
        className: "solution-path-header"
    });

    const copy = createElement("div", {
        className: "solution-path-copy"
    });

    if (data.eyebrow) {
        copy.append(createElement("span", {
            className: "cs-eyebrow",
            text: data.eyebrow
        }));
    }

    if (data.title) {
        copy.append(createElement("h2", {
            className: "cs-title solution-path-title",
            text: data.title
        }));
    }

    if (data.intro) {
        copy.append(createElement("p", {
            className: "cs-body solution-path-intro",
            text: data.intro
        }));
    }

    header.append(copy);

    const outcome = renderPathOutcome(data.outcome || {});
    if (outcome) header.append(outcome);

    container.append(header);

    const steps = Array.isArray(data.steps) ? data.steps : [];

    if (steps.length) {
        const flow = createElement("div", {
            className: "solution-path-flow"
        });

        steps.forEach((step, index) => {
            flow.append(renderPathStep(step, index, steps.length));
        });

        container.append(flow);
    }

    const enablers = renderPathEnablers(data.enablers || {});
    if (enablers) container.append(enablers);

    root.append(container);
    return root;
}

function renderAccentTitle(title, className) {
    const heading = createElement("h2", { className });
    const parts = String(title || "").split(/(?<=\.)\s+/).filter(Boolean);

    if (parts.length < 2) {
        heading.textContent = title || "";
        return heading;
    }

    heading.append(document.createTextNode(`${parts[0]} `));
    heading.append(createElement("span", {
        className: "solution-title-accent",
        text: parts.slice(1).join(" ")
    }));

    return heading;
}

function renderHubDiagram(data) {
    const steps = (Array.isArray(data.steps) ? data.steps : []).slice(0, 4);
    const hub = data.hub || {};

    const orbit = createElement("div", {
        className: "solution-hub-orbit",
        attributes: { "aria-hidden": "true" }
    });

    orbit.append(createElement("div", {
        className: "solution-hub-ring"
    }));

    steps.forEach((step, index) => {
        const petal = createElement("div", {
            className: `solution-hub-petal solution-hub-petal--${index + 1}`
        });

        if (step.icon) {
            petal.append(icon(step.icon, "solution-hub-petal-icon"));
        }

        orbit.append(petal);
    });

    const core = createElement("div", {
        className: "solution-hub-core"
    });

    core.append(icon(hub.icon || "puzzle", "solution-hub-core-icon"));

    if (hub.label) {
        core.append(createElement("span", {
            className: "solution-hub-core-label",
            text: hub.label
        }));
    }

    if (hub.body) {
        core.append(createElement("p", {
            className: "solution-hub-core-body",
            text: hub.body
        }));
    }

    orbit.append(core);
    return orbit;
}

function renderHubStep(step, index, total) {
    const row = createElement("div", {
        className: `solution-hub-step cs-animate cs-animate-delay-${Math.min(index + 1, 3)}`
    });

    const rail = createElement("div", {
        className: "solution-hub-step-rail"
    });

    rail.append(createElement("span", {
        className: "solution-hub-step-number",
        text: padIndex(index)
    }));

    if (index < total - 1) {
        rail.append(createElement("span", {
            className: "solution-hub-step-line",
            attributes: { "aria-hidden": "true" }
        }));
    }

    const card = createElement("article", {
        className: "solution-hub-card"
    });

    const copy = createElement("div", {
        className: "solution-hub-card-copy"
    });

    if (step.title) {
        copy.append(createElement("h3", {
            className: "solution-hub-card-title",
            text: step.title
        }));
    }

    if (step.body) {
        copy.append(createElement("p", {
            className: "solution-hub-card-body",
            text: step.body
        }));
    }

    card.append(copy);

    const panel = createElement("div", {
        className: "solution-hub-card-panel"
    });

    if (step.icon) {
        panel.append(icon(step.icon, "solution-hub-card-icon"));
    }

    const points = asTextList(step.points || []);

    if (points.length) {
        const list = createElement("ul", {
            className: "solution-hub-card-points"
        });

        points.forEach((point) => {
            list.append(createElement("li", { text: point }));
        });

        panel.append(list);
    }

    if (step.icon || points.length) {
        card.append(panel);
    }

    row.append(rail, card);
    return row;
}

function renderHubEnablers(enablers = {}) {
    const items = Array.isArray(enablers.items) ? enablers.items : [];

    if (!enablers.label && !items.length) return null;

    const bar = createElement("div", {
        className: "solution-hub-enablers"
    });

    const heading = createElement("div", {
        className: "solution-hub-enablers-heading"
    });

    const badge = createElement("span", {
        className: "solution-hub-enablers-badge"
    });
    badge.append(icon("star", "solution-hub-enablers-icon"));
    heading.append(badge);

    const copy = createElement("div", {
        className: "solution-hub-enablers-copy"
    });

    if (enablers.label) {
        copy.append(createElement("span", {
            className: "solution-hub-enablers-label",
            text: enablers.label
        }));
    }

    if (enablers.intro) {
        copy.append(createElement("span", {
            className: "solution-hub-enablers-intro",
            text: enablers.intro
        }));
    }

    heading.append(copy);
    bar.append(heading);

    if (items.length) {
        const list = createElement("div", {
            className: "solution-hub-enablers-list"
        });

        items.forEach((item) => {
            const chip = createElement("div", {
                className: "solution-hub-enabler"
            });

            if (item.icon) {
                chip.append(icon(item.icon, "solution-hub-enabler-icon"));
            }

            const text = createElement("div", {
                className: "solution-hub-enabler-text"
            });

            if (item.title) {
                text.append(createElement("strong", {
                    className: "solution-hub-enabler-title",
                    text: item.title
                }));
            }

            if (item.body) {
                text.append(createElement("span", {
                    className: "solution-hub-enabler-body",
                    text: item.body
                }));
            }

            chip.append(text);
            list.append(chip);
        });

        bar.append(list);
    }

    return bar;
}

function renderControlHub(section, data) {
    const root = createElement("section", {
        className: "cs-section solution solution--solution-control-hub cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container solution-hub-container"
    });

    const layout = createElement("div", {
        className: "solution-hub-layout"
    });

    const intro = createElement("div", {
        className: "solution-hub-intro"
    });

    if (data.eyebrow) {
        intro.append(createElement("span", {
            className: "cs-eyebrow",
            text: data.eyebrow
        }));
    }

    if (data.title) {
        intro.append(renderAccentTitle(data.title, "cs-title solution-hub-title"));
    }

    if (data.intro) {
        intro.append(createElement("p", {
            className: "cs-body solution-hub-body",
            text: data.intro
        }));
    }

    intro.append(renderHubDiagram(data));
    layout.append(intro);

    const steps = Array.isArray(data.steps) ? data.steps : [];

    if (steps.length) {
        const rail = createElement("div", {
            className: "solution-hub-rail"
        });

        steps.forEach((step, index) => {
            rail.append(renderHubStep(step, index, steps.length));
        });

        layout.append(rail);
    }

    container.append(layout);

    const enablers = renderHubEnablers(data.enablers || {});
    if (enablers) container.append(enablers);

    root.append(container);
    return root;
}

const ENGINE_COLORS = ["#EF4444", "#F59E0B", "#14B8A6", "#3B82F6"];

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

function outcomeEntries(outcome = {}) {
    return (outcome.items || []).map((item) => {
        if (typeof item === "string") {
            return { title: item };
        }

        return {
            icon: item.icon,
            title: item.title || item.text || item.value || "",
            body: item.body || ""
        };
    }).filter((item) => item.title || item.body);
}

function renderEngineOutcome(outcome = {}) {
    const items = outcomeEntries(outcome);

    if (!outcome.label && !items.length) return null;

    const box = createElement("aside", {
        className: "solution-engine-outcome"
    });

    const heading = createElement("div", {
        className: "solution-engine-outcome-heading"
    });

    heading.append(icon(outcome.icon || "outcome", "solution-engine-outcome-icon"));

    if (outcome.label) {
        heading.append(createElement("span", {
            className: "solution-engine-outcome-label",
            text: outcome.label
        }));
    }

    box.append(heading);

    items.forEach((item) => {
        const row = createElement("div", {
            className: "solution-engine-outcome-item"
        });

        row.append(icon(item.icon || "check", "solution-engine-outcome-item-icon"));

        const copy = createElement("div", {
            className: "solution-engine-outcome-copy"
        });

        if (item.title) {
            copy.append(createElement("strong", {
                className: "solution-engine-outcome-title",
                text: item.title
            }));
        }

        if (item.body) {
            copy.append(createElement("span", {
                className: "solution-engine-outcome-body",
                text: item.body
            }));
        }

        row.append(copy);
        box.append(row);
    });

    return box;
}

function stepShares(steps = []) {
    const weights = steps.map((step) => {
        const value = Number(step.weight);
        return Number.isFinite(value) && value > 0 ? value : 1;
    });
    const total = weights.reduce((sum, value) => sum + value, 0) || steps.length;
    return weights.map((value) => value / total);
}

function engineSlices(steps = []) {
    const shares = stepShares(steps);
    const gap = Math.min(2.8, 12 / Math.max(steps.length, 1));
    let cursor = 0;

    return shares.map((share, index) => {
        const span = share * 360;
        const start = cursor + gap / 2;
        const end = cursor + span - gap / 2;
        cursor += span;

        return {
            index,
            start,
            end: Math.max(end, start + 1),
            mid: cursor - span / 2
        };
    });
}

function renderEngineWheel(data) {
    const steps = Array.isArray(data.steps) ? data.steps : [];
    const hub = data.hub || {};
    const wrap = createElement("div", {
        className: "solution-engine-wheel"
    });

    const slices = engineSlices(steps);
    const paths = slices.map((slice) => {
        const color = ENGINE_COLORS[slice.index % ENGINE_COLORS.length];
        return `<path d="${donutSlice(100, 100, 48, 99, slice.start, slice.end)}" fill="${color}"></path>`;
    }).join("");

    wrap.innerHTML = `
        <svg class="solution-engine-wheel-svg" viewBox="0 0 200 200" aria-hidden="true">
            ${paths}
        </svg>
    `;

    slices.forEach((slice) => {
        const step = steps[slice.index] || {};
        const marker = createElement("div", {
            className: `solution-engine-marker solution-engine-marker--${slice.index + 1}`
        });

        marker.style.setProperty("--mid", `${slice.mid}deg`);

        marker.append(createElement("span", {
            className: "solution-engine-marker-index",
            text: padIndex(slice.index)
        }));

        if (step.icon) {
            marker.append(icon(step.icon, "solution-engine-marker-icon"));
        }

        wrap.append(marker);
    });

    const core = createElement("div", {
        className: "solution-engine-core"
    });

    core.append(icon(hub.icon === "puzzle" ? "circuit" : (hub.icon || "circuit"), "solution-engine-core-icon"));

    if (hub.label) {
        core.append(createElement("span", {
            className: "solution-engine-core-label",
            text: hub.label
        }));
    }

    if (hub.body) {
        core.append(createElement("p", {
            className: "solution-engine-core-body",
            text: hub.body
        }));
    }

    wrap.append(core);
    return wrap;
}

function renderEngineCallout(step, index) {
    const card = createElement("article", {
        className: `solution-engine-callout solution-engine-callout--${index + 1} cs-animate cs-animate-delay-${Math.min(index + 1, 3)}`
    });

    card.append(createElement("span", {
        className: "solution-engine-callout-index",
        text: padIndex(index)
    }));

    const copy = createElement("div", {
        className: "solution-engine-callout-copy"
    });

    if (step.title) {
        copy.append(createElement("h3", {
            className: "solution-engine-callout-title",
            text: step.title
        }));
    }

    if (step.body) {
        copy.append(createElement("p", {
            className: "solution-engine-callout-body",
            text: step.body
        }));
    }

    const points = asTextList(step.points || []);

    if (points.length) {
        const list = createElement("ul", {
            className: "solution-engine-callout-points"
        });

        points.forEach((point) => {
            list.append(createElement("li", { text: point }));
        });

        copy.append(list);
    }

    card.append(copy);
    return card;
}

function renderEngineEnablers(enablers = {}) {
    const items = Array.isArray(enablers.items) ? enablers.items : [];

    if (!enablers.label && !items.length) return null;

    const bar = createElement("div", {
        className: "solution-engine-enablers"
    });

    const heading = createElement("div", {
        className: "solution-engine-enablers-heading"
    });

    heading.append(icon(enablers.icon || "gear", "solution-engine-enablers-icon"));

    const copy = createElement("div", {
        className: "solution-engine-enablers-copy"
    });

    if (enablers.label) {
        copy.append(createElement("span", {
            className: "solution-engine-enablers-label",
            text: enablers.label
        }));
    }

    if (enablers.intro) {
        copy.append(createElement("span", {
            className: "solution-engine-enablers-intro",
            text: enablers.intro
        }));
    }

    heading.append(copy);
    bar.append(heading);

    if (items.length) {
        const list = createElement("div", {
            className: "solution-engine-enablers-list"
        });

        items.forEach((item) => {
            const chip = createElement("div", {
                className: "solution-engine-enabler"
            });

            if (item.icon) {
                chip.append(icon(item.icon, "solution-engine-enabler-icon"));
            }

            const text = createElement("div", {
                className: "solution-engine-enabler-text"
            });

            if (item.title) {
                text.append(createElement("strong", {
                    className: "solution-engine-enabler-title",
                    text: item.title
                }));
            }

            if (item.body) {
                text.append(createElement("span", {
                    className: "solution-engine-enabler-body",
                    text: item.body
                }));
            }

            chip.append(text);
            list.append(chip);
        });

        bar.append(list);
    }

    return bar;
}

function renderDecisionEngine(section, data) {
    const root = createElement("section", {
        className: "cs-section solution solution--solution-decision-engine cs-animate",
        id: section.id
    });

    const container = createElement("div", {
        className: "case-study-container solution-engine-container"
    });

    const header = createElement("header", {
        className: "solution-engine-header"
    });

    if (data.eyebrow) {
        header.append(createElement("span", {
            className: "cs-eyebrow",
            text: data.eyebrow
        }));
    }

    if (data.title) {
        header.append(renderAccentTitle(data.title, "cs-title solution-engine-title"));
    }

    if (data.intro) {
        header.append(createElement("p", {
            className: "cs-body solution-engine-intro",
            text: data.intro
        }));
    }

    container.append(header);

    const stage = createElement("div", {
        className: "solution-engine-stage"
    });

    stage.append(renderEngineWheel(data));

    const steps = Array.isArray(data.steps) ? data.steps : [];

    if (steps.length) {
        const callouts = createElement("div", {
            className: "solution-engine-callouts"
        });

        steps.forEach((step, index) => {
            callouts.append(renderEngineCallout(step, index));
        });

        stage.append(callouts);
    }

    container.append(stage);

    const enablers = renderEngineEnablers(data.enablers || {});
    if (enablers) container.append(enablers);

    root.append(container);
    return root;
}

export default {

    render(section) {
        const data = section.data || {};
        const variant = resolveVariant(section.variant);

        if (variant === "solution-decision-path") {
            return renderDecisionPath(section, data);
        }

        if (variant === "solution-control-hub") {
            return renderControlHub(section, data);
        }

        if (variant === "solution-decision-engine") {
            return renderDecisionEngine(section, data);
        }

        return renderSolutionSimple(section, data);
    }

};
