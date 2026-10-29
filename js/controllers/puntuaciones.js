'use strict'

// CLASE Resultado
class Resultado {
    constructor (nombre, nivel, puntos, fecha){
        this.nombre = nombre;
        this.nivel = nivel;
        this.puntos = puntos;
        this.fecha = new Date(fecha);
    }
}
// Array para guardar en LocalHost con los resultados del dia
const topPastos = [];
function calcularPuntuacion(aciertos, segundos, vidas, resultado){
    let puntuacion = 0;
    if (resultado === "victoria"){
        puntuacion += 25;
    }
    puntuacion += (aciertos - 1) * 10;
    puntuacion += 5 * (3 - vidas);
    puntuacion -= segundos;

    return Math.max(0, puntuacion);
}

function registrarResultado(nombreJugador, nivelActual, puntuacion){
    let resultado = new Resultado(nombreJugador, nivelActual, puntuacion, new Date(Date.now()));
    if (puntuacion > 0){
        topPastos.push(resultado);
    }
    return resultado;
}

//Obtener los tres primeros por nivel
function obtenerClasificacionNivel(nivel){
    let topNivel = [];
    topPastos.forEach(resultado => {
        if (resultado.nivel === nivel){
            topNivel.push(resultado);
        }
    });
    topNivel.sort((a, b) => {
        if(b.puntos !== a.puntos){
            return b.puntos - a.puntos;
        } else {
            return b.fecha - a.fecha;
        }
    });
    return topNivel;
}