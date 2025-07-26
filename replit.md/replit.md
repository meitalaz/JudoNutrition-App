# JudoNutrition - Nutritional Management System for Judo Athletes

## Overview

JudoNutrition is a web-based nutritional management system designed specifically for nutritionists managing 50-60 judo athletes annually. The application provides comprehensive tools for tracking athletes' nutritional and physiological metrics, managing athlete profiles, and generating reports for competitions and training periods.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**July 18, 2025**: Major UI/UX enhancement with dual interface system:
- Updated complete color palette to professional blue-based theme (#0F4C81, #0077C8, #FFC20E)
- Created separate athlete interface with bottom navigation (SPA behavior)
- Created enhanced nutritionist interface with professional dashboard
- Added JavaScript-powered tab switching without page refresh
- Implemented responsive mobile-first design for both interfaces
- Fixed JavaScript selector error for anchor links
- Added professional alerts, statistics cards, and enhanced data presentation

**July 19, 2025**: Advanced bidirectional messaging system implementation:
- Built comprehensive nutritionist chat center with athlete management sidebar
- Implemented advanced message status tracking (sent ✓/read ✓✓)
- Added online status indicators with professional animations
- Created smart message filtering and search functionality
- Integrated quick message templates for efficient communication
- Enhanced athlete chat interface with typing indicators
- Added file upload capability with camera integration
- Implemented real-time message synchronization with localStorage

**Latest Update - Professional Landing Page Design**:
- Redesigned landing page with minimal, professional approach
- Created custom SVG logo with judo gi (uniform) and black belt design
- Updated inspirational quote: "התזונה הנכונה היא הבסיס להישגים באמנויות הלחימה"
- Added professional SVG icons for athlete and nutritionist buttons
- Implemented clean side-by-side button layout with proper spacing
- Maintained professional blue color scheme with subtle effects
- Added smooth hover animations for better user interaction
- Removed childish emoji elements for mature, professional appearance

New Route Structure:
- `/` - Landing page with interface selection
- `/athlete` - Athlete home with bottom nav (home, weight, assessment, chat)  
- `/nutritionist` - Enhanced nutritionist dashboard with professional alerts
- `/nutritionist/athletes` - Advanced athlete management with filtering
- `/nutritionist/chat` - Advanced messaging center with real-time communication
- API endpoints for SPA functionality

## System Architecture

### Frontend Architecture
- **Framework**: Server-side rendered Flask application with Jinja2 templates
- **UI Framework**: Bootstrap 5.3.0 with RTL (Right-to-Left) support for Hebrew language
- **Styling**: Custom CSS with CSS variables for theming and mobile-first responsive design
- **JavaScript**: Vanilla JavaScript for client-side interactions and form handling
- **Language Support**: Hebrew interface with proper RTL layout and Hebrew fonts (Rubik, Heebo)

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Database ORM**: SQLAlchemy with Flask-SQLAlchemy extension
- **Authentication**: Flask-Login (imported but not yet implemented)
- **Session Management**: Flask sessions with configurable secret key
- **Middleware**: ProxyFix for handling reverse proxy headers

### Data Storage Solutions
- **Primary Database**: SQLite for development (configurable via DATABASE_URL environment variable)
- **Production Ready**: Supports PostgreSQL and other SQLAlchemy-compatible databases
- **Connection Pooling**: Configured with pool recycling and pre-ping for reliability
- **Schema Management**: Automatic table creation on application startup

## Key Components

### Models
1. **User Model**: Represents nutritionists with authentication capabilities
   - Fields: username, email, password_hash, full_name, created_at
   - Relationships: One-to-many with athletes

2. **Athlete Model**: Represents judo athletes being managed
   - Fields: personal info (name, email, phone, birth_date), judo-specific data (weight_category, gender)
   - Tracking: created_at, updated_at, is_active status
   - Relationships: Many-to-one with nutritionist

### Route Structure
- `/` - Landing page with application overview
- `/dashboard` - Main dashboard with statistics and recent activity
- `/athletes` - Athlete management interface
- `/athletes/new` - Add new athlete form
- `/nutrition` - Nutrition tracking (placeholder)
- `/analysis` - Analysis and reports (placeholder)
- `/competitions` - Competition tracking (placeholder)

### Template System
- **Base Template**: Provides consistent layout with Hebrew RTL support
- **Error Handling**: Custom 404 and 500 error pages
- **Component Structure**: Modular templates for different sections
- **Responsive Design**: Mobile-first approach with Bootstrap grid system

## Data Flow

1. **User Access**: Nutritionist accesses the web application
2. **Dashboard View**: System displays athlete statistics and recent activity
3. **Athlete Management**: CRUD operations for athlete profiles
4. **Data Persistence**: All changes saved to SQLAlchemy-managed database
5. **Real-time Updates**: Statistics automatically reflect current data state

## External Dependencies

### Python Packages
- Flask: Web framework
- Flask-SQLAlchemy: Database ORM
- Flask-Login: User authentication (prepared for implementation)
- Werkzeug: WSGI utilities and security

### Frontend Libraries
- Bootstrap 5.3.0 RTL: UI framework with right-to-left support
- Font Awesome 6.4.0: Icon library
- Google Fonts: Hebrew fonts (Rubik, Heebo)

### Development Tools
- SQLite: Development database
- Python logging: Application monitoring and debugging

## Deployment Strategy

### Configuration Management
- Environment-based configuration using os.environ
- Configurable database URL for different environments
- Session secret key management for security
- Debug mode toggle for development vs production

### Production Considerations
- ProxyFix middleware for reverse proxy deployment
- Database connection pooling with health checks
- Proper session secret key configuration
- Host binding to 0.0.0.0 for container deployment

### Development Setup
- Built-in Flask development server
- Hot reloading enabled in debug mode
- SQLite database for quick local development
- Comprehensive logging for debugging

### Architecture Decisions Rationale

1. **Flask over Django**: Chosen for simplicity and flexibility, better suited for focused application requirements
2. **SQLAlchemy**: Provides database abstraction and easy migration path to production databases
3. **Server-side Rendering**: Simplifies deployment and provides better SEO and initial load performance
4. **Bootstrap RTL**: Essential for proper Hebrew language support and professional UI
5. **SQLite for Development**: Enables quick setup without external database dependencies
6. **Environment Configuration**: Supports smooth transition from development to production environments

The application is currently in early development phase with core infrastructure established and ready for feature implementation including authentication, nutrition tracking, and reporting capabilities.