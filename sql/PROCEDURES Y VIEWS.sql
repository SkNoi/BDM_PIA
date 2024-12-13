
//TABLA USUARIO//
DELIMITER //

CREATE PROCEDURE ActualizarUsuario(
    IN p_ID_User INT,
    IN p_NombreCompleto VARCHAR(100),
    IN p_Sexo VARCHAR(30),
    IN p_FechaNacimiento DATE,
    IN p_Correo VARCHAR(100),
    IN p_Contraseña VARCHAR(255),
    IN p_ImagenPerfil MEDIUMBLOB
)
BEGIN
    -- Actualizar los datos del usuario en la tabla Usuario
    UPDATE Usuario
    SET 
        NombreCompleto = p_NombreCompleto,
        Sexo = p_Sexo,
        FechaNacimiento = p_FechaNacimiento,
        Correo = p_Correo,
        Contraseña = p_Contraseña,
        imagen_Perfil = p_ImagenPerfil,
        UltimaActualizacion = CURRENT_TIMESTAMP
    WHERE 
        ID_User = p_ID_User;
END //

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE RegistrarUsuario (
    IN p_NombreCompleto VARCHAR(100),
    IN p_Sexo VARCHAR (30),
    IN p_FechaNacimiento DATE,
    IN p_imagen_Perfil MEDIUMBLOB,
    IN p_Correo VARCHAR(100),
    IN p_Contraseña VARCHAR(255),
    IN p_Rol VARCHAR (50),
    IN p_Cuenta_Bancaria VARCHAR(30)
)
BEGIN
    -- Verifica si el correo ya está registrado
    IF EXISTS (SELECT 1 FROM Usuario WHERE Correo = p_Correo) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El correo ya está registrado';
    ELSE
        -- Inserta el nuevo usuario
        INSERT INTO Usuario (
            NombreCompleto, Sexo, FechaNacimiento, imagen_Perfil, Correo, Contraseña, Rol, Cuenta_Bancaria
        ) 
        VALUES (
            p_NombreCompleto, p_Sexo, p_FechaNacimiento, p_imagen_Perfil, p_Correo, p_Contraseña, p_Rol, p_Cuenta_Bancaria
        );
    END IF;
END$$

DELIMITER ;


DELIMITER //

CREATE PROCEDURE VerificarEstadoCuenta(IN p_Correo VARCHAR(100))
BEGIN
    DECLARE estado VARCHAR(50);

    -- Obtener el estado de la cuenta
    SELECT Estado
    INTO estado
    FROM Usuario
    WHERE Correo = p_Correo;

    -- Verificar si la cuenta está deshabilitada
    IF estado = 'deshabilitado' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tu cuenta está deshabilitada.';
    END IF;
END //

DELIMITER ;

DELIMITER //
CREATE PROCEDURE ObtenerCredenciales(
    IN correoInput VARCHAR(255), 
    IN contrasenaInput VARCHAR(255)
)
BEGIN
    DECLARE intentos INT;

    -- Obtener datos del usuario
    SELECT IntentosFallidos, Estado, Contraseña 
    INTO intentos, @estado, @contraseña 
    FROM Usuario
    WHERE Correo = correoInput;

    -- Verificar si la cuenta está deshabilitada
    IF @estado = 'deshabilitado' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tu cuenta está deshabilitada.';
    END IF;

    -- Verificar la contraseña
    IF contrasenaInput = @contraseña THEN
        -- Restablecer intentos fallidos
        UPDATE Usuario SET IntentosFallidos = 0 WHERE Correo = correoInput;
        SELECT * FROM Usuario WHERE Correo = correoInput;
    ELSE
        -- Incrementar intentos fallidos
        SET intentos = intentos + 1;
        UPDATE Usuario SET IntentosFallidos = intentos WHERE Correo = correoInput;

        -- Deshabilitar la cuenta si los intentos fallidos llegan a 3
        IF intentos >= 3 THEN
            UPDATE Usuario SET Estado = 'deshabilitado' WHERE Correo = correoInput;
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tu cuenta ha sido deshabilitada después de 3 intentos fallidos.';
        END IF;

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Credenciales incorrectas.';
    END IF;
END //
DELIMITER ;



DELIMITER //

CREATE PROCEDURE DeshabilitarCuenta(IN p_correo VARCHAR(255))
BEGIN
    -- Actualizar el estado del usuario a 'Deshabilitado'
    UPDATE Usuario
    SET Estado = 'deshabilitado'
    WHERE Correo = p_correo;
END//

DELIMITER ;

CREATE VIEW vista_login AS
SELECT
    ID_User,
    NombreCompleto,
    Correo,
    Contraseña,
    Rol,
    Estado,
    FechaNacimiento,
    imagen_Perfil,
    Sexo
FROM
    Usuario;

//TABLA CATEGORIA//

DELIMITER $$

CREATE PROCEDURE CrearCategoria(IN tituloCate VARCHAR(255), IN descripcion TEXT, IN idCreador INT)
BEGIN
    INSERT INTO Categoría (TituloCate, Descripcion, Creador)
    VALUES (tituloCate, descripcion, idCreador);
END $$

DELIMITER ;

//TABLA CURSO//

DELIMITER $$

CREATE PROCEDURE CrearCurso(
    IN p_Titulo VARCHAR(255),
    IN p_Costo DECIMAL(10, 2),
    IN p_Descripcion TEXT,
    IN p_ID_Categoria INT,
    IN p_ID_Instructor INT,
    IN p_Duracion INT,
    IN p_ImagenCurso MEDIUMBLOB
)
BEGIN
    -- Verifica que el instructor especificado exista
    IF (SELECT COUNT(*) FROM Usuario WHERE ID_User = p_ID_Instructor) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El instructor especificado no existe.';
    END IF;

    -- Verifica que la categoría especificada exista
    IF (SELECT COUNT(*) FROM Categoria WHERE ID_Categoria = p_ID_Categoria) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La categoría especificada no existe.';
    END IF;

    INSERT INTO Curso (
        Titulo, 
        Costo, 
        Descripcion,
        ID_Instructor, 
        ID_CATEGORIA, 
        Duracion, 
        ImagenCurso
    ) VALUES (
        p_Titulo, 
        p_Costo, 
        p_Descripcion,
        p_ID_Instructor, 
        p_ID_Categoria, 
        p_Duracion, 
        p_ImagenCurso
    );
END$$

DELIMITER ;


CREATE VIEW vista_cursos AS
SELECT 
    ID_Curso,
    Titulo,
    Costo,
    Descripcion,
    PromedioCal,
    FechaCreacion,
    ID_Instructor,
    ID_CATEGORIA,
    Duracion,
    ImagenCurso
FROM 
    curso;

//TABLA NIVEL//
DELIMITER //

CREATE PROCEDURE CrearNivel(
    IN p_ID_Curso INT,
    IN p_VideoPath VARCHAR(255),
    IN p_Descripcion TEXT,
    IN p_Nivel INT
)
BEGIN
    INSERT INTO nivel (ID_Curso, Video, Descripcion, Nivel)
    VALUES (p_ID_Curso, p_VideoPath, p_Descripcion, p_Nivel);
END//

DELIMITER ;

CREATE VIEW VistaNiveles AS
SELECT 
    n.ID_Nivel,
    n.Descripcion,
    n.Nivel,
    c.Titulo AS Curso
FROM 
    Niveles n
INNER JOIN 
    Cursos c ON n.ID_Curso = c.ID_Curso;

//TABLA TEMARIO//
DELIMITER //

CREATE PROCEDURE InsertarTemario(
    IN p_ID_Nivel INT,
    IN p_Tema VARCHAR(255),
    IN p_Descripcion TEXT,
    IN p_LinkRecurso VARCHAR(255),
    IN p_PDF_Recurso VARCHAR(255),
    IN p_Video VARCHAR(255)
)
BEGIN
    INSERT INTO temario (ID_Nivel, Tema, Descripcion, LinkRecurso, PDF_Recurso, Video)
    VALUES (p_ID_Nivel, p_Tema, p_Descripcion, p_LinkRecurso, p_PDF_Recurso, p_Video);
END //

DELIMITER ;


CREATE VIEW DetallesCursos AS
SELECT 
    C.ID_Curso,
    C.Titulo,
    C.Costo,
    C.Descripcion,
    C.Duracion,
    C.ImagenCurso,
    N.ID_Nivel,
    N.Nivel,
    T.Tema
FROM Curso C
INNER JOIN Nivel N ON C.ID_Curso = N.ID_Curso
INNER JOIN Temario T ON N.ID_Nivel = T.ID_Nivel;

CREATE VIEW CursosComprados AS
SELECT 
    c.ID_Curso,
    c.Titulo,
    c.Descripcion,
    c.ImagenCurso
FROM 
    Venta v
INNER JOIN 
    Curso c
ON 
    v.ID_Curso = c.ID_Curso;

    DELIMITER //

CREATE FUNCTION registrarVenta(
    p_ID_Estudiante INT,
    p_ID_Curso INT,
    p_Total DECIMAL(10, 2),
    p_MetodoPago VARCHAR(50),
    p_Estatus VARCHAR(50)
) RETURNS INT
BEGIN
    DECLARE venta_id INT;
    
    INSERT INTO Venta (
        ID_Estudiante, ID_Curso, Total, FechaVenta, MetodoPago, Estatus
    ) VALUES (
        p_ID_Estudiante, p_ID_Curso, p_Total, current_timestamp(), p_MetodoPago, p_Estatus
    );
    
    SET venta_id = LAST_INSERT_ID();
    RETURN venta_id;
END//

DELIMITER ;

CREATE VIEW CursoCompleto AS
SELECT 
    C.ID_Curso,
    C.Titulo,
    C.Costo,
    C.Duracion,
    C.ImagenCurso,
    N.ID_Nivel,
    N.Nivel,
    T.Tema,
    T.Descripcion,
    T.LinkRecurso,
    T.PDF_Recurso,
    T.Video
FROM Curso C
INNER JOIN Nivel N ON C.ID_Curso = N.ID_Curso
INNER JOIN Temario T ON N.ID_Nivel = T.ID_Nivel;

CREATE  PROCEDURE GetInstructorCursos(
    IN ID_Uses INT
)
BEGIN
    -- Crear una tabla temporal para almacenar los detalles de los cursos y alumnos
    CREATE TEMPORARY TABLE TempCourseDetails AS
    SELECT 
        c.ID_Curso,
        c.Titulo,
        c.Estatus AS CursoEstatus,
        c.Costo,
        u.Nombre_Completo AS AlumnoNombre,
        v.FechaVenta AS FechaInscripcion,
        -- Calcular el porcentaje de avance basado en v.Estatus
        ROUND(SUM(v.Estatus) / COUNT(v.Estatus) * 100, 2) AS PorcentajeEstatus,
        v.MontoPagado,
        v.MetodoPago,
        -- Calcular el total de ingresos por curso
        SUM(v.MontoPagado) OVER (PARTITION BY c.ID_Curso) AS TotalIngresos
    FROM 
        Curso c
    LEFT JOIN 
        Venta v ON c.ID_Curso = v.ID_Curso
    LEFT JOIN 
        Usuario u ON v.ID_Alumno = u.id_User
    WHERE 
        c.ID_Instructor = ID_Uses
    GROUP BY 
        c.ID_Curso, 
        u.Nombre_Completo, 
        v.FechaVenta, 
        v.MontoPagado, 
        v.MetodoPago;

    -- Devolver los resultados
    SELECT 
        ID_Curso,
        Titulo,
        CursoEstatus,
        Costo,
        AlumnoNombre,
        FechaInscripcion,
        PorcentajeEstatus,
        MontoPagado,
        MetodoPago,
        TotalIngresos
    FROM 
        TempCourseDetails;

    -- Eliminar la tabla temporal
    DROP TEMPORARY TABLE IF EXISTS TempCourseDetails;
END$$
DELIMITER ;