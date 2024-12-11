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

// Consulta los datos
$sql = "CALL ObtenerInstructorYVentas();";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$datos = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }
} else {
    echo json_encode(['error' => 'No se encontraron datos']);
    exit;
}

// Retorna los datos como JSON
echo json_encode($datos);

$stmt->close();
$conn->close();
?>
