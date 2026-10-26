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
        let casilla = tablero[fila][columna];
        casilla.estado = "descartada";
        console.log("Estado de la casilla: " + casilla.estado);
        console.log("click derecho detectado: " + fila + " - " + columna);
        actualizarCasillaVista(tablero, fila, columna, casilla.estado); 
        console.log("Actualización visual ejecutada");
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
        } else {
            // Mostrar el corazón normal
            corazon.attr("src", "assets/images/corazon.png");
            corazon.removeClass("consumido");
            corazon.removeAttr("title");
        }
    });
}
