document.addEventListener('DOMContentLoaded', () => {
    // Obtener el parámetro 'id' de la URL
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get('id_curso');

    if (!cursoId) {
        alert('No se especificó un curso.');
        return;
    }

    // Realiza una solicitud para obtener los detalles del curso
    fetch(`Controllers/CursoController.php?id_curso=${cursoId}&tipo=completo`)
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
    console.log(cursoCompleto); 
    
    const videoBase64 = cursoCompleto.niveles[0].Temarios[1].Video;
    console.log(videoBase64); 

    document.title = cursoCompleto.curso.Titulo;

    // Obtener el contenedor de los contenidos del curso
    const contenidosCurso = document.querySelector('.course-contents');
    
    // Limpiar el contenido existente
    contenidosCurso.innerHTML = '';

    if (!cursoCompleto.niveles || cursoCompleto.niveles.length === 0) {
        alert('No se encontraron niveles para este curso.');
        return;
    }

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
}


// Función para mostrar detalles de un temario específico
function mostrarTemario(temario) {
    // Mostrar los recursos adicionales
    const resourcesSection = document.querySelector('.additional-resources ul');
    resourcesSection.innerHTML = ''; // Limpiar recursos previos
    
    // Agregar LinkRecurso si existe
    if (temario.LinkRecurso) {
        const linkItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = temario.LinkRecurso;
        link.textContent = 'Recurso adicional';
        linkItem.appendChild(link);
        resourcesSection.appendChild(linkItem);
    }

    // Agregar PDF_Recurso si existe
    if (temario.PDF_Recurso) {
        const pdfItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = temario.PDF_Recurso;  // Concatenar la ruta base con el PDF
        link.textContent = 'PDF Recurso';
        pdfItem.appendChild(link);
        resourcesSection.appendChild(pdfItem);
    }

    // Mostrar mensaje si no hay recursos
    if (!temario.LinkRecurso && !temario.PDF_Recurso) {
        const noResourcesMessage = document.createElement('li');
        noResourcesMessage.textContent = 'No hay recursos disponibles para este tema.';
        resourcesSection.appendChild(noResourcesMessage);
    }

    // Mostrar descripción del temario
    const descriptionSection = document.querySelector('.additional-resources h3');
    descriptionSection.textContent = `Descripción del tema: ${temario.Descripcion}`;

    // Mostrar el video si existe
    const videoSection = document.querySelector('.video-section');
    const videoElement = videoSection.querySelector('video'); // Asumiendo que ya tienes un <video> dentro de .video-section

    // Verifica si el temario tiene un video
    if (temario.Video) {
        // Si el video está en base64
        videoElement.src = 'data:video/mp4;base64,' + temario.Video;
        videoSection.style.display = 'block';  // Mostrar la sección del video
    } else {
        videoSection.style.display = 'none';  // Ocultar la sección del video si no hay video
    }
}






