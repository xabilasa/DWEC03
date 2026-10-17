'use-strict'
// CLASE Casilla
class Casilla {
    constructor (fila, columna){
        this.fila = fila;
        this.columna = columna;
        this.idVaca = null;
        this.idRegion = null;
        this.estado = "sin_marcar";
    }
}
const tamano = {
    ternero: 8,
    vaquilla: 12,
    torete: 16
}
//Crear Tablero
function crearTablero(tamano){
    var tablero = [];
    for (let fila = 0; fila < tamano; fila++){
         let filaTablero = [];
         for (let columna = 0; columna < tamano; columna++){
            let casilla = new Casilla(fila, columna);
            filaTablero.push(casilla);
         }
        tablero.push(filaTablero);
    }
    return tablero
}

// Colocar las vacas y las regiones en el tablero
function colocarVacas(tablero, datosTablero) {
    datosTablero.vacas.forEach(vaca => {
        let fila = vaca.fila - 1;
        let columna = vaca.columna - 1;
        tablero[fila][columna].idVaca = vaca.id;
    });
}

//Asignar las regiones
function asignarRegiones(tablero, datosTablero){
    datosTablero.regiones.forEach(region => {
        region.casillas.forEach(coordenada =>{
            let fila = coordenada[0] - 1;
            let columna = coordenada[1] - 1;
            tablero[fila][columna].idRegion = region.idVaca;
        });
    });
}
