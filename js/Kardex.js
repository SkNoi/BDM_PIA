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


$(document).ready(function() {

    
    obtenerCategorias();


});

function mostrarCategorias(categorias) {
    // Selecciona el elemento <select> del DOM
    const selectCategoria = document.getElementById('categoria');
    
    console.log("Antes de limpiar:", selectCategoria.innerHTML);
    selectCategoria.innerHTML = '<option value="">Seleccionar Categoría</option>';
    console.log("Después de limpiar:", selectCategoria.innerHTML);
    
    // Itera sobre las categorías y crea nuevas opciones
    categorias.forEach(categoria => {
        console.log("Categoría procesada:", categoria);
        const option = document.createElement('option');
        option.value = categoria.idCategoria; // Debe existir un campo "id"
        option.textContent = categoria.TituloCate;; // Debe existir un campo "nombre"
        selectCategoria.appendChild(option);
    });
    }

function obtenerCategorias() {
    fetch('Controllers/CategoriaController.php', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data)) {
            mostrarCategorias(data);
        } else {
            alert('No se pudieron obtener las categorías.');
        }
    })
    .catch(error => {
        console.error('Error al obtener las categorías:', error);
        alert('Error de comunicación con el servidor.');
    });
}


function realizarBusqueda(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Obtén los valores del formulario
    const termino = document.getElementById('inputBuscador').value.trim();
    const categoria = document.getElementById('categoria').value;
    const calificacion = document.getElementById('campoEstrellas').value;

    // Construye la URL con los parámetros de búsqueda
    let url = 'Busquedas.html?'; // Suponiendo que esta es la página de resultados

    // Añadir los parámetros a la URL
    if (termino) {
        url += `termino=${encodeURIComponent(termino)}&`;
    }
    if (categoria) {
        url += `categoria=${encodeURIComponent(categoria)}&`;
    }
    if (calificacion) {
        url += `calificacion=${encodeURIComponent(calificacion)}&`;
    }

    // Eliminar el último '&' si hay alguno al final de la URL
    url = url.endsWith('&') ? url.slice(0, -1) : url;

    // Redirige a la página de resultados con los parámetros de búsqueda
    window.location.href = url;
}