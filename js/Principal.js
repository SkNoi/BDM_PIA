//Evento de carga de la página
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


// Función para actualizar el carrito en el navbar
function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const carritoBody = document.getElementById('carrito-body');
    const totalElement = document.getElementById('total');
    
    // Limpiar el carrito actual
    carritoBody.innerHTML = '';
    
    if (carrito.length > 0) {
        // Recorrer los productos en el carrito
        let total = 0;
        carrito.forEach((producto, index) => {
            const subtotal = producto.Costo; // Usando el precio del producto como subtotal
            total += subtotal;

            // Crear una fila en la tabla
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.titulo}</td>
                <td>$${producto.costo}</td>
                <td>1</td> <!-- Suponiendo que es una sola cantidad -->
                <td>$${subtotal}</td>
                <td><button class="btn-eliminar" data-index="${index}">X</button></td> <!-- Botón de eliminar -->
            `;
            carritoBody.appendChild(row);
        });

        // Mostrar el total
        totalElement.textContent = `$${total.toFixed(2)}`;

        // Agregar el listener de eliminar para cada botón
        const btnEliminar = document.querySelectorAll('.btn-eliminar');
        btnEliminar.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index'); // Obtener el índice del producto
                eliminarProductoDelCarrito(index);
            });
        });
    } else {
        // Si no hay productos en el carrito
        carritoBody.innerHTML = '<tr><td colspan="5" class="text-center">El carrito está vacío.</td></tr>';
        totalElement.textContent = '$0.00';
    }
}

// Función para eliminar un producto del carrito
function eliminarProductoDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1); // Eliminar el producto por índice
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualizar el carrito en el localStorage

    // Volver a actualizar el carrito en la vista
    actualizarCarrito();
}

// Llamar a la función de actualización del carrito al cargar la página
document.addEventListener('DOMContentLoaded', actualizarCarrito);

