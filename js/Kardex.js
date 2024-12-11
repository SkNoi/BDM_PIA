document.addEventListener("DOMContentLoaded", () => {
    const tablaCuerpo = document.getElementById("kardex-table");

    // Obtén el usuario desde localStorage
    const usuarioStorage = JSON.parse(localStorage.getItem('usuario'));
    if (!usuarioStorage || !usuarioStorage.ID_User) {
        console.error("No se encontró un usuario válido en localStorage.");
        return;
    }

    const usuario = usuarioStorage.ID_User;

    // Datos a enviar
    const datos = {
        accion: 'login', // Tipo de acción
        usuario: usuario
    };

    // Realiza la solicitud al backend
    fetch("../Models/Kardex.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Especificar que el contenido es JSON
        },
        body: JSON.stringify(datos) // Convertir el objeto a JSON
    })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            // Itera sobre los datos y crea filas
            data.forEach(item => {
                const fila = document.createElement("tr");

                // Crea las celdas
                const celdaCurso = document.createElement("td");
                celdaCurso.textContent = item.ID_Curso;

                const celdaFechaInscripcion = document.createElement("td");
                celdaFechaInscripcion.textContent = item.FechaInscripción;

                const celdaUltimaFechaAcceso = document.createElement("td");
                celdaUltimaFechaAcceso.textContent = item.UltimaFecha_Acceso;

                const celdaFechaTerminado = document.createElement("td");
                celdaFechaTerminado.textContent = item.Fecha_Terminado;

                const celdaEstatus = document.createElement("td");
                celdaEstatus.textContent = item.Estatus;

                const celdaCalificacion = document.createElement("td");
                celdaCalificacion.textContent = item.Calificacion;

                const celdaCreditos = document.createElement("td");
                celdaCreditos.textContent = item.Creditos;

                // Agrega las celdas a la fila
                fila.appendChild(celdaCurso);
                fila.appendChild(celdaFechaInscripcion);
                fila.appendChild(celdaUltimaFechaAcceso);
                fila.appendChild(celdaFechaTerminado);
                fila.appendChild(celdaEstatus);
                fila.appendChild(celdaCalificacion);
                fila.appendChild(celdaCreditos);

                // Agrega la fila a la tabla
                tablaCuerpo.appendChild(fila);
            });
        })
        .catch(error => console.error("Error al obtener los datos:", error));
});
