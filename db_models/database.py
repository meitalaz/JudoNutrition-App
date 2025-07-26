import sqlite3
import json
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class Database:
    def __init__(self, db_name='judo_nutrition.db'):
        self.db_name = db_name
        self.init_database()
    
    def get_connection(self):
        conn = sqlite3.connect(self.db_name)
        conn.row_factory = sqlite3.Row  # מאפשר גישה לעמודות בשם
        return conn
    
    def init_database(self):
        """יצירת הטבלאות במסד הנתונים"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # טבלת משתמשים
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT CHECK (role IN ('athlete', 'nutritionist')) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # טבלת ספורטאים
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS athletes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                age INTEGER,
                gender TEXT CHECK (gender IN ('male', 'female')),
                weight_category REAL,
                sport_level TEXT,
                target_weight REAL,
                next_competition DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # טבלת רישומי משקל
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS weight_entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                athlete_id INTEGER REFERENCES athletes(id) ON DELETE CASCADE,
                weight REAL NOT NULL,
                timing TEXT,
                notes TEXT,
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # טבלת הערכות שבועיות
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS weekly_assessments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                athlete_id INTEGER REFERENCES athletes(id) ON DELETE CASCADE,
                responses TEXT, -- JSON string
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # טבלת הודעות
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_read BOOLEAN DEFAULT FALSE
            )
        ''')
        
        # טבלת תחרויות
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS competitions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                athlete_id INTEGER REFERENCES athletes(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                competition_date DATE NOT NULL,
                weight_category REAL,
                target_weight REAL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        print("✅ מסד הנתונים נוצר בהצלחה!")
    
    def create_user(self, email, password, role):
        """יצירת משתמש חדש"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            password_hash = generate_password_hash(password)
            cursor.execute('''
                INSERT INTO users (email, password_hash, role)
                VALUES (?, ?, ?)
            ''', (email, password_hash, role))
            
            user_id = cursor.lastrowid
            conn.commit()
            conn.close()
            return user_id
        except sqlite3.IntegrityError:
            conn.close()
            return None  # אימייל כבר קיים
    
    def verify_user(self, email, password):
        """אימות משתמש"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        conn.close()
        
        if user and check_password_hash(user['password_hash'], password):
            return dict(user)
        return None
    
    def create_athlete_profile(self, user_id, name, age, gender, weight_category, sport_level):
        """יצירת פרופיל ספורטאי"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO athletes (user_id, name, age, gender, weight_category, sport_level, target_weight)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, name, age, gender, weight_category, sport_level, weight_category))
        
        athlete_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return athlete_id
    
    def get_athlete_by_user_id(self, user_id):
        """קבלת פרטי ספורטאי לפי user_id"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM athletes WHERE user_id = ?', (user_id,))
        athlete = cursor.fetchone()
        conn.close()
        
        return dict(athlete) if athlete else None
    
    def add_weight_entry(self, athlete_id, weight, timing=None, notes=None):
        """הוספת רישום משקל"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO weight_entries (athlete_id, weight, timing, notes)
            VALUES (?, ?, ?, ?)
        ''', (athlete_id, weight, timing, notes))
        
        conn.commit()
        conn.close()
        return cursor.lastrowid
    
    def get_weight_history(self, athlete_id, limit=30):
        """קבלת היסטוריית משקל"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT weight, DATE(recorded_at) as date, timing, notes
            FROM weight_entries 
            WHERE athlete_id = ?
            ORDER BY recorded_at DESC
            LIMIT ?
        ''', (athlete_id, limit))
        
        weights = cursor.fetchall()
        conn.close()
        return [dict(row) for row in weights]
    
    def save_weekly_assessment(self, athlete_id, responses):
        """שמירת הערכה שבועית"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        responses_json = json.dumps(responses, ensure_ascii=False)
        cursor.execute('''
            INSERT INTO weekly_assessments (athlete_id, responses)
            VALUES (?, ?)
        ''', (athlete_id, responses_json))
        
        conn.commit()
        conn.close()
        return cursor.lastrowid
    
    def get_latest_assessment(self, athlete_id):
        """קבלת ההערכה השבועית האחרונה"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT responses, completed_at
            FROM weekly_assessments 
            WHERE athlete_id = ?
            ORDER BY completed_at DESC
            LIMIT 1
        ''', (athlete_id,))
        
        assessment = cursor.fetchone()
        conn.close()
        
        if assessment:
            return {
                'responses': json.loads(assessment['responses']),
                'completed_at': assessment['completed_at']
            }
        return None
    
    def add_message(self, sender_id, receiver_id, content):
        """הוספת הודעה"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO messages (sender_id, receiver_id, content)
            VALUES (?, ?, ?)
        ''', (sender_id, receiver_id, content))
        
        conn.commit()
        conn.close()
        return cursor.lastrowid
    
    def get_messages(self, user1_id, user2_id, limit=50):
        """קבלת הודעות בין שני משתמשים"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT m.*, u.email as sender_email
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE (m.sender_id = ? AND m.receiver_id = ?)
               OR (m.sender_id = ? AND m.receiver_id = ?)
            ORDER BY m.timestamp ASC
            LIMIT ?
        ''', (user1_id, user2_id, user2_id, user1_id, limit))
        
        messages = cursor.fetchall()
        conn.close()
        return [dict(row) for row in messages]
    
    def mark_messages_as_read(self, receiver_id, sender_id):
        """סמן הודעות כנקראו"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE messages 
            SET is_read = TRUE 
            WHERE receiver_id = ? AND sender_id = ? AND is_read = FALSE
        ''', (receiver_id, sender_id))
        
        conn.commit()
        conn.close()
        return cursor.rowcount
    
    def get_all_athletes_for_nutritionist(self, nutritionist_id):
        """קבלת כל הספורטאים עבור תזונאית"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # לעת עתה מחזיר את כל הספורטאים - בעתיד נוסיף קשר ספציפי
        cursor.execute('''
            SELECT a.*, u.email,
                   w.weight as current_weight,
                   w.recorded_at as last_weigh_in
            FROM athletes a
            JOIN users u ON a.user_id = u.id
            LEFT JOIN (
                SELECT athlete_id, weight, recorded_at,
                       ROW_NUMBER() OVER (PARTITION BY athlete_id ORDER BY recorded_at DESC) as rn
                FROM weight_entries
            ) w ON a.id = w.athlete_id AND w.rn = 1
            WHERE u.role = 'athlete'
            ORDER BY a.name
        ''')
        
        athletes = cursor.fetchall()
        conn.close()
        return [dict(row) for row in athletes]

# פונקציה ליצירת נתונים לדוגמה
def create_sample_data():
    """יצירת נתונים לדוגמה לבדיקה"""
    db = Database()
    
    print("🔄 יוצר נתונים לדוגמה...")
    
    # יצירת תזונאית
    nutritionist_id = db.create_user(
        email="nutritionist@judo.co.il",
        password="123456",
        role="nutritionist"
    )
    
    # יצירת ספורטאים לדוגמה
    athletes_data = [
        {
            "email": "danny@judo.co.il",
            "password": "123456",
            "name": "דני כהן",
            "age": 22,
            "gender": "male",
            "weight_category": 73.0,
            "sport_level": "advanced"
        },
        {
            "email": "sarah@judo.co.il", 
            "password": "123456",
            "name": "שרה לוי",
            "age": 19,
            "gender": "female",
            "weight_category": 57.0,
            "sport_level": "intermediate"
        },
        {
            "email": "michael@judo.co.il",
            "password": "123456", 
            "name": "מיכאל אברהם",
            "age": 25,
            "gender": "male",
            "weight_category": 81.0,
            "sport_level": "professional"
        }
    ]
    
    for athlete_data in athletes_data:
        # יצירת משתמש
        user_id = db.create_user(
            email=athlete_data["email"],
            password=athlete_data["password"],
            role="athlete"
        )
        
        if user_id:
            # יצירת פרופיל ספורטאי
            athlete_id = db.create_athlete_profile(
                user_id=user_id,
                name=athlete_data["name"],
                age=athlete_data["age"],
                gender=athlete_data["gender"],
                weight_category=athlete_data["weight_category"],
                sport_level=athlete_data["sport_level"]
            )
            
            # הוספת כמה רישומי משקל לדוגמה
            import random
            from datetime import datetime, timedelta
            
            base_weight = athlete_data["weight_category"] + random.uniform(0.5, 3.0)
            
            for i in range(10):
                date_offset = timedelta(days=i)
                weight_variation = random.uniform(-0.3, 0.2)
                weight = base_weight - (i * 0.1) + weight_variation
                
                db.add_weight_entry(
                    athlete_id=athlete_id,
                    weight=round(weight, 1),
                    timing="לפני ארוחת בוקר"
                )
            
            print(f"✅ נוצר ספורטאי: {athlete_data['name']}")
    
    print("🎉 נתונים לדוגמה נוצרו בהצלחה!")

if __name__ == "__main__":
    # אתחול מסד הנתונים ויצירת נתונים לדוגמה
    create_sample_data()