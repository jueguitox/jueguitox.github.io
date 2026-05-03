// trivial.js

const letras = ['A', 'B', 'C', 'D'];

const preguntas = [
    // CATEGORIA: La pareja
    { cat:'💑 La pareja', q:'¿Cuál es el color favorito de tu pareja?', tipo:'abierta', penitencia:'Describe con detalle la primera vez que os visteis.' },
    { cat:'💑 La pareja', q:'¿Cuál es la comida favorita de tu pareja?', tipo:'abierta', penitencia:'Dile en voz alta lo que más valoras de ella/él.' },
    { cat:'💑 La pareja', q:'¿Dónde fue vuestra primera cita?', tipo:'abierta', penitencia:'Recrea el primer abrazo que os disteis en 30 segundos.' },
    { cat:'💑 La pareja', q:'¿Cuál es la película favorita de tu pareja?', tipo:'abierta', penitencia:'Besa a tu pareja donde ella/él elija.' },
    { cat:'💑 La pareja', q:'¿Cuál es el nombre del mejor amigo/a de tu pareja?', tipo:'abierta', penitencia:'Cuéntale un recuerdo de vosotros que normalmente no menciones.' },

    // CATEGORIA: Gustos íntimos
    { cat:'🌙 Íntimo', q:'¿Qué prefiere tu pareja: masaje o besos?',
      opts:['Masaje','Besos','Los dos igual','Ninguno'], correctaIdx: -1, penitencia:'Dale lo que hayas respondido durante 1 minuto.' },
    { cat:'🌙 Íntimo', q:'¿Qué zona le gusta más que le acaricien?',
      opts:['Cuello','Espalda','Cabello','Pies'], correctaIdx: -1, penitencia:'Dedica 30 segundos a esa zona ahora mismo.' },
    { cat:'🌙 Íntimo', q:'¿En qué momento del día se siente más romántica/o?',
      opts:['Por la mañana','Al mediodía','Por la tarde','Por la noche'], correctaIdx: -1, penitencia:'Propón una cita en ese momento esta semana.' },
    { cat:'🌙 Íntimo', q:'¿Qué tipo de beso prefiere tu pareja?',
      opts:['Lento y tierno','Apasionado','Con mordisco suave','Solo en la mejilla'], correctaIdx: -1, penitencia:'Dale exactamente ese tipo de beso ahora.' },
    { cat:'🌙 Íntimo', q:'¿Qué es lo primero que nota tu pareja de una persona?',
      opts:['Los ojos','La sonrisa','La voz','Las manos'], correctaIdx: -1, penitencia:'Dile qué fue lo primero que notaste de ella/él.' },

    // CATEGORIA: Trivia de la relación
    { cat:'❤️ Vuestra historia', q:'¿Cuántas citas aproximadas tuvisteis antes de daros el primer beso?', tipo:'abierta', penitencia:'Recrear ese primer beso ahora, con la misma energía.' },
    { cat:'❤️ Vuestra historia', q:'¿Cuál fue el primer regalo que os hicisteis?', tipo:'abierta', penitencia:'Promete un regalo para esta semana y dí cuál.' },
    { cat:'❤️ Vuestra historia', q:'¿Quién dijo "te quiero" primero?',
      opts:['Yo','Mi pareja','Los dos a la vez','Aún no lo hemos dicho'], correctaIdx: -1, penitencia:'Díselo de nuevo, ahora, mirándola/le a los ojos.' },
    { cat:'❤️ Vuestra historia', q:'¿Cuánto tiempo lleváis juntos? (aproximado)',
      opts:['Menos de 6 meses','6 meses a 1 año','1 a 3 años','Más de 3 años'], correctaIdx: -1, penitencia:'Nombra 3 momentos especiales de vuestra relación.' },
    { cat:'❤️ Vuestra historia', q:'¿Cuál ha sido el viaje o plan más especial juntos?', tipo:'abierta', penitencia:'Propón el próximo plan especial que queréis hacer.' },

    // CATEGORIA: Fantasías y deseos
    { cat:'🔥 Deseos', q:'¿Qué sueño o meta tiene tu pareja para este año?', tipo:'abierta', penitencia:'Di cómo podrías ayudarla/le a conseguirlo.' },
    { cat:'🔥 Deseos', q:'¿Cuál es el mayor miedo de tu pareja?', tipo:'abierta', penitencia:'Abraza a tu pareja durante 1 minuto sin decir nada.' },
    { cat:'🔥 Deseos', q:'¿Qué haría tu pareja con un día libre sin planes?',
      opts:['Dormir todo el día','Salir con amigos','Pasar el día conmigo','Viaje improvisado'], correctaIdx: -1, penitencia:'Organiza ese día libre para tu pareja este mes.' },
    { cat:'🔥 Deseos', q:'¿Qué canción asocia tu pareja con vuestra relación?', tipo:'abierta', penitencia:'Tararéala ahora mismo, aunque mal.' },
    { cat:'🔥 Deseos', q:'¿Dónde sueña tu pareja con vivir?', tipo:'abierta', penitencia:'Cuéntale tu propio sueño de vida ideal juntos.' },
];

const penitenciasGenericas = [
    'Besa a tu pareja donde quiera durante 20 segundos.',
    'Masajea los hombros de tu pareja 1 minuto.',
    'Cuéntale un secreto que no le hayas contado antes.',
    'Dile 3 cosas que adoras de ella/él.',
    'Dale un abrazo que dure al menos 30 segundos.',
    'Susúrrale algo que le ponga los pelos de punta.',
    'Describe el momento en que te diste cuenta de que te gustaba.',
    'Imita su sonrisa durante 10 segundos.',
];

let jugActual = 0;
let pts = [0, 0];
let preguntaIdx = 0;
let preguntasMezcladas = [];
let respondida = false;
let totalPreguntas = 20;

function mezclar(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function init() {
    pts = [0, 0];
    jugActual = 0;
    preguntaIdx = 0;
    respondida = false;
    preguntasMezcladas = mezclar([...preguntas]);
    totalPreguntas = Math.min(20, preguntasMezcladas.length);

    actualizarScores();
    actualizarTurno();
    actualizarProgress();
    mostrarPregunta();

    document.getElementById('penitencia-card').style.display = 'none';
    document.getElementById('win-overlay').classList.remove('visible');
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
}

function actualizarScores() {
    ['0','1'].forEach(i => {
        document.getElementById(`pts-${i}`).textContent = pts[i];
        document.getElementById(`sc-${i}`).classList.toggle('activo', parseInt(i) === jugActual);
    });
}

function actualizarTurno() {
    document.getElementById('turno-txt').textContent = `Turno de Jugador ${jugActual + 1}`;
}

function actualizarProgress() {
    const pct = Math.round((preguntaIdx / totalPreguntas) * 100);
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-lbl').textContent = `${preguntaIdx} / ${totalPreguntas}`;
    document.getElementById('pregunta-num').textContent = `#${preguntaIdx + 1}`;
}

function mostrarPregunta() {
    if (preguntaIdx >= totalPreguntas) { mostrarFin(); return; }

    const p = preguntasMezcladas[preguntaIdx];
    respondida = false;

    document.getElementById('pregunta-cat').textContent = p.cat;
    document.getElementById('pregunta-texto').textContent = p.q;
    document.getElementById('penitencia-card').style.display = 'none';
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';

    const grid = document.getElementById('opciones-grid');
    grid.innerHTML = '';

    if (p.opts) {
        // Pregunta con opciones — en parejas, las respuestas íntimas no tienen "correcto"
        // El jugador elige Y LUEGO su pareja dice si acierta
        p.opts.forEach((op, i) => {
            const btn = document.createElement('button');
            btn.className = 'opcion-btn';
            btn.innerHTML = `<span class="opcion-letra">${letras[i]}</span>${op}`;
            btn.dataset.idx = i;
            btn.addEventListener('click', () => elegirOpcion(btn, p));
            grid.appendChild(btn);
        });
    } else {
        // Pregunta abierta — el jugador responde verbalmente, luego pareja valida
        const info = document.createElement('div');
        info.style.cssText = 'grid-column:1/-1;text-align:center;padding:16px;font-size:0.82rem;color:rgba(255,255,255,0.35);letter-spacing:0.1em;line-height:1.6;';
        info.textContent = 'Responde en voz alta. ¿Acertaste?';
        grid.appendChild(info);

        ['✅ Sí, acerté', '❌ No acerté'].forEach((label, i) => {
            const btn = document.createElement('button');
            btn.className = 'opcion-btn';
            btn.style.gridColumn = '1/-1';
            btn.innerHTML = `<span class="opcion-letra">${i === 0 ? '✓' : '✗'}</span>${label}`;
            btn.addEventListener('click', () => {
                if (respondida) return;
                respondida = true;
                if (i === 0) {
                    pts[jugActual] += 10;
                    mostrarFeedback(true, null, p);
                } else {
                    mostrarFeedback(false, null, p);
                }
                deshabilitarOpciones();
                actualizarScores();
            });
            grid.appendChild(btn);
        });
    }
}

function elegirOpcion(btn, p) {
    if (respondida) return;
    respondida = true;

    // Resaltar elección
    btn.classList.add('correcta');
    deshabilitarOpciones();

    // Aquí el otro jugador valida. Simplificamos: suma puntos directamente y muestra penitencia si pierde
    // En juego real ambos pueden acordar si acierta. Usamos feedback manual.
    const grid = document.getElementById('opciones-grid');
    const valRow = document.createElement('div');
    valRow.style.cssText = 'grid-column:1/-1;display:flex;gap:8px;margin-top:4px;';
    valRow.innerHTML = `
        <button class="opcion-btn" style="flex:1;justify-content:center;" id="val-si">✅ Mi pareja dice que acerté</button>
        <button class="opcion-btn" style="flex:1;justify-content:center;" id="val-no">❌ Mi pareja dice que fallé</button>
    `;
    grid.appendChild(valRow);

    document.getElementById('val-si').addEventListener('click', () => {
        pts[jugActual] += 10;
        mostrarFeedback(true, null, p);
        actualizarScores();
        valRow.remove();
    });
    document.getElementById('val-no').addEventListener('click', () => {
        mostrarFeedback(false, null, p);
        valRow.remove();
    });
}

function mostrarFeedback(correcto, respuestaCorrecta, p) {
    const fb = document.getElementById('feedback');
    if (correcto) {
        fb.textContent = '✦ ¡Correcto! +10 puntos';
        fb.className = 'feedback correcta';
    } else {
        fb.textContent = '✗ Fallaste — ¡Penitencia!';
        fb.className = 'feedback incorrecta';
        const peniCard = document.getElementById('penitencia-card');
        peniCard.style.display = 'block';
        const peniTxt = p.penitencia || penitenciasGenericas[Math.floor(Math.random() * penitenciasGenericas.length)];
        document.getElementById('peni-texto').textContent = peniTxt;
    }
    if (navigator.vibrate) navigator.vibrate(correcto ? [100,50,150] : [200]);
}

function deshabilitarOpciones() {
    document.querySelectorAll('.opcion-btn').forEach(b => b.disabled = true);
}

function siguiente() {
    preguntaIdx++;
    jugActual = 1 - jugActual;
    actualizarTurno();
    actualizarScores();
    actualizarProgress();
    mostrarPregunta();
}

function mostrarFin() {
    const ganador = pts[0] > pts[1] ? 'Jugador 1' : pts[1] > pts[0] ? 'Jugador 2' : 'Empate';
    const sub = ganador === 'Empate'
        ? `Empate con ${pts[0]} puntos cada uno. ¡Sois perfectos el uno para el otro! 💕`
        : `${ganador} gana con ${Math.max(...pts)} puntos. El perdedor cumple la penitencia final: elegir una fantasía nueva para esta noche.`;
    document.getElementById('win-titulo').textContent = ganador === 'Empate' ? '¡Empate!' : `¡Gana ${ganador}!`;
    document.getElementById('win-sub').textContent = sub;
    document.getElementById('win-overlay').classList.add('visible');
}

document.getElementById('btn-siguiente').addEventListener('click', () => {
    if (!respondida) { mostrarFeedback(false, null, preguntasMezcladas[preguntaIdx]); return; }
    siguiente();
});
document.getElementById('btn-reset').addEventListener('click', init);
document.getElementById('btn-win-reset').addEventListener('click', init);

init();
