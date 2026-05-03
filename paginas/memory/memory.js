// memory.js

const parejas = {
    suave: [
        { emoji:'💋', label:'Besos',    reto:'Daos 10 besos en distintas partes del cuerpo.' },
        { emoji:'🤲', label:'Masaje',   reto:'Masaje en los hombros durante 2 minutos.' },
        { emoji:'💃', label:'Baile',    reto:'Bailad juntos una canción lenta sin separarnos.' },
        { emoji:'🌸', label:'Caricias', reto:'Acariciad el rostro del otro durante 1 minuto.' },
        { emoji:'👀', label:'Mirada',   reto:'Miraderos a los ojos en silencio durante 30 segundos.' },
        { emoji:'🌙', label:'Susurros', reto:'Susurradle algo bonito al oído.' },
        { emoji:'🦶', label:'Pies',     reto:'Masaje de pies durante 2 minutos cada uno.' },
        { emoji:'🎵', label:'Canción',  reto:'Cantadle el estribillo de su canción favorita.' },
    ],
    picante: [
        { emoji:'🔥', label:'Calor',    reto:'Beso apasionado de 15 segundos, sin parar.' },
        { emoji:'👅', label:'Lengua',   reto:'Besa su cuello durante 30 segundos seguidos.' },
        { emoji:'🍑', label:'Contacto', reto:'Quien ganó esta pareja elige la siguiente zona a explorar.' },
        { emoji:'😈', label:'Travieso', reto:'Dile en voz alta tu fantasía más reciente.' },
        { emoji:'🎰', label:'Suerte',   reto:'El otro lanza los dados y ejecutas lo que salga.' },
        { emoji:'💪', label:'Fuerza',   reto:'Sujetad las manos mientras os besáis durante 1 minuto.' },
        { emoji:'🌡️', label:'Caliente', reto:'Explorad con las manos la espalda del otro durante 1 min.' },
        { emoji:'🫀', label:'Pulso',    reto:'Uno guía las manos del otro donde quiera durante 30s.' },
    ],
    atrevido: [
        { emoji:'⛓️', label:'Dominio',  reto:'El ganador da 3 órdenes que el otro debe cumplir ahora.' },
        { emoji:'🎭', label:'Rol',      reto:'Inventad un rol en 30 segundos y actuadlo 2 minutos.' },
        { emoji:'🔮', label:'Secreto',  reto:'Confiesa la fantasía que más vergüenza te da.' },
        { emoji:'💣', label:'Reto',     reto:'Propón algo que nunca hayáis hecho y decidid si lo hacéis.' },
        { emoji:'🕯️', label:'Íntimo',   reto:'5 minutos de exploración sin restricciones.' },
        { emoji:'🎯', label:'Diana',    reto:'Señala la zona del cuerpo que más quieres que te atiendan.' },
        { emoji:'🌊', label:'Oleaje',   reto:'Moveos al unísono durante 2 minutos sin separaros.' },
        { emoji:'💎', label:'Premio',   reto:'El ganador elige cualquier reto de los demás juegos.' },
    ]
};

let nivel = 'suave';
let cartasVolteadas = [];
let parejasEncontradas = 0;
let intentos = 0;
let bloqueado = false;
let timerInterval = null;
let segundos = 0;
let juegoIniciado = false;
const totalParejas = 8;

function mezclar(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function iniciarTimer() {
    clearInterval(timerInterval);
    segundos = 0;
    actualizarTiempo();
    timerInterval = setInterval(() => {
        segundos++;
        actualizarTiempo();
    }, 1000);
}

function detenerTimer() { clearInterval(timerInterval); }

function actualizarTiempo() {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    document.getElementById('stat-tiempo').textContent =
        m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function nuevaPartida() {
    detenerTimer();
    juegoIniciado = false;
    cartasVolteadas = [];
    parejasEncontradas = 0;
    intentos = 0;
    segundos = 0;
    bloqueado = false;

    document.getElementById('stat-parejas').textContent = `0/${totalParejas}`;
    document.getElementById('stat-intentos').textContent = '0';
    actualizarTiempo();

    document.getElementById('win-overlay').classList.remove('visible');
    document.getElementById('reto-overlay').classList.remove('visible');

    construirTablero();
}

function construirTablero() {
    const tablero = document.getElementById('tablero');
    tablero.innerHTML = '';

    const lista = parejas[nivel];
    const dobles = mezclar([...lista, ...lista].map((p, i) => ({ ...p, uid: i })));

    dobles.forEach((item, idx) => {
        const carta = document.createElement('div');
        carta.className = 'carta';
        carta.dataset.emoji  = item.emoji;
        carta.dataset.label  = item.label;
        carta.dataset.reto   = item.reto;
        carta.dataset.idx    = idx;

        carta.innerHTML = `
            <div class="carta-inner">
                <div class="carta-dorso">
                    <span class="carta-dorso-icon">✦</span>
                </div>
                <div class="carta-frente">
                    <span class="carta-frente-emoji">${item.emoji}</span>
                    <span class="carta-frente-label">${item.label}</span>
                </div>
            </div>`;

        carta.addEventListener('click', () => voltearCarta(carta));
        tablero.appendChild(carta);

        // Entrada escalonada
        carta.style.opacity = '0';
        carta.style.transform = 'scale(0.8)';
        setTimeout(() => {
            carta.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            carta.style.opacity = '1';
            carta.style.transform = 'scale(1)';
        }, idx * 40);
    });
}

function voltearCarta(carta) {
    if (bloqueado) return;
    if (carta.classList.contains('volteada')) return;
    if (carta.classList.contains('emparejada')) return;
    if (cartasVolteadas.length >= 2) return;

    if (!juegoIniciado) { iniciarTimer(); juegoIniciado = true; }

    carta.classList.add('volteada');
    cartasVolteadas.push(carta);

    if (cartasVolteadas.length === 2) {
        intentos++;
        document.getElementById('stat-intentos').textContent = intentos;
        bloqueado = true;
        setTimeout(comprobar, 900);
    }
}

function comprobar() {
    const [c1, c2] = cartasVolteadas;
    const match = c1.dataset.emoji === c2.dataset.emoji;

    if (match) {
        c1.classList.add('emparejada');
        c2.classList.add('emparejada');
        parejasEncontradas++;
        document.getElementById('stat-parejas').textContent = `${parejasEncontradas}/${totalParejas}`;
        cartasVolteadas = [];
        bloqueado = false;
        if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
        mostrarReto(c1.dataset.emoji, c1.dataset.reto);
    } else {
        c1.classList.add('error');
        c2.classList.add('error');
        setTimeout(() => {
            c1.classList.remove('volteada', 'error');
            c2.classList.remove('volteada', 'error');
            cartasVolteadas = [];
            bloqueado = false;
        }, 700);
    }
}

function mostrarReto(emoji, texto) {
    document.getElementById('reto-emoji').textContent = emoji;
    document.getElementById('reto-texto').textContent = texto;
    document.getElementById('reto-overlay').classList.add('visible');
}

document.getElementById('reto-ok').addEventListener('click', () => {
    document.getElementById('reto-overlay').classList.remove('visible');
    if (parejasEncontradas === totalParejas) {
        detenerTimer();
        setTimeout(mostrarVictoria, 400);
    }
});

function mostrarVictoria() {
    document.getElementById('win-intentos').textContent = intentos;
    document.getElementById('win-tiempo').textContent =
        Math.floor(segundos/60) > 0 ? `${Math.floor(segundos/60)}m ${segundos%60}s` : `${segundos}s`;
    document.getElementById('win-overlay').classList.add('visible');
}

document.querySelectorAll('.btn-nivel').forEach(b => {
    b.addEventListener('click', () => {
        document.querySelectorAll('.btn-nivel').forEach(x => x.classList.remove('activo'));
        b.classList.add('activo');
        nivel = b.dataset.nivel;
        nuevaPartida();
    });
});

document.getElementById('btn-nueva-partida').addEventListener('click', nuevaPartida);
document.getElementById('btn-reiniciar').addEventListener('click', nuevaPartida);

// Init
nuevaPartida();
