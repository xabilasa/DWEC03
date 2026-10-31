'use strict'

// Estado de la partida actual/última
let nombreJugadorActual = "Jugador 1";
let tableroActual = null;
let datosTableroActual = null;
let nivelActual = null;
let vidasPartida = [];
let vacasEncontradas = 0;
let partidaTerminada = false;
let tiempoTranscurrido = 0;
let cronometroIntervalo = null;
let pausarInstrucciones = false;
let resultadosCargados = false;

$(document).ready(function(){

    // Cargar el modal de resultados al iniciar la aplicación
    $("#contenido-resultado").load("resultado.html", function(respuesta, estado) {
        if (estado === "error") {
            console.error("No se ha podido cargar resultado.html");
            return;
        }
        resultadosCargados = true;
        console.log("Modal de resultados cargado correctamente");
    });

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
    function registrarTableroJugado(tablero, nivel) {
        let encontrado = false;

        for (let i = 0; i < tablerosJugados[nivel].length; i++) {
            if (tablerosJugados[nivel][i] === tablero.idTablero) {
                encontrado = true;
            }
        }

        if (!encontrado) {
            tablerosJugados[nivel].push(tablero.idTablero);
        }
    }


    function iniciarPartida(nivel, reutilizarTablero = null) {

        let datosTablero = reutilizarTablero;

        //Reutilizar tablero si no se reinicia partida
        if (datosTablero === null){
            datosTablero = seleccionarTablero(nivel);
            // Si no quedan tableros, no continuamos
            if (datosTablero === null) {
                return;
            }
            // Se registra el tablero solamente si se selecciona uno nuevo
            registrarTableroJugado(datosTablero, nivel);
        }
        
        // Evitar repetir tableros
        registrarTableroJugado(datosTablero, nivel);

        // Guardar los datos de la partida actual
        nivelActual = nivel;
        datosTableroActual = datosTablero;
        nombreJugadorActual = $("#nombre-jugador-input").val().trim() || "Jugador 1";
        $("#nombre-jugador").text(nombreJugadorActual);

        // Crear la matriz de casillas como el tablero actual
        tableroActual = crearTablero(datosTablero.tamano);

        // Reiniciar el estado de la partida
        partidaTerminada = false;
        vacasEncontradas = 0;
        iniciarCronometro();
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
        
        // Mostrar la primera vaca como pista inicial
        let primeraVaca = datosTableroActual.vacas[0];
        let filaVaca = primeraVaca.fila - 1;
        let columnaVaca = primeraVaca.columna - 1;
        tableroActual[filaVaca][columnaVaca].estado = "vaca";
        vacasEncontradas++;
        actualizarCasillaVista(tableroActual, filaVaca, columnaVaca, "vaca");

        // Mostrar las vidas iniciales
        actualizarVidasVista(vidasPartida);

        // Registrar eventos de juego
        registraEventoTablero(tableroActual);

        // Mostrar la pantalla del juego
        mostrarPantalla("juego");

    }
    //Eventos de nivel: recoge el nivel de la selección de nivel
    $('#niveles').on('click', '.boton-nivel', function() {
        const nivel = $(this).data('nivel');
        iniciarPartida(nivel);
    });

    //Botón para volver a la pantalla de nivel y seleccionar nuevo nivel
    $(document).on("click", "#btn-volver-niveles", function() {
        $("#modal-resultado").addClass("hidden");
        $("#bienvenida").removeClass("hidden");
    });
    
    // Botón para reiniciar la partida en el mismo tablero
    $("#btn-reiniciar").on("click", function() {
        iniciarPartida(nivelActual, datosTableroActual);
    });

    // Botón Salir desde la pantalla de juego
    $("#btn-salir").on("click", function() {
        detenerCronometro();
        partidaTerminada = true;
        $("#juego").addClass("hidden");
        $("#modal-resultado").addClass("hidden");
        $("#bienvenida").removeClass("hidden");
    });

    // Botón Salir desde la pantalla de resultado
    $(document).on("click", "#btn-salir-resultado", function() {
        $("#resultado").addClass("hidden");
        $("#juego").addClass("hidden");
        $("#bienvenida").addClass("hidden");
        $("#acceso").removeClass("hidden");
        $("#contenido-resultado").addClass("hidden");
    });

    //Eventos para cargar instrucciones en un modal al clickar "instrucciones"    
    $("#btn-instrucciones").on("click", function () {

        pausarInstrucciones = !$("#juego").hasClass("hidden");
        if (pausarInstrucciones) {
            pausarCronometro();
        }
        $("#contenido-instrucciones").load("instrucciones.html", function () {
            $("#modal-instrucciones").removeClass("hidden");
            inicializarInstrucciones();
        });
    });

    // Cerrar modal de instrucciones 
    function cerrarInstrucciones() {
        $("#modal-instrucciones").addClass("hidden");
        if (pausarInstrucciones) {
            reanudarCronometro();
            pausarInstrucciones = false;
        }
    }

    //Eventos para cerrar el modal de instrucciones
    $("#btn-cerrar-instrucciones").on("click", cerrarInstrucciones);

    $("#modal-instrucciones").on("click", function (evento) {
        if (evento.target === this) {
            cerrarInstrucciones();
        }
    });
});


function actualizarCronometro() {
    let minutos = Math.floor(tiempoTranscurrido / 60);
    let segundos = tiempoTranscurrido % 60;

    $("#tiempo").text(
        minutos + ":" + String(segundos).padStart(2, "0")
    );
}

// Funciones de reloj-cronómetro. Iniciar crono
function iniciarCronometro() {
    detenerCronometro();

    tiempoTranscurrido = 0;
    actualizarCronometro();

    cronometroIntervalo = setInterval(function () {
        tiempoTranscurrido++;
        actualizarCronometro();
    }, 1000);
}
// Pausar crono (para lanzar model de instrucciones durante partida)
function pausarCronometro() {
    if (cronometroIntervalo !== null) {
        clearInterval(cronometroIntervalo);
        cronometroIntervalo = null;
    }
}
//Reanudar crono pausado
function reanudarCronometro() {
    if (cronometroIntervalo === null && !partidaTerminada) {
        cronometroIntervalo = setInterval(function () {
            tiempoTranscurrido++;
            actualizarCronometro();
        }, 1000);
    }
}

// Detener cronometro (final de partida)
function detenerCronometro() {
    if (cronometroIntervalo !== null) {
        clearInterval(cronometroIntervalo);
        cronometroIntervalo = null;
    }
}

 // Registrar los fallos y actualizar las vidas
function registrarFallo(fila, columna) {

    // Evitar registrar fallos si la partida ha terminado
    if (partidaTerminada) {
        return;
    }

    // Buscar la primera vida disponible
    let vida = vidasPartida.find(vida => !vida.consumida);

    // Si no quedan vidas disponibles, no continuar
    if (!vida) {
        return;
    }

    // Registrar el fallo
    vida.consumida = true;
    vida.fila = fila;
    vida.columna = columna;

    // Actualizar los corazones
    actualizarVidasVista(vidasPartida);

    // Calcular las vidas restantes
    const vidasRestantes = vidasPartida.filter(
        vida => !vida.consumida
    ).length;

    console.log("Vidas restantes: " + vidasRestantes);

    // Comprobar si se han agotado las vidas
    if (vidasRestantes === 0) {
        mostrarResultado("derrota");
    }
}


// Mostrar el resultado al terminar la partida
function mostrarResultado(resultado) {

    // Evitar procesar dos veces el final de la partida
    if (partidaTerminada) {
        return;
    }

    //Comprobar si el html de resultados ha cargado
    if (!resultadosCargados) {
        console.error("El modal de resultados todavía no está cargado");
        return;
    }

    partidaTerminada = true;
    detenerCronometro();

    // Determinar si ha ganado
    const victoria = resultado === "victoria";

    // Calcular las vidas consumidas
    const vidasConsumidas = vidasPartida.filter(
        vida => vida.consumida
    ).length;

    // Calcular la puntuación
    const puntuacion = calcularPuntuacion(
        vacasEncontradas,
        tiempoTranscurrido,
        vidasConsumidas,
        victoria
    );

    // Registrar el resultado y conservar el objeto
    const resultadoJugador = registrarResultado(
        nombreJugadorActual,
        nivelActual,
        puntuacion
    );
    
    // Mostrar el mensaje correspondiente
    if (victoria) {
        $("#titulo-resultado").text("¡Enhorabuena!");
        $("#mensaje-resultado").text(
            "Has encontrado todas las vacas. ¡Has ganado!"
        );
    } else {
        $("#titulo-resultado").text("¡Se acabaron las vidas!");
        $("#mensaje-resultado").text(
            "Esta vez no ha podido ser. ¡Inténtalo de nuevo!"
        );
    }

    // Mostrar la puntuación obtenida
    $("#puntos-resultado").text(puntuacion + " pt");

    // Actualizar las clasificaciones
    mostrarTopPastos(resultadoJugador);

    // Ocultar el juego y mostrar el modal de resultado
    $("#juego").addClass("hidden");
    $("#modal-resultado").removeClass("hidden");
}


// Comprobar si se han encontrado todas las vacas
function comprobarVictoria(tablero) {

    for (let fila of tablero) {
        for (let casilla of fila) {

            // Comprobar si queda alguna vaca sin marcar
            if (casilla.idVaca !== null && casilla.estado !== "vaca") {
                return;
            }
        }
    }

    // Todas las vacas están marcadas
    mostrarResultado("victoria");
}
