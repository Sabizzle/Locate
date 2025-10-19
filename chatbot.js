// Chatbot Component for loCATE!
// Mock data implementation with option to connect to API later

class ChatBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.mockResponses = {
            greetings: [
                "Hello! I'm here to help you with loCATE!. How can I assist you today?",
                "Hi there! Need help finding someone or reporting a missing person?",
                "Welcome to loCATE! I'm your virtual assistant. What can I help you with?"
            ],
            report: [
                "To report a missing person, click on the 'Report' button in the navigation menu. You'll need to provide details like name, age, last seen location, and a photo.",
                "I can guide you through reporting a missing person. You'll need to fill out a form with their information and upload a recent photo. Ready to start?"
            ],
            search: [
                "You can search for missing persons by going to the 'View Missing' page. Use filters to narrow down by parish, age, or other criteria.",
                "Our database contains all active missing person cases. Visit the 'Missing Persons' section to browse or search."
            ],
            tips: [
                "If you have information about a missing person, you can submit an anonymous tip by clicking on their case and selecting 'Submit a Tip'.",
                "Tips can be submitted anonymously or with your contact information. All tips are reviewed and shared with relevant authorities."
            ],
            emergency: [
                "For emergencies, please call:\n📞 Police: 119\n📞 Crime Stop: 311\n📞 Fire/Ambulance: 110",
                "In case of emergency, contact the police immediately at 119 or Crime Stop at 311."
            ],
            help: [
                "I can help you with:\n• Reporting a missing person\n• Searching for cases\n• Submitting tips\n• Understanding how loCATE! works\n\nWhat would you like to know more about?"
            ]
        };

        this.init();
    }

    init() {
        this.createChatbotUI();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createChatbotUI() {
        const chatbotHTML = `
            <div id="chatbot-container" class="chatbot-container">
                <!-- Chat Toggle Button -->
                <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Toggle chat">
                    <svg class="chat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span class="notification-badge" id="chat-badge" style="display: none;">1</span>
                </button>

                <!-- Chat Window -->
                <div id="chatbot-window" class="chatbot-window">
                    <!-- Header -->
                    <div class="chatbot-header">
                        <div class="chatbot-header-content">
                            <div class="bot-avatar">🤖</div>
                            <div>
                                <h3>loCATE! Assistant</h3>
                                <p class="bot-status">
                                    <span class="status-indicator"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <button class="minimize-btn" id="minimize-chat">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>

                    <!-- Messages -->
                    <div id="chatbot-messages" class="chatbot-messages">
                        <!-- Messages will be added here -->
                    </div>

                    <!-- Quick Actions -->
                    <div id="quick-actions" class="quick-actions">
                        <button class="quick-action-btn" data-action="report">
                            📢 Report Missing Person
                        </button>
                        <button class="quick-action-btn" data-action="search">
                            🔍 Search Cases
                        </button>
                        <button class="quick-action-btn" data-action="emergency">
                            🚨 Emergency Numbers
                        </button>
                        <button class="quick-action-btn" data-action="help">
                            ℹ️ How it Works
                        </button>
                    </div>

                    <!-- Input -->
                    <div class="chatbot-input-container">
                        <input
                            type="text"
                            id="chatbot-input"
                            class="chatbot-input"
                            placeholder="Type your message..."
                            autocomplete="off"
                        />
                        <button id="chatbot-send" class="chatbot-send-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .chatbot-container {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            }

            .chatbot-toggle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #E65C2A 0%, #ff7844 100%);
                border: none;
                color: white;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(230, 92, 42, 0.4);
                transition: all 0.3s ease;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .chatbot-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(230, 92, 42, 0.5);
            }

            .chatbot-toggle .close-icon {
                display: none;
            }

            .chatbot-toggle.active .chat-icon {
                display: none;
            }

            .chatbot-toggle.active .close-icon {
                display: block;
            }

            .notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #DC3545;
                color: white;
                font-size: 12px;
                font-weight: bold;
                padding: 2px 6px;
                border-radius: 10px;
                animation: pulse 2s ease-in-out infinite;
            }

            .chatbot-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 600px;
                max-height: 80vh;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
                animation: slideUp 0.3s ease-out;
            }

            .chatbot-window.active {
                display: flex;
            }

            .chatbot-header {
                background: linear-gradient(135deg, #0C243C 0%, #1a3a5c 100%);
                color: white;
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chatbot-header-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .bot-avatar {
                width: 40px;
                height: 40px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
            }

            .chatbot-header h3 {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
            }

            .bot-status {
                margin: 0;
                font-size: 0.75rem;
                opacity: 0.9;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .status-indicator {
                width: 8px;
                height: 8px;
                background: #28A745;
                border-radius: 50%;
                animation: pulse 2s ease-in-out infinite;
            }

            .minimize-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                transition: background 0.3s;
            }

            .minimize-btn:hover {
                background: rgba(255,255,255,0.3);
            }

            .chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
                background: #F5F5F5;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .chatbot-messages::-webkit-scrollbar {
                width: 6px;
            }

            .chatbot-messages::-webkit-scrollbar-thumb {
                background: #E0E0E0;
                border-radius: 10px;
            }

            .message {
                display: flex;
                gap: 0.5rem;
                animation: fadeInUp 0.3s ease-out;
            }

            .message.bot {
                align-self: flex-start;
            }

            .message.user {
                align-self: flex-end;
                flex-direction: row-reverse;
            }

            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                flex-shrink: 0;
            }

            .message.bot .message-avatar {
                background: linear-gradient(135deg, #E65C2A 0%, #ff7844 100%);
            }

            .message.user .message-avatar {
                background: linear-gradient(135deg, #0C243C 0%, #1a3a5c 100%);
                color: white;
            }

            .message-content {
                max-width: 70%;
                padding: 0.75rem 1rem;
                border-radius: 12px;
                line-height: 1.5;
                font-size: 0.9rem;
            }

            .message.bot .message-content {
                background: white;
                color: #0C243C;
                border-bottom-left-radius: 4px;
            }

            .message.user .message-content {
                background: linear-gradient(135deg, #E65C2A 0%, #ff7844 100%);
                color: white;
                border-bottom-right-radius: 4px;
            }

            .message-time {
                font-size: 0.7rem;
                opacity: 0.6;
                margin-top: 0.25rem;
            }

            .typing-indicator {
                display: flex;
                gap: 4px;
                padding: 0.75rem 1rem;
                background: white;
                border-radius: 12px;
                width: fit-content;
            }

            .typing-indicator span {
                width: 8px;
                height: 8px;
                background: #E65C2A;
                border-radius: 50%;
                animation: bounce 1.4s ease-in-out infinite;
            }

            .typing-indicator span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-indicator span:nth-child(3) {
                animation-delay: 0.4s;
            }

            .quick-actions {
                padding: 1rem;
                background: white;
                border-top: 1px solid #E0E0E0;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
            }

            .quick-action-btn {
                padding: 0.6rem;
                border: 2px solid #E0E0E0;
                background: white;
                border-radius: 8px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.3s;
                text-align: left;
            }

            .quick-action-btn:hover {
                border-color: #E65C2A;
                background: #FFF5F2;
                transform: translateY(-2px);
            }

            .chatbot-input-container {
                display: flex;
                gap: 0.5rem;
                padding: 1rem;
                background: white;
                border-top: 1px solid #E0E0E0;
            }

            .chatbot-input {
                flex: 1;
                padding: 0.75rem;
                border: 2px solid #E0E0E0;
                border-radius: 25px;
                font-size: 0.9rem;
                outline: none;
                transition: border-color 0.3s;
            }

            .chatbot-input:focus {
                border-color: #E65C2A;
            }

            .chatbot-send-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #E65C2A 0%, #ff7844 100%);
                border: none;
                color: white;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .chatbot-send-btn:hover {
                transform: scale(1.1);
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 0.8;
                }
            }

            @keyframes bounce {
                0%, 80%, 100% {
                    transform: scale(0);
                }
                40% {
                    transform: scale(1);
                }
            }

            @media (max-width: 768px) {
                .chatbot-container {
                    bottom: 1rem;
                    right: 1rem;
                }

                .chatbot-window {
                    width: calc(100vw - 2rem);
                    max-width: 380px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const toggle = document.getElementById('chatbot-toggle');
        const window = document.getElementById('chatbot-window');
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send');
        const minimizeBtn = document.getElementById('minimize-chat');

        toggle.addEventListener('click', () => this.toggleChat());
        minimizeBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Quick actions
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const toggle = document.getElementById('chatbot-toggle');
        const window = document.getElementById('chatbot-window');

        toggle.classList.toggle('active');
        window.classList.toggle('active');

        if (this.isOpen) {
            document.getElementById('chatbot-input').focus();
            document.getElementById('chat-badge').style.display = 'none';
        }
    }

    addMessage(text, isBot = true) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const messageHTML = `
            <div class="message ${isBot ? 'bot' : 'user'}">
                <div class="message-avatar">${isBot ? '🤖' : '👤'}</div>
                <div>
                    <div class="message-content">${text}</div>
                    <div class="message-time">${time}</div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingHTML = `
            <div class="message bot typing-message">
                <div class="message-avatar">🤖</div>
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typing = document.querySelector('.typing-message');
        if (typing) typing.remove();
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const text = input.value.trim();

        if (!text) return;

        this.addMessage(text, false);
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate bot response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.getResponse(text);
            this.addMessage(response, true);
        }, 1000 + Math.random() * 1000);
    }

    getResponse(userMessage) {
        const message = userMessage.toLowerCase();

        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return this.getRandomResponse('greetings');
        } else if (message.includes('report') || message.includes('missing')) {
            return this.getRandomResponse('report');
        } else if (message.includes('search') || message.includes('find')) {
            return this.getRandomResponse('search');
        } else if (message.includes('tip') || message.includes('information')) {
            return this.getRandomResponse('tips');
        } else if (message.includes('emergency') || message.includes('police')) {
            return this.getRandomResponse('emergency');
        } else if (message.includes('help') || message.includes('how')) {
            return this.getRandomResponse('help');
        } else {
            return "I'm here to help with loCATE!. You can ask me about reporting missing persons, searching cases, submitting tips, or emergency contacts. What would you like to know?";
        }
    }

    getRandomResponse(category) {
        const responses = this.mockResponses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    handleQuickAction(action) {
        const responses = {
            report: this.getRandomResponse('report'),
            search: this.getRandomResponse('search'),
            emergency: this.getRandomResponse('emergency'),
            help: this.getRandomResponse('help')
        };

        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addMessage(responses[action], true);
        }, 800);
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addMessage("Welcome to loCATE! I'm here to help you navigate our platform. Feel free to ask me anything or use the quick actions below.", true);
        }, 500);
    }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.chatBot = new ChatBot();
    });
} else {
    window.chatBot = new ChatBot();
}
