<?php

require_once('../Models/Usuario.php');


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
    
                try {
                    // Verificar el estado de la cuenta
                    $estado = Usuario::verificarEstadoCuenta($correo);
                    echo "Estado de la cuenta: " . $estado . "\n";  // Para depurar
    
                    if ($estado === 'deshabilitado') {
                        throw new Exception('Tu cuenta está deshabilitada. Contacta al administrador.');
                    }
    
                    // Verificar las credenciales
                    $usuario = Usuario::iniciarSesion($correo, $contrasena);
                    if ($usuario) {
                        // Si las credenciales son correctas, retorna los datos
                        echo json_encode(["success" => true, "usuario" => $usuario]);
                    } else {
                        // Incrementar intentos fallidos al fallar el login
                        Usuario::registrarIntentoFallido($correo);  // Esto puede estar creando problemas si la conexión se mantiene abierta
                        $intentos = Usuario::obtenerIntentos($correo);
                        echo "Intentos fallidos: " . $intentos . "\n";  // Para depurar
    
                        // Si llega a 3 intentos fallidos, deshabilitar la cuenta
                        if ($intentos >= 3) {
                            Usuario::deshabilitarCuenta($correo);
                            throw new Exception('Tu cuenta ha sido deshabilitada tras 3 intentos fallidos.');
                        }
    
                        echo json_encode(["success" => false, "error" => "Credenciales incorrectas. Intento $intentos de 3."]);
                    }
                } catch (Exception $e) {
                    // Manejo de errores
                    echo json_encode(["success" => false, "error" => $e->getMessage()]);
                }
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

    public function restaurarUsuario() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (isset($_POST['correo']) && isset($_POST['contrasena'])) {
                $correo = $_POST['correo'];
                $contrasena = $_POST['contrasena'];
    
                // Llamar al modelo para restaurar el usuario
                $resultado = Usuario::restaurarUsuario($correo, $contrasena);
    
                // Asegúrate de que solo se envíe una respuesta
                if ($resultado) {
                    echo json_encode(["success" => true, "message" => "Usuario restaurado correctamente."]);
                } else {
                    echo json_encode(["success" => false, "error" => "No se pudo restaurar el usuario, verifica el correo."]);
                }
            } else {
                echo json_encode(["success" => false, "error" => "Faltan datos para restaurar el usuario."]);
            }
        } else {
            echo json_encode(["success" => false, "error" => "Método no permitido."]);
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
        case 'restaurar':  // Nuevo caso para restaurar usuario
            $controller->RestaurarUsuario();
            break;
        default:
            echo json_encode(["success" => false, "error" => "Acción no válida"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Acción no definida"]);
}
?>
