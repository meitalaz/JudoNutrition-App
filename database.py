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
            receiver_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT,
            is_read BOOLEAN DEFAULT 0
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ מסד הנתונים נוצר בהצלחה!")

def add_message(sender_id, receiver_id, content):
    """הוספת הודעה חדשה"""
    conn = get_db_connection()
    cursor = conn.cursor()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute('''
        INSERT INTO messages (sender_id, receiver_id, content, timestamp)
        VALUES (?, ?, ?, ?)
    ''', (sender_id, receiver_id, content, timestamp))
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