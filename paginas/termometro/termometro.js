// termometro.js

const niveles = [
    {
        nombre: 'Calentando motores',
        desc: 'Nivel suave',
        color: '#00d4ff',
        retos: [
            'Daos la mano y mantened el contacto durante 2 minutos sin soltaros.',
            'Miraderos a los ojos en silencio durante 30 segundos.',
            'Uno acaricia el cabello del otro durante 1 minuto.',
            'Daos un abrazo largo, al menos 20 segundos.',
            'Susurrad algo bonito al oído mutuamente.',
            'Sentaos espalda con espalda y respirad al mismo ritmo 1 minuto.',
        ]
    },
    {
        nombre: 'Temperatura en aumento',
        desc: 'Nivel 2 — Romántico',
        color: '#00ffb3',
        retos: [
            'Daos 5 besos lentos, en la mejilla, frente, nariz, cuello y labios.',
            'Uno lee en voz alta los mensajes de amor más bonitos que se hayan mandado.',
            'Bailad juntos sin música durante 2 minutos.',
            'Uno masajea los hombros del otro durante 3 minutos.',
            'Describid con detalle el primer recuerdo que tenéis el uno del otro.',
            'Escribid en el brazo del otro una palabra con el dedo que tenga que adivinar.',
        ]
    },
    {
        nombre: 'El termómetro sube',
        desc: 'Nivel 3 — Sensual',
        color: '#7fff00',
        retos: [
            'Un beso apasionado que dure exactamente 15 segundos.',
            'Uno elige una zona del cuerpo del otro para explorar con las manos durante 1 minuto.',
            'Leed en voz alta la última conversación de WhatsApp que os pusiera nerviosos.',
            'Uno guía las manos del otro donde quiera durante 30 segundos.',
            'Describid en detalle qué os gustó la última vez que estuvisteis íntimos.',
            'Uno besa el cuello del otro durante 30 segundos sin parar.',
        ]
    },
    {
        nombre: 'Zona de calor',
        desc: 'Nivel 4 — Picante',
        color: '#ffd23f',
        retos: [
            'Quitaos una prenda de ropa cada uno.',
            'Explorad la espalda del otro con la boca durante 1 minuto.',
            'Dile en voz alta la fantasía que más vergüenza te da.',
            'Uno elige una posición para estar durante 2 minutos.',
            'Describid sin tapujos qué es lo que más os excita del otro.',
            'Juego de miradas: miraderos a los ojos mientras os tocáis durante 1 minuto.',
        ]
    },
    {
        nombre: 'Fuego encendido',
        desc: 'Nivel 5 — Atrevido',
        color: '#ff6b35',
        retos: [
            'Quitaos otra prenda. El que se niegue cumple un reto doble.',
            'Uno tiene 2 minutos para hacer lo que quiera al otro, sin límites acordados.',
            'Proponad algo que nunca hayáis hecho y decidid si lo hacéis ahora.',
            'El que pierda la próxima ronda obedece cualquier orden de quien gane.',
            'Explorad juntos una zona nueva que normalmente no atendéis.',
            'Describid, con todo detalle, cómo queréis que acabe la noche.',
        ]
    },
    {
        nombre: 'Al rojo vivo',
        desc: 'Nivel 6 — Muy atrevido',
        color: '#ff2d6b',
        retos: [
            'Sin ropa. El que ponga una excusa, penitencia doble.',
            'El otro tiene control total durante 3 minutos. Sin negativas.',
            'Proponad un juego de roles y empezadlo ahora mismo.',
            'Cumplid esa fantasía que lleváis tiempo posponiendo.',
            'El que proponga algo más atrevido, el otro debe intentarlo.',
            'Inventad una "regla nueva" para esta noche que nunca hayáis aplicado.',
        ]
    },
    {
        nombre: '¡TEMPERATURA MÁXIMA!',
        desc: 'Nivel 7 — Sin límites',
        color: '#ff0040',
        retos: [
            'Sin restricciones. La noche es vuestra. Haced lo que siempre habéis querido.',
            '10 minutos en los que el otro tiene control absoluto. Completamente.',
            'Realizad esa fantasía número uno que ninguno se había atrevido a proponer.',
            'Inventad juntos el mejor momento de vuestra vida íntima. Ahora.',
            'El nivel máximo no tiene retos: cread los vuestros propios en tiempo real.',
            'Solo una regla: decid "sí" a todo lo que proponga el otro esta noche.',
        ]
    }
];

const TOTAL_NIVELES = niveles.length;
const RETOS_POR_NIVEL = 3; // retos antes de poder subir

let nivelActual = 0;
let retosHechosEnNivel = 0;
let retosUsadosEnNivel = [];
let totalRetos = 0;

/* ---- UI HELPERS ---- */
function colorNivel(n) { return niveles[Math.min(n, TOTAL_NIVELES-1)].color; }

function actualizarColor() {
    const c = colorNivel(nivelActual);
    // Termómetro fill
    const pct = ((nivelActual) / (TOTAL_NIVELES - 1)) * 100;
    document.getElementById('termo-fill').style.height = Math.max(4, pct) + '%';
    document.getElementById('termo-fill').style.background = c;
    document.getElementById('termo-fill').style.boxShadow = `0 0 12px ${c}`;
    // Bulb
    document.getElementById('termo-bulb-inner').style.background = c;
    document.getElementById('termo-bulb-inner').style.boxShadow = `0 0 16px ${c}`;
    // Reto card top border
    document.getElementById('reto-card').style.borderTopColor = c;
    document.getElementById('reto-dot').style.background = c;
    document.getElementById('reto-dot').style.boxShadow = `0 0 8px ${c}`;
    document.getElementById('reto-lbl').style.color = c;
    // Nivel info
    document.getElementById('nivel-num').style.color = c;
    document.getElementById('nivel-num').style.textShadow = `0 0 20px ${c}`;
    // Labels laterales
    actualizarLabels();
    // Badge
    document.getElementById('termo-nivel-badge').textContent = `Nivel ${nivelActual + 1}`;
    // Historial dots color
    document.querySelectorAll('.hist-dot.hecho').forEach(d => {
        d.style.background = c;
        d.style.boxShadow = `0 0 6px ${c}`;
    });
}

function actualizarLabels() {
    const container = document.getElementById('termo-labels');
    container.innerHTML = '';
    niveles.forEach((n, i) => {
        const div = document.createElement('div');
        div.className = 'termo-label' + (i === nivelActual ? ' activo' : '');
        if (i === nivelActual) {
            div.style.color = n.color;
            div.querySelector?.('.termo-label-dot')?.style?.setProperty('background', n.color);
        }
        div.innerHTML = `<div class="termo-label-dot" style="${i === nivelActual ? `background:${n.color};box-shadow:0 0 8px ${n.color}` : ''}"></div>${n.nombre}`;
        container.appendChild(div);
    });
}

function actualizarNivelInfo() {
    const n = niveles[nivelActual];
    document.getElementById('nivel-num').textContent = nivelActual + 1;
    document.getElementById('nivel-nombre').textContent = n.nombre;
    document.getElementById('nivel-desc').textContent = n.desc;
    document.getElementById('reto-lbl').textContent = `Reto nivel ${nivelActual + 1}`;
}

function actualizarHistorial() {
    const wrap = document.getElementById('historial-wrap');
    const dots = document.getElementById('historial-dots');
    const lbl  = document.getElementById('historial-lbl');
    wrap.style.display = 'block';
    lbl.textContent = `Retos completados en nivel ${nivelActual + 1} (${retosHechosEnNivel}/${RETOS_POR_NIVEL} para subir)`;
    dots.innerHTML = '';
    for (let i = 0; i < RETOS_POR_NIVEL; i++) {
        const d = document.createElement('div');
        d.className = 'hist-dot' + (i < retosHechosEnNivel ? ' hecho' : '');
        if (i < retosHechosEnNivel) {
            d.style.background = colorNivel(nivelActual);
            d.style.boxShadow = `0 0 6px ${colorNivel(nivelActual)}`;
        }
        dots.appendChild(d);
    }
    // Actualizar botón subir
    const btnSubir = document.getElementById('btn-subir');
    if (retosHechosEnNivel >= RETOS_POR_NIVEL) {
        btnSubir.style.opacity = '1';
        btnSubir.style.pointerEvents = 'auto';
        btnSubir.style.borderColor = 'rgba(255,45,107,0.6)';
        btnSubir.textContent = '⬆ Subir al nivel ' + (nivelActual + 2);
    } else {
        btnSubir.style.opacity = '0.35';
        btnSubir.style.pointerEvents = 'none';
        btnSubir.textContent = `⬆ Completa ${RETOS_POR_NIVEL - retosHechosEnNivel} reto(s) más para subir`;
    }
    if (nivelActual >= TOTAL_NIVELES - 1) {
        btnSubir.style.display = 'none';
    } else {
        btnSubir.style.display = '';
    }
}

/* ---- RETO ---- */
function siguienteReto() {
    const n = niveles[nivelActual];
    const disponibles = n.retos.filter((_, i) => !retosUsadosEnNivel.includes(i));
    let idx;
    if (disponibles.length === 0) {
        retosUsadosEnNivel = [];
        idx = Math.floor(Math.random() * n.retos.length);
    } else {
        const disp = n.retos.map((_,i) => i).filter(i => !retosUsadosEnNivel.includes(i));
        idx = disp[Math.floor(Math.random() * disp.length)];
    }
    retosUsadosEnNivel.push(idx);
    retosHechosEnNivel++;
    totalRetos++;

    document.getElementById('reto-texto').textContent = n.retos[idx];
    document.getElementById('reto-num').textContent = `#${totalRetos}`;

    // Animación
    const retoCard = document.getElementById('reto-card');
    retoCard.style.opacity = '0';
    retoCard.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => {
        retoCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        retoCard.style.opacity = '1';
        retoCard.style.transform = 'translateY(0)';
    });

    actualizarHistorial();
    if (navigator.vibrate) navigator.vibrate(80);
}

/* ---- SUBIR NIVEL ---- */
function subirNivel() {
    if (nivelActual >= TOTAL_NIVELES - 1) {
        document.getElementById('tope-overlay').classList.add('visible');
        return;
    }
    nivelActual++;
    retosHechosEnNivel = 0;
    retosUsadosEnNivel = [];

    // Efecto visual de subida
    const info = document.getElementById('nivel-info');
    info.classList.remove('pulsando');
    void info.offsetWidth;
    info.classList.add('pulsando');

    actualizarNivelInfo();
    actualizarColor();
    actualizarHistorial();

    if (nivelActual >= TOTAL_NIVELES - 1) {
        setTimeout(() => document.getElementById('tope-overlay').classList.add('visible'), 800);
    }

    if (navigator.vibrate) navigator.vibrate([100,50,100,50,200]);
}

/* ---- RESET ---- */
function reset() {
    nivelActual = 0;
    retosHechosEnNivel = 0;
    retosUsadosEnNivel = [];
    totalRetos = 0;
    document.getElementById('tope-overlay').classList.remove('visible');
    document.getElementById('reto-texto').textContent = 'Pulsa "Siguiente reto" para comenzar en el nivel 1.';
    document.getElementById('reto-num').textContent = '#0';
    actualizarNivelInfo();
    actualizarColor();
    actualizarHistorial();
    // Reiniciar historial wrap
    document.getElementById('historial-wrap').style.display = 'none';
    // Reset animaciones reto card
    const c = document.getElementById('reto-card');
    c.style.transition = 'none';
    c.style.opacity = '1';
    c.style.transform = 'none';
}

/* ---- EVENTOS ---- */
document.getElementById('btn-siguiente').addEventListener('click', siguienteReto);
document.getElementById('btn-subir').addEventListener('click', subirNivel);
document.getElementById('btn-reset').addEventListener('click', reset);
document.getElementById('btn-tope-ok').addEventListener('click', () => {
    document.getElementById('tope-overlay').classList.remove('visible');
});

// Init
reset();
