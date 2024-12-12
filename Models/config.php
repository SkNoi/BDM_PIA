<?php 
$host = 's9xpbd61ok2i7drv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com';
$port = '3306';  // El puerto que estás utilizando
$dbname = 'omggy318wf15rtc3';
$user = 'w61uabsrpaswba47';
$password = 'zgug8l6g0pj2cwrn';

try {
    // Agregamos el parámetro port en la cadena de conexión
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error en la conexión: " . $e->getMessage());
}
?>
