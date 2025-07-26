from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import json

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'athlete' or 'nutritionist'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    athlete = db.relationship('Athlete', backref='user', uselist=False, cascade='all, delete-orphan')
    nutritionist = db.relationship('Nutritionist', backref='user', uselist=False, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active
        }

class Athlete(db.Model):
    __tablename__ = 'athletes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))  # 'male', 'female', 'other'
    weight_category = db.Column(db.String(50))
    sport_level = db.Column(db.String(50))  # 'beginner', 'intermediate', 'advanced', 'professional'
    height = db.Column(db.Float)  # in cm
    target_weight = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    weight_entries = db.relationship('WeightEntry', backref='athlete', cascade='all, delete-orphan')
    assessments = db.relationship('WeeklyAssessment', backref='athlete', cascade='all, delete-orphan')
    tasks = db.relationship('Task', backref='athlete', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'age': self.age,
            'gender': self.gender,
            'weight_category': self.weight_category,
            'sport_level': self.sport_level,
            'height': self.height,
            'target_weight': self.target_weight,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Nutritionist(db.Model):
    __tablename__ = 'nutritionists'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    license_number = db.Column(db.String(50))
    specialization = db.Column(db.String(100))
    experience_years = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'license_number': self.license_number,
            'specialization': self.specialization,
            'experience_years': self.experience_years,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class WeightEntry(db.Model):
    __tablename__ = 'weight_entries'
    
    id = db.Column(db.Integer, primary_key=True)
    athlete_id = db.Column(db.Integer, db.ForeignKey('athletes.id'), nullable=False)
    weight = db.Column(db.Float, nullable=False)  # in kg
    date = db.Column(db.Date, nullable=False)
    timing = db.Column(db.String(20))  # 'morning', 'afternoon', 'evening', 'before_training', 'after_training'
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'athlete_id': self.athlete_id,
            'weight': self.weight,
            'date': self.date.isoformat() if self.date else None,
            'timing': self.timing,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class WeeklyAssessment(db.Model):
    __tablename__ = 'weekly_assessments'
    
    id = db.Column(db.Integer, primary_key=True)
    athlete_id = db.Column(db.Integer, db.ForeignKey('athletes.id'), nullable=False)
    week_date = db.Column(db.Date, nullable=False)  # Start of the week
    answers_json = db.Column(db.Text, nullable=False)  # JSON string of answers
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_answers(self, answers):
        self.answers_json = json.dumps(answers, ensure_ascii=False)
    
    def get_answers(self):
        return json.loads(self.answers_json) if self.answers_json else {}
    
    def to_dict(self):
        return {
            'id': self.id,
            'athlete_id': self.athlete_id,
            'week_date': self.week_date.isoformat() if self.week_date else None,
            'answers': self.get_answers(),
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None
        }

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    athlete_id = db.Column(db.Integer, db.ForeignKey('athletes.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    task_type = db.Column(db.String(50))  # 'nutrition', 'training', 'recovery', 'measurement'
    completed = db.Column(db.Boolean, default=False)
    progress = db.Column(db.Integer, default=0)  # 0-100
    target = db.Column(db.String(100))  # Target value or goal
    due_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'athlete_id': self.athlete_id,
            'name': self.name,
            'description': self.description,
            'task_type': self.task_type,
            'completed': self.completed,
            'progress': self.progress,
            'target': self.target,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    athlete_id = db.Column(db.Integer, db.ForeignKey('athletes.id'), nullable=False)
    nutritionist_id = db.Column(db.Integer, db.ForeignKey('nutritionists.id'), nullable=True)
    message = db.Column(db.Text, nullable=False)
    sender_type = db.Column(db.String(20), nullable=False)  # 'athlete' or 'nutritionist'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'athlete_id': self.athlete_id,
            'nutritionist_id': self.nutritionist_id,
            'message': self.message,
            'sender_type': self.sender_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_read': self.is_read
        } 