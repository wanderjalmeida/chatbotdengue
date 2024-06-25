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
            processChatbotResponse(messageText);
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

    let step = 0;
    let userCPF = '';
    let userCEP = '';

    function processChatbotResponse(userInput) {
        let response = '';

        switch (step) {
            case 0:
                response = 'Bem vindo ao atendimento virtual. Informe seu CPF.';
                step++;
                break;
            case 1:
                userCPF = userInput;
                const lastDigitCPF = parseInt(userInput.slice(-1));
                const name = lastDigitCPF % 2 === 0 ? 'João da Silva' : 'Maria de Souza';
                response = `Bem-vindo ${name}. Informe seu CEP.`;
                step++;
                break;
            case 2:
                userCEP = userInput;
                const lastDigitCEP = parseInt(userInput.slice(-1));
                const areaStatus = lastDigitCEP % 2 === 0 ? 'Área sem infecção' : 'Área com infecção num raio de 500 metros';
                response = `${areaStatus}. Você está com sintomas de dengue? (Sim/Não)`;
                step++;
                break;
            case 3:
                if (userInput.toLowerCase() === 'sim') {
                    response = 'Quais sintomas? Febre alta, dores musculares, dores nos olhos, dor de cabeça, machas vermelhas?';
                    step++;
                } else {
                    response = 'Atendimento Encerrado.';
                    step = 0;  // Reset the step for a new interaction
                }
                break;
            case 4:
                response = 'Além dos sintomas acima, tem sintomas de dores abdominais intensa e contínua, vômitos, dificuldade de respirar e letargia? (Sim/Não)';
                step++;
                break;
            case 5:
                if (userInput.toLowerCase() === 'sim') {
                    response = 'Seus sintomas são graves.<br/>Você deverá se dirigir imediatamente até uma central de saúde, mais próximo da sua casa. Seu caso será enviado automaticamente e após comparecer a central será atendido.<br/><br/>Atendimento Encerrado.';
                } else {
                    response = 'Seus sintomas são leves.<br/>Aguarde que em breve será enviado um link para atendimento online com o médico, que passará as orientações necessárias e medicamentos.<br/><br/>Atendimento Encerrado.';
                }
                step = 0;  // Reset the step for a new interaction
                break;
        }

        if (response) {
            const chatbotMessage = {
                type: 'received',
                text: response,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            chatHistory[currentChatId].push(chatbotMessage);
            renderMessages(chatHistory[currentChatId]);
        }
    }

    // Iniciar o atendimento com a primeira mensagem
    const initialMessage = {
        type: 'received',
        text: 'Bem vindo ao atendimento virtual. Informe seu CPF.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    if (currentChatId) {
        chatHistory[currentChatId].push(initialMessage);
        renderMessages(chatHistory[currentChatId]);
    }
});
