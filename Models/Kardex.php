<?php

// archivo: obtener_datos.php

header('Content-Type: application/json');
 
// Configura tu conexión a la base de datos

$host = "s9xpbd61ok2i7drv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com";

$db = "omggy318wf15rtc3";

$user = "w61uabsrpaswba47";

$password = "zgug8l6g0pj2cwrn";
 
$conn = new mysqli($host, $user, $password, $db);
 
if ($conn->connect_error) {

    die("Error de conexión: " . $conn->connect_error);

}
 
// Obtener el valor de usuario desde POST

$usuario = isset($_POST['usuario']) ? intval($_POST['usuario']) : 0;
 
if ($usuario === 0) {

    echo json_encode(['error' => 'Usuario no válido']);

    exit;

}
 
// Consulta los datos

$sql = "SELECT ID_Curso, FechaInscripcion, UltimaFecha_Acceso, Fecha_Terminado, Estatus, Califacion, Creditos 

        FROM Kardex 

        WHERE ID_User = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("i", $usuario); // Enlazar parámetro

$stmt->execute();

$result = $stmt->get_result();
 
$datos = [];

if ($result->num_rows > 0) {

    while ($row = $result->fetch_assoc()) {

        $datos[] = $row;

    }

}
 
// Retorna los datos como JSON

echo json_encode($datos);
 
$stmt->close();

$conn->close();

?>

 