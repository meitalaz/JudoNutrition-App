import os
import logging
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from datetime import datetime, date, timedelta
import json
import secrets
import uuid
from database import init_db, get_db_connection

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

# Initialize database
init_db()

# Simple in-memory storage for demo purposes
# In production, this would be replaced with a proper database
users = {}
athletes = {}
nutritionists = {}
weight_entries = {}
assessments = {}
tasks = {}
chat_messages = {}

# Helper functions
def generate_id():
    return str(len(users) + 1)

def hash_password(password):
    # Simple hash for demo - in production use proper hashing
    return password + "_hashed"

def check_password(password, hashed):
    return hash_password(password) == hashed

# Routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/athlete')
def athlete_dashboard():
    if 'user_id' not in session or session.get('role') != 'athlete':
        return redirect('/')
    return render_template('athlete_home.html')

@app.route('/nutritionist')
def nutritionist_dashboard():
    if 'user_id' not in session or session.get('role') != 'nutritionist':
        return redirect('/')
    return render_template('nutritionist_dashboard.html')

@app.route('/chat')
@app.route('/chat/<int:other_user_id>')
def chat(other_user_id=None):
    if 'user_id' not in session:
        return redirect('/')
    
    # אם לא הועבר other_user_id, נציג רשימת משתמשים
    if other_user_id is None:
        # כאן אפשר להוסיף לוגיקה להצגת רשימת משתמשים
        return render_template('chat_list.html')
    
    # בדוק שהמשתמש השני קיים
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id, email FROM users WHERE id = ?', (other_user_id,))
    other_user = cursor.fetchone()
    conn.close()
    
    if not other_user:
        return redirect('/chat')
    
    return render_template('chat.html', 
                         other_user_id=other_user_id,
                         other_username=other_user['email'],
                         current_user_id=session['user_id'],
                         current_username=session.get('user_email', 'User'))

@app.route('/forgot_password')
def forgot_password():
    return render_template('forgot_password.html')

# API Routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'role', 'name']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if user already exists
        if data['email'] in users:
            return jsonify({'error': 'User already exists'}), 409
        
        # Create user
        user_id = generate_id()
        users[user_id] = {
            'id': user_id,
            'email': data['email'],
            'password_hash': hash_password(data['password']),
            'role': data['role'],
            'created_at': datetime.utcnow().isoformat(),
            'is_active': True
        }
        
        # Create role-specific profile
        if data['role'] == 'athlete':
            athletes[user_id] = {
                'id': user_id,
                'user_id': user_id,
                'name': data['name'],
                'age': data.get('age'),
                'gender': data.get('gender'),
                'weight_category': data.get('weight_category'),
                'sport_level': data.get('sport_level'),
                'height': data.get('height'),
                'target_weight': data.get('target_weight'),
                'created_at': datetime.utcnow().isoformat()
            }
        elif data['role'] == 'nutritionist':
            nutritionists[user_id] = {
                'id': user_id,
                'user_id': user_id,
                'name': data['name'],
                'license_number': data.get('license_number'),
                'specialization': data.get('specialization'),
                'experience_years': data.get('experience_years'),
                'created_at': datetime.utcnow().isoformat()
            }
        
        # Log in the user
        session['user_id'] = user_id
        session['user_role'] = data['role']
        
        return jsonify({
            'message': 'Registration successful',
            'user': users[user_id]
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Find user by email
        user = None
        for user_id, user_data in users.items():
            if user_data['email'] == data['email']:
                user = user_data
                break
        
        if not user or not check_password(data['password'], user['password_hash']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user['is_active']:
            return jsonify({'error': 'Account is deactivated'}), 403
        
        session['user_id'] = user['id']
        session['user_role'] = user['role']
        
        return jsonify({
            'message': 'Login successful',
            'user': user
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful'})

@app.route('/api/forgot_password', methods=['POST'])
def forgot_password_api():
    """
    API endpoint for password reset request
    
    Flow:
    1. Receive email from request
    2. Check if user exists in database
    3. Generate unique reset token (UUID)
    4. Save token in users.reset_token column
    5. Simulate email sending with reset link
    
    Returns:
        - Success: Email sent confirmation with token (for demo)
        - Error: User not found or server error
    """
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
        
        # Find user by email
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id, email FROM users WHERE email = ?', (data['email'],))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Generate reset token (in production, use a proper token generator)
        import secrets
        reset_token = secrets.token_urlsafe(32)
        
        # Update user with reset token
        cursor.execute('UPDATE users SET reset_token = ? WHERE id = ?', (reset_token, user['id']))
        conn.commit()
        conn.close()
        
        # In production, send email with reset link
        # For demo purposes, simulate email sending
        reset_link = f"http://localhost:5000/reset_password?token={reset_token}"
        
        # Simulate email sending (in production, use proper email service)
        print(f"📧 EMAIL SIMULATION:")
        print(f"   To: {user['email']}")
        print(f"   Subject: איפוס סיסמה - Judo Nutrition")
        print(f"   Body: שלום! לחץ/י על הקישור הבא לאיפוס הסיסמה שלך:")
        print(f"   Link: {reset_link}")
        print(f"   Token: {reset_token}")
        print(f"   ⚠️  הקישור תקף ל-24 שעות")
        print(f"📧 END EMAIL SIMULATION")
        
        return jsonify({
            'message': f'אימייל לאיפוס סיסמה נשלח ל-{user["email"]}',
            'reset_token': reset_token,  # Remove this in production
            'reset_link': reset_link,    # Remove this in production
            'email_sent': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/send_message', methods=['POST'])
def send_message_api():
    """
    API endpoint for sending messages
    
    Flow:
    1. Receive message data (sender_id, receiver_id, content)
    2. Validate the data
    3. Save message to database
    4. Return success/error response
    """
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        
        data = request.get_json()
        
        if not data or 'receiver_id' not in data or 'content' not in data:
            return jsonify({'error': 'Receiver ID and content are required'}), 400
        
        sender_id = session['user_id']
        receiver_id = data['receiver_id']
        content = data['content'].strip()
        
        if not content:
            return jsonify({'error': 'Message content cannot be empty'}), 400
        
        # בדוק שהמשתמש השני קיים
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id FROM users WHERE id = ?', (receiver_id,))
        receiver = cursor.fetchone()
        
        if not receiver:
            return jsonify({'error': 'Receiver not found'}), 404
        
        # שמור את ההודעה במסד הנתונים
        from database import add_message
        add_message(sender_id, receiver_id, content, None)  # role will be fetched automatically
        
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Message sent successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get_messages', methods=['GET'])
def get_messages_api():
    """
    API endpoint for getting messages between two users
    """
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        
        user1_id = session['user_id']
        user2_id = request.args.get('user2_id', type=int)
        
        if not user2_id:
            return jsonify({'error': 'User2 ID is required'}), 400
        
        # בדוק שהמשתמש השני קיים
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id FROM users WHERE id = ?', (user2_id,))
        user2 = cursor.fetchone()
        
        if not user2:
            return jsonify({'error': 'User2 not found'}), 404
        
        # קבל הודעות
        from database import get_messages
        messages = get_messages(user1_id, user2_id, limit=50)
        
        # המר לרשימה של dictionaries
        messages_list = []
        for msg in messages:
            messages_list.append({
                'id': msg['id'],
                'sender_id': msg['sender_id'],
                'receiver_id': msg['receiver_id'],
                'role': msg['role'],
                'message': msg['message'],
                'timestamp': msg['timestamp'],
                'message_type': msg['message_type'],
                'context': msg['context'],
                'is_read': bool(msg['is_read'])
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'messages': messages_list
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reset_password', methods=['POST'])
def reset_password_api():
    try:
        data = request.get_json()
        
        if not data or 'reset_token' not in data or 'new_password' not in data:
            return jsonify({'error': 'Reset token and new password are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Find user by reset token
        cursor.execute('SELECT id FROM users WHERE reset_token = ?', (data['reset_token'],))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'error': 'Invalid reset token'}), 400
        
        # Update password and clear reset token
        cursor.execute('UPDATE users SET password = ?, reset_token = NULL WHERE id = ?', 
                      (hash_password(data['new_password']), user['id']))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Password reset successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        
        user_id = session['user_id']
        user = users.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        profile_data = user.copy()
        
        if user['role'] == 'athlete' and user_id in athletes:
            profile_data['athlete'] = athletes[user_id]
        elif user['role'] == 'nutritionist' and user_id in nutritionists:
            profile_data['nutritionist'] = nutritionists[user_id]
        
        return jsonify(profile_data)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/weight', methods=['POST', 'GET'])
def weight_management():
    try:
        if 'user_id' not in session or session.get('role') != 'athlete':
            return jsonify({'error': 'Athlete access required'}), 403
        
        user_id = session['user_id']
        
        if request.method == 'POST':
            data = request.get_json()
            
            if 'weight' not in data:
                return jsonify({'error': 'Weight is required'}), 400
            
            entry_id = generate_id()
            weight_entries[entry_id] = {
                'id': entry_id,
                'athlete_id': user_id,
                'weight': float(data['weight']),
                'date': data.get('date', date.today().isoformat()),
                'timing': data.get('timing'),
                'notes': data.get('notes'),
                'created_at': datetime.utcnow().isoformat()
            }
            
            return jsonify({
                'message': 'Weight entry added successfully',
                'entry': weight_entries[entry_id]
            }), 201
        
        elif request.method == 'GET':
            # Get weight entries for this athlete
            athlete_entries = [
                entry for entry in weight_entries.values() 
                if entry['athlete_id'] == user_id
            ]
            
            return jsonify({
                'entries': athlete_entries
            })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/assessment', methods=['POST', 'GET'])
def assessment_management():
    try:
        if 'user_id' not in session or session.get('role') != 'athlete':
            return jsonify({'error': 'Athlete access required'}), 403
        
        user_id = session['user_id']
        
        if request.method == 'POST':
            data = request.get_json()
            
            if 'answers' not in data:
                return jsonify({'error': 'Assessment answers are required'}), 400
            
            # Calculate week start date (Monday)
            today = date.today()
            week_start = today - timedelta(days=today.weekday())
            
            assessment_id = generate_id()
            assessments[assessment_id] = {
                'id': assessment_id,
                'athlete_id': user_id,
                'week_date': week_start.isoformat(),
                'answers': data['answers'],
                'submitted_at': datetime.utcnow().isoformat()
            }
            
            return jsonify({
                'message': 'Assessment submitted successfully',
                'assessment': assessments[assessment_id]
            }), 201
        
        elif request.method == 'GET':
            # Get latest assessment for this athlete
            athlete_assessments = [
                assessment for assessment in assessments.values() 
                if assessment['athlete_id'] == user_id
            ]
            
            if athlete_assessments:
                latest = max(athlete_assessments, key=lambda x: x['submitted_at'])
                return jsonify(latest)
            else:
                return jsonify({'message': 'No assessment found'}), 404
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['GET', 'POST', 'PUT'])
def task_management():
    try:
        if 'user_id' not in session or session.get('role') != 'athlete':
            return jsonify({'error': 'Athlete access required'}), 403
        
        user_id = session['user_id']
        
        if request.method == 'GET':
            athlete_tasks = [
                task for task in tasks.values() 
                if task['athlete_id'] == user_id
            ]
            return jsonify({
                'tasks': athlete_tasks
            })
        
        elif request.method == 'POST':
            data = request.get_json()
            
            if 'name' not in data:
                return jsonify({'error': 'Task name is required'}), 400
            
            task_id = generate_id()
            tasks[task_id] = {
                'id': task_id,
                'athlete_id': user_id,
                'name': data['name'],
                'description': data.get('description'),
                'task_type': data.get('task_type'),
                'completed': False,
                'progress': 0,
                'target': data.get('target'),
                'due_date': data.get('due_date'),
                'created_at': datetime.utcnow().isoformat()
            }
            
            return jsonify({
                'message': 'Task created successfully',
                'task': tasks[task_id]
            }), 201
        
        elif request.method == 'PUT':
            data = request.get_json()
            task_id = data.get('id')
            
            if not task_id or task_id not in tasks:
                return jsonify({'error': 'Task not found'}), 404
            
            task = tasks[task_id]
            if task['athlete_id'] != user_id:
                return jsonify({'error': 'Unauthorized'}), 403
            
            # Update task fields
            if 'name' in data:
                task['name'] = data['name']
            if 'description' in data:
                task['description'] = data['description']
            if 'completed' in data:
                task['completed'] = data['completed']
                if data['completed']:
                    task['completed_at'] = datetime.utcnow().isoformat()
            if 'progress' in data:
                task['progress'] = data['progress']
            
            return jsonify({
                'message': 'Task updated successfully',
                'task': task
            })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/athlete/dashboard', methods=['GET'])
def athlete_dashboard_data():
    try:
        if 'user_id' not in session or session.get('role') != 'athlete':
            return jsonify({'error': 'Athlete access required'}), 403
        
        user_id = session['user_id']
        
        # Get recent weight entries (last 7 days)
        week_ago = date.today() - timedelta(days=7)
        recent_weights = [
            entry for entry in weight_entries.values()
            if entry['athlete_id'] == user_id and 
            datetime.fromisoformat(entry['date']).date() >= week_ago
        ]
        
        # Get latest assessment
        athlete_assessments = [
            assessment for assessment in assessments.values()
            if assessment['athlete_id'] == user_id
        ]
        latest_assessment = max(athlete_assessments, key=lambda x: x['submitted_at']) if athlete_assessments else None
        
        # Get active tasks
        active_tasks = [
            task for task in tasks.values()
            if task['athlete_id'] == user_id and not task['completed']
        ]
        
        return jsonify({
            'athlete': athletes.get(user_id, {}),
            'recent_weights': recent_weights,
            'latest_assessment': latest_assessment,
            'active_tasks': active_tasks
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
