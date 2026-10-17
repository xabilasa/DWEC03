'use-strict'

    function mostrarPantalla(idPantalla) {
        var pantallas = document.querySelectorAll('body > main');

        for (let i = 0; i < pantallas.length; i++) {
            pantallas[i].classList.remove('block');
            pantallas[i].classList.add('hidden');
        }

        var pantallaSeleccionada = document.getElementById(idPantalla);

        if (pantallaSeleccionada !== null) {
            pantallaSeleccionada.classList.remove('hidden');
            pantallaSeleccionada.classList.add('block');
        }
    }