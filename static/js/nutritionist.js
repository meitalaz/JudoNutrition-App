/**
 * JudoNutrition - Enhanced Nutritionist Chat System
 * Advanced messaging center for nutritionist-athlete communication
 */

// Mock data for demonstration
const ATHLETES_DATA = {
    'dani_cohen': {
        name: 'דני כהן',
        age: 24,
        category: 'עד 73 ק"ג',
        daysToCompetition: 45,
        avatar: 'DC'
    },
    'maya_israeli': {
        name: 'מאיה ישראלי', 
        age: 22,
        category: 'עד 57 ק"ג',
        daysToCompetition: 30,
        avatar: 'MI'
    },
    'ron_david': {
        name: 'רון דוד',
        age: 26, 
        category: 'עד 81 ק"ג',
        daysToCompetition: 60,
        avatar: 'RD'
    }
};

// Nutritionist status management
let nutritionistStatus = {
    online: true,
    status: 'זמינה', // זמינה, עסוקה, לא זמינה
    lastSeen: new Date().toISOString()
};

// Message templates for quick replies
const MESSAGE_TEMPLATES = [
    'המשך בתוכנית שלך, אתה בכיוון הנכון! 👍',
    'בוא נתאם פגישה השבוע לבדיקת התקדמות',
    'שלח לי תמונה של הארוחה הבאה שלך 📸',
    'זכור לשתות הרבה מים היום 💧',
    'איך אתה מרגיש עם השינויים בתזונה?',
    'הנתונים נראים מעולים! כל הכבוד 🌟',
    'יש לי כמה הצעות לשיפור - בוא נדבר',
    'זמן לעדכון משקל ומדידות'
];

/**
 * Initialize nutritionist chat system
 */
function initializeNutritionistChat() {
    setupNutritionistInterface();
    loadAthletesMessages();
    setupEventListeners();
    updateNutritionistStatus();
    console.log('Nutritionist chat system initialized');
}

/**
 * Setup nutritionist interface
 */
function setupNutritionistInterface() {
    const container = document.getElementById('nutritionistChatContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="nutritionist-chat-wrapper">
            <!-- Header with status controls -->
            <div class="nutritionist-header">
                <div class="header-info">
                    <h4 class="mb-1">מרכז הודעות מתקדם</h4>
                    <p class="text-muted mb-0">ניהול תקשורת עם ספורטאים</p>
                </div>
                <div class="status-controls">
                    <div class="status-selector">
                        <label class="form-label small">סטטוס:</label>
                        <select class="form-select form-select-sm" id="statusSelector">
                            <option value="זמינה">זמינה</option>
                            <option value="עסוקה">עסוקה</option>
                            <option value="לא זמינה">לא זמינה</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="row g-0 h-100">
                <!-- Athletes List Sidebar -->
                <div class="col-md-4 border-end">
                    <div class="athletes-sidebar">
                        <!-- Filter Controls -->
                        <div class="filter-controls p-3 border-bottom">
                            <div class="row g-2">
                                <div class="col-8">
                                    <input type="text" class="form-control form-control-sm" 
                                           id="athleteSearch" placeholder="חפש ספורטאי...">
                                </div>
                                <div class="col-4">
                                    <select class="form-select form-select-sm" id="messageFilter">
                                        <option value="all">הכל</option>
                                        <option value="unread">חדשות</option>
                                        <option value="urgent">דחופות</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Athletes List -->
                        <div class="athletes-list" id="athletesList">
                            <!-- Will be populated dynamically -->
                        </div>
                    </div>
                </div>

                <!-- Chat Area -->
                <div class="col-md-8">
                    <div class="chat-area" id="chatArea">
                        <!-- Welcome screen -->
                        <div class="welcome-screen text-center py-5">
                            <i class="fas fa-comments fa-3x text-muted mb-3"></i>
                            <h5 class="text-muted">בחר ספורטאי מהרשימה</h5>
                            <p class="text-muted">להתחלת שיחה או צפייה בהיסטוריה</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    populateAthletesList();
}

/**
 * Populate athletes list with message indicators
 */
function populateAthletesList() {
    const container = document.getElementById('athletesList');
    if (!container) return;
    
    let athletesHTML = '';
    
    Object.entries(ATHLETES_DATA).forEach(([athleteId, athlete]) => {
        const messages = getMessagesForAthlete(athleteId);
        const unreadCount = messages.filter(m => m.from === 'athlete' && !m.read).length;
        const hasUrgent = messages.some(m => m.urgent && m.from === 'athlete' && !m.read);
        const lastMessage = messages[messages.length - 1];
        
        athletesHTML += `
            <div class="athlete-item ${hasUrgent ? 'has-urgent' : ''}" 
                 data-athlete-id="${athleteId}" 
                 onclick="openAthleteChat('${athleteId}')">
                <div class="athlete-avatar">
                    <span class="avatar-text">${athlete.avatar}</span>
                    ${hasUrgent ? '<div class="urgent-indicator"></div>' : ''}
                </div>
                <div class="athlete-info flex-grow-1">
                    <div class="athlete-header d-flex justify-content-between">
                        <h6 class="athlete-name mb-1">${athlete.name}</h6>
                        ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : ''}
                    </div>
                    <div class="athlete-details">
                        <small class="text-muted">${athlete.category} • ${athlete.daysToCompetition} ימים לתחרות</small>
                    </div>
                    ${lastMessage ? `
                        <div class="last-message">
                            <small class="text-muted">${truncateText(lastMessage.content, 40)}</small>
                            <small class="message-time">${formatTime(lastMessage.timestamp)}</small>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = athletesHTML;
}

/**
 * Open chat with specific athlete
 */
function openAthleteChat(athleteId) {
    const athlete = ATHLETES_DATA[athleteId];
    const messages = getMessagesForAthlete(athleteId);
    
    // Mark athlete messages as read
    markAthleteMessagesAsRead(athleteId);
    
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = `
        <div class="chat-header-athlete">
            <div class="athlete-chat-info">
                <div class="athlete-avatar-large">
                    <span>${athlete.avatar}</span>
                </div>
                <div class="athlete-details-extended">
                    <h5 class="mb-1">צ'אט עם ${athlete.name}</h5>
                    <div class="athlete-meta">
                        <span class="badge bg-primary">${athlete.category}</span>
                        <span class="badge bg-info">${athlete.age} שנים</span>
                        <span class="badge bg-warning">${athlete.daysToCompetition} ימים לתחרות</span>
                    </div>
                </div>
            </div>
            <div class="chat-actions">
                <button class="btn btn-outline-primary btn-sm" onclick="markAsUrgent('${athleteId}')">
                    <i class="fas fa-exclamation-triangle me-1"></i>
                    סמן דחוף
                </button>
                <button class="btn btn-outline-success btn-sm" onclick="scheduleCall('${athleteId}')">
                    <i class="fas fa-phone me-1"></i>
                    תזמן שיחה
                </button>
            </div>
        </div>

        <div class="messages-container" id="messagesContainer">
            ${renderMessages(messages)}
        </div>

        <div class="typing-indicator" id="typingIndicator" style="display: none;">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
            <span class="typing-text">${athlete.name} מקליד...</span>
        </div>

        <div class="message-input-area">
            <!-- Quick Templates -->
            <div class="templates-row mb-2">
                <small class="text-muted me-2">תבניות מהירות:</small>
                ${MESSAGE_TEMPLATES.slice(0, 4).map(template => 
                    `<button class="btn btn-sm btn-outline-secondary me-1 template-btn" 
                             onclick="sendTemplate('${athleteId}', '${template}')">${truncateText(template, 25)}</button>`
                ).join('')}
            </div>

            <div class="input-group">
                <button class="btn btn-outline-secondary" onclick="attachFile('${athleteId}')">
                    <i class="fas fa-paperclip"></i>
                </button>
                <input type="text" class="form-control" id="messageInput" 
                       placeholder="הקלד הודעה ל${athlete.name}..." 
                       data-athlete-id="${athleteId}">
                <button class="btn btn-primary" onclick="sendNutritionistMessage('${athleteId}')">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    // Update athletes list to show selected state
    document.querySelectorAll('.athlete-item').forEach(item => item.classList.remove('selected'));
    document.querySelector(`[data-athlete-id="${athleteId}"]`).classList.add('selected');
    
    // Scroll to bottom of messages
    scrollToBottom('messagesContainer');
    
    // Focus on input
    document.getElementById('messageInput').focus();
    
    // Setup event listeners for this chat
    setupChatEventListeners(athleteId);
}

/**
 * Render messages for display
 */
function renderMessages(messages) {
    return messages.map(message => {
        const isNutritionist = message.from === 'nutritionist';
        const urgentClass = message.urgent ? 'urgent-message' : '';
        
        return `
            <div class="message ${isNutritionist ? 'nutritionist-msg' : 'athlete-msg'} ${urgentClass}" 
                 data-id="${message.id}">
                <div class="message-bubble">
                    ${message.urgent && !isNutritionist ? '<div class="urgent-badge"><i class="fas fa-exclamation-triangle"></i> דחוף</div>' : ''}
                    <div class="message-content">
                        <p>${message.content}</p>
                    </div>
                    <div class="message-footer">
                        <span class="message-time">${formatTime(message.timestamp)}</span>
                        ${isNutritionist ? `<span class="message-status">${getStatusIcon(message.status)}</span>` : ''}
                        ${!message.read && !isNutritionist ? '<span class="unread-indicator">חדש</span>' : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Send message as nutritionist
 */
function sendNutritionistMessage(athleteId) {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    
    if (!content) return;
    
    const newMessage = {
        id: Date.now(),
        from: 'nutritionist',
        content: content,
        timestamp: new Date().toISOString(),
        status: 'sent',
        urgent: false,
        read: true
    };
    
    // Add to storage
    const messages = getMessagesForAthlete(athleteId);
    messages.push(newMessage);
    saveMessagesForAthlete(athleteId, messages);
    
    // Add to UI
    const container = document.getElementById('messagesContainer');
    container.insertAdjacentHTML('beforeend', renderMessages([newMessage]));
    
    // Clear input
    input.value = '';
    
    // Update status and scroll
    updateMessageStatus(newMessage.id, 'delivered');
    scrollToBottom('messagesContainer');
    
    // Update athletes list
    populateAthletesList();
    
    // Simulate athlete response for demo
    setTimeout(() => simulateAthleteResponse(athleteId, content), 2000 + Math.random() * 3000);
}

/**
 * Send template message
 */
function sendTemplate(athleteId, template) {
    const input = document.getElementById('messageInput');
    input.value = template;
    input.focus();
}

/**
 * Simulate athlete response (for demo purposes)
 */
function simulateAthleteResponse(athleteId, nutritionistMessage) {
    const responses = getAthleteResponse(nutritionistMessage);
    const athlete = ATHLETES_DATA[athleteId];
    
    // Show typing indicator
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
        scrollToBottom('messagesContainer');
    }
    
    setTimeout(() => {
        // Hide typing indicator
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
        
        const newMessage = {
            id: Date.now(),
            from: 'athlete',
            content: responses,
            timestamp: new Date().toISOString(),
            status: 'delivered',
            urgent: false,
            read: false
        };
        
        // Add to storage
        const messages = getMessagesForAthlete(athleteId);
        messages.push(newMessage);
        saveMessagesForAthlete(athleteId, messages);
        
        // Add to UI if chat is open
        const container = document.getElementById('messagesContainer');
        if (container) {
            container.insertAdjacentHTML('beforeend', renderMessages([newMessage]));
            scrollToBottom('messagesContainer');
        }
        
        // Update athletes list
        populateAthletesList();
        
        // Show notification
        showNotification(`הודעה חדשה מ${athlete.name}`, responses);
        
    }, 1500 + Math.random() * 2000);
}

/**
 * Get smart athlete response based on nutritionist message
 */
function getAthleteResponse(nutritionistMessage) {
    const lowerMsg = nutritionistMessage.toLowerCase();
    
    if (lowerMsg.includes('תמונה') || lowerMsg.includes('ארוחה')) {
        return 'בסדר, אשלח תמונה של הארוחה הבאה 📸';
    }
    
    if (lowerMsg.includes('פגישה') || lowerMsg.includes('שיחה')) {
        return 'כן, בוא נתאם! מתי נוח לך השבוע?';
    }
    
    if (lowerMsg.includes('מים') || lowerMsg.includes('שתיה')) {
        return 'כן, אני משתדל לשתות הרבה מים. תודה על התזכורת! 💧';
    }
    
    if (lowerMsg.includes('התקדמות') || lowerMsg.includes('כיוון')) {
        return 'תודה! אני מרגיש שאני משתפר. יש לי עוד שאלות על התזונה לפני האימון';
    }
    
    const generalResponses = [
        'תודה על המשוב! זה מאוד עזר לי',
        'מעולה, אני אמשיך כך 👍',
        'יש לי עוד שאלות, אפשר לדבר?',
        'אני מרגיש טוב עם השינויים החדשים',
        'תודה על התמיכה! זה ממש חשוב לי',
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

/**
 * Helper functions
 */

function getMessagesForAthlete(athleteId) {
    return JSON.parse(localStorage.getItem(`nutritionist_chat_${athleteId}`) || '[]');
}

function saveMessagesForAthlete(athleteId, messages) {
    localStorage.setItem(`nutritionist_chat_${athleteId}`, JSON.stringify(messages));
}

function markAthleteMessagesAsRead(athleteId) {
    const messages = getMessagesForAthlete(athleteId);
    messages.forEach(message => {
        if (message.from === 'athlete') {
            message.read = true;
        }
    });
    saveMessagesForAthlete(athleteId, messages);
}

function updateMessageStatus(messageId, status) {
    setTimeout(() => {
        const statusElement = document.querySelector(`[data-id="${messageId}"] .message-status`);
        if (statusElement) {
            statusElement.innerHTML = getStatusIcon(status);
        }
    }, 1000);
}

function getStatusIcon(status) {
    switch(status) {
        case 'sent': return '✓';
        case 'delivered': return '✓✓';
        case 'read': return '✓✓';
        default: return '';
    }
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('he-IL', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Jerusalem'
    });
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function scrollToBottom(containerId) {
    setTimeout(() => {
        const container = document.getElementById(containerId);
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, 100);
}

function showNotification(title, message) {
    // Simple browser notification (could be enhanced with toast)
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: truncateText(message, 100) });
    } else {
        console.log(`${title}: ${message}`);
    }
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('athleteSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterAthletes);
    }
    
    // Filter functionality
    const filterSelect = document.getElementById('messageFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', filterAthletes);
    }
    
    // Status selector
    const statusSelector = document.getElementById('statusSelector');
    if (statusSelector) {
        statusSelector.addEventListener('change', updateNutritionistStatus);
    }
}

function setupChatEventListeners(athleteId) {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendNutritionistMessage(athleteId);
            }
        });
    }
}

function filterAthletes() {
    const searchTerm = document.getElementById('athleteSearch').value.toLowerCase();
    const filter = document.getElementById('messageFilter').value;
    
    document.querySelectorAll('.athlete-item').forEach(item => {
        const athleteId = item.getAttribute('data-athlete-id');
        const athlete = ATHLETES_DATA[athleteId];
        const messages = getMessagesForAthlete(athleteId);
        
        let show = true;
        
        // Text search
        if (searchTerm && !athlete.name.toLowerCase().includes(searchTerm)) {
            show = false;
        }
        
        // Filter by message type
        if (filter === 'unread') {
            const hasUnread = messages.some(m => m.from === 'athlete' && !m.read);
            if (!hasUnread) show = false;
        } else if (filter === 'urgent') {
            const hasUrgent = messages.some(m => m.urgent && m.from === 'athlete' && !m.read);
            if (!hasUrgent) show = false;
        }
        
        item.style.display = show ? 'flex' : 'none';
    });
}

function loadAthletesMessages() {
    // Initialize with some demo messages if none exist
    Object.keys(ATHLETES_DATA).forEach(athleteId => {
        const messages = getMessagesForAthlete(athleteId);
        if (messages.length === 0) {
            const demoMessages = generateDemoMessages(athleteId);
            saveMessagesForAthlete(athleteId, demoMessages);
        }
    });
}

function generateDemoMessages(athleteId) {
    const athlete = ATHLETES_DATA[athleteId];
    const now = new Date();
    
    return [
        {
            id: Date.now() - 1000000,
            from: 'nutritionist',
            content: `שלום ${athlete.name.split(' ')[0]}! איך אתה מרגיש עם התוכנית החדשה?`,
            timestamp: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
            status: 'read',
            urgent: false,
            read: true
        },
        {
            id: Date.now() - 900000,
            from: 'athlete',
            content: 'שלום! אני מרגיש טוב, אבל יש לי שאלות על התזונה לפני האימון',
            timestamp: new Date(now - 23 * 60 * 60 * 1000).toISOString(),
            status: 'delivered',
            urgent: false,
            read: Math.random() > 0.5
        }
    ];
}

function updateNutritionistStatus() {
    const statusSelector = document.getElementById('statusSelector');
    if (statusSelector) {
        nutritionistStatus.status = statusSelector.value;
        nutritionistStatus.online = statusSelector.value !== 'לא זמינה';
        nutritionistStatus.lastSeen = new Date().toISOString();
        
        // Could sync with athlete interface here
        console.log('Nutritionist status updated:', nutritionistStatus);
    }
}

// Action functions for buttons
function markAsUrgent(athleteId) {
    showAlert('ההודעות סומנו כדחופות', 'success');
}

function scheduleCall(athleteId) {
    const athlete = ATHLETES_DATA[athleteId];
    showAlert(`שיחה נקבעה עם ${athlete.name}`, 'info');
}

function attachFile(athleteId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const messageContent = `📎 קובץ נשלח: ${file.name}`;
            document.getElementById('messageInput').value = messageContent;
        }
    };
    input.click();
}

function showAlert(message, type = 'info') {
    const alertContainer = document.querySelector('.nutritionist-chat-wrapper');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-absolute`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 4000);
}

// Export functions for global access
window.nutritionistChat = {
    init: initializeNutritionistChat,
    openChat: openAthleteChat,
    sendMessage: sendNutritionistMessage
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('nutritionistChatContainer')) {
        initializeNutritionistChat();
    }
});