document.addEventListener("DOMContentLoaded", () => {
    const resumencursos= document.getElementById("resumencursos");

    // Obtén el usuario desde localStorage
    const usuarioStorage = JSON.parse(localStorage.getItem('usuario'));
    if (!usuarioStorage || !usuarioStorage.ID_User) {
        console.error("No se encontró un usuario válido en localStorage.");
        return;
    }

    const usuario = usuarioStorage.ID_User;

    // Datos a enviar
    const datos = {
        accion: 'login', // Tipo de acción
        usuario: usuario
    };
    const user = JSON.parse(localStorage.getItem('usuario'));
    const ID_User= user.ID_User;
    
    // Realiza la solicitud al backend
    fetch("../Models/VentasI.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Especificar que el contenido es JSON
        },
        body:JSON.stringify({ID_User})
    })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            // Itera sobre los datos y crea filas
            data.forEach(item => {
                const fila = document.createElement("tr");

                // Crea las celdas
                const celdaTitulo = document.createElement("td");
                celdaTitulo.textContent = item.Titulo;

                const celdaCursoEstatus = document.createElement("td");
                celdaCursoEstatus.textContent = item.CursoEstatus;
                
                const celdaCosto= document.createElement("td");
                celdaCosto.textContent = item.Costo;

                const celdaTotalVentas = document.createElement("td");
                celdaTotalVentas.textContent = item.TotalVentas;


                const celdaMetodoPago= document.createElement("td");
                celdaMetodoPago.textContent = item.MetodoPago;

                const celdaPorcentajaEstatus= document.createElement("td");
                celdaPorcentajaEstatus.textContent = item.celdaPorcentajaEstatus;


                // Agrega las celdas a la fila
                fila.appendChild(celdaTitulo);
                fila.appendChild(celdaCursoEstatus);
                fila.appendChild(celdaCosto);
                fila.appendChild(celdaTotalVentas);
                fila.appendChild(celdaMetodoPago);
                fila.appendChild(celdaPorcentajaEstatus);
             
                  
                // Agrega la fila a la tabla
                resumencursos.appendChild(fila);
            });
        })
        .catch(error => console.error("Error al obtener los datos:", error));
});
