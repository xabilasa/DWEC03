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
    // comprueba y elimina espacios de la cadena user
    let newcadena = "";
    for (let i = 0; i < cadena.length; i++){
        let caracter = cadena[i];
        if (caracter !== " "){
            newcadena += caracter;
        }
    }
    return newcadena;
}

//Solo letras y números en contraseña
function validarFormatoContrasena(contrasena) {
const patron =  /^[a-zA-Z0-9]{4,12}$/;
return patron.test(contrasena);
}

function validarAcceso(usuario, contrasena) {
    let userin = quitarEspacios(usuario);
    let passin = contrasena;
    if (!validarFormatoContrasena(passin)) {
        console.log("Formato de contraseña incorrecto");
        return false;
    }
    if (usuarios[userin] !== undefined && usuarios[userin] === passin) {
        console.log("Acceso correcto");
        return true;
    }
    console.log("Acceso denegado, Usuario o contraseña incorrectas");
    return false;
}
