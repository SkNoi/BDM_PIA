<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once '../Models/Ventas.php'; 

    // Obtener los datos JSON enviados en el cuerpo de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);

    // Verificar que la acción sea 'registrarVenta'
    $accion = $data['accion'] ?? '';

    try {
        switch ($accion) {
            case 'registrarVenta':
                // Obtener los datos enviados desde el frontend
                $idEstudiante = $data['ID_Estudiante'] ?? null;
                $idCurso = $data['ID_Curso'] ?? null;
                $total = $data['Total'] ?? null;
                $metodoPago = $data['MetodoPago'] ?? null;
                $estatus = $data['Estatus'] ?? null;

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
