<?php

require_once('../Models/Temario.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener la acción desde el POST
    $accion = $_POST['accion'] ?? '';

    // Validar y ejecutar según la acción
    switch ($accion) {
        case 'crearTemario':
            $ID_Nivel = $_POST['ID_Nivel'] ?? null;
            $Tema = $_POST['Tema'] ?? null;
            $Descripcion = $_POST['Descripcion'] ?? null;
            $LinkRecurso = $_POST['LinkRecurso'] ?? null;
            $PDF_Recurso = $_FILES['PDF_Recurso'] ?? null;
            $Video = $_FILES['Video'] ?? null;
        
            // Validar datos obligatorios
            if (!$ID_Nivel || !$Tema || !$Descripcion || !$LinkRecurso || !$PDF_Recurso || !$Video) {
                echo json_encode(['success' => false, 'error' => 'Faltan datos obligatorios.']);
                exit();
            }
        
            // Leer el contenido de los archivos PDF y Video como binarios
            $pdfData = null;
            $videoData = null;
        
            if ($PDF_Recurso && $PDF_Recurso['error'] === UPLOAD_ERR_OK) {
                $pdfData = file_get_contents($PDF_Recurso['tmp_name']); // Leer PDF como binario
            }
        
            if ($Video && $Video['error'] === UPLOAD_ERR_OK) {
                $videoData = file_get_contents($Video['tmp_name']); // Leer Video como binario
            }
        
            // Llamar al modelo para guardar los datos en la base de datos
            $resultado = Temario::crearTemario($ID_Nivel, $Tema, $Descripcion, $LinkRecurso, $pdfData, $videoData);
        
            if ($resultado) {
                echo json_encode(['success' => true, 'message' => 'Temario creado correctamente.']);
            } else {
                echo json_encode(['success' => false, 'error' => 'Error al guardar el temario en la base de datos.']);
            }
            break;
        

        case 'modificarTemario':
            // Lógica para modificar un nivel
            echo json_encode(['success' => false, 'message' => 'Función no implementada.']);
            break;

        case 'eliminarTemario':
            // Lógica para eliminar un nivel
            echo json_encode(['success' => false, 'message' => 'Función no implementada.']);
            break;

        default:
            echo json_encode(['success' => false, 'error' => 'Acción no válida o no definida.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Método no permitido.']);
}


?>
