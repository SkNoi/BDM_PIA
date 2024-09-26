function iniciosession(event) {
    // Evita que el formulario se envíe y la página se recargue
    event.preventDefault();

    var usuario = document.getElementById("email").value;
    var pass = document.getElementById("password").value;

    if (usuario === "" || pass === "") {
        alert("Por favor, complete los campos");
        return false;
    }

    // Recuperar los datos guardados en LocalStorage
    const savedData = JSON.parse(localStorage.getItem('userData'));

    // Verificar si el correo y la contraseña coinciden con los datos guardados
    if (savedData && savedData.email === usuario && savedData.password === pass) {
        alert("Inicio de sesión exitoso");
        window.location.href = "Principal.html";  // Redirigir a Principal.html
        return true;
    } else {
        alert("Correo o contraseña incorrectos");
        return false;
    }
}
