const retos = [
            "Besa lentamente cada parte del cuello de tu pareja sin detenerte.",
            "Masajea su espalda de la forma más relajante posible.",
            "Susúrrale al oído todo lo que encuentras irresistible de él/ella.",
            "Acaricia su cabello con toda la ternura que puedas.",
            "Bésale las manos y los dedos uno por uno, con calma.",
            "Mírale a los ojos sin apartar la vista y sin hablar.",
            "Traza con los labios un camino desde su oreja hasta el hombro.",
            "Dile, muy despacio, lo que harías si la noche no tuviese fin.",
            "Acaricia su espalda con las puntas de los dedos muy suavemente.",
            "Besa su frente, mejillas y nariz con calma.",
            "Agarra sus manos y guíale en un baile improvisado.",
            "Toca suavemente su rostro con ambas manos.",
            "Dibuja figuras en su espalda con el dedo que adivine.",
            "Dile tres cosas que te gustan de cómo te besa.",
            "Acaricia su pierna muy lentamente desde la rodilla.",
            "Explora su espalda con las manos como si fuera la primera vez.",
            "Cuéntale tu fantasía más reciente mirándole a los ojos.",
            "Hazle saber con palabras dónde quieres que te toque.",
            "Rodéale la cintura y mantente así durante todo el tiempo.",
            "Improvisa un masaje en los pies sin prisas."
        ];

        const R = 90;
        const CIRC = 2 * Math.PI * R; // ~565.48
        let totalSeg = 60, restante = 60, timer = null, corriendo = false;

        const ring = document.getElementById('timer-ring');
        const disp = document.getElementById('timer-display');
        const textoReto = document.getElementById('texto-reto');
        const msgFin = document.getElementById('msg-fin');
        const btnIniciar = document.getElementById('btn-iniciar');
        const iniciarTxt = document.getElementById('iniciar-txt');
        const timerWrap = document.querySelector('.timer-wrap');

        ring.style.strokeDasharray = CIRC;
        ring.style.strokeDashoffset = 0;

        function fmtTime(s) {
            const m = Math.floor(s/60), sec = s%60;
            return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
        }

        function actualizarUI() {
            disp.textContent = fmtTime(restante);
            ring.style.strokeDashoffset = CIRC * (1 - restante / totalSeg);
            const urgente = restante <= 10 && restante > 0;
            const done    = restante <= 0;
            ring.classList.toggle('urgente', urgente && !done);
            ring.classList.toggle('done', done);
            disp.classList.toggle('urgente', urgente && !done);
            disp.classList.toggle('done', done);
            timerWrap.classList.toggle('pulsando', urgente && !done);
        }

        document.querySelectorAll('.btn-dur').forEach(b => {
            b.addEventListener('click', () => {
                if (corriendo) return;
                document.querySelectorAll('.btn-dur').forEach(x => x.classList.remove('activo'));
                b.classList.add('activo');
                totalSeg = parseInt(b.dataset.seg);
                restante = totalSeg;
                msgFin.classList.remove('visible');
                actualizarUI();
            });
        });

        btnIniciar.addEventListener('click', () => {
            if (corriendo) {
                clearInterval(timer); corriendo = false;
                iniciarTxt.textContent = 'Reanudar';
            } else {
                if (restante <= 0) {
                    restante = totalSeg;
                    msgFin.classList.remove('visible');
                    actualizarUI();
                }
                corriendo = true; iniciarTxt.textContent = 'Pausar';
                timer = setInterval(() => {
                    restante--;
                    actualizarUI();
                    if (restante <= 0) {
                        clearInterval(timer); corriendo = false;
                        iniciarTxt.textContent = 'Reiniciar';
                        timerWrap.classList.remove('pulsando');
                        msgFin.textContent = '¡Tiempo! ✦ ¿Cómo ha ido? 😏';
                        msgFin.classList.add('visible');
                        if (navigator.vibrate) navigator.vibrate([200,100,200]);
                    }
                }, 1000);
            }
        });

        document.getElementById('btn-nuevo').addEventListener('click', () => {
            textoReto.textContent = retos[Math.floor(Math.random() * retos.length)];
            clearInterval(timer); corriendo = false;
            restante = totalSeg;
            msgFin.classList.remove('visible');
            iniciarTxt.textContent = 'Iniciar';
            actualizarUI();
        });

        actualizarUI();