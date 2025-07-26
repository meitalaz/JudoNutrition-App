// Main JavaScript for JudoNutrition Flask App

// Global variables
let currentUser = null;
let currentRole = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🥋 JudoNutrition Flask App loaded successfully!');
    
    // Check if user is already logged in
    checkAuthStatus();
    
    // Initialize role selection
    initializeRoleSelection();
});

// Check authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
            const userData = await response.json();
            currentUser = userData;
            currentRole = userData.role;
            
            // Redirect to appropriate dashboard
            if (currentRole === 'athlete') {
                window.location.href = '/athlete';
            } else if (currentRole === 'nutritionist') {
                window.location.href = '/nutritionist';
            }
        }
    } catch (error) {
        console.log('User not authenticated');
    }
}

// Initialize role selection
function initializeRoleSelection() {
    const roleButtons = document.querySelectorAll('.role-btn');
    
    roleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const role = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            selectRole(role);
        });
    });
}

// Role selection function
function selectRole(role) {
    const successDiv = document.getElementById('success');
    successDiv.style.display = 'block';
    
    if (role === 'athlete') {
        successDiv.innerHTML = `
            ✅ בחרת: ספורטאי!<br>
            🎉 האפליקציה עובדת מצוין עם Flask!<br>
            🔧 מעבר לדשבורד ספורטאי...
        `;
        
        // Show athlete registration form
        setTimeout(() => {
            showAthleteRegistration();
        }, 2000);
    } else {
        successDiv.innerHTML = `
            ✅ בחרת: תזונאי!<br>
            🎉 האפליקציה עובדת מצוין עם Flask!<br>
            🔧 מעבר לדשבורד תזונאי...
        `;
        
        // Show nutritionist registration form
        setTimeout(() => {
            showNutritionistRegistration();
        }, 2000);
    }
}

// Show athlete registration form
function showAthleteRegistration() {
    const content = document.querySelector('.content');
    content.innerHTML = `
        <div class="form-container">
            <h2>הרשמת ספורטאי</h2>
            <form id="athleteRegistrationForm">
                <div class="form-group">
                    <label for="email">אימייל:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="password">סיסמה:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <div class="form-group">
                    <label for="name">שם מלא:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="age">גיל:</label>
                    <input type="number" id="age" name="age" min="8" max="100">
                </div>
                
                <div class="form-group">
                    <label for="gender">מגדר:</label>
                    <select id="gender" name="gender">
                        <option value="">בחר/י מגדר</option>
                        <option value="male">זכר</option>
                        <option value="female">נקבה</option>
                        <option value="other">אחר</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="weight_category">קטגוריית משקל:</label>
                    <select id="weight_category" name="weight_category">
                        <option value="">בחר/י קטגוריה</option>
                        <option value="lightweight">משקל קל</option>
                        <option value="middleweight">משקל בינוני</option>
                        <option value="heavyweight">משקל כבד</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="sport_level">רמת ספורט:</label>
                    <select id="sport_level" name="sport_level">
                        <option value="">בחר/י רמה</option>
                        <option value="beginner">מתחיל</option>
                        <option value="intermediate">בינוני</option>
                        <option value="advanced">מתקדם</option>
                        <option value="professional">מקצועי</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="height">גובה (ס"מ):</label>
                    <input type="number" id="height" name="height" min="100" max="250">
                </div>
                
                <div class="form-group">
                    <label for="target_weight">משקל יעד (ק"ג):</label>
                    <input type="number" id="target_weight" name="target_weight" min="30" max="200" step="0.1">
                </div>
                
                <button type="submit" class="btn btn-primary">הרשמה</button>
            </form>
            
            <div style="margin-top: 20px; text-align: center;">
                <a href="#" onclick="showLoginForm()" class="btn btn-secondary">יש לי כבר חשבון - התחברות</a>
            </div>
        </div>
    `;
    
    // Add form submission handler
    document.getElementById('athleteRegistrationForm').addEventListener('submit', handleAthleteRegistration);
}

// Show nutritionist registration form
function showNutritionistRegistration() {
    const content = document.querySelector('.content');
    content.innerHTML = `
        <div class="form-container">
            <h2>הרשמת תזונאי</h2>
            <form id="nutritionistRegistrationForm">
                <div class="form-group">
                    <label for="email">אימייל:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="password">סיסמה:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <div class="form-group">
                    <label for="name">שם מלא:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="license_number">מספר רישיון:</label>
                    <input type="text" id="license_number" name="license_number">
                </div>
                
                <div class="form-group">
                    <label for="specialization">התמחות:</label>
                    <input type="text" id="specialization" name="specialization">
                </div>
                
                <div class="form-group">
                    <label for="experience_years">שנות ניסיון:</label>
                    <input type="number" id="experience_years" name="experience_years" min="0" max="50">
                </div>
                
                <button type="submit" class="btn btn-primary">הרשמה</button>
            </form>
            
            <div style="margin-top: 20px; text-align: center;">
                <a href="#" onclick="showLoginForm()" class="btn btn-secondary">יש לי כבר חשבון - התחברות</a>
            </div>
        </div>
    `;
    
    // Add form submission handler
    document.getElementById('nutritionistRegistrationForm').addEventListener('submit', handleNutritionistRegistration);
}

// Show login form
function showLoginForm() {
    const content = document.querySelector('.content');
    content.innerHTML = `
        <div class="form-container">
            <h2>התחברות</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">אימייל:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="password">סיסמה:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" class="btn btn-primary">התחברות</button>
            </form>
            
            <div style="margin-top: 20px; text-align: center;">
                <a href="#" onclick="showAthleteRegistration()" class="btn btn-secondary">הרשמת ספורטאי</a>
                <a href="#" onclick="showNutritionistRegistration()" class="btn btn-secondary">הרשמת תזונאי</a>
            </div>
        </div>
    `;
    
    // Add form submission handler
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// Handle athlete registration
async function handleAthleteRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        role: 'athlete',
        name: formData.get('name'),
        age: formData.get('age') ? parseInt(formData.get('age')) : null,
        gender: formData.get('gender'),
        weight_category: formData.get('weight_category'),
        sport_level: formData.get('sport_level'),
        height: formData.get('height') ? parseFloat(formData.get('height')) : null,
        target_weight: formData.get('target_weight') ? parseFloat(formData.get('target_weight')) : null
    };
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showAlert('הרשמה הושלמה בהצלחה!', 'success');
            setTimeout(() => {
                window.location.href = '/athlete';
            }, 2000);
        } else {
            showAlert(result.error || 'שגיאה בהרשמה', 'error');
        }
    } catch (error) {
        showAlert('שגיאה בחיבור לשרת', 'error');
    }
}

// Handle nutritionist registration
async function handleNutritionistRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        role: 'nutritionist',
        name: formData.get('name'),
        license_number: formData.get('license_number'),
        specialization: formData.get('specialization'),
        experience_years: formData.get('experience_years') ? parseInt(formData.get('experience_years')) : null
    };
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showAlert('הרשמה הושלמה בהצלחה!', 'success');
            setTimeout(() => {
                window.location.href = '/nutritionist';
            }, 2000);
        } else {
            showAlert(result.error || 'שגיאה בהרשמה', 'error');
        }
    } catch (error) {
        showAlert('שגיאה בחיבור לשרת', 'error');
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showAlert('התחברות הושלמה בהצלחה!', 'success');
            setTimeout(() => {
                if (result.user.role === 'athlete') {
                    window.location.href = '/athlete';
                } else {
                    window.location.href = '/nutritionist';
                }
            }, 2000);
        } else {
            showAlert(result.error || 'שגיאה בהתחברות', 'error');
        }
    } catch (error) {
        showAlert('שגיאה בחיבור לשרת', 'error');
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const content = document.querySelector('.content');
    content.insertBefore(alertDiv, content.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// API utility functions
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API Error');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Weight tracking functions
async function addWeightEntry(weight, date, timing, notes) {
    return await apiCall('/api/weight', {
        method: 'POST',
        body: JSON.stringify({
            weight: weight,
            date: date,
            timing: timing,
            notes: notes
        })
    });
}

async function getWeightEntries(startDate = null, endDate = null) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    return await apiCall(`/api/weight?${params.toString()}`);
}

// Assessment functions
async function submitAssessment(answers) {
    return await apiCall('/api/assessment', {
        method: 'POST',
        body: JSON.stringify({ answers: answers })
    });
}

async function getLatestAssessment() {
    return await apiCall('/api/assessment');
}

// Task functions
async function getTasks() {
    return await apiCall('/api/tasks');
}

async function createTask(taskData) {
    return await apiCall('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
    });
}

async function updateTask(taskId, updates) {
    return await apiCall('/api/tasks', {
        method: 'PUT',
        body: JSON.stringify({
            id: taskId,
            ...updates
        })
    });
}

// Dashboard functions
async function getAthleteDashboard() {
    return await apiCall('/api/athlete/dashboard');
}

// Chat functions
async function getChatMessages(athleteId) {
    return await apiCall(`/api/chat/messages?athlete_id=${athleteId}`);
}

async function sendMessage(athleteId, message) {
    return await apiCall('/api/chat/messages', {
        method: 'POST',
        body: JSON.stringify({
            athlete_id: athleteId,
            message: message
        })
    });
}

// Logout function
async function logout() {
    try {
        await apiCall('/api/logout', { method: 'POST' });
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/';
    }
}

// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('he-IL');
}

function formatDateTime(dateTime) {
    return new Date(dateTime).toLocaleString('he-IL');
}

// Export functions for use in other modules
window.JudoNutrition = {
    apiCall,
    addWeightEntry,
    getWeightEntries,
    submitAssessment,
    getLatestAssessment,
    getTasks,
    createTask,
    updateTask,
    getAthleteDashboard,
    getChatMessages,
    sendMessage,
    logout,
    formatDate,
    formatDateTime,
    showAlert
};
