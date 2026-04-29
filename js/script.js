// =========================
// SEU CÓDIGO ORIGINAL
// =========================

let botaoRetornar = document.getElementById("botao-retornar");

if (botaoRetornar) {
    botaoRetornar.addEventListener("click", function () {
        alert("Obrigado por me visitar, retornando a página principal");
        window.location.href = "index.html";
    });

    botaoRetornar.addEventListener("mouseenter", () => {
        botaoRetornar.style.cursor = "pointer";
    });
}

// =========================
// CHATBOT
// =========================

document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    // Evita erro em páginas que não têm chatbot
    if (!chatForm || !chatInput || !chatMessages) {
        return;
    }

    function addMessage(author, text, className = "") {
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message");

        if (className) {
            messageElement.classList.add(className);
        }

        messageElement.innerHTML = `<strong>${author}:</strong> ${text}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        return messageElement;
    }

    async function sendMessageToApi(message) {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || "Erro ao consultar o assistente.");
        }

        return data.reply || "Nao foi possivel obter uma resposta no momento.";
    }

    chatForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const message = chatInput.value.trim();

        if (!message) return;

        addMessage("Você", message, "user-message");

        chatInput.value = "";
        chatInput.focus();

        const loadingMessage = addMessage("IA", "Pensando...", "bot-message");

        try {
            const reply = await sendMessageToApi(message);
            loadingMessage.innerHTML = `<strong>IA:</strong> ${reply}`;
        } catch (error) {
            loadingMessage.innerHTML = `<strong>Erro:</strong> ${error.message}`;
        }
    });
});