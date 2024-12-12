document.addEventListener("DOMContentLoaded", () => {
    const resumencursos = document.getElementById("resumencursos");

    // Obtén el usuario desde localStorage
    const usuarioStorage = JSON.parse(localStorage.getItem('usuario'));
    if (!usuarioStorage || !usuarioStorage.ID_User) {
        console.error("No se encontró un usuario válido en localStorage.");
        return;
    }

    const ID_User = usuarioStorage.ID_User; // Solo se necesita obtener una vez

    console.log("El ID del usuario es:", ID_User);

    // Datos a enviar
    const datos = {
        accion: 'login', // Tipo de acción
        usuario: ID_User
    };

    // Realiza la solicitud al backend
    fetch("../Models/VentasI.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Especificar que el contenido es JSON
        },
        body: JSON.stringify({ ID_User })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);

            // Verifica si se obtuvieron datos
            if (!data || data.length === 0) {
                console.log("No se encontraron datos para este usuario.");
                return; // Si no hay datos, no hacer nada
            }

            // Itera sobre los datos y crea filas
            data.forEach(item => {
                const fila = document.createElement("tr");

                // Crea las celdas
                const celdaTitulo = document.createElement("td");
                celdaTitulo.textContent = item.Titulo || "N/A"; // En caso de que no haya datos

                const celdaCursoEstatus = document.createElement("td");
                celdaCursoEstatus.textContent = item.CursoEstatus || "N/A";

                const celdaCosto = document.createElement("td");
                celdaCosto.textContent = item.Costo || "N/A";

                const celdaTotalVentas = document.createElement("td");
                celdaTotalVentas.textContent = item.TotalVentas || "N/A";

                const celdaMetodoPago = document.createElement("td");
                celdaMetodoPago.textContent = item.MetodoPago || "N/A";

                const celdaPorcentajeEstatus = document.createElement("td");
                celdaPorcentajeEstatus.textContent = item.PorcentajeEstatus || "N/A"; // Asumiendo que el campo correcto es "PorcentajeEstatus"

                // Agrega las celdas a la fila
                fila.appendChild(celdaTitulo);
                fila.appendChild(celdaCursoEstatus);
                fila.appendChild(celdaCosto);
                fila.appendChild(celdaTotalVentas);
                fila.appendChild(celdaMetodoPago);
                fila.appendChild(celdaPorcentajeEstatus);

                // Agrega la fila a la tabla
                resumencursos.appendChild(fila);
            });
        })
        .catch(error => console.error("Error al obtener los datos:", error));
});
