document.addEventListener('DOMContentLoaded', () => {
    obtenerCategorias();
    obtenerCursos();
    
});

document.getElementById("crearCurso").addEventListener("submit", function(e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const cursoName = document.getElementById("titulo").value;
    const cursoCost = document.getElementById("precio").value;
    const cursoDescription = document.getElementById("descripcion").value;
    const cursoCategory = document.getElementById("categoria").value; // Corrección aquí
    const cursoDuration = document.getElementById("duracion").value;
    const cursoImage = document.getElementById("imagen");

    let Id = localStorage.getItem("ID"); // Obtener el ID del usuario

    // Validar que los campos requeridos no estén vacíos
    if (!Id) {
        alert("No se ha encontrado el ID del usuario.");
        return;
    }

    if (!cursoCategory) {
        alert("Por favor selecciona una categoría válida.");
        return;
    }

    // Crear un objeto FormData para enviar al servidor
    const formData = new FormData();
    formData.append("accion", "crearCurso");
    formData.append("Titulo", cursoName);
    formData.append("Costo", cursoCost);
    formData.append("Descripcion", cursoDescription);
    formData.append("ID_CATEGORIA", cursoCategory); // Corrección aquí
    formData.append("ID_Instructor", Id);
    formData.append("Duracion", cursoDuration);
    formData.append("ImagenCurso", cursoImage.files[0]);

    // Depuración
    console.log({
        Titulo: cursoName,
        Costo: cursoCost,
        Descripcion: cursoDescription,
        ID_CATEGORIA: cursoCategory,
        ID_Instructor: Id,
        Duracion: cursoDuration,
        ImagenCurso: cursoImage.files[0]
    });

    // Hacer la solicitud AJAX usando fetch
    fetch("Controllers/CursoController.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            document.getElementById("crearCurso").reset(); // Limpia el formulario
        } else {
            alert(data.error || "Hubo un error al crear el curso.");
        }
    })
    .catch(error => {
        alert("Error de comunicación con el servidor: " + error);
    });
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


function mostrarCursos(cursos) {
    // Selecciona el elemento <select> del DOM
    const selectCursos = document.getElementById('cursoId');
    
    // Limpia las opciones existentes
    console.log("Antes de limpiar:", selectCursos.innerHTML);
    selectCursos.innerHTML = '<option value="">Seleccionar Curso</option>';
    console.log("Después de limpiar:", selectCursos.innerHTML);
    
    // Itera sobre los cursos y crea nuevas opciones
    cursos.forEach(curso => {
        console.log("Curso procesado:", curso);
        
        const option = document.createElement('option');
        option.value = curso.id_curso; // Asegúrate de usar el nombre correcto del campo
        option.textContent = curso.titulo; // Usa el campo 'titulo' de cada curso
        selectCursos.appendChild(option);
    });
}

function mostrarCursos2(cursos2) {
    // Selecciona el elemento <select> del DOM
    const selectCursos = document.getElementById('cursoId2');
    
    // Limpia las opciones existentes
    console.log("Antes de limpiar:", selectCursos.innerHTML);
    selectCursos.innerHTML = '<option value="">Seleccionar Curso</option>';
    console.log("Después de limpiar:", selectCursos.innerHTML);
    
    // Itera sobre los cursos y crea nuevas opciones
    cursos2.forEach(curso => {
        console.log("Curso procesado:", curso);
        
        const option = document.createElement('option');
        option.value = curso.id_curso; // Asegúrate de usar el nombre correcto del campo
        option.textContent = curso.titulo; // Usa el campo 'titulo' de cada curso
        selectCursos.appendChild(option);
    });
}

function obtenerCursos() {
    // Obtener el id del instructor desde el localStorage
    let Id = localStorage.getItem("ID");
    
    // Si no hay id del instructor en el localStorage, no hacer la solicitud
    if (!Id) {
        alert('No se encontró el ID del instructor.');
        return;
    }

    // Realizamos la solicitud fetch enviando el id del instructor como parámetro
    fetch('Controllers/CursoController.php?id_instructor=' + Id, {
        method: 'GET'
    })
    .then(response => response.text())  // Usamos text() para leer la respuesta como texto
    .then(responseText => {
        console.log('Respuesta del servidor:', responseText);  // Imprime la respuesta

        try {
            // Intentar convertir a JSON
            const data = JSON.parse(responseText);
            // Verifica que la respuesta sea exitosa y que 'cursos' sea un array
            if (data.success && Array.isArray(data.cursos)) {  // Verifica que 'cursos' sea un array
                mostrarCursos(data.cursos);  // Accede directamente a los cursos
                mostrarCursos2(data.cursos);
            } else {
                alert('No se pudieron obtener los cursos.');
            }
        } catch (error) {
            console.error('Error al analizar la respuesta como JSON:', error);
            alert('El servidor no envió una respuesta válida.');
        }
    })
    .catch(error => {
        console.error('Error al obtener los cursos:', error);
        alert('Error de comunicación con el servidor.');
    });
}



document.getElementById("formAgregarNivel").addEventListener("submit", function(e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const nivelCurso = document.getElementById("cursoId").value; // Corrección aquí
    const Nivel = document.getElementById("Nivel").value;
    const nivelContenido = document.getElementById("contenido").value;
    const cursoVideo = document.getElementById("video");


    // Crear un objeto FormData para enviar al servidor
    const formData = new FormData();
    formData.append("accion", "crearNivel");
    formData.append("ID_Curso", nivelCurso);
    formData.append("Video", cursoVideo.files[0]);
    formData.append("Descripcion", nivelContenido);
    formData.append("Nivel", Nivel);

    // Depuración
    console.log({
        ID_Curso: nivelCurso,
        Descripcion: nivelContenido,
        Nivel: Nivel,
        Video: cursoVideo.files[0]
    });


    // Hacer la solicitud AJAX usando fetch
    fetch("Controllers/NivelController.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            document.getElementById("formAgregarNivel").reset(); // Limpia el formulario
        } else {
            alert(data.error || "Hubo un error al crear el curso.");
        }
    })
    .catch(error => {
        alert("Error de comunicación con el servidor: " + error);
    });
});

document.getElementById('cursoId2').addEventListener('change', function() {
    const cursoId = this.value; // Obtener el ID del curso seleccionado

    console.log('El ID es: ' + cursoId);
    if (cursoId) {
        obtenerNiveles(cursoId); // Llamar a la función para obtener niveles
    } else {
        alert("Por favor, selecciona un curso.");
    }
});


function obtenerNiveles(cursoId) {
    fetch('Controllers/NivelController.php?id_curso=' + cursoId, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && Array.isArray(data.niveles)) {
            mostrarNiveles(data.niveles); // Llama a la función para mostrar los niveles
        } else {
            alert('No se encontraron niveles para este curso.');
        }
    })
    .catch(error => {
        console.error('Error al obtener los niveles:', error);
        alert('Error de comunicación con el servidor.');
    });
}

function mostrarNiveles(niveles) {
    const nivelesSelect = document.getElementById('niveles');
    nivelesSelect.innerHTML = '<option value="">Selecciona un nivel</option>'; // Limpiar opciones anteriores

    niveles.forEach(nivel => {
        const option = document.createElement('option');
        option.value = nivel.ID_Nivel; // Usamos el ID_Nivel como el valor
        option.textContent = nivel.Nivel; // Usamos la columna Nivel como el texto visible
        nivelesSelect.appendChild(option);
    });
}

document.getElementById("formAgregarTemario").addEventListener("submit", function(e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const temarioNivel = document.getElementById("niveles").value; // Corrección aquí
    const temarioTema = document.getElementById("tema").value;
    const temarioContenido = document.getElementById("Content").value;
    const temarioLink = document.getElementById("Link").value;
    const temarioPDF = document.getElementById("PDF");
    const temarioVideo = document.getElementById("Video");
    
    if (temarioVideo.files.length > 0 && !temarioVideo.files[0].type.includes("video")) {
        alert("El archivo seleccionado no es un video válido.");
        return;
    }

    // Crear un objeto FormData para enviar al servidor
    const formData = new FormData();
    formData.append("accion", "crearTemario");
    formData.append("ID_Nivel", temarioNivel);
    formData.append("Tema", temarioTema);
    formData.append("Descripcion", temarioContenido);
    formData.append("LinkRecurso", temarioLink);
    formData.append("PDF_Recurso", temarioPDF.files[0]);
    if (temarioVideo.files.length > 0) {
        formData.append("Video", temarioVideo.files[0]);
    }

    // Depuración
    console.log({
        ID_Nivel: temarioNivel,
        Tema: temarioTema,
        Descripcion: temarioContenido,
        LinkRecurso: temarioLink,
        PDF_Recurso: temarioPDF.files[0],
        Video: temarioVideo.files[0]
    });


    // Hacer la solicitud AJAX usando fetch
    fetch("Controllers/TemarioController.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            document.getElementById("formAgregarTemario").reset(); // Limpia el formulario
        } else {
            alert(data.error || "Hubo un error al crear el curso.");
        }
    })
    .catch(error => {
        alert("Error de comunicación con el servidor: " + error);
    });
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