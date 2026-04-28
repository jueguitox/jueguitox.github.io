const frases = {
        suave: [
            "…besado en público.",
            "…bailado lento con alguien especial.",
            "…enviado un mensaje a alguien a las 3am.",
            "…fingido no ver a alguien por la calle.",
            "…dormido con la ropa puesta.",
            "…coqueteado para conseguir algo.",
            "…mentido sobre dónde estaba.",
            "…tenido una cita en un lugar muy cursi.",
            "…visto una película romántica y llorado.",
            "…mandado flores o recibido flores.",
            "…escrito una carta de amor a mano.",
            "…tenido una relación a distancia.",
            "…dado un primer beso memorable.",
            "…cantado una canción para alguien.",
            "…pasado la noche en casa de alguien sin planearlo.",
        ],
        picante: [
            "…enviado una foto que después borré.",
            "…besado a alguien en un lugar inesperado.",
            "…tenido una conversación íntima por mensajes.",
            "…hecho algo atrevido en un lugar semipúblico.",
            "…pensado en alguien en el momento más inapropiado.",
            "…ignorado deliberadamente a alguien que me gustaba.",
            "…tenido celos de una persona imaginaria.",
            "…soñado algo muy íntimo con alguien conocido.",
            "…escondido algo de mi pareja.",
            "…usado una excusa para estar más tiempo con alguien.",
            "…dado una señal que nunca fue respondida.",
            "…besado a alguien en la primera cita.",
            "…actuado con más confianza de la que sentía.",
            "…hecho algo con los ojos vendados.",
            "…mentido sobre mi experiencia para impresionar.",
        ],
        atrevido: [
            "…hecho algo íntimo en un lugar donde nos podían ver.",
            "…grabado o fotografiado algo que no debía.",
            "…tenido una fantasía que jamás contaría en voz alta.",
            "…probado algo nuevo que al principio me daba vergüenza.",
            "…iniciado algo solo con una mirada.",
            "…quedado con alguien que era una mala idea.",
            "…terminado algo a mitad por los nervios.",
            "…hecho algo que empezó como un juego y acabó en serio.",
            "…propuesto algo que me rechazaron y lo volví a intentar.",
            "…tenido ganas de parar pero seguí por no decepcionar.",
            "…contado un secreto íntimo que juraba no contar.",
            "…hecho algo dos veces el mismo día.",
            "…improvisado algo sin ninguna planificación.",
            "…despertado a alguien de forma muy creativa.",
            "…actuado como alguien completamente diferente en la intimidad.",
        ]
    };

    let nivel = 'suave';
    let usadas = [];
    let turno = 0;
    let cnts = [0, 0];

    function cambiarCnt(p, d) {
        cnts[p-1] = Math.max(0, cnts[p-1] + d);
        document.getElementById('cnt'+p).textContent = cnts[p-1];
        const card = document.querySelectorAll('.contador-card')[p-1];
        card.style.borderColor = cnts[p-1] > 0 ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.25)';
    }

    function siguiente() {
        const lista = frases[nivel];
        const disponibles = lista.filter((_,i) => !usadas.includes(i));

        if (disponibles.length === 0) {
            usadas = [];
        }

        const disponiblesIdx = lista.map((_,i) => i).filter(i => !usadas.includes(i));
        const idx = disponiblesIdx[Math.floor(Math.random() * disponiblesIdx.length)];
        usadas.push(idx);
        turno++;

        const texto = lista[idx];
        document.getElementById('yn-texto').innerHTML = `<strong>Yo nunca he</strong> ${texto}`;
        document.getElementById('yn-num').textContent = `#${turno}`;

        const card = document.getElementById('yn-card');
        if (!card.classList.contains('visible')) {
            card.style.display = 'block';
            requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));
        } else {
            card.classList.remove('visible');
            setTimeout(() => {
                card.style.display = 'block';
                requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));
            }, 200);
        }

        // Historial
        const hist = document.getElementById('historial');
        const wrap = document.getElementById('historial-wrap');
        wrap.style.display = 'block';

        // Quitar "new" anterior
        document.querySelectorAll('.historial-item.new').forEach(el => el.classList.remove('new'));

        const item = document.createElement('div');
        item.className = 'historial-item new';
        item.textContent = `#${turno} — Yo nunca he ${texto}`;
        hist.insertBefore(item, hist.firstChild);
    }

    function resetear() {
        usadas = []; turno = 0; cnts = [0,0];
        document.getElementById('cnt1').textContent = '0';
        document.getElementById('cnt2').textContent = '0';
        document.querySelectorAll('.contador-card').forEach(c => c.style.borderColor = '');
        document.getElementById('yn-card').classList.remove('visible');
        document.getElementById('historial').innerHTML = '';
        document.getElementById('historial-wrap').style.display = 'none';
    }

    document.querySelectorAll('.btn-nivel').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.btn-nivel').forEach(x => x.classList.remove('activo'));
            b.classList.add('activo');
            nivel = b.dataset.nivel;
            usadas = [];
        });
    });

    document.getElementById('btn-siguiente').addEventListener('click', siguiente);