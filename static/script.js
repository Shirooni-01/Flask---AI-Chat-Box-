const form = document.getElementById("chat-form");
const input = document.getElementById("user_input");
const chatBox = document.getElementById("chat-box");
const newChatBtn = document.getElementById("new-chat-btn");

function addMessage(text, sender) {

    const message = document.createElement("div");
    message.classList.add("message", sender);

    message.innerHTML = text;

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;
}

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const message = input.value.trim();

    if (message === "") return;

    // Show user's message
    addMessage(message, "user");

    input.value = "";
    input.focus();

    // AI Typing...
    const typing = document.createElement("div");
    typing.classList.add("message", "ai");
    typing.id = "typing";
    typing.innerHTML = "🤖 AI is typing...";

    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_input: message
            })
        });

        const data = await response.json();

        typing.remove();

        addMessage(data.response, "ai");

    } catch (error) {

        typing.remove();

        addMessage(
            "❌ Sorry! The AI is currently unavailable. Please try again.",
            "ai"
        );

        console.error(error);
    }

});

newChatBtn.addEventListener("click", function () {

    chatBox.innerHTML = "";

    input.value = "";

    input.focus();

});

newChatBtn.addEventListener("click", function () {

    chatBox.innerHTML = "";

    addMessage("👋 Hello! I'm your AI assistant. How can I help you today?", "ai");

    input.value = "";

    input.focus();

});

window.onload = function () {
    addMessage("👋 Hello! I'm your AI assistant. How can I help you today?", "ai");
};