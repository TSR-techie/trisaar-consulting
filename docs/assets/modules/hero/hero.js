import { createElement } from "../../js/utils.js";

export default {

    render(section) {

        const data = section.data || {};
        const variant = section.variant || "immersive";

        const heroSection = createElement("section", {
            className: `hero hero--${variant} cs-animate`,
            id: section.id
        });

        const container = createElement("div", {
            className: "hero-container"
        });

        heroSection.append(container);

        if (Array.isArray(data.taxonomy) && data.taxonomy.length) {
            container.append(createElement("span", {
                className: "hero-eyebrow",
                text: data.taxonomy.join(" • ")
            }));
        }

        if (data.title) {
            container.append(createElement("h1", {
                className: "hero-title",
                text: data.title
            }));
        }

        if (data.subtitle) {
            container.append(createElement("p", {
                className: "hero-subtitle",
                text: data.subtitle
            }));
        }

        if (Array.isArray(data.actions) && data.actions.length) {
            const actions = createElement("div", {
                className: "hero-actions"
            });

            data.actions.forEach((action) => {
                const isExternal = /^https?:\/\//i.test(action.target || "");

                const attributes = {
                    href: action.target || "#"
                };

                if (isExternal) {
                    attributes.target = "_blank";
                    attributes.rel = "noopener noreferrer";
                }

                actions.append(createElement("a", {
                    className: `btn btn-${action.type || "primary"}`,
                    text: action.label,
                    attributes
                }));
            });

            container.append(actions);
        }

        if (data.description) {
            container.append(createElement("p", {
                className: "hero-description",
                text: data.description
            }));
        }

        if (Array.isArray(data.snapshot) && data.snapshot.length) {
            const snapshot = createElement("div", {
                className: "hero-snapshot"
            });

            data.snapshot.forEach((item) => {
                const card = createElement("div", {
                    className: "snapshot-item"
                });

                card.append(
                    createElement("span", {
                        className: "snapshot-label",
                        text: item.label
                    }),
                    createElement("strong", {
                        className: "snapshot-value",
                        text: item.value
                    })
                );

                snapshot.append(card);
            });

            container.append(snapshot);
        }

        return heroSection;

    }

};
