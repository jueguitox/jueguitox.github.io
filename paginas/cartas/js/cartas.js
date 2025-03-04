// Cargar las cartas desde el archivo JSON
fetch('../../../../assets/cartas/cartas.json')
    .then(response => response.json())
    .then(data => {
        const cartas = data;
        const botonSacarCarta = document.getElementById('sacar-carta-btn');
        const botonDesafio = document.getElementById('desafio-btn');
        const botonPregunta = document.getElementById('pregunta-btn');
        const botonFantasia = document.getElementById('fantasia-btn');
        const botonSensacion = document.getElementById('sensacion-btn');
        const contenedorCarta = document.getElementById('contenedor-carta');
        const textoCarta = document.getElementById('texto-carta');

        botonDesafio.addEventListener('click', () => mostrarCarta('Desafío'));
        botonPregunta.addEventListener('click', () => mostrarCarta('Pregunta'));
        botonFantasia.addEventListener('click', () => mostrarCarta('Fantasía'));
        botonSensacion.addEventListener('click', () => mostrarCarta('Sensación'));
        botonSacarCarta.addEventListener('click', mostrarCartaAleatoria);

        function mostrarCarta(tipo) {
            const cartasFiltradas = cartas[tipo];
            if (cartasFiltradas.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * cartasFiltradas.length);
                textoCarta.textContent = cartasFiltradas[indiceAleatorio];
                
                // Reiniciar animación
                contenedorCarta.style.opacity = "0";
                contenedorCarta.style.transform = "rotateY(90deg)";
                setTimeout(() => {
                    contenedorCarta.style.opacity = "1";
                    contenedorCarta.style.transform = "rotateY(0)";
                }, 100);
            }
        }

        function mostrarCartaAleatoria() {
            const tipos = Object.keys(cartas);
            const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
            mostrarCarta(tipoAleatorio);
        }
    })
    .catch(error => console.error('Error al cargar las cartas:', error));
