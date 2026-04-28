document.addEventListener("DOMContentLoaded", () => {
    const mapa = L.map('mapa').setView([42.4310, -8.6444], 13); // Pontevedra

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    fetch("../../../assets/json/lugares.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (!datos.lugares || !Array.isArray(datos.lugares)) {
                console.error("Formato incorrecto en JSON");
                return;
            }

            datos.lugares.forEach(({ latitud, longitud, nombre, descripcion }) => {
                if (latitud && longitud) {
                    L.marker([latitud, longitud]).addTo(mapa)
                        .bindPopup(`<b>${nombre}</b><br>${descripcion}`);
                }
            });
        })
        .catch(error => console.error("Error al cargar el JSON:", error));
});
