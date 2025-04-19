const tablero = document.getElementById('tablero');
const valorDado = document.getElementById('valor-dado');
const accionCasilla = document.getElementById('accion-casilla');
const botonDado = document.getElementById('boton-dado');

let casillas = [];
let posicion = 0;

fetch('data/casillas.json')
  .then(response => response.json())
  .then(data => {
    casillas = data;
    crearTablero(casillas);
  });

function crearTablero(lista) {
  lista.forEach((texto, i) => {
    const casilla = document.createElement('div');
    casilla.className = 'casilla';
    casilla.innerText = `Casilla ${i + 1}`;
    tablero.appendChild(casilla);
  });
}

botonDado.addEventListener('click', () => {
  const dado = Math.floor(Math.random() * 6) + 1;
  valorDado.textContent = dado;
  posicion = (posicion + dado) % casillas.length;
  accionCasilla.textContent = casillas[posicion];
});