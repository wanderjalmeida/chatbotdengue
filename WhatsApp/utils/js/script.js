document.addEventListener('DOMContentLoaded', () => {
    const chats = document.querySelectorAll('.chat');
    const chatHeaderImg = document.getElementById('chat-header-img');
    const chatHeaderName = document.getElementById('chat-header-name');
    const chatHeaderStatus = document.getElementById('chat-header-status');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.querySelector('.chat-input input');
    const chatSendButton = document.querySelector('.chat-input button');

    let currentChatId = null;
    const chatHistory = {};

    chats.forEach(chat => {
        const chatId = chat.getAttribute('data-name');
        const messages = JSON.parse(chat.getAttribute('data-messages'));
        chatHistory[chatId] = messages;

        chat.addEventListener('click', () => {
            currentChatId = chatId;
            const name = chat.getAttribute('data-name');
            const status = chat.getAttribute('data-status');
            const messages = chatHistory[chatId];

            chatHeaderName.textContent = name;
            chatHeaderStatus.textContent = status;
            chatHeaderImg.src = chat.querySelector('img').src;

            renderMessages(messages);
        });
    });

    chatSendButton.addEventListener('click', () => {
        sendMessage();
    });

    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText !== '' && currentChatId) {
            const newMessage = {
                type: 'sent',
                text: messageText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            chatHistory[currentChatId].push(newMessage);
            renderMessages(chatHistory[currentChatId]);
            chatInput.value = '';
        }
    }

    function renderMessages(messages) {
        chatMessages.innerHTML = '';
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', msg.type);
            messageElement.innerHTML = `
                <p>${msg.text}</p>
                <span class="timestamp">${msg.time}</span>
            `;
            chatMessages.appendChild(messageElement);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
