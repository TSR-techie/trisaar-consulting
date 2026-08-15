const DEFAULT_AUTHOR = "TriSaar Consulting";
const DEFAULT_THEME = "#B91C1C";
const DEFAULT_ROBOTS = "index, follow";
const DEFAULT_OG_IMAGE = "/docs/assets/images/Social-preview.png";
const JSON_LD_CASE_ID = "case-study-jsonld";
const JSON_LD_INDEX_ID = "case-index-jsonld-list";

function siteOrigin() {
    const configured = window.TriSaar?.Config?.siteOrigin;
    if (configured) return String(configured).replace(/\/$/, "");
    return `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, "")}`;
}

function absoluteUrl(pathOrUrl) {
    if (!pathOrUrl) return "";
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    const origin = siteOrigin();
    const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
    return `${origin}${path}`;
}

function heroPart(page, type) {
    const hero = (page.sections || []).find((section) => (
        section.component === "hero" || section.id === "hero"
    ));
    return (hero?.parts || []).find((part) => part.type === type);
}

function heroText(page, type) {
    return heroPart(page, type)?.data?.text || "";
}

function heroKeywords(page) {
    const items = heroPart(page, "taxonomy")?.data?.items;
    return Array.isArray(items) ? items.filter(Boolean) : [];
}

function formatKeywords(value) {
    if (Array.isArray(value)) {
        return value.filter(Boolean).join(", ");
    }
    return String(value || "").trim();
}

function upsertMeta({ name, property, content }) {
    if (content == null || content === "") return;

    const selector = name
        ? `meta[name="${name}"]`
        : `meta[property="${property}"]`;

    let element = document.head.querySelector(selector);

    if (!element) {
        element = document.createElement("meta");
        if (name) element.setAttribute("name", name);
        if (property) element.setAttribute("property", property);
        document.head.appendChild(element);
    }

    element.setAttribute("content", content);
}

function upsertLink({ rel, href }) {
    if (!rel || !href) return;

    let element = document.head.querySelector(`link[rel="${rel}"]`);

    if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
    }

    element.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
    let element = document.getElementById(id);

    if (!element) {
        element = document.createElement("script");
        element.type = "application/ld+json";
        element.id = id;
        document.head.appendChild(element);
    }

    element.textContent = JSON.stringify(data);
}

function resolveCaseStudySeo(page, caseId) {
    const meta = page.meta || {};
    const origin = siteOrigin();
    const title = meta.title
        || heroText(page, "title")
        || "Case Study | TriSaar Consulting";
    const description = meta.description
        || heroText(page, "description")
        || heroText(page, "subtitle")
        || "TriSaar Consulting case study covering analytics, automation, and decision-support work.";
    const keywords = formatKeywords(meta.keywords?.length ? meta.keywords : heroKeywords(page));
    const author = meta.author || DEFAULT_AUTHOR;
    const themeColor = meta.themeColor || DEFAULT_THEME;
    const canonical = meta.canonical
        || `${origin}/case-study.html?id=${encodeURIComponent(caseId)}`;
    const ogImage = absoluteUrl(meta.ogImage || DEFAULT_OG_IMAGE);
    const robots = meta.robots || DEFAULT_ROBOTS;
    const headline = heroText(page, "title")
        || String(title).replace(/\s*\|\s*TriSaar Consulting\s*$/i, "");

    return {
        title,
        description,
        keywords,
        author,
        themeColor,
        canonical,
        ogImage,
        robots,
        headline,
        origin
    };
}

export function applyCaseStudySeo(page, caseId) {
    const seo = resolveCaseStudySeo(page, caseId);

    document.title = seo.title;

    upsertMeta({ name: "description", content: seo.description });
    upsertMeta({ name: "keywords", content: seo.keywords });
    upsertMeta({ name: "author", content: seo.author });
    upsertMeta({ name: "robots", content: seo.robots });
    upsertMeta({ name: "theme-color", content: seo.themeColor });

    upsertLink({ rel: "canonical", href: seo.canonical });

    upsertMeta({ property: "og:type", content: "article" });
    upsertMeta({ property: "og:title", content: seo.title });
    upsertMeta({ property: "og:description", content: seo.description });
    upsertMeta({ property: "og:url", content: seo.canonical });
    upsertMeta({ property: "og:image", content: seo.ogImage });
    upsertMeta({ property: "og:image:alt", content: seo.headline });
    upsertMeta({ property: "og:site_name", content: "TriSaar Consulting" });
    upsertMeta({ property: "og:locale", content: "en_US" });

    upsertMeta({ name: "twitter:card", content: "summary_large_image" });
    upsertMeta({ name: "twitter:title", content: seo.title });
    upsertMeta({ name: "twitter:description", content: seo.description });
    upsertMeta({ name: "twitter:image", content: seo.ogImage });

    upsertJsonLd(JSON_LD_CASE_ID, {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                headline: seo.headline,
                name: seo.title,
                description: seo.description,
                author: {
                    "@type": "Organization",
                    name: seo.author
                },
                publisher: {
                    "@type": "Organization",
                    name: "TriSaar Consulting",
                    url: seo.origin
                },
                image: seo.ogImage,
                mainEntityOfPage: seo.canonical,
                url: seo.canonical
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: `${seo.origin}/`
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Case Studies",
                        item: `${seo.origin}/case-studies.html`
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: seo.headline,
                        item: seo.canonical
                    }
                ]
            }
        ]
    });
}

export function applyCaseIndexSeo(cases = []) {
    const origin = siteOrigin();

    upsertJsonLd(JSON_LD_INDEX_ID, {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "TriSaar Consulting Case Studies",
        itemListElement: cases.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.title || item.label || item.id,
            url: `${origin}/case-study.html?id=${encodeURIComponent(item.id)}`
        }))
    });
}
