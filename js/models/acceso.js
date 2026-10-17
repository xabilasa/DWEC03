'use-strict'
    var usuarios ={
        'birt': '1234',
        'xabi': '0000',
        'admin': 'admin',
        '1234': '1234',
        'admini': '1234',
        '5678': 'admin',
    };

    function quitarEspacios(cadena){
        // comprueba y elimina espacios de la cadena user y pass
        let newcadena = "";
        for (let i = 0; i < cadena.length; i++){
            let caracter = cadena[i];
            if (caracter !== " "){
                newcadena += caracter;
            }
        }
        return newcadena;
    }

    function validarAcceso(usuario, contrasena){
        let userin = quitarEspacios(usuario);
        let passin = quitarEspacios(contrasena);
        if(usuarios[userin] !== undefined && usuarios[userin] === passin){
            console.log("Acceso correcto");
            return true;
        } else {
            console.log("Acceso denegado, Usuario o contraseña incorrectas");
            return false;
        }
    }