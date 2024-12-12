<?php
// Configuración de conexión a la base de datos
$host = "s9xpbd61ok2i7drv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com";
    $username = "w61uabsrpaswba47"; 
    $password = "Zgug8l6g0pj2cwrn"; 
    $dbname = "Omggy318wf15rtc3"; 
    $port = 3306;
    $conn = new mysqli($host, $username, $password, $dbname,$port);
// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Recibir datos del formulario
$id_usuario = $_POST['id_usuario'];
$id_curso = $_POST['id_curso'];
$comentario = $_POST['comentario'];
$calificacion = $_POST['calificacion'];

// Insertar el comentario en la base de datos
$sql = "INSERT INTO Comentario (ID_Curso, ID_User, Contenido, Calificacion, FechaCreacion) 
        VALUES ('$id_curso', '$id_usuario', '$comentario', '$calificacion', NOW())";

if ($conn->query($sql) === TRUE) {
    // Redirigir con un mensaje de éxito
    header("Location: ../Demo.html?success=1");
    exit();
} else {
    echo "Error al insertar el comentario: " . $conn->error;
}

$conn->close();
?>
