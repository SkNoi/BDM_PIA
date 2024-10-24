<?php
class Conexion {
    // Atributos
    private $host = "localhost";
    private $baseDatos = "BDM_PIA";
    private $usuario = "root";
    private $contrasena = "";
    private $puerto = "3307";
    
    private static $instancia = null;
    private $conexionAbierta = null;

    // Constructor privado para el patrón Singleton
    private function __construct() { }

    // Acceso a la instancia de la conexión
    public static function instanciaConexion() {
        if (!self::$instancia) {
            self::$instancia = new Conexion();
        }
        return self::$instancia;
    }

    //Abrir la conexión
    public function abrirConexion() {
        if ($this->conexionAbierta == null) {
            // Crear la conexión
            $this->conexionAbierta = new mysqli($this->host, $this->usuario, $this->contrasena, $this->baseDatos, $this->puerto);

            // Verificar si la conexión fue exitosa
            if ($this->conexionAbierta->connect_error) {
                die("Conexión fallida: " . $this->conexionAbierta->connect_error);
            }
        }

        return $this->conexionAbierta;
    }

    //Cerrar la conexión
    public function cerrarConexion() {
        if ($this->conexionAbierta != null) {
            $this->conexionAbierta->close();
            $this->conexionAbierta = null;
        }
    }
}
