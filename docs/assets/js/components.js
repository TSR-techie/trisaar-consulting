async function loadComponent(id, file) {
    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load ${file}`);
        }

        const html = await response.text();

        document.getElementById(id).innerHTML = html;

    } catch (err) {
        console.error(err);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    loadComponent("navbar", "./overrides/partials/navbar.html");
    loadComponent("footer", "./overrides/partials/footer.html");

});