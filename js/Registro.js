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
    event.preventDefault();
    
    let nombre = document.getElementById('usuario').value;
    let email = document.getElementById('correo').value;
    let password = document.getElementById('contrasena').value;
    let genero = document.getElementById('genero').value;
    let fechaNacimiento = document.getElementById('fecha-nacimiento').value;
    let rol = document.querySelector('input[name="rol"]:checked');
    let imagen = document.getElementById('foto').files[0];

    let errorElement = document.getElementById('error');
    errorElement.innerHTML = '';

    let errores = [];

    // Validaciones de campos vacíos
    if (nombre === '') errores.push('El nombre es obligatorio');
    if (email === '') errores.push('El correo es obligatorio');
    if (password === '') errores.push('La contraseña es obligatoria');
    if (genero === '') errores.push('El género es obligatorio');
    if (fechaNacimiento === '') errores.push('La fecha de nacimiento es obligatoria');
    if (!rol) errores.push('Debes seleccionar un rol');
    if (!validation(email)) errores.push('El correo no es válido');
    
    // Validar si se ha subido una imagen
    if (!imagen) {
        errores.push('Debes subir una imagen');
    }

    // Validación de contraseña usando una expresión regular más robusta
    let expresionRegular = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!\"#\$%&/='?¡¿:;,.\\-_+*{\[\]}]).{8,}$/;
    if (!expresionRegular.test(password)) {
        errores.push('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial');
    }

    // Si hay errores, mostrarlos
    if (errores.length > 0) {
        errorElement.innerHTML = errores.join('<br>');
        errorElement.style.display = 'block'; // Mostrar el contenedor de errores
        return false; // Evita que se envíe el formulario
    }

    // Simular el almacenamiento del usuario en localStorage (en un proyecto real, envías esta información al servidor)
    const userData = {
        nombre: nombre,
        email: email,
        password: password,  // En un sistema real, nunca almacenarías contraseñas sin encriptarlas
        genero: genero,
        fechaNacimiento: fechaNacimiento,
        rol: rol.value 
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    alert('Registro exitoso');
    window.location.href = 'login.html'; // Redirigir a la página de login
    return true;    
}

// Validar formato de correo electrónico
function validation(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}

