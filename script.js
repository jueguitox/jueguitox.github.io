document.addEventListener("DOMContentLoaded", () => {
    const enlaces = document.querySelectorAll("nav ul li a");

    enlaces.forEach(enlace => {
        enlace.addEventListener("mouseover", () => {
            enlace.style.transform = "scale(1.2)";
        });
        enlace.addEventListener("mouseout", () => {
            enlace.style.transform = "scale(1)";
        });
    });

    document.body.style.opacity = 0;
    setTimeout(() => {
        document.body.style.transition = "opacity 1.5s";
        document.body.style.opacity = 1;
    }, 200);

    const año = new Date().getFullYear();
    document.getElementById("texto-footer").innerHTML = `&copy; ${año} Todos los derechos reservados.`;
});
