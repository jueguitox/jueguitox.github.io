const rodilloData = {
        suave: {
            acciones: [
                { emoji:'💋', label:'Besar',    texto:'dar besos en' },
                { emoji:'🤲', label:'Masajear', texto:'masajear' },
                { emoji:'🫦', label:'Mordiscar',texto:'mordiscar suavemente' },
                { emoji:'✋', label:'Acariciar', texto:'acariciar' },
                { emoji:'🫁', label:'Soplar',   texto:'soplar suavemente en' },
                { emoji:'👁',  label:'Mirar',   texto:'mirar fijamente mientras tocas' },
            ],
            zonas: [
                { emoji:'🦶', label:'Pies',      texto:'los pies' },
                { emoji:'🦵', label:'Piernas',   texto:'las piernas' },
                { emoji:'🫸', label:'Espalda',   texto:'la espalda' },
                { emoji:'🫅', label:'Cuello',    texto:'el cuello' },
                { emoji:'💪', label:'Brazos',    texto:'los brazos' },
                { emoji:'🌸', label:'Rostro',    texto:'el rostro' },
            ],
            tiempos: [
                { emoji:'⏱', label:'30s',  texto:'durante 30 segundos' },
                { emoji:'⏱', label:'1min', texto:'durante 1 minuto' },
                { emoji:'⏱', label:'2min', texto:'durante 2 minutos' },
                { emoji:'🔁', label:'3x',   texto:'tres veces seguidas' },
            ]
        },
        picante: {
            acciones: [
                { emoji:'💋', label:'Besar',     texto:'besar apasionadamente' },
                { emoji:'👅', label:'Lamer',     texto:'lamer' },
                { emoji:'🫦', label:'Morder',    texto:'morder' },
                { emoji:'🔥', label:'Frotar',    texto:'frotar lentamente' },
                { emoji:'✋', label:'Pellizcar', texto:'pellizcar suavemente' },
                { emoji:'🤲', label:'Apretar',   texto:'apretar y soltar' },
            ],
            zonas: [
                { emoji:'🦵', label:'Muslos',    texto:'los muslos' },
                { emoji:'🍑', label:'Glúteos',   texto:'los glúteos' },
                { emoji:'🫸', label:'Espalda',   texto:'la espalda baja' },
                { emoji:'🫅', label:'Cuello',    texto:'el cuello y nuca' },
                { emoji:'🌸', label:'Abdomen',   texto:'el abdomen' },
                { emoji:'💪', label:'Pecho',     texto:'el pecho' },
            ],
            tiempos: [
                { emoji:'⏱', label:'1min',  texto:'durante 1 minuto sin parar' },
                { emoji:'⏱', label:'2min',  texto:'durante 2 minutos' },
                { emoji:'⏱', label:'3min',  texto:'durante 3 minutos' },
                { emoji:'🔁', label:'5x',    texto:'cinco veces, lento' },
            ]
        },
        salvaje: {
            acciones: [
                { emoji:'🔥', label:'Devorar',   texto:'devorar' },
                { emoji:'👅', label:'Explorar',  texto:'explorar con la lengua' },
                { emoji:'🫦', label:'Morder',    texto:'morder fuerte' },
                { emoji:'🤲', label:'Dominar',   texto:'sujetar mientras besas' },
                { emoji:'💋', label:'Chupar',    texto:'chupar' },
                { emoji:'✋', label:'Azotar',    texto:'dar palmadas suaves en' },
            ],
            zonas: [
                { emoji:'🍑', label:'Glúteos',   texto:'los glúteos' },
                { emoji:'🦵', label:'Muslos int.',texto:'la cara interna del muslo' },
                { emoji:'🌸', label:'Zona íntima',texto:'la zona más íntima' },
                { emoji:'🫅', label:'Cuello',    texto:'el cuello' },
                { emoji:'💪', label:'Pecho',     texto:'el pecho' },
                { emoji:'🫸', label:'Espalda',   texto:'la espalda entera' },
            ],
            tiempos: [
                { emoji:'⏱', label:'2min',  texto:'durante 2 minutos sin parar' },
                { emoji:'⏱', label:'5min',  texto:'durante 5 minutos' },
                { emoji:'🔁', label:'Hasta que pares', texto:'hasta que la otra persona diga basta' },
                { emoji:'🎲', label:'A elegir', texto:'el tiempo que quieras' },
            ]
        }
    };

    let modo = 'suave';
    let spinning = false;
    const SYMBOL_H = 100;

    function buildReel(innerEl, symbols) {
        innerEl.innerHTML = '';
        // Triplicar para efecto scroll
        const all = [...symbols, ...symbols, ...symbols];
        all.forEach(s => {
            const div = document.createElement('div');
            div.className = 'rodillo-symbol';
            div.textContent = s.emoji;
            innerEl.appendChild(div);
        });
        // Posición inicial: mitad
        innerEl.style.transform = `translateY(-${symbols.length * SYMBOL_H}px)`;
    }

    function initReels() {
        const d = rodilloData[modo];
        buildReel(document.getElementById('ri1'), d.acciones);
        buildReel(document.getElementById('ri2'), d.zonas);
        buildReel(document.getElementById('ri3'), d.tiempos);
    }

    function spinReel(innerEl, symbols, finalIdx, delay) {
        return new Promise(resolve => {
            const startOffset = symbols.length * SYMBOL_H;
            const totalSymbols = symbols.length;
            const extraSpins = 3 + Math.floor(Math.random() * 3); // 3-5 vueltas extra
            const targetOffset = startOffset + (extraSpins * totalSymbols + finalIdx) * SYMBOL_H;

            setTimeout(() => {
                innerEl.style.transition = `transform ${1.2 + delay * 0.3}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
                innerEl.style.transform = `translateY(-${targetOffset}px)`;

                setTimeout(() => {
                    // Reset sin animación para loop
                    innerEl.style.transition = 'none';
                    innerEl.style.transform = `translateY(-${startOffset + finalIdx * SYMBOL_H}px)`;
                    resolve();
                }, (1.2 + delay * 0.3) * 1000 + 50);
            }, delay * 200);
        });
    }

    async function tirar() {
        if (spinning) return;
        spinning = true;
        document.getElementById('btn-tirar').disabled = true;

        const d = rodilloData[modo];
        const badge = document.getElementById('result-badge');
        badge.classList.add('visible');
        badge.textContent = '🎰 Girando...';

        // Ocultar resultado previo
        const card = document.getElementById('result-card');
        card.classList.remove('visible');

        // Elegir resultados aleatorios
        const idxA = Math.floor(Math.random() * d.acciones.length);
        const idxZ = Math.floor(Math.random() * d.zonas.length);
        const idxT = Math.floor(Math.random() * d.tiempos.length);

        const ri1 = document.getElementById('ri1');
        const ri2 = document.getElementById('ri2');
        const ri3 = document.getElementById('ri3');

        // Girar los tres rodillos con delay escalonado
        await Promise.all([
            spinReel(ri1, d.acciones, idxA, 0),
            spinReel(ri2, d.zonas,    idxZ, 1),
            spinReel(ri3, d.tiempos,  idxT, 2),
        ]);

        // Mostrar resultado
        const accion = d.acciones[idxA];
        const zona   = d.zonas[idxZ];
        const tiempo = d.tiempos[idxT];

        const esJackpot = idxA === idxZ && idxZ === idxT; // mismos índices = jackpot especial
        badge.textContent = esJackpot ? '🎉 ¡JACKPOT!' : `${accion.emoji} ${zona.emoji} ${tiempo.emoji}`;

        document.getElementById('result-texto').textContent =
            `Debes ${accion.texto} ${zona.texto} ${tiempo.texto}.`;
        document.getElementById('result-combo').textContent =
            esJackpot ? '🎰 ¡Triple combinación! Doble reto.' : '';

        if (esJackpot) {
            document.querySelector('h1').classList.add('jackpot');
            setTimeout(() => document.querySelector('h1').classList.remove('jackpot'), 2500);
        }

        card.style.display = 'block';
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));

        if (navigator.vibrate) navigator.vibrate(esJackpot ? [100,50,100,50,300] : [100,50,150]);

        spinning = false;
        document.getElementById('btn-tirar').disabled = false;
    }

    document.querySelectorAll('.btn-modo').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.btn-modo').forEach(x => x.classList.remove('activo'));
            b.classList.add('activo');
            modo = b.dataset.modo;
            document.getElementById('result-card').classList.remove('visible');
            document.getElementById('result-badge').classList.remove('visible');
            initReels();
        });
    });

    document.getElementById('btn-tirar').addEventListener('click', tirar);

    initReels();