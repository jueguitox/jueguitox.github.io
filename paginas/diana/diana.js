// diana.js

const retos = {
    suave: [
        // [puntos, zona, reto]
        [10, 'Diana', 'Has dado en el centro. Elige: masaje o besos donde quieras.'],
        [8,  'Zona 8', 'Masaje en la espalda durante 2 minutos.'],
        [6,  'Zona 6', 'Besa el cuello y los hombros durante 30 segundos.'],
        [4,  'Zona 4', 'Acaricia el cabello durante 1 minuto.'],
        [2,  'Zona 2', 'Toma la mano de tu pareja y no la sueltes en 1 minuto.'],
        [1,  'Borde',  'Susurra algo bonito al oído.'],
    ],
    picante: [
        [10, 'Diana',  '¡Centro! Elige cualquier zona del cuerpo para explorar 1 min.'],
        [8,  'Zona 8', 'Besos apasionados durante 20 segundos seguidos.'],
        [6,  'Zona 6', 'Mordiscos suaves en el cuello durante 30 segundos.'],
        [4,  'Zona 4', 'Las manos libres por la espalda durante 1 minuto.'],
        [2,  'Zona 2', 'Dile en voz alta la parte que más te gusta de su cuerpo.'],
        [1,  'Borde',  'Frotar la nariz contra el cuello del otro durante 20 segundos.'],
    ],
    salvaje: [
        [10, 'Diana',  '¡BULLSEYE! Das 3 órdenes que se cumplirán ahora mismo.'],
        [8,  'Zona 8', 'Exploración libre de 2 minutos sin restricciones.'],
        [6,  'Zona 6', 'Besa y muerde donde quieras durante 1 minuto.'],
        [4,  'Zona 4', 'El otro obedece lo que pidas durante 1 minuto.'],
        [2,  'Zona 2', 'Elige la próxima posición que probaréis.'],
        [1,  'Borde',  'Confiesa algo que nunca hayas dicho en voz alta.'],
    ]
};

// Colores de los anillos de dentro a fuera
const anillos = [
    { r: 20,  color: '#ff0040', label: 'Diana (10)',  pts: 10 },
    { r: 45,  color: '#ff3060', label: 'Zona 8',      pts: 8  },
    { r: 72,  color: '#c41e3a', label: 'Zona 6',      pts: 6  },
    { r: 99,  color: '#8b1a2f', label: 'Zona 4',      pts: 4  },
    { r: 126, color: '#3a0010', label: 'Zona 2',      pts: 2  },
    { r: 148, color: '#1a0008', label: 'Borde',       pts: 1  },
];

const canvas  = document.getElementById('diana-canvas');
const ctx     = canvas.getContext('2d');
const CX = 150, CY = 150;

let modo       = 'suave';
let jugActual  = 0;
let scores     = [0, 0];
let ronda      = 0;
let lanzando   = false;

/* --- DIBUJO --- */
function dibujarDiana(impactX, impactY) {
    ctx.clearRect(0, 0, 300, 300);

    // Fondo
    ctx.fillStyle = '#0a0005';
    ctx.beginPath(); ctx.arc(CX, CY, 150, 0, Math.PI*2); ctx.fill();

    // Anillos (de fuera a dentro)
    [...anillos].reverse().forEach(a => {
        ctx.beginPath();
        ctx.arc(CX, CY, a.r, 0, Math.PI*2);
        ctx.fillStyle = a.color;
        ctx.fill();
        // Borde del anillo
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
    });

    // Líneas cruzadas
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(CX, CY-148); ctx.lineTo(CX, CY+148); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CX-148, CY); ctx.lineTo(CX+148, CY); ctx.stroke();

    // Borde exterior glow
    ctx.beginPath(); ctx.arc(CX, CY, 148, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,107,53,0.4)';
    ctx.lineWidth = 2; ctx.stroke();

    // Etiquetas de puntos
    anillos.forEach(a => {
        const labelR = a.r - 12;
        if (labelR < 8) return;
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = 'bold 10px DM Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(a.pts, CX, CY - labelR + (a === anillos[0] ? 0 : 0));
    });

    // Si hay impacto, dibujar el dardo
    if (impactX !== undefined) {
        // Sombra
        ctx.beginPath();
        ctx.arc(impactX, impactY, 8, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fill();

        // Dardo
        ctx.beginPath();
        ctx.arc(impactX, impactY, 6, 0, Math.PI*2);
        ctx.fillStyle = '#ffd23f';
        ctx.fill();
        ctx.strokeStyle = '#ff6b35';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Punto central del dardo
        ctx.beginPath();
        ctx.arc(impactX, impactY, 2, 0, Math.PI*2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
}

function calcularPuntos(x, y) {
    const dist = Math.sqrt((x - CX)**2 + (y - CY)**2);
    for (const a of anillos) {
        if (dist <= a.r) return { pts: a.pts, label: a.label };
    }
    return { pts: 0, label: 'Fuera' };
}

function getRetoParaPuntos(pts) {
    const lista = retos[modo];
    return lista.find(r => r[0] === pts) || lista[lista.length - 1];
}

/* --- LANZAR --- */
function lanzar() {
    if (lanzando) return;
    lanzando = true;
    document.getElementById('btn-lanzar').disabled = true;

    // Ocultar resultado previo
    const card = document.getElementById('result-card');
    card.classList.remove('visible');

    // Animación de espera (dardo "temblando")
    let frames = 0;
    const wobble = setInterval(() => {
        const rx = CX + (Math.random()-0.5)*60;
        const ry = CY + (Math.random()-0.5)*60;
        dibujarDiana(rx, ry);
        frames++;
        if (frames > 12) {
            clearInterval(wobble);
            aterrizar();
        }
    }, 60);
}

function aterrizar() {
    // Punto final: sesgo hacia el centro para que sea más emocionante
    const angle  = Math.random() * Math.PI * 2;
    const maxR   = 148;
    // Distribución sesgada al centro (beta-like)
    const t = Math.pow(Math.random(), 0.6);
    const dist = t * maxR;
    const fx = CX + Math.cos(angle) * dist;
    const fy = CY + Math.sin(angle) * dist;

    dibujarDiana(fx, fy);

    const { pts, label } = calcularPuntos(fx, fy);
    const reto = getRetoParaPuntos(pts);

    // Actualizar score
    scores[jugActual] += pts;
    document.getElementById(`score-${jugActual}`).textContent = scores[jugActual];
    ronda++;

    // Animación número score
    const scoreEl = document.getElementById(`score-${jugActual}`);
    scoreEl.style.transform = 'scale(1.4)';
    scoreEl.style.color = pts >= 8 ? '#ffd23f' : pts >= 5 ? '#ff6b35' : '#ff2d6b';
    setTimeout(() => { scoreEl.style.transform = ''; scoreEl.style.color = ''; }, 400);

    // Colores del dot según puntos
    const dotColor = pts >= 8 ? '#ffd23f' : pts >= 5 ? '#ff6b35' : '#ff2d6b';
    document.getElementById('result-dot').style.background = dotColor;
    document.getElementById('result-dot').style.boxShadow = `0 0 8px ${dotColor}`;
    document.getElementById('result-lbl').style.color = dotColor;
    document.getElementById('result-lbl').textContent = `${label} — ${pts} pts`;
    document.getElementById('result-texto').textContent = reto[2];

    card.style.display = 'block';
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));

    // Historial
    agregarHistorial(jugActual, label, pts, reto[2]);

    if (navigator.vibrate) {
        navigator.vibrate(pts >= 8 ? [100,50,200] : [80]);
    }

    // Cambiar turno automáticamente
    setTimeout(() => {
        jugActual = 1 - jugActual;
        actualizarTurnoUI();
        lanzando = false;
        document.getElementById('btn-lanzar').disabled = false;
    }, 800);
}

function agregarHistorial(j, label, pts, reto) {
    const wrap = document.getElementById('rondas-wrap');
    const list = document.getElementById('rondas-list');
    wrap.style.display = 'block';

    document.querySelectorAll('.ronda-item').forEach(el => el.classList.remove('nueva'));

    const item = document.createElement('div');
    item.className = 'ronda-item nueva';
    item.innerHTML = `<span class="ronda-pts">+${pts}</span><span>J${j+1} → ${label}: ${reto.substring(0,40)}…</span>`;
    list.insertBefore(item, list.firstChild);
}

function actualizarTurnoUI() {
    document.querySelectorAll('.btn-jugador').forEach((b,i) => b.classList.toggle('activo', i === jugActual));
    document.querySelectorAll('.marcador-card').forEach((c,i) => c.classList.toggle('activo', i === jugActual));
}

function resetear() {
    scores = [0,0]; jugActual = 0; ronda = 0;
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('result-card').classList.remove('visible');
    document.getElementById('rondas-wrap').style.display = 'none';
    document.getElementById('rondas-list').innerHTML = '';
    actualizarTurnoUI();
    dibujarDiana();
    lanzando = false;
    document.getElementById('btn-lanzar').disabled = false;
}

/* --- EVENTOS --- */
document.querySelectorAll('.btn-modo').forEach(b => {
    b.addEventListener('click', () => {
        document.querySelectorAll('.btn-modo').forEach(x => x.classList.remove('activo'));
        b.classList.add('activo');
        modo = b.dataset.modo;
        resetear();
    });
});

document.querySelectorAll('.btn-jugador').forEach(b => {
    b.addEventListener('click', () => {
        jugActual = parseInt(b.dataset.j);
        actualizarTurnoUI();
    });
});

document.getElementById('btn-lanzar').addEventListener('click', lanzar);
document.getElementById('btn-reset').addEventListener('click', resetear);

// Init
dibujarDiana();
actualizarTurnoUI();
