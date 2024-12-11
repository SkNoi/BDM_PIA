document.addEventListener('DOMContentLoaded', () => {
    // Obtener el parámetro 'id' de la URL
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get('id');

    if (!cursoId) {
        alert('No se especificó un curso.');
        return;
    }

    // Realiza una solicitud para obtener los detalles del curso
    fetch(`Controllers/CursoController.php?id_curso=${cursoId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.curso && data.detallesCurso) {
                mostrarDetallesCurso(data.curso, data.detallesCurso);
            } else {
                alert('No se encontraron detalles del curso.');
            }
        })
        .catch(error => {
            console.error('Error al obtener los detalles del curso:', error);
            alert('Error al cargar los detalles del curso.');
        });
});

function mostrarDetallesCurso(curso, detallesCurso) {
    // Mostrar el título del curso
    document.getElementById('curso-titulo').textContent = curso.Titulo;

    // Mostrar la imagen del curso (asumiendo que es base64)
    if (curso.ImagenCurso) {
        document.getElementById('curso-imagen').src = `data:image/png;base64,${curso.ImagenCurso}`;
        document.getElementById('curso-imagen').alt = `Imagen del curso ${curso.Titulo}`;
    }

    // Mostrar precio y descripción del curso
    document.getElementById('curso-precio').textContent = `Precio: $${curso.Costo}`;
    document.getElementById('curso-descripcion').textContent = curso.Descripcion;

    // Mostrar los detalles del temario por nivel
    const temarioList = document.getElementById('temario-lista');
    detallesCurso.forEach(detalle => {
        const nivelElemento = document.createElement('li');
        nivelElemento.textContent = `Nivel: ${detalle.Nivel} - Tema: ${detalle.Tema}`;
        temarioList.appendChild(nivelElemento);
    });
}

