<?php
// Inicia la sesión
session_start();

// Verifica si el usuario ya está logueado
if (isset($_SESSION['ID_User'])) {
    // Si ya está logueado, redirige al chat
    header("Location: chat.php");
    exit();
}

// Verifica si se envió el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['usuario'])) {
    // Guarda el nombre de usuario en la sesión
    $_SESSION['ID_User'] = $_POST['Usuario'];
    // Redirige al chat
    header("Location: Chat.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Chat en Línea</title>
</head>
<body>
    <h2>Iniciar sesión en el chat</h2>
    <form method="POST">
        <label for="usuario">Nombre de usuario:</label>
        <input type="text" id="usuario" name="usuario" required>
        <button type="submit">Iniciar sesión</button>
    </form>
</body>
</html>
