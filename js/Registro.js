document.addEventListener('DOMContentLoaded', function() {
    // Escuchar cambios en los checkboxes de rol
    const roles = document.querySelectorAll('input[name="rol"]');
    roles.forEach(role => {
        role.addEventListener('change', toggleCuentaBancaria);
    });

    // Llamar a la función una vez para asegurar el estado inicial
    toggleCuentaBancaria();
});

function toggleCuentaBancaria() {
    const cuentaBancariaContainer = document.getElementById('cuenta-bancaria-container');
    const rol = document.querySelector('input[name="rol"]:checked');

    // Mostrar el campo de cuenta bancaria si el rol es "Instructor"
    if (rol && rol.value === 'Instructor') {
        cuentaBancariaContainer.style.display = 'block';
    } else {
        cuentaBancariaContainer.style.display = 'none';
    }
}

function previewImage(event) {
    const preview = document.getElementById('preview');
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

function SignUp(event) {
    event.preventDefault();  // Evitar que el formulario se envíe automáticamente

    const nombre = document.getElementById('usuario').value;
    const email = document.getElementById('correo').value;
    const password = document.getElementById('contrasena').value;
    const genero = document.getElementById('genero').value;
    const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
    const rol = document.querySelector('input[name="rol"]:checked').value;
    const cuentaBancaria = document.getElementById('cuenta-bancaria').value;
    const imagen = document.getElementById('foto'); // Aquí aseguramos que el input exista

    // Verificamos si se ha seleccionado un archivo
    if (imagen.files.length === 0) {
        alert("Por favor, sube una imagen.");
        return;
    }

    const formData = new FormData();
    formData.append('usuario', nombre); // Cambiado a 'usuario'
    formData.append('correo', email);
    formData.append('contrasena', password); // Cambiado a 'contrasena'
    formData.append('genero', genero); // Cambiado a 'genero'
    formData.append('fecha-nacimiento', fechaNacimiento); // Cambiado a 'fecha-nacimiento'
    formData.append('rol', rol);
    formData.append('foto', imagen.files[0]); // Cambiado a 'foto'

    if (rol.value === 'Instructor') {
        formData.append('cuentaBancaria', cuentaBancaria);
    }
    fetch("Models/Usuario.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text()) // Cambia a text() para obtener HTML
    .then(responseText => {
        try {
            let respuesta = JSON.parse(responseText); // Intenta parsear a JSON
            if (respuesta.success) {
                alert(respuesta.message);
                window.location.href = "login.html"; // Redirigir al login
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

// Validar formato de correo electrónico
function validation(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}

