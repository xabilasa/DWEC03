'use-strict'
$(document).ready(function(){

// Seleccionar tablero según el nivel elegido
//Obtener los datos del nivel seleccionado
function obtenerDatosNivel(nivel){
    if(nivel === "ternero"){
        return datosTablerosTernero;
    } else if (nivel === "vaquilla"){
        return datosTablerosVaquilla;
    } else if (nivel === "torete"){
        return datosTablerosTorete;
    } else {
        console.log("Nivel no válido");
    }
}

//seleccionar tablero aleatorio del nivel elegido

function seleccionarTablero(nivel){

}
// FUNCIÓN seleccionarTablero(nivel)
//     OBTENER los datos correspondientes al nivel
//     OBTENER el array de tableros de esos datos
//     GENERAR un número aleatorio
//         entre 0 y la cantidad de tableros - 1
//     SELECCIONAR el tablero situado en ese índice
//     DEVOLVER el tablero seleccionado
// FIN FUNCIÓN

// Dibujar el tablero

// FUNCIÓN dibujarTablero(tablero, tamano)
//     OBTENER el contenedor HTML del tablero
//     ELIMINAR su contenido anterior
//     AÑADIR la clase CSS que corresponda al tamaño:
//         grid-8, grid-12 o grid-16
//     PARA CADA fila del tablero
//         PARA CADA casilla de esa fila
//             CREAR un elemento HTML div
//             AÑADIR la clase CSS "casilla"
//             OBTENER el identificador de región de la casilla
//             DETERMINAR la clase CSS de color
//                 que corresponde a esa región
//             AÑADIR la clase de color al elemento HTML
//             GUARDAR las coordenadas de la casilla
//                 en atributos data-fila y data-columna
//             AÑADIR el elemento HTML al contenedor
//         FIN PARA
//     FIN PARA
// FIN FUNCIÓN

// LLamada a los procesos anteriores para pintar el tablero de forma coordinada

// FUNCIÓN iniciarPartida(nivel)
//     INTENTAR
//         datosTablero = ESPERAR seleccionarTablero(nivel)
//         tamano = datosTablero.tamano
//         tablero = crearTablero(tamano)
//         colocarVacas(tablero, datosTablero)
//         asignarRegiones(tablero, datosTablero)
//         dibujarTablero(tablero)
//         MOSTRAR la pantalla de juego
//     SI SE PRODUCE UN ERROR
//         MOSTRAR un mensaje indicando que no se ha podido cargar
//         el tablero
//     FIN INTENTAR
// FIN FUNCIÓN

});

//Eventos de nivel

$('#niveles').on('click', '.boton-nivel', function() {
    const nivel = $(this).data('nivel');
});