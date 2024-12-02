<?php 

require_once('../Models/Nivel.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener la acción desde el POST
    $accion = $_POST['accion'] ?? '';

    // Validar y ejecutar según la acción
    switch ($accion) {
        case 'crearNivel':
            // Obtener los datos enviados desde el formulario
            $ID_Curso = $_POST['ID_Curso'] ?? null;
            $Video = $_FILES['Video'] ?? null;
            $Descripcion = $_POST['Descripcion'] ?? null;
            $Nivel = $_POST['Nivel'] ?? null;
            
            // Validar los datos
            if (!$ID_Curso || !$Video || !$Descripcion || !$Nivel) {
                echo json_encode(['success' => false, 'error' => 'Faltan datos obligatorios.']);
                exit();
            }

            // Validar el archivo subido
            if (!isset($Video['tmp_name']) || $Video['size'] <= 0) {
                echo json_encode(['success' => false, 'error' => 'Archivo de video inválido.']);
                exit();
            }

            
            // Llamar al método para crear el nivel
            $resultado = Nivel::crearNivel($ID_Curso, $Video, $Descripcion, $Nivel);

            if ($resultado) {
                echo json_encode(['success' => true, 'message' => 'Nivel creado correctamente.']);
            } else {
                echo json_encode(['success' => false, 'error' => 'No se pudo crear el nivel.']);
            }
            break;

        case 'modificarNivel':
            // Lógica para modificar un nivel
            echo json_encode(['success' => false, 'message' => 'Función no implementada.']);
            break;

        case 'eliminarNivel':
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