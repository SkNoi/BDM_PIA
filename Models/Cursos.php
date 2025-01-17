<?php

require_once 'Conexion.php';

class Curso{
    // Atributos
    public $id_curso;
    public $titulo;
    public $costo;
    public $descripcion;
    public $promediocal;
    public $fechacreacion;
    public $id_instructor;
    public $id_categoria;
    public $imagencurso;
    public $duracion;

    private function __construct($id_curso, $titulo, $costo, $descripcion, $promediocal, $fechacreacion, $id_instructor, $id_categoria,
    $imagencurso ,$duracion){
        $this->id_curso = $id_curso;
        $this->titulo = $titulo;
        $this->costo = $costo;
        $this->descripcion = $descripcion;
        $this->promediocal = $promediocal;
        $this->fechacreacion = $fechacreacion;
        $this->id_instructor = $id_instructor;
        $this->id_categoria = $id_categoria;
        $this->imagencurso = $imagencurso;
        $this->duracion = $duracion;
    }

    // Crear un curso
    public static function crearCurso($titulo, $costo, $descripcion, $id_categoria, $id_instructor, $duracion, $imagencurso) { 
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        if (!$conexionAbierta) {
            echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos."]);
            exit();
        }
    
        // Validación de parámetros
        if (empty($titulo) || empty($descripcion) || !is_numeric($costo) || $costo <= 0 || !is_numeric($duracion) || $duracion <= 0) {
            echo json_encode(["success" => false, "error" => "Datos inválidos proporcionados."]);
            exit();
        }
    
        // Procesar imagen a base64 o asignar null
        $imagenBase64 = null;
        if ($imagencurso !== null && isset($imagencurso['tmp_name']) && $imagencurso['size'] > 0) {
            $imagenBase64 = base64_encode(file_get_contents($imagencurso['tmp_name']));
        }
    
        try {
            $sql = "CALL CrearCurso(?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conexionAbierta->prepare($sql);
            $stmt->bind_param("sssiiss", $titulo, $costo, $descripcion, $id_categoria, $id_instructor, $duracion, $imagenBase64);
    
            if ($stmt->execute()) {
                    // Correcto
                echo json_encode(["success" => true, "message" => "Curso creado exitosamente."]);
                exit();

            } else {
                // Capturar errores del procedimiento almacenado
                $error = $stmt->error;
                error_log("Error al crear curso: $error");
                echo json_encode(["success" => false, "error" => "Error al crear el curso: $error"]);
            }
    
            $stmt->close();
        } catch (Exception $e) {
            error_log("Error al crear curso: " . $e->getMessage());
            echo json_encode(["success" => false, "error" => "Error interno del servidor."]);
        } finally {
            $conexion->cerrarConexion();
        }
    }
    
    

    // Modificar un curso existente
    public static function modificarCurso($titulo, $costo, $descripcion, $id_categoria, $duracion, $imagencurso) {
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();

        if (!$conexionAbierta) {
            return false;
        }

        // Comprobar si la imagen de perfil ya está en base64
        if (is_string($imagencurso)) {
            $imagenBase64 = $imagencurso;
        } else if ($imagencurso != null && $imagencurso['tmp_name'] && $imagencurso['size'] > 0) {
            // Convertir la imagen de perfil a base64
            $imagenBase64 = base64_encode(file_get_contents($imagencurso['tmp_name']));
        } else {
            // Si no se detectó una imagen, dejar este campo como null
            $imagenBase64 = null;
        }

        try {
            $sql = "CALL ModificarCategoria(?, ?, ?, ?, ?, ?)";
            $stmt = $conexionAbierta->prepare($sql);
            $stmt->bind_param("iss", $titulo, $costo, $descripcion, $id_categoria, $duracion, $imagenBase64);

            $resultado = $stmt->execute();
            $stmt->close();
            return $resultado;
        } catch (Exception $e) {
            return false;
        } finally {
            $conexion->cerrarConexion();
        }
    }

    // Eliminar un curso existente
    public static function eliminarCurso($id_curso) {
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        if (!$conexionAbierta) {
            return false;
        }
    
        try {
            // Definir la consulta SQL para eliminar el curso
            $sql = "DELETE FROM Curso WHERE ID_Curso = ?";
            $stmt = $conexionAbierta->prepare($sql);
    
            if ($stmt === false) {
                throw new Exception("Error al preparar la consulta SQL.");
            }
    
            // Asociar el parámetro y ejecutar la consulta
            $stmt->bind_param('i', $id_curso);
            $stmt->execute();
    
            // Verificar si la eliminación fue exitosa
            if ($stmt->affected_rows > 0) {
                return true;  // Se eliminó correctamente
            } else {
                return false;  // No se encontró el curso o no se pudo eliminar
            }
        } catch (Exception $e) {
            return false;  // En caso de error
        } finally {
            $conexion->cerrarConexion();
        }
    }

    public static function obtenerCursosPorInstructor($id_instructor) {
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        try {
            if (!$conexionAbierta) {
                throw new Exception("Error al conectar con la base de datos.");
            }
    
            // Consulta SQL para obtener cursos solo del instructor específico
            $sql = "SELECT ID_Curso, Titulo, Costo, Descripcion, PromedioCal, FechaCreacion, Id_Instructor, Id_Categoria, ImagenCurso, Duracion
                    FROM vista_cursos
                    WHERE Id_Instructor = ?";
    
            $stmt = $conexionAbierta->prepare($sql);
            $stmt->bind_param('i', $id_instructor);  // El 'i' indica que es un entero
            $stmt->execute();
            $resultado = $stmt->get_result();
    
            $cursos = [];
            while ($fila = $resultado->fetch_assoc()) {
                $cursos[] = new Curso(
                    $fila['ID_Curso'],
                    $fila['Titulo'],
                    $fila['Costo'],
                    $fila['Descripcion'],
                    $fila['PromedioCal'],
                    $fila['FechaCreacion'],
                    $fila['ID_Instructor'],
                    $fila['ID_CATEGORIA'],
                    $fila['ImagenCurso'],
                    $fila['Duracion']
                );
            }
    
            return $cursos;
    
        } catch (Exception $e) {
            echo "Error en la base de datos: " . $e->getMessage();
            return [];
        } finally {
            $conexion->cerrarConexion();
        }
    }
    
    public static function obtenerTodosLosCursos() {
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        try {
            if (!$conexionAbierta) {
                throw new Exception("Error al conectar con la base de datos.");
            }
    
            // Construir la consulta SQL dinámicamente
            $sql = "SELECT ID_Curso, Titulo, Costo, Descripcion, PromedioCal, FechaCreacion, ID_Instructor, ID_CATEGORIA, ImagenCurso, Duracion
                    FROM vista_cursos";
            $stmt = $conexionAbierta->prepare($sql);
    
            $stmt->execute();
            $resultado = $stmt->get_result();
    
            $cursos = [];
            while ($fila = $resultado->fetch_assoc()) {
                $cursos[] = new Curso(
                    $fila['ID_Curso'],
                    $fila['Titulo'],
                    $fila['Costo'],
                    $fila['Descripcion'],
                    $fila['PromedioCal'],
                    $fila['FechaCreacion'],
                    $fila['ID_Instructor'],
                    $fila['ID_CATEGORIA'],
                    $fila['ImagenCurso'],
                    $fila['Duracion']
                );
            }
    
            return $cursos;
    
        } catch (Exception $e) {
            echo "Error en la base de datos: " . $e->getMessage();
            return [];
        } finally {
            $conexion->cerrarConexion();
        }
    }

    public static function obtenerDetallesCursoPorID($id_curso){
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();

        try {
            if (!$conexionAbierta) {
                throw new Exception("Error al conectar con la base de datos.");
            }

            $sql = "SELECT * 
                    FROM DetallesCursos 
                    WHERE ID_Curso = ?";

            $stmt = $conexionAbierta->prepare($sql);
            $stmt->bind_param('i', $id_curso); // El 'i' indica que es un entero
            $stmt->execute();
            $resultado = $stmt->get_result();

            $detallesCurso = []; // Array para almacenar los resultados

            while ($fila = $resultado->fetch_assoc()) {
                // Agregamos cada fila al array
                $detallesCurso[] = [
                    'ID_Curso' => $fila['ID_Curso'],
                    'Titulo' => $fila['Titulo'],
                    'Costo' => $fila['Costo'],
                    'Descripcion' => $fila['Descripcion'],
                    'Duracion' => $fila['Duracion'],
                    'ImagenCurso' => $fila['ImagenCurso'],
                    'ID_Nivel' => $fila['ID_Nivel'],
                    'Nivel' => $fila['Nivel'],
                    'Tema' => $fila['Tema']
                ];
            }
    
            return $detallesCurso; // Retornamos el array con los datos
    


        } catch (Exception $e) {
            echo "Error en la base de datos: " . $e->getMessage();
            return null;
        }finally {
            $conexion->cerrarConexion();
        }
        
    }

    public static function obtenerCursoCompletoporID($id_curso) {
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        try {
            if (!$conexionAbierta) {
                throw new Exception("Error al conectar con la base de datos.");
            }
    
            $sql = "SELECT * 
                    FROM CursoCompleto
                    WHERE ID_Curso = ?";
    
            $stmt = $conexionAbierta->prepare($sql);
            $stmt->bind_param('i', $id_curso); // 'i' indica que es un entero
            $stmt->execute();
            $resultado = $stmt->get_result();
    
            $cursoGeneral = null; // Información general del curso
            $niveles = []; // Niveles y temarios
    
            while ($fila = $resultado->fetch_assoc()) {
                // Información general del curso (solo se asigna una vez)
                if (!$cursoGeneral) {
                    $cursoGeneral = [
                        'ID_Curso' => $fila['ID_Curso'],
                        'Titulo' => $fila['Titulo'],
                        'Costo' => $fila['Costo'],
                        'Duracion' => $fila['Duracion'],
                        'ImagenCurso' => $fila['ImagenCurso']
                    ];
                }
    
                // Agrupamos niveles y temarios
                $idNivel = $fila['ID_Nivel'];
                if (!isset($niveles[$idNivel])) {
                    $niveles[$idNivel] = [
                        'ID_Nivel' => $fila['ID_Nivel'],
                        'Nivel' => $fila['Nivel'],
                        'Temarios' => []
                    ];
                }
    
                // Agregamos los temarios al nivel correspondiente
                $niveles[$idNivel]['Temarios'][] = [
                    'Tema' => $fila['Tema'],
                    'Descripcion' => $fila['Descripcion'],
                    'LinkRecurso' => $fila['LinkRecurso'],
                    'PDF_Recurso' => $fila['PDF_Recurso'],
                    'Video' => $fila['Video']
                ];
            }
    
            // Convertir niveles en una lista indexada
            $nivelesList = array_values($niveles);
    
            return [
                'curso' => $cursoGeneral,
                'niveles' => $nivelesList
            ];
    
        } catch (Exception $e) {
            echo "Error en la base de datos: " . $e->getMessage();
            return null;
        } finally {
            $conexion->cerrarConexion();
        }
    }
    

    public static function obtenerCursoPorId($id_curso) {
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        try {
            if (!$conexionAbierta) {
                throw new Exception("Error al conectar con la base de datos.");
            }
    
            // Consulta SQL para obtener los detalles del curso específico
            $sql = "SELECT ID_Curso, Titulo, Costo, Descripcion, PromedioCal, FechaCreacion, Id_Instructor, Id_Categoria, ImagenCurso, Duracion
                    FROM vista_cursos
                    WHERE ID_Curso = ?";
    
            $stmt = $conexionAbierta->prepare($sql);
            $stmt->bind_param('i', $id_curso); // El 'i' indica que es un entero
            $stmt->execute();
            $resultado = $stmt->get_result();
    
            if ($fila = $resultado->fetch_assoc()) {
                return new Curso(
                    $fila['ID_Curso'],
                    $fila['Titulo'],
                    $fila['Costo'],
                    $fila['Descripcion'],
                    $fila['PromedioCal'],
                    $fila['FechaCreacion'],
                    $fila['ID_Instructor'],
                    $fila['ID_CATEGORIA'],
                    $fila['ImagenCurso'],
                    $fila['Duracion']
                );
            } else {
                return null; // No se encontró el curso
            }
        } catch (Exception $e) {
            echo "Error en la base de datos: " . $e->getMessage();
            return null;
        } finally {
            $conexion->cerrarConexion();
        }
    }
    
    public static function obtenerCursosConFiltros($termino = '', $categoria = '', $calificacion = '') {
        $conexion = Conexion::instanciaConexion();
        $conexionAbierta = $conexion->abrirConexion();
    
        try {
            if (!$conexionAbierta) {
                throw new Exception("Error al conectar con la base de datos.");
            }
    
            // Construir la consulta SQL con filtros dinámicos
            $sql = "SELECT ID_Curso, Titulo, Costo, Descripcion, PromedioCal, FechaCreacion, ID_Instructor, ID_CATEGORIA, ImagenCurso, Duracion
                    FROM vista_cursos WHERE 1=1"; // Añadimos un WHERE general para agregar condiciones dinámicas
    
            // Filtro por término de búsqueda (puede ser parte del título o descripción)
            if ($termino) {
                $sql .= " AND (Titulo LIKE ? OR Descripcion LIKE ?)";
            }
    
            // Filtro por categoría
            if ($categoria) {
                $sql .= " AND ID_CATEGORIA = ?";
            }
    
            // Filtro por calificación
            if ($calificacion) {
                $sql .= " AND PromedioCal >= ?";
            }
    
            // Preparamos la consulta
            $stmt = $conexionAbierta->prepare($sql);
    
            // Enlazamos los parámetros de búsqueda
            $types = '';
            $params = [];
    
            if ($termino) {
                $types .= 'ss'; // 'ss' para dos cadenas (Título y Descripción)
                $params[] = '%' . $termino . '%'; // Búsqueda parcial
                $params[] = '%' . $termino . '%';
            }
    
            if ($categoria) {
                $types .= 'i'; // 'i' para un entero (ID_CATEGORIA)
                $params[] = $categoria;
            }
    
            if ($calificacion) {
                $types .= 'i'; // 'i' para un entero (calificación mínima)
                $params[] = $calificacion;
            }
    
            // Enlazamos los parámetros
            if ($types) {
                $stmt->bind_param($types, ...$params);
            }
    
            // Ejecutamos la consulta
            $stmt->execute();
            $resultado = $stmt->get_result();
    
            // Procesamos los resultados
            $cursos = [];
            while ($fila = $resultado->fetch_assoc()) {
                $cursos[] = new Curso(
                    $fila['ID_Curso'],
                    $fila['Titulo'],
                    $fila['Costo'],
                    $fila['Descripcion'],
                    $fila['PromedioCal'],
                    $fila['FechaCreacion'],
                    $fila['ID_Instructor'],
                    $fila['ID_CATEGORIA'],
                    $fila['ImagenCurso'],
                    $fila['Duracion']
                );
            }
    
            return $cursos;
    
        } catch (Exception $e) {
            echo "Error en la base de datos: " . $e->getMessage();
            return [];
        } finally {
            $conexion->cerrarConexion();
        }
    }
    
    
      
    
}

?>