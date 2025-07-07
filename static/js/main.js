// CardioCheck - Medical Professional JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all sections properly
    initializeSections();
    
    // Smooth boot animation with fallback
    initializeBootAnimation();
    
    // Initialize assessment functionality
    initializeAssessment();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Check for server results
    checkServerResults();
    
    // Initialize gamification
    initializeGamification();
});

// Initialize sections visibility
function initializeSections() {
    // Always show assessment section by default
    const assessmentContainer = document.querySelector('.assessment-container');
    if (assessmentContainer) {
        assessmentContainer.style.display = 'block';
    }
    
    // Always hide results and analytics initially
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
    
    const analyticsSection = document.querySelector('.analytics-dashboard');
    if (analyticsSection) {
        analyticsSection.style.display = 'none';
    }
    
    console.log('Sections initialized - Assessment visible, Results and Analytics hidden');
}

// Boot Animation - Medical Professional
function initializeBootAnimation() {
    const welcomeScreen = document.querySelector('.welcome-screen');
    const mainContainer = document.querySelector('.main-container');
    
    console.log('Initializing medical boot animation...');
    
    // Initially hide main container
    if (mainContainer) {
        mainContainer.style.display = 'none';
        mainContainer.style.opacity = '0';
    }
    
    if (welcomeScreen) {
        // Show welcome screen for 2.5 seconds
        setTimeout(function() {
            // Fade out welcome screen
            welcomeScreen.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            welcomeScreen.style.opacity = '0';
            welcomeScreen.style.transform = 'scale(0.95)';
            
            // After fade out, show main container
            setTimeout(function() {
                welcomeScreen.style.display = 'none';
                
                if (mainContainer) {
                    mainContainer.style.display = 'block';
                    mainContainer.style.transition = 'opacity 0.8s ease-in';
                    
                    // Fade in main container
                    setTimeout(function() {
                        mainContainer.style.opacity = '1';
                        mainContainer.classList.add('show');
                        animateFloatingIcons();
                        console.log('Medical boot animation completed');
                    }, 50);
                }
            }, 600);
        }, 2500);
    } else {
        // No welcome screen, show main immediately
        if (mainContainer) {
            mainContainer.style.display = 'block';
            mainContainer.style.opacity = '1';
            mainContainer.classList.add('show');
        }
    }
}

function animateFloatingIcons() {
    const icons = document.querySelectorAll('.floating-icon');
    icons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.animation = `float 6s ease-in-out infinite ${index * 0.5}s`;
        }, index * 200);
    });
}

// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const root = document.documentElement;
    
    // Check if elements exist
    if (!themeToggle || !themeIcon || !themeText) {
        console.log('Theme toggle elements not found, skipping...');
        return;
    }
    
    // Get saved theme or default to light (perfect theme)
    const savedTheme = localStorage.getItem('cardio-theme') || 'light';
    root.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply theme with smooth transition
        root.style.transition = 'all 0.3s ease';
        root.setAttribute('data-theme', newTheme);
        
        // Save preference
        localStorage.setItem('cardio-theme', newTheme);
        
        // Update UI
        updateThemeUI(newTheme);
        
        // Remove transition after change
        setTimeout(() => {
            root.style.transition = '';
        }, 300);
    });
    
    function updateThemeUI(theme) {
        if (theme === 'light') {
            themeIcon.className = 'fas fa-moon theme-icon';
            themeText.textContent = 'Dark Mode';
        } else {
            themeIcon.className = 'fas fa-sun theme-icon';
            themeText.textContent = 'Light Mode';
        }
    }
}

function initializeAssessment() {
    const cards = document.querySelectorAll('.assessment-card');
    const nextButtons = document.querySelectorAll('.next-card');
    const prevButtons = document.querySelectorAll('.prev-card');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    function updateProgress(cardNumber) {
        progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            if (stepNumber < cardNumber) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNumber === cardNumber) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
    
    nextButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const currentCardId = this.closest('.assessment-card').id;
            const nextCardNum = parseInt(this.getAttribute('data-next'));
            
            if (validateCard(currentCardId)) {
                transitionToCard(currentCardId, `card${nextCardNum}`, 'next');
                updateProgress(nextCardNum);
            }
        });
    });
    
    prevButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const prevCardNum = parseInt(this.getAttribute('data-prev'));
            const currentCard = this.closest('.assessment-card');
            
            transitionToCard(currentCard.id, `card${prevCardNum}`, 'prev');
            updateProgress(prevCardNum);
        });
    });
    
    // Form validation on input change
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('change', function() {
            if (this.value) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });
    
    // Form submission
    const submitButton = document.getElementById('submit-assessment');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateCard('card4')) {
                showLoadingState(this);
                document.getElementById('assessment-form').submit();
            }
        });
    }
    
    // New assessment button
    const newAssessmentBtn = document.getElementById('new-assessment-btn');
    if (newAssessmentBtn) {
        newAssessmentBtn.addEventListener('click', function() {
            resetAssessment();
        });
    }
}

function transitionToCard(currentCardId, nextCardId, direction) {
    const currentCard = document.getElementById(currentCardId);
    const nextCard = document.getElementById(nextCardId);
    
    if (!currentCard || !nextCard) {
        console.error('Card not found:', { currentCardId, nextCardId });
        return;
    }
    
    const exitTransform = direction === 'next' ? 'translateX(-50px)' : 'translateX(50px)';
    const enterTransform = direction === 'next' ? 'translateX(50px)' : 'translateX(-50px)';
    
    // Animate current card out
    currentCard.style.transform = exitTransform;
    currentCard.style.opacity = '0';
    
    setTimeout(() => {
        currentCard.classList.remove('active');
        currentCard.style.visibility = 'hidden';
        nextCard.classList.add('active');
        nextCard.style.transform = enterTransform;
        nextCard.style.opacity = '0';
        nextCard.style.visibility = 'visible';
        
        setTimeout(() => {
            nextCard.style.transform = 'translateX(0)';
            nextCard.style.opacity = '1';
        }, 50);
    }, 250);
}

function validateCard(cardId) {
    const card = document.getElementById(cardId);
    const inputs = card.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });
    
    if (!isValid) {
        const firstInvalid = card.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            showValidationError();
        }
    }
    
    return isValid;
}

function showLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';
    button.disabled = true;
    
    // Store original text for potential restoration
    button.dataset.originalText = originalText;
}

function showValidationError() {
    // Create a subtle shake animation for invalid fields
    const invalidFields = document.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => {
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    });
}

function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function checkServerResults() {
    // Hide results section initially
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
    
    // Only show results if there's a valid prediction from server
    const predictionText = window.serverPrediction || '';
    console.log('Server prediction:', predictionText);
    
    if (predictionText && predictionText !== 'None' && predictionText.trim() !== '' && predictionText !== '{{ prediction|safe }}') {
        setTimeout(() => {
            showServerResults();
        }, 1000);
    }
}

function showServerResults() {
    // Hide assessment and show results
    document.querySelector('.assessment-container').style.display = 'none';
    document.querySelector('.results-section').style.display = 'block';
    
    const predictionText = window.serverPrediction || '';
    if (predictionText && predictionText !== 'None') {
        const isHighRisk = predictionText.includes('High Risk');
        const riskPercentage = isHighRisk ? 75 : 25;
        
        updateRiskDisplay(riskPercentage, isHighRisk, predictionText);
        initializeChart();
        initializeHealthComparison();
        
        // Smooth scroll to results
        setTimeout(() => {
            document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }
}

// Gamification System
function initializeGamification() {
    console.log('Initializing gamification system...');
    
    // Set up achievement system
    const achievements = [
        { id: 'first_assessment', name: 'Health Explorer', icon: 'fas fa-compass', description: 'Completed your first assessment' },
        { id: 'health_conscious', name: 'Health Conscious', icon: 'fas fa-heart', description: 'Shows excellent health awareness' },
        { id: 'data_driven', name: 'Data Driven', icon: 'fas fa-chart-line', description: 'Analyzed comprehensive health metrics' },
        { id: 'prevention_focused', name: 'Prevention Hero', icon: 'fas fa-shield-alt', description: 'Taking preventive health measures' }
    ];
    
    // Always award these achievements for engagement
    setTimeout(() => {
        unlockAchievements(achievements);
    }, 1000);
}

function unlockAchievements(achievements) {
    const achievementsList = document.getElementById('achievements-list');
    if (!achievementsList) return;
    
    achievements.forEach((achievement, index) => {
        setTimeout(() => {
            const badge = document.createElement('div');
            badge.className = 'achievement-badge';
            badge.innerHTML = `
                <i class="${achievement.icon}"></i>
                <span>${achievement.name}</span>
            `;
            badge.title = achievement.description;
            achievementsList.appendChild(badge);
        }, index * 300);
    });
}

function updateHealthScore(score) {
    const healthScore = document.getElementById('health-score');
    const healthCircle = document.getElementById('health-circle');
    const healthLevel = document.getElementById('health-level');
    const levelDescription = document.getElementById('level-description');
    
    if (healthScore) {
        // Animate score counting up
        let currentScore = 0;
        const increment = score / 50;
        const timer = setInterval(() => {
            currentScore += increment;
            if (currentScore >= score) {
                currentScore = score;
                clearInterval(timer);
            }
            healthScore.textContent = Math.round(currentScore);
        }, 20);
    }
    
    if (healthCircle) {
        const circumference = 2 * Math.PI * 90;
        const strokeDasharray = (score / 100) * circumference;
        healthCircle.style.strokeDasharray = `${strokeDasharray} ${circumference}`;
    }
    
    // Update level based on score
    if (healthLevel && levelDescription) {
        let level, description;
        if (score >= 90) {
            level = 'A+';
            description = 'Heart Champion';
        } else if (score >= 80) {
            level = 'A';
            description = 'Health Hero';
        } else if (score >= 70) {
            level = 'B+';
            description = 'Wellness Warrior';
        } else if (score >= 60) {
            level = 'B';
            description = 'Health Seeker';
        } else {
            level = 'C';
            description = 'Starting Journey';
        }
        healthLevel.textContent = level;
        levelDescription.textContent = description;
    }
}

function showHealthInsights(riskLevel) {
    const insightsList = document.getElementById('health-insights-list');
    if (!insightsList) return;
    
    const insights = [
        {
            icon: 'fas fa-running',
            title: 'Stay Active',
            description: 'Regular exercise reduces cardiovascular risk by 30-35%'
        },
        {
            icon: 'fas fa-apple-alt',
            title: 'Nutrition Matters',
            description: 'A heart-healthy diet can improve your risk profile significantly'
        },
        {
            icon: 'fas fa-moon',
            title: 'Quality Sleep',
            description: '7-9 hours of sleep supports optimal heart health'
        },
        {
            icon: 'fas fa-user-md',
            title: 'Regular Checkups',
            description: 'Annual health screenings help catch issues early'
        }
    ];
    
    insights.forEach((insight, index) => {
        setTimeout(() => {
            const insightCard = document.createElement('div');
            insightCard.className = 'health-insight-card';
            insightCard.style.cssText = `
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: rgba(59, 130, 246, 0.1);
                border-radius: 12px;
                margin-bottom: 1rem;
                border: 1px solid rgba(59, 130, 246, 0.2);
                animation: slideInRight 0.5s ease-out;
            `;
            
            insightCard.innerHTML = `
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #1e40af, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
                    <i class="${insight.icon}"></i>
                </div>
                <div>
                    <h5 style="margin: 0; color: var(--primary-light); font-size: 1.1rem;">${insight.title}</h5>
                    <p style="margin: 0; color: var(--text-light); font-size: 0.9rem;">${insight.description}</p>
                </div>
            `;
            
            insightsList.appendChild(insightCard);
        }, index * 200);
    });
}

// Enhanced result display with gamification
function updateRiskDisplay(riskPercentage, isHighRisk, predictionText) {
    console.log('Updating risk display with gamification...');
    
    // Calculate health score (inverse of risk)
    const healthScore = Math.max(20, 100 - riskPercentage);
    
    // Update gamification elements
    updateHealthScore(healthScore);
    showHealthInsights(isHighRisk ? 'high' : 'low');
    
    // Update the original risk display
    const riskMeter = document.querySelector('.risk-meter');
    const riskInterpretation = document.getElementById('risk-interpretation');
    const riskFactors = document.getElementById('risk-factors');
    
    if (riskMeter) {
        updateRiskMeter(riskPercentage);
    }
    
    if (riskInterpretation) {
        riskInterpretation.textContent = predictionText;
        riskInterpretation.className = isHighRisk ? 'lead text-danger' : 'lead text-success';
    }
    
    if (riskFactors) {
        const analysisText = isHighRisk ? 
            'Based on your assessment, you may have elevated cardiovascular risk factors. Consider consulting with a healthcare provider for personalized recommendations.' :
            'Great job! Your assessment indicates favorable cardiovascular health indicators. Continue your healthy lifestyle habits.';
        
        riskFactors.innerHTML = `
            <strong>Analysis:</strong> ${analysisText}
            <div class="mt-3">
                <small class="text-muted">
                    <i class="fas fa-info-circle me-1"></i>
                    This assessment is for informational purposes only and should not replace professional medical advice.
                </small>
            </div>
        `;
        riskFactors.className = isHighRisk ? 'alert alert-warning' : 'alert alert-success';
    }
}

function updateRiskMeter(riskPercentage) {
    const riskIndicator = document.getElementById('risk-indicator');
    const riskPercentageElement = document.getElementById('risk-percentage');
    const riskCategory = document.getElementById('risk-category');
    
    if (riskIndicator) {
        // Position the indicator correctly on the meter
        const position = Math.min(100, Math.max(0, riskPercentage));
        riskIndicator.style.left = `${position}%`;
        riskIndicator.style.transition = 'left 1.5s ease-out';
    }
    
    if (riskPercentageElement) {
        // Animate percentage counting
        let currentPercentage = 0;
        const increment = riskPercentage / 50;
        const timer = setInterval(() => {
            currentPercentage += increment;
            if (currentPercentage >= riskPercentage) {
                currentPercentage = riskPercentage;
                clearInterval(timer);
            }
            riskPercentageElement.textContent = `${Math.round(currentPercentage)}%`;
        }, 30);
    }
    
    if (riskCategory) {
        // Update category and color
        if (riskPercentage <= 30) {
            riskCategory.textContent = 'Low Risk';
            riskCategory.className = 'badge bg-success';
        } else if (riskPercentage <= 70) {
            riskCategory.textContent = 'Moderate Risk';
            riskCategory.className = 'badge bg-warning';
        } else {
            riskCategory.textContent = 'High Risk';
            riskCategory.className = 'badge bg-danger';
        }
    }
}

// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Add CSS animations for insights
const style2 = document.createElement('style');
style2.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style2);

// Advanced Analytics Dashboard Functions
function showAnalyticsDashboard() {
    const resultsSection = document.getElementById('results-section');
    const dashboard = document.getElementById('analytics-dashboard');
    
    if (!resultsSection || !dashboard) {
        console.error('Required elements not found');
        return;
    }
    
    resultsSection.style.display = 'none';
    dashboard.style.display = 'block';
    
    // Animate dashboard entrance
    setTimeout(() => {
        dashboard.style.opacity = '1';
        console.log('Initializing analytics dashboard...');
        initializeAnalyticsDashboard();
    }, 100);
}

function showResultsSection() {
    document.getElementById('analytics-dashboard').style.display = 'none';
    document.getElementById('results-section').style.display = 'block';
}

function initializeAnalyticsDashboard() {
    // Show loading state first
    showLoadingStateForMetrics();
    
    // Initialize health metrics
    updateHealthMetrics();
    
    // Initialize risk matrix
    createRiskMatrix();
    
    // Initialize health goals
    createHealthGoals();
    
    // Initialize health journey chart
    createHealthJourneyChart();
    
    // Initialize AI recommendations
    generateAIRecommendations();
    
    // Initialize community stats
    updateCommunityStats();
    
    // Initialize achievements
    updateAchievements();
}

function showLoadingStateForMetrics() {
    // Show loading state for metrics
    document.getElementById('heart-rate-metric').textContent = 'Loading...';
    document.getElementById('bmi-metric').textContent = 'Loading...';
    document.getElementById('cholesterol-metric').textContent = 'Loading...';
    document.getElementById('oxygen-metric').textContent = 'Loading...';
}

function updateHealthMetrics() {
    // Get form data for calculations
    const formData = new FormData(document.getElementById('assessment-form'));
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Call API to get health metrics
    fetch('/api/health-metrics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            console.error('Error calculating metrics:', result.error);
            // Fallback to calculate from form data
            updateHealthMetricsFromForm(data);
            return;
        }
        
        // Update UI with real data
        document.getElementById('heart-rate-metric').textContent = result.heart_rate.zone;
        document.getElementById('bmi-metric').textContent = result.bmi.category;
        document.getElementById('cholesterol-metric').textContent = result.cholesterol.level;
        document.getElementById('oxygen-metric').textContent = result.fitness.level;
        
        // Update progress bars with real percentages
        animateProgressBar('heart-rate-progress', result.heart_rate.percentage);
        animateProgressBar('bmi-progress', result.bmi.percentage);
        animateProgressBar('cholesterol-progress', result.cholesterol.percentage);
        animateProgressBar('fitness-progress', result.fitness.percentage);
    })
    .catch(error => {
        console.error('Error fetching health metrics:', error);
        // Fallback to calculate from form data
        updateHealthMetricsFromForm(data);
    });
}

function updateHealthMetricsFromForm(data) {
    console.log('Calculating health metrics from form data:', data);
    
    // Calculate Heart Rate Zone
    const age = parseInt(data.age) || 30;
    const maxHR = 220 - age;
    const restingHR = 70; // Default assumption
    const hrZone = calculateHeartRateZone(age, maxHR);
    document.getElementById('heart-rate-metric').textContent = hrZone.zone;
    animateProgressBar('heart-rate-progress', hrZone.percentage);
    
    // Calculate BMI Category
    const heightFeet = parseInt(data.height_feet) || 5;
    const heightInches = parseInt(data.height_inches) || 8;
    const weight = parseInt(data.weight) || 150;
    const heightTotalInches = (heightFeet * 12) + heightInches;
    const heightM = heightTotalInches * 0.0254;
    const weightKg = weight * 0.453592;
    const bmi = weightKg / (heightM * heightM);
    
    let bmiCategory, bmiPercentage;
    if (bmi < 18.5) {
        bmiCategory = 'Underweight';
        bmiPercentage = 40;
    } else if (bmi < 25) {
        bmiCategory = 'Normal Range';
        bmiPercentage = 85;
    } else if (bmi < 30) {
        bmiCategory = 'Overweight';
        bmiPercentage = 60;
    } else {
        bmiCategory = 'Obese';
        bmiPercentage = 30;
    }
    
    document.getElementById('bmi-metric').textContent = `${bmiCategory} (${bmi.toFixed(1)})`;
    animateProgressBar('bmi-progress', bmiPercentage);
    
    // Calculate Cholesterol Level
    const highChol = parseInt(data.highchol) || 0;
    const cholLevel = highChol ? 'High Risk' : 'Healthy Level';
    const cholPercentage = highChol ? 30 : 80;
    document.getElementById('cholesterol-metric').textContent = cholLevel;
    animateProgressBar('cholesterol-progress', cholPercentage);
    
    // Calculate Fitness Level
    const physActivity = parseInt(data.physactivity) || 1;
    const fitnessLevel = physActivity ? 'Active Lifestyle' : 'Sedentary';
    const fitnessPercentage = physActivity ? 75 : 35;
    document.getElementById('oxygen-metric').textContent = fitnessLevel;
    animateProgressBar('fitness-progress', fitnessPercentage);
    
    console.log('Health metrics calculated and displayed from form data');
}

function updateHealthMetricsDemo() {
    // Fallback demo data with better visibility
    const heartRateMetric = document.getElementById('heart-rate-metric');
    const bmiMetric = document.getElementById('bmi-metric');
    const cholesterolMetric = document.getElementById('cholesterol-metric');
    const oxygenMetric = document.getElementById('oxygen-metric');
    
    if (heartRateMetric) heartRateMetric.textContent = 'Aerobic Zone';
    if (bmiMetric) bmiMetric.textContent = 'Normal Range';
    if (cholesterolMetric) cholesterolMetric.textContent = 'Healthy Level';
    if (oxygenMetric) oxygenMetric.textContent = 'Good Fitness';
    
    // Animate progress bars
    setTimeout(() => {
        animateProgressBar('heart-rate-progress', 65);
        animateProgressBar('bmi-progress', 75);
        animateProgressBar('cholesterol-progress', 80);
        animateProgressBar('fitness-progress', 70);
    }, 500);
    
    console.log('Demo health metrics loaded');
}

function calculateHeartRateZone(age, maxHR) {
    const maxHeartRate = 220 - age;
    const percentage = (maxHR / maxHeartRate) * 100;
    
    let zone = 'Unknown';
    if (percentage < 50) zone = 'Resting';
    else if (percentage < 60) zone = 'Fat Burn';
    else if (percentage < 70) zone = 'Aerobic';
    else if (percentage < 85) zone = 'Anaerobic';
    else zone = 'Red Line';
    
    return { zone, percentage: Math.min(percentage, 100) };
}

function calculateBMIFromForm(formData) {
    // This would need height/weight data - for demo purposes
    const categories = ['Underweight', 'Normal', 'Overweight', 'Obese'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const percentage = Math.random() * 100;
    
    return { category, percentage };
}

function categorizesCholesterol(cholesterol) {
    let level = 'Normal';
    let percentage = 50;
    
    if (cholesterol < 200) {
        level = 'Desirable';
        percentage = 75;
    } else if (cholesterol < 240) {
        level = 'Borderline';
        percentage = 40;
    } else {
        level = 'High';
        percentage = 20;
    }
    
    return { level, percentage };
}

function calculateFitnessLevel(age, maxHR) {
    const expectedMax = 220 - age;
    const fitnessRatio = maxHR / expectedMax;
    
    let level = 'Poor';
    let percentage = 25;
    
    if (fitnessRatio > 0.9) {
        level = 'Excellent';
        percentage = 95;
    } else if (fitnessRatio > 0.8) {
        level = 'Good';
        percentage = 75;
    } else if (fitnessRatio > 0.7) {
        level = 'Fair';
        percentage = 55;
    }
    
    return { level, percentage };
}

function animateProgressBar(id, percentage) {
    const progressBar = document.getElementById(id);
    if (progressBar) {
        // Reset width first
        progressBar.style.width = '0%';
        
        // Animate to target width
        setTimeout(() => {
            progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
            console.log(`Progress bar ${id} animated to ${percentage}%`);
        }, 100);
    } else {
        console.warn(`Progress bar with id '${id}' not found`);
    }
}

function createRiskMatrix() {
    const riskMatrix = document.getElementById('risk-matrix');
    if (!riskMatrix) {
        console.error('Risk matrix element not found');
        return;
    }
    
    // Show loading state
    riskMatrix.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Calculating risk factors...</div>';
    
    const formData = new FormData(document.getElementById('assessment-form'));
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Call API to get risk factors
    fetch('/api/risk-factors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            console.error('Error calculating risk factors:', result.error);
            createRiskMatrixDemo();
            return;
        }
        
        const riskFactors = result.risk_factors;
        const iconMap = {
            'Age': 'fas fa-calendar-alt',
            'Blood Pressure': 'fas fa-thermometer-half',
            'Cholesterol': 'fas fa-tint',
            'Exercise': 'fas fa-running',
            'Smoking': 'fas fa-smoking-ban',
            'Diabetes': 'fas fa-syringe',
            'BMI': 'fas fa-weight',
            'General Health': 'fas fa-heart-pulse'
        };
        
        riskMatrix.innerHTML = riskFactors.map(factor => `
            <div class="risk-factor-tile ${factor.risk}-risk" onclick="showFactorDetails('${factor.name}', '${factor.risk}', '${factor.value}')">
                <div class="risk-factor-icon">
                    <i class="${iconMap[factor.name] || 'fas fa-question'}"></i>
                </div>
                <p class="risk-factor-label">${factor.name}</p>
                <p class="risk-factor-value">Value: ${factor.value}</p>
            </div>
        `).join('');
        
        console.log('Risk matrix created successfully');
    })
    .catch(error => {
        console.error('Error fetching risk factors:', error);
        createRiskMatrixDemo();
    });
}

function createRiskMatrixDemo() {
    // Fallback demo risk matrix
    const riskMatrix = document.getElementById('risk-matrix');
    const riskFactors = [
        { name: 'Age', icon: 'fas fa-calendar-alt', risk: 'medium' },
        { name: 'Blood Pressure', icon: 'fas fa-thermometer-half', risk: 'low' },
        { name: 'Cholesterol', icon: 'fas fa-tint', risk: 'low' },
        { name: 'Exercise', icon: 'fas fa-running', risk: 'low' },
        { name: 'Smoking', icon: 'fas fa-smoking-ban', risk: 'low' },
        { name: 'Diabetes', icon: 'fas fa-syringe', risk: 'low' },
        { name: 'BMI', icon: 'fas fa-weight', risk: 'medium' },
        { name: 'General Health', icon: 'fas fa-heart-pulse', risk: 'medium' }
    ];
    
    riskMatrix.innerHTML = riskFactors.map(factor => `
        <div class="risk-factor-tile ${factor.risk}-risk" onclick="showFactorDetails('${factor.name}', '${factor.risk}', 'demo')">
            <div class="risk-factor-icon">
                <i class="${factor.icon}"></i>
            </div>
            <p class="risk-factor-label">${factor.name}</p>
        </div>
    `).join('');
}

function showFactorDetails(factorName, risk, value) {
    const riskMessages = {
        'low': 'This factor poses minimal risk to your cardiovascular health.',
        'medium': 'This factor requires attention and lifestyle modifications.',
        'high': 'This factor significantly increases your cardiovascular risk and needs immediate attention.'
    };
    
    const recommendations = {
        'Age': 'While age is not modifiable, focus on other controllable risk factors.',
        'Blood Pressure': 'Monitor regularly, reduce sodium intake, exercise regularly, and manage stress.',
        'Cholesterol': 'Follow a heart-healthy diet, exercise regularly, and consider medication if needed.',
        'Exercise': 'Aim for 150 minutes of moderate aerobic activity per week.',
        'Smoking': 'Quit smoking immediately and avoid secondhand smoke.',
        'Diabetes': 'Maintain good blood sugar control through diet, exercise, and medication.',
        'BMI': 'Maintain a healthy weight through balanced diet and regular exercise.',
        'General Health': 'Follow a healthy lifestyle and have regular checkups.'
    };
    
    alert(`${factorName} Risk Assessment\n\nRisk Level: ${risk.toUpperCase()}\nValue: ${value}\n\n${riskMessages[risk]}\n\nRecommendation: ${recommendations[factorName]}`);
}

function createHealthGoals() {
    const goalsContainer = document.getElementById('health-goals');
    
    // Get form data to create personalized goals
    const formData = new FormData(document.getElementById('assessment-form'));
    const age = parseInt(formData.get('age')) || 30;
    const physActivity = parseInt(formData.get('physactivity')) || 1;
    const highBP = parseInt(formData.get('highbp')) || 0;
    const smoker = parseInt(formData.get('smoker')) || 0;
    
    const goals = [];
    
    // Dynamic goal generation based on risk factors
    if (highBP) {
        goals.push({ title: 'Lower Blood Pressure', current: 25, target: 100, priority: 'high' });
    } else {
        goals.push({ title: 'Maintain Healthy BP', current: 80, target: 100, priority: 'low' });
    }
    
    if (!physActivity) {
        goals.push({ title: 'Increase Exercise', current: 15, target: 100, priority: 'high' });
    } else {
        goals.push({ title: 'Maintain Exercise', current: 70, target: 100, priority: 'medium' });
    }
    
    if (smoker) {
        goals.push({ title: 'Quit Smoking', current: 10, target: 100, priority: 'high' });
    } else {
        goals.push({ title: 'Stay Smoke-Free', current: 100, target: 100, priority: 'low' });
    }
    
    goals.push({ title: 'Improve Diet Quality', current: Math.floor(Math.random() * 50) + 30, target: 100, priority: 'medium' });
    
    goalsContainer.innerHTML = goals.map(goal => `
        <div class="goal-item ${goal.priority}-priority">
            <h4 class="goal-title">${goal.title}</h4>
            <div class="goal-progress">
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: ${goal.current}%"></div>
                </div>
                <span>${goal.current}%</span>
            </div>
            <div class="goal-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="updateGoalProgress('${goal.title}')">
                    <i class="fas fa-plus"></i> Update
                </button>
            </div>
        </div>
    `).join('');
}

function updateGoalProgress(goalTitle) {
    const newProgress = prompt(`Update progress for "${goalTitle}" (0-100%):`);
    if (newProgress && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
        alert(`Progress updated to ${newProgress}% for ${goalTitle}!`);
        // In a real app, this would update the database and refresh the UI
        createHealthGoals(); // Refresh goals display
    } else if (newProgress !== null) {
        alert('Please enter a valid number between 0 and 100.');
    }
}

function createHealthJourneyChart() {
    const ctx = document.getElementById('health-journey-chart');
    if (!ctx) return;
    
    // Fetch timeline data from API
    fetch('/api/health-timeline')
    .then(response => response.json())
    .then(data => {
        createTimelineChart(ctx, data);
    })
    .catch(error => {
        console.error('Error fetching timeline data:', error);
        // Fallback to demo data
        const demoData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            risk_scores: [75, 70, 65, 60, 55, 45],
            fitness_scores: [40, 45, 50, 55, 60, 70]
        };
        createTimelineChart(ctx, demoData);
    });
}

function createTimelineChart(ctx, data) {
    const chartData = {
        labels: data.labels,
        datasets: [{
            label: 'Risk Score',
            data: data.risk_scores,
            borderColor: '#d62839',
            backgroundColor: 'rgba(214, 40, 57, 0.1)',
            tension: 0.4,
            fill: true
        }, {
            label: 'Fitness Level',
            data: data.fitness_scores,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Health Progress Over Time'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Score (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            }
        }
    });
}

function addTimelineEntry() {
    const entry = prompt('Enter your current health score (0-100):');
    if (entry && !isNaN(entry) && entry >= 0 && entry <= 100) {
        // In a real app, this would save to a database
        alert(`Health score ${entry} recorded for today! This would be saved to your health timeline.`);
        
        // Optionally refresh the chart with new data
        // createHealthJourneyChart();
    } else if (entry !== null) {
        alert('Please enter a valid number between 0 and 100.');
    }
}

function exportTimeline() {
    // Create sample CSV data
    const csvData = [
        ['Date', 'Risk Score', 'Fitness Score'],
        ['2024-01-01', '75', '40'],
        ['2024-02-01', '70', '45'],
        ['2024-03-01', '65', '50'],
        ['2024-04-01', '60', '55'],
        ['2024-05-01', '55', '60'],
        ['2024-06-01', '45', '70']
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'health_timeline.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function generateAIRecommendations() {
    const recommendationsContainer = document.getElementById('ai-recommendations');
    const recommendations = [
        {
            title: 'Increase Cardiovascular Exercise',
            icon: 'fas fa-running',
            content: 'Based on your current fitness level, aim for 150 minutes of moderate aerobic activity per week. Start with 20-minute walks and gradually increase intensity.',
            priority: 'high'
        },
        {
            title: 'Monitor Blood Pressure Daily',
            icon: 'fas fa-heartbeat',
            content: 'Your blood pressure readings suggest daily monitoring would be beneficial. Consider investing in a home blood pressure monitor.',
            priority: 'high'
        },
        {
            title: 'Optimize Sleep Schedule',
            icon: 'fas fa-bed',
            content: 'Quality sleep is crucial for heart health. Aim for 7-9 hours per night and maintain a consistent sleep schedule.',
            priority: 'medium'
        },
        {
            title: 'Stress Management Techniques',
            icon: 'fas fa-spa',
            content: 'Consider incorporating meditation, yoga, or deep breathing exercises to manage stress levels and improve heart health.',
            priority: 'medium'
        },
        {
            title: 'Nutritional Assessment',
            icon: 'fas fa-apple-alt',
            content: 'A diet rich in fruits, vegetables, and whole grains can significantly improve cardiovascular health. Consider consulting a nutritionist.',
            priority: 'low'
        },
        {
            title: 'Regular Health Checkups',
            icon: 'fas fa-user-md',
            content: 'Schedule regular checkups with your healthcare provider to monitor your cardiovascular health progress.',
            priority: 'medium'
        }
    ];
    
    recommendationsContainer.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card">
            <div class="recommendation-header">
                <div class="recommendation-icon">
                    <i class="${rec.icon}"></i>
                </div>
                <h4 class="recommendation-title">${rec.title}</h4>
            </div>
            <div class="recommendation-content">
                ${rec.content}
            </div>
            <div class="recommendation-priority priority-${rec.priority}">
                ${rec.priority.toUpperCase()} PRIORITY
            </div>
        </div>
    `).join('');
}

function updateCommunityStats() {
    const communityContainer = document.getElementById('community-stats');
    
    // Fetch community stats from API
    fetch('/api/community-stats')
    .then(response => response.json())
    .then(data => {
        const stats = data.community_stats;
        communityContainer.innerHTML = stats.map(stat => `
            <div class="community-stat">
                <div>
                    <div class="community-stat-label">${stat.label}</div>
                    <div class="community-stat-value">${stat.value}</div>
                </div>
                <div class="community-percentile ${stat.better ? 'better' : 'worse'}">
                    <i class="fas fa-${stat.better ? 'arrow-up' : 'arrow-down'}"></i>
                    ${stat.percentile}
                </div>
            </div>
        `).join('');
    })
    .catch(error => {
        console.error('Error fetching community stats:', error);
        // Fallback to demo data
        updateCommunityStatsDemo();
    });
}

function updateCommunityStatsDemo() {
    const communityContainer = document.getElementById('community-stats');
    const stats = [
        { label: 'Your Age Group Average Risk', value: '45%', percentile: '25th percentile', better: true },
        { label: 'Similar BMI Range', value: '52%', percentile: '40th percentile', better: false },
        { label: 'Regional Health Score', value: '38%', percentile: '35th percentile', better: true },
        { label: 'Fitness Level Comparison', value: 'Above Average', percentile: '65th percentile', better: true }
    ];
    
    communityContainer.innerHTML = stats.map(stat => `
        <div class="community-stat">
            <div>
                <div class="community-stat-label">${stat.label}</div>
                <div class="community-stat-value">${stat.value}</div>
            </div>
            <div class="community-percentile ${stat.better ? 'better' : 'worse'}">
                <i class="fas fa-${stat.better ? 'arrow-up' : 'arrow-down'}"></i>
                ${stat.percentile}
            </div>
        </div>
    `).join('');
}

function updateAchievements() {
    const achievementsContainer = document.getElementById('achievements-list');
    if (!achievementsContainer) {
        console.error('Achievements container not found');
        return;
    }
    
    const achievements = [
        { title: 'First Assessment', description: 'Completed your first health check', icon: 'fas fa-medal', unlocked: true },
        { title: 'Health Warrior', description: 'Maintained low risk for 3 months', icon: 'fas fa-shield-alt', unlocked: false },
        { title: 'Exercise Champion', description: 'Met exercise goals for 4 weeks', icon: 'fas fa-trophy', unlocked: true },
        { title: 'Heart Hero', description: 'Improved risk score by 20%', icon: 'fas fa-heart', unlocked: false },
        { title: 'Consistency King', description: 'Daily health tracking for 30 days', icon: 'fas fa-crown', unlocked: false },
        { title: 'Lifestyle Legend', description: 'Completed all health recommendations', icon: 'fas fa-star', unlocked: false }
    ];
    
    achievementsContainer.innerHTML = achievements.map(achievement => `
        <div class="achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}">
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <h5 class="achievement-title">${achievement.title}</h5>
            <p class="achievement-description">${achievement.description}</p>
            ${achievement.unlocked ? '<span class="unlock-badge">Unlocked!</span>' : '<span class="lock-badge">Locked</span>'}
        </div>
    `).join('');
    
    console.log('Achievements updated successfully');
}

// Add click to skip welcome animation
const welcomeScreen = document.querySelector('.welcome-screen');
if (welcomeScreen) {
    welcomeScreen.style.cursor = 'pointer';
    welcomeScreen.title = 'Click to skip animation';
    welcomeScreen.addEventListener('click', function() {
        console.log('Welcome screen clicked - skipping animation');
        skipWelcomeAnimation();
    });
}

// Function to skip welcome animation
function skipWelcomeAnimation() {
    const welcomeScreen = document.querySelector('.welcome-screen');
    const mainContainer = document.querySelector('.main-container');
    
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
    if (mainContainer) {
        mainContainer.style.display = 'block';
        mainContainer.style.opacity = '1';
    }
}

function resetAssessment() {
    // Reset form
    const form = document.getElementById('assessment-form');
    if (form) {
        form.reset();
    }
    
    // Reset all cards to inactive except first one
    const cards = document.querySelectorAll('.assessment-card');
    cards.forEach((card, index) => {
        if (index === 0) {
            card.classList.add('active');
            card.style.visibility = 'visible';
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        } else {
            card.classList.remove('active');
            card.style.visibility = 'hidden';
            card.style.opacity = '0';
        }
    });
    
    // Reset progress indicator
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        if (index === 0) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Show assessment section
    const assessmentContainer = document.querySelector('.assessment-container');
    if (assessmentContainer) {
        assessmentContainer.style.display = 'block';
    }
    
    // Hide results section
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
    
    // Hide analytics dashboard
    const analyticsSection = document.querySelector('.analytics-dashboard');
    if (analyticsSection) {
        analyticsSection.style.display = 'none';
    }
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log('Assessment reset successfully');
}

function initializeChart() {
    const ctx = document.getElementById('riskChart');
    if (!ctx) {
        console.warn('Risk chart canvas not found');
        return;
    }
    
    // Sample risk factor data - in a real app this would come from the assessment
    const riskData = {
        labels: ['Age', 'Blood Pressure', 'Cholesterol', 'Exercise', 'Smoking', 'Diabetes', 'BMI'],
        datasets: [{
            label: 'Risk Level',
            data: [60, 30, 25, 15, 0, 10, 40], // Sample risk percentages
            backgroundColor: [
                '#ff6b6b', // Age - medium risk
                '#4ecdc4', // BP - low risk  
                '#45b7d1', // Cholesterol - low risk
                '#96ceb4', // Exercise - low risk
                '#feca57', // Smoking - no risk
                '#48dbfb', // Diabetes - low risk
                '#ff9ff3'  // BMI - medium risk
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: riskData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function initializeHealthComparison() {
    const comparisonContainer = document.getElementById('comparison-items');
    if (!comparisonContainer) {
        console.warn('Comparison container not found');
        return;
    }
    
    // Sample comparison data - in a real app this would be calculated from user data
    const comparisons = [
        {
            metric: 'Blood Pressure',
            userValue: '120/80',
            idealRange: '< 120/80',
            status: 'optimal',
            icon: 'fas fa-heartbeat'
        },
        {
            metric: 'BMI',
            userValue: '24.2',
            idealRange: '18.5 - 24.9',
            status: 'optimal',
            icon: 'fas fa-weight'
        },
        {
            metric: 'Cholesterol',
            userValue: '180 mg/dL',
            idealRange: '< 200 mg/dL',
            status: 'optimal',
            icon: 'fas fa-tint'
        },
        {
            metric: 'Exercise per Week',
            userValue: '3 hours',
            idealRange: '2.5+ hours',
            status: 'good',
            icon: 'fas fa-running'
        },
        {
            metric: 'Smoking Status',
            userValue: 'Non-smoker',
            idealRange: 'Non-smoker',
            status: 'optimal',
            icon: 'fas fa-smoking-ban'
        }
    ];
    
    comparisonContainer.innerHTML = comparisons.map(item => `
        <div class="comparison-item ${item.status}">
            <div class="comparison-icon">
                <i class="${item.icon}"></i>
            </div>
            <div class="comparison-details">
                <h5 class="comparison-metric">${item.metric}</h5>
                <div class="comparison-values">
                    <span class="user-value">Your Value: ${item.userValue}</span>
                    <span class="ideal-range">Ideal Range: ${item.idealRange}</span>
                </div>
            </div>
            <div class="comparison-status">
                <i class="fas fa-${item.status === 'optimal' ? 'check-circle' : item.status === 'good' ? 'thumbs-up' : 'exclamation-triangle'}"></i>
                <span>${item.status.toUpperCase()}</span>
            </div>
        </div>
    `).join('');
}
