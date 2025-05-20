/**
 * Response generation for the Zentrium AI Assistant
 * This file contains methods for generating contextual responses
 */

// Add response generation methods to the ZentriumAIAssistant prototype
ZentriumAIAssistant.prototype.generateResponse = function(message) {
    const messageLower = message.toLowerCase();
    let response = '';

    // Set suggested responses to empty by default
    this.context.suggestedResponses = [];

    // Personalize response if we know the user's name
    const personalizedGreeting = this.context.userInfo.name ?
        `Hi ${this.context.userInfo.name}! ` : '';

    // Check for exact matches first (for common questions)
    const exactResponse = this.getExactResponse(messageLower);
    if (exactResponse) {
        return exactResponse;
    }

    // Generate response based on detected intent
    switch (this.context.lastTopic) {
        case 'greeting':
            response = this.generateGreetingResponse(personalizedGreeting);
            break;
        case 'farewell':
            response = this.generateFarewellResponse(personalizedGreeting);
            break;
        case 'thanks':
            response = this.generateThanksResponse(personalizedGreeting);
            break;
        case 'services':
            response = this.generateServicesResponse(personalizedGreeting, messageLower);
            break;
        case 'pricing':
            response = this.generatePricingResponse(personalizedGreeting, messageLower);
            break;
        case 'contact':
            response = this.generateContactResponse(personalizedGreeting);
            break;
        case 'booking':
            response = this.generateBookingResponse(personalizedGreeting);
            break;
        case 'help':
            response = this.generateHelpResponse(personalizedGreeting);
            break;
        case 'company':
            response = this.generateCompanyResponse(personalizedGreeting);
            break;
        default:
            // Check if we can infer intent from the message content
            if (messageLower.includes('service') || messageLower.includes('offer') || messageLower.includes('do you do')) {
                response = this.generateServicesResponse(personalizedGreeting, messageLower);
            } else if (messageLower.includes('price') || messageLower.includes('cost') || messageLower.includes('how much')) {
                response = this.generatePricingResponse(personalizedGreeting, messageLower);
            } else if (messageLower.includes('contact') || messageLower.includes('email') || messageLower.includes('phone')) {
                response = this.generateContactResponse(personalizedGreeting);
            } else if (messageLower.includes('book') || messageLower.includes('appointment') || messageLower.includes('schedule')) {
                response = this.generateBookingResponse(personalizedGreeting);
            } else {
                // Default response
                response = this.generateDefaultResponse(personalizedGreeting);
            }
    }

    return response;
};

ZentriumAIAssistant.prototype.getExactResponse = function(messageLower) {
    // Check for exact matches to common questions
    const exactMatches = {
        'what is ai': 'AI (Artificial Intelligence) refers to computer systems designed to perform tasks that typically require human intelligence. At Zentrium AI, we specialize in practical AI applications that deliver real business value through automation, data analysis, and intelligent decision-making.',
        'how does ai work': 'AI works by using algorithms and models trained on data to recognize patterns, make predictions, and take actions. Modern AI systems use techniques like machine learning and deep learning to improve their performance over time as they process more data.',
        'what industries do you work with': 'We work with clients across various industries including healthcare, finance, legal, retail, manufacturing, and technology. Our AI solutions are adaptable to different business contexts and requirements.',
        'do you offer custom solutions': 'Yes, we specialize in creating custom AI solutions tailored to your specific business needs. Our team works closely with you to understand your requirements and develop solutions that address your unique challenges.',
        'how long does implementation take': 'Implementation typically takes 2-4 weeks depending on the complexity of your requirements. We follow an agile approach to ensure you see progress and can provide feedback throughout the development process.'
    };

    return exactMatches[messageLower] || null;
};

ZentriumAIAssistant.prototype.generateGreetingResponse = function(personalizedGreeting) {
    const responses = [
        `${personalizedGreeting}Hello! How can I help you today? I can tell you about our AI services, pricing, or help you book a consultation.`,
        `${personalizedGreeting}Hi there! Welcome to Zentrium AI. What brings you here today?`,
        `${personalizedGreeting}Greetings! I'm the Zentrium AI Assistant. How may I assist you?`
    ];

    // Add suggested responses
    this.context.suggestedResponses = [
        "Tell me about your services",
        "What are your pricing options?",
        "I'd like to book a consultation"
    ];

    return this.getRandomResponse(responses);
};

ZentriumAIAssistant.prototype.generateFarewellResponse = function(personalizedGreeting) {
    const responses = [
        `${personalizedGreeting}Thank you for chatting with me today. If you have any more questions in the future, don't hesitate to reach out!`,
        `${personalizedGreeting}Goodbye! It was a pleasure assisting you. Feel free to return if you need further help.`,
        `${personalizedGreeting}Have a great day! Remember, we're here to help whenever you need AI solutions for your business.`
    ];

    return this.getRandomResponse(responses);
};

ZentriumAIAssistant.prototype.generateThanksResponse = function(personalizedGreeting) {
    const responses = [
        `${personalizedGreeting}You're welcome! Is there anything else I can help you with today?`,
        `${personalizedGreeting}My pleasure! Do you have any other questions about our AI solutions?`,
        `${personalizedGreeting}Happy to help! Let me know if you need any more information.`
    ];

    // Add suggested responses
    this.context.suggestedResponses = [
        "Yes, I have another question",
        "No, that's all for now"
    ];

    return this.getRandomResponse(responses);
};

ZentriumAIAssistant.prototype.getRandomResponse = function(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
};

ZentriumAIAssistant.prototype.generateServicesResponse = function(personalizedGreeting, messageLower) {
    // Check if asking about a specific service
    let specificService = null;

    if (messageLower.includes('workflow') || messageLower.includes('automation')) {
        specificService = this.knowledgeBase.services.find(s => s.name === "Workflow Automation");
    } else if (messageLower.includes('document') || messageLower.includes('processing')) {
        specificService = this.knowledgeBase.services.find(s => s.name === "Document Processing");
    } else if (messageLower.includes('agent') || messageLower.includes('assistant')) {
        specificService = this.knowledgeBase.services.find(s => s.name === "Custom AI Agents");
    } else if (messageLower.includes('analytics') || messageLower.includes('prediction')) {
        specificService = this.knowledgeBase.services.find(s => s.name === "Predictive Analytics");
    }

    if (specificService) {
        // Respond about specific service
        const response = `${personalizedGreeting}Our <strong>${specificService.name}</strong> service provides ${specificService.description} Would you like to know more about our other services or discuss how this could benefit your business?`;

        // Add suggested responses
        this.context.suggestedResponses = [
            "Tell me about your other services",
            "How could this benefit my business?",
            "What's your pricing for this service?"
        ];

        return response;
    } else {
        // Respond with general services overview
        const response = `${personalizedGreeting}We offer a comprehensive range of AI solutions including:<br><br>• <strong>Workflow Automation</strong> - Streamline your business processes<br>• <strong>Document Processing</strong> - Extract insights from unstructured data<br>• <strong>Custom AI Agents</strong> - Tailored AI assistants for your specific needs<br>• <strong>Predictive Analytics</strong> - Make data-driven decisions<br><br>Would you like more details about any specific service?`;

        // Add suggested responses
        this.context.suggestedResponses = [
            "Tell me about Workflow Automation",
            "Tell me about Document Processing",
            "Tell me about Custom AI Agents",
            "Tell me about Predictive Analytics"
        ];

        return response;
    }
};

ZentriumAIAssistant.prototype.generatePricingResponse = function(personalizedGreeting, messageLower) {
    // Check if asking about pricing for a specific service
    let specificService = null;

    if (messageLower.includes('workflow') || messageLower.includes('automation')) {
        specificService = "Workflow Automation";
    } else if (messageLower.includes('document') || messageLower.includes('processing')) {
        specificService = "Document Processing";
    } else if (messageLower.includes('agent') || messageLower.includes('assistant')) {
        specificService = "Custom AI Agents";
    } else if (messageLower.includes('analytics') || messageLower.includes('prediction')) {
        specificService = "Predictive Analytics";
    }

    if (specificService) {
        // Respond about specific service pricing
        const response = `${personalizedGreeting}The pricing for our ${specificService} service depends on your specific requirements and scale. We offer flexible pricing models including project-based, subscription, and pay-as-you-go options. Would you like to book a consultation to discuss your needs and get a personalized quote?`;

        // Add suggested responses
        this.context.suggestedResponses = [
            "Yes, I'd like to book a consultation",
            "What factors affect the price?",
            "Tell me about your other services"
        ];

        return response;
    } else {
        // Respond with general pricing information
        const response = `${personalizedGreeting}Our pricing is customized based on your specific requirements and project scope. We offer flexible pricing models including:<br><br>• Project-based pricing<br>• Monthly subscriptions<br>• Pay-as-you-go options<br><br>Would you like to book a free consultation to discuss your needs and get a personalized quote?`;

        // Add suggested responses
        this.context.suggestedResponses = [
            "Yes, I'd like to book a consultation",
            "What's included in the monthly subscription?",
            "How does the pay-as-you-go model work?"
        ];

        return response;
    }
};

ZentriumAIAssistant.prototype.generateContactResponse = function(personalizedGreeting) {
    const response = `${personalizedGreeting}You can reach us through multiple channels:<br><br>• Email: <a href="mailto:zentriumai@gmail.com">zentriumai@gmail.com</a><br>• Phone: <a href="tel:+94742209477">+94 074 220 9477</a><br>• Contact Form: Fill out the form in the Contact section<br><br>How would you prefer to connect with us?`;

    // Add suggested responses
    this.context.suggestedResponses = [
        "I'll send an email",
        "I'll call you",
        "I'll use the contact form"
    ];

    return response;
};

ZentriumAIAssistant.prototype.generateBookingResponse = function(personalizedGreeting) {
    const response = `${personalizedGreeting}Great choice! You can book a free 30-minute consultation through our calendar system in the "Book a Call" section. Would you like me to help you navigate there?`;

    // Add suggested responses
    this.context.suggestedResponses = [
        "Yes, please help me navigate there",
        "What information do I need to provide?",
        "What happens after I book?"
    ];

    return response;
};

ZentriumAIAssistant.prototype.generateHelpResponse = function(personalizedGreeting) {
    const response = `${personalizedGreeting}I'm here to help! I can provide information about our AI services, pricing, or assist you with booking a consultation. What would you like to know more about?`;

    // Add suggested responses
    this.context.suggestedResponses = [
        "Tell me about your services",
        "What are your pricing options?",
        "How can I contact your team?"
    ];

    return response;
};

ZentriumAIAssistant.prototype.generateCompanyResponse = function(personalizedGreeting) {
    const response = `${personalizedGreeting}Zentrium AI is a leading provider of artificial intelligence solutions for businesses. We specialize in workflow automation, document processing, custom AI agents, and predictive analytics. Our mission is to make AI accessible and practical for businesses of all sizes. Would you like to know more about our team or services?`;

    // Add suggested responses
    this.context.suggestedResponses = [
        "Tell me about your team",
        "What services do you offer?",
        "How did Zentrium AI start?"
    ];

    return response;
};

ZentriumAIAssistant.prototype.generateDefaultResponse = function(personalizedGreeting) {
    const responses = [
        `${personalizedGreeting}Thank you for your message. I'm here to help with information about our AI services, pricing, or booking a consultation. Could you please provide more details about what you're looking for?`,
        `${personalizedGreeting}I'm not sure I fully understood your question. I can help with information about Zentrium AI's services, pricing, or scheduling a consultation. What would you like to know?`,
        `${personalizedGreeting}I'd be happy to assist you. To better help you, could you clarify what information you're looking for about our AI solutions?`
    ];

    // Add suggested responses
    this.context.suggestedResponses = [
        "Tell me about your services",
        "What are your pricing options?",
        "I'd like to book a consultation"
    ];

    return this.getRandomResponse(responses);
};

ZentriumAIAssistant.prototype.addSuggestedResponses = function() {
    // Don't add if there are no suggested responses
    if (!this.context.suggestedResponses || this.context.suggestedResponses.length === 0) {
        return;
    }

    // Create suggested responses container
    const suggestedHTML = `
        <div class="suggested-responses" id="suggested-responses">
            ${this.context.suggestedResponses.map(suggestion =>
                `<button class="suggested-btn">${suggestion}</button>`
            ).join('')}
        </div>
    `;

    // Remove existing suggested responses if any
    const existingSuggestions = document.getElementById('suggested-responses');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }

    // Add to DOM
    this.chatbotMessages.insertAdjacentHTML('beforeend', suggestedHTML);

    // Add event listeners to suggested response buttons with a slight delay to ensure DOM is updated
    setTimeout(() => {
        const buttons = document.querySelectorAll('.suggested-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Set input value to the suggested response
                this.chatbotInput.value = button.textContent;

                // Remove suggested responses
                const suggestedContainer = document.getElementById('suggested-responses');
                if (suggestedContainer) {
                    suggestedContainer.remove();
                }

                // Send the message
                this.sendMessage();
            });
        });

        // Scroll to bottom
        this.scrollToBottom();
    }, 100);
};
