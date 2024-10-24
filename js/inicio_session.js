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
        return response.text(); // Usar text() para obtener la respuesta completa
    })
    .then(text => {
        console.log("Texto de respuesta:", text); // Log del texto de respuesta
        try {
            let resultado = JSON.parse(text); // Intentar convertir el texto a JSON
            console.log("Resultado JSON:", resultado); // Log del resultado JSON
            
            if (resultado.success) {
                sessionStorage.setItem('rol', resultado.message.Rol); // Cambié de message a rol
                console.log('El resultado es:'+ resultado.message.Rol);
                // Redirigir según el rol del usuario
                if (resultado.Rol === 'Administrador') {
                    window.location.href = "PrincipalAdmin.html"; // Redirigir a la página de admin
                } else if (resultado.Rol === 'Instructor') {
                    window.location.href = "Principal.html"; // Página específica para instructores
                } else {
                    window.location.href = "Principal.html"; // Página específica para estudiantes
                }
            } else {
                // Muestra el mensaje de error
                const loginErrorElement = document.getElementById('loginError');
                if (loginErrorElement) {
                    loginErrorElement.textContent = resultado.message; // Mostrar mensaje de error
                } else {
                    console.error('Elemento de error no encontrado.');
                }
            }
        } catch (error) {
            console.error('Respuesta inesperada del servidor:', text);
            const loginErrorElement = document.getElementById('loginError');
            if (loginErrorElement) {
                loginErrorElement.textContent = 'Respuesta inesperada del servidor.';
            }
        }
    });
}
