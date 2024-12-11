document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const termino = urlParams.get('termino');
    const categoria = urlParams.get('categoria');
    const calificacion = urlParams.get('calificacion');

    // Usa estos valores para filtrar y mostrar los cursos
    obtenerCursos(termino, categoria, calificacion);
});

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

function obtenerCursos() {
    // Obtener los parámetros de búsqueda de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const termino = urlParams.get('termino') || ''; // Si no hay valor, asignar ''
    const categoria = urlParams.get('categoria') || '';
    const calificacion = urlParams.get('calificacion') || '';

    // Construir la URL con los filtros como query parameters
    let url = 'Controllers/CursoController.php?';
    if (termino) url += `termino=${encodeURIComponent(termino)}&`;
    if (categoria) url += `categoria=${encodeURIComponent(categoria)}&`;
    if (calificacion) url += `calificacion=${encodeURIComponent(calificacion)}&`;
    url = url.slice(0, -1); // Eliminar el último '&' si existe

    // Hacer la solicitud GET al servidor
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('Respuesta del servidor:', responseText);
        try {
            const data = JSON.parse(responseText);
            if (data.success && Array.isArray(data.cursos)) {
                mostrarCursos(data.cursos); // Mostrar los cursos filtrados
            } else {
                console.error('Respuesta inesperada del servidor:', data);
                alert('No se pudieron obtener los cursos.');
            }
        } catch (error) {
            console.error('Error al analizar la respuesta como JSON:', error);
            alert('El servidor no envió una respuesta válida.');
        }
    })
    .catch(error => {
        console.error('Error de comunicación con el servidor:', error);
        alert('Error de comunicación con el servidor.');
    });
}





function mostrarCursos(cursos) {
    const cursosGrid = document.getElementById('cursosGrid');
    const noResults = document.getElementById('no-results');

    // Limpia cualquier contenido previo en el contenedor
    cursosGrid.innerHTML = '';

    if (cursos.length === 0) {
        // Muestra el mensaje "No se encontraron resultados"
        noResults.style.display = 'block';
        return;
    }

    // Oculta el mensaje "No se encontraron resultados" si hay cursos
    noResults.style.display = 'none';

    // Genera dinámicamente los cursos
    cursos.forEach(curso => {   
        const cursoDiv = document.createElement('div');
        cursoDiv.classList.add('curso');

        const img = document.createElement('img');
        img.src = `data:image/png;base64,${curso.imagencurso}`; // Asigna la imagen en base64
        img.alt = `Imagen del curso ${curso.titulo}`;
        img.classList.add('curso-imagen');
        cursoDiv.appendChild(img);

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('curso-info');

        const titulo = document.createElement('h2');
        titulo.textContent = curso.titulo;
        infoDiv.appendChild(titulo);

        const descripcion = document.createElement('p');
        descripcion.textContent = curso.descripcion;
        infoDiv.appendChild(descripcion);

        const boton = document.createElement('a');
        boton.href = `detalles_curso.html?id=${curso.id_curso}`;
        boton.textContent = 'Más Información';
        boton.classList.add('btn');
        infoDiv.appendChild(boton);

        cursoDiv.appendChild(infoDiv);
        cursosGrid.appendChild(cursoDiv);
    });
}

function mostrarMensajeDeError(mensaje) {
    const cursosGrid = document.getElementById('cursosGrid');
    const noResults = document.getElementById('no-results');

    // Limpia cualquier contenido previo
    cursosGrid.innerHTML = '';

    // Muestra el mensaje de error
    noResults.style.display = 'block';
    noResults.textContent = mensaje;
}
