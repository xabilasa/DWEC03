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
    let pestilloDesbloqueado = false; // Estado del cerrojo según las credenciales
    let xInicialRaton = 0;
    
    let barraInicialLeft = 12;
    let pomoInicialLeft = 110; 
    
    const DESFASE_POMO_BARRA = 98; // Une las piezas en conjunto (110 - 12)
    const limiteApertura = 70;    // Umbral físico para validar el acceso en el mouseup

    const $barra = $("#barra-pestillo-movil");
    const $pomo = $("#pomo-pestillo-movil");

    // 1. MOUSEDOWN: Al pulsar el pomo circular metálico
    $pomo.mousedown(function(evento) {
        arrastrando = true;
        xInicialRaton = evento.pageX;
        
        // Guardamos las posiciones en el instante del clic
        barraInicialLeft = parseInt($barra.css("left")) || 12;
        pomoInicialLeft = parseInt($pomo.css("left")) || 110;
        
        // Leemos los inputs para verificar las credenciales en este momento
        let usuario = document.getElementById('username').value;
        let password = document.getElementById('password').value;

        // Validamos contra tu función del modelo
        if (validarAcceso(usuario, password)) {
            pestilloDesbloqueado = true; // El cerrojo se libera por completo
            $("#mensaje-acceso").removeClass("error").addClass("exito").text("¡Cerrojo desbloqueado!");
        } else {
            pestilloDesbloqueado = false; // El cerrojo se queda atascado
        }
        
        evento.preventDefault(); // Evita que el navegador congele el arrastre al seleccionar texto
    });

    // 2. MOUSEMOVE: Al arrastrar el cursor por la pantalla
    $(document).mousemove(function(evento) {
        if (arrastrando) {
            let diferencialX = evento.pageX - xInicialRaton;
            let nuevaPosicionBarra = barraInicialLeft + diferencialX;

            // El tope izquierdo siempre es la posición inicial (12px)
            if (nuevaPosicionBarra < 12) {
                nuevaPosicionBarra = 12;
            }

            // TOPE DERECHO DINÁMICO (Efecto atasco)
            if (pestilloDesbloqueado) {
                // Si los datos son correctos, permite el recorrido total hacia el soporte derecho
                if (nuevaPosicionBarra > 78) {
                    nuevaPosicionBarra = 78;
                }
            } else {
                // Si están mal, solo le dejamos moverse 15px simulando resistencia (Tope en 27px)
                if (nuevaPosicionBarra > 27) {
                    nuevaPosicionBarra = 27;
                }
            }

            // Mantenemos al pomo acoplado sumando el desfase fijo de píxeles
            let nuevaPosicionPomo = nuevaPosicionBarra + DESFASE_POMO_BARRA;

            // Renderizado síncrono e instantáneo del bloque en pantalla
            $barra.css("left", nuevaPosicionBarra + "px");
            $pomo.css("left", nuevaPosicionPomo + "px");
        }
    });

    // 3. MOUSEUP: Al soltar el botón del ratón en cualquier coordenada
    $(document).mouseup(function() {
        if (arrastrando) {
            arrastrando = false;
            
            let barraPosicionFinal = parseInt($barra.css("left")) || 12;
            
            // Evaluamos el éxito solo si llegó al extremo final estando desbloqueado
            if (barraPosicionFinal >= limiteApertura && pestilloDesbloqueado) {
                // Invoca a tu función original para mostrar "Acceso correcto" y pasar de pantalla
                envioFormulario();
            } else {
                // RETORNO ELÁSTICO: Regresa el bloque completo a su sitio con animación de muelle
                $barra.animate({ left: "12px" }, 200);
                $pomo.animate({ left: "110px" }, 200);
                
                // Si intentaron forzar el cerrojo con datos incorrectos, disparamos tu alerta de error
                if (!pestilloDesbloqueado) {
                    envioFormulario(); // Invoca a tu función original para pintar "Acceso denegado"
                }
            }
        }
    });
}

// INVOCACIÓN FINAL: Arranca y activa todos los listeners del pestillo automáticamente al cargar el script
inicializarEventosAcceso();