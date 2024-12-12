document.addEventListener('DOMContentLoaded', () => {
    // Obtener el parámetro 'id' de la URL
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get('id');

    console.log('el id del curso es:' + cursoId);
    if (!cursoId) {
        alert('No se especificó un curso.');
        return;
    }

    // Realiza una solicitud para obtener los detalles del curso
    fetch(`Controllers/CursoController.php?id_curso=${cursoId}&tipo=detalles`)
    .then(response => {
        console.log('Respuesta del servidor:', response);  // Verifica la respuesta completa
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);  // Verifica que los datos sean correctos
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
    // Mostrar el título del curso
    document.getElementById('curso-titulo').textContent = detallesCurso.Titulo;

    // Mostrar la imagen del curso (asumiendo que es base64)
    if (detallesCurso.ImagenCurso) {
        document.getElementById('curso-imagen').src = `data:image/png;base64,${detallesCurso.ImagenCurso}`;
        document.getElementById('curso-imagen').alt = `Imagen del curso ${detallesCurso.Titulo}`;
    }

    // Mostrar precio y descripción del curso
    document.getElementById('curso-precio').textContent = `Precio: $${detallesCurso.Costo}`;
    document.getElementById('curso-descripcion').textContent = detallesCurso.Descripcion;

    // Mostrar los detalles del temario por nivel
    const temarioList = document.getElementById('temario-lista');
    detallesCurso.forEach(detalle => {
        const nivelElemento = document.createElement('li');
        nivelElemento.textContent = `Nivel: ${detalle.Nivel} - Tema: ${detalle.Tema}`;
        temarioList.appendChild(nivelElemento);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está en la página de un curso
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get('id');

    if (cursoId) {
        // Obtener los detalles del curso (puedes usar el código que ya tienes para obtener los detalles del curso)
        fetch(`Controllers/CursoController.php?id_curso=${cursoId}&tipo=curso`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.curso) {
                    // El curso está disponible, puedes mostrarlo y agregarlo al carrito
                    const curso = data.curso;
                    
                    // Cuando el usuario hace clic en "Comprar"
                    const btnComprar = document.querySelector('.btn-comprar');
                    btnComprar.addEventListener('click', (e) => {
                        e.preventDefault(); // Prevenir el comportamiento predeterminado (navegar a la otra página)

                        // Guardar en el carrito (localStorage)
                        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                        carrito.push(curso); // Agregar el curso al carrito
                        localStorage.setItem('carrito', JSON.stringify(carrito));

                        // Actualizar el carrito en el navbar
                        actualizarCarrito();

                        // Redirigir a la página Cursos.html después de agregar el curso al carrito
                        window.location.href = 'Cursos.html'; // Cambiar la ubicación a Cursos.html
                    });
                }
            })
            .catch(error => console.error('Error al obtener el curso:', error));
    }
});



