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
            if (data.success && data.detallesCurso) {
                mostrarDetallesCurso(data.detallesCurso);
            } else {
                alert('No se encontraron detalles del curso.');
            }
        })
        .catch(error => {
            console.error('Error al obtener los detalles del curso:', error);
            alert('Error al cargar los detalles del curso.');
        });

        
});

function mostrarDetallesCurso(detallesCurso) {
    console.log(detallesCurso.Nivel)
    
    // Llena los elementos del HTML con la información del curso
    document.getElementById('curso-titulo').textContent = detallesCurso.Titulo;
    document.getElementById('curso-imagen').src = `data:image/png;base64,${detallesCurso.ImagenCurso}`;
    document.getElementById('curso-imagen').alt = `Imagen del curso ${detallesCurso.ImagenCurso}`;
    document.getElementById('curso-precio').textContent = `Precio: $${detallesCurso.Costo}`;
    document.getElementById('curso-descripcion').textContent = detallesCurso.Descripcion;
    document.getElementById('temario-basico').textContent = detallesCurso.Nivel;
}
