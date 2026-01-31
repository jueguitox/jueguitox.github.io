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

        const totalAltura = imagenes.length * alto;
        if (offset >= totalAltura) {
            offset = offset % totalAltura;
        }

        slot.style.transform = `translateY(${-offset}px)`;

        const blur = Math.min(velocidad * 0.8, 18);
        slot.style.filter = `blur(${blur}px)`;

        if (frenando) {
            velocidad *= 0.96;

            if (velocidad < 0.3) {
                cancelAnimationFrame(frame);
                ajustarFinal();
                return;
            }
        }

        frame = requestAnimationFrame(animar);
    }


    function ajustarFinal() {
        const index = Math.floor(offset / alto);
        offset = index * alto;

        slot.style.transition = "transform 0.35s ease-out";
        slot.style.filter = "blur(0)";
        slot.style.transform = `translateY(${-offset}px)`;

        const imagenFinal = imagenes[index % imagenes.length];
        nombreImagen.textContent = nombres[imagenFinal] || "Desconocido";

        setTimeout(() => {
            slot.style.transition = "none";
        }, 350);
    }


    boton.addEventListener("click", () => {
        if (!datosCargados) return;

        nombreImagen.textContent = "";
        offset = 0;
        velocidad = 24;
        frenando = false;

        frame = requestAnimationFrame(animar);

        setTimeout(() => {
            frenando = true;
        }, 2500);
    });

});
