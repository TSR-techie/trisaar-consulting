async function loadComponent(id, file) {

    const element = document.getElementById(id);

    if (!element) {
        console.warn(`Component placeholder '${id}' not found.`);
        return;
    }

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load ${file} (${response.status})`);
        }

        element.innerHTML = await response.text();

    } catch (err) {

        console.error(err);

    }

}

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("navbar", "./partials/navbar.html");
    await loadComponent("footer", "./partials/footer.html");

});