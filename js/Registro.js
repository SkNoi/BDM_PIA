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
    let imagen = document.getElementById('foto').files[0];

    let errorElement = document.getElementById('error');
    errorElement.innerHTML = '';

    let errores = [];

    if (nombre === '') errores.push('El nombre es obligatorio');
    if (email === '') errores.push('El correo es obligatorio');
    if (password === '') errores.push('La contraseña es obligatoria');
    if (genero === '') errores.push('El género es obligatorio');
    if (fechaNacimiento === '') errores.push('La fecha de nacimiento es obligatoria');
    if (!validation(email)) errores.push('El correo no es válido');
    
    if (!imagen) {
        errores.push('Debes subir una imagen'); // Agregar mensaje de error
    }

    if (!validation(email)) errores.push('El correo no es válido');

    if (password.length < 6) errores.push('La contraseña debe tener al menos 6 caracteres');
    if (!containsSpecialChar(password)) errores.push('La contraseña debe contener al menos un carácter especial: ¡”#$%&/=’?¡¿:;,.-_+*{][}');

    if (errores.length > 0) {
        errorElement.innerHTML = errores.join('<br>');
        errorElement.style.display = 'block'; // Mostrar el contenedor de errores
        return false; // Evita que se envíe el formulario
    }

    alert('Registro exitoso');
    window.location.href = 'index.html';
    return true;
    
}


function validation(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);

}

function containsSpecialChar(password) {
    const specialChars = /[¡”#$%&/=’?¡¿:;,.\-_+*{\[\]}]/;
    return specialChars.test(password);
}

