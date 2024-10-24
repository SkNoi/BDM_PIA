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
                $nuevoUsuario = new Usuario($idNuevoUsuario, $nombreCompleto, $sexo, $fechaNacimiento, $imagenBase64, $correo, $contrasena, $rol, $cuentaBancaria, date("Y-m-d H:i:s"));
                
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
    
}
// Al final de tu archivo PHP, antes de cerrar la etiqueta PHP
echo json_encode(["success" => true, "message" => "Usuario registrado exitosamente."]);
exit();


?>