'use strict'

function inicializarInstrucciones(){
    let filas = {
        "instr-objetivo": "objetivo",
        "instr-pista": "pista",
        "instr-marcar": "marcar",
        "instr-descartar": "descartar",
        "instr-regiones": "regiones",
        "instr-vidas": "vidas",
        "instr-victoria": "victoria",
        "instr-reiniciar": "reiniciar",
        "instr-salir": "salir"
    } 
    //Evento para mostrar la imagen correspondiente a la instrucción al pasar el ratón
    $(".fila-instruccion").on("mouseenter", function(){
        let imagen = filas[this.id];
        let ruta = "assets/images/instrucciones/" + imagen + ".png";
        $("#imagen-instruccion").attr("src", ruta);

    });
    //Evento para mostrar la imagen inicial al salir el ratón
    $(".fila-instruccion").on("mouseleave",  function() {
        $("#imagen-instruccion").attr("src", "assets/images/instrucciones/instrucciones.png");
    });
}