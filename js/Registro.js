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

    const nombre = document.getElementById('usuario');
    const email = document.getElementById('correo');
    const password = document.getElementById('contrasena');
    const genero = document.getElementById('genero');
    const fechaNacimiento = document.getElementById('fecha-nacimiento');
    const rol = document.querySelector('input[name="rol"]:checked');
    const cuentaBancaria = document.getElementById('cuenta-bancaria').value;
    const imagen = document.getElementById('foto'); // Aquí aseguramos que el input exista

    // Verificamos si se ha seleccionado un archivo
    if (imagen.files.length === 0) {
        alert("Por favor, sube una imagen.");
        return;
    }

    const formData = new FormData();
    formData.append('usuario', nombre.value); // Cambiado a 'usuario'
    formData.append('correo', email.value);
    formData.append('contrasena', password.value); // Cambiado a 'contrasena'
    formData.append('genero', genero.value); // Cambiado a 'genero'
    formData.append('fecha-nacimiento', fechaNacimiento.value); // Cambiado a 'fecha-nacimiento'
    formData.append('rol', rol.value);
    formData.append('foto', imagen.files[0]); // Cambiado a 'foto'

    if (rol.value === 'Instructor') {
        formData.append('cuentaBancaria', cuentaBancaria);
    }

    fetch("Models/Usuario.php", {
        method: "POST",
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la red');
        }
        return response.json(); // Esto funcionará correctamente ahora
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
        if (data.success) {
            // Manejar el éxito del registro
            alert(data.message);
            window.location.href = 'login.html'; // Redirigir al login o a otra página
        } else {
            // Manejar errores
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Validar formato de correo electrónico
function validation(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}

