<?php
class Conexion {
    // Atributos
    private $host = "s9xpbd61ok2i7drv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com";
    private $baseDatos = "omggy318wf15rtc3";
    private $usuario = "w61uabsrpaswba47";
    private $contrasena = "zgug8l6g0pj2cwrn";
    private $puerto = "3306";
    
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
