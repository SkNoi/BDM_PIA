document.addEventListener('DOMContentLoaded', () => {

    obtenerCursos();
    
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

