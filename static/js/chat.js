// משתנים גלובליים - יועברו מהשרת
let user_id = currentUserId;
let other_id = otherUserId;

// טעינת הודעות כל 3 שניות
function loadMessages() {
    fetch(`/api/get_messages?user2_id=${other_id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayMessages(data.messages);
            } else {
                console.error('שגיאה בטעינת הודעות:', data.error);
            }
        })
        .catch(error => {
            console.error('שגיאה בטעינת הודעות:', error);
        });
}

// הצגת הודעות ב-DOM
function displayMessages(messages) {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';
    
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender_id == user_id ? 'sent' : 'received'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = message.content;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date(message.timestamp).toLocaleString('he-IL');
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        messagesContainer.appendChild(messageDiv);
    });
    
    // גלילה לתחתית הצ'אט
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// שליחת הודעה
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message === '') {
        return;
    }
    
    fetch('/api/send_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            receiver_id: other_id,
            content: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            input.value = '';
            // טען הודעות חדשות מיד
            loadMessages();
        } else {
            console.error('שגיאה בשליחת הודעה:', data.error);
            alert('שגיאה בשליחת ההודעה');
        }
    })
    .catch(error => {
        console.error('שגיאה בשליחת הודעה:', error);
        alert('שגיאה בשליחת ההודעה');
    });
}

// שליחת הודעה בלחיצה על Enter
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('messageInput');
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // טען הודעות ראשוניות
    loadMessages();
    
    // הגדר טעינה אוטומטית כל 3 שניות
    setInterval(loadMessages, 3000);
}); 