'use strict'
//Función ara registrar los eventos de casilla
function registraEventoTablero(tablero){
    // Evitar registrar los mismos eventos de diferentes partidas
    $("#tablero").off(".juego")

    //Click izquierdo para marcar una vaca
    $("#tablero").on("click.juego", ".casilla", function () {
        if (partidaTerminada) {return;} //Para que no se pueda modificar ninguna casilla si está terminada la partida
        let fila = Number($(this).data("fila"));
        let columna = Number($(this).data("columna"));
        let casilla = tablero[fila][columna];
  
        if (casilla.idVaca !== null){
            // Contar solamente si todavía no estaba descubierta
            if (casilla.estado !== "vaca") {
                vacasEncontradas++;
            }
            casilla.estado = "vaca";
            actualizarCasillaVista(tablero, fila, columna, casilla.estado);
            comprobarVictoria(tablero);
        } else {
            registrarFallo(fila, columna);
        }
    });
    //Click derecho para marcar casilla con aspa
    $("#tablero").on("contextmenu.juego", ".casilla", function(evento) {
        evento.preventDefault(); //Evitar abrir deplegable por defecto para botón derecho
        if (partidaTerminada) {return;} //Para que no se pueda modificar ninguna casilla si está terminada la partida
        let fila = Number($(this).data("fila"));
        let columna = Number($(this).data("columna"));

        // Quitar o poner el aspa en función del estado de la casilla para poder marcar y desmarcar
        if (tablero[fila][columna].estado === "descartada") {
            tablero[fila][columna].estado = "sin_marcar";
            actualizarCasillaVista(tablero, fila, columna, "sin_marcar");
        } else if (tablero[fila][columna].estado === "sin_marcar") {
            tablero[fila][columna].estado = "descartada";
            actualizarCasillaVista(tablero, fila, columna, "descartada");
        }
    });

}

function actualizarVidasVista(vidas) {

    $("#vidas .corazon").each(function(indice) {

        let vida = vidas[indice];
        let corazon = $(this);

        if (vida.consumida) {
            // Mostrar el corazón consumido
            corazon.attr("src", "assets/images/corazon_hover.png");
            // Guardar las coordenadas del fallo para el hover
            corazon.addClass("consumido");
            corazon.attr("title", "Casilla incorrecta: fila " + (vida.fila + 1) + ", columna " + (vida.columna + 1));
            corazon.attr("data-fila", vida.fila);
            corazon.attr("data-columna", vida.columna);
        } else {
            // Mostrar el corazón normal
            corazon.attr("src", "assets/images/corazon.png");
            corazon.removeClass("consumido");
            corazon.removeAttr("title");
        }
    });
}

// Evento para resaltar la casilla de fallo al pasar el ratón por el corazón
$("#vidas").on("mouseenter", ".corazon.consumido", function() {

    let fila = Number($(this).attr("data-fila"));
    let columna = Number($(this).attr("data-columna"));

    $("#tablero .casilla").filter(function() {
        return Number($(this).data("fila")) === fila &&
               Number($(this).data("columna")) === columna;
    }).addClass("fallo-hover");

});

// Quitar el resaltado al retirar el ratón
$("#vidas").on("mouseleave", ".corazon.consumido", function() {
    $("#tablero .casilla").removeClass("fallo-hover");
});