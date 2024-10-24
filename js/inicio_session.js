$(document).ready(function() {   $('#Login').submit(function(event) { iniciosession(event); });
});

function iniciosession(event) {
    // Evita que el formulario se envíe y la página se recargue
    event.preventDefault();

    var usuario = document.getElementById("email").value;
    var pass = document.getElementById("password").value;

    if (usuario === "" || pass === "") {
        alert("Por favor, complete los campos");
        return false;
    }    

    const datos = {
        accion: 'login', // Tipo de acción
        usuario: usuario,
        contrasena: pass
    };

    console.log("El usuario es:" + usuario);
    console.log("El usuario es:" + pass);

    fetch('Models/Usuario.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Especificar que el contenido es JSON
        },
        body: JSON.stringify(datos) // Convertir el objeto a JSON
    })
    .then(response => {
        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error('Error en la comunicación con el servidor.'); // Manejar errores de red
        }
        return response.json(); // Parsear la respuesta como JSON
    })
    .then(resultado => {
        if (resultado.success) {
            // Guardar el rol en sessionStorage
            sessionStorage.setItem('rol', resultado.rol); // Cambié de message a rol
    
            // Redirigir según el rol del usuario
            if (resultado.rol === 'Administrador') {
                window.location.href = "PrincipalAdmin.html"; // Redirigir a la página de admin
            } else if (resultado.rol === 'Instructor') {
                window.location.href = "Principal.html"; // Asegúrate de tener una página específica para instructores
            } else {
                window.location.href = "Principal.html"; // Asegúrate de tener una página específica para estudiantes
            }
        } else {
            // Muestra el mensaje de error
            const loginErrorElement = document.getElementById('loginError');
            if (loginErrorElement) {
                loginErrorElement.textContent = resultado.message;
            } else {
                console.error('Elemento de error no encontrado.');
            }
        }
    })
    .catch(error => {
        console.error('Error en la respuesta:', error);
        const loginErrorElement = document.getElementById('loginError');
        if (loginErrorElement) {
            loginErrorElement.textContent = 'Error al comunicarse con el servidor.';
        }
    });

}
