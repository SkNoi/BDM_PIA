// archivo: script.js

document.addEventListener("DOMContentLoaded", () => {
    const tablaCuerpo = document.getElementById("kardex-table");

    // Realiza una solicitud AJAX al backend
    const localStorage = JSON.parse(localStorage.getItem('usuario'));
    const usuario= localStorage.ID_User;
    const datos = {
        accion: 'login', // Tipo de acción
        usuario: usuario
    };
    fetch("Kardex.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Especificar que el contenido es JSON
        },
        body: JSON.stringify(datos) // Convertir el objeto a JSON
    })
        .then(response => response.json())
        .then(data => {
            // Itera sobre los datos y crea filas
            data.forEach(item => {
                const fila = document.createElement("tr");

                // Crea las celdas
                const ID_Curso = document.createElement("td");
                celdaCurso.textContent = item.ID_Curso;

                const FechaInscripción = document.createElement("td");
                celdaFechaInscripcion.textContent = item.FechaInscripción;

                const UltimaFecha_Acceso = document.createElement("td");
                celdaUltimaFecha_Acceso.textContent = item.UltimaFecha_Acceso;

                const Fecha_Terminado = document.createElement("td");
                celdaFecha_Terminado.textContent = item.Fecha_Terminado;

                const Estatus = document.createElement("td");
                celdaEstatus.textContent = item.Estatus;

                const Calificacion = document.createElement("td");
                celdaCalificacion.textContent = item.Calificacion;

                const Creditos = document.createElement("td");
                celdaCreditos.textContent = item.Creditos;


                // Agrega las celdas a la fila
                fila.appendChild(celdaCurso);
                fila.appendChild(celdaFechaInscripcion);
                fila.appendChild(celdaUltimaFecha_Acceso);
                fila.appendChild(celdaFecha_Terminado);
                fila.appendChild(celdaEstatus);
                fila.appendChild(celdaCalificacion);
                fila.appendChild(celdaCreditos);

                // Agrega la fila a la tabla
                kardex-table.appendChild(fila);
            });
        })
        .catch(error => console.error("Error al obtener los datos:", error));
});
