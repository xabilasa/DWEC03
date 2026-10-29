'use-strict'

    var formulario = document.querySelector("#form-acceso");
    var boton = document.querySelector("#btn-entrar");

    function envioFormulario(evento){
        evento.preventDefault();
        let usuario = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        if (validarAcceso(usuario, password)){
            document.getElementById('mensaje-acceso').textContent = "Acceso correcto";
            mostrarPantalla('bienvenida');
        } else {
            document.getElementById('mensaje-acceso').textContent = "Acceso denegado";
        };
    }

    formulario.addEventListener('click', function(evento){
        envioFormulario(evento);
    });
