document.addEventListener("DOMContentLoaded", () => {
    let imagenes = [];
    let nombres = {};
    let datosCargados = false;

    fetch("../../../assets/json/ruleta.json")
        .then(res => res.json())
        .then(data => {
            imagenes = Object.keys(data);
            nombres = data;
            datosCargados = true;
            prepararSlot();
        });

    const slot = document.getElementById("slot");
    const boton = document.getElementById("botonIniciar");
    const nombreImagen = document.getElementById("nombreImagen");

    const alto = 200;
    let offset = 0;
    let velocidad = 0;
    let frenando = false;
    let imagenFinal = "";

    function prepararSlot() {
        // duplicamos imágenes para scroll infinito
        const total = imagenes.concat(imagenes, imagenes);

        slot.innerHTML = "";
        total.forEach(img => {
            const i = document.createElement("img");
            i.src = `../../../assets/imagenes/${img}`;
            slot.appendChild(i);
        });
    }

    function animar() {
        offset += velocidad;

        if (offset >= imagenes.length * alto) {
            offset = 0;
        }

        slot.style.transform = `translateY(${-offset}px)`;

        // BLUR dinámico según velocidad
        const blur = Math.min(velocidad / 2, 20);
        slot.style.filter = `blur(${blur}px)`;

        if (frenando) {
            velocidad *= 0.97;

            if (velocidad < 0.5) {
                velocidad = 0;
                finalizar();
                return;
            }
        }

        requestAnimationFrame(animar);
    }

    function finalizar() {
        const index = Math.floor(offset / alto);
        const ajuste = index * alto;

        slot.style.filter = "blur(0px)";
        slot.style.transition = "transform 0.4s ease-out";
        slot.style.transform = `translateY(${-ajuste}px)`;

        imagenFinal = imagenes[index % imagenes.length];
        nombreImagen.textContent = nombres[imagenFinal] || "Desconocido";

        setTimeout(() => {
            slot.style.transition = "none";
        }, 400);
    }

    boton.addEventListener("click", () => {
        if (!datosCargados) return;

        nombreImagen.textContent = "";
        offset = 0;
        velocidad = 25;
        frenando = false;

        requestAnimationFrame(animar);

        setTimeout(() => {
            frenando = true;
        }, 2500);
    });
});
