// script.js
document.addEventListener("DOMContentLoaded", () => {
    let imagenes = [];
    let nombres = {};
    
    fetch("../../../assets/json/ruleta.json")
        .then(response => response.json())
        .then(data => {
            imagenes = Object.keys(data);
            nombres = data;
        });
    
    const imagenActual = document.getElementById("imagenActual");
    const botonIniciar = document.getElementById("botonIniciar");
    const nombreImagen = document.getElementById("nombreImagen");
    let intervalo;

    botonIniciar.addEventListener("click", () => {
        let tiempo = 100;
        let contador = 0;
        let duracion = 5000; // Duración total de la ruleta en milisegundos
        let inicio = Date.now();

        clearInterval(intervalo);
        nombreImagen.textContent = "";
        imagenActual.style.display = "block";
        
        intervalo = setInterval(() => {
            imagenActual.src = imagenes[contador % imagenes.length];
            contador++;

            if (Date.now() - inicio >= duracion) {
                clearInterval(intervalo);
                const imagenSeleccionada = imagenActual.src.split("/").pop();
                nombreImagen.textContent = nombres[imagenSeleccionada] || "Desconocido";
            }
        }, tiempo);
    });
});