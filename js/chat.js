let isVendedor = true; // Cambia a false para probar como comprador
let cotizado = false;

document.addEventListener("DOMContentLoaded", () => {
    usuario();
    if (isVendedor) {
        document.getElementById("quantity").disabled = false;
        document.getElementById("price").disabled = false;
    } 


});

function usuario(){
 // Suponiendo que tienes un dato en localStorage llamado "usuario"
 const usuario = localStorage.getItem('usuario') || 'valor_por_defecto';
var id=usuario.ID_User;
 // Enviar el dato al servidor mediante fetch
 fetch('guardar_sesion.php', {
     method: 'POST',
     headers: {
         'Content-Type': 'application/json'
     },
     body: JSON.stringify({ id })
 })
 .then(response => response.json())
 .then(data => {
     console.log(data.message); // Confirmación desde el servidor
 })
 .catch(error => console.error('Error:', error));

}


function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    if (userInput.value.trim() !== "") {
        const newMessage = document.createElement("div");
        newMessage.classList.add("message", isVendedor ? "vendor" : "buyer");
        newMessage.innerHTML = `<p>${userInput.value}</p>`;
        chatBox.appendChild(newMessage);
        userInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}


