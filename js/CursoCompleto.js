
function mostrarTemario(temarioId) {
    // Obtener el temario correspondiente
    var temario = document.getElementById(temarioId);
    
    // Alternar la visibilidad del temario
    if (temario.style.display === "block") {
        temario.style.display = "none"; // Ocultar si ya está visible
    } else {
        temario.style.display = "block"; // Mostrar si no está visible
    }
}

