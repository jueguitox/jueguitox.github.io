// Cargar las cartas desde el archivo JSON
fetch('../../../../assets/cartas/cartas.json')
    .then(response => response.json())
    .then(data => {
        const cartas = data.cartas; // Obtener las cartas del JSON
        const botonSacarCarta = document.getElementById('sacar-carta-btn');
        const botonDesafio = document.getElementById('desafio-btn');
        const botonPregunta = document.getElementById('pregunta-btn');
        const botonFantasia = document.getElementById('fantasia-btn');
        const botonSensacion = document.getElementById('sensacion-btn');
        const contenedorCarta = document.getElementById('texto-carta');

        botonSacarCarta.addEventListener('click', () => {
            const cartaAleatoria = obtenerCartaAleatoria(cartas);
            contenedorCarta.textContent = cartaAleatoria;
        });

        botonDesafio.addEventListener('click', () => {
            const cartaDesafio = obtenerCartaPorTipo(cartas, 'Desafío');
            contenedorCarta.textContent = cartaDesafio;
        });

        botonPregunta.addEventListener('click', () => {
            const cartaPregunta = obtenerCartaPorTipo(cartas, 'Pregunta');
            contenedorCarta.textContent = cartaPregunta;
        });

        botonFantasia.addEventListener('click', () => {
            const cartaFantasia = obtenerCartaPorTipo(cartas, 'Fantasía');
            contenedorCarta.textContent = cartaFantasia;
        });

        botonSensacion.addEventListener('click', () => {
            const cartaSensacion = obtenerCartaPorTipo(cartas, 'Sensación');
            contenedorCarta.textContent = cartaSensacion;
        });

        // Función para obtener una carta aleatoria
        function obtenerCartaAleatoria(cartas) {
            const indiceAleatorio = Math.floor(Math.random() * cartas.length);
            return cartas[indiceAleatorio].texto;
        }

        // Función para obtener una carta por tipo
        function obtenerCartaPorTipo(cartas, tipo) {
            const cartasFiltradas = cartas[tipo];
            const indiceAleatorio = Math.floor(Math.random() * cartasFiltradas.length);
            return cartasFiltradas[indiceAleatorio];
        }
    })
    .catch(error => console.error('Error al cargar las cartas:', error));
