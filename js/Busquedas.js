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


// Función para actualizar el carrito en el navbar
function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const carritoBody = document.getElementById('carrito-body');
    const totalElement = document.getElementById('total');

    // Verificar si los elementos existen antes de continuar
    if (!carritoBody || !totalElement) {
        console.error('Elemento carrito-body o total no encontrado.');
        return;
    }

    // Limpiar el carrito actual
    carritoBody.innerHTML = '';

    if (carrito.length > 0) {
        let total = 0;
        carrito.forEach((producto, index) => {
            // Asegurarnos de que producto.costo sea un número válido
            const costo = parseFloat(producto.costo); // Convertimos a número
            if (isNaN(costo)) {
                console.warn(`El costo del producto "${producto.titulo}" no es un número válido.`);
                return; // Si no es un número válido, continuamos con el siguiente producto
            }

            const subtotal = costo;
            total += subtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.titulo}</td>
                <td>$${costo.toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td><button class="btn-eliminar" data-index="${index}">X</button></td>
            `;
            carritoBody.appendChild(row);
        });

        // Mostrar el total de forma segura
        totalElement.textContent = `$${total.toFixed(2)}`;

        // Agregar evento de eliminación a los botones de eliminar
        const btnEliminar = document.querySelectorAll('.btn-eliminar');
        btnEliminar.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                eliminarProductoDelCarrito(index);
            });
        });
    } else {
        carritoBody.innerHTML = '<tr><td colspan="4" class="text-center">El carrito está vacío.</td></tr>';
        totalElement.textContent = '$0.00';
    }
}

// Función para eliminar un producto del carrito
function eliminarProductoDelCarrito(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Eliminar el producto en el índice dado
    carrito.splice(index, 1); // Elimina el producto con el índice correspondiente

    // Actualizar el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar la vista del carrito
    actualizarCarrito();
}