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

    public static function registrarVenta($ID_Estudiante, $ID_Curso, $Total, $FechaVenta, $MetodoPago, $Estatus) {
        // Crear instancia de la conexión
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        if (!$conexionAbierta) {
            echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos."]);
            exit();
        }
    
        try {
            // Preparar la consulta para llamar a la función MySQL
            $sql = "SELECT registrarVenta(?, ?, ?, ?, ?, ?) AS venta_id";
            $stmt = $conexionAbierta->prepare($sql);
    
            // Verificar si la preparación fue exitosa
            if (!$stmt) {
                throw new Exception("Error en la preparación de la consulta: " . $conexionAbierta->error);
            }
    
            // Enlazar parámetros
            $stmt->bind_param("iidsis", $ID_Estudiante, $ID_Curso, $Total, $FechaVenta, $MetodoPago, $Estatus);
    
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
}



?>