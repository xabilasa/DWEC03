'use strict'

// Estado de la partida actual/última
let tableroActual = null;
let datosTableroActual = null;
let nivelActual = null;
let vidasPartida = [];
let partidaTerminada = false;

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

    function registrarFallo(fila, columna) {

        // Evitar registrar fallos si la partida ha terminado
        if (partidaTerminada) {
            return;
        }
        // Buscar la primera vida disponible
        let vida = vidasPartida.find(vida => !vida.consumida);

        // Si no quedan vidas, no continuar
        if (!vida) {
            return;
        }
        // Guardar el fallo en la vida disponible
        vida.consumida = true;
        vida.fila = fila;
        vida.columna = columna;
        // Actualizar los corazones
        actualizarVidasVista(vidasPartida);
        // Calcular las vidas restantes
        let vidasRestantes = vidasPartida.filter(
            vida => !vida.consumida
        ).length;
        console.log("Vidas restantes: " + vidasRestantes);

        // Comprobar si se han agotado las vidas
        if (vidasRestantes === 0) {
            mostrarResultado("derrota");
        }
    }
    
    function mostrarResultado(resultado) {
        partidaTerminada = true;
        if (resultado === "victoria") {
            $("#titulo-resultado").text("¡Enhorabuena!");
            $("#mensaje-resultado").text("Has encontrado todas las vacas. ¡Has ganado!");
        } else {
            $("#titulo-resultado").text("¡Se acabaron las vidas!");
            $("#mensaje-resultado").text("Esta vez no ha podido ser. ¡Inténtalo de nuevo!");
        }
        // Ocultar la pantalla de juego y mostrar el resultado
        $("#juego").addClass("hidden");
        $("#resultado").removeClass("hidden");
    }

    function iniciarPartida(nivel) {

        // Seleccionar un tablero del nivel elegido
        let datosTablero = seleccionarTablero(nivel);

        // Si no quedan tableros, no continuamos
        if (datosTablero === null) {
            return;
        }
        // Guardar los datos de la partida actual
        nivelActual = nivel;
        datosTableroActual = datosTablero;

        // Crear la matriz de casillas como el tablero actual
        tableroActual = crearTablero(datosTablero.tamano);

        // Reiniciar el estado de la partida
        partidaTerminada = false;
        vidasPartida = [
            { consumida: false, fila: null, columna: null },
            { consumida: false, fila: null, columna: null },
            { consumida: false, fila: null, columna: null }
        ];
        
        // Colocar las vacas y asignarles las regiones
        colocarVacas(tableroActual, datosTableroActual);
        asignarRegiones(tableroActual, datosTableroActual);

        // Dibujar el tablero en pantalla
        disponerTablero(tableroActual, datosTableroActual);

        // Mostrar las vidas iniciales
        actualizarVidasVista(vidasPartida);

        // Registrar eventos de juego
        registraEventoTablero(tableroActual);

        // Mostrar la pantalla del juego
        mostrarPantalla("juego");

    }
    function comprobarVictoria(tablero) {
        for (let fila of tablero) {
            for (let casilla of fila) {
                // Comprueba si hay alguna vaca sin marcar
                if (casilla.idVaca !== null && casilla.estado !== "vaca") {
                    return;
                }
            }
        }
        // Todas las vacas marcadas => pantalla de resultado con victoria
        mostrarResultado("victoria");
    }

    //Eventos de nivel: recoge el nivel de la selección de nivel
    $('#niveles').on('click', '.boton-nivel', function() {
        const nivel = $(this).data('nivel');
        iniciarPartida(nivel);
    });
    //Botón para volver a la pantalla de nivel y seleccionar nuevo nivel
    $("#btn-volver-niveles").on("click", function() {
        $("#resultado").addClass("hidden");
        $("#bienvenida").removeClass("hidden");
    });
});