# 🚀 Flask App עם SQLite

פרויקט Flask בסיסי עם מסד נתונים SQLite, תואם ל-Python 3.13.

## ✨ תכונות

- ✅ **SQLite Database** - מסד נתונים מקומי ופשוט
- ✅ **User Authentication** - מערכת הרשמה והתחברות
- ✅ **Posts System** - יצירה וניהול פוסטים
- ✅ **REST API** - נקודות קצה API לנתונים
- ✅ **Hebrew RTL Support** - תמיכה מלאה בעברית
- ✅ **Responsive Design** - עיצוב מותאם למובייל

## 🚀 התקנה והפעלה

### דרישות מקדימות
- Python 3.8 או גבוה יותר
- pip (מתקין חבילות Python)

### התקנה

1. **התקן את התלויות:**
   ```bash
   pip install Flask
   ```

2. **הפעל את האפליקציה:**
   ```bash
   python simple_flask_app.py
   ```

3. **גש לאפליקציה:**
   פתח את הדפדפן ונווט ל-`http://localhost:5000`

## 📁 מבנה הפרויקט

```
simple_flask_app/
├── simple_flask_app.py      # האפליקציה הראשית
├── simple_app.db           # מסד הנתונים SQLite (נוצר אוטומטית)
├── templates/
│   ├── home.html           # דף הבית
│   ├── register.html       # טופס הרשמה
│   ├── login.html          # טופס התחברות
│   ├── dashboard.html      # לוח בקרה
│   └── new_post.html       # יצירת פוסט חדש
└── README_simple_flask.md  # קובץ זה
```

## 🗄️ מסד הנתונים

### טבלאות

#### Users
- `id` - מזהה ייחודי
- `username` - שם משתמש (ייחודי)
- `email` - כתובת אימייל (ייחודית)
- `password` - סיסמה
- `created_at` - תאריך יצירה

#### Posts
- `id` - מזהה ייחודי
- `user_id` - מזהה המשתמש (קשר לטבלת Users)
- `title` - כותרת הפוסט
- `content` - תוכן הפוסט
- `created_at` - תאריך יצירה

## 🔌 נקודות קצה API

### דפים
- `GET /` - דף הבית
- `GET /register` - טופס הרשמה
- `POST /register` - יצירת משתמש חדש
- `GET /login` - טופס התחברות
- `POST /login` - התחברות משתמש
- `GET /dashboard` - לוח בקרה (דורש התחברות)
- `GET /post/new` - יצירת פוסט חדש
- `POST /post/new` - שמירת פוסט חדש
- `GET /logout` - התנתקות

### API
- `GET /api/posts` - קבלת כל הפוסטים עם שמות המשתמשים

## 🎨 עיצוב

האפליקציה כוללת:
- **עיצוב מודרני** עם גרדיאנטים וצללים
- **תמיכה מלאה בעברית** עם כיוון RTL
- **עיצוב רספונסיבי** למובייל ודסקטופ
- **אנימציות חלקות** ומעברים

## 🔧 התאמות

### שינוי פורט
```python
app.run(debug=True, host='0.0.0.0', port=8080)  # שינוי לפורט 8080
```

### שינוי מסד נתונים
```python
DATABASE = 'my_custom_database.db'  # שינוי שם הקובץ
```

### הוספת שדות לטבלאות
```sql
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE posts ADD COLUMN category TEXT;
```

## 🚀 פיתוח עתידי

### תכונות מומלצות להוספה:
- [ ] הצפנת סיסמאות (bcrypt)
- [ ] מערכת הרשאות מתקדמת
- [ ] עריכת ומחיקת פוסטים
- [ ] תגיות וקטגוריות
- [ ] העלאת תמונות
- [ ] מערכת תגובות
- [ ] חיפוש פוסטים
- [ ] דפדוף (pagination)

### שיפורי אבטחה:
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Input validation
- [ ] SQL injection protection (כבר מוגן עם parameterized queries)

## 🐛 פתרון בעיות

### שגיאת פורט תפוס
```bash
# שנה את הפורט בקובץ simple_flask_app.py
app.run(debug=True, host='0.0.0.0', port=5001)
```

### שגיאת מסד נתונים
```bash
# מחק את הקובץ simple_app.db והפעל מחדש
rm simple_app.db
python simple_flask_app.py
```

### שגיאת הרשאות
```bash
# ודא שיש לך הרשאות כתיבה בתיקייה
chmod 755 .
```

## 📝 רישיון

פרויקט זה זמין תחת רישיון MIT.

---

**🎉 נהנים מהפרויקט? תנו ⭐!** 