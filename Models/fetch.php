<?php
// Inicia la sesión
session_start();

// Verifica si el usuario está logueado
if (!isset($_SESSION['ID_User'])) {
    die("No estás logueado.");
}

// Incluye la configuración de la base de datos
require './config.php';

// Consulta los mensajes de la base de datos
$stmt = $pdo->query("SELECT * FROM mensajes ORDER BY timestamp ASC");
$mensajes = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Muestra los mensajes
foreach ($mensajes as $mensaje) {
    // Asigna la clase 'own' si el mensaje es del usuario actual, 'other' si no
    $align = $mensaje['usuario_id'] == $_SESSION['ID_User'] ? 'own' : 'other';
    echo "<div class='message $align'><strong>Usuario {$mensaje['usuario_id']}:</strong> " . htmlspecialchars($mensaje['mensaje']) . "</div>";
}
?>
