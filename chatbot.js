/**
 * Enhanced AI Assistant Bot for Zentrium AI
 * This script provides a more advanced chatbot with improved context awareness,
 * natural language processing capabilities, and a more engaging user experience.
 */

class ZentriumAIAssistant {
    constructor() {
        // DOM Elements
        this.chatbotToggle = document.getElementById('chatbot-toggle');
        this.chatbotContainer = document.getElementById('chatbot-container');
        this.chatbotClose = document.getElementById('chatbot-close');
        this.chatbotInput = document.getElementById('chatbot-input-field');
        this.chatbotSend = document.getElementById('chatbot-send');
        this.chatbotMessages = document.getElementById('chatbot-messages');

        // Bot state
        this.context = {
            conversationHistory: [],
            lastTopic: null,
            userInfo: {
                name: null,
                email: null,
                interest: null,
                company: null,
                location: null
            },
            suggestedResponses: [],
            sentiment: 'neutral',
            intentConfidence: 0,
            sessionDuration: 0,
            messageCount: 0,
            lastInteraction: Date.now()
        };

        // Knowledge base for improved responses
        this.knowledgeBase = {
            services: [
                { name: "Workflow Automation", description: "AI-powered automation of business processes to save time and reduce errors." },
                { name: "Document Processing", description: "Extract insights from unstructured data using advanced NLP techniques." },
                { name: "Custom AI Agents", description: "Tailored AI assistants designed for your specific business needs." },
                { name: "Predictive Analytics", description: "Make data-driven decisions with our advanced forecasting models." }
            ],
            pricing: [
                { plan: "Starter", price: "Custom pricing", features: ["Basic automation", "Document processing (up to 100 pages/month)", "Email support"] },
                { plan: "Professional", price: "Custom pricing", features: ["Advanced automation", "Document processing (up to 1000 pages/month)", "Custom AI agent", "Priority support"] },
                { plan: "Enterprise", price: "Custom pricing", features: ["Full suite of services", "Unlimited document processing", "Multiple custom AI agents", "Dedicated support manager"] }
            ],
            faqs: [
                { question: "How long does implementation take?", answer: "Implementation typically takes 2-4 weeks depending on the complexity of your requirements." },
                { question: "Do you offer a trial period?", answer: "Yes, we offer a 14-day free trial for our Starter and Professional plans." },
                { question: "What industries do you serve?", answer: "We work with clients across various industries including healthcare, finance, legal, retail, and manufacturing." }
            ]
        };

        // NLP patterns for intent recognition
        this.patterns = {
            greeting: /\b(hi|hello|hey|greetings|howdy|good (morning|afternoon|evening))\b/i,
            farewell: /\b(bye|goodbye|see you|talk to you later|until next time)\b/i,
            thanks: /\b(thanks|thank you|appreciate it|grateful)\b/i,
            services: /\b(services|solutions|offerings|products|what (do|can) you (do|offer)|how can you help)\b/i,
            pricing: /\b(pricing|cost|price|how much|packages|plans|subscription)\b/i,
            contact: /\b(contact|reach|talk to|connect with|speak to someone|representative)\b/i,
            booking: /\b(book|schedule|appointment|consultation|meeting|call|demo)\b/i,
            help: /\b(help|assist|support|guidance)\b/i,
            company: /\b(about|company|team|who are you|zentrium)\b/i
        };

        // Initialize the chatbot
        this.init();

        // Session timer
        this.sessionTimer = setInterval(() => {
            if (this.chatbotContainer.classList.contains('active')) {
                this.context.sessionDuration += 1;
            }
        }, 1000);
    }

    init() {
        // Add event listeners
        this.addEventListeners();

        // Load conversation history from localStorage if available
        this.loadConversationHistory();

        // Initialize speech recognition if available
        this.initSpeechRecognition();

        // Check if we need to add initial messages
        this.checkAndAddInitialMessages();

        console.log('Zentrium AI Assistant initialized');
    }

    checkAndAddInitialMessages() {
        // Remove loading message if it exists
        const loadingMessage = this.chatbotMessages.querySelector('.loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }

        // Only add initial messages if there's no conversation history
        if (this.context.conversationHistory.length === 0) {
            // Clear any existing messages in the DOM
            this.chatbotMessages.innerHTML = '';

            // Add initial welcome messages
            this.addBotMessage("👋 Hi there! I'm the Zentrium AI Assistant. How can I help you today?");

            setTimeout(() => {
                this.addBotMessage("I can help you with:<br>• Information about our AI solutions<br>• Pricing and packages<br>• Booking a consultation<br>• Technical questions<br>• Connecting with our team");

                setTimeout(() => {
                    this.addBotMessage("Just type your question below to get started!");

                    // Add suggested initial responses
                    this.context.suggestedResponses = [
                        "Tell me about your services",
                        "What are your pricing options?",
                        "I'd like to book a consultation"
                    ];

                    setTimeout(() => {
                        this.addSuggestedResponses();
                    }, 500);
                }, 500);
            }, 500);
        } else {
            // If we have conversation history, just make sure the DOM reflects it
            this.chatbotMessages.innerHTML = '';

            // Add the last 10 messages from history to avoid cluttering the UI
            const recentMessages = this.context.conversationHistory.slice(-10);
            recentMessages.forEach(msg => {
                if (msg.role === 'user') {
                    const userMessageHTML = `
                        <div class="message user-message">
                            <div class="message-content">
                                <p>${this.escapeHTML(msg.message)}</p>
                            </div>
                            <div class="message-time">${this.formatTime(new Date(msg.timestamp))}</div>
                        </div>
                    `;
                    this.chatbotMessages.insertAdjacentHTML('beforeend', userMessageHTML);
                } else {
                    const botMessageHTML = `
                        <div class="message bot-message">
                            <div class="message-content">
                                <p>${msg.message}</p>
                            </div>
                            <div class="message-time">${this.formatTime(new Date(msg.timestamp))}</div>
                        </div>
                    `;
                    this.chatbotMessages.insertAdjacentHTML('beforeend', botMessageHTML);
                }
            });

            // Scroll to bottom
            this.scrollToBottom();
        }
    }

    initSpeechRecognition() {
        try {
            // Check if browser supports speech recognition
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                // Create speech recognition instance
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.recognition = new SpeechRecognition();

                // Configure speech recognition
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-US';

                // Add voice input button to chatbot
                this.addVoiceInputButton();

                // Set up speech recognition event handlers
                this.recognition.onresult = (event) => {
                    try {
                        const transcript = event.results[0][0].transcript;
                        this.chatbotInput.value = transcript;
                        this.sendMessage();
                    } catch (error) {
                        console.error('Error processing speech result:', error);
                    }
                };

                this.recognition.onerror = (event) => {
                    console.error('Speech recognition error', event.error);
                    // Show error message to user
                    if (event.error === 'not-allowed') {
                        this.addBotMessage("I need permission to access your microphone to use voice input. Please enable microphone access in your browser settings.");
                    } else {
                        this.addBotMessage("Sorry, I couldn't hear you. Please try again or type your message.");
                    }
                };

                // Add onend handler to reset recording state if it ends unexpectedly
                this.recognition.onend = () => {
                    if (this.isRecording) {
                        this.isRecording = false;
                        const voiceButton = document.getElementById('chatbot-voice');
                        if (voiceButton) {
                            voiceButton.classList.remove('recording');
                            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                        }
                    }
                };

                console.log('Speech recognition initialized');
            } else {
                console.log('Speech recognition not supported in this browser');
            }
        } catch (error) {
            console.error('Error initializing speech recognition:', error);
        }
    }

    addVoiceInputButton() {
        // Create voice input button
        const voiceButton = document.createElement('button');
        voiceButton.type = 'button';
        voiceButton.id = 'chatbot-voice';
        voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceButton.title = 'Speak your message';
        voiceButton.className = 'chatbot-voice-btn';

        // Add button to chatbot input area
        const chatbotInputArea = document.querySelector('.chatbot-input');
        if (chatbotInputArea) {
            chatbotInputArea.insertBefore(voiceButton, this.chatbotSend);

            // Add event listener
            voiceButton.addEventListener('click', () => {
                // Toggle recording state
                if (this.isRecording) {
                    this.stopRecording();
                } else {
                    this.startRecording();
                }
            });
        }
    }

    startRecording() {
        if (this.recognition) {
            try {
                this.recognition.start();
                this.isRecording = true;

                // Update UI to show recording state
                const voiceButton = document.getElementById('chatbot-voice');
                if (voiceButton) {
                    voiceButton.classList.add('recording');
                    voiceButton.innerHTML = '<i class="fas fa-stop"></i>';
                }

                // Add recording indicator message
                this.addBotMessage("I'm listening... Speak your message.");

                // Stop recording after 10 seconds if no result
                this.recordingTimeout = setTimeout(() => {
                    if (this.isRecording) {
                        this.stopRecording();
                    }
                }, 10000);
            } catch (error) {
                console.error('Error starting speech recognition', error);
            }
        }
    }

    stopRecording() {
        if (this.recognition) {
            try {
                this.recognition.stop();
                this.isRecording = false;

                // Update UI to show normal state
                const voiceButton = document.getElementById('chatbot-voice');
                if (voiceButton) {
                    voiceButton.classList.remove('recording');
                    voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                }

                // Clear timeout
                if (this.recordingTimeout) {
                    clearTimeout(this.recordingTimeout);
                }
            } catch (error) {
                console.error('Error stopping speech recognition', error);
            }
        }
    }

    addEventListeners() {
        // Toggle chatbot visibility
        if (this.chatbotToggle) {
            this.chatbotToggle.addEventListener('click', () => this.toggleChatbot());
        }

        // Close chatbot
        if (this.chatbotClose) {
            this.chatbotClose.addEventListener('click', () => this.closeChatbot());
        }

        // Send message on button click
        if (this.chatbotSend) {
            this.chatbotSend.addEventListener('click', () => {
                this.sendMessage();
                // Add click animation
                this.chatbotSend.classList.add('clicked');
                setTimeout(() => {
                    this.chatbotSend.classList.remove('clicked');
                }, 200);
            });
        }

        // Send message on Enter key
        if (this.chatbotInput) {
            this.chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            // Add typing indicator
            this.chatbotInput.addEventListener('input', () => {
                if (this.chatbotInput.value.trim() !== '') {
                    this.chatbotSend.classList.add('active');
                } else {
                    this.chatbotSend.classList.remove('active');
                }
            });
        }
    }

    toggleChatbot() {
        this.chatbotContainer.classList.toggle('active');

        if (this.chatbotContainer.classList.contains('active')) {
            // Focus input after animation completes
            setTimeout(() => {
                this.chatbotInput.focus();

                // Add typing animation to all initial bot messages
                const botMessages = this.chatbotMessages.querySelectorAll('.bot-message .message-content p');
                botMessages.forEach((message, index) => {
                    setTimeout(() => {
                        message.classList.add('typing-animation');
                        // Remove animation class after it completes
                        setTimeout(() => {
                            message.classList.remove('typing-animation');
                        }, 3000);
                    }, index * 1000); // Stagger animations
                });

                // Scroll to bottom to show all messages
                this.scrollToBottom();

                // Record interaction time
                this.context.lastInteraction = Date.now();
            }, 300);
        }
    }

    closeChatbot() {
        this.chatbotContainer.classList.remove('active');
    }

    sendMessage() {
        const message = this.chatbotInput.value.trim();
        if (message) {
            // Add user message
            this.addUserMessage(message);

            // Clear input
            this.chatbotInput.value = '';

            // Extract user information
            this.extractUserInfo(message);

            // Analyze message intent and sentiment
            this.analyzeMessage(message);

            // Show typing indicator
            this.showTypingIndicator();

            // Generate and send bot response after a delay
            const responseDelay = this.calculateResponseDelay(message);
            setTimeout(() => {
                // Remove typing indicator
                this.removeTypingIndicator();

                // Generate contextual response
                const botResponse = this.generateResponse(message);

                // Add bot response
                this.addBotMessage(botResponse);

                // Add suggested responses if available
                if (this.context.suggestedResponses.length > 0) {
                    setTimeout(() => {
                        this.addSuggestedResponses();
                    }, 1000);
                }

                // Save conversation history
                this.saveConversationHistory();

                // Check for inactivity
                this.checkInactivity();
            }, responseDelay);
        }
    }

    addUserMessage(message) {
        // Increment message count
        this.context.messageCount++;

        // Create message HTML
        const userMessageHTML = `
            <div class="message user-message">
                <div class="message-content">
                    <p>${this.escapeHTML(message)}</p>
                </div>
                <div class="message-time">${this.formatTime(new Date())}</div>
            </div>
        `;

        // Add to DOM
        this.chatbotMessages.insertAdjacentHTML('beforeend', userMessageHTML);

        // Add to conversation history
        this.context.conversationHistory.push({
            role: 'user',
            message: message,
            timestamp: new Date().toISOString()
        });

        // Scroll to bottom
        this.scrollToBottom();

        // Update last interaction time
        this.context.lastInteraction = Date.now();
    }

    addBotMessage(message) {
        try {
            // Create message HTML with typing animation
            // Note: We don't escape HTML here to allow for formatted messages with <br>, <strong>, etc.
            const botMessageHTML = `
                <div class="message bot-message">
                    <div class="message-content">
                        <p class="typing-animation">${message}</p>
                    </div>
                    <div class="message-time">${this.formatTime(new Date())}</div>
                </div>
            `;

            // Add to DOM
            this.chatbotMessages.insertAdjacentHTML('beforeend', botMessageHTML);

            // Add to conversation history
            this.context.conversationHistory.push({
                role: 'bot',
                message: message,
                timestamp: new Date().toISOString()
            });

            // Scroll to bottom
            this.scrollToBottom();

            // Remove typing animation after it completes
            setTimeout(() => {
                const lastBotMessage = this.chatbotMessages.querySelector('.bot-message:last-child .message-content p');
                if (lastBotMessage) {
                    lastBotMessage.classList.remove('typing-animation');
                }
            }, 1500); // Reduced from 3000ms to 1500ms for better user experience
        } catch (error) {
            console.error('Error adding bot message:', error);
            // Fallback to a simpler message if there's an error
            this.chatbotMessages.insertAdjacentHTML('beforeend', `
                <div class="message bot-message">
                    <div class="message-content">
                        <p>I'm sorry, there was an error displaying this message.</p>
                    </div>
                    <div class="message-time">${this.formatTime(new Date())}</div>
                </div>
            `);
            this.scrollToBottom();
        }
    }

    showTypingIndicator() {
        const typingIndicatorHTML = `
            <div class="message bot-message typing-indicator" id="typing-indicator">
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        this.chatbotMessages.insertAdjacentHTML('beforeend', typingIndicatorHTML);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

// Initialize the enhanced chatbot when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for a short delay to ensure all elements are loaded
    setTimeout(() => {
        window.zentriumAI = new ZentriumAIAssistant();
    }, 500);
});
