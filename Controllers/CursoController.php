<?php 

require_once('../Models/Cursos.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    

    // Obtener la acción desde el POST
    $accion = $_POST['accion'] ?? '';

    // Validar y ejecutar según la acción
    switch ($accion) {
        case 'crearCurso':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                if (isset($_POST['accion']) && $_POST['accion'] === 'crearCurso') {
                    // Obtener los datos enviados desde el formulario
                    $titulo = $_POST['Titulo'] ?? null;
                    $costo = $_POST['Costo'] ?? null;
                    $descripcion = $_POST['Descripcion'] ?? null;
                    $id_categoria = $_POST['ID_CATEGORIA'] ?? null;
                    $id_instructor = $_POST['ID_Instructor'] ?? null;
                    $duracion = $_POST['Duracion'] ?? null;
                    $imagencurso = isset($_FILES['ImagenCurso']) ? $_FILES['ImagenCurso'] : null;
                
                    // Verificar si los datos son válidos
                    if ($titulo && $costo && $descripcion && $id_categoria && $id_instructor && $duracion && $imagencurso) {
                        // Llamar al método de la clase Curso para crear un nuevo curso
                        $resultado = Curso::crearCurso($titulo, $costo, $descripcion, $id_categoria, $id_instructor, $duracion, $imagencurso);
                
                        if ($resultado) {
                            // Devolver una respuesta exitosa
                            echo json_encode(['success' => true, 'message' => 'Curso creado correctamente.']);
                        } else {
                            // Devolver un error si la creación falla
                            echo json_encode(['success' => false, 'error' => 'No se pudo crear el curso.']);
                        }
                    } else {
                        // Devolver error si faltan datos
                        echo json_encode(['success' => false, 'error' => 'Faltan datos obligatorios.']);
                    }
                } else {
                    // Si no se especifica la acción
                    echo json_encode(['success' => false, 'error' => 'Acción no especificada.']);
                }
            } else {
                // Si no es una solicitud POST
                echo json_encode(['success' => false, 'error' => 'Método no permitido.']);
            }
            break;

        case 'modificarCurso':
            // Lógica para modificar un curso
            break;
    
        case 'eliminarCurso':
            // Lógica para eliminar un curso
              $id_curso = $_POST['id_curso'] ?? 0;

              // Verificar que el ID de la categoría sea válido
              if (empty($id_curso)) {
                  echo json_encode(["success" => false, "error" => "El ID de curso es obligatorio."]);
                  exit;
              }
      
              // Llamar al método del modelo para eliminar la categoría
              $resultado = Curso::eliminarCurso($id_curso);
      
              // Responder con el resultado de la operación
              if ($resultado) {
                  echo json_encode(["success" => true, "message" => "Curso eliminado correctamente."]);
              } else {
                  echo json_encode(["success" => false, "error" => "No se pudo eliminar el curso."]);
              }
            break;
    
        default:
            echo json_encode(["success" => false, "error" => "Acción no válida o no definida."]);
    } 
        
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Obtener el id del instructor de los parámetros GET
        $id_instructor = isset($_GET['id_instructor']) ? $_GET['id_instructor'] : null;
    
        if ($id_instructor) {
            // Llamar al método de la clase Curso para obtener los cursos de ese instructor
            $cursos = Curso::obtenerCursosPorInstructor($id_instructor);
    
            if ($cursos) {
                echo json_encode(['success' => true, 'cursos' => $cursos]);
            } else {
                echo json_encode(['success' => false, 'error' => 'No se encontraron cursos para este instructor.']);
            }
        } else {
            //echo json_encode(['success' => false, 'error' => 'ID del instructor no proporcionado.']);
            $cursos = Curso::obtenerTodosLosCursos();
    
            if ($cursos) {
                echo json_encode(['success' => true, 'cursos' => $cursos]);
            } else {
                echo json_encode(['success' => false, 'error' => 'No se encontraron cursos para este instructor.']);
            }
        }
    }

?>