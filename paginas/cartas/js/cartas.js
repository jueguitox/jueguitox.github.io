// Cargar las cartas desde el archivo JSON
fetch('../../../assets/json/cartas.json')
    .then(response => response.json())
    .then(data => {
        const cartas = data;
        const botones = {
            "Desafío": document.getElementById('desafio-btn'),
            "Pregunta": document.getElementById('pregunta-btn'),
            "Fantasía": document.getElementById('fantasia-btn'),
            "Sensación": document.getElementById('sensacion-btn')
        };
        const botonAleatorio = document.getElementById('sacar-carta-btn');
        const contenedorCarta = document.getElementById('contenedor-carta');
        const textoCarta = document.getElementById('texto-carta');

        Object.keys(botones).forEach(tipo => {
            botones[tipo].addEventListener('click', () => mostrarCarta(tipo));
        });

        botonAleatorio.addEventListener('click', mostrarCartaAleatoria);

        function mostrarCarta(tipo) {
            const cartasFiltradas = cartas[tipo];
            if (cartasFiltradas.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * cartasFiltradas.length);
                textoCarta.textContent = cartasFiltradas[indiceAleatorio];

                // Mostrar la carta si no lo está
                if (!contenedorCarta.classList.contains('visible')) {
                    contenedorCarta.classList.add('visible');
                }

                // Activar efecto flip
                contenedorCarta.classList.remove('flip');
                setTimeout(() => {
                    contenedorCarta.classList.add('flip');
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
