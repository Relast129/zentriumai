/**
 * Utility functions for the Zentrium AI Assistant
 * This file contains helper methods used by the main chatbot.js
 */

// Add these methods to the ZentriumAIAssistant prototype
ZentriumAIAssistant.prototype.extractUserInfo = function(message) {
    const messageLower = message.toLowerCase();
    
    // Extract name
    const nameMatch = messageLower.match(/my name is ([a-z]+)/i) || 
                      messageLower.match(/i am ([a-z]+)/i) ||
                      messageLower.match(/call me ([a-z]+)/i);
    if (nameMatch && nameMatch[1]) {
        this.context.userInfo.name = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
    }
    
    // Extract email
    const emailMatch = message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    if (emailMatch && emailMatch[0]) {
        this.context.userInfo.email = emailMatch[0];
    }
    
    // Extract company
    const companyMatch = messageLower.match(/work (?:for|at) ([a-z0-9\s]+)/i) ||
                         messageLower.match(/from ([a-z0-9\s]+) company/i) ||
                         messageLower.match(/company (?:is|called) ([a-z0-9\s]+)/i);
    if (companyMatch && companyMatch[1]) {
        this.context.userInfo.company = companyMatch[1].trim();
    }
    
    // Extract location
    const locationMatch = messageLower.match(/from ([a-z\s,]+)/i) ||
                          messageLower.match(/in ([a-z\s,]+)/i) ||
                          messageLower.match(/live (?:in|at) ([a-z\s,]+)/i);
    if (locationMatch && locationMatch[1]) {
        const location = locationMatch[1].trim();
        // Avoid setting common prepositions as locations
        if (!['the', 'a', 'an', 'touch', 'contact'].includes(location)) {
            this.context.userInfo.location = location;
        }
    }
    
    // Extract interest
    if (messageLower.includes('workflow') || messageLower.includes('automation')) {
        this.context.userInfo.interest = 'Workflow Automation';
    } else if (messageLower.includes('document') || messageLower.includes('processing')) {
        this.context.userInfo.interest = 'Document Processing';
    } else if (messageLower.includes('agent') || messageLower.includes('assistant')) {
        this.context.userInfo.interest = 'Custom AI Agents';
    } else if (messageLower.includes('analytics') || messageLower.includes('prediction')) {
        this.context.userInfo.interest = 'Predictive Analytics';
    }
};

ZentriumAIAssistant.prototype.analyzeMessage = function(message) {
    const messageLower = message.toLowerCase();
    
    // Detect intent
    let intent = null;
    let highestConfidence = 0;
    
    for (const [intentName, pattern] of Object.entries(this.patterns)) {
        const matches = messageLower.match(pattern);
        if (matches) {
            const confidence = matches.length / message.split(' ').length;
            if (confidence > highestConfidence) {
                highestConfidence = confidence;
                intent = intentName;
            }
        }
    }
    
    // Set intent and confidence
    if (intent) {
        this.context.lastTopic = intent;
        this.context.intentConfidence = highestConfidence;
    }
    
    // Simple sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'love', 'like', 'helpful', 'thanks', 'thank'];
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'hate', 'dislike', 'unhelpful', 'disappointed', 'frustrating', 'confusing'];
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    const words = messageLower.split(/\W+/);
    words.forEach(word => {
        if (positiveWords.includes(word)) positiveScore++;
        if (negativeWords.includes(word)) negativeScore++;
    });
    
    if (positiveScore > negativeScore) {
        this.context.sentiment = 'positive';
    } else if (negativeScore > positiveScore) {
        this.context.sentiment = 'negative';
    } else {
        this.context.sentiment = 'neutral';
    }
};

ZentriumAIAssistant.prototype.calculateResponseDelay = function(message) {
    // Base delay
    let delay = 1000;
    
    // Add delay based on message length (simulating reading time)
    delay += Math.min(message.length * 10, 1500);
    
    // Add delay for complex topics
    const messageLower = message.toLowerCase();
    if (messageLower.includes('pricing') ||
        messageLower.includes('service') ||
        messageLower.includes('technical') ||
        messageLower.includes('artificial intelligence')) {
        delay += 500;
    }
    
    // Add randomness for more natural feel
    delay += Math.random() * 500;
    
    return delay;
};

ZentriumAIAssistant.prototype.scrollToBottom = function() {
    this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
};

ZentriumAIAssistant.prototype.formatTime = function(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

ZentriumAIAssistant.prototype.escapeHTML = function(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

ZentriumAIAssistant.prototype.saveConversationHistory = function() {
    // Limit history to last 20 messages to avoid localStorage size limits
    const limitedHistory = this.context.conversationHistory.slice(-20);
    
    try {
        localStorage.setItem('zentriumAI_history', JSON.stringify(limitedHistory));
        localStorage.setItem('zentriumAI_userInfo', JSON.stringify(this.context.userInfo));
    } catch (e) {
        console.warn('Failed to save conversation history to localStorage', e);
    }
};

ZentriumAIAssistant.prototype.loadConversationHistory = function() {
    try {
        const history = localStorage.getItem('zentriumAI_history');
        const userInfo = localStorage.getItem('zentriumAI_userInfo');
        
        if (history) {
            this.context.conversationHistory = JSON.parse(history);
        }
        
        if (userInfo) {
            this.context.userInfo = JSON.parse(userInfo);
        }
    } catch (e) {
        console.warn('Failed to load conversation history from localStorage', e);
    }
};

ZentriumAIAssistant.prototype.checkInactivity = function() {
    // Check for inactivity after 2 minutes
    const inactivityTimeout = 2 * 60 * 1000;
    
    setTimeout(() => {
        const now = Date.now();
        const timeSinceLastInteraction = now - this.context.lastInteraction;
        
        if (timeSinceLastInteraction > inactivityTimeout && 
            this.chatbotContainer.classList.contains('active') &&
            this.context.conversationHistory.length > 0) {
            
            // Send inactivity message
            this.addBotMessage("Are you still there? I'm here if you have any more questions about Zentrium AI's services.");
            
            // Add suggested responses
            this.context.suggestedResponses = [
                "Yes, I'm still here",
                "I need more information",
                "I'll come back later"
            ];
            
            setTimeout(() => {
                this.addSuggestedResponses();
            }, 500);
        }
    }, inactivityTimeout);
};
