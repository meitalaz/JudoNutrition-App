from flask import render_template, request, jsonify, session, redirect, url_for, flash
from app import app, db
from models import User, Athlete, Nutritionist, WeightEntry, WeeklyAssessment, Task, ChatMessage
from datetime import datetime, date, timedelta
import json
from functools import wraps

# Authentication decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def athlete_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        user = User.query.get(session['user_id'])
        if not user or user.role != 'athlete':
            return jsonify({'error': 'Athlete access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def nutritionist_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        user = User.query.get(session['user_id'])
        if not user or user.role != 'nutritionist':
            return jsonify({'error': 'Nutritionist access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Main routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/athlete')
@athlete_required
def athlete_dashboard():
    return render_template('athlete_home.html')

@app.route('/nutritionist')
@nutritionist_required
def nutritionist_dashboard():
    return render_template('nutritionist_dashboard.html')

# Authentication routes
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
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'User already exists'}), 409
        
        # Create user
        user = User(
            email=data['email'],
            role=data['role']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.flush()  # Get the user ID
        
        # Create role-specific profile
        if data['role'] == 'athlete':
            athlete = Athlete(
                user_id=user.id,
                name=data['name'],
                age=data.get('age'),
                gender=data.get('gender'),
                weight_category=data.get('weight_category'),
                sport_level=data.get('sport_level'),
                height=data.get('height'),
                target_weight=data.get('target_weight')
            )
            db.session.add(athlete)
        elif data['role'] == 'nutritionist':
            nutritionist = Nutritionist(
                user_id=user.id,
                name=data['name'],
                license_number=data.get('license_number'),
                specialization=data.get('specialization'),
                experience_years=data.get('experience_years')
            )
            db.session.add(nutritionist)
        
        db.session.commit()
        
        # Log in the user
        session['user_id'] = user.id
        session['user_role'] = user.role
        
        return jsonify({
            'message': 'Registration successful',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 403
        
        session['user_id'] = user.id
        session['user_role'] = user.role
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful'})

@app.route('/api/user/profile', methods=['GET'])
@login_required
def get_user_profile():
    try:
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        profile_data = user.to_dict()
        
        if user.role == 'athlete' and user.athlete:
            profile_data['athlete'] = user.athlete.to_dict()
        elif user.role == 'nutritionist' and user.nutritionist:
            profile_data['nutritionist'] = user.nutritionist.to_dict()
        
        return jsonify(profile_data)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Weight tracking routes
@app.route('/api/weight', methods=['POST', 'GET'])
@athlete_required
def weight_management():
    try:
        user = User.query.get(session['user_id'])
        athlete = user.athlete
        
        if request.method == 'POST':
            data = request.get_json()
            
            if 'weight' not in data:
                return jsonify({'error': 'Weight is required'}), 400
            
            weight_entry = WeightEntry(
                athlete_id=athlete.id,
                weight=float(data['weight']),
                date=datetime.strptime(data.get('date', date.today().isoformat()), '%Y-%m-%d').date(),
                timing=data.get('timing'),
                notes=data.get('notes')
            )
            
            db.session.add(weight_entry)
            db.session.commit()
            
            return jsonify({
                'message': 'Weight entry added successfully',
                'entry': weight_entry.to_dict()
            }), 201
        
        elif request.method == 'GET':
            # Get weight entries with optional date range
            start_date = request.args.get('start_date')
            end_date = request.args.get('end_date')
            
            query = WeightEntry.query.filter_by(athlete_id=athlete.id)
            
            if start_date:
                query = query.filter(WeightEntry.date >= datetime.strptime(start_date, '%Y-%m-%d').date())
            if end_date:
                query = query.filter(WeightEntry.date <= datetime.strptime(end_date, '%Y-%m-%d').date())
            
            entries = query.order_by(WeightEntry.date.desc()).all()
            
            return jsonify({
                'entries': [entry.to_dict() for entry in entries]
            })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Assessment routes
@app.route('/api/assessment', methods=['POST', 'GET'])
@athlete_required
def assessment_management():
    try:
        user = User.query.get(session['user_id'])
        athlete = user.athlete
        
        if request.method == 'POST':
            data = request.get_json()
            
            if 'answers' not in data:
                return jsonify({'error': 'Assessment answers are required'}), 400
            
            # Calculate week start date (Monday)
            today = date.today()
            week_start = today - timedelta(days=today.weekday())
            
            # Check if assessment already exists for this week
            existing_assessment = WeeklyAssessment.query.filter_by(
                athlete_id=athlete.id,
                week_date=week_start
            ).first()
            
            if existing_assessment:
                # Update existing assessment
                existing_assessment.set_answers(data['answers'])
                existing_assessment.submitted_at = datetime.utcnow()
                assessment = existing_assessment
            else:
                # Create new assessment
                assessment = WeeklyAssessment(
                    athlete_id=athlete.id,
                    week_date=week_start,
                    answers_json=json.dumps(data['answers'], ensure_ascii=False)
                )
                db.session.add(assessment)
            
            db.session.commit()
            
            return jsonify({
                'message': 'Assessment submitted successfully',
                'assessment': assessment.to_dict()
            }), 201
        
        elif request.method == 'GET':
            # Get latest assessment or specific week
            week_date = request.args.get('week_date')
            
            if week_date:
                target_date = datetime.strptime(week_date, '%Y-%m-%d').date()
                week_start = target_date - timedelta(days=target_date.weekday())
                assessment = WeeklyAssessment.query.filter_by(
                    athlete_id=athlete.id,
                    week_date=week_start
                ).first()
            else:
                # Get latest assessment
                assessment = WeeklyAssessment.query.filter_by(
                    athlete_id=athlete.id
                ).order_by(WeeklyAssessment.week_date.desc()).first()
            
            if assessment:
                return jsonify(assessment.to_dict())
            else:
                return jsonify({'message': 'No assessment found'}), 404
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Task management routes
@app.route('/api/tasks', methods=['GET', 'POST', 'PUT'])
@athlete_required
def task_management():
    try:
        user = User.query.get(session['user_id'])
        athlete = user.athlete
        
        if request.method == 'GET':
            tasks = Task.query.filter_by(athlete_id=athlete.id).order_by(Task.created_at.desc()).all()
            return jsonify({
                'tasks': [task.to_dict() for task in tasks]
            })
        
        elif request.method == 'POST':
            data = request.get_json()
            
            if 'name' not in data:
                return jsonify({'error': 'Task name is required'}), 400
            
            task = Task(
                athlete_id=athlete.id,
                name=data['name'],
                description=data.get('description'),
                task_type=data.get('task_type'),
                target=data.get('target'),
                due_date=datetime.strptime(data['due_date'], '%Y-%m-%d').date() if data.get('due_date') else None
            )
            
            db.session.add(task)
            db.session.commit()
            
            return jsonify({
                'message': 'Task created successfully',
                'task': task.to_dict()
            }), 201
        
        elif request.method == 'PUT':
            data = request.get_json()
            task_id = data.get('id')
            
            if not task_id:
                return jsonify({'error': 'Task ID is required'}), 400
            
            task = Task.query.filter_by(id=task_id, athlete_id=athlete.id).first()
            
            if not task:
                return jsonify({'error': 'Task not found'}), 404
            
            # Update task fields
            if 'name' in data:
                task.name = data['name']
            if 'description' in data:
                task.description = data['description']
            if 'completed' in data:
                task.completed = data['completed']
                if data['completed']:
                    task.completed_at = datetime.utcnow()
                else:
                    task.completed_at = None
            if 'progress' in data:
                task.progress = data['progress']
            
            db.session.commit()
            
            return jsonify({
                'message': 'Task updated successfully',
                'task': task.to_dict()
            })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Athlete dashboard data
@app.route('/api/athlete/dashboard', methods=['GET'])
@athlete_required
def athlete_dashboard_data():
    try:
        user = User.query.get(session['user_id'])
        athlete = user.athlete
        
        # Get recent weight entries (last 7 days)
        week_ago = date.today() - timedelta(days=7)
        recent_weights = WeightEntry.query.filter(
            WeightEntry.athlete_id == athlete.id,
            WeightEntry.date >= week_ago
        ).order_by(WeightEntry.date.desc()).all()
        
        # Get latest assessment
        latest_assessment = WeeklyAssessment.query.filter_by(
            athlete_id=athlete.id
        ).order_by(WeeklyAssessment.week_date.desc()).first()
        
        # Get active tasks
        active_tasks = Task.query.filter_by(
            athlete_id=athlete.id,
            completed=False
        ).order_by(Task.created_at.desc()).all()
        
        # Get completed tasks (last 7 days)
        week_ago = date.today() - timedelta(days=7)
        recent_completed_tasks = Task.query.filter(
            Task.athlete_id == athlete.id,
            Task.completed == True,
            Task.completed_at >= datetime.combine(week_ago, datetime.min.time())
        ).order_by(Task.completed_at.desc()).all()
        
        return jsonify({
            'athlete': athlete.to_dict(),
            'recent_weights': [entry.to_dict() for entry in recent_weights],
            'latest_assessment': latest_assessment.to_dict() if latest_assessment else None,
            'active_tasks': [task.to_dict() for task in active_tasks],
            'recent_completed_tasks': [task.to_dict() for task in recent_completed_tasks]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Nutritionist routes
@app.route('/api/nutritionist/athletes', methods=['GET'])
@nutritionist_required
def get_athletes():
    try:
        athletes = Athlete.query.all()
        return jsonify({
            'athletes': [athlete.to_dict() for athlete in athletes]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/nutritionist/athlete/<int:athlete_id>', methods=['GET'])
@nutritionist_required
def get_athlete_details(athlete_id):
    try:
        athlete = Athlete.query.get_or_404(athlete_id)
        
        # Get weight history
        weight_entries = WeightEntry.query.filter_by(athlete_id=athlete_id).order_by(WeightEntry.date.desc()).all()
        
        # Get assessments
        assessments = WeeklyAssessment.query.filter_by(athlete_id=athlete_id).order_by(WeeklyAssessment.week_date.desc()).all()
        
        # Get tasks
        tasks = Task.query.filter_by(athlete_id=athlete_id).order_by(Task.created_at.desc()).all()
        
        return jsonify({
            'athlete': athlete.to_dict(),
            'weight_entries': [entry.to_dict() for entry in weight_entries],
            'assessments': [assessment.to_dict() for assessment in assessments],
            'tasks': [task.to_dict() for task in tasks]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Chat routes
@app.route('/api/chat/messages', methods=['GET', 'POST'])
@login_required
def chat_messages():
    try:
        user = User.query.get(session['user_id'])
        
        if request.method == 'GET':
            athlete_id = request.args.get('athlete_id')
            
            if user.role == 'athlete':
                messages = ChatMessage.query.filter_by(athlete_id=user.athlete.id).order_by(ChatMessage.created_at.asc()).all()
            elif user.role == 'nutritionist' and athlete_id:
                messages = ChatMessage.query.filter_by(athlete_id=athlete_id).order_by(ChatMessage.created_at.asc()).all()
            else:
                return jsonify({'error': 'Invalid request'}), 400
            
            return jsonify({
                'messages': [message.to_dict() for message in messages]
            })
        
        elif request.method == 'POST':
            data = request.get_json()
            
            if 'message' not in data or 'athlete_id' not in data:
                return jsonify({'error': 'Message and athlete_id are required'}), 400
            
            chat_message = ChatMessage(
                athlete_id=data['athlete_id'],
                nutritionist_id=user.nutritionist.id if user.role == 'nutritionist' else None,
                message=data['message'],
                sender_type=user.role
            )
            
            db.session.add(chat_message)
            db.session.commit()
            
            return jsonify({
                'message': 'Message sent successfully',
                'chat_message': chat_message.to_dict()
            }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('500.html'), 500 