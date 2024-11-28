<?php 
require_once 'Conexion.php';

class Categoria {
    // Atributos
    public $idCategoria;
    public $TituloCate;
    public $Descripcion;
    public $Creador;
    public $FechaCreacion;

    // Constructor privado
    private function __construct($idCategoria, $TituloCate, $Descripcion, $Creador, $FechaCreacion) {
        $this->idCategoria = $idCategoria;
        $this->TituloCate = $TituloCate;
        $this->Descripcion = $Descripcion;
        $this->Creador = $Creador;
        $this->FechaCreacion = $FechaCreacion;
    }

    // Crear una nueva categoría
    public static function crearCategoria($TituloCate, $Descripcion, $Creador) {
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();

        if (!$conexionAbierta) {
            return false;
        }

        try {
            $sql = "CALL CrearCategoria(?, ?, ?)";
            $stmt = $conexionAbierta->prepare($sql);
            $stmt->bind_param("ssi", $TituloCate, $Descripcion, $Creador);

            $resultado = $stmt->execute();
            $stmt->close();
            return $resultado;
        } catch (Exception $e) {
            error_log("Error al crear categoría: " . $e->getMessage());
            return false;
        }
         finally {
            $conexion->cerrarConexion();
        }
    }

    // Modificar una categoría existente
    public static function modificarCategoria($idCategoria, $TituloCate, $Descripcion) {
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();

        if (!$conexionAbierta) {
            return false;
        }

        try {
            $sql = "CALL ModificarCategoria(?, ?, ?)";
            $stmt = $conexionAbierta->prepare($sql);
            $stmt->bind_param("iss", $idCategoria, $TituloCate, $Descripcion);

            $resultado = $stmt->execute();
            $stmt->close();
            return $resultado;
        } catch (Exception $e) {
            return false;
        } finally {
            $conexion->cerrarConexion();
        }
    }

    // Eliminar una categoría existente
    public static function eliminarCategoria($idCategoria) {
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        if (!$conexionAbierta) {
            return false;
        }
    
        try {
            // Definir la consulta SQL para eliminar la categoría
            $sql = "DELETE FROM Categoría WHERE id_Categoria = ?";
            $stmt = $conexionAbierta->prepare($sql);
    
            if ($stmt === false) {
                throw new Exception("Error al preparar la consulta SQL.");
            }
    
            // Asociar el parámetro y ejecutar la consulta
            $stmt->bind_param('i', $idCategoria);  // 'i' es para un entero (int)
            $stmt->execute();
    
            // Verificar si la eliminación fue exitosa
            if ($stmt->affected_rows > 0) {
                return true;  // Se eliminó correctamente
            } else {
                return false;  // No se encontró la categoría o no se pudo eliminar
            }
        } catch (Exception $e) {
            return false;  // En caso de error
        } finally {
            $conexion->cerrarConexion();
        }
    }
    
    

    // Obtener todas las categorías
    public static function obtenerCategorias() {
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();

        if (!$conexionAbierta) {
            return [];
        }

        try {
            $sql = "SELECT * FROM Categoría";
            $resultado = $conexionAbierta->query($sql);
            $categorias = [];

            while ($fila = $resultado->fetch_assoc()) {
                $categorias[] = new Categoria(
                    $fila['id_Categoria'],
                    $fila['TituloCate'],
                    $fila['Descripcion'],
                    $fila['Creador'],
                    $fila['FechaCreacion']
                );
            }

            return $categorias;
        } catch (Exception $e) {
            return [];
        } finally {
            $conexion->cerrarConexion();
        }
    }
}



?>