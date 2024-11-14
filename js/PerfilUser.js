//Evento de carga de la página
$(document).ready(function() {

    let user = localStorage.getItem("usuario");

    console.log("EL NOMBRE DEL USUAIO ES: " + user);

}); 

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
        preview.src = '';
        preview.style.display = 'none';
    }
}

document.getElementById('foto').addEventListener('change', previewImage);






document.addEventListener('DOMContentLoaded', function() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario) {
        localStorage.setItem("ID", usuario.ID_User);
        document.getElementById('campoNombre').value = usuario.NombreCompleto || '';
        document.getElementById('campoCorreo').value = usuario.Correo || '';
        document.getElementById('campoFechaNacimiento').value = usuario.FechaNacimiento || '';
        document.getElementById('campoContrasena').value = usuario.contrasena || '';
        

        // Manejar la imagen de perfil
        const imagenPerfilObtenida = usuario.imagen_Perfil;
        let imagenSrc;

        
        if (imagenPerfilObtenida) {
            if (imagenPerfilObtenida.startsWith('data:image/')) {
                imagenSrc = imagenPerfilObtenida; // Ya está en formato correcto
            } else {
                imagenSrc = `data:image/png;base64,${imagenPerfilObtenida}`; // Asumimos que es PNG por defecto
            }
        } else {
            imagenSrc = 'Recursos/icon_user.png'; // Imagen por defecto
        }

        $('#imagenSeleccionada').attr('src', imagenSrc);


        // Asignar el sexo al combobox
        const combobox = document.getElementById('campoSexo');
        combobox.value = usuario.Sexo || 'Otro';


        
        // Mostrar/Ocultar secciones basadas en el rol
        const seccionCursos = document.getElementById('seccionCursos');
        const seccionPublicaciones = document.getElementById('seccionPublicaciones');

        if (usuario.Rol === 'Estudiante') {
            seccionCursos.style.display = 'block';
            seccionPublicaciones.style.display = 'none';
        } else if (usuario.Rol === 'Instructor') {
            seccionCursos.style.display = 'none';
            seccionPublicaciones.style.display = 'block';
        }
    
    } else {
        console.log('No hay un usuario en localStorage');
    }

    // Habilitar/Deshabilitar los inputs al alternar el switch de edición
    const toggleEditar = document.getElementById('toggleEditar');
    const inputs = document.querySelectorAll('#formActualizar input, #formActualizar select');
    
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
    const toggleEditar = document.getElementById('toggleEditar');
    const inputs = document.querySelectorAll('#formRegistro input, #formRegistro select');

    // Asegurarse de que el toggleEditar está en el DOM y no es nulo
    if (toggleEditar) {
        // Inicialmente deshabilitar los campos (excepto el toggleEditar)
        inputs.forEach(input => {
            if (input !== toggleEditar) {
                input.disabled = true;
            }
        });

        // Habilitar/Deshabilitar los inputs al alternar el switch de edición
        toggleEditar.addEventListener('change', function() {
            const isEditable = toggleEditar.checked;
            inputs.forEach(input => {
                if (input !== toggleEditar) {
                    input.disabled = !isEditable;
                }
            });
        });
    } else {
        console.error('El elemento toggleEditar no se encuentra en el DOM.');
    }
});



document.getElementById('formActualizar').addEventListener('submit', actualizarPerfil);
const usuario = JSON.parse(localStorage.getItem('usuario'));

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

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Cuando la lectura termina, se resuelve con el resultado
        reader.onerror = reject; // Manejo de errores
        reader.readAsDataURL(blob); // Leer el blob como Data URL
    });
}

async function actualizarPerfil(event) {
    event.preventDefault();  // Evita que se envíe el formulario automáticamente

    let nombre = document.getElementById('campoNombre').value;
    let sexo = document.getElementById('campoSexo').value;
    let fechaNacimiento = document.getElementById('campoFechaNacimiento').value;
    let correo = document.getElementById('campoCorreo').value;
    let contrasena = document.getElementById('campoContrasena').value;
    let imagen = document.getElementById('foto').files[0]; // Obtén el archivo de la imagen
    let Id = localStorage.getItem("ID");

    // Crear un objeto FormData para manejar el envío de datos y archivos
    const formData = new FormData();
    formData.append('accion', 'actualizar');         // Acción para que el servidor identifique la operación
    formData.append('nombreCompleto', nombre);
    formData.append('contrasena', contrasena);
    formData.append('correo', correo);
    formData.append('sexo', sexo);
    formData.append('fechaNacimiento', fechaNacimiento);
    formData.append('idUsuario', Id);
    formData.append('Avatar', imagen);      // Adjuntar la imagen seleccionada

    // Enviar la petición al servidor
    fetch("Models/Usuario.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(async responseText => {
        try {
            let respuesta = JSON.parse(responseText);
            if (respuesta.success) {
                // Solo convertir a base64 si hay una nueva imagen
                let imagenBase64 = null;
                if (imagen) {
                    imagenBase64 = await blobToBase64(imagen); // Convierte el blob a base64
                }

                // Actualizar localStorage con la nueva información
                const usuarioActualizado = {
                    ID_User: Id,
                    NombreCompleto: nombre,
                    Correo: correo,
                    FechaNacimiento: fechaNacimiento,
                    Sexo: sexo,
                    contrasena: contrasena,
                    Rol: respuesta.rol || JSON.parse(localStorage.getItem('usuario')).Rol,
                    imagen_Perfil: imagenBase64, // Almacenar como base64
                };

                localStorage.setItem('usuario', JSON.stringify(usuarioActualizado)); // Guardar usuario actualizado en localStorage

                alert(respuesta.message);
                if (usuario.Rol === 'Administrador') {
                    window.location.href = "PerfilAdmin.html"; // Redirige a la página de perfil del administrador
                } else {
                    window.location.href = "perfilUsuario.html"; // Redirige a la página de perfil del usuario
                }

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


