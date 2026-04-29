document.addEventListener("DOMContentLoaded", () => {
    const botaoRetornar = document.getElementById("botao-retornar");

    if (botaoRetornar) {
        botaoRetornar.addEventListener("click", function () {
            alert("Obrigado por me visitar, retornando a página principal");
            window.location.href = "index.html";
        });

        botaoRetornar.addEventListener("mouseenter", () => {
            botaoRetornar.style.cursor = "pointer";
        });
    }

    const chatToggle = document.getElementById("chat-toggle");
    const chatContainer = document.getElementById("chat-container");
    const chatClose = document.getElementById("chat-close");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    if (!chatToggle || !chatContainer || !chatClose || !chatForm || !chatInput || !chatMessages) {
        console.error("Elementos do chatbot não encontrados.");
        return;
    }

    function abrirChat() {
        chatContainer.classList.remove("chat-hidden");
        chatContainer.setAttribute("aria-hidden", "false");
        chatInput.focus();
    }

    function fecharChat() {
        chatContainer.classList.add("chat-hidden");
        chatContainer.setAttribute("aria-hidden", "true");
    }

    function alternarChat() {
        const estaFechado = chatContainer.classList.contains("chat-hidden");

        if (estaFechado) {
            abrirChat();
        } else {
            fecharChat();
        }
    }

    chatToggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        alternarChat();
    });

    chatClose.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        fecharChat();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !chatContainer.classList.contains("chat-hidden")) {
            fecharChat();
        }
    });

    function addMessage(author, text, className = "") {
        const message = document.createElement("div");
        message.classList.add("chat-message");

        if (className) {
            message.classList.add(className);
        }

        message.innerHTML = `<strong>${author}:</strong> ${text}`;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        return message;
    }

    async function sendMessageToApi(text) {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || "Erro na API");
        }

        return data.reply || "Nao foi possivel obter uma resposta no momento.";
    }

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const text = chatInput.value.trim();
        if (!text) return;

        addMessage("Você", text, "user-message");
        chatInput.value = "";
        chatInput.focus();

        const loading = addMessage("IA", "Pensando...", "bot-message");

        try {
            const reply = await sendMessageToApi(text);
            loading.innerHTML = `<strong>IA:</strong> ${reply}`;
        } catch (err) {
            loading.classList.remove("bot-message");
            loading.classList.add("error-message");
            loading.innerHTML = `<strong>Erro:</strong> ${err.message}`;
        }
    });
});