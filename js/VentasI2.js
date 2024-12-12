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
    fetch("../Models/VentasI2.php", {
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
    
        if (data.success && Array.isArray(data.data)) { // Verifica que la respuesta sea válida
            const detalleInscripciones = document.getElementById("detalle-inscripciones");
            const totalIngresosCurso = document.getElementById("total-ingresos-curso");

            detalleInscripciones.innerHTML = ""; // Limpia la tabla antes de llenarla

            let totalIngresos = 0;

            // Itera sobre cada registro en la respuesta
            data.data.forEach(item => {
                const fila = document.createElement("tr");

                // Nombre del Alumno
                const celdaAlumno = document.createElement("td");
                celdaAlumno.textContent = item.AlumnoNombre || "N/A";
                fila.appendChild(celdaAlumno);

                // Fecha de Inscripción
                const celdaFechaInscripcion = document.createElement("td");
                celdaFechaInscripcion.textContent = item.FechaInscripcion || "N/A";
                fila.appendChild(celdaFechaInscripcion);

                // Nivel de Avance
                const celdaNivelAvance = document.createElement("td");
                celdaNivelAvance.textContent = item.PorcentajeEstatus + "%" || "0%";
                fila.appendChild(celdaNivelAvance);

                // Precio Pagado
                const celdaPrecioPagado = document.createElement("td");
                celdaPrecioPagado.textContent = "$" + (item.Total || 0);
                fila.appendChild(celdaPrecioPagado);

                // Forma de Pago
                const celdaFormaPago = document.createElement("td");
                celdaFormaPago.textContent = item.MetodoPago || "N/A";
                fila.appendChild(celdaFormaPago);

                detalleInscripciones.appendChild(fila);

                // Sumar al total de ingresos
                totalIngresos += item.MontoPagado || 0;
            });

            // Actualizar el total de ingresos del curso
            totalIngresosCurso.textContent = "$" + totalIngresos.toFixed(2);
        } else {
            console.error("La respuesta no contiene un arreglo válido en 'data'.", data);
        }
    })
    .catch(error => console.error("Error al obtener los datos:", error));
    
});
