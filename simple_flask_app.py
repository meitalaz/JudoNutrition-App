import os
import sqlite3
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from datetime import datetime
import json
from flask_mail import Mail, Message
import secrets

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-in-production'

# הגדרות Flask-Mail (עדכן את הפרטים שלך)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your.email@gmail.com'  # שנה למייל שלך
app.config['MAIL_PASSWORD'] = 'your-app-password'     # שנה לסיסמת אפליקציה
mail = Mail(app)

# Database setup
DATABASE = 'simple_app.db'

def init_db():
    """Initialize the database with tables"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            reset_token TEXT
        )
    ''')
    # Create posts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    # Create messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            receiver_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_read BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (sender_id) REFERENCES users (id),
            FOREIGN KEY (receiver_id) REFERENCES users (id)
        )
    ''')
    conn.commit()
    conn.close()

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        conn = get_db()
        cursor = conn.cursor()
        try:
            cursor.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                (username, email, password)
            )
            conn.commit()
            conn.close()
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            conn.close()
            return "User already exists", 400
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            (username, password)
        )
        user = cursor.fetchone()
        conn.close()
        if user:
            session['user_id'] = user['id']
            session['username'] = user['username']
            return redirect(url_for('dashboard'))
        else:
            return "Invalid credentials", 401
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC',
        (session['user_id'],)
    )
    posts = cursor.fetchall()
    conn.close()
    return render_template('dashboard.html', posts=posts)

@app.route('/post/new', methods=['GET', 'POST'])
def new_post():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
            (session['user_id'], title, content)
        )
        conn.commit()
        conn.close()
        return redirect(url_for('dashboard'))
    return render_template('new_post.html')

@app.route('/api/posts')
def api_posts():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT posts.*, users.username 
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        ORDER BY posts.created_at DESC
    ''')
    posts = cursor.fetchall()
    conn.close()
    posts_list = []
    for post in posts:
        posts_list.append({
            'id': post['id'],
            'title': post['title'],
            'content': post['content'],
            'username': post['username'],
            'created_at': post['created_at']
        })
    return jsonify(posts_list)

# שליחת מייל איפוס סיסמה

def send_reset_email(email, token):
    reset_url = url_for('reset_password', token=token, _external=True)
    msg = Message('איפוס סיסמה - Simple Flask App',
                  sender=app.config['MAIL_USERNAME'],
                  recipients=[email])
    msg.body = f"שלום,\n\nלחץ על הקישור הבא כדי לאפס את הסיסמה שלך:\n{reset_url}\n\nאם לא ביקשת איפוס, התעלם מהודעה זו."
    mail.send(msg)

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form['email']
        conn = get_db()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        if user:
            token = secrets.token_urlsafe(32)
            conn.execute('UPDATE users SET reset_token = ? WHERE id = ?', (token, user['id']))
            conn.commit()
            send_reset_email(email, token)
            conn.close()
            return render_template('forgot_password.html', message='קישור לאיפוס סיסמה נשלח למייל שלך!')
        else:
            conn.close()
            return render_template('forgot_password.html', error='לא נמצא משתמש עם מייל זה.')
    return render_template('forgot_password.html')

@app.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE reset_token = ?', (token,)).fetchone()
    if not user:
        conn.close()
        return 'קישור לא תקין או שפג תוקפו', 400
    if request.method == 'POST':
        password = request.form['password']
        conn.execute('UPDATE users SET password = ?, reset_token = NULL WHERE id = ?', (password, user['id']))
        conn.commit()
        conn.close()
        return redirect(url_for('login'))
    conn.close()
    return render_template('reset_password.html', token=token)

# Chat endpoints
@app.route('/send_message', methods=['POST'])
def send_message():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.get_json()
    if not data or 'receiver_id' not in data or 'content' not in data:
        return jsonify({'error': 'Missing receiver_id or content'}), 400
    
    sender_id = session['user_id']
    receiver_id = data['receiver_id']
    content = data['content']
    
    if not content.strip():
        return jsonify({'error': 'Message cannot be empty'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
            (sender_id, receiver_id, content)
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Message sent successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/get_messages/<int:user_id>/<int:other_id>')
def get_messages(user_id, other_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    # Verify user is requesting their own messages
    if session['user_id'] != user_id and session['user_id'] != other_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Get messages between the two users, ordered by timestamp
    cursor.execute('''
        SELECT m.*, u.username as sender_name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE (m.sender_id = ? AND m.receiver_id = ?) 
           OR (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.timestamp ASC
    ''', (user_id, other_id, other_id, user_id))
    
    messages = cursor.fetchall()
    conn.close()
    
    messages_list = []
    for msg in messages:
        messages_list.append({
            'id': msg['id'],
            'sender_id': msg['sender_id'],
            'receiver_id': msg['receiver_id'],
            'content': msg['content'],
            'timestamp': msg['timestamp'],
            'is_read': bool(msg['is_read']),
            'sender_name': msg['sender_name']
        })
    
    return jsonify(messages_list)

@app.route('/chat/<int:other_user_id>')
def chat_page(other_user_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Get other user info
    cursor.execute('SELECT id, username FROM users WHERE id = ?', (other_user_id,))
    other_user = cursor.fetchone()
    conn.close()
    
    if not other_user:
        return "User not found", 404
    
    return render_template('chat.html', 
                         current_user_id=session['user_id'],
                         current_username=session['username'],
                         other_user_id=other_user_id,
                         other_username=other_user['username'])

@app.route('/users')
def get_users():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, username FROM users WHERE id != ?', (session['user_id'],))
    users = cursor.fetchall()
    conn.close()
    
    users_list = []
    for user in users:
        users_list.append({
            'id': user['id'],
            'username': user['username']
        })
    
    return jsonify(users_list)

if __name__ == '__main__':
    init_db()
    print("✅ Database initialized successfully!")
    app.run(debug=True, host='0.0.0.0', port=5000) 