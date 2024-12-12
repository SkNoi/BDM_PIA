<?php 
$host = 'localhost';
$port = '3306';  // El puerto que estás utilizando
$dbname = 'Lineda';
$user = 'root';
$password = '';

try {
    // Agregamos el parámetro port en la cadena de conexión
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error en la conexión: " . $e->getMessage());
}
?>
