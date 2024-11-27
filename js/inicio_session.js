function iniciosession(event) {
    event.preventDefault(); // Evita que se envíe el formulario de la manera tradicional

    // Obtener los valores de los campos de entrada
    const usuario = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    // Crear el objeto de datos para el login
    const datos = {
        accion: 'login', // Tipo de acción
        usuario: usuario,
        contrasena: pass
    };

    console.log("Datos enviados:", datos); // Log de datos enviados

    // Usar fetch para enviar la solicitud
    fetch('Models/Usuario.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Especificar que el contenido es JSON
        },
        body: JSON.stringify(datos) // Convertir el objeto a JSON
    })
    .then(response => {
        console.log("Respuesta del servidor:", response); // Log de la respuesta
        if (!response.ok) {
            throw new Error('Error en la comunicación con el servidor.'); // Manejar errores de red
        }
        return response.json(); // Convertir la respuesta en JSON
    })
    .then(resultado => {
        console.log("Resultado JSON:", resultado); // Log del resultado JSON

        if (resultado.success) {
            // Verificar si el estado de la cuenta es habilitado
            if (resultado.message.Estado === 'deshabilitado') {
                // Si la cuenta está deshabilitada, mostrar mensaje de error y no iniciar sesión
                const loginErrorElement = document.getElementById('loginError');
                if (loginErrorElement) {
                    loginErrorElement.textContent = 'Tu cuenta está deshabilitada. Contacta con un administrador.';
                }
                return; // Detener el proceso de inicio de sesión
            }

            // Guardar todos los datos del usuario en localStorage
            localStorage.setItem('usuario', JSON.stringify({
                ID_User: resultado.message.ID_User,
                NombreCompleto: resultado.message.NombreCompleto,
                Correo: resultado.message.Correo,
                Rol: resultado.message.Rol,
                Estado: resultado.message.Estado,
                FechaNacimiento: resultado.message.FechaNacimiento,
                imagen_Perfil: resultado.message.imagen_Perfil,
                Sexo: resultado.message.Sexo,
                contrasena: resultado.message.Contraseña
            }));

            // Redirigir según el rol del usuario
            if (resultado.message.Rol === 'Administrador') {
                window.location.href = "PrincipalAdmin.html"; // Redirigir a la página de admin
            } else if (resultado.message.Rol === 'Instructor') {
                window.location.href = "Principal.html"; // Página específica para instructores
            } else {
                window.location.href = "Principal.html"; // Página específica para estudiantes
            }
        } else {
            // Muestra el mensaje de error si las credenciales son incorrectas
            const loginErrorElement = document.getElementById('loginError');
            if (loginErrorElement) {
                loginErrorElement.textContent = resultado.message; // Mostrar mensaje de error
            } else {
                console.error('Elemento de error no encontrado.');
            }
        }
    })
    .catch(error => {
        console.error('Error al procesar la respuesta:', error);
        const loginErrorElement = document.getElementById('loginError');
        if (loginErrorElement) {
            loginErrorElement.textContent = 'Error al procesar la respuesta del servidor. Intenta nuevamente.';
        }
    });
}
