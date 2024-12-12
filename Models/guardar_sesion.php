<?php
session_start();

// Leer el cuerpo de la solicitud
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Verificar si se recibió el dato correctamente
if (isset($data['usuario'])) {
    // Guardar el dato en la sesión
    $_SESSION['ID_User'] = $data['usuario'];

    // Responder al cliente
    echo json_encode(['message' => 'Usuario guardado en sesión']);
} else {
    // Respuesta en caso de error
    http_response_code(400);
    echo json_encode(['message' => 'No se recibió el dato']);
}
?>