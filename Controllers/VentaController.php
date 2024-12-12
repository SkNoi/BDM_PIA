<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once '../Models/Venta.php'; // Incluye el modelo de Venta

    // Obtener la acción desde el POST
    $accion = $_POST['accion'] ?? '';

    try {
        switch ($accion) {
            case 'registrarVenta':
                // Obtener los datos enviados desde el formulario o el frontend
                $idEstudiante = $_POST['ID_Estudiante'] ?? null;
                $idCurso = $_POST['ID_Curso'] ?? null;
                $total = $_POST['Total'] ?? null;
                $metodoPago = $_POST['MetodoPago'] ?? null;
                $estatus = $_POST['Estatus'] ?? null;

                // Validar que todos los datos requeridos estén presentes
                if (!$idEstudiante || !$idCurso || !$total || !$metodoPago || !$estatus) {
                    echo json_encode(['success' => false, 'error' => 'Faltan datos obligatorios.']);
                    exit;
                }

                // Registrar la venta usando el modelo
                $ventaId = Venta::registrarVenta($idEstudiante, $idCurso, $total, $metodoPago, $estatus);

                if ($ventaId) {
                    // Respuesta exitosa
                    echo json_encode(['success' => true, 'message' => 'Venta registrada correctamente.', 'venta_id' => $ventaId]);
                    exit;  // Asegúrate de llamar a exit después de enviar la respuesta JSON.
                    
                } else {
                    // Error al registrar la venta
                    echo json_encode(['success' => false, 'error' => 'No se pudo registrar la venta.']);
                }
                break;

            default:
                // Acción no válida
                echo json_encode(['success' => false, 'error' => 'Acción no especificada o inválida.']);
                break;
        }
    } catch (Exception $e) {
        // Manejar errores inesperados
        echo json_encode(['success' => false, 'error' => 'Ocurrió un error: ' . $e->getMessage()]);
    }
} else {
    // Si no es una solicitud POST
    echo json_encode(['success' => false, 'error' => 'Método no permitido.']);
}

?>
