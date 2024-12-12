<?php
require './config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario_id = $_POST['usuario_id'];
    $mensaje = $_POST['mensaje'];

    $stmt = $pdo->prepare("INSERT INTO mensajes (usuario_id, mensaje) VALUES (:usuario_id, :mensaje)");
    $stmt->execute(['usuario_id' => $usuario_id, 'mensaje' => $mensaje]);
}
?>
