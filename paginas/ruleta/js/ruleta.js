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

    let girando = false;

    botonIniciar.addEventListener("click", () => {
        if (!datosCargados || imagenes.length === 0 || girando) return;

        girando = true;
        nombreImagen.textContent = "";
        imagenActual.style.display = "block";

        let tiempo = 80;              // velocidad inicial
        let incremento = 20;          // cuánto se frena
        let vueltas = 25;             // cantidad de cambios
        let contador = 0;
        let imagenFinal = "";

        function girar() {
            imagenActual.style.opacity = 0;

            setTimeout(() => {
                const indice = Math.floor(Math.random() * imagenes.length);
                imagenFinal = imagenes[indice];
                imagenActual.src = `../../../assets/imagenes/${imagenFinal}`;
                imagenActual.style.opacity = 1;

                contador++;
                tiempo += incremento;

                if (contador < vueltas) {
                    setTimeout(girar, tiempo);
                } else {
                    nombreImagen.textContent = nombres[imagenFinal] || "Desconocido";
                    girando = false;
                }
            }, 200);
        }

        girar();
    });
});
