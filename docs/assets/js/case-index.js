import { createElement } from "./utils.js";
import { icon } from "./icons.js";

const DEFAULT_FILTERS = {
    q: "",
    industry: "",
    duration: "",
    technology: "",
    sort: "recent"
};

const INDUSTRY_ICONS = {
    "Energy & Utilities": "industry",
    "Financial Services": "scales",
    "Consumer Goods": "grid",
    Manufacturing: "gear"
};

function uniqueSorted(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function normalize(value) {
    return String(value || "").trim().toLowerCase();
}

function labelFromId(id = "") {
    const number = String(id).replace(/^sara-/i, "");
    return number ? `Sāra ${number}` : "Sāra";
}

function haystack(item) {
    return [
        item.label,
        item.id,
        item.number,
        item.title,
        item.summary,
        item.industry,
        item.duration,
        ...(item.technologies || []),
        ...(item.capabilities || []),
        ...(item.topics || [])
    ].join(" ").toLowerCase();
}

function readFiltersFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return {
        q: params.get("q") || "",
        industry: params.get("industry") || "",
        duration: params.get("duration") || "",
        technology: params.get("technology") || "",
        sort: params.get("sort") || DEFAULT_FILTERS.sort
    };
}

function writeFiltersToUrl(filters) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== DEFAULT_FILTERS[key]) {
            params.set(key, value);
        }
    });

    const query = params.toString();
    const next = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
}

function filterCases(cases, filters) {
    const query = normalize(filters.q);

    return cases.filter((item) => {
        if (query && !haystack(item).includes(query)) return false;
        if (filters.industry && item.industry !== filters.industry) return false;
        if (filters.duration && item.duration !== filters.duration) return false;
        if (filters.technology && !(item.technologies || []).includes(filters.technology)) return false;
        return true;
    });
}

function sortCases(cases, sort) {
    const copy = [...cases];

    if (sort === "title") {
        return copy.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sort === "duration") {
        return copy.sort((a, b) => (a.durationWeeks || 0) - (b.durationWeeks || 0));
    }

    if (sort === "number") {
        return copy.sort((a, b) => String(a.number).localeCompare(String(b.number)));
    }

    return copy.sort((a, b) => String(b.publishedDate || "").localeCompare(String(a.publishedDate || "")));
}

function optionList(select, values, allLabel) {
    select.replaceChildren();
    select.append(new Option(allLabel, ""));
    values.forEach((value) => select.append(new Option(value, value)));
}

function markNavActive() {
    document.querySelectorAll(".nav-menu a").forEach((link) => {
        const href = link.getAttribute("href") || "";
        link.classList.toggle("is-active", href.includes("case-studies.html"));
    });
}

function renderHero(cases) {
    const industries = uniqueSorted(cases.map((item) => item.industry));
    const capabilities = uniqueSorted(cases.flatMap((item) => item.capabilities || []));
    const hero = createElement("section", { className: "case-index-hero" });
    const wrap = createElement("div", { className: "container case-index-hero-inner" });
    const copy = createElement("div", { className: "case-index-hero-copy" });

    copy.append(
        createElement("span", { className: "section-label", text: "Case Studies" }),
        createElement("h1", {
            className: "case-index-title",
            html: 'Real Problems. Practical Solutions. <span class="impact-title-accent">Measurable Impact.</span>'
        }),
        createElement("p", {
            className: "case-index-lede",
            text: "Explore consulting engagements across analytics, automation, and AI. Filter by industry, duration, and technology to find work that maps to your challenge."
        })
    );

    const stats = createElement("div", { className: "case-index-stats" });
    const tiles = [
        { icon: "grid", value: `${cases.length}+`, label: "Case Studies" },
        { icon: "industry", value: `${industries.length}+`, label: "Industries" },
        { icon: "circuit", value: capabilities.slice(0, 3).join(", ") || "Analytics", label: "Capabilities" },
        { icon: "outcome", value: "Impact", label: "Business Impact Driven" }
    ];

    tiles.forEach((tile) => {
        const item = createElement("div", { className: "case-index-stat" });
        item.append(icon(tile.icon, "case-index-stat-icon"));
        const copyBlock = createElement("div");
        copyBlock.append(
            createElement("strong", { text: tile.value }),
            createElement("span", { text: tile.label })
        );
        item.append(copyBlock);
        stats.append(item);
    });

    wrap.append(copy, stats);
    hero.append(wrap);
    return hero;
}

function renderFilters(cases, filters) {
    const bar = createElement("form", {
        className: "case-index-filters",
        attributes: { id: "case-index-filters" }
    });

    const search = createElement("label", { className: "case-index-search" });
    search.append(icon("search", "case-index-search-icon"));
    const input = createElement("input", {
        attributes: {
            type: "search",
            name: "q",
            placeholder: "Search case studies...",
            value: filters.q,
            "aria-label": "Search case studies"
        }
    });
    search.append(input);

    const controls = createElement("div", { className: "case-index-filter-controls" });

    [
        ["industry", "All Industries", uniqueSorted(cases.map((item) => item.industry))],
        ["duration", "All Durations", uniqueSorted(cases.map((item) => item.duration))],
        ["technology", "All Technologies", uniqueSorted(cases.flatMap((item) => item.technologies || []))]
    ].forEach(([name, allLabel, values]) => {
        const select = createElement("select", {
            className: "case-index-select",
            attributes: { name, "aria-label": allLabel }
        });
        optionList(select, values, allLabel);
        select.value = filters[name] || "";
        controls.append(select);
    });

    const reset = createElement("button", {
        className: "case-index-reset",
        text: "Reset",
        attributes: { type: "reset" }
    });
    const apply = createElement("button", {
        className: "btn btn-primary case-index-apply",
        text: "Apply Filters",
        attributes: { type: "submit" }
    });

    bar.append(search, controls, reset, apply);
    return bar;
}

function renderIndustryChips(cases, selected) {
    const counts = cases.reduce((map, item) => {
        if (!item.industry) return map;
        map[item.industry] = (map[item.industry] || 0) + 1;
        return map;
    }, {});

    const row = createElement("div", { className: "case-index-industries" });
    row.append(createElement("span", {
        className: "case-index-industries-label",
        text: "Browse by industry"
    }));

    const scroller = createElement("div", {
        className: "case-index-industry-list",
        attributes: { role: "list" }
    });

    const chips = [{ value: "", label: "All Industries", count: cases.length }, ...Object.entries(counts).map(([label, count]) => ({ value: label, label, count }))];

    chips.forEach((chip) => {
        const button = createElement("button", {
            className: `case-index-chip${chip.value === selected ? " is-active" : ""}`,
            attributes: {
                type: "button",
                role: "listitem",
                "data-industry": chip.value
            }
        });
        button.append(
            icon(INDUSTRY_ICONS[chip.label] || "industry", "case-index-chip-icon"),
            createElement("span", { text: chip.label }),
            createElement("em", { text: String(chip.count) })
        );
        scroller.append(button);
    });

    row.append(scroller);
    return row;
}

function cardImageSrc(item) {
    if (!item?.id) return "";
    return `./docs/assets/images/sara/${item.id}/index-card.png`;
}

function renderCard(item) {
    const href = `case-study.html?id=${encodeURIComponent(item.id)}`;
    const card = createElement("a", {
        className: "case-index-card",
        attributes: { href }
    });

    const media = createElement("div", { className: "case-index-card-media" });
    const img = createElement("img", {
        attributes: {
            src: cardImageSrc(item),
            alt: "",
            loading: "lazy"
        }
    });
    img.addEventListener("error", () => {
        img.remove();
        media.classList.add("is-fallback");
    });
    media.append(img);
    media.append(createElement("span", {
        className: "case-index-badge",
        text: item.label || labelFromId(item.id)
    }));

    const body = createElement("div", { className: "case-index-card-body" });
    const tags = createElement("div", { className: "case-index-card-tags" });
    [item.industry, ...(item.topics || []).slice(0, 1)].filter(Boolean).forEach((tag) => {
        tags.append(createElement("span", { className: "case-index-tag", text: tag }));
    });

    body.append(
        tags,
        createElement("h2", { className: "case-index-card-title", text: item.title }),
        createElement("p", { className: "case-index-card-summary", text: item.summary })
    );

    const footer = createElement("div", { className: "case-index-card-footer" });
    const duration = createElement("span", { className: "case-index-card-duration" });
    duration.append(icon("duration", "case-index-card-duration-icon"));
    duration.append(createElement("span", { text: item.duration || "" }));

    const caps = createElement("div", { className: "case-index-card-caps" });
    (item.capabilities || []).slice(0, 2).forEach((cap) => {
        caps.append(createElement("span", { className: "case-index-tag case-index-tag--muted", text: cap }));
    });

    footer.append(duration, caps, icon("arrow-right", "case-index-card-arrow"));
    body.append(footer);
    card.append(media, body);
    return card;
}

function renderResults(items, sort) {
    const section = createElement("div", { className: "case-index-results" });
    const toolbar = createElement("div", { className: "case-index-toolbar" });
    const count = items.length === 1 ? "Showing 1 case study" : `Showing ${items.length} case studies`;

    toolbar.append(createElement("p", { className: "case-index-count", text: count }));

    const sortWrap = createElement("label", { className: "case-index-sort" });
    sortWrap.append(createElement("span", { text: "Sort by" }));
    const select = createElement("select", {
        className: "case-index-select",
        attributes: { name: "sort", "aria-label": "Sort case studies" }
    });
    [
        ["recent", "Most Recent"],
        ["title", "Title A–Z"],
        ["duration", "Duration"],
        ["number", "Sāra number"]
    ].forEach(([value, label]) => select.append(new Option(label, value)));
    select.value = sort;
    sortWrap.append(select);
    toolbar.append(sortWrap);
    section.append(toolbar);

    if (!items.length) {
        section.append(createElement("p", {
            className: "case-index-empty",
            text: "No case studies match these filters. Reset to see all engagements."
        }));
        return section;
    }

    const grid = createElement("div", { className: "case-index-grid" });
    items.forEach((item) => grid.append(renderCard(item)));
    section.append(grid);
    return section;
}

function readForm(form, sort) {
    const data = new FormData(form);
    return {
        q: String(data.get("q") || "").trim(),
        industry: String(data.get("industry") || ""),
        duration: String(data.get("duration") || ""),
        technology: String(data.get("technology") || ""),
        sort
    };
}

async function loadCatalog() {
    const response = await fetch("./docs/assets/data/sara-catalog.json");

    if (!response.ok) {
        throw new Error("Unable to load case catalog.");
    }

    const data = await response.json();
    return Array.isArray(data.cases) ? data.cases : [];
}

function renderPage(root, cases, filters) {
    const visible = sortCases(filterCases(cases, filters), filters.sort);
    root.replaceChildren();

    const shell = createElement("div", { className: "case-index-shell" });
    shell.append(renderHero(cases));

    const body = createElement("div", { className: "container case-index-body" });
    const form = renderFilters(cases, filters);
    body.append(form, renderIndustryChips(cases, filters.industry), renderResults(visible, filters.sort));
    shell.append(body);
    root.append(shell);

    const sortSelect = body.querySelector('select[name="sort"]');

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const next = readForm(form, sortSelect?.value || filters.sort);
        writeFiltersToUrl(next);
        renderPage(root, cases, next);
    });

    form.addEventListener("reset", (event) => {
        event.preventDefault();
        writeFiltersToUrl({ ...DEFAULT_FILTERS });
        renderPage(root, cases, { ...DEFAULT_FILTERS });
    });

    form.querySelector('input[name="q"]')?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    sortSelect?.addEventListener("change", () => {
        const next = readForm(form, sortSelect.value);
        writeFiltersToUrl(next);
        renderPage(root, cases, next);
    });

    body.querySelectorAll("[data-industry]").forEach((chip) => {
        chip.addEventListener("click", () => {
            const next = {
                ...readForm(form, sortSelect?.value || filters.sort),
                industry: chip.getAttribute("data-industry") || ""
            };
            writeFiltersToUrl(next);
            renderPage(root, cases, next);
        });
    });
}

function waitForNav() {
    if (document.querySelector(".nav-menu a")) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        const target = document.getElementById("navbar") || document.body;
        const observer = new MutationObserver(() => {
            if (document.querySelector(".nav-menu a")) {
                observer.disconnect();
                resolve();
            }
        });
        observer.observe(target, { childList: true, subtree: true });
        window.setTimeout(() => {
            observer.disconnect();
            resolve();
        }, 2000);
    });
}

async function init() {
    const root = document.getElementById("case-index-root");
    if (!root) return;

    try {
        const cases = await loadCatalog();
        renderPage(root, cases, readFiltersFromUrl());
    } catch (error) {
        root.replaceChildren(createElement("p", {
            className: "container case-index-empty",
            text: "Case studies could not be loaded. Please refresh the page."
        }));
        console.error(error);
    }

    await waitForNav();
    markNavActive();
}

document.addEventListener("DOMContentLoaded", init);
