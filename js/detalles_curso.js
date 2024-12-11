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
    document.getElementById('curso-titulo').textContent = curso.titulo;

    // Mostrar la imagen del curso (asumiendo que es base64)
    if (curso.imagencurso) {
        document.getElementById('curso-imagen').src = `data:image/png;base64,${curso.imagencurso}`;
        document.getElementById('curso-imagen').alt = `Imagen del curso ${curso.titulo}`;
    }

    // Mostrar precio y descripción del curso
    document.getElementById('curso-precio').textContent = `Precio: $${curso.costo}`;
    document.getElementById('curso-descripcion').textContent = curso.descripcion;

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
        fetch(`Controllers/CursoController.php?id_curso=${cursoId}`)
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
                    });
                }
            })
            .catch(error => console.error('Error al obtener el curso:', error));
    }
});

function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const carritoBody = document.getElementById('carrito-body');
    const totalElement = document.getElementById('total');
    
    // Limpiar el carrito actual
    carritoBody.innerHTML = '';
    
    if (carrito.length > 0) {
        // Recorrer los productos en el carrito
        let total = 0;
        carrito.forEach(producto => {
            const subtotal = producto.Costo; // Usando el precio del producto como subtotal
            total += subtotal;

            // Crear una fila en la tabla
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.Titulo}</td>
                <td>$${producto.Costo}</td>
                <td>$${subtotal}</td>
            `;
            carritoBody.appendChild(row);
        });

        // Mostrar el total
        totalElement.textContent = `$${total.toFixed(2)}`;
    } else {
        // Si no hay productos en el carrito
        carritoBody.innerHTML = '<tr><td colspan="4" class="text-center">El carrito está vacío.</td></tr>';
        totalElement.textContent = '$0.00';
    }
}