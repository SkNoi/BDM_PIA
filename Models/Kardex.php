<?php
header('Content-Type: application/json');

$host = "s9xpbd61ok2i7drv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com";
$db = "omggy318wf15rtc3";
$user = "w61uabsrpaswba47";
$password = "zgug8l6g0pj2cwrn";

$conn = new mysqli($host, $user, $password, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conn->connect_error]));
}

// Obtén los datos enviados por el cliente
$input = json_decode(file_get_contents("php://input"), true);
$usuario = $input['usuario'] ?? null;

// Valida que se haya recibido el usuario
if (!$usuario) {
    echo json_encode(["error" => "Usuario no proporcionado"]);
    exit;
}

$sql = "SELECT ID_Curso, FechaInscripcion, UltimaFecha_Acceso, Fecha_Terminado, Estatus, Calificacion, Creditos FROM Kardex WHERE ID_User = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $usuario);
$stmt->execute();
$result = $stmt->get_result();

$datos = [];
while ($row = $result->fetch_assoc()) {
    $datos[] = $row;
}

echo json_encode($datos);

$stmt->close();
$conn->close();
?>
