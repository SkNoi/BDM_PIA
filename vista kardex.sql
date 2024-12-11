CREATE VIEW vista_Kardex AS
SELECT 
    ID_Kardex,
    ID_User,
    ID_Curso,
    FechaInscripción,
    UltimaFecha_Acceso,
    Fecha_Terminado,
    Estatus
FROM 
    Kardex;