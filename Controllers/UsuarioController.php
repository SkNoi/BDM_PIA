<?php

require_once 'Models/Usuario.php';

class UsuarioController {
    public function registrar() {
        // Verifica si el método de la petición es POST
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Verifica si los datos de registro están disponibles
            if (isset($_POST['usuario'])) {
                $imagenPerfil = isset($_FILES['foto']) ? $_FILES['foto'] : null;
                $nombre = $_POST['usuario'];
                $sexo = $_POST['genero'];
                $fechaNacimiento = $_POST['fecha-nacimiento'];
                $email = $_POST['correo'];
                $contrasena = $_POST['contrasena'];
                $rol = $_POST['rol'];
                $cuentaBancaria = null; // Definir según el caso

                // Crear el nombre completo
                $nombreCompleto = $nombre;

                // Llamar al método de registro
                Usuario::registrarUsuario($nombreCompleto, $sexo, $fechaNacimiento, $imagenPerfil, $email, $contrasena, $rol, $cuentaBancaria);
            } else {
                echo json_encode(["success" => false, "error" => "Faltan datos de registro"]);
            }
        } else {
            echo json_encode(["success" => false, "error" => "Método no permitido."]);
        }
    }

    public function iniciarSesion() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Obtener los datos de login
            $datos = json_decode(file_get_contents("php://input"), true);

            if (isset($datos['usuario']) && isset($datos['contrasena'])) {
                $correo = $datos['usuario'];
                $contrasena = $datos['contrasena'];

                // Llamar al método de inicio de sesión
                Usuario::iniciarSesion($correo, $contrasena);
            } else {
                echo json_encode(["success" => false, "error" => "Faltan datos de login"]);
            }
        }
    }

    public function actualizar() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $idUsuario = $_POST['idUsuario'];
            $nombreCompleto = $_POST['nombreCompleto'];
            $sexo = $_POST['sexo'];
            $fechaNacimiento = $_POST['fechaNacimiento'];
            $correo = $_POST['correo'];
            $contrasena = $_POST['contrasena'];
            $imagenPerfil = isset($_FILES['Avatar']) ? $_FILES['Avatar'] : null;

            // Llamar al método de actualización
            Usuario::actualizarUsuario($idUsuario, $nombreCompleto, $sexo, $fechaNacimiento, $correo, $contrasena, $imagenPerfil);
        }
    }
}

// Instanciar el controlador y manejar las peticiones
$controller = new UsuarioController();

// Llamar a la función correspondiente según la acción
if (isset($_GET['accion'])) {
    switch ($_GET['accion']) {
        case 'registrar':
            $controller->registrar();
            break;
        case 'login':
            $controller->iniciarSesion();
            break;
        case 'actualizar':
            $controller->actualizar();
            break;
        default:
            echo json_encode(["success" => false, "error" => "Acción no válida"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Acción no definida"]);
}
?>
