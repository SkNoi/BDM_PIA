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

            // Rutas de destino para los archivos
            $pdfDestino = '../uploads/pdf' . uniqid('pdf_') . '_' . basename($PDF_Recurso['name']);
            $videoDestino = '../uploads/videos/' . uniqid('video_') . '_' . basename($Video['name']);

            // Mover archivos al servidor
            if (!move_uploaded_file($PDF_Recurso['tmp_name'], $pdfDestino)) {
                echo json_encode(['success' => false, 'error' => 'Error al subir el archivo PDF.']);
                exit();
            }

            if (!move_uploaded_file($Video['tmp_name'], $videoDestino)) {
                echo json_encode(['success' => false, 'error' => 'Error al subir el archivo de video.']);
                exit();
            }

            // Llamar al modelo para guardar los datos en la base de datos
            $resultado = Temario::crearTemario($ID_Nivel, $Tema, $Descripcion, $LinkRecurso, $pdfDestino, $videoDestino);

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
