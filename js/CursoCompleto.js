document.addEventListener('DOMContentLoaded', () => {
    // Obtener el parámetro 'id' de la URL
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get('id_curso');

    if (!cursoId) {
        alert('No se especificó un curso.');
        return;
    }

    // Realiza una solicitud para obtener los detalles del curso
    fetch(`Controllers/CursoController.php?id_curso=${cursoId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.cursoCompleto) {
                mostrarDetallesCurso(data.cursoCompleto);
            } else {
                alert('No se encontraron detalles del curso.');
            }
        })
        .catch(error => {
            console.error('Error al obtener los detalles del curso:', error);
            alert('Error al cargar los detalles del curso.');
        });
});

function mostrarDetallesCurso(cursoCompleto) {
    // Obtener el contenedor de los contenidos del curso
    const contenidosCurso = document.querySelector('.course-contents');
    
    // Limpiar el contenido existente
    contenidosCurso.innerHTML = '';

    // Iterar sobre los niveles del curso
    cursoCompleto.niveles.forEach(nivel => {
        // Crear un botón de acordeón para cada nivel
        const button = document.createElement('button');
        button.classList.add('accordion');
        button.textContent = `Curso ${nivel.Nivel}`;
        
        // Crear un div para el panel del nivel
        const panel = document.createElement('div');
        panel.classList.add('panel');
        
        // Crear contenido del panel
        const panelContent = document.createElement('div');
        panelContent.classList.add('panel-content');
        
        // Crear una lista de temarios para cada nivel
        const temarioList = document.createElement('ul');
        nivel.Temarios.forEach(temario => {
            const listItem = document.createElement('li');
            listItem.textContent = temario.Tema;
            listItem.addEventListener('click', () => mostrarTemario(temario)); // Al hacer clic, mostrar detalles del temario
            temarioList.appendChild(listItem);
        });

        // Insertar la lista de temarios en el panel
        panelContent.appendChild(temarioList);
        panel.appendChild(panelContent);
        
        // Añadir el panel y el botón de acordeón al contenedor de contenidos del curso
        contenidosCurso.appendChild(button);
        contenidosCurso.appendChild(panel);
    });

    // Para hacer funcionar el acordeón
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach((accordion) => {
        accordion.addEventListener('click', function() {
            const panel = this.nextElementSibling;
            panel.style.display = panel.style.display === "block" ? "none" : "block";
        });
    });

    // Mostrar el video correspondiente (si existe)
    const videoSection = document.querySelector('.video-section video');
    if (cursoCompleto.curso.Video) {
        videoSection.src = cursoCompleto.curso.Video;
    }

    // Mostrar los detalles del curso (puedes agregar más campos según lo necesites)
    document.querySelector('.main-content .video-section h3').textContent = cursoCompleto.curso.Titulo;
}

// Función para mostrar detalles de un temario específico
function mostrarTemario(temario) {
    // Mostrar el video
    const videoSection = document.querySelector('.video-section video');
    if (temario.Video) {
        videoSection.src = temario.Video;
    } else {
        videoSection.src = ''; // Limpiar video si no hay
    }

    // Mostrar los recursos adicionales
    const resourcesSection = document.querySelector('.additional-resources ul');
    resourcesSection.innerHTML = ''; // Limpiar recursos previos
    if (temario.LinkRecurso) {
        const linkItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = temario.LinkRecurso;
        link.textContent = 'Recurso adicional';
        linkItem.appendChild(link);
        resourcesSection.appendChild(linkItem);
    }
    if (temario.PDF_Recurso) {
        const pdfItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = temario.PDF_Recurso;
        link.textContent = 'PDF Recurso';
        pdfItem.appendChild(link);
        resourcesSection.appendChild(pdfItem);
    }

    // Si no hay recursos, mostrar mensaje
    if (!temario.LinkRecurso && !temario.PDF_Recurso) {
        const noResourcesMessage = document.createElement('li');
        noResourcesMessage.textContent = 'No hay recursos disponibles para este tema.';
        resourcesSection.appendChild(noResourcesMessage);
    }

    // Mostrar descripción del temario
    const descriptionSection = document.querySelector('.additional-resources h3');
    descriptionSection.textContent = `Descripción del tema: ${temario.Descripcion}`;
}


