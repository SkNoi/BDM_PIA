let isVendedor = true; // Cambia a false para probar como comprador
let cotizado = false;

document.addEventListener("DOMContentLoaded", () => {
    if (isVendedor) {
        document.getElementById("quantity").disabled = false;
        document.getElementById("price").disabled = false;
    } 
});

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


