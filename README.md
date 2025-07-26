# 🥋 JudoNutrition - Flask Application

## 📋 Overview

JudoNutrition is a comprehensive nutrition tracking and management system designed specifically for judo athletes and nutritionists. The application provides weight tracking, weekly assessments, task management, and communication features.

## ✨ Features

### For Athletes:
- **Weight Tracking**: Monitor weight changes over time with detailed charts
- **Weekly Assessments**: Complete 13-question assessments covering nutrition, training, and recovery
- **Task Management**: Create and track nutrition and training tasks
- **Progress Dashboard**: View comprehensive progress overview
- **Chat System**: Communicate with nutritionists

### For Nutritionists:
- **Athlete Management**: View and manage multiple athletes
- **Progress Monitoring**: Track athlete progress and assessments
- **Communication**: Chat with athletes
- **Analytics**: View weight trends and assessment data

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd judoNutrition
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## 📁 Project Structure

```
judoNutrition/
├── app.py                    # Main Flask application
├── static/
│   ├── css/
│   │   └── main.css         # Main stylesheet
│   ├── js/
│   │   └── main.js          # Main JavaScript file
│   └── images/
│       └── judo-gi.png      # Judo gi image
├── templates/
│   ├── index.html           # Main landing page
│   ├── athlete_home.html    # Athlete dashboard
│   ├── nutritionist_dashboard.html  # Nutritionist dashboard
│   └── ...                  # Other templates
├── models.py                # Database models (for future use)
├── routes.py                # API routes (for future use)
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## 🗄️ Data Storage

### Current Implementation:
- **In-Memory Storage**: Uses Python dictionaries for data storage
- **Session Management**: Flask sessions for user authentication
- **Simple Password Hashing**: Basic password protection

### Future Database Integration:
- **SQLAlchemy Models**: Ready for database integration
- **PostgreSQL Support**: Production-ready database setup
- **Data Migration**: Easy transition from in-memory to database

## 🔌 API Endpoints

### Authentication:
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user/profile` - Get user profile

### Athlete Features:
- `GET/POST /api/weight` - Weight tracking
- `GET/POST /api/assessment` - Weekly assessments
- `GET/POST/PUT /api/tasks` - Task management
- `GET /api/athlete/dashboard` - Dashboard data

### Nutritionist Features:
- `GET /api/nutritionist/athletes` - List all athletes
- `GET /api/nutritionist/athlete/<id>` - Get athlete details

### Communication:
- `GET/POST /api/chat/messages` - Chat functionality

## 🎨 Design Features

- **Hebrew RTL Support**: Full right-to-left text support
- **Professional Judo Styling**: Brand colors (#1a237e, #26a69a)
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Professional transitions and hover effects
- **Chart.js Integration**: Beautiful weight tracking charts

## 🔧 Configuration

### Environment Variables:
- `SESSION_SECRET`: Flask session secret key (default: dev-secret-key-change-in-production)

### Database (Future):
For production database integration:
```bash
export DATABASE_URL="postgresql://username:password@localhost/judonutrition"
```

## 🧪 Testing

To test the application:

1. **Register as an Athlete**:
   - Go to the main page
   - Click "אני ספורטאי/ת"
   - Fill out the registration form

2. **Register as a Nutritionist**:
   - Go to the main page
   - Click "אני תזונאי/ת"
   - Fill out the registration form

3. **Test Features**:
   - Add weight entries
   - Complete weekly assessments
   - Create and manage tasks
   - Use the chat system

## 🚀 Deployment

### Local Development:
```bash
python app.py
```

### Production Deployment:
1. Set up a production database (PostgreSQL recommended)
2. Configure environment variables
3. Use a production WSGI server (Gunicorn, uWSGI)
4. Set up reverse proxy (Nginx)

Example with Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

## 🔄 Version History

- **v1.0.0**: Initial Flask implementation
  - Complete user authentication system
  - Weight tracking with charts
  - Weekly assessment system
  - Task management
  - Chat functionality
  - Professional Hebrew RTL UI
  - In-memory data storage for immediate use

## 🛠️ Technical Notes

### Current Architecture:
- **Flask 3.0.0**: Latest stable Flask version
- **In-Memory Storage**: Fast development and testing
- **Session-Based Auth**: Secure user authentication
- **RESTful API**: Clean API design

### Future Enhancements:
- **Database Integration**: SQLAlchemy with PostgreSQL
- **JWT Authentication**: Token-based authentication
- **Real-time Chat**: WebSocket integration
- **File Upload**: Image and document uploads
- **Email Notifications**: Automated reminders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**🥋 Built with ❤️ for the Judo community** 