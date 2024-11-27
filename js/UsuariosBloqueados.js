document.getElementById("restaurarUsuarioForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const correoInput = document.getElementById("correo").value;
    const contrasenaInput = document.getElementById("contrasena").value;

    // Crear un objeto con los datos
    const formData = new FormData();
    formData.append("accion", "restaurarUsuario");
    formData.append("correo", correoInput); // No es necesario usar .value aquí
    formData.append("contrasena", contrasenaInput); // No es necesario usar .value aquí

    fetch("Models/Usuario.php", {
        method: "POST",
        body: formData
   })
   .then(response => response.text()) // Usamos text() para ver la respuesta sin procesar
   .then(data => {
        console.log("Respuesta del servidor:", data); // Mostrar la respuesta del servidor
   
        // Intentar convertir la respuesta a JSON
        try {
            const jsonData = JSON.parse(data); // Intentamos parsear manualmente la respuesta
            if (jsonData.success) {
                alert("Usuario restaurado correctamente");
            } else {
                alert("Error: " + jsonData.error);
            }
        } catch (e) {
            console.error("Error al parsear la respuesta JSON:", e);
            alert("Hubo un error con la respuesta del servidor.");
        }
   })
   .catch(error => {
        console.error("Error al restaurar el usuario:", error);
        alert("Ocurrió un error en la solicitud.");
   });
   
});
