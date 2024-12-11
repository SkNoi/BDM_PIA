document.addEventListener('DOMContentLoaded', () => {

    obtenerCursos();
    obtenerCategorias();
    
});

function obtenerCursos() {
    fetch('Controllers/CursoController.php', {
        method: 'GET'
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('Respuesta del servidor:', responseText);
        try {
            const data = JSON.parse(responseText);
            if (data.success && Array.isArray(data.cursos)) {
                mostrarCursos2(data.cursos);
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



function mostrarCursos2(cursos) {
    // Selecciona el contenedor donde se mostrarán las tarjetas de los cursos
    const cursosGrid = document.querySelector('.cursos-grid');

    // Limpia cualquier contenido previo en el contenedor
    cursosGrid.innerHTML = '';

    // Itera sobre los cursos y crea las tarjetas dinámicamente
    cursos.forEach(curso => {
        // Crea el contenedor de cada curso
        const cursoDiv = document.createElement('div');
        cursoDiv.classList.add('curso');

        // Asigna la imagen en base64 directamente al atributo src del img
        const img = document.createElement('img');
        const imagenSrc = `data:image/png;base64,${curso.imagencurso}`; // Aquí se asigna la base64

        img.src = imagenSrc; // Usa la imagen en base64 directamente
        img.alt = `Imagen del curso ${curso.titulo}`;
        img.classList.add('curso-imagen');
        cursoDiv.appendChild(img);

        // Crea el contenedor de la información del curso
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('curso-info');

        // Agrega el título del curso
        const titulo = document.createElement('h2');
        titulo.textContent = curso.titulo;
        infoDiv.appendChild(titulo);

        // Agrega la descripción del curso
        const descripcion = document.createElement('p');
        descripcion.textContent = curso.descripcion;
        infoDiv.appendChild(descripcion);

        // Agrega el botón de "Más Información"
        const boton = document.createElement('a');
        boton.href = `detalles_curso.html?id=${curso.id_curso}`;
        boton.textContent = 'Más Información';
        boton.classList.add('btn');
        infoDiv.appendChild(boton);

        // Agrega la información al contenedor principal del curso
        cursoDiv.appendChild(infoDiv);

        // Agrega el curso al contenedor general
        cursosGrid.appendChild(cursoDiv);
    });
}



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


