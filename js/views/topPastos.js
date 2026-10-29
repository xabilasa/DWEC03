'use strict'

// Se escribe los records por nivel. Recibe el objeto resultado de la partida como resultadoJugador
function mostrarResultadoNivel(nivel, nombreNivel, resultadoJugador) {
    const rankingNivel = obtenerClasificacionNivel(nivel);
    let fila = $("<tr></tr>");
    fila.append($("<th></th>").text(nombreNivel));
    // Mostrar los tres primeros puestos
    for (let i = 0; i < 3; i++) {
        let celda = $("<td></td>");
        if (rankingNivel[i]) {
            celda.text(
                rankingNivel[i].nombre + " - " +
                rankingNivel[i].puntos + " pt"
            );
        } else {
            celda.text("-");
        }
        fila.append(celda);
    }
    $("#ranking-general").append(fila);

    // Mostrar el resultado del jugador si está fuera del top 3
    if (resultadoJugador && resultadoJugador.nivel === nivel) {
        const posicion = rankingNivel.indexOf(resultadoJugador);
        if (posicion >= 3) {
            $("#resultado-jugador-fuera-top").append(
                $("<p></p>").text(
                    "Tu resultado en " + nombreNivel + ": puesto " +
                    (posicion + 1) + " - " +
                    resultadoJugador.puntos + " pt"
                )
            );
        }
    }
}


function mostrarTopPastos(resultadoJugador) {

    $("#ranking-general").empty();
    $("#resultado-jugador-fuera-top").empty();
    mostrarResultadoNivel("torete", "Torete", resultadoJugador);
    mostrarResultadoNivel("vaquilla", "Vaquilla", resultadoJugador);
    mostrarResultadoNivel("ternero", "Ternero", resultadoJugador);
}