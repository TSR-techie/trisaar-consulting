import { createElement } from "../../js/utils.js";

export default {

    render(section) {

        const data = section.data;

        const heroSection = createElement("section", {
            className: "hero"
        });

        const container = createElement("div", {
            className: "hero-container"
        });

        heroSection.append(container);

        const eyebrow = createElement("span", {
            className: "hero-eyebrow",
            text: data.eyebrow
        });

        container.append(eyebrow);

        const title = createElement("h1", {
            className: "hero-title",
            text: data.title
        });

        container.append(title);

        const subtitle = createElement("p", {
            className: "hero-subtitle",
            text: data.subtitle
        });

        container.append(subtitle);

        const buttonGroup = createElement("div", {
            className: "hero-actions"
        });

        container.append(buttonGroup)

        const actions = createElement("div", {
            className: "hero-actions"
        });

        data.actions.forEach(action => {

            const button = createElement("a", {

                className: `btn btn-${action.type}`,

                text: action.label,

                attributes:{

                    href:action.target

                }

            });

            actions.append(button);

        });

        container.append(actions);

        const description = createElement("p", {
            className: "hero-description",
            text: data.description
        });

        container.append(description);

        const snapshot = createElement("div", {
            className: "hero-snapshot"
        });

        data.snapshot.forEach(item=>{

            const card = createElement("div",{

                className:"snapshot-card"

            });

            const label=createElement("span",{

                className:"snapshot-label",

                text:item.label

            });

            const value=createElement("strong",{

                className:"snapshot-value",

                text:item.value

            });

            card.append(label);

            card.append(value);

            snapshot.append(card);

        });

        container.append(snapshot);

        return heroSection;

    }

};