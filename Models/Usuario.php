<?php

require_once 'Conexion.php';

class Usuario {
    // Atributos
    public $id;
    public $NombreUsuario; 
    public $Correo;
    public $Contraseña;
    public $Rol;
    public $Fecha_Nacimiento;
    public $Imagen_Perfil;
    public $Sexo;
    public $Fecha_Registro;
    public $Cuenta_Bancaria;

    private function __construct($id, $NombreUsuario, $Correo, $Contraseña, $Rol, $Fecha_Nacimiento, $Imagen_Perfil, $Sexo, $Fecha_Registro, $Cuenta_Bancaria) {
        $this->id = $id;
        $this->NombreUsuario = $NombreUsuario;
        $this->Correo = $Correo;
        $this->Contraseña = $Contraseña;
        $this->Rol = $Rol;
        $this->Fecha_Nacimiento = $Fecha_Nacimiento;
        $this->Imagen_Perfil = $Imagen_Perfil;
        $this->Sexo = $Sexo;
        $this->Fecha_Registro = $Fecha_Registro; 
        $this->Cuenta_Bancaria = $Cuenta_Bancaria;
    }
    
    

    public static function registrarUsuario($nombreCompleto, $sexo, $fechaNacimiento, $imagenPerfil, $correo, $contrasena, $rol, $cuentaBancaria) {
        // Obtener la conexión y abrirla
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        if (!$conexionAbierta) {
            echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos."]);
            exit();
        }
    
        header('Content-Type: application/json');
    
        // Preparar la llamada al procedure
        $preparacion = $conexionAbierta->prepare("CALL RegistrarUsuario(?, ?, ?, ?, ?, ?, ?, ?)");
    
        if (!$preparacion) {
            echo json_encode(["success" => false, "error" => "Error al preparar la consulta."]);
            $conexion->cerrarConexion();
            exit();
        }
    
        // Comprobar si la imagen de perfil ya está en base64
        if (is_string($imagenPerfil)) {
            $imagenBase64 = $imagenPerfil;
        } else if ($imagenPerfil != null && $imagenPerfil['tmp_name'] && $imagenPerfil['size'] > 0) {
            // Convertir la imagen de perfil a base64
            $imagenBase64 = base64_encode(file_get_contents($imagenPerfil['tmp_name']));
        } else {
            // Si no se detectó una imagen, dejar este campo como null
            $imagenBase64 = null;
        }
    
        // Pasar los parámetros al procedure y ejecutarlo
        $preparacion->bind_param("ssssssss", $nombreCompleto, $sexo, $fechaNacimiento, $imagenBase64, $correo, $contrasena, $rol, $cuentaBancaria);
        
        // Ejecutar la consulta
        if ($preparacion->execute()) {
            // Verificar si se insertó correctamente o si hubo un problema (como correo duplicado)
            if ($conexionAbierta->affected_rows > 0) {
                // Obtener el ID del último usuario insertado
                $idNuevoUsuario = $conexionAbierta->insert_id;
    
                // Crear el nuevo usuario
                $nuevoUsuario = new Usuario($idNuevoUsuario, $nombreCompleto, $correo, $contrasena, $rol, $fechaNacimiento, $imagenBase64, $sexo, date("Y-m-d H:i:s"), $cuentaBancaria);
                
                echo json_encode(["success" => true, "message" => "Usuario registrado exitosamente.", "usuario" => $nuevoUsuario]);
            } else {
                echo json_encode(["success" => false, "error" => "No se pudo registrar el usuario. Es posible que el correo ya esté registrado."]);
            }
        } else {
            echo json_encode(["success" => false, "error" => "Error al ejecutar el procedimiento almacenado: " . $preparacion->error]);
        }
    
        // Cerrar la conexión
        $preparacion->close();
        $conexion->cerrarConexion();
    }
    
    public static function iniciarSesion($correo, $contrasena) {
        // Obtener la conexión
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        if (!$conexionAbierta) {
            echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos."]);
            exit();
        }
    
        header('Content-Type: application/json');
    
        // Preparar la llamada al procedure
        $preparacion = $conexionAbierta->prepare("CALL ObtenerCredenciales(?, ?)");
    
        if (!$preparacion) {
            echo json_encode(["success" => false, "error" => "Error al preparar la consulta."]);
            $conexion->cerrarConexion();
            exit();
        }
    
        // Vincular parámetros
        $preparacion->bind_param("ss", $correo, $contrasena);
        $preparacion->execute();
    
        // Obtener resultados
        $resultado = $preparacion->get_result();
        if ($resultado->num_rows > 0) {
            $usuario = $resultado->fetch_assoc();

            echo json_encode(["success" => true, "message" => $usuario]);

        } else {
            echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
        }
    
        $preparacion->close();
        $conexion->cerrarConexion();
    }
    
    


}





if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Intentar obtener datos en formato JSON para el login
    $datos = json_decode(file_get_contents("php://input"), true);

    // Comprobar si se está intentando realizar un login
    if (isset($datos['accion']) && $datos['accion'] === 'login') {
        // Obtener datos para login
        $correo = $datos['usuario'];
        $contrasena = $datos['contrasena'];

        // Llamar al método de iniciar sesión
        Usuario::iniciarSesion($correo, $contrasena);
    } else {
        // Obtener los datos del formulario para registro
        $imagenPerfil = isset($_FILES['foto']) ? $_FILES['foto'] : null;
        $nombre = $_POST['usuario'];
        $sexo = $_POST['genero'];
        $fechaNacimiento = $_POST['fecha-nacimiento'];
        $email = $_POST['correo'];
        $usuario = $_POST['usuario'];
        $contrasena = $_POST['contrasena']; // Encriptar la contraseña
        $rol = $_POST['rol'];
        $cuentaBancaria = null; // Por ahora lo dejamos en null

        // Crear el nombre completo a partir de los nombres y apellidos
        $nombreCompleto = $nombre;

        // Registrar al usuario llamando al método registrarUsuario
        Usuario::registrarUsuario($nombreCompleto, $sexo, $fechaNacimiento, $imagenPerfil, $email, $contrasena, $rol, $cuentaBancaria);
    }
} else {
    echo json_encode(["success" => false, "error" => "Método no permitido."]);
}

?>
