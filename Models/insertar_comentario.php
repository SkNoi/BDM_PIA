<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Capturar los datos enviados desde el formulario
    $ID_Curso = $_POST['ID_Curso'] ?? null;
    $ID_User = $_POST['ID_User'] ?? null;
    $Contenido = $_POST['Contenido'] ?? null;
    $Calificacion = $_POST['Calificacion'] ?? null;

    // Verificar que todos los datos requeridos estén presentes
    if (!$ID_Curso || !$ID_User || !$Contenido || !$Calificacion) {
        echo "Error: Faltan datos en el formulario.";
        exit;
    }

    // Conexión a la base de datos
    $host = "s9xpbd61ok2i7drv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com";
    $username = "w61uabsrpaswba47"; 
    $password = "Zgug8l6g0pj2cwrn"; 
    $dbname = "Omggy318wf15rtc3"; 
    $port = 3306;

    $conn = new mysqli($host, $username, $password, $dbname,$port);

    // Verificar la conexión
    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }

    // Preparar la consulta SQL para insertar el comentario
    $stmt = $conn->prepare("INSERT INTO Comentario (ID_Curso, ID_User, Contenido, Calificacion, FechaCreacion) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("iisi", $ID_Curso, $ID_User, $Contenido, $Calificacion);

    // Ejecutar la consulta
    if ($stmt->execute()) {
        echo "Comentario insertado correctamente.";
    } else {
        echo "Error al insertar el comentario: " . $stmt->error;
    }

    // Cerrar la conexión
    $stmt->close();
    $conn->close();
} else {
    echo "Acceso no válido.";
}
?>
