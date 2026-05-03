document.body.style.opacity = 0;
        setTimeout(() => { document.body.style.transition="opacity 0.8s ease"; document.body.style.opacity=1; }, 50);
 
        const año = new Date().getFullYear();
        document.getElementById("texto-footer").innerHTML = `&copy; ${año} Todos los derechos reservados.`;
 
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width  - 0.5;
                const y = (e.clientY - r.top)  / r.height - 0.5;
                card.style.transform = `translateY(-10px) scale(1.025) rotateX(${-y*6}deg) rotateY(${x*6}deg)`;
                card.style.transition = 'transform 0.1s ease';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
                card.style.transform = '';
            });
        });
