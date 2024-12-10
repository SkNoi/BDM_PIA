<?php

require_once 'Conexion.php';

class Nivel {
    // Atributos
    public $ID_Curso;
    public $Video;
    public $Descripcion;
    public $Nivel;

    private function __construct($ID_Curso, $Video, $Descripcion, $Nivel) {
        $this->ID_Curso = $ID_Curso;
        $this->Video = $Video;
        $this->Descripcion = $Descripcion;
        $this->Nivel = $Nivel;
    }

    // Crear un nivel
    public static function crearNivel($ID_Curso, $Video, $Descripcion, $Nivel) {
        // Ruta absoluta al directorio de videos
        $videoDir = __DIR__ . '/../uploads/videos/';
        if (!is_dir($videoDir)) {
            if (!mkdir($videoDir, 0777, true)) {
                error_log('No se pudo crear el directorio para videos: ' . $videoDir);
                return false;
            }
        }
    
        // Crear un nombre único para el archivo
        $videoNombre = uniqid() . '-' . basename($Video['name']);
        $videoRuta = $videoDir . $videoNombre;
    
        // Mover el archivo subido a la carpeta de videos
        if (!move_uploaded_file($Video['tmp_name'], $videoRuta)) {
            error_log('No se pudo mover el archivo subido: ' . $Video['tmp_name']);
            return false;
        }
    
        // Insertar los datos en la base de datos usando el procedimiento almacenado
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        if (!$conexionAbierta) {
            return false;
        }
    
        try {
            // Preparar la llamada al procedimiento
            $sql = "CALL CrearNivel(?, ?, ?, ?)";
            $stmt = $conexionAbierta->prepare($sql);
            $stmt->bind_param('isss', $ID_Curso, $videoNombre, $Descripcion, $Nivel);
    
            if ($stmt->execute()) {
                return true; // Éxito
            } else {
                error_log('Error al ejecutar el procedimiento almacenado: ' . $stmt->error);
                return false;
            }
        } catch (Exception $e) {
            error_log('Excepción al crear nivel: ' . $e->getMessage());
            return false;
        } finally {
            $conexion->cerrarConexion();
        }
    }
    
    public static function obtenerNivelesPorCurso($idCurso) {
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();

        if (!$conexionAbierta) {
            error_log('No se pudo abrir la conexión a la base de datos.');
            return false;
        }

        try {
            // Preparar la consulta para obtener los niveles por ID_Curso
            $sql = "SELECT ID_Nivel, Nivel FROM Nivel WHERE ID_Curso = ?";
            $stmt = $conexionAbierta->prepare($sql);

            if (!$stmt) {
                error_log('Error al preparar la consulta: ' . $conexionAbierta->error);
                return false;
            }

            // Enlazar parámetros
            $stmt->bind_param('i', $idCurso);

            // Ejecutar la consulta
            if (!$stmt->execute()) {
                error_log('Error al ejecutar la consulta: ' . $stmt->error);
                return false;
            }

            // Obtener los resultados
            $result = $stmt->get_result();

            // Convertir los resultados a un array asociativo
            $niveles = [];
            while ($row = $result->fetch_assoc()) {
                $niveles[] = $row;
            }

            return $niveles;

        } catch (Exception $e) {
            error_log('Excepción al obtener niveles: ' . $e->getMessage());
            return false;
        } finally {
            $conexion->cerrarConexion();
        }
    }
    
    
}


?>