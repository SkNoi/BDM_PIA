//Evento de carga de la página
$(document).ready(function() {

    let user = localStorage.getItem("usuario");

    console.log("EL NOMBRE DEL USUAIO ES: " + user);
    actualizarCarrito();

}); 

function previewImage(event) {
    const preview = document.getElementById('imagenSeleccionada');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
}

document.getElementById('foto').addEventListener('change', previewImage);




document.addEventListener('DOMContentLoaded', function() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario) {
        localStorage.setItem("ID", usuario.ID_User);
        document.getElementById('campoNombre').value = usuario.NombreCompleto || '';
        document.getElementById('campoCorreo').value = usuario.Correo || '';
        document.getElementById('campoFechaNacimiento').value = usuario.FechaNacimiento || '';
        document.getElementById('campoContrasena').value = usuario.contrasena || '';
        

        // Manejar la imagen de perfil
        const imagenPerfilObtenida = usuario.imagen_Perfil;
        let imagenSrc;

        
        if (imagenPerfilObtenida) {
            if (imagenPerfilObtenida.startsWith('data:image/')) {
                imagenSrc = imagenPerfilObtenida; // Ya está en formato correcto
            } else {
                imagenSrc = `data:image/png;base64,${imagenPerfilObtenida}`; // Asumimos que es PNG por defecto
            }
        } else {
            imagenSrc = 'Recursos/icon_user.png'; // Imagen por defecto
        }

        $('#imagenSeleccionada').attr('src', imagenSrc);


        // Asignar el sexo al combobox
        const combobox = document.getElementById('campoSexo');
        combobox.value = usuario.Sexo || 'Otro';


        
        // Mostrar/Ocultar secciones basadas en el rol
        const seccionCursos = document.getElementById('seccionCursos');
        const seccionPublicaciones = document.getElementById('seccionPublicaciones');

        if (usuario.Rol === 'Estudiante') {
            seccionCursos.style.display = 'block';
            seccionPublicaciones.style.display = 'none';
        } else if (usuario.Rol === 'Instructor') {
            seccionCursos.style.display = 'none';
            seccionPublicaciones.style.display = 'block';
        }
    
    } else {
        console.log('No hay un usuario en localStorage');
    }

    // Habilitar/Deshabilitar los inputs al alternar el switch de edición
    const toggleEditar = document.getElementById('toggleEditar');
    const inputs = document.querySelectorAll('#formActualizar input, #formActualizar select');
    
    toggleEditar.addEventListener('change', function() {
        const isEditable = toggleEditar.checked;
        // Asegurarse de que el toggleEditar no sea deshabilitado
        inputs.forEach(input => {
            if (input !== toggleEditar) {
                input.disabled = !isEditable;
            }
        });
    });

    // Inicialmente deshabilitar los campos (excepto el toggleEditar)
    inputs.forEach(input => {
        if (input !== toggleEditar) {
            input.disabled = true;
        }
    });

});


document.addEventListener('DOMContentLoaded', function() {
    const toggleEditar = document.getElementById('toggleEditar');
    const inputs = document.querySelectorAll('#formRegistro input, #formRegistro select');

    // Asegurarse de que el toggleEditar está en el DOM y no es nulo
    if (toggleEditar) {
        // Inicialmente deshabilitar los campos (excepto el toggleEditar)
        inputs.forEach(input => {
            if (input !== toggleEditar) {
                input.disabled = true;
            }
        });

        // Habilitar/Deshabilitar los inputs al alternar el switch de edición
        toggleEditar.addEventListener('change', function() {
            const isEditable = toggleEditar.checked;
            inputs.forEach(input => {
                if (input !== toggleEditar) {
                    input.disabled = !isEditable;
                }
            });
        });
    } else {
        console.error('El elemento toggleEditar no se encuentra en el DOM.');
    }
});



document.getElementById('formActualizar').addEventListener('submit', actualizarPerfil);
const usuario = JSON.parse(localStorage.getItem('usuario'));

function previewImage(event) {
    const preview = document.getElementById('imagenSeleccionada');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = 'Recursos/icon_user.png';  // Imagen por defecto si no se selecciona ninguna
        preview.style.display = 'block';
    }
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Cuando la lectura termina, se resuelve con el resultado
        reader.onerror = reject; // Manejo de errores
        reader.readAsDataURL(blob); // Leer el blob como Data URL
    });
}

async function actualizarPerfil(event) {
    event.preventDefault();  // Evita que se envíe el formulario automáticamente

    let nombre = document.getElementById('campoNombre').value;
    let sexo = document.getElementById('campoSexo').value;
    let fechaNacimiento = document.getElementById('campoFechaNacimiento').value;
    let correo = document.getElementById('campoCorreo').value;
    let contrasena = document.getElementById('campoContrasena').value;
    let imagen = document.getElementById('foto').files[0]; // Obtén el archivo de la imagen
    let Id = localStorage.getItem("ID");

    // Crear un objeto FormData para manejar el envío de datos y archivos
    const formData = new FormData();
    formData.append('accion', 'actualizar');         // Acción para que el servidor identifique la operación
    formData.append('nombreCompleto', nombre);
    formData.append('contrasena', contrasena);
    formData.append('correo', correo);
    formData.append('sexo', sexo);
    formData.append('fechaNacimiento', fechaNacimiento);
    formData.append('idUsuario', Id);
    formData.append('Avatar', imagen);      // Adjuntar la imagen seleccionada

    // Enviar la petición al servidor
    fetch("Models/Usuario.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(async responseText => {
        try {
            let respuesta = JSON.parse(responseText);
            if (respuesta.success) {
                // Solo convertir a base64 si hay una nueva imagen
                let imagenBase64 = null;
                if (imagen) {
                    imagenBase64 = await blobToBase64(imagen); // Convierte el blob a base64
                }

                // Actualizar localStorage con la nueva información
                const usuarioActualizado = {
                    ID_User: Id,
                    NombreCompleto: nombre,
                    Correo: correo,
                    FechaNacimiento: fechaNacimiento,
                    Sexo: sexo,
                    contrasena: contrasena,
                    Rol: respuesta.rol || JSON.parse(localStorage.getItem('usuario')).Rol,
                    imagen_Perfil: imagenBase64, // Almacenar como base64
                };

                localStorage.setItem('usuario', JSON.stringify(usuarioActualizado)); // Guardar usuario actualizado en localStorage

                alert(respuesta.message);
                if (usuario.Rol === 'Administrador') {
                    window.location.href = "PerfilAdmin.html"; // Redirige a la página de perfil del administrador
                } else {
                    window.location.href = "perfilUsuario.html"; // Redirige a la página de perfil del usuario
                }

            } else {
                let mensajeFinal = "Se han detectado los siguientes errores:\n\n";
                respuesta.mensaje.forEach(error => {
                    mensajeFinal += "● " + error + "\n\n";
                });
                alert(mensajeFinal);
            }
        } catch (error) {
            alert('Error al procesar la respuesta del servidor: ' + responseText);
            console.error('Error:', error);
        }
    })
    .catch(error => {
        alert("Ocurrió un error inesperado al comunicarse con el servidor.");
        console.error("Error:", error);
    });
}


document.addEventListener('DOMContentLoaded', () => {

    obtenerCursos();
    obtenerCategorias();
    obtenerCursosComprados();
    
});



function obtenerCursos() {
    let Id = localStorage.getItem("ID");
    if (!Id) {
        alert('No se encontró el ID del instructor.');
        return;
    }

    fetch('Controllers/CursoController.php?id_instructor=' + Id, {
        method: 'GET'
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('Respuesta del servidor:', responseText);
        try {
            const data = JSON.parse(responseText);
            if (data.success && Array.isArray(data.cursos)) {
                mostrarCursosCreados(data.cursos);
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


function mostrarCursosCreados(cursos) {
    const listaCursos = document.querySelector('#listaCursos'); // Selecciona el contenedor de los cursos
    listaCursos.innerHTML = ''; // Limpiar la lista actual

    // Asegúrate de que el contenedor tenga una clase adecuada para el diseño
    listaCursos.classList.add('cursos-en-fila');

    // Recorre los cursos y crea una tarjeta para cada uno
    cursos.forEach(curso => {
        const li = document.createElement('li');
        li.id = `curso-${curso.id_curso}`;
        li.className = 'curso-item';

        const imagenSrc = `data:image/png;base64,${curso.imagencurso}`;

        li.innerHTML = `
            <div class="curso-card">
                <img src="${imagenSrc}" alt="Imagen del curso ${curso.titulo}" class="curso-imagen">
                <div class="curso-detalles">
                    <h3>${curso.titulo}</h3>
                    <p><strong>Precio:</strong> $${curso.costo}</p>
                    <button class="btn-eliminar" onclick="eliminarCurso(${curso.id_curso})">Eliminar</button>
                </div>
            </div>
        `;
        listaCursos.appendChild(li);
    });
}

function obtenerCursosComprados() {
    let estudianteId = localStorage.getItem("ID");
    if (!estudianteId) {
        alert('No se encontró el ID del estudiante.');
        return;
    }

    fetch('Controllers/VentaController.php?id_estudiante=' + estudianteId, {
        method: 'GET'
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('Respuesta del servidor:', responseText);
        try {
            const data = JSON.parse(responseText);
            if (data.success && Array.isArray(data.cursos)) {
                mostrarCursosComprados(data.cursos);
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

function mostrarCursosComprados(cursos) {
    const cardContainer = document.querySelector('#card-container');
    const noResults = document.querySelector('#no-results');

    cardContainer.innerHTML = ''; // Limpiar el contenedor actual

    if (cursos.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    cursos.forEach(curso => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-3';

        const imagenSrc = curso.imagencurso 
            ? `data:image/png;base64,${curso.imagencurso}` 
            : '../Recursos/java.jpg';

        card.innerHTML = `
            <div class="card">
                <img src="${imagenSrc}" alt="Imagen del curso ${curso.titulo}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${curso.titulo}</h5>
                    <p class="card-text">${curso.descripcion}</p>
                    <a href="ver_curso.php?id_curso=${curso.id_curso}" class="btn btn-primary">Ver Curso</a>
                </div>
            </div>
        `;
        cardContainer.appendChild(card);
    });
}






function eliminarCurso(id_curso) {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
        // Enviar solicitud POST al servidor
        fetch('../Controllers/CursoController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                accion: 'eliminarCurso',
                id_curso: id_curso
            })
        })
        .then(response => response.json())
        .then(data => {
            // Verificar la respuesta del servidor
            if (data.success) {
                // Eliminar la categoría de la lista en la UI
                document.getElementById('curso-' + id_curso).remove();
                alert(data.message); // Mostrar mensaje de éxito
            } else {
                alert(data.error); // Mostrar mensaje de error
            }
        })
        .catch(error => {
            console.error('Error al eliminar el curso:', error);
            alert('Hubo un error al intentar eliminar el curso.');
        });
    }
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