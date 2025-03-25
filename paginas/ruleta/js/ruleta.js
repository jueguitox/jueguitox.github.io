document.addEventListener("DOMContentLoaded", () => {
    let imagenes = [];
    let nombres = {};
    let datosCargados = false;
    
    fetch("../../../assets/json/ruleta.json")
        .then(response => response.json())
        .then(data => {
            imagenes = Object.keys(data);
            nombres = data;
            datosCargados = true;
        })
        .catch(error => console.error("Error cargando el JSON:", error));
    
    const imagenActual = document.getElementById("imagenActual");
    const botonIniciar = document.getElementById("botonIniciar");
    const nombreImagen = document.getElementById("nombreImagen");
    let intervalo;

    botonIniciar.addEventListener("click", () => {
        if (!datosCargados || imagenes.length === 0) {
            console.error("Los datos de la ruleta no están disponibles.");
            return;
        }

        let tiempo = 100;
        let contador = 0;
        let duracion = 5000; // Duración total de la ruleta en milisegundos
        let inicio = Date.now();

        clearInterval(intervalo);
        nombreImagen.textContent = "";
        imagenActual.style.display = "block";
        
        intervalo = setInterval(() => {
            let indice = contador % imagenes.length;
            let imagenSeleccionada = imagenes[indice];
            imagenActual.src = `../../../assets/imagenes/${imagenSeleccionada}`;
            contador++;

            if (Date.now() - inicio >= duracion) {
                clearInterval(intervalo);
                nombreImagen.textContent = nombres[imagenSeleccionada] || "Desconocido";
            }
        }, tiempo);
    });
});
