//Evento de carga de la página
$(document).ready(function() {

    let user = localStorage.getItem("usuario");

    console.log("EL NOMBRE DEL USUAIO ES: " + user);

}); 

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el rol del usuario desde localStorage (o cualquier otra fuente)
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const rol = usuario ? usuario.rol : null;

    // Mostrar/Ocultar secciones basadas en el rol
    const seccionCursos = document.getElementById('seccionCursos');
    const seccionPublicaciones = document.getElementById('seccionPublicaciones');
    const campoRol = document.querySelectorAll('input[name="opcionesRol"]');

    if (rol === 'Estudiante') {
        seccionCursos.style.display = 'block';
        seccionPublicaciones.style.display = 'none';
    } else if (rol === 'Instructor') {
        seccionCursos.style.display = 'none';
        seccionPublicaciones.style.display = 'block';
    }

    // Remover el campo de selección de rol si es necesario
    campoRol.forEach(campo => campo.style.display = 'none');

    // Habilitar/Deshabilitar los inputs al alternar el switch de edición
    const toggleEditar = document.getElementById('toggleEditar');
    const inputs = document.querySelectorAll('#formRegistro input, #formRegistro select');
    
    toggleEditar.addEventListener('change', function() {
        const isEditable = toggleEditar.checked;
        // Asegurarse de que el toggleEditar no sea deshabilitado
        inputs.forEach(input => {
            if (input !== toggleEditar) {
                input.disabled = !isEditable;
            }
        });
    });

    // Inicialmente deshabilitar los campos (excepto el toggleEditar)
    inputs.forEach(input => {
        if (input !== toggleEditar) {
            input.disabled = true;
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Obtener el usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // Verificar si el usuario está en el localStorage
    if (usuario) {
        // Asignar los valores del localStorage a los campos del perfil
        localStorage.setItem("ID", usuario.ID_User);
        document.getElementById('campoNombre').value = usuario.NombreCompleto || '';
        document.getElementById('campoCorreo').value = usuario.Correo || '';
        document.getElementById('campoFechaNacimiento').value = usuario.FechaNacimiento || '';
        document.getElementById('campoContrasena').value = usuario.contrasena || '';

        //Si la imagen de perfil obtenida es nula, mostrar una imagen por defecto
        let imagenPerfilObtenida = usuario.imagen_Perfil;
        if (imagenPerfilObtenida == null)
            $('#imagenSeleccionada').attr('src', 'Recursos/icon_user.png');
        else
            $('#imagenSeleccionada').attr('src', "data:image/png;base64," + imagenPerfilObtenida);

        let opc;
        let Sexo = usuario.Sexo;
        if(Sexo === "masculino"){

            opc=1;
        } else if (Sexo === "femenino"){
            opc=2;
        } else {
            opc=3;
        }

        let combobox = document.getElementById('campoSexo');
        combobox.value= opc;

    } else {
        console.log('No hay un usuario en localStorage');
    }

    // Mostrar/Ocultar secciones basadas en el rol
    const seccionCursos = document.getElementById('seccionCursos');
    const seccionPublicaciones = document.getElementById('seccionPublicaciones');
    const campoRol = document.querySelectorAll('input[name="opcionesRol"]');

    if (usuario && usuario.Rol === 'Estudiante') {
        seccionCursos.style.display = 'block';
        seccionPublicaciones.style.display = 'none';
    } else if (usuario && usuario.Rol === 'Instructor') {
        seccionCursos.style.display = 'none';
        seccionPublicaciones.style.display = 'block';
    }

    // Remover el campo de selección de rol si es necesario
    campoRol.forEach(campo => campo.style.display = 'none');

    
    // Inicialmente deshabilitar los campos
    inputs.forEach(input => input.disabled = true);
});


document.getElementById('formActualizar').addEventListener('submit', actualizarPerfil);

function previewImage(event) {
    const preview = document.getElementById('imagenSeleccionada');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = 'Recursos/icon_user.png';  // Imagen por defecto si no se selecciona ninguna
        preview.style.display = 'block';
    }
}

function actualizarPerfil(event) {
    event.preventDefault();  // Evita que se envíe el formulario automáticamente

    let nombre = document.getElementById('campoNombre').value;
    let sexo = document.getElementById('campoSexo').value;
    let fechaNacimiento = document.getElementById('campoFechaNacimiento').value;
    let correo = document.getElementById('campoCorreo').value;
    let contrasena = document.getElementById('campoContrasena').value;
    let imagen = document.getElementById('foto');  // La nueva imagen de perfi
    let Id = localStorage.getItem("ID");

    // Verificar si se ha seleccionado una imagen
    if (imagen.files.length === 0) {
        alert("Por favor, sube una imagen.");
        return;
    }

    const datos = {
        accion: 'actualizar', // Tipo de acción
        nombreCompleto: nombre,
        contrasena: contrasena,
        correo: correo,
        sexo: sexo,
        fechaNacimiento: fechaNacimiento,
        idUsuario: Id,
        imagen: imagen
    };

    fetch("Models/Usuario.php", {  // Archivo PHP que maneja la actualización
        method: "POST",
        headers: {
            'Content-Type': 'application/json' // Especificar que el contenido es JSON
        },
        body: JSON.stringify(datos) 

    })

    .then(response => response.text())  // Asumiendo que el servidor devuelve un JSON
    .then(responseText => {
        try {
            let respuesta = JSON.parse(responseText);
            if (respuesta.success) {
                alert(respuesta.message);
                // Puedes redirigir al perfil o actualizar visualmente la información
                window.location.href = "perfilUsuario.html";
            } else {
                let mensajeFinal = "Se han detectado los siguientes errores:\n\n";
                respuesta.mensaje.forEach(error => {
                    mensajeFinal += "● " + error + "\n\n";
                });
                alert(mensajeFinal);
            }
        } catch (error) {
            alert('Error al procesar la respuesta del servidor: ' + responseText);
            console.error('Error:', error);
        }
    })
    .catch(error => {
        alert("Ocurrió un error inesperado al comunicarse con el servidor.");
        console.error("Error:", error);
    });
}
