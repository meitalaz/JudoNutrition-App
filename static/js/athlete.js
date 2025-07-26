// Athlete Interface JavaScript
// SPA Navigation and Interactions

let currentTab = 'home';
let tabContent = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeAthleteInterface();
    loadTabContent();
    setupNavigationHandlers();
    setupTaskInteractions();
});

/**
 * Initialize athlete interface
 */
function initializeAthleteInterface() {
    console.log('Athlete interface initialized');
    
    // Set initial active tab
    updateActiveNavItem('home');
    
    // Load initial content
    loadTabContent('home');
    
    // Setup real-time updates (placeholder)
    setupRealTimeUpdates();
}

/**
 * Switch between tabs with SPA behavior
 */
function switchToTab(tabName) {
    if (currentTab === tabName) return;
    
    const previousTab = currentTab;
    currentTab = tabName;
    
    // Update navigation
    updateActiveNavItem(tabName);
    
    // Load content with animation
    loadTabContent(tabName, previousTab);
    
    // Track navigation
    console.log(`Switched from ${previousTab} to ${tabName}`);
}

/**
 * Update active navigation item
 */
function updateActiveNavItem(tabName) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current tab
    const activeItem = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

/**
 * Load tab content dynamically
 */
function loadTabContent(tabName, previousTab = null) {
    const mainContent = document.querySelector('.athlete-main .container-fluid');
    if (!mainContent) return;
    
    // Add loading state
    if (previousTab) {
        mainContent.style.opacity = '0.7';
    }
    
    // Get content for tab
    const content = getTabContent(tabName);
    
    // Animate content change
    setTimeout(() => {
        mainContent.innerHTML = content;
        mainContent.style.opacity = '1';
        mainContent.classList.add('tab-transition');
        
        // Initialize tab-specific functionality
        initializeTabFeatures(tabName);
        
        // Remove animation class
        setTimeout(() => {
            mainContent.classList.remove('tab-transition');
        }, 200);
    }, previousTab ? 150 : 0);
}

/**
 * Get content for specific tab
 */
function getTabContent(tabName) {
    const contents = {
        home: getHomeContent(),
        weight: getWeightContent(),
        assessment: getAssessmentContent(),
        chat: getChatContent()
    };
    
    return contents[tabName] || contents.home;
}

/**
 * Get home tab content
 */
function getHomeContent() {
    return getHomeContentWithWeight();
}

/**
 * Get home content with updated weight
 */
function getHomeContentWithWeight(currentWeight = null) {
    // Get latest weight if not provided
    if (!currentWeight) {
        const weights = JSON.parse(localStorage.getItem(`weights_${ATHLETE_ID}`) || '[]');
        if (weights.length > 0) {
            currentWeight = weights[weights.length - 1].weight;
        } else {
            currentWeight = 68.5; // Default
        }
    }
    
    const targetWeight = 66.0;
    const weightDiff = currentWeight - targetWeight;
    const weightChange = weightDiff > 0 ? `↑ ${weightDiff.toFixed(1)}` : `↓ ${Math.abs(weightDiff).toFixed(1)}`;
    const changeClass = weightDiff > 0 ? 'text-danger' : 'text-success';
    
    return `
        <div class="athlete-home">
            <!-- Status Overview -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card status-card">
                        <div class="card-body text-center">
                            <h4 class="mb-3">היי <span class="athlete-name">דני כהן</span>! 👋</h4>
                            <div class="status-circle mb-3">
                                <div class="progress-ring">
                                    <div class="progress-fill" data-progress="75"></div>
                                </div>
                                <span class="status-text">בדרך ליעד</span>
                            </div>
                            <p class="text-muted">אתה ${Math.abs(weightDiff).toFixed(1)} ק"ג ממשקל היעד לתחרות הבאה</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="row mb-4">
                <div class="col-6">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-weight fa-2x text-primary mb-2"></i>
                            <h5 class="card-title">משקל נוכחי</h5>
                            <h3 class="text-primary">${currentWeight} ק"ג</h3>
                            <small class="${changeClass}">${weightChange} מהיעד</small>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="card stat-card">
                        <div class="card-body text-center">
                            <i class="fas fa-target fa-2x text-secondary mb-2"></i>
                            <h5 class="card-title">יעד</h5>
                            <h3 class="text-secondary">${targetWeight} ק"ג</h3>
                            <small class="text-muted">עד 15/8</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Today's Tasks -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">
                                <i class="fas fa-tasks me-2"></i>
                                משימות היום
                            </h6>
                            <span class="badge bg-primary">2/5</span>
                        </div>
                        <div class="card-body p-0">
                            <div class="task-list">
                                <div class="task-item completed" data-task="morning-weight">
                                    <div class="task-check">
                                        <i class="fas fa-check"></i>
                                    </div>
                                    <div class="task-content">
                                        <span>שקילה בוקר</span>
                                        <small class="text-muted">07:30</small>
                                    </div>
                                </div>
                                
                                <div class="task-item completed" data-task="morning-supplements">
                                    <div class="task-check">
                                        <i class="fas fa-check"></i>
                                    </div>
                                    <div class="task-content">
                                        <span>נטילת תוספי תזונה</span>
                                        <small class="text-muted">עם ארוחת בוקר</small>
                                    </div>
                                </div>
                                
                                <div class="task-item pending" data-task="water-intake">
                                    <div class="task-check">
                                        <i class="far fa-circle"></i>
                                    </div>
                                    <div class="task-content">
                                        <span>הקפדה על שתיית מים</span>
                                        <small class="text-warning">יעד: 2.5-3 ליטרים ליום</small>
                                    </div>
                                </div>
                                
                                <div class="task-item pending" data-task="lunch">
                                    <div class="task-check">
                                        <i class="far fa-circle"></i>
                                    </div>
                                    <div class="task-content">
                                        <span>ארוחת צהריים</span>
                                        <small class="text-warning">12:30 - בקרוב</small>
                                    </div>
                                </div>
                                
                                <div class="task-item pending" data-task="evening-weight">
                                    <div class="task-check">
                                        <i class="far fa-circle"></i>
                                    </div>
                                    <div class="task-content">
                                        <span>שקילה ערב</span>
                                        <small class="text-muted">לפני השינה</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="row mb-5">
                <div class="col-6">
                    <button class="btn btn-primary w-100 quick-action-btn" onclick="switchToTab('weight')">
                        <i class="fas fa-weight fa-lg mb-2"></i>
                        <br>רישום משקל
                    </button>
                </div>
                <div class="col-6">
                    <button class="btn btn-outline-primary w-100 quick-action-btn" onclick="switchToTab('chat')">
                        <i class="fas fa-comments fa-lg mb-2"></i>
                        <br>צ'אט עם התזונאית
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get weight tab content - Advanced interface
 */
function getWeightContent() {
    // Load the advanced weight tracking interface via AJAX
    loadAdvancedWeightInterface();
    
    return `
        <div id="advancedWeightContainer">
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">טוען...</span>
                </div>
                <p class="mt-3 text-muted">טוען מעקב משקל מתקדם...</p>
            </div>
        </div>
    `;
}

/**
 * Load advanced weight tracking interface
 */
function loadAdvancedWeightInterface() {
    setTimeout(() => {
        const container = document.getElementById('advancedWeightContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="weight-tracking-container">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 class="h4 fw-bold text-primary mb-1">מעקב משקל</h2>
                        <p class="text-muted small mb-0">עדכון יומי למעקב אחר ההתקדמות</p>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold text-primary fs-5" id="currentWeight">68.5 ק"ג</div>
                        <small class="text-muted">משקל נוכחי</small>
                    </div>
                </div>

                <!-- Weight Input Section -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-primary text-white">
                        <h6 class="mb-0">
                            <i class="fas fa-weight me-2"></i>
                            רישום משקל חדש
                        </h6>
                    </div>
                    <div class="card-body">
                        <form id="advancedWeightForm">
                            <!-- Weight Input -->
                            <div class="row mb-3">
                                <div class="col-12">
                                    <label for="advancedWeightInput" class="form-label fw-semibold">משקל (ק"ג)</label>
                                    <div class="input-group input-group-lg">
                                        <input 
                                            type="number" 
                                            class="form-control form-control-lg text-center fw-bold" 
                                            id="advancedWeightInput" 
                                            inputmode="decimal"
                                            step="0.1" 
                                            min="40" 
                                            max="200"
                                            placeholder="0.0"
                                            style="font-size: 2rem; border: 2px solid var(--primary-color); border-radius: 12px;"
                                            required>
                                        <span class="input-group-text bg-primary text-white">ק"ג</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Measurement Time -->
                            <div class="row mb-3">
                                <div class="col-12">
                                    <label class="form-label fw-semibold">זמן שקילה</label>
                                    <div class="btn-group-vertical d-grid gap-1" role="group">
                                        <input type="radio" class="btn-check" name="measurementTime" id="morning" value="בוקר" required>
                                        <label class="btn btn-outline-primary text-start" for="morning">
                                            <i class="fas fa-sun me-2"></i>בוקר
                                        </label>
                                        
                                        <input type="radio" class="btn-check" name="measurementTime" id="evening" value="ערב" required>
                                        <label class="btn btn-outline-primary text-start" for="evening">
                                            <i class="fas fa-moon me-2"></i>ערב
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Notes -->
                            <div class="row mb-3">
                                <div class="col-12">
                                    <label for="weightNotes" class="form-label fw-semibold">הערות (אופציונלי)</label>
                                    <textarea class="form-control" id="weightNotes" rows="2" placeholder="איך את/ה מרגיש/ה, שינויים, הערות..."></textarea>
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary btn-lg">
                                    <i class="fas fa-save me-2"></i>
                                    שמור משקל
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Progress Section -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header">
                        <h6 class="mb-0">
                            <i class="fas fa-bullseye me-2"></i>
                            התקדמות ליעד
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-4">
                                <div class="progress-stat">
                                    <div class="h5 fw-bold text-primary mb-1">66.0</div>
                                    <small class="text-muted">יעד</small>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="progress-stat">
                                    <div class="h5 fw-bold text-success mb-1" id="weightDifference">-2.5</div>
                                    <small class="text-muted">נותר</small>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="progress-stat">
                                    <div class="h5 fw-bold text-info mb-1">75%</div>
                                    <small class="text-muted">התקדמות</small>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Progress Bar -->
                        <div class="mt-3">
                            <div class="progress" style="height: 12px;">
                                <div class="progress-bar bg-success" style="width: 75%"></div>
                            </div>
                        </div>
                        
                        <!-- Smart Alerts -->
                        <div id="smartAlerts" class="mt-3">
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                <i class="fas fa-arrow-down me-2"></i>
                                כל הכבוד! ירידה במשקל - ממשיכים כך!
                                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chart Section -->
                <div class="card shadow-sm">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">
                            <i class="fas fa-chart-line me-2"></i>
                            גרף התקדמות - 14 ימים אחרונים
                        </h6>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary" onclick="updateWeightChart(7)">7 ימים</button>
                            <button class="btn btn-primary" onclick="updateWeightChart(14)">14 ימים</button>
                            <button class="btn btn-outline-secondary" onclick="updateWeightChart(30)">30 ימים</button>
                        </div>
                    </div>
                    <div class="card-body">
                        <canvas id="athleteWeightChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize the advanced weight tracking
        initializeAdvancedWeightTracking();
    }, 500);
}

/**
 * Initialize advanced weight tracking functionality
 */
let athleteWeightChart;
const ATHLETE_ID = 'demo_athlete_1';

function initializeAdvancedWeightTracking() {
    console.log('Advanced weight tracking initialized');
    
    // Initialize localStorage if needed
    if (!localStorage.getItem(`weights_${ATHLETE_ID}`)) {
        localStorage.setItem(`weights_${ATHLETE_ID}`, JSON.stringify(generateSampleWeightData()));
    }
    
    setupAdvancedWeightEventListeners();
    updateWeightProgressDisplay();
    createAthleteWeightChart();
}

function setupAdvancedWeightEventListeners() {
    // Weight form submission
    const weightForm = document.getElementById('advancedWeightForm');
    if (weightForm) {
        weightForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAdvancedWeightEntry();
        });
    }
}

function saveAdvancedWeightEntry() {
    const weight = parseFloat(document.getElementById('advancedWeightInput').value);
    const measurementTime = document.querySelector('input[name="measurementTime"]:checked')?.value;
    const notes = document.getElementById('weightNotes')?.value;
    
    if (!weight || !measurementTime) {
        alert('אנא מלא את כל השדות הנדרשים');
        return;
    }
    
    const entry = {
        weight: weight,
        time: measurementTime,
        notes: notes,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
    };
    
    // Save to localStorage
    const weights = JSON.parse(localStorage.getItem(`weights_${ATHLETE_ID}`) || '[]');
    weights.push(entry);
    localStorage.setItem(`weights_${ATHLETE_ID}`, JSON.stringify(weights));
    
    // Reset form
    document.getElementById('advancedWeightForm').reset();
    
    // Update displays
    updateWeightProgressDisplay();
    updateWeightChart(14);
    updateHomeScreenWeight(weight);
    
    // Show success message
    showWeightSuccessAlert('המשקל נשמר בהצלחה!');
}

/**
 * Update weight display on home screen
 */
function updateHomeScreenWeight(newWeight) {
    // Update current weight in home screen if we're on home tab
    const currentTab = document.querySelector('[data-tab].active')?.dataset.tab;
    if (currentTab === 'home') {
        // Re-render home content to reflect new weight
        setTimeout(() => {
            const mainContent = document.querySelector('.athlete-main .container-fluid');
            if (mainContent) {
                mainContent.innerHTML = getHomeContentWithWeight(newWeight);
            }
        }, 1000); // Small delay to allow for success message
    }
}

function updateWeightProgressDisplay() {
    const weights = JSON.parse(localStorage.getItem(`weights_${ATHLETE_ID}`) || '[]');
    if (weights.length === 0) return;
    
    const latestWeight = weights[weights.length - 1].weight;
    const targetWeight = 66.0;
    
    const currentWeightEl = document.getElementById('currentWeight');
    if (currentWeightEl) {
        currentWeightEl.textContent = latestWeight.toFixed(1) + ' ק"ג';
    }
    
    const difference = latestWeight - targetWeight;
    const differenceEl = document.getElementById('weightDifference');
    if (differenceEl) {
        differenceEl.textContent = (difference > 0 ? '+' : '') + difference.toFixed(1);
        differenceEl.className = `h5 fw-bold mb-1 ${difference > 0 ? 'text-warning' : 'text-success'}`;
    }
    
    // Generate smart alerts
    generateWeightSmartAlerts(weights, targetWeight);
}

function generateWeightSmartAlerts(weights, targetWeight) {
    const alertsContainer = document.getElementById('smartAlerts');
    if (!alertsContainer || weights.length < 2) return;
    
    const latest = weights[weights.length - 1];
    const previous = weights[weights.length - 2];
    const change = latest.weight - previous.weight;
    
    let alertClass = '';
    let alertIcon = '';
    let alertText = '';
    
    if (Math.abs(change) > 1.0) {
        alertClass = 'alert-warning';
        alertIcon = 'fas fa-exclamation-triangle';
        alertText = `שים לב: שינוי משמעותי במשקל (${change > 0 ? '+' : ''}${change.toFixed(1)} ק"ג)`;
    } else if (change > 0.5 && latest.weight > targetWeight) {
        alertClass = 'alert-danger';
        alertIcon = 'fas fa-arrow-up';
        alertText = 'עליה במשקל - כדאי לשקול התאמת התזונה';
    } else if (change < -0.3) {
        alertClass = 'alert-success';
        alertIcon = 'fas fa-arrow-down';
        alertText = 'כל הכבוד! ירידה במשקל - ממשיכים כך!';
    }
    
    if (alertText) {
        alertsContainer.innerHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                <i class="${alertIcon} me-2"></i>
                ${alertText}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
}

function createAthleteWeightChart() {
    const ctx = document.getElementById('athleteWeightChart');
    if (!ctx) return;
    
    const weights = JSON.parse(localStorage.getItem(`weights_${ATHLETE_ID}`) || '[]');
    const chartData = prepareWeightChartData(weights, 14);
    
    athleteWeightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'משקל (ק"ג)',
                data: chartData.weights,
                borderColor: '#0077C8',
                backgroundColor: 'rgba(0, 119, 200, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#0077C8',
                pointBorderColor: '#0F4C81',
                pointRadius: 5,
                pointHoverRadius: 8
            }, {
                label: 'יעד',
                data: chartData.targets,
                borderColor: '#FFC20E',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                pointRadius: 0,
                tension: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 64,
                    max: 74,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1) + ' ק"ג';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function updateWeightChart(days) {
    if (!athleteWeightChart) return;
    
    // Update button states
    document.querySelectorAll('.btn-group-sm button').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-secondary');
    });
    
    event.target.classList.remove('btn-outline-secondary');
    event.target.classList.add('btn-primary');
    
    const weights = JSON.parse(localStorage.getItem(`weights_${ATHLETE_ID}`) || '[]');
    const chartData = prepareWeightChartData(weights, days);
    
    athleteWeightChart.data.labels = chartData.labels;
    athleteWeightChart.data.datasets[0].data = chartData.weights;
    athleteWeightChart.data.datasets[1].data = chartData.targets;
    athleteWeightChart.update();
}

function prepareWeightChartData(weights, days) {
    const now = new Date();
    const labels = [];
    const weightData = [];
    const targets = [];
    const targetWeight = 66.0;
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        labels.push(date.toLocaleDateString('he-IL', { month: 'short', day: 'numeric' }));
        
        const dayWeight = weights.find(w => w.date === dateStr);
        weightData.push(dayWeight ? dayWeight.weight : null);
        targets.push(targetWeight);
    }
    
    return { labels, weights: weightData, targets };
}

function generateSampleWeightData() {
    const sampleData = [];
    const now = new Date();
    let weight = 70.5;
    
    for (let i = 13; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        weight -= Math.random() * 0.3 + 0.1;
        
        sampleData.push({
            weight: Math.round(weight * 10) / 10,
            time: 'לפני ארוחת בוקר',
            notes: '',
            timestamp: date.toISOString(),
            date: date.toISOString().split('T')[0]
        });
    }
    
    return sampleData;
}

function showWeightSuccessAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

// ===== QUESTIONNAIRE FUNCTIONS =====

/**
 * Setup questionnaire event handlers
 */
function setupQuestionnaireHandlers() {
    console.log('Setting up questionnaire handlers');
    
    // Set today's date automatically
    const assessmentDate = document.getElementById('assessmentDate');
    if (assessmentDate && !assessmentDate.value) {
        const today = new Date().toISOString().split('T')[0];
        assessmentDate.value = today;
    }
    
    // Check if menstrual question should show (monthly)
    checkMenstrualQuestionVisibility();
    
    // Load saved progress
    loadQuestionnaireProgress();
    
    // Track progress on input changes
    setupProgressTracking();
    
    // Handle conditional questions
    setupConditionalQuestions();
    
    // Handle form submission
    setupQuestionnaireFormHandlers();
    
    // Auto-save functionality
    setupAutoSave();
}

/**
 * Setup progress tracking for all form elements
 */
function setupProgressTracking() {
    const form = document.getElementById('weeklyAssessmentForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', updateQuestionnaireProgress);
        input.addEventListener('input', updateQuestionnaireProgress);
    });
    
    // Initial progress check
    updateQuestionnaireProgress();
}

/**
 * Update questionnaire progress bar
 */
function updateQuestionnaireProgress() {
    const totalQuestions = 14;
    let completedQuestions = 0;
    
    // Check each question (0 is the date field)
    for (let i = 0; i <= totalQuestions-1; i++) {
        const questionCard = document.querySelector(`[data-question="${i}"]`);
        if (!questionCard) continue;
        
        const isRequired = questionCard.querySelector('.required-indicator');
        let isCompleted = false;
        
        switch (i) {
            case 0: // Assessment Date
                isCompleted = document.getElementById('assessmentDate')?.value !== '';
                break;
            case 1: // Daily Weight
                isCompleted = document.getElementById('dailyWeight')?.value !== '';
                break;
            case 2: // Sleep Hours
                isCompleted = document.querySelector('input[name="sleepHours"]:checked') !== null;
                break;
            case 3: // Sleep Quality
                isCompleted = document.querySelector('input[name="sleepQuality"]:checked') !== null;
                break;
            case 4: // Sleep Times
                isCompleted = document.getElementById('sleepTime')?.value !== '' && 
                             document.getElementById('wakeTime')?.value !== '';
                break;
            case 5: // Appetite
                isCompleted = document.querySelector('input[name="appetite"]:checked') !== null;
                break;
            case 6: // Water Intake
                isCompleted = document.getElementById('waterIntake')?.value !== '';
                break;
            case 7: // Supplements (not required)
                isCompleted = true;
                break;
            case 8: // Menstrual Cycle (conditional)
                const applicableToMe = document.getElementById('applicableToMe');
                if (applicableToMe?.checked) {
                    isCompleted = document.querySelector('input[name="menstrualCycle"]:checked') !== null;
                } else {
                    isCompleted = true;
                }
                break;
            case 9: // Health Issues (not required)
                isCompleted = true;
                break;
            case 10: // Mood
                isCompleted = document.querySelector('input[name="mood"]:checked') !== null;
                break;
            case 11: // Energy
                isCompleted = document.querySelector('input[name="energy"]:checked') !== null;
                break;
            case 12: // Recovery
                isCompleted = document.querySelector('input[name="recovery"]:checked') !== null;
                break;
            case 13: // Additional Notes (not required)
                isCompleted = true;
                break;
        }
        
        if (isCompleted || !isRequired) {
            completedQuestions++;
            questionCard.classList.add('completed');
        } else {
            questionCard.classList.remove('completed');
        }
    }
    
    const progressPercentage = (completedQuestions / totalQuestions) * 100;
    const progressBar = document.getElementById('questionnaireProgress');
    const progressText = document.getElementById('progressText');
    
    if (progressBar) progressBar.style.width = `${progressPercentage}%`;
    if (progressText) progressText.textContent = `${completedQuestions}/${totalQuestions}`;
    
    // Update submit button state
    const submitBtn = document.getElementById('submitQuestionnaireBtn');
    if (submitBtn) {
        submitBtn.disabled = progressPercentage < 85; // Allow submit when most questions are complete
    }
}

/**
 * Setup conditional questions logic
 */
function setupConditionalQuestions() {
    // Handle supplements "other" checkbox
    const otherSupplCheckbox = document.getElementById('suppl8');
    const otherSupplDiv = document.getElementById('otherSupplementDiv');
    if (otherSupplCheckbox && otherSupplDiv) {
        otherSupplCheckbox.addEventListener('change', function() {
            otherSupplDiv.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    // Handle menstrual cycle applicable checkbox
    const applicableCheckbox = document.getElementById('applicableToMe');
    const menstrualOptions = document.getElementById('menstrualOptions');
    if (applicableCheckbox && menstrualOptions) {
        applicableCheckbox.addEventListener('change', function() {
            menstrualOptions.style.display = this.checked ? 'block' : 'none';
            updateQuestionnaireProgress();
        });
    }
    
    // Handle health issues checkboxes - injury and other need detail
    const injuryCheckbox = document.getElementById('health1');
    const injuryDetail = document.getElementById('injuryDetail');
    if (injuryCheckbox && injuryDetail) {
        injuryCheckbox.addEventListener('change', function() {
            injuryDetail.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    // Handle "other" health condition checkbox
    const otherHealthCheckbox = document.getElementById('health7');
    const otherHealthDetail = document.getElementById('otherHealthDetail');
    if (otherHealthCheckbox && otherHealthDetail) {
        otherHealthCheckbox.addEventListener('change', function() {
            otherHealthDetail.style.display = this.checked ? 'block' : 'none';
        });
    }
}

/**
 * Setup form submission and save handlers
 */
function setupQuestionnaireFormHandlers() {
    const form = document.getElementById('weeklyAssessmentForm');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const submitBtn = document.getElementById('submitQuestionnaireBtn');
    const sendToNutritionistBtn = document.getElementById('sendToNutritionistBtn');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitQuestionnaire();
        });
    }
    
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            saveQuestionnaireDraft();
        });
    }
    
    if (sendToNutritionistBtn) {
        sendToNutritionistBtn.addEventListener('click', function() {
            sendToNutritionist();
        });
    }
}

/**
 * Setup auto-save functionality
 */
function setupAutoSave() {
    let autoSaveTimer;
    const form = document.getElementById('weeklyAssessmentForm');
    
    if (form) {
        form.addEventListener('input', function() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                saveQuestionnaireDraft(true); // Silent save
            }, 30000); // Auto-save every 30 seconds
        });
    }
}

/**
 * Collect all questionnaire data
 */
function collectQuestionnaireData() {
    const data = {
        timestamp: new Date().toISOString(),
        week: getCurrentWeekDates(),
        answers: {}
    };
    
    // Question 1: Daily Weight
    data.answers.dailyWeight = document.getElementById('dailyWeight')?.value;
    
    // Question 2: Sleep Hours
    data.answers.sleepHours = document.querySelector('input[name="sleepHours"]:checked')?.value;
    
    // Question 3: Sleep Quality
    data.answers.sleepQuality = document.querySelector('input[name="sleepQuality"]:checked')?.value;
    
    // Question 4: Sleep Times
    data.answers.sleepTime = document.getElementById('sleepTime')?.value;
    data.answers.wakeTime = document.getElementById('wakeTime')?.value;
    
    // Question 5: Appetite
    data.answers.appetite = document.querySelector('input[name="appetite"]:checked')?.value;
    
    // Question 6: Water Intake
    data.answers.waterIntake = document.getElementById('waterIntake')?.value;
    data.answers.waterUnit = document.getElementById('waterUnit')?.value;
    
    // Question 7: Supplements
    const supplements = [];
    document.querySelectorAll('input[type="checkbox"][id^="suppl"]:checked').forEach(cb => {
        if (cb.value === 'other') {
            const otherValue = document.getElementById('otherSupplement')?.value;
            if (otherValue) supplements.push(`other: ${otherValue}`);
        } else {
            supplements.push(cb.value);
        }
    });
    data.answers.supplements = supplements;
    
    // Question 8: Menstrual Cycle (with last period date)
    const applicableToMe = document.getElementById('applicableToMe')?.checked;
    data.answers.menstrualApplicable = applicableToMe;
    if (applicableToMe) {
        data.answers.menstrualCycle = document.querySelector('input[name="menstrualCycle"]:checked')?.value;
        data.answers.lastPeriodDate = document.getElementById('lastPeriodDate')?.value;
    }
    
    // Question 9: Health Issues (new structure)
    const healthIssues = [];
    const healthCheckboxes = ['health1', 'health2', 'health3', 'health4', 'health5', 'health6'];
    const healthValues = ['injury', 'stomach-pain', 'muscle-pain', 'constipation', 'diarrhea', 'headaches'];
    
    healthCheckboxes.forEach((checkboxId, index) => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox?.checked) {
            const healthIssue = { type: healthValues[index] };
            
            // Only injury has detail field
            if (healthValues[index] === 'injury') {
                const detail = document.querySelector('#injuryDetail textarea')?.value;
                if (detail) healthIssue.detail = detail;
            }
            
            healthIssues.push(healthIssue);
        }
    });
    data.answers.healthIssues = healthIssues;
    
    // Question 10: Mood
    data.answers.mood = document.querySelector('input[name="mood"]:checked')?.value;
    
    // Question 11: Energy
    data.answers.energy = document.querySelector('input[name="energy"]:checked')?.value;
    
    // Question 12: Recovery
    data.answers.recovery = document.querySelector('input[name="recovery"]:checked')?.value;
    
    // Question 13: Additional Notes
    data.answers.additionalNotes = document.getElementById('additionalNotes')?.value;
    
    return data;
}

/**
 * Save questionnaire as draft
 */
function saveQuestionnaireDraft(silent = false) {
    const data = collectQuestionnaireData();
    const weekKey = `questionnaire_draft_${getCurrentWeekString()}`;
    
    localStorage.setItem(weekKey, JSON.stringify(data));
    
    if (!silent) {
        showQuestionnaireAlert('success', 'הטיוטה נשמרה בהצלחה!');
    }
}

/**
 * Load saved questionnaire progress
 */
function loadQuestionnaireProgress() {
    const weekKey = `questionnaire_draft_${getCurrentWeekString()}`;
    const savedData = localStorage.getItem(weekKey);
    
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        populateFormFromData(data);
        updateQuestionnaireProgress();
    } catch (error) {
        console.error('Error loading questionnaire draft:', error);
    }
}

/**
 * Populate form from saved data
 */
function populateFormFromData(data) {
    const answers = data.answers;
    
    // Populate all saved answers
    if (answers.dailyWeight) document.getElementById('dailyWeight').value = answers.dailyWeight;
    if (answers.sleepHours) document.querySelector(`input[name="sleepHours"][value="${answers.sleepHours}"]`).checked = true;
    if (answers.sleepQuality) document.querySelector(`input[name="sleepQuality"][value="${answers.sleepQuality}"]`).checked = true;
    if (answers.sleepTime) document.getElementById('sleepTime').value = answers.sleepTime;
    if (answers.wakeTime) document.getElementById('wakeTime').value = answers.wakeTime;
    if (answers.appetite) document.querySelector(`input[name="appetite"][value="${answers.appetite}"]`).checked = true;
    if (answers.waterIntake) document.getElementById('waterIntake').value = answers.waterIntake;
    if (answers.waterUnit) document.getElementById('waterUnit').value = answers.waterUnit;
    
    // Populate supplements
    if (answers.supplements) {
        answers.supplements.forEach(supplement => {
            if (supplement.startsWith('other:')) {
                document.getElementById('suppl5').checked = true;
                document.getElementById('otherSupplement').value = supplement.replace('other: ', '');
                document.getElementById('otherSupplementDiv').style.display = 'block';
            } else {
                const checkbox = document.querySelector(`input[value="${supplement}"]`);
                if (checkbox) checkbox.checked = true;
            }
        });
    }
    
    // Populate menstrual cycle
    if (answers.menstrualApplicable) {
        document.getElementById('applicableToMe').checked = true;
        document.getElementById('menstrualOptions').style.display = 'block';
        if (answers.menstrualCycle) {
            document.querySelector(`input[name="menstrualCycle"][value="${answers.menstrualCycle}"]`).checked = true;
        }
    }
    
    // Populate health issues
    if (answers.healthIssues) {
        Object.keys(answers.healthIssues).forEach(issue => {
            const checkboxMap = { pain: 'health1', injury: 'health2', fatigue: 'health3' };
            const detailMap = { pain: 'painDetail', injury: 'injuryDetail', fatigue: 'fatigueDetail' };
            
            const checkbox = document.getElementById(checkboxMap[issue]);
            if (checkbox) {
                checkbox.checked = true;
                const detailDiv = document.getElementById(detailMap[issue]);
                if (detailDiv) {
                    detailDiv.style.display = 'block';
                    const textarea = detailDiv.querySelector('textarea');
                    if (textarea && typeof answers.healthIssues[issue] === 'string') {
                        textarea.value = answers.healthIssues[issue];
                    }
                }
            }
        });
    }
    
    if (answers.mood) document.querySelector(`input[name="mood"][value="${answers.mood}"]`).checked = true;
    if (answers.energy) document.querySelector(`input[name="energy"][value="${answers.energy}"]`).checked = true;
    if (answers.recovery) document.querySelector(`input[name="recovery"][value="${answers.recovery}"]`).checked = true;
    if (answers.additionalNotes) document.getElementById('additionalNotes').value = answers.additionalNotes;
}

/**
 * Submit questionnaire
 */
function submitQuestionnaire() {
    const data = collectQuestionnaireData();
    const weekKey = `questionnaire_completed_${getCurrentWeekString()}`;
    
    // Validate required fields
    const requiredFields = ['dailyWeight', 'sleepHours', 'sleepQuality', 'sleepTime', 'wakeTime', 
                           'appetite', 'waterIntake', 'mood', 'energy', 'recovery'];
    
    const missingFields = requiredFields.filter(field => {
        if (field === 'sleepTime' || field === 'wakeTime') {
            return !data.answers[field];
        }
        return !data.answers[field];
    });
    
    if (missingFields.length > 0) {
        showQuestionnaireAlert('warning', 'אנא השלם את כל השדות הנדרשים לפני שליחת השאלון');
        return;
    }
    
    // Save completed questionnaire
    data.status = 'completed';
    data.submittedAt = new Date().toISOString();
    
    localStorage.setItem(weekKey, JSON.stringify(data));
    
    // Update weight in weight screen
    if (data.answers.dailyWeight) {
        updateWeightFromQuestionnaire(data.answers.dailyWeight);
    }
    
    // Clear draft
    const draftKey = `questionnaire_draft_${getCurrentWeekString()}`;
    localStorage.removeItem(draftKey);
    
    // Show success message and disable form
    showQuestionnaireAlert('success', 'השאלון נשלח בהצלחה! המשקל עודכן במסך המשקל. תודה על השתתפותך.');
    
    // Disable form
    const form = document.getElementById('weeklyAssessmentForm');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea, button');
        inputs.forEach(input => input.disabled = true);
    }
}

/**
 * Show questionnaire alert
 */
function showQuestionnaireAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    
    const iconMap = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        danger: 'fa-times-circle'
    };
    
    alertDiv.innerHTML = `
        <i class="fas ${iconMap[type]} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

/**
 * Get current week dates string
 */
function getCurrentWeekDates() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    
    const formatDate = (date) => {
        return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
    };
    
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
}

/**
 * Get current week string for storage key
 */
function getCurrentWeekString() {
    const today = new Date();
    const year = today.getFullYear();
    const weekNumber = getWeekNumber(today);
    return `${year}_week_${weekNumber}`;
}

/**
 * Get week number of the year
 */
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Check if menstrual question should be visible (once per month)
 */
function checkMenstrualQuestionVisibility() {
    const menstrualQuestion = document.getElementById('menstrualQuestion');
    if (!menstrualQuestion) return;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthKey = `menstrual_shown_${currentYear}_${currentMonth}`;
    
    // Check if question was already shown this month
    const shownThisMonth = localStorage.getItem(monthKey);
    
    if (!shownThisMonth) {
        menstrualQuestion.style.display = 'block';
        localStorage.setItem(monthKey, 'true');
    }
}

/**
 * Send questionnaire to nutritionist
 */
function sendToNutritionist() {
    const data = collectQuestionnaireData();
    
    if (!data.answers.dailyWeight) {
        showQuestionnaireAlert('warning', 'יש להזין לפחות את המשקל לפני שליחה לתזונאית');
        return;
    }
    
    // Save to nutritionist queue
    const nutritionistKey = `to_nutritionist_${new Date().getTime()}`;
    data.sentToNutritionist = true;
    data.sentAt = new Date().toISOString();
    
    localStorage.setItem(nutritionistKey, JSON.stringify(data));
    
    showQuestionnaireAlert('success', 'השאלון נשלח בהצלחה לתזונאית! היא תקבל את המידע ותוכל לפנות אליך.');
}

/**
 * Get weight data from localStorage
 */
function getWeightData() {
    const defaultData = {
        entries: {},
        latestWeight: null,
        targetWeight: 66.0,
        lastUpdated: null
    };
    
    try {
        const saved = localStorage.getItem('athleteWeightData');
        return saved ? JSON.parse(saved) : defaultData;
    } catch (error) {
        console.error('Error loading weight data:', error);
        return defaultData;
    }
}

/**
 * Update weight in weight screen when questionnaire is submitted
 */
function updateWeightFromQuestionnaire(weight) {
    if (!weight) return;
    
    const weightData = getWeightData();
    const today = new Date();
    const dateKey = today.toISOString().split('T')[0];
    
    // Add new weight entry
    weightData.entries[dateKey] = {
        weight: parseFloat(weight),
        date: dateKey,
        source: 'questionnaire'
    };
    
    // Update latest weight
    weightData.latestWeight = parseFloat(weight);
    weightData.lastUpdated = today.toISOString();
    
    // Save updated weight data
    localStorage.setItem('athleteWeightData', JSON.stringify(weightData));
    
    console.log('Weight updated from questionnaire:', weight);
}

/**
 * Get assessment tab content
 */
function getAssessmentContent() {
    return `
        <div class="assessment-section">
            <div class="row">
                <div class="col-12">
                    <div class="card shadow">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="mb-0">
                                    <i class="fas fa-clipboard-list me-2"></i>
                                    שאלון הערכה שבועי
                                </h5>
                                <small class="text-muted">השבוע של ${getCurrentWeekDates()}</small>
                            </div>
                            <div class="progress-container">
                                <div class="progress" style="width: 150px; height: 8px;">
                                    <div class="progress-bar bg-primary" id="questionnaireProgress" style="width: 0%"></div>
                                </div>
                                <small class="text-muted mt-1"><span id="progressText">0/14</span> שאלות</small>
                            </div>
                        </div>
                        <div class="card-body">
                            <form id="weeklyAssessmentForm">
                                <div id="questionsContainer">
                                    <!-- Date Field -->
                                    <div class="question-card mb-4" data-question="0">
                                        <div class="question-header">
                                            <span class="question-number">📅</span>
                                            <h6 class="question-title">תאריך הערכה</h6>
                                            <span class="required-indicator">*</span>
                                        </div>
                                        <div class="question-content">
                                            <input type="date" class="form-control" id="assessmentDate" required>
                                        </div>
                                    </div>

                                    <!-- Question 1: Daily Weight -->
                                    <div class="question-card mb-4" data-question="1">
                                        <div class="question-header">
                                            <span class="question-number">1</span>
                                            <h6 class="question-title">משקל יומי</h6>
                                            <span class="required-indicator">*</span>
                                        </div>
                                        <div class="question-content">
                                            <div class="input-group">
                                                <input type="number" class="form-control" id="dailyWeight" 
                                                       step="0.1" min="40" max="150" 
                                                       placeholder="הזן משקל בק״ג" required>
                                                <span class="input-group-text">ק״ג</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Question 2: Sleep Hours -->
                                    <div class="question-card mb-4" data-question="2">
                                        <div class="question-header">
                                            <span class="question-number">2</span>
                                            <h6 class="question-title">שעות שינה</h6>
                                            <span class="required-indicator">*</span>
                                        </div>
                                        <div class="question-content">
                                            <div class="radio-group">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="sleepHours" id="sleep1" value="less-than-6">
                                                    <label class="form-check-label" for="sleep1">פחות מ-6 שעות</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="sleepHours" id="sleep2" value="6-7">
                                                    <label class="form-check-label" for="sleep2">6-7 שעות</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="sleepHours" id="sleep3" value="7-8">
                                                    <label class="form-check-label" for="sleep3">7-8 שעות</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="sleepHours" id="sleep4" value="more-than-8">
                                                    <label class="form-check-label" for="sleep4">יותר מ-8 שעות</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Question 3: Sleep Quality -->
                                    <div class="question-card mb-4" data-question="3">
                                        <div class="question-header">
                                            <span class="question-number">3</span>
                                            <h6 class="question-title">איכות שינה</h6>
                                            <span class="required-indicator">*</span>
                                        </div>
                                        <div class="question-content">
                                            <div class="rating-scale">
                                                <div class="scale-labels">
                                                    <span>גרועה מאוד</span>
                                                    <span>מצוינת</span>
                                                </div>
                                                <div class="scale-buttons">
                                                    <input type="radio" name="sleepQuality" id="quality1" value="1" class="btn-check">
                                                    <label class="btn btn-outline-danger" for="quality1">1</label>
                                                    
                                                    <input type="radio" name="sleepQuality" id="quality2" value="2" class="btn-check">
                                                    <label class="btn btn-outline-warning" for="quality2">2</label>
                                                    
                                                    <input type="radio" name="sleepQuality" id="quality3" value="3" class="btn-check">
                                                    <label class="btn btn-outline-secondary" for="quality3">3</label>
                                                    
                                                    <input type="radio" name="sleepQuality" id="quality4" value="4" class="btn-check">
                                                    <label class="btn btn-outline-info" for="quality4">4</label>
                                                    
                                                    <input type="radio" name="sleepQuality" id="quality5" value="5" class="btn-check">
                                                    <label class="btn btn-outline-success" for="quality5">5</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Question 4: Sleep Times -->
                                    <div class="question-card mb-4" data-question="4">
                                        <div class="question-header">
                                            <span class="question-number">4</span>
                                            <h6 class="question-title">זמני שינה</h6>
                                            <span class="required-indicator">*</span>
                                        </div>
                                        <div class="question-content">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <label class="form-label">שעת שינה (שעון 24 שעות)</label>
                                                    <div class="input-group">
                                                        <input type="time" class="form-control" id="sleepTime" required>
                                                        <span class="input-group-text">
                                                            <i class="fas fa-moon"></i>
                                                        </span>
                                                    </div>
                                                    <small class="form-text text-muted">דוגמה: 23:30 (שעון 24 שעות)</small>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label">שעת קימה (שעון 24 שעות)</label>
                                                    <div class="input-group">
                                                        <input type="time" class="form-control" id="wakeTime" required>
                                                        <span class="input-group-text">
                                                            <i class="fas fa-sun"></i>
                                                        </span>
                                                    </div>
                                                    <small class="form-text text-muted">דוגמה: 07:00 (שעון 24 שעות)</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Question 5: Appetite -->
                                    <div class="question-card mb-4" data-question="5">
                                        <div class="question-header">
                                            <span class="question-number">5</span>
                                            <h6 class="question-title">תיאבון</h6>
                                            <span class="required-indicator">*</span>
                                        </div>
                                        <div class="question-content">
                                            <div class="rating-scale">
                                                <div class="scale-labels">
                                                    <span>אין תיאבון</span>
                                                    <span>תיאבון מעולה</span>
                                                </div>
                                                <div class="scale-buttons">
                                                    <input type="radio" name="appetite" id="appetite1" value="1" class="btn-check">
                                                    <label class="btn btn-outline-danger" for="appetite1">1</label>
                                                    
                                                    <input type="radio" name="appetite" id="appetite2" value="2" class="btn-check">
                                                    <label class="btn btn-outline-warning" for="appetite2">2</label>
                                                    
                                                    <input type="radio" name="appetite" id="appetite3" value="3" class="btn-check">
                                                    <label class="btn btn-outline-secondary" for="appetite3">3</label>
                                                    
                                                    <input type="radio" name="appetite" id="appetite4" value="4" class="btn-check">
                                                    <label class="btn btn-outline-info" for="appetite4">4</label>
                                                    
                                                    <input type="radio" name="appetite" id="appetite5" value="5" class="btn-check">
                                                    <label class="btn btn-outline-success" for="appetite5">5</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Question 6: Water Intake -->
                                    <div class="question-card mb-4" data-question="6">
                                        <div class="question-header">
                                            <span class="question-number">6</span>
                                            <h6 class="question-title">צריכת מים</h6>
                                            <span class="required-indicator">*</span>
                                        </div>
                                        <div class="question-content">
                                            <div class="input-group">
                                                <input type="number" class="form-control" id="waterIntake" 
                                                       step="0.1" min="0" max="10" 
                                                       placeholder="כמות" required>
                                                <select class="form-select" id="waterUnit" style="max-width: 120px;">
                                                    <option value="liters">ליטרים</option>
                                                    <option value="cups">כוסות</option>
                                                    <option value="bottles">בקבוקים</option>
                                                </select>
                                            </div>
                                            <small class="form-text text-muted">המלצה: 2.5-3 ליטרים ליום</small>
                                        </div>
                                    </div>

                                    <!-- Question 7: Supplements -->
                                    <div class="question-card mb-4" data-question="7">
                                        <div class="question-header">
                                            <span class="question-number">7</span>
                                            <h6 class="question-title">תוספי תזונה</h6>
                                        </div>
                                        <div class="question-content">
                                            <div class="checkbox-group">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="suppl1" value="magnesium">
                                                    <label class="form-check-label" for="suppl1">מגנזיום</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="suppl2" value="iron">
                                                    <label class="form-check-label" for="suppl2">ברזל</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="suppl3" value="omega3">
                                                    <label class="form-check-label" for="suppl3">אומגה 3</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="suppl4" value="creatine">
                                                    <label class="form-check-label" for="suppl4">קריאטין</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="suppl5" value="beta-alanine">
                                                    <label class="form-check-label" for="suppl5">בטא אלאנין</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="suppl6" value="folic-acid">
                                                    <label class="form-check-label" for="suppl6">חומצה פולית</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="suppl7" value="gainer">
                                                    <label class="form-check-label" for="suppl7">גיינר</label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="suppl8" value="other">
                                                    <label class="form-check-label" for="suppl8">אחר</label>
                                                </div>
                                                <div class="other-supplement" id="otherSupplementDiv" style="display: none;">
                                                    <input type="text" class="form-control mt-2" id="otherSupplement" placeholder="פרט איזה תוסף תזונה">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Question 8: Menstrual Cycle (Women only - Monthly) -->
                                    <div class="question-card mb-4" data-question="8" id="menstrualQuestion" style="display: none;">
                                        <div class="question-header">
                                            <span class="question-number">8</span>
                                            <h6 class="question-title">מחזור חודשי</h6>
                                            <small class="text-muted">(לנשים בלבד - פעם בחודש)</small>
                                        </div>
                                        <div class="question-content">
                                            <div class="form-check mb-3">
                                                <input class="form-check-input" type="checkbox" id="applicableToMe">
                                                <label class="form-check-label" for="applicableToMe">רלוונטי עבורי</label>
                                            </div>
                                            <div class="menstrual-options" id="menstrualOptions" style="display: none;">
                                                <div class="mb-3">
                                                    <label class="form-label fw-bold">סטטוס המחזור</label>
                                                    <div class="radio-group">
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="radio" name="menstrualCycle" id="cycle1" value="regular">
                                                            <label class="form-check-label" for="cycle1">סדיר</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="radio" name="menstrualCycle" id="cycle2" value="irregular">
                                                            <label class="form-check-label" for="cycle2">לא סדיר</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">תאריך וסת אחרון <small class="text-muted">(אופציונלי)</small></label>
                                                    <input type="date" class="form-control" id="lastPeriodDate">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Question 9: Health Issues -->
                                    <div class="question-card mb-4" data-question="9">
                                        <div class="question-header">
                                            <span class="question-number">9</span>
                                            <h6 class="question-title">האם נוצלת ממצבים הבאים?</h6>
                                        </div>
                                        <div class="question-content">
                                            <div class="checkbox-group">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="health1" value="injury">
                                                    <label class="form-check-label" for="health1">פציעות</label>
                                                </div>
                                                <div class="health-detail" id="injuryDetail" style="display: none;">
                                                    <textarea class="form-control mt-2" rows="2" placeholder="פרט על הפציעה, מיקום וחומרה"></textarea>
                                                </div>
                                                
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="health2" value="stomach-pain">
                                                    <label class="form-check-label" for="health2">כאבי בטן</label>
                                                </div>
                                                
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="health3" value="muscle-pain">
                                                    <label class="form-check-label" for="health3">כאבי שרירים</label>
                                                </div>
                                                
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="health4" value="constipation">
                                                    <label class="form-check-label" for="health4">עצירות</label>
                                                </div>
                                                
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="health5" value="diarrhea">
                                                    <label class="form-check-label" for="health5">שלשול</label>
                                                </div>
                                                
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="health6" value="headaches">
                                                    <label class="form-check-label" for="health6">כאבי ראש</label>
                                                </div>
                                                
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="health7" value="other">
                                                    <label class="form-check-label" for="health7">אחר</label>
                                                </div>
                                                <div class="health-detail" id="otherHealthDetail" style="display: none;">
                                                    <textarea class="form-control mt-2" rows="2" placeholder="פרט על המצב הרפואי"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Question 10: Mood -->
                                    <div class="question-card mb-4" data-question="10">
                                        <div class="question-header">
                                            <span class="question-number">10</span>
                                            <h6 class="question-title">מצב רוח</h6>
                                            <span class="required-indicator">*</span>
                                        </div>
                                        <div class="question-content">
                                            <div class="rating-scale">
                                                <div class="scale-labels">
                                                    <span>מדוכא</span>
                                                    <span>מצוין</span>
                                                </div>
                                                <div class="scale-buttons">
                                                    <input type="radio" name="mood" id="mood1" value="1" class="btn-check">
                                                    <label class="btn btn-outline-danger" for="mood1">1</label>
                                                    
                                                    <input type="radio" name="mood" id="mood2" value="2" class="btn-check">
                                                    <label class="btn btn-outline-warning" for="mood2">2</label>
                                                    
                                                    <input type="radio" name="mood" id="mood3" value="3" class="btn-check">
                                                    <label class="btn btn-outline-secondary" for="mood3">3</label>
                                                    
                                                    <input type="radio" name="mood" id="mood4" value="4" class="btn-check">
                                                    <label class="btn btn-outline-info" for="mood4">4</label>
                                                    
                                                    <input type="radio" name="mood" id="mood5" value="5" class="btn-check">
                                                    <label class="btn btn-outline-success" for="mood5">5</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Question 11: Energy Level -->
                                    <div class="question-card mb-4" data-question="11">
                                        <div class="question-header">
                                            <span class="question-number">11</span>
                                            <h6 class="question-title">רמת אנרגיה</h6>
                                            <span class="required-indicator">*</span>
                                        </div>
                                        <div class="question-content">
                                            <div class="rating-scale">
                                                <div class="scale-labels">
                                                    <span>אין אנרגיה</span>
                                                    <span>מלא אנרגיה</span>
                                                </div>
                                                <div class="scale-buttons">
                                                    <input type="radio" name="energy" id="energy1" value="1" class="btn-check">
                                                    <label class="btn btn-outline-danger" for="energy1">1</label>
                                                    
                                                    <input type="radio" name="energy" id="energy2" value="2" class="btn-check">
                                                    <label class="btn btn-outline-warning" for="energy2">2</label>
                                                    
                                                    <input type="radio" name="energy" id="energy3" value="3" class="btn-check">
                                                    <label class="btn btn-outline-secondary" for="energy3">3</label>
                                                    
                                                    <input type="radio" name="energy" id="energy4" value="4" class="btn-check">
                                                    <label class="btn btn-outline-info" for="energy4">4</label>
                                                    
                                                    <input type="radio" name="energy" id="energy5" value="5" class="btn-check">
                                                    <label class="btn btn-outline-success" for="energy5">5</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Question 12: Recovery After Training -->
                                    <div class="question-card mb-4" data-question="12">
                                        <div class="question-header">
                                            <span class="question-number">12</span>
                                            <h6 class="question-title">התאוששות אחרי אימונים</h6>
                                            <span class="required-indicator">*</span>
                                        </div>
                                        <div class="question-content">
                                            <div class="rating-scale recovery-scale">
                                                <div class="scale-labels">
                                                    <span>התאוששות גרועה</span>
                                                    <span>התאוששות מושלמת</span>
                                                </div>
                                                <div class="scale-buttons wide-scale">
                                                    ${Array.from({length: 10}, (_, i) => `
                                                        <input type="radio" name="recovery" id="recovery${i+1}" value="${i+1}" class="btn-check">
                                                        <label class="btn btn-outline-primary btn-sm" for="recovery${i+1}">${i+1}</label>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Question 13: Additional Notes -->
                                    <div class="question-card mb-4" data-question="13">
                                        <div class="question-header">
                                            <span class="question-number">13</span>
                                            <h6 class="question-title">הערות נוספות</h6>
                                            <small class="text-muted">(אופציונלי)</small>
                                        </div>
                                        <div class="question-content">
                                            <textarea class="form-control" id="additionalNotes" rows="4" 
                                                      placeholder="כל מידע נוסף שתרצה לשתף עם התזונאית - תחושות, שינויים, שאלות..."></textarea>
                                            <small class="form-text text-muted">עד 500 תווים</small>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-actions mt-4">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <button type="button" class="btn btn-outline-secondary w-100" id="saveDraftBtn">
                                                <i class="fas fa-save me-2"></i>
                                                שמור טיוטה
                                            </button>
                                        </div>
                                        <div class="col-md-8">
                                            <button type="button" class="btn btn-success w-100" id="sendToNutritionistBtn">
                                                <i class="fas fa-user-md me-2"></i>
                                                שלח לתזונאי/ת
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get chat tab content
 */
function getChatContent() {
    return `
        <div class="chat-interface">
            <div class="chat-header">
                <div class="nutritionist-info">
                    <div class="nutritionist-avatar">
                        <i class="fas fa-user-md"></i>
                        <span class="status-indicator" id="statusIndicator"></span>
                    </div>
                    <div class="nutritionist-details">
                        <h5 class="mb-1">צ'אט עם ד"ר שרה כהן (תזונאית)</h5>
                        <p class="status-text mb-0" id="statusText">
                            <i class="fas fa-circle status-dot" id="statusDot"></i>
                            <span id="statusMessage">זמינה</span>
                            <small class="working-hours">• א-ה 8:00-18:00</small>
                        </p>
                    </div>
                </div>
                <div class="chat-actions">
                    <button class="btn btn-outline-light btn-sm me-2" onclick="showQuickMessages()">
                        <i class="fas fa-bolt me-1"></i>
                        הודעות מהירות
                    </button>
                    <button class="btn btn-outline-light btn-sm" onclick="athleteInterface.clearChat()">
                        <i class="fas fa-trash me-1"></i>
                        נקה
                    </button>
                </div>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <!-- Messages will be loaded here -->
            </div>
            
            <div class="typing-indicator" id="typingIndicator" style="display: none;">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span class="typing-text">התזונאית מקלידה...</span>
            </div>
            
            <!-- Quick Messages Panel -->
            <div class="quick-messages-panel" id="quickMessagesPanel" style="display: none;">
                <div class="quick-messages-header">
                    <h6>הודעות מהירות</h6>
                    <button class="btn-close" onclick="hideQuickMessages()"></button>
                </div>
                <div class="quick-messages-grid" id="quickMessagesGrid">
                    <!-- Will be populated dynamically -->
                </div>
            </div>

            <div class="chat-input-area">
                <div class="input-group">
                    <button class="btn btn-outline-secondary" type="button" onclick="showImageUpload()">
                        <i class="fas fa-camera"></i>
                    </button>
                    <input type="text" id="chatInput" class="form-control" placeholder="הקלד הודעה לתזונאית..." aria-label="הודעה">
                    <button class="btn btn-primary" type="button" id="sendButton">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="input-info d-flex justify-content-between">
                    <small class="text-muted">
                        <i class="fas fa-info-circle me-1"></i>
                        לחץ Enter לשליחה מהירה
                    </small>
                    <small class="text-muted" id="messageStatus">
                        <!-- Message status will appear here -->
                    </small>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialize tab-specific features
 */
function initializeTabFeatures(tabName) {
    switch(tabName) {
        case 'home':
            setupTaskInteractions();
            break;
        case 'weight':
            setupWeightForm();
            break;
        case 'assessment':
            setupQuestionnaireHandlers();
            break;
        case 'chat':
            initializeChatFeatures();
            break;
    }
}

/**
 * Setup navigation handlers
 */
function setupNavigationHandlers() {
    // Handle nav item clicks
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            if (tabName) {
                switchToTab(tabName);
            }
        });
    });

    // Handle back button
    window.addEventListener('popstate', function(e) {
        const tab = e.state ? e.state.tab : 'home';
        switchToTab(tab);
    });
}

/**
 * Setup task interactions
 */
function setupTaskInteractions() {
    document.querySelectorAll('.task-item.pending').forEach(item => {
        item.addEventListener('click', function() {
            toggleTask(this);
        });
    });
}

/**
 * Toggle task completion
 */
function toggleTask(taskElement) {
    const taskCheck = taskElement.querySelector('.task-check i');
    const taskContent = taskElement.querySelector('.task-content span');
    
    if (taskElement.classList.contains('pending')) {
        // Mark as completed
        taskElement.classList.remove('pending');
        taskElement.classList.add('completed');
        taskCheck.className = 'fas fa-check';
        
        // Add completion animation
        taskElement.style.transform = 'scale(1.02)';
        setTimeout(() => {
            taskElement.style.transform = '';
        }, 200);
        
        // Update task counter
        updateTaskCounter();
        
        // Show success feedback
        showTaskSuccess();
    }
}

/**
 * Update task counter
 */
function updateTaskCounter() {
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    const totalTasks = document.querySelectorAll('.task-item').length;
    const badge = document.querySelector('.badge.bg-primary');
    
    if (badge) {
        badge.textContent = `${completedTasks}/${totalTasks}`;
    }
}

/**
 * Show task success feedback
 */
function showTaskSuccess() {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    alert.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        משימה הושלמה בהצלחה!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 3000);
}

/**
 * Setup weight form
 */
function setupWeightForm() {
    const weightForm = document.getElementById('weightForm');
    if (weightForm) {
        weightForm.addEventListener('submit', handleWeightSubmit);
    }
}

/**
 * Handle weight form submission
 */
function handleWeightSubmit(e) {
    e.preventDefault();
    
    const weightInput = document.getElementById('weightInput');
    const timeInput = document.getElementById('timeInput');
    const notesInput = document.getElementById('notesInput');
    
    const weight = weightInput.value;
    const time = timeInput.value;
    const notes = notesInput.value;
    
    if (!weight) {
        showAlert('אנא הכנס משקל', 'warning');
        return;
    }
    
    // Simulate saving
    const submitBtn = e.target.querySelector('button[type="submit"]');
    setLoadingState(submitBtn, true);
    
    setTimeout(() => {
        setLoadingState(submitBtn, false);
        showAlert('המשקל נשמר בהצלחה!', 'success');
        
        // Reset form
        weightForm.reset();
        timeInput.value = '07:30'; // Reset to default time
        
        // Switch back to home tab
        setTimeout(() => {
            switchToTab('home');
        }, 1500);
    }, 1000);
}

/**
 * Setup real-time updates
 */
function setupRealTimeUpdates() {
    // Placeholder for real-time functionality
    console.log('Real-time updates initialized');
}

/**
 * Utility function to show alerts
 */
function showAlert(message, type = 'info') {
    const alertContainer = document.querySelector('.athlete-main .container-fluid');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.insertBefore(alert, alertContainer.firstChild);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.classList.remove('show');
            setTimeout(() => {
                alert.remove();
            }, 300);
        }
    }, 4000);
}

/**
 * Set loading state for buttons
 */
function setLoadingState(element, isLoading) {
    if (isLoading) {
        element.disabled = true;
        const originalText = element.innerHTML;
        element.setAttribute('data-original-text', originalText);
        element.innerHTML = '<div class="loading-spinner me-2"></div>שומר...';
    } else {
        element.disabled = false;
        const originalText = element.getAttribute('data-original-text');
        if (originalText) {
            element.innerHTML = originalText;
            element.removeAttribute('data-original-text');
        }
    }
}

// Enhanced Chat System Functions
let isTyping = false;
let typingTimeout = null;
let chatInterval = null;
let nutritionistStatus = {
    online: true,
    status: 'זמינה',
    lastSeen: new Date().toISOString(),
    workingHours: 'א-ה 8:00-18:00'
};

// Quick message templates
const quickMessages = [
    'איך אני במסלול?',
    'יש לי שאלה על התזונה',
    'דיווח על בעיה',
    'בקשה לשיחה',
    'מה לאכול לפני האימון?',
    'איך אני בהכנות לתחרות?'
];

// Message status types
const MESSAGE_STATUS = {
    SENT: 'sent',
    DELIVERED: 'delivered', 
    READ: 'read'
};

/**
 * Initialize enhanced chat features
 */
function initializeChatFeatures() {
    updateNutritionistStatus();
    loadChatMessages();
    setupChatEventListeners();
    initializeQuickMessages();
    startStatusUpdates();
    console.log('Enhanced chat system initialized');
}

/**
 * Setup chat event listeners
 */
function setupChatEventListeners() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    
    if (chatInput && sendButton) {
        // Send button click
        sendButton.addEventListener('click', sendMessage);
        
        // Enter key to send
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Typing indicator
        chatInput.addEventListener('input', handleTyping);
    }
}

/**
 * Load enhanced chat messages from localStorage
 */
function loadChatMessages() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    // Get stored messages with enhanced structure
    const messages = JSON.parse(localStorage.getItem(`chat_messages_${ATHLETE_ID}`) || '[]');
    
    // If no messages, add welcome message
    if (messages.length === 0) {
        const welcomeMessages = [
            {
                id: Date.now(),
                from: 'nutritionist',
                content: 'שלום דני! ברוך הבא למערכת המעקב התזונתי המתקדמת 🌟',
                timestamp: new Date().toISOString(),
                time: getCurrentTimeString(),
                status: MESSAGE_STATUS.READ,
                urgent: false
            },
            {
                id: Date.now() + 1,
                from: 'nutritionist', 
                content: 'אני כאן כדי לעזור לך להגיע ליעדים שלך. איך אתה מרגיש היום? יש משהו ספציפי שתרצה לדון עליו?',
                timestamp: new Date().toISOString(),
                time: getCurrentTimeString(),
                status: MESSAGE_STATUS.READ,
                urgent: false
            }
        ];
        
        localStorage.setItem(`chat_messages_${ATHLETE_ID}`, JSON.stringify(welcomeMessages));
        renderMessages(welcomeMessages);
    } else {
        renderMessages(messages);
        markMessagesAsRead();
    }
}

/**
 * Render messages in chat
 */
function renderMessages(messages) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    chatMessages.innerHTML = messages.map(msg => createMessageHTML(msg)).join('');
    scrollToBottom();
}

/**
 * Create HTML for an enhanced message
 */
function createMessageHTML(message) {
    const isNutritionist = message.from === 'nutritionist';
    const statusIcon = getMessageStatusIcon(message.status || MESSAGE_STATUS.DELIVERED);
    const urgentClass = message.urgent ? 'urgent-message' : '';
    
    return `
        <div class="message ${isNutritionist ? 'nutritionist-message' : 'athlete-message'} ${urgentClass}" data-id="${message.id}">
            <div class="message-bubble">
                ${message.urgent && isNutritionist ? '<div class="urgent-badge"><i class="fas fa-exclamation-triangle"></i> דחוף</div>' : ''}
                <div class="message-content">
                    <p>${message.content}</p>
                </div>
                <div class="message-footer">
                    <span class="message-time">${message.time}</span>
                    ${!isNutritionist ? `<span class="message-status">${statusIcon}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Send enhanced message
 */
function sendMessage(messageText = null, isQuickMessage = false) {
    const chatInput = document.getElementById('chatInput');
    const text = messageText || chatInput.value.trim();
    
    if (!text) return;
    
    // Create new message with enhanced structure
    const newMessage = {
        id: Date.now(),
        from: 'athlete',
        content: text,
        timestamp: new Date().toISOString(),
        time: getCurrentTimeString(),
        status: MESSAGE_STATUS.SENT,
        urgent: false
    };
    
    // Add to storage
    const messages = JSON.parse(localStorage.getItem(`chat_messages_${ATHLETE_ID}`) || '[]');
    messages.push(newMessage);
    localStorage.setItem(`chat_messages_${ATHLETE_ID}`, JSON.stringify(messages));
    
    // Add to UI
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.insertAdjacentHTML('beforeend', createMessageHTML(newMessage));
    }
    
    // Clear input if not quick message
    if (!isQuickMessage) {
        chatInput.value = '';
    }
    
    // Hide quick messages panel
    hideQuickMessages();
    
    // Update message status
    updateMessageStatus(newMessage.id, MESSAGE_STATUS.DELIVERED);
    scrollToBottom();
    
    // Show message status
    showMessageStatus('נשלח ✓');
    
    // Trigger nutritionist response
    setTimeout(() => triggerNutritionistResponse(text), 1500 + Math.random() * 2000);
}

/**
 * Trigger enhanced nutritionist response
 */
function triggerNutritionistResponse(userMessage = '') {
    if (typeof userMessage !== 'string') {
        userMessage = String(userMessage || '');
    }
    const responses = getSmartResponse(userMessage);
    const isUrgent = checkForUrgentKeywords(userMessage);
    
    // Show typing indicator
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        
        const responseMessage = {
            id: Date.now(),
            from: 'nutritionist',
            content: responses.message,
            timestamp: new Date().toISOString(),
            time: getCurrentTimeString(),
            status: MESSAGE_STATUS.DELIVERED,
            urgent: isUrgent
        };
        
        // Add to storage
        const messages = JSON.parse(localStorage.getItem(`chat_messages_${ATHLETE_ID}`) || '[]');
        messages.push(responseMessage);
        localStorage.setItem(`chat_messages_${ATHLETE_ID}`, JSON.stringify(messages));
        
        // Add to UI
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.insertAdjacentHTML('beforeend', createMessageHTML(responseMessage));
        }
        scrollToBottom();
        
        // Mark messages as read after delay
        setTimeout(() => markMessagesAsRead(), 3000);
        
    }, 2000 + Math.random() * 1500);
}

/**
 * Handle typing indicator
 */
function handleTyping() {
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    
    if (!isTyping) {
        isTyping = true;
        // Could send typing status to server here
    }
    
    typingTimeout = setTimeout(() => {
        isTyping = false;
        // Could send stop typing status to server here
    }, 1000);
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.style.display = 'flex';
        scrollToBottom();
    }
}

/**
 * Hide typing indicator  
 */
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

/**
 * Clear chat messages
 */
function clearChat() {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל ההודעות?')) {
        localStorage.removeItem(`chat_messages_${ATHLETE_ID}`);
        loadChatMessages();
    }
}

/**
 * Scroll to bottom of chat
 */
function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }
}

/**
 * Get current time string
 */
function getCurrentTimeString() {
    return new Date().toLocaleTimeString('he-IL', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Jerusalem'
    });
}

/**
 * Update nutritionist status display
 */
function updateNutritionistStatus() {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusDot = document.getElementById('statusDot');
    const statusMessage = document.getElementById('statusMessage');
    
    if (statusIndicator && statusDot && statusMessage) {
        const isOnline = nutritionistStatus.online;
        statusIndicator.className = `status-indicator ${isOnline ? 'online' : 'offline'}`;
        statusDot.className = `fas fa-circle status-dot ${isOnline ? 'online' : 'offline'}`;
        statusMessage.textContent = isOnline ? nutritionistStatus.status : 'לא זמינה';
    }
}

/**
 * Initialize quick messages
 */
function initializeQuickMessages() {
    const grid = document.getElementById('quickMessagesGrid');
    if (grid) {
        grid.innerHTML = quickMessages.map(msg => 
            `<button class="quick-message-btn" onclick="sendMessage('${msg}', true)">${msg}</button>`
        ).join('');
    }
}

/**
 * Show quick messages panel
 */
function showQuickMessages() {
    const panel = document.getElementById('quickMessagesPanel');
    if (panel) {
        panel.style.display = 'block';
        panel.classList.add('slide-in');
    }
}

/**
 * Hide quick messages panel
 */
function hideQuickMessages() {
    const panel = document.getElementById('quickMessagesPanel');
    if (panel) {
        panel.style.display = 'none';
        panel.classList.remove('slide-in');
    }
}

/**
 * Get smart response based on user message
 */
function getSmartResponse(userMessage) {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('בעיה') || lowerMsg.includes('כאב') || lowerMsg.includes('לא טוב')) {
        return {
            message: 'מצטערת לשמוע שיש בעיה. אנא פרט יותר על מה שאתה חווה, וננסה למצוא פתרון מתאים 🩺',
            urgent: true
        };
    }
    
    if (lowerMsg.includes('תזונה') || lowerMsg.includes('אוכל') || lowerMsg.includes('ארוחה')) {
        return {
            message: 'בוודאי! אני כאן לעזור עם כל נושא הקשור לתזונה. מה בדיוק מעניין אותך? 🥗'
        };
    }
    
    if (lowerMsg.includes('משקל') || lowerMsg.includes('שקילה')) {
        return {
            message: 'נהדר שאתה עוקב אחרי המשקל! איך אתה מרגיש עם השינויים? יש משהו שמעניין אותך? ⚖️'
        };
    }
    
    if (lowerMsg.includes('תחרות') || lowerMsg.includes('הכנות')) {
        return {
            message: 'מעולה! איך מתקדמות ההכנות? האם יש משהו ספציפי שנצטרך להתאים בתזונה? 🥇'
        };
    }
    
    const generalResponses = [
        'תודה על העדכון! אני כאן אם יש עוד שאלות 👍',
        'מצוין! אתה עושה עבודה נהדרת 🌟',
        'המשך כך! אני רואה התקדמות יפה 💪',
        'אם יש לך עוד שאלות, אני כאן לעזור 😊',
        'נשמע טוב! איך אתה מרגיש באופן כללי?',
    ];
    
    return {
        message: generalResponses[Math.floor(Math.random() * generalResponses.length)]
    };
}

/**
 * Check for urgent keywords
 */
function checkForUrgentKeywords(message) {
    const urgentKeywords = ['בעיה', 'כאב', 'חרב', 'דחוף', 'עזרה', 'רע', 'לא טוב', 'בהול'];
    return urgentKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

/**
 * Get message status icon
 */
function getMessageStatusIcon(status) {
    switch(status) {
        case MESSAGE_STATUS.SENT:
            return '✓';
        case MESSAGE_STATUS.DELIVERED:
            return '✓✓';
        case MESSAGE_STATUS.READ:
            return '✓✓';
        default:
            return '';
    }
}

/**
 * Update message status
 */
function updateMessageStatus(messageId, newStatus) {
    setTimeout(() => {
        const messageElement = document.querySelector(`[data-id="${messageId}"] .message-status`);
        if (messageElement) {
            messageElement.innerHTML = getMessageStatusIcon(newStatus);
            
            // Update in storage
            const messages = JSON.parse(localStorage.getItem(`chat_messages_${ATHLETE_ID}`) || '[]');
            const message = messages.find(m => m.id === messageId);
            if (message) {
                message.status = newStatus;
                localStorage.setItem(`chat_messages_${ATHLETE_ID}`, JSON.stringify(messages));
            }
        }
    }, 1000);
}

/**
 * Show message status in input area
 */
function showMessageStatus(status) {
    const statusElement = document.getElementById('messageStatus');
    if (statusElement) {
        statusElement.textContent = status;
        setTimeout(() => {
            statusElement.textContent = '';
        }, 3000);
    }
}

/**
 * Mark messages as read
 */
function markMessagesAsRead() {
    const messages = JSON.parse(localStorage.getItem(`chat_messages_${ATHLETE_ID}`) || '[]');
    messages.forEach(message => {
        if (message.from === 'nutritionist') {
            message.status = MESSAGE_STATUS.READ;
        }
    });
    localStorage.setItem(`chat_messages_${ATHLETE_ID}`, JSON.stringify(messages));
}

/**
 * Start status updates
 */
function startStatusUpdates() {
    // Update status every minute
    chatInterval = setInterval(() => {
        const now = new Date();
        const hour = now.getHours();
        
        // Simulate working hours (8-18)
        nutritionistStatus.online = hour >= 8 && hour < 18;
        nutritionistStatus.status = nutritionistStatus.online ? 
            (Math.random() > 0.8 ? 'עסוקה' : 'זמינה') : 'לא זמינה';
        
        updateNutritionistStatus();
    }, 60000);
}

/**
 * Show image upload dialog
 */
function showImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // Simulate image upload
            const imageMessage = `📸 התמונה נשלחה: ${file.name}`;
            sendMessage(imageMessage, false);
        }
    };
    input.click();
}

// Export for global access
window.athleteInterface = {
    switchToTab,
    toggleTask,
    showAlert,
    clearChat
};

// Global functions for chat
window.showQuickMessages = showQuickMessages;
window.hideQuickMessages = hideQuickMessages;
window.showImageUpload = showImageUpload;