document.getElementById("add-category-form").addEventListener("submit", function(e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const categoryName = document.getElementById("category-name").value;
    const categoryDescription = document.getElementById("category-description").value;
    
    let Id = localStorage.getItem("ID"); // Obtener el ID del usuario

    // Verificar si el ID está presente
    if (!Id) {
        alert("No se ha encontrado el ID del usuario.");
        return;
    }

    // Crear un objeto FormData para enviar al servidor
    const formData = new FormData();
    formData.append("accion", "crearCategoria");
    formData.append("tituloCate", categoryName);
    formData.append("descripcion", categoryDescription);
    formData.append("idCreador", Id);  // Asegurarse de que este valor esté siendo correctamente enviado

    // Hacer la solicitud AJAX usando fetch
    fetch("Controllers/CategoriaController.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())  // Parseamos la respuesta JSON
    .then(data => {
        if (data.success) {
            // Mostrar mensaje de éxito
            alert(data.message);
            // Opcional: limpiar los campos del formulario
            document.getElementById("category-name").value = '';
            document.getElementById("category-description").value = '';
        } else {
            // Mostrar mensaje de error
            alert(data.error || "Hubo un error al crear la categoría.");
        }
    })
    .catch(error => {
        // Manejo de errores de la solicitud
        alert("Error de comunicación con el servidor: " + error);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    obtenerCategorias();
});

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

function mostrarCategorias(categorias) {
    const listaCategorias = document.querySelector('ul'); // Selecciona el contenedor de las categorías
    listaCategorias.innerHTML = ''; // Limpiar la lista actual

    // Recorre las categorías y agrega un item para cada una
    categorias.forEach(categoria => {
        const li = document.createElement('li');
        li.id = `categoria-${categoria.idCategoria}`;
        li.innerHTML = `
            ${categoria.TituloCate} 
            <button onclick="mostrarFormularioModificar(${categoria.idCategoria}, '${categoria.TituloCate}', '${categoria.Descripcion}')">Modificar</button>
            <button onclick="eliminarCategoria(${categoria.idCategoria})">Eliminar</button>
        `;
        listaCategorias.appendChild(li);
    });
}


function eliminarCategoria(idCategoria) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        // Enviar solicitud POST al servidor
        fetch('../Controllers/CategoriaController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                accion: 'eliminarCategoria',
                idCategoria: idCategoria
            })
        })
        .then(response => response.json())
        .then(data => {
            // Verificar la respuesta del servidor
            if (data.success) {
                // Eliminar la categoría de la lista en la UI
                document.getElementById('categoria-' + idCategoria).remove();
                alert(data.message); // Mostrar mensaje de éxito
            } else {
                alert(data.error); // Mostrar mensaje de error
            }
        })
        .catch(error => {
            console.error('Error al eliminar la categoría:', error);
            alert('Hubo un error al intentar eliminar la categoría.');
        });
    }
}


function mostrarFormularioModificar(idCategoria, titulo, descripcion) {
    document.getElementById('form-modificar-categoria').style.display = 'block';
    document.getElementById('idCategoriaModificar').value = idCategoria;
    document.getElementById('tituloCate').value = titulo;
    document.getElementById('descripcion').value = descripcion;
}

function cancelarModificacion() {
    document.getElementById('form-modificar-categoria').style.display = 'none';
}

function modificarCategoria() {
    const idCategoria = $('#idCategoriaModificar').val();
    const tituloCate = $('#tituloCate').val();
    const descripcion = $('#descripcion').val();

    $.ajax({
        url: 'Controllers/CategoriaController.php',  // Ruta al controlador PHP
        type: 'POST',
        data: {
            accion: 'modificarCategoria',
            idCategoria: idCategoria,
            tituloCate: tituloCate,
            descripcion: descripcion
        },
        success: function(response) {
            try {
                const result = JSON.parse(response);  // Parseamos la respuesta JSON
                if (result.success) {
                    alert('Categoría modificada correctamente');
                    // Actualizar la interfaz para reflejar la modificación
                    $('#categoria-' + idCategoria).text(tituloCate + ' ' + descripcion);
                    cancelarModificacion(); // Cerrar el formulario
                } else {
                    alert('Error al modificar la categoría: ' + result.error);
                }
            } catch (e) {
                alert('Error al procesar la respuesta del servidor: ' + e.message);
            }
        },
        error: function(xhr, status, error) {
            alert('Error al realizar la solicitud: ' + error);
        }
    });
    return false;  // Prevenir el comportamiento por defecto del formulario
}