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

//Cambiar el estado de las casillas - sólo en el objeto casilla -.
function cambiarEstadoCasilla(casilla){
    if (casilla.estado === "sin_marcar"){
        casilla.estado === "vaca";
    } else if (casilla.estado === "vaca"){
        casilla.estado === "descartada";
    } else {
        casilla.estado === "sin_marcar";
    }
}

// Dibujar el tablero
function disponerTablero(tablero, datosTablero){
    let tableroJuego = $("#tablero");
    //vaciamos el contenido del tablero anterior si existe
    tableroJuego.empty();

    let tamanioGrid = "grid-" + datosTablero.tamano;

    tableroJuego.removeClass("grid-8 grid-12 grid-16");
    tableroJuego.addClass(tamanioGrid);

    tablero.forEach(fila => {
        fila.forEach(casilla => {
            let nuevaCasilla = $("<div></div>");
            nuevaCasilla.addClass("casilla");
            nuevaCasilla.attr("data-fila", casilla.fila);
            nuevaCasilla.attr("data-columna", casilla.columna);
            let indiceRegion = datosTablero.regiones.findIndex(
                region => region.idVaca === casilla.idRegion);
            if (indiceRegion !== -1) {
                nuevaCasilla.addClass("color-pasto-" + (indiceRegion + 1));
            }

            tableroJuego.append(nuevaCasilla);
        });
    
    });
}

// Actualizar la vista de la casilla pulsada
function actualizarCasillaVista(tablero, fila, columna, estado){
    let elemento = $("#tablero .casilla").filter(function() {
        return Number($(this).data("fila")) === fila &&
               Number($(this).data("columna")) === columna;
    });
    elemento.removeClass("hayVaca hayAspa");
    switch (estado){
        case "sin_marcar":
            break;
        case "vaca":
            elemento.addClass("hayVaca");
            break;
        case "descartada":
            elemento.addClass("hayAspa");
            break;
    }
}