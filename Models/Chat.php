<?php
session_start();  // Inicia la sesión

// Verifica si la sesión está activa y el usuario ha iniciado sesión
if (!isset($_SESSION['ID_User'])) {
    // Si no está definida la sesión, redirigir a la página de inicio o mostrar un mensaje de error
    echo "No estás logueado.";
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat en Línea - Estudiante y Instructor</title>
    <link rel="stylesheet" href=".css/chat.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <header>
        <a href="Principal.html">Inicio</a>
            
        <div class="buscador">
            <input type="text" placeholder="Buscar">
            <button><i class="fa-solid fa-magnifying-glass"></i></button>
        </div>
      
    </header>

    <div class="chat-container">
        <div class="chat-header">
            <h2>Chat en Tiempo Real - Usuario <?php echo $_SESSION['ID_User']; ?></h2>
        </div>
        <div class="chat-box" id="chat-box"></div>
        <div class="chat-input">
            <input type="text" id="message" placeholder="Escribe tu mensaje...">
            <button id="send-button">Enviar</button>
        </div>
    </div>

    <script>
        const usuarioId = parseInt("<?php echo $_SESSION['ID_User']; ?>");

        // Obtener mensajes cada 1 segundo
        function fetchMessages() {
            $.get("fetch.php", function (data) {
                $("#chat-box").html(data);
                $("#chat-box").scrollTop($("#chat-box")[0].scrollHeight);
            });
        }

        // Enviar mensaje
        $("#send-button").click(function () {
            const mensaje = $("#message").val().trim();
            if (mensaje) {
                $.post("send.php", { usuario_id: usuarioId, mensaje: mensaje }, function () {
                    $("#message").val("");
                    fetchMessages();
                });
            }
        });

        // Llamar a fetchMessages cada segundo
        setInterval(fetchMessages, 1000);

        // Inicializar mensajes
        fetchMessages();
    </script>    
</body>
</html>
