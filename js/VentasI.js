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

    // Realiza la solicitud al backend
    fetch("../Models/VentasI.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ID_User })
    })
    .then(response => response.json())
    .then(data => {
        // Verifica que 'data' sea un objeto y contiene 'data' como un arreglo
        console.log("Datos recibidos:", data);
    
        if (data.success && Array.isArray(data.data)) { // Verifica que la respuesta sea exitosa y que 'data' sea un arreglo
            // Si es un arreglo, itera sobre él
            data.data.forEach(item => {
                const fila = document.createElement("tr");
    
                const celdaTitulo = document.createElement("td");
                celdaTitulo.textContent = item.Titulo || "N/A";
    
                const celdaCursoEstatus = document.createElement("td");
                celdaCursoEstatus.textContent = item.CursoEstatus || "N/A";
    

                const celdaCosto = document.createElement("td");
                var costo = "$" + item.Costo;
                celdaCosto.textContent = costo;
    
                const celdaTotalVentas = document.createElement("td");
                celdaTotalVentas.textContent = item.TotalVentas || "N/A";
    
                const celdaMetodoPago = document.createElement("td");
                celdaMetodoPago.textContent = item.MetodoPago || "N/A";
    
                const celdaPorcentajeEstatus = document.createElement("td");
                var porcentaje = item.PorcentajeEstatus + "%"
                celdaPorcentajeEstatus.textContent = porcentaje;
    
                fila.appendChild(celdaTitulo);
                fila.appendChild(celdaCursoEstatus);
                fila.appendChild(celdaCosto);
                fila.appendChild(celdaTotalVentas);
                fila.appendChild(celdaMetodoPago);
                fila.appendChild(celdaPorcentajeEstatus);
    
                resumencursos.appendChild(fila);
            });
        } else {
            console.error("La respuesta no contiene un arreglo válido en 'data'.", data);
        }
    })
    .catch(error => console.error("Error al obtener los datos:", error));
    
});
