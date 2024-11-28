document.getElementById("crearCurso").addEventListener("submit", function(e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const cursoName = document.getElementById("titulo").value;
    const cursoCost = document.getElementById("precio").value;
    const cursoDescription = document.getElementById("descripcion").value;
    const cursoCategory = document.getElementById("categoria").value;
    const cursoDuration = document.getElementById("duracion").value;
    const cursoImage = document.getElementById("imagen").value;
    
    let Id = localStorage.getItem("ID"); // Obtener el ID del usuario

    // Verificar si el ID está presente
    if (!Id) {
        alert("No se ha encontrado el ID del usuario.");
        return;
    }

    // Crear un objeto FormData para enviar al servidor
    const formData = new FormData();
    formData.append("accion", "crearCurso");
    formData.append("Titulo", cursoName);
    formData.append("Costo", cursoCost);
    formData.append("Descripcion", cursoDescription);
    formData.append("ID_CATEGORIA", cursoCategory);
    formData.append("ID_Instructor", Id);  // Asegurarse de que este valor esté siendo correctamente enviado
    formData.append("Duracion", cursoDuration);
    formData.append("ImagenCurso", cursoImage);


    // Hacer la solicitud AJAX usando fetch
    fetch("Controllers/CursoController.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())  // Parseamos la respuesta JSON
    .then(data => {
        if (data.success) {
            // Mostrar mensaje de éxito
            alert(data.message);
            // Opcional: limpiar los campos del formulario
            document.getElementById("titulo").value = '';
            document.getElementById("descripcion").value = '';
            document.getElementById("precio").value = '';
            document.getElementById("categoria").value = '';
            document.getElementById("duracion").value = '';
            document.getElementById("imagen").value = '';
        } else {
            // Mostrar mensaje de error
            alert(data.error || "Hubo un error al crear el curso.");
        }
    })
    .catch(error => {
        // Manejo de errores de la solicitud
        alert("Error de comunicación con el servidor: " + error);
    });
});