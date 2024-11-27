$(document).ready(function() {
    $.ajax({
        url: 'Controllers/UsuarioController.php',  // Ruta al archivo PHP
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log(response); // Depurar la respuesta para verificar si es JSON válido
            if (response.success) {
                const usuarios = response.usuarios;
                let filas = '';

                usuarios.forEach(function(usuario) {
                    filas += `
                        <tr>
                            <td>${usuario.NombreCompleto}</td>
                            <td>${usuario.Correo}</td>
                            <td><button class="reactivar-btn" data-id="${usuario.ID_User}">Reactivar</button></td>
                        </tr>
                    `;
                });

                $('#usuariosDeshabilitadosBody').html(filas);
            } else {
                $('#usuariosDeshabilitadosBody').html('<tr><td colspan="3">No se encontraron usuarios deshabilitados.</td></tr>');
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al hacer la solicitud:", status, error);
            console.log(xhr.responseText); // Ver el contenido de la respuesta completa
            $('#usuariosDeshabilitadosBody').html('<tr><td colspan="3">Error al cargar los usuarios.</td></tr>');
        }
    });
});
