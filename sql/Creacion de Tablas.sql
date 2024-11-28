USE BDM_PIA;

CREATE TABLE Usuario (
    ID_User INT PRIMARY KEY AUTO_INCREMENT,
    NombreCompleto VARCHAR(100) NOT NULL,
    Sexo VARCHAR (30) NOT NULL,
    FechaNacimiento DATE NOT NULL,
    imagen_Perfil MEDIUMBLOB,
    Correo VARCHAR(100) NOT NULL UNIQUE,
    Contraseña VARCHAR(255) NOT NULL,
    FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UltimaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IntentosFallidos INT DEFAULT 0,
    Estado VARCHAR (50)  DEFAULT 'Activo',
    Rol VARCHAR (50)  NOT NULL,
    Cuenta_Bancaria VARCHAR (30)
    
);

CREATE TABLE Curso (
    ID_Curso INT AUTO_INCREMENT PRIMARY KEY,
    Titulo VARCHAR(255),
    Costo DECIMAL(10, 2),
    Descripcion TEXT,
    PromedioCal DECIMAL(3, 2),
    RegistroPago DATETIME,
    RegistroGratis DATETIME,
    Estatus ENUM('activo', 'inactivo'),
    FechaCreacion DATETIME,
    ID_Instructor INT,
    ID_CATEGORIA INT,
    FOREIGN KEY (ID_Instructor) REFERENCES Usuario(ID_User),
    FOREIGN KEY (ID_CATEGORIA) REFERENCES Categoría(ID_Categoria)
);

CREATE TABLE Nivel (
    ID_Nivel INT AUTO_INCREMENT PRIMARY KEY,
    ID_Curso INT,
    Video VARCHAR(255),
    Descripcion TEXT,
    FechaCreacion DATETIME,
    CreadorNivel VARCHAR(100), 
    Nivel ENUM ('Basico', 'Intermedio', 'Avanzado'),
    
    FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso)
);

CREATE TABLE Temario (
    ID_Temario INT AUTO_INCREMENT PRIMARY KEY,
    ID_Nivel INT,
    Tema VARCHAR(255),
    Descripcion TEXT,
    LinkRecurso VARCHAR(255),
    PDF_Recurso VARCHAR(255),
    Video VARCHAR(255),
    
    FOREIGN KEY (ID_Nivel) REFERENCES Nivel(ID_Nivel)
);

CREATE TABLE Categoría (
    id_Categoria INT AUTO_INCREMENT PRIMARY KEY,
    TituloCate VARCHAR(255) NOT NULL,
    Descripcion TEXT,
    Creador INT NOT NULL,
    FechaCreacion DATETIME DEFAULT current_timestamp,
  
  FOREIGN KEY (Creador) REFERENCES Usuario(ID_User)
);

CREATE TABLE Kardex (
    ID_Kardex INT AUTO_INCREMENT PRIMARY KEY,
    ID_User INT NOT NULL,
    ID_Curso INT NOT NULL,
    FechaInscripción DATETIME DEFAULT CURRENT_TIMESTAMP,
    UltimaFecha_Acceso DATETIME,
    Fecha_Terminado DATETIME, 
    Estatus ENUM('activo', 'inactivo', 'completado') NOT NULL,
    
    FOREIGN KEY (ID_User) REFERENCES Usuario(ID_User), 
    FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso) 
);

CREATE TABLE Mensaje (
    ID_Mensaje INT AUTO_INCREMENT PRIMARY KEY,
    ID_Emisor INT NOT NULL, 
    ID_Receptor INT NOT NULL,
    Contenido TEXT NOT NULL,
    FechaHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ID_Emisor) REFERENCES Usuario(ID_User),
    FOREIGN KEY (ID_Receptor) REFERENCES Usuario(ID_User)
);

CREATE TABLE Comentario (
    ID_Comentario INT AUTO_INCREMENT PRIMARY KEY,
    ID_Curso INT NOT NULL,
    ID_User INT NOT NULL,
    Contenido TEXT NOT NULL,
    FechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    Calificacion INT CHECK (Calificacion BETWEEN 1 AND 5),
    FechaEliminado DATETIME,
    CausaEliminacion VARCHAR(255), 
    
    FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso),
    FOREIGN KEY (ID_User) REFERENCES Usuario(ID_User)
);


CREATE TABLE Venta (
    ID_Venta INT AUTO_INCREMENT PRIMARY KEY,
    ID_Estudiante INT, 
    ID_Curso INT, 
    Monto DECIMAL(10,2),
    Descuento DECIMAL(5,2),
    Impuesto DECIMAL(5,2), 
    Total DECIMAL(10,2),
    FechaVenta DATETIME,
    MetodoPago VARCHAR(50),
    Estatus VARCHAR(50),
    
    FOREIGN KEY (ID_Estudiante) REFERENCES Usuario(ID_User),
    FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso)
);
