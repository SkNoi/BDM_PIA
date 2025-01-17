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
        console.log("Datos recibidos:", data);
        if (data.success && Array.isArray(data.data)) {
            mostrarDatos(data.data);
        } else {
            console.error("La respuesta no contiene un arreglo válido en 'data'.", data);
        }
    })
    .catch(error => console.error("Error al obtener los datos:", error));

    function mostrarDatos(datos) {
        resumencursos.innerHTML = ""; // Limpia la tabla antes de mostrar los datos
        datos.forEach(item => {
            const fila = document.createElement("tr");

            const celdaTitulo = document.createElement("td");
            celdaTitulo.textContent = item.Titulo || "N/A";

            const celdaCursoEstatus = document.createElement("td");
            celdaCursoEstatus.textContent = item.CursoEstatus || "N/A";

            const celdaCosto = document.createElement("td");
            celdaCosto.textContent = "$" + item.Costo;

            const celdaTotalVentas = document.createElement("td");
            celdaTotalVentas.textContent = item.TotalVentas || "N/A";

            const celdaMetodoPago = document.createElement("td");
            celdaMetodoPago.textContent = item.MetodoPago || "N/A";

            const celdaPorcentajeEstatus = document.createElement("td");
            celdaPorcentajeEstatus.textContent = item.PorcentajeEstatus + "%";

            fila.appendChild(celdaTitulo);
            fila.appendChild(celdaCursoEstatus);
            fila.appendChild(celdaCosto);
            fila.appendChild(celdaTotalVentas);
            fila.appendChild(celdaMetodoPago);
            fila.appendChild(celdaPorcentajeEstatus);

            resumencursos.appendChild(fila);
        });
    }

    window.aplicarFiltros = () => {
        const categoria = document.getElementById("categoria").value;
        const estado = document.getElementById("estado").value;
    
        // Solicitar los datos filtrados
        fetch("../Models/VentasI.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ID_User })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && Array.isArray(data.data)) {
                // Filtrar los datos según los filtros aplicados
                const datosFiltrados = data.data.filter(item => {
                    const cumpleCategoria = categoria ? item.Categoria === categoria : true;
                    const cumpleEstado = estado ? item.CursoEstatus === estado : true;
                    return cumpleCategoria && cumpleEstado;
                });
                mostrarDatos(datosFiltrados); // Mostrar los datos filtrados
            } else {
                console.error("La respuesta no contiene un arreglo válido en 'data'.", data);
            }
        })
        .catch(error => console.error("Error al aplicar los filtros:", error));
    };
    
});
