<?php 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once '../Models/Categoria.php';

    // Obtener la acción desde el POST
    $accion = $_POST['accion'] ?? '';

    // Validar y ejecutar según la acción
    switch ($accion) {
        case 'crearCategoria':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                if (isset($_POST['accion']) && $_POST['accion'] === 'crearCategoria') {
                    // Obtener los datos enviados desde el formulario
                    $tituloCate = $_POST['tituloCate'] ?? null;
                    $descripcion = $_POST['descripcion'] ?? null;
                    $idCreador = $_POST['idCreador'] ?? null;
            
                    // Verificar si los datos son válidos
                    if ($tituloCate && $descripcion && $idCreador) {
                        // Llamar al método de la clase Categoria para crear una nueva categoría
                        $resultado = Categoria::crearCategoria($tituloCate, $descripcion, $idCreador);
            
                        if ($resultado) {
                            // Devolver una respuesta exitosa
                            echo json_encode(['success' => true, 'message' => 'Categoría creada correctamente.']);
                        } else {
                            // Devolver un error si la creación falla
                            echo json_encode(['success' => false, 'error' => 'No se pudo crear la categoría.']);
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

        case 'modificarCategoria':
            // Validar datos del formulario
            $idCategoria = $_POST['idCategoria'] ?? 0;
            $tituloCate = $_POST['tituloCate'] ?? '';
            $descripcion = $_POST['descripcion'] ?? '';

            // Verificar datos obligatorios
            if (empty($idCategoria) || empty($tituloCate)) {
                echo json_encode(["success" => false, "error" => "ID de categoría y título son obligatorios."]);
                exit;
            }

            // Llamar al método del modelo
            $resultado = Categoria::modificarCategoria($idCategoria, $tituloCate, $descripcion);

            // Respuesta
            if ($resultado) {
                echo json_encode(["success" => true, "message" => "Categoría modificada correctamente."]);
            } else {
                echo json_encode(["success" => false, "error" => "No se pudo modificar la categoría."]);
            }
            break;

        case 'eliminarCategoria':
             // Validar datos del formulario
        $idCategoria = $_POST['idCategoria'] ?? 0;

        // Verificar que el ID de la categoría sea válido
        if (empty($idCategoria)) {
            echo json_encode(["success" => false, "error" => "El ID de la categoría es obligatorio."]);
            exit;
        }

        // Llamar al método del modelo para eliminar la categoría
        $resultado = Categoria::eliminarCategoria($idCategoria);

        // Responder con el resultado de la operación
        if ($resultado) {
            echo json_encode(["success" => true, "message" => "Categoría eliminada correctamente."]);
        } else {
            echo json_encode(["success" => false, "error" => "No se pudo eliminar la categoría."]);
    }
            break;

        default:
            echo json_encode(["success" => false, "error" => "Acción no válida o no definida."]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Cuando se hace un GET, obtener todas las categorías

    require_once '../Models/Categoria.php';

    // Llamar al método de la clase Categoria para obtener todas las categorías
    $categorias = Categoria::obtenerCategorias();

    // Verificar si se obtuvieron categorías
    if ($categorias) {
        // Si hay categorías, devolverlas como JSON
        echo json_encode($categorias);
    } else {
        // Si no hay categorías, devolver un error
        echo json_encode(["success" => false, "error" => "No se encontraron categorías."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Método no permitido."]);
}

?>
