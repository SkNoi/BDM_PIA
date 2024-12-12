<?php

require_once 'Conexion.php';

class Temario {
    // Atributos
    public $ID_Nivel;
    public $Tema;
    public $Descripcion;
    public $LinkRecurso;
    public $PDF_Recurso;
    public $Video;

    private function __construct($ID_Nivel, $Tema, $Descripcion, $LinkRecurso, $PDF_Recurso, $Video) {
        $this->ID_Nivel = $ID_Nivel;
        $this->Tema = $Tema;
        $this->Descripcion = $Descripcion;
        $this->LinkRecurso = $LinkRecurso;
        $this->PDF_Recurso = $PDF_Recurso;
        $this->Video = $Video;
    }

    public static function crearTemario($ID_Nivel, $Tema, $Descripcion, $LinkRecurso, $PDF_Recurso, $Video)
    {
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();

        if (!$conexionAbierta) {
            return false;
        }

        try {
            $sql = "CALL InsertarTemario(?, ?, ?, ?, ?, ?)";
            $stmt = $conexionAbierta->prepare($sql);
            $stmt->bind_param('issbss', $ID_Nivel, $Tema, $Descripcion, $LinkRecurso, $PDF_Recurso, $Video);

            return $stmt->execute(); // Devuelve true si fue exitoso, false en caso contrario
        } catch (Exception $e) {
            error_log('Error al insertar temario: ' . $e->getMessage());
            return false;
        } finally {
            $conexion->cerrarConexion();
        }
    }


}

?>