document.addEventListener("DOMContentLoaded", () => {
    const reportes = document.getElementById("reportes");

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
    fetch("../Models/view-reports.php", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' // Especificar que el contenido es JSON
        },
        
    })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            // Itera sobre los datos y crea filas
            data.forEach(item => {
                const fila = document.createElement("tr");

                // Crea las celdas
                const celdaUsuario = document.createElement("td");
                celdaUsuario.textContent = item.Id_User;

                const celdaNombre = document.createElement("td");
                celdaNombre.textContent = item.NombreCompleto;

                const celdaFechaRegistro = document.createElement("td");
                celdaFechaRegistro.textContent = item.FechaRegistro;

                
                const celdaEstado= document.createElement("td");
                celdaEstado.textContent = item.Estado;

                const celdaNumeroCursos = document.createElement("td");
                celdaNumeroCursos.textContent = item.NumeroCursos;


                const celdaTotalCostoVentas= document.createElement("td");
                celdaTotalCostoVentas.textContent = item.TotalCostoVentas;


                // Agrega las celdas a la fila
                fila.appendChild(celdaUsuario);
                fila.appendChild(celdaNombre);
                fila.appendChild(celdaFechaRegistro);
                fila.appendChild(celdaEstado);
                fila.appendChild(celdaNumeroCursos);
                fila.appendChild(celdaTotalCostoVentas);
             
                  
                // Agrega la fila a la tabla
                reportes.appendChild(fila);
            });
        })
        .catch(error => console.error("Error al obtener los datos:", error));
});
