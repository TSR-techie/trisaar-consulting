import { createElement } from "./utils.js";
import { icon } from "./icons.js";
import { applyCaseIndexSeo } from "./seo.js";

const DEFAULT_FILTERS = {
    q: "",
    industry: [],
    duration: [],
    technology: [],
    country: [],
    sort: "recent"
};

function blankFilters() {
    return {
        q: "",
        industry: [],
        duration: [],
        technology: [],
        country: [],
        sort: DEFAULT_FILTERS.sort
    };
}

const GEOGRAPHY = [
    { region: "America", countries: ["Canada", "USA"] },
    { region: "Asia", countries: ["China", "Thailand", "India"] },
    { region: "Europe", countries: ["Switzerland", "UK"] },
    { region: "Middle East", countries: ["Saudi Arabia", "Qatar"] },
    { region: "Oceania", countries: ["Australia", "New Zealand"] }
];

const INDUSTRY_ICONS = {
    "Energy & Utilities": "Energy & Utilities",
    "Financial Services": "Financial Services",
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
        item.country,
        item.region,
        item.duration,
        ...(item.technologies || []),
        ...(item.capabilities || []),
        ...(item.topics || [])
    ].join(" ").toLowerCase();
}

function readListParam(params, key) {
    return params.getAll(key)
        .flatMap((value) => String(value).split(","))
        .map((value) => value.trim())
        .filter(Boolean);
}

function readFiltersFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return {
        q: params.get("q") || "",
        industry: readListParam(params, "industry"),
        duration: readListParam(params, "duration"),
        technology: readListParam(params, "technology"),
        country: readListParam(params, "country"),
        sort: params.get("sort") || DEFAULT_FILTERS.sort
    };
}

function writeFiltersToUrl(filters) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => {
                if (item) params.append(key, item);
            });
            return;
        }

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
    const regions = regionNameSet(cases);

    return cases.filter((item) => {
        if (query && !haystack(item).includes(query)) return false;
        if (filters.industry?.length && !filters.industry.includes(item.industry)) return false;
        if (filters.duration?.length && !filters.duration.includes(item.duration)) return false;
        if (filters.technology?.length && !(item.technologies || []).some((tech) => filters.technology.includes(tech))) return false;
        if (filters.country?.length && !filters.country.some((value) => matchesCountryFilter(item, value, regions))) return false;
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

function regionNameSet(cases) {
    const names = new Set(GEOGRAPHY.map((group) => group.region));
    cases.forEach((item) => {
        if (item.region) names.add(item.region);
    });
    return names;
}

function matchesCountryFilter(item, value, regions) {
    if (regions.has(value)) {
        return item.region === value;
    }

    return item.country === value;
}

function mergeCountries(base, extra) {
    const seen = new Set(base);
    const countries = [...base];

    extra.forEach((country) => {
        if (!country || seen.has(country)) return;
        seen.add(country);
        countries.push(country);
    });

    return countries;
}

function geographyGroups(cases) {
    const extraByRegion = {};

    cases.forEach((item) => {
        if (!item.country) return;
        const region = item.region || "Other";
        extraByRegion[region] = extraByRegion[region] || new Set();
        extraByRegion[region].add(item.country);
    });

    const known = new Set(GEOGRAPHY.map((group) => group.region));
    const groups = GEOGRAPHY.map((group) => ({
        region: group.region,
        countries: mergeCountries(group.countries, extraByRegion[group.region] || [])
    }));

    Object.keys(extraByRegion)
        .filter((region) => !known.has(region))
        .sort((a, b) => a.localeCompare(b))
        .forEach((region) => {
            groups.push({
                region,
                countries: uniqueSorted([...extraByRegion[region]])
            });
        });

    return groups;
}

function asList(value) {
    return Array.isArray(value) ? value : value ? [value] : [];
}

function toggleListValue(list, value) {
    if (!value) return [];
    const next = new Set(asList(list));
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return [...next];
}

function summaryLabel(allLabel, selected) {
    const list = asList(selected);
    if (!list.length) return allLabel;
    if (list.length === 1) return list[0];
    return `${allLabel.replace(/^All /, "")} (${list.length})`;
}

function wrapDropdown(allLabel, name, selected, panel) {
    const selectedList = asList(selected);
    const details = createElement("details", {
        className: `case-index-dropdown${selectedList.length ? " is-active" : ""}`,
        attributes: {
            "data-name": name,
            "data-all-label": allLabel
        }
    });

    const summary = createElement("summary", {
        className: "case-index-dropdown-toggle"
    });
    summary.append(
        createElement("span", {
            className: "case-index-dropdown-label",
            text: summaryLabel(allLabel, selectedList)
        }),
        icon("chevron-up", "case-index-dropdown-caret")
    );

    const menu = createElement("div", {
        className: "case-index-dropdown-panel",
        attributes: { role: "group", "aria-label": allLabel }
    });
    menu.append(panel);
    details.append(summary, menu);
    return details;
}

function syncDropdownSummary(dropdown) {
    const name = dropdown.dataset.name;
    const allLabel = dropdown.dataset.allLabel || "All";
    const checked = [...dropdown.querySelectorAll(`input[type="checkbox"][name="${name}"]:checked`)]
        .map((input) => input.value);
    const label = dropdown.querySelector(".case-index-dropdown-label");
    if (label) label.textContent = summaryLabel(allLabel, checked);
    dropdown.classList.toggle("is-active", checked.length > 0);
}

function renderCheckbox(name, value, label, checked, extra = {}) {
    const wrap = createElement("label", {
        className: extra.className || "case-index-check"
    });
    const input = createElement("input", {
        attributes: {
            type: "checkbox",
            name,
            value,
            ...(extra.attributes || {})
        }
    });
    input.checked = Boolean(checked);
    if (extra.indeterminate) input.indeterminate = true;
    wrap.append(input, createElement("span", { text: label }));
    return wrap;
}

function renderFilterGroup(allLabel, name, values, selected) {
    const panel = createElement("div", { className: "case-index-dropdown-options" });
    const selectedSet = new Set(asList(selected));

    values.forEach((value) => {
        panel.append(renderCheckbox(name, value, value, selectedSet.has(value)));
    });

    return wrapDropdown(allLabel, name, selected, panel);
}

function renderCountryGroup(cases, selected) {
    const selectedSet = new Set(asList(selected));
    const panel = createElement("div", { className: "case-index-dropdown-options" });

    geographyGroups(cases).forEach((geo) => {
        const block = createElement("div", { className: "case-index-geo-group" });
        const childChecked = geo.countries.filter((country) => selectedSet.has(country));
        const regionSelected = selectedSet.has(geo.region);
        const allChildren = geo.countries.length > 0 && childChecked.length === geo.countries.length;
        const someChildren = childChecked.length > 0;

        block.append(renderCheckbox("country", geo.region, geo.region, regionSelected || allChildren, {
            className: "case-index-check case-index-check--region",
            attributes: { "data-geo": "region" },
            indeterminate: !regionSelected && someChildren && !allChildren
        }));

        const children = createElement("div", { className: "case-index-geo-children" });
        geo.countries.forEach((country) => {
            children.append(renderCheckbox("country", country, country, regionSelected || selectedSet.has(country), {
                attributes: { "data-geo": "country" }
            }));
        });
        block.append(children);
        panel.append(block);
    });

    return wrapDropdown("All Countries", "country", selected, panel);
}

function markNavActive() {
    document.querySelectorAll(".nav-menu a").forEach((link) => {
        const href = link.getAttribute("href") || "";
        link.classList.toggle("is-active", href.includes("case-studies.html"));
    });
}

function takeIndexHeading(root) {
    const heading = root.querySelector("#case-index-heading")
        || root.querySelector("h1.case-index-title")
        || root.querySelector("h1");

    if (heading) heading.remove();
    return heading;
}

function renderIndexTitle(heading) {
    const title = heading || createElement("h1", {
        className: "case-index-title",
        attributes: { id: "case-index-heading" }
    });

    title.className = "case-index-title";
    title.id = "case-index-heading";
    title.innerHTML = 'Real Problems. Practical Solutions. <span class="impact-title-accent">Measurable Impact.</span>';
    return title;
}

function renderHero(cases, heading) {
    const industries = uniqueSorted(cases.map((item) => item.industry));
    const capabilities = uniqueSorted(cases.flatMap((item) => item.capabilities || []));
    const hero = createElement("section", { className: "case-index-hero" });
    const wrap = createElement("div", { className: "container case-index-hero-inner" });
    const copy = createElement("div", { className: "case-index-hero-copy" });

    copy.append(
        createElement("span", { className: "section-label", text: "Case Studies" }),
        renderIndexTitle(heading),
        createElement("p", {
            className: "case-index-lede",
            text: "Explore consulting engagements across analytics, automation, and AI. Filter by industry, duration, technology, and country to find work that maps to your challenge."
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
    controls.append(
        renderFilterGroup("All Industries", "industry", uniqueSorted(cases.map((item) => item.industry)), filters.industry),
        renderFilterGroup("All Durations", "duration", uniqueSorted(cases.map((item) => item.duration)), filters.duration),
        renderFilterGroup("All Technologies", "technology", uniqueSorted(cases.flatMap((item) => item.technologies || [])), filters.technology),
        renderCountryGroup(cases, filters.country)
    );

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
    const selectedList = asList(selected);
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

    const chips = [
        { value: "", label: "All Industries", count: cases.length, active: !selectedList.length },
        ...Object.entries(counts).map(([label, count]) => ({
            value: label,
            label,
            count,
            active: selectedList.includes(label)
        }))
    ];

    chips.forEach((chip) => {
        const button = createElement("button", {
            className: `case-index-chip${chip.active ? " is-active" : ""}`,
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
        industry: data.getAll("industry").filter(Boolean),
        duration: data.getAll("duration").filter(Boolean),
        technology: data.getAll("technology").filter(Boolean),
        country: data.getAll("country").filter(Boolean),
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
    const heading = takeIndexHeading(root);
    root.replaceChildren();

    const shell = createElement("div", { className: "case-index-shell" });
    shell.append(renderHero(cases, heading));

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
        writeFiltersToUrl(blankFilters());
        renderPage(root, cases, blankFilters());
    });

    form.querySelector('input[name="q"]')?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    form.querySelectorAll(".case-index-dropdown").forEach((dropdown) => {
        dropdown.addEventListener("toggle", () => {
            if (!dropdown.open) return;
            form.querySelectorAll(".case-index-dropdown").forEach((other) => {
                if (other !== dropdown) other.open = false;
            });
        });
    });

    form.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        form.querySelectorAll(".case-index-dropdown[open]").forEach((dropdown) => {
            dropdown.open = false;
        });
    });

    shell.addEventListener("pointerdown", (event) => {
        if (event.target.closest(".case-index-dropdown")) return;
        form.querySelectorAll(".case-index-dropdown[open]").forEach((dropdown) => {
            dropdown.open = false;
        });
    });

    form.addEventListener("change", (event) => {
        const input = event.target;
        if (!(input instanceof HTMLInputElement) || input.type !== "checkbox") return;

        if (input.getAttribute("data-geo") === "region") {
            const group = input.closest(".case-index-geo-group");
            group?.querySelectorAll('[data-geo="country"]').forEach((child) => {
                child.checked = input.checked;
            });
            input.indeterminate = false;
        }

        if (input.getAttribute("data-geo") === "country") {
            const group = input.closest(".case-index-geo-group");
            const regionInput = group?.querySelector('[data-geo="region"]');
            const children = [...(group?.querySelectorAll('[data-geo="country"]') || [])];
            const checkedCount = children.filter((child) => child.checked).length;
            if (regionInput) {
                regionInput.checked = checkedCount === children.length && children.length > 0;
                regionInput.indeterminate = checkedCount > 0 && checkedCount < children.length;
            }
        }

        const dropdown = input.closest(".case-index-dropdown");
        if (dropdown) syncDropdownSummary(dropdown);
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
                industry: toggleListValue(filters.industry, chip.getAttribute("data-industry") || "")
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
        applyCaseIndexSeo(cases);
        renderPage(root, cases, readFiltersFromUrl());
    } catch (error) {
        const heading = takeIndexHeading(root);
        const message = createElement("p", {
            className: "container case-index-empty",
            text: "Case studies could not be loaded. Please refresh the page."
        });
        root.replaceChildren(...[heading, message].filter(Boolean));
        console.error(error);
    }

    await waitForNav();
    markNavActive();
}

document.addEventListener("DOMContentLoaded", init);
