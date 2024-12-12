<?php 
require_once 'Conexion.php';

class Venta {
    // Atributos
    public $ID_Estudiante;
    public $ID_Curso;
    public $Total;
    public $FechaVenta;
    public $MetodoPago;
    public $Estatus;

    // Constructor privado
    private function __construct($ID_Estudiante, $ID_Curso, $Total, $FechaVenta, $MetodoPago, $Estatus) {
        $this->ID_Estudiante = $ID_Estudiante;
        $this->ID_Curso = $ID_Curso;
        $this->Total = $Total;
        $this->FechaVenta = $FechaVenta;
        $this->MetodoPago = $MetodoPago;
        $this->Estatus = $Estatus;
    }

    public static function registrarVenta($ID_Estudiante, $ID_Curso, $Total, $MetodoPago, $Estatus) {
        // Crear instancia de la conexión
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        if (!$conexionAbierta) {
            echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos."]);
            exit();
        }
    
        try {
            // Preparar la consulta para llamar a la función MySQL
            $sql = "SELECT registrarVenta(?, ?, ?, ?, ?) AS venta_id";
            $stmt = $conexionAbierta->prepare($sql);
    
            // Verificar si la preparación fue exitosa
            if (!$stmt) {
                throw new Exception("Error en la preparación de la consulta: " . $conexionAbierta->error);
            }
    
            // Enlazar parámetros
            $stmt->bind_param("iidss", $ID_Estudiante, $ID_Curso, $Total, $MetodoPago, $Estatus);
    
            // Ejecutar la consulta
            if ($stmt->execute()) {
                // Obtener el resultado
                $resultado = $stmt->get_result();
                if ($row = $resultado->fetch_assoc()) {
                    $ventaId = $row['venta_id'];
                    return $ventaId; // Devolver el ID de la venta
                } else {
                    throw new Exception("Error al obtener el resultado de la función.");
                }
            } else {
                throw new Exception("Error en la ejecución: " . $stmt->error);
            }
        } catch (Exception $e) {
            // Registrar error en el log y devolver mensaje de error al cliente
            error_log("Error al registrar la venta: " . $e->getMessage());
            echo json_encode(["success" => false, "error" => "Error al registrar la venta: " . $e->getMessage()]);
            exit();
        } finally {
            // Liberar recursos y cerrar conexión
            if (isset($stmt)) {
                $stmt->close();
            }
            $conexion->cerrarConexion();
        }
    }

    public static function obtenerCursosComprados($ID_Estudiante) {
        // Crear instancia de la conexión
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        if (!$conexionAbierta) {
            echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos."]);
            exit();
        }
    
        try {
            // Preparar la consulta para obtener los cursos comprados
            $sql = "SELECT * FROM CursosComprados WHERE ID_Curso IN (SELECT ID_Curso FROM Venta WHERE ID_Estudiante = ?)";
    
            $stmt = $conexionAbierta->prepare($sql);
    
            // Verificar si la preparación fue exitosa
            if (!$stmt) {
                throw new Exception("Error en la preparación de la consulta: " . $conexionAbierta->error);
            }
    
            // Enlazar parámetros
            $stmt->bind_param("i", $ID_Estudiante);
            $stmt->execute();
            $result = $stmt->get_result();
    
            $datos = [];
    
            // Verificar si hay resultados y almacenarlos en el array $datos
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $datos[] = $row;
                }
                // Responder con los datos obtenidos
                echo json_encode(["success" => true, "cursos" => $datos]);
            } else {
                // Si no hay cursos comprados, devolver un mensaje adecuado
                echo json_encode(["success" => false, "error" => "No se encontraron cursos comprados."]);
            }
    
            $stmt->close();
        } catch (Exception $e) {
            // Registrar error en el log y devolver mensaje de error al cliente
            error_log("Error al obtener los cursos comprados: " . $e->getMessage());
            echo json_encode(["success" => false, "error" => "Error al obtener los cursos comprados: " . $e->getMessage()]);
        } finally {
            // Liberar recursos y cerrar conexión
            if (isset($stmt)) {
                $stmt->close();
            }
            $conexion->cerrarConexion();
        }
    }
    
}



?>