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
function calcularPuntuacion(aciertos, segundos, vidas, victoria){
    let puntuacion = 0;
    if (victoria){
        puntuacion += 25;
    }
    puntuacion += (aciertos - 1) * 10 - 5 * (3 - vidas) - segundos;
    if (puntuacion < 0 ){
        puntuacion = 0;
    }
    return puntuacion;
}

function registrarResultado(nombreJugador, nivelActual, puntuacion){
    let resultado = new Resultado;
    resultado.nombre = nombreJugador;
    resultado.nivel = nivelActual;
    resultado.puntos = puntuacion;
    resultado.fecha = Date(now());
    if (puntuacion > 0){
        topPastos.push(resultado);
    }
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