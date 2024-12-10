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
            if (data.success && data.curso) {
                mostrarDetallesCurso(data.curso);
            } else {
                alert('No se encontraron detalles del curso.');
            }
        })
        .catch(error => {
            console.error('Error al obtener los detalles del curso:', error);
            alert('Error al cargar los detalles del curso.');
        });

        
});

function mostrarDetallesCurso(curso) {
    console.log('El curso es: ' + curso.costo)
    // Llena los elementos del HTML con la información del curso
    document.getElementById('curso-titulo').textContent = curso.titulo;
    document.getElementById('curso-imagen').src = `data:image/png;base64,${curso.imagencurso}`;
    document.getElementById('curso-imagen').alt = `Imagen del curso ${curso.titulo}`;
    document.getElementById('curso-precio').textContent = `Precio: $${curso.costo}`;
    document.getElementById('curso-descripcion').textContent = curso.descripcion;
}
