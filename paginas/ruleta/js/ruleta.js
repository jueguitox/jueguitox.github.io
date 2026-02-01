document.addEventListener("DOMContentLoaded", () => {
    let imagenes = [];
    let nombres = {};
    let datosCargados = false;

    const slot = document.getElementById("slot");
    const boton = document.getElementById("botonIniciar");
    const nombreImagen = document.getElementById("nombreImagen");

    let alto = 200;
    let offset = 0;
    let velocidad = 0;
    let frenando = false;
    let frame;

    // 🔀 Mezcla Fisher-Yates
    function mezclarArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    fetch("../../../assets/json/ruleta.json")
        .then(res => res.json())
        .then(data => {
            imagenes = Object.keys(data);
            nombres = data;
            datosCargados = true;
            prepararSlot();
        });

    function prepararSlot() {
        slot.innerHTML = "";

        // duplicamos para scroll continuo
        const total = imagenes.concat(imagenes, imagenes);

        total.forEach(img => {
            const i = document.createElement("img");
            i.src = `../../../assets/imagenes/${img}`;
            i.style.height = alto + "px";
            slot.appendChild(i);
        });
    }

    function animar() {
        offset += velocidad;

        const totalAltura = imagenes.length * alto;
        if (offset >= totalAltura) {
            offset %= totalAltura;
        }

        slot.style.transform = `translateY(${-offset}px)`;

        // blur dinámico
        const blur = Math.min(velocidad * 0.8, 18);
        slot.style.filter = `blur(${blur}px)`;

        if (frenando) {
            velocidad *= 0.96;

            if (velocidad < 0.4) {
                cancelarYFinalizar();
                return;
            }
        }

        frame = requestAnimationFrame(animar);
    }

    function cancelarYFinalizar() {
        cancelAnimationFrame(frame);

        const index = Math.floor(offset / alto) % imagenes.length;
        offset = index * alto;

        slot.style.transition = "transform 0.4s ease-out";
        slot.style.filter = "blur(0)";
        slot.style.transform = `translateY(${-offset}px)`;

        nombreImagen.textContent = nombres[imagenes[index]] || "Desconocido";

        setTimeout(() => {
            slot.style.transition = "none";
        }, 400);
    }

    boton.addEventListener("click", () => {
        if (!datosCargados) return;

        nombreImagen.textContent = "";

        // 🔥 CLAVE: desordenamos imágenes antes de girar
        mezclarArray(imagenes);

        prepararSlot();

        offset = 0;
        velocidad = 25;
        frenando = false;

        frame = requestAnimationFrame(animar);

        setTimeout(() => {
            frenando = true;
        }, 2500);
    });
});
