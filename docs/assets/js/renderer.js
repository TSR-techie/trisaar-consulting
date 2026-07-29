import { ComponentRegistry } from "./component-registry.js";

export async function renderCaseStudy() {

    const response = await fetch("./docs/assets/data/sara-0001.json");

    const page = await response.json();

    console.log(page)

    const root = document.getElementById("case-study-root");

    root.innerHTML = "";

    for (const section of page.sections) {

        if (!section.visible) continue;

        const component = ComponentRegistry[section.component];

        if (!component) {

            console.warn(`Unknown component: ${section.component}`);

            continue;

        }

        const element = component.render(section)

        console.log(element);
        console.log(element instanceof Node);

        root.appendChild(element);

    }

}