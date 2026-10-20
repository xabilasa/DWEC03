'use strict'
$(document).ready(function(){

    //Variable para guardar los tableros jugados y que no se repitan
    const tablerosJugados = {
        ternero: [],
        vaquilla: [],
        torete: []
    }

    // Seleccionar tablero según el nivel elegido
    function obtenerDatosNivel(nivel) {
        if (nivel === "ternero") {
            return datosTablerosTernero;
        } else if (nivel === "vaquilla") {
            return datosTablerosVaquilla;
        } else if (nivel === "torete") {
            return datosTablerosTorete;
        } else {
            console.log("Nivel no válido");
            return null;
        }
    }

    // Seleccionar un tablero aleatorio que no se haya jugado
    function seleccionarTablero(nivel) {
        let jugados = tablerosJugados[nivel];
        let datosTablero = obtenerDatosNivel(nivel);

        // Comprobar que el nivel es válido
        if (datosTablero === null) {
            return null;
        }

        let disponibles = [];

        for (let i = 0; i < datosTablero.tableros.length; i++) {
            let encontrado = false;

            for (let j = 0; j < jugados.length; j++) {
                if (datosTablero.tableros[i].idTablero === jugados[j]) {
                    encontrado = true;
                }
            }

            if (encontrado === false) {
                disponibles.push(datosTablero.tableros[i]);
            }
        }
        //Comprobar si quedan tableros y elegir uno aleatorio 
        if (disponibles.length === 0){
            mensajeNoTableros();// pendiente crear funcion mensaje de no hay tableros disponibles
            return null; 
        } else {
            let indice = Math.floor(Math.random() * disponibles.length);
            return disponibles[indice];
        }
    }

    //Registrar tablero jugado para que no se repita
    function registrarTableroJugado(tablero, nivel){
        let encontrado = false;
        for(let i=0; i < tablerosJugados.nivel.length;i++){
            if(tablerosJugados[nivel] === tablero.idTablero){
                encontrado = true;
            }
        }
        if (encontrado === false){
            tablerosJugados[nivel].push(tablero.idTablero)
        }
    }
    // Dibujar el tablero
    function dibujarTablero(tablero, datosTablero){
        let tableroJuego = $("#tablero");
        //Borramos el contenido del tablero anterior si existe
        tableroJuego.empty();

        let tamanioGrid = "grid-" + datosTablero.tamano;

        tableroJuego.removeClass("grid-8 grid-12 grid-16");
        tableroJuego.addClass(tamanioGrid);

        tablero.forEach(fila => {
            fila.forEach(casilla => {
                let nuevaCasilla = $("<div></div>");
                nuevaCasilla.addClass("casilla");

                let indiceRegion = datosTablero.regiones.findIndex(
                    region => region.idVaca === casilla.idRegion);
                if (indiceRegion !== -1) {
                    nuevaCasilla.addClass("color-pasto-" + (indiceRegion + 1));
                }

                tableroJuego.append(nuevaCasilla);
            });
        
        });
    }

    function iniciarPartida(nivel) {

        // Seleccionar un tablero del nivel elegido
        let datosTablero = seleccionarTablero(nivel);

        // Si no quedan tableros, no continuamos
        if (datosTablero === null) {
            return;
        }

        // Crear la matriz de casillas
        let tablero = crearTablero(datosTablero.tamano);

        // Colocar las vacas y asignar las regiones
        colocarVacas(tablero, datosTablero);
        asignarRegiones(tablero, datosTablero);

        // Dibujar el tablero en pantalla
        dibujarTablero(tablero, datosTablero);

        // Mostrar la pantalla del juego
        mostrarPantalla("juego");
    }

    //Eventos de nivel

    $('#niveles').on('click', '.boton-nivel', function() {
        const nivel = $(this).data('nivel');
        iniciarPartida(nivel);
    });
    // $("#casilla").on('click', )
});