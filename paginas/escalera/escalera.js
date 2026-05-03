// escalera.js — Tablero 5x5 = 25 casillas

const COLS = 5, ROWS = 5, TOTAL = 25;
const canvas  = document.getElementById('tablero-canvas');
const ctx     = canvas.getContext('2d');
const SIZE    = 320;
const CELL    = SIZE / COLS; // 64px

// ---- TIPOS DE CASILLA ----
// 0=normal, 1=reto, 2=sube, 3=baja, 4=pierde_turno, 5=meta
const TIPOS = {
    NORMAL:       0,
    RETO:         1,
    SUBE:         2,
    BAJA:         3,
    PIERDE_TURNO: 4,
    META:         5,
};

// Mapa de casillas (1-25). Casilla 25 = meta
const casillas = {
    1:  { tipo:TIPOS.NORMAL },
    2:  { tipo:TIPOS.RETO },
    3:  { tipo:TIPOS.SUBE, destino:8, label:'🪜+5' },
    4:  { tipo:TIPOS.NORMAL },
    5:  { tipo:TIPOS.RETO },
    6:  { tipo:TIPOS.PIERDE_TURNO, label:'💤' },
    7:  { tipo:TIPOS.NORMAL },
    8:  { tipo:TIPOS.RETO },
    9:  { tipo:TIPOS.BAJA, destino:4, label:'🐍-5' },
    10: { tipo:TIPOS.SUBE, destino:16, label:'🪜+6' },
    11: { tipo:TIPOS.RETO },
    12: { tipo:TIPOS.NORMAL },
    13: { tipo:TIPOS.RETO },
    14: { tipo:TIPOS.BAJA, destino:7, label:'🐍-7' },
    15: { tipo:TIPOS.PIERDE_TURNO, label:'💤' },
    16: { tipo:TIPOS.RETO },
    17: { tipo:TIPOS.SUBE, destino:22, label:'🪜+5' },
    18: { tipo:TIPOS.NORMAL },
    19: { tipo:TIPOS.RETO },
    20: { tipo:TIPOS.BAJA, destino:12, label:'🐍-8' },
    21: { tipo:TIPOS.RETO },
    22: { tipo:TIPOS.NORMAL },
    23: { tipo:TIPOS.BAJA, destino:15, label:'🐍-8' },
    24: { tipo:TIPOS.RETO },
    25: { tipo:TIPOS.META },
};

const retos = [
    { texto:'Daos un beso de 10 segundos.',                          color:'#ff2d6b' },
    { texto:'El que cayó aquí recibe un masaje de 1 minuto.',         color:'#ff6b9d' },
    { texto:'Susurra al oído la fantasía más reciente.',              color:'#bf5fff' },
    { texto:'El otro elige una zona del cuerpo para acariciar 30s.',  color:'#ff2d6b' },
    { texto:'Quitaos un elemento de ropa cada uno.',                  color:'#ff6b35' },
    { texto:'Besos en el cuello durante 20 segundos.',                color:'#ff2d6b' },
    { texto:'Di 3 cosas que te encanten del cuerpo del otro.',         color:'#ffd23f' },
    { texto:'El que cayó aquí obedece una orden del otro ahora.',     color:'#ff0040' },
    { texto:'Exploración libre de 1 minuto donde indique el otro.',   color:'#bf5fff' },
    { texto:'Daos el beso más lento y largo posible.',                color:'#ff2d6b' },
    { texto:'Dile una cosa que hayas deseado decirle y no lo hayas hecho.', color:'#00ffb3' },
    { texto:'El que cayó aquí baila 30 segundos solo para el otro.',  color:'#ffd23f' },
];

// ---- ESTADO ----
let posiciones = [0, 0]; // 0 = antes de casilla 1
let jugActual  = 0;
let turnosBloqueados = [0, 0];
let lanzando   = false;

// ---- COORD CASILLA → CANVAS ----
// El tablero va de 1 (abajo-izquierda) a 25 (arriba) en serpentín
function casillaCoordsCenter(n) {
    const idx  = n - 1; // 0-based
    const row  = Math.floor(idx / COLS); // 0=bottom, 4=top
    const col  = (row % 2 === 0) ? (idx % COLS) : (COLS - 1 - idx % COLS);
    const drawRow = ROWS - 1 - row; // canvas Y: row0 = bottom → drawRow = 4
    return {
        x: col * CELL + CELL / 2,
        y: drawRow * CELL + CELL / 2,
    };
}

// ---- DIBUJO ----
const colorTipo = {
    [TIPOS.NORMAL]:       'rgba(0,255,179,0.04)',
    [TIPOS.RETO]:         'rgba(255,45,107,0.12)',
    [TIPOS.SUBE]:         'rgba(0,255,179,0.14)',
    [TIPOS.BAJA]:         'rgba(255,107,53,0.14)',
    [TIPOS.PIERDE_TURNO]: 'rgba(191,95,255,0.14)',
    [TIPOS.META]:         'rgba(255,210,63,0.2)',
};
const borderTipo = {
    [TIPOS.NORMAL]:       'rgba(255,255,255,0.06)',
    [TIPOS.RETO]:         'rgba(255,45,107,0.3)',
    [TIPOS.SUBE]:         'rgba(0,255,179,0.35)',
    [TIPOS.BAJA]:         'rgba(255,107,53,0.35)',
    [TIPOS.PIERDE_TURNO]: 'rgba(191,95,255,0.35)',
    [TIPOS.META]:         'rgba(255,210,63,0.5)',
};

function dibujarTablero() {
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Fondo
    ctx.fillStyle = '#0a0508';
    ctx.fillRect(0, 0, SIZE, SIZE);

    for (let n = 1; n <= TOTAL; n++) {
        const cas = casillas[n];
        const { x, y } = casillaCoordsCenter(n);
        const cx = x - CELL/2, cy = y - CELL/2;

        // Fondo casilla
        ctx.fillStyle = colorTipo[cas.tipo];
        ctx.fillRect(cx+1, cy+1, CELL-2, CELL-2);

        // Borde
        ctx.strokeStyle = borderTipo[cas.tipo];
        ctx.lineWidth = 1;
        ctx.strokeRect(cx+1, cy+1, CELL-2, CELL-2);

        // Número
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = `bold 9px DM Sans, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(n, cx+4, cy+4);

        // Icono especial
        if (cas.label) {
            ctx.font = '13px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.fillText(cas.label, x, y + 6);
        } else if (cas.tipo === TIPOS.RETO) {
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🔥', x, y + 6);
        } else if (cas.tipo === TIPOS.META) {
            ctx.font = '18px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🏁', x, y + 4);
        }
    }

    // Dibujar fichas
    dibujarFicha(posiciones[0], '#ff2d6b', 'J1', -10);
    dibujarFicha(posiciones[1], '#00ffb3', 'J2', +10);
}

function dibujarFicha(pos, color, label, offsetX) {
    if (pos === 0) {
        // Fuera del tablero, no dibujar
        return;
    }
    const { x, y } = casillaCoordsCenter(pos);
    const fx = x + offsetX, fy = y;

    // Sombra
    ctx.beginPath();
    ctx.arc(fx, fy, 13, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fill();

    // Ficha
    ctx.beginPath();
    ctx.arc(fx, fy, 12, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Label
    ctx.fillStyle = label === 'J2' ? '#000' : '#fff';
    ctx.font = 'bold 9px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, fx, fy);

    // Glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(fx, fy, 12, 0, Math.PI*2);
    ctx.stroke();
    ctx.shadowBlur = 0;
}

// ---- DADOS EMOJIS ----
const carasDado = ['⚀','⚁','⚂','⚃','⚄','⚅'];

// ---- LANZAR DADO ----
function lanzar() {
    if (lanzando) return;
    lanzando = true;
    document.getElementById('btn-lanzar').disabled = true;

    // Turno bloqueado?
    if (turnosBloqueados[jugActual] > 0) {
        turnosBloqueados[jugActual]--;
        mostrarReto('💤 Turno bloqueado', `Jugador ${jugActual+1} pierde este turno. Quedan ${turnosBloqueados[jugActual]} turnos bloqueados.`, '#bf5fff');
        setTimeout(() => {
            cambiarTurno();
            lanzando = false;
            document.getElementById('btn-lanzar').disabled = false;
        }, 1800);
        return;
    }

    // Animación dado
    const dadoEl = document.getElementById('dado-display');
    dadoEl.classList.add('rodando');
    let frames = 0;
    const anim = setInterval(() => {
        document.getElementById('dado-cara').textContent = carasDado[Math.floor(Math.random()*6)];
        frames++;
        if (frames > 8) {
            clearInterval(anim);
            dadoEl.classList.remove('rodando');
            const resultado = Math.floor(Math.random() * 6) + 1;
            document.getElementById('dado-cara').textContent = carasDado[resultado - 1];
            procesarMovimiento(resultado);
        }
    }, 80);
}

function procesarMovimiento(dado) {
    let nuevaPos = posiciones[jugActual] + dado;

    // No pasar de 25
    if (nuevaPos > TOTAL) {
        nuevaPos = TOTAL - (nuevaPos - TOTAL); // rebote
    }

    posiciones[jugActual] = nuevaPos;
    actualizarPosUI();
    dibujarTablero();

    if (navigator.vibrate) navigator.vibrate(80);

    // Comprobar meta
    if (nuevaPos >= TOTAL) {
        setTimeout(() => mostrarGanador(), 500);
        lanzando = false;
        return;
    }

    // Evaluar casilla
    setTimeout(() => evaluarCasilla(nuevaPos), 600);
}

function evaluarCasilla(pos) {
    const cas = casillas[pos];

    if (cas.tipo === TIPOS.RETO) {
        const reto = retos[Math.floor(Math.random() * retos.length)];
        mostrarReto('🔥 Reto', reto.texto, reto.color);
        setTimeout(finTurno, 1500);

    } else if (cas.tipo === TIPOS.SUBE) {
        mostrarReto('🪜 ¡Escalera!', `Jugador ${jugActual+1} sube a la casilla ${cas.destino}.`, '#00ffb3');
        setTimeout(() => {
            posiciones[jugActual] = cas.destino;
            actualizarPosUI();
            dibujarTablero();
            if (posiciones[jugActual] >= TOTAL) { mostrarGanador(); return; }
            finTurno();
        }, 1200);

    } else if (cas.tipo === TIPOS.BAJA) {
        mostrarReto('🐍 ¡Serpiente!', `Jugador ${jugActual+1} baja a la casilla ${cas.destino}.`, '#ff6b35');
        setTimeout(() => {
            posiciones[jugActual] = cas.destino;
            actualizarPosUI();
            dibujarTablero();
            finTurno();
        }, 1200);

    } else if (cas.tipo === TIPOS.PIERDE_TURNO) {
        turnosBloqueados[jugActual]++;
        mostrarReto('💤 Pierdes turno', `Jugador ${jugActual+1} pierde el próximo turno.`, '#bf5fff');
        setTimeout(finTurno, 1500);

    } else {
        ocultarReto();
        finTurno();
    }
}

function finTurno() {
    cambiarTurno();
    lanzando = false;
    document.getElementById('btn-lanzar').disabled = false;
}

function cambiarTurno() {
    jugActual = 1 - jugActual;
    document.getElementById('dado-turno').textContent = `Turno de Jugador ${jugActual + 1}`;
    document.querySelectorAll('.jugador-card').forEach((c,i) => c.classList.toggle('activo', i === jugActual));
}

function actualizarPosUI() {
    [0,1].forEach(i => {
        document.getElementById(`jc-pos-${i}`).textContent =
            posiciones[i] === 0 ? 'Inicio' : `Casilla ${posiciones[i]}`;
    });
}

function mostrarReto(tipo, texto, color) {
    const card = document.getElementById('reto-card');
    card.style.display = 'block';
    document.getElementById('reto-dot').style.background = color;
    document.getElementById('reto-dot').style.boxShadow = `0 0 8px ${color}`;
    document.getElementById('reto-tipo').style.color = color;
    document.getElementById('reto-tipo').textContent = tipo;
    document.getElementById('reto-texto').textContent = texto;
    card.style.borderTopColor = color;
    // Reiniciar animación
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';
}

function ocultarReto() {
    document.getElementById('reto-card').style.display = 'none';
}

function mostrarGanador() {
    document.getElementById('win-titulo').textContent = `¡Gana Jugador ${jugActual+1}!`;
    document.getElementById('win-sub').textContent = `Jugador ${jugActual+1} ha llegado a la casilla 25 primero.`;
    document.getElementById('win-overlay').classList.add('visible');
}

function reset() {
    posiciones = [0, 0];
    jugActual = 0;
    turnosBloqueados = [0, 0];
    lanzando = false;
    document.getElementById('btn-lanzar').disabled = false;
    document.getElementById('dado-cara').textContent = '?';
    document.getElementById('dado-turno').textContent = 'Turno de Jugador 1';
    document.getElementById('win-overlay').classList.remove('visible');
    ocultarReto();
    actualizarPosUI();
    document.querySelectorAll('.jugador-card').forEach((c,i) => c.classList.toggle('activo', i === 0));
    dibujarTablero();
}

document.getElementById('btn-lanzar').addEventListener('click', lanzar);
document.getElementById('btn-reset').addEventListener('click', reset);
document.getElementById('btn-win-reset').addEventListener('click', reset);

// Init
reset();
