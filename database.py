import sqlite3
from datetime import datetime

# יצירת חיבור למסד הנתונים
def get_db_connection():
    conn = sqlite3.connect('judo.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """יצירת הטבלאות במסד הנתונים"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # טבלת משתמשים
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            reset_token TEXT,
            role TEXT CHECK (role IN ('athlete', 'nutritionist')) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # טבלת הודעות
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            receiver_id INTEGER,
            role TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            message_type TEXT DEFAULT 'text',
            context TEXT,
            is_read BOOLEAN DEFAULT 0,
            FOREIGN KEY (sender_id) REFERENCES users(id),
            FOREIGN KEY (receiver_id) REFERENCES users(id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ מסד הנתונים נוצר בהצלחה!")

def add_message(sender_id, receiver_id, message, role, message_type='text', context=None):
    """הוספת הודעה חדשה"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # קבל את התפקיד של השולח
    if role is None:
        cursor.execute('SELECT role FROM users WHERE id = ?', (sender_id,))
        user = cursor.fetchone()
        role = user['role'] if user else 'athlete'
    
    cursor.execute('''
        INSERT INTO messages (sender_id, receiver_id, role, message, message_type, context)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (sender_id, receiver_id, role, message, message_type, context))
    conn.commit()
    conn.close()

def get_messages(user1_id, user2_id, limit=50):
    """קבלת הודעות בין שני משתמשים"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM messages 
        WHERE (sender_id = ? AND receiver_id = ?) 
           OR (sender_id = ? AND receiver_id = ?)
        ORDER BY timestamp DESC
        LIMIT ?
    ''', (user1_id, user2_id, user2_id, user1_id, limit))
    messages = cursor.fetchall()
    conn.close()
    return messages

def mark_messages_as_read(receiver_id, sender_id):
    """סימון הודעות כנקראו"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE messages 
        SET is_read = 1 
        WHERE receiver_id = ? AND sender_id = ? AND is_read = 0
    ''', (receiver_id, sender_id))
    conn.commit()
    conn.close()

def get_unread_messages_count(user_id):
    """קבלת מספר הודעות שלא נקראו למשתמש"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT COUNT(*) as count FROM messages 
        WHERE receiver_id = ? AND is_read = 0
    ''', (user_id,))
    result = cursor.fetchone()
    conn.close()
    return result['count'] if result else 0

def get_messages_by_role(role, limit=50):
    """קבלת הודעות לפי תפקיד"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM messages 
        WHERE role = ?
        ORDER BY timestamp DESC
        LIMIT ?
    ''', (role, limit))
    messages = cursor.fetchall()
    conn.close()
    return messages 