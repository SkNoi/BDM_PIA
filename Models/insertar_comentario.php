<?php
// Configuración de la conexión a la base de datos
$servername = "s9xpbd61ok2i7drv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com";
$username = "w61uabsrpaswba47";
$password = "Zgug8l6g0pj2cwrn";
$dbname = "Omggy318wf15rtc3";
$port = "3306";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname,$port);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Obtener datos del formulario
$ID_Curso = $_POST['ID_Curso'];
$ID_User = $_POST['ID_User'];
$Contenido = $_POST['Contenido'];
$Calificacion = $_POST['Calificacion'];
$FechaCreacion = date("Y-m-d H:i:s");

// Insertar el comentario en la base de datos
$sql = "INSERT INTO Comentario (ID_Curso, ID_User, Contenido, FechaCreacion, Calificacion) 
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iissi", $ID_Curso, $ID_User, $Contenido, $FechaCreacion, $Calificacion);

if ($stmt->execute()) {
    echo "Comentario enviado exitosamente.";
    header("Location: curso.php?ID_Curso=$ID_Curso"); // Redirige de vuelta al curso
} else {
    echo "Error al enviar el comentario: " . $conn->error;
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
