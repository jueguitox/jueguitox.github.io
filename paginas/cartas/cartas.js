const catColors = {
            "Desafío":  { color: '#ff2d6b', dot: '#ff2d6b' },
            "Pregunta": { color: '#00d4ff', dot: '#00d4ff' },
            "Fantasía": { color: '#bf5fff', dot: '#bf5fff' },
            "Sensación":{ color: '#ff6b35', dot: '#ff6b35' },
        };

        fetch('../../../assets/json/cartas.json')
            .then(r => r.json())
            .then(data => {
                const cartas = data;
                const botones = {
                    "Desafío":   document.getElementById('desafio-btn'),
                    "Pregunta":  document.getElementById('pregunta-btn'),
                    "Fantasía":  document.getElementById('fantasia-btn'),
                    "Sensación": document.getElementById('sensacion-btn'),
                };
                const contenedorCarta = document.getElementById('contenedor-carta');
                const textoCarta      = document.getElementById('texto-carta');
                const tipoLabel       = document.getElementById('carta-tipo-label');
                const tipoDot         = document.getElementById('carta-dot');

                Object.keys(botones).forEach(tipo => {
                    botones[tipo].addEventListener('click', () => {
                        Object.values(botones).forEach(b => b.classList.remove('activo'));
                        botones[tipo].classList.add('activo');
                        mostrarCarta(tipo);
                    });
                });

                document.getElementById('sacar-carta-btn').addEventListener('click', () => {
                    const tipos = Object.keys(cartas);
                    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
                    Object.entries(botones).forEach(([t,b]) => b.classList.toggle('activo', t === tipo));
                    mostrarCarta(tipo);
                });

                function mostrarCarta(tipo) {
                    const lista = cartas[tipo];
                    if (!lista?.length) return;
                    const txt = lista[Math.floor(Math.random() * lista.length)];
                    textoCarta.textContent = txt;
                    tipoLabel.textContent = tipo;
                    const c = catColors[tipo] || { color: '#ff2d6b', dot: '#ff2d6b' };
                    tipoLabel.style.color = c.color;
                    tipoDot.style.background = c.dot;
                    tipoDot.style.boxShadow = `0 0 8px ${c.dot}`;

                    if (!contenedorCarta.classList.contains('visible')) {
                        contenedorCarta.classList.add('visible');
                    }
                    contenedorCarta.classList.remove('flip-anim');
                    void contenedorCarta.offsetWidth;
                    contenedorCarta.classList.add('flip-anim');
                }
            })
            .catch(err => console.error('Error:', err));