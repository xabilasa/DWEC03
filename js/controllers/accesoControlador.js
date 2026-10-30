'use-strict'

var formulario = document.querySelector("#form-acceso");
// Evita que el formulario haga envíos nativos por su cuenta para que el pestillo controle el acceso
formulario.addEventListener('submit', function(evento){
    evento.preventDefault();
});
function envioFormulario(){
    let usuario = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    if (validarAcceso(usuario, password)){
        document.getElementById('mensaje-acceso').textContent = "Acceso correcto";
        document.getElementById('mensaje-acceso').className = "mensaje exito";
        mostrarPantalla('bienvenida');
    } else {
        document.getElementById('mensaje-acceso').textContent = "Acceso denegado";
        document.getElementById('mensaje-acceso').className = "mensaje error";
        // Si falla, hacemos que el pestillo vuelva a su sitio de inmediato
        $("#barra-pestillo-movil").animate({ left: "12px" }, 250);
        $("#pomo-pestillo-movil").animate({ left: "110px" }, 250);
    }
}
//Eventos del pestillo sincronizando el movimiento con el formulario y el envio
function inicializarEventosAcceso() {
    let arrastrando = false;
    let pestilloDesbloqueado = false;
    let xInicialRaton = 0;
    let barraInicialLeft = 12;
    let pomoInicialLeft = 110; 
    const DESFASE_POMO_BARRA = 98; 
    const limiteApertura = 70;    
    const $barra = $("#barra-pestillo-movil");
    const $pomo = $("#pomo-pestillo-movil");
    // Evento a lpulsar el pomo (sin liberar para arrastrar)
    $pomo.mousedown(function(evento) {
        arrastrando = true;
        xInicialRaton = evento.pageX;
        // Guardamos las posiciones en el instante del clic
        barraInicialLeft = parseInt($barra.css("left")) || 12;
        pomoInicialLeft = parseInt($pomo.css("left")) || 110;
        // Leemos los inputs para verificar las credenciales en este momento
        let usuario = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        // Validamos el acceso desbloqueando el pestillo
        if (validarAcceso(usuario, password)) {
            pestilloDesbloqueado = true; // El cerrojo se libera por completo
            $("#mensaje-acceso").removeClass("error").addClass("exito").text("¡Cerrojo desbloqueado!");
        } else {
            pestilloDesbloqueado = false; // El cerrojo se queda atascado
        }
        evento.preventDefault(); // Evita que el navegador congele el arrastre al seleccionar texto
    });

    // Evento de arrastrado de cursor por pantalla
    $(document).mousemove(function(evento) {
        if (arrastrando) {
            let diferencialX = evento.pageX - xInicialRaton;
            let nuevaPosicionBarra = barraInicialLeft + diferencialX;
            // El tope izquierdo siempre es la posición inicial (12px)
            if (nuevaPosicionBarra < 12) {
                nuevaPosicionBarra = 12;
            }
            // Efecto de atasco en pestillo para cuando no se ha logueado correctamente
            if (pestilloDesbloqueado) {
                // Si los datos son correctos, permite el recorrido total hacia el soporte derecho
                if (nuevaPosicionBarra > 78) {
                    nuevaPosicionBarra = 78;
                }
            } else {
                // Si están mal, solo le dejamos moverse 15px dcha simulando resistencia (Tope en 27px)
                if (nuevaPosicionBarra > 27) {
                    nuevaPosicionBarra = 27;
                }
            }
            // Mantenemos al pomo acoplado sumando el desfase fijo de píxeles
            let nuevaPosicionPomo = nuevaPosicionBarra + DESFASE_POMO_BARRA;
            // Renderizado instantáneo del bloque en pantalla
            $barra.css("left", nuevaPosicionBarra + "px");
            $pomo.css("left", nuevaPosicionPomo + "px");
        }
    });
    // El pestillo hace submit cuando se libera el botón del ratón
    $(document).mouseup(function() {
        if (arrastrando) {
            arrastrando = false;
            let barraPosicionFinal = parseInt($barra.css("left")) || 12;
            // Evaluamos el éxito solo si llegó al extremo final estando desbloqueado
            if (barraPosicionFinal >= limiteApertura && pestilloDesbloqueado) {
                envioFormulario();
            } else {
                // Animación de regreso del bloque completo a su sitio con animación de muelle
                $barra.animate({ left: "12px" }, 200);
                $pomo.animate({ left: "110px" }, 200);
                // Si intentaron forzar el cerrojo con datos incorrectos, disparamos  alerta de error
                if (!pestilloDesbloqueado) {
                    envioFormulario(); 
                }
            }
        }
    });
}

// Invocamos los listeners del pestillo
inicializarEventosAcceso();
