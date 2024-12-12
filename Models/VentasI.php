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
    echo json_encode([
        'success' => false,
        'data' => [],
        'error' => 'Error de conexión: ' . $conn->connect_error
    ]);
    exit;
}

$ID_Uses = intval($_POST['ID_User']);

// Asegúrate de que la variable sea segura para usar en la consulta
//$ID_Uses = $conn->real_escape_string($ID_Uses);

$sql = "CALL GetInstructorCourseDetails(?);";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode([
        'success' => false,
        'data' => [],
        'error' => 'Error al preparar la consulta: ' . $conn->error
    ]);
    exit;
}

// Vincula la variable ID_Uses a la consulta
$stmt->bind_param("i", $ID_Uses);
$stmt->execute();
$result = $stmt->get_result();

$datos = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }
}

// Estructura de respuesta estándar
$response = [
    'success' => true,
    'data' => $datos,
    'error' => null
];

echo json_encode($response);

$stmt->close();
$conn->close();
?>
