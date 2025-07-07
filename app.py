from flask import Flask, render_template, request, jsonify
import pickle
import pandas as pd
import json
import os
from datetime import datetime, timedelta
import random

app = Flask(__name__)

# Load the trained model pipeline
model_path = os.path.join(os.path.dirname(__file__), 'best_heart_model.pkl')
try:
    model = pickle.load(open(model_path, 'rb'))
except FileNotFoundError:
    print(f"Error: Model file not found at {model_path}")
    model = None
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/', methods=['GET', 'POST'])
def index():
    prediction = None
    if request.method == 'POST':
        try:
            if model is None:
                prediction = "Error: Model not loaded. Please check model file."
                return render_template('index.html', prediction=prediction)
                
            # Get form data with defaults for missing fields
            data = [
                float(request.form.get('highbp', 0)),
                float(request.form.get('highchol', 0)),
                float(request.form.get('cholcheck', 1)),  # Default to Yes
                float(request.form.get('bmi', 25)),
                float(request.form.get('smoker', 0)),
                0,  # Stroke, not included in UI - keeping for compatibility
                float(request.form.get('diabetes', 0)),
                float(request.form.get('physactivity', 1)),  # Default to Yes
                float(request.form.get('fruits', 1)),  # Default to Yes
                float(request.form.get('veggies', 1)),  # Default to Yes
                float(request.form.get('hvyalcoholconsump', 0)),
                float(request.form.get('anyhealthcare', 1)),  # Default to Yes
                float(request.form.get('nodocbccost', 0)),
                float(request.form.get('genhlth', 3)),  # Default to Good
                float(request.form.get('menthlth', 0)),
                float(request.form.get('physhlth', 0)),
                float(request.form.get('diffwalk', 0)),
                float(request.form.get('sex', 0)),
                float(request.form.get('age', 30)),
                float(request.form.get('education', 4)),  # Default to High school
                float(request.form.get('income', 5))  # Default to middle income
            ]

            columns = [
                'HighBP', 'HighChol', 'CholCheck', 'BMI', 'Smoker', 'Stroke',
                'Diabetes', 'PhysActivity', 'Fruits', 'Veggies', 'HvyAlcoholConsump',
                'AnyHealthcare', 'NoDocbcCost', 'GenHlth', 'MentHlth', 'PhysHlth',
                'DiffWalk', 'Sex', 'Age', 'Education', 'Income'
            ]

            df = pd.DataFrame([data], columns=columns)
            pred = model.predict(df)[0]
            prediction = '⚠️ High Risk of Heart Disease' if pred == 1 else '✅ Low Risk of Heart Disease'

        except Exception as e:
            prediction = f"Error in input: {str(e)}"

    return render_template('index.html', prediction=prediction)

@app.route('/new-assessment')
def new_assessment():
    """Route to start a fresh assessment"""
    return render_template('index.html', prediction=None)

@app.route('/api/health-metrics', methods=['POST'])
def get_health_metrics():
    """API endpoint to calculate health metrics from form data"""
    try:
        data = request.json
        
        # Calculate heart rate zone
        age = int(data.get('age', 30))
        max_hr = 220 - age
        heart_rate_zone = calculate_heart_rate_zone(age, max_hr)
        
        # Calculate BMI category
        height_feet = int(data.get('height_feet', 5))
        height_inches = int(data.get('height_inches', 8))
        weight = int(data.get('weight', 150))
        height_total_inches = (height_feet * 12) + height_inches
        height_m = height_total_inches * 0.0254
        weight_kg = weight * 0.453592
        bmi = weight_kg / (height_m * height_m)
        bmi_result = calculate_bmi_category(bmi)
        
        # Calculate cholesterol level
        high_cholesterol = int(data.get('highchol', 0))
        cholesterol_result = calculate_cholesterol_level(high_cholesterol)
        
        # Calculate fitness level
        physical_activity = int(data.get('physactivity', 1))
        fitness_result = calculate_fitness_level(age, physical_activity)
        
        return jsonify({
            'heart_rate': heart_rate_zone,
            'bmi': bmi_result,
            'cholesterol': cholesterol_result,
            'fitness': fitness_result
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/risk-factors', methods=['POST'])
def get_risk_factors():
    """API endpoint to calculate individual risk factors"""
    try:
        data = request.get_json()
        
        risk_factors = []
        
        # Age risk
        age = int(data.get('age', 30))
        age_risk = 'low' if age < 45 else 'medium' if age < 65 else 'high'
        risk_factors.append({'name': 'Age', 'risk': age_risk, 'value': age})
        
        # Blood pressure
        bp_risk = 'high' if int(data.get('highbp', 0)) else 'low'
        risk_factors.append({'name': 'Blood Pressure', 'risk': bp_risk, 'value': int(data.get('highbp', 0))})
        
        # Cholesterol
        chol_risk = 'high' if int(data.get('highchol', 0)) else 'low'
        risk_factors.append({'name': 'Cholesterol', 'risk': chol_risk, 'value': int(data.get('highchol', 0))})
        
        # Exercise
        exercise_risk = 'low' if int(data.get('physactivity', 1)) else 'high'
        risk_factors.append({'name': 'Exercise', 'risk': exercise_risk, 'value': int(data.get('physactivity', 1))})
        
        # Smoking
        smoking_risk = 'high' if int(data.get('smoker', 0)) else 'low'
        risk_factors.append({'name': 'Smoking', 'risk': smoking_risk, 'value': int(data.get('smoker', 0))})
        
        # Diabetes
        diabetes_risk = 'high' if int(data.get('diabetes', 0)) else 'low'
        risk_factors.append({'name': 'Diabetes', 'risk': diabetes_risk, 'value': int(data.get('diabetes', 0))})
        
        # BMI
        bmi = float(data.get('bmi', 25))
        bmi_risk = 'low' if bmi < 25 else 'medium' if bmi < 30 else 'high'
        risk_factors.append({'name': 'BMI', 'risk': bmi_risk, 'value': bmi})
        
        # General health
        gen_health = int(data.get('genhlth', 3))
        health_risk = 'low' if gen_health <= 2 else 'medium' if gen_health == 3 else 'high'
        risk_factors.append({'name': 'General Health', 'risk': health_risk, 'value': gen_health})
        
        return jsonify({'risk_factors': risk_factors})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/community-stats')
def get_community_stats():
    """API endpoint for community health statistics"""
    # Simulated community data
    stats = [
        {
            'label': 'Your Age Group Average Risk',
            'value': f"{random.randint(35, 55)}%",
            'percentile': f"{random.randint(15, 85)}th percentile",
            'better': random.choice([True, False])
        },
        {
            'label': 'Similar BMI Range',
            'value': f"{random.randint(40, 60)}%",
            'percentile': f"{random.randint(20, 80)}th percentile",
            'better': random.choice([True, False])
        },
        {
            'label': 'Regional Health Score',
            'value': f"{random.randint(30, 50)}%",
            'percentile': f"{random.randint(25, 75)}th percentile",
            'better': random.choice([True, False])
        },
        {
            'label': 'Exercise Habits Comparison',
            'value': 'Above Average',
            'percentile': f"{random.randint(60, 90)}th percentile",
            'better': True
        }
    ]
    return jsonify({'community_stats': stats})

@app.route('/api/health-timeline')
def get_health_timeline():
    """API endpoint for health journey timeline data"""
    # Generate sample timeline data
    timeline_data = {
        'labels': [],
        'risk_scores': [],
        'fitness_scores': []
    }
    
    # Generate 6 months of data
    for i in range(6):
        date = datetime.now() - timedelta(days=30*i)
        timeline_data['labels'].insert(0, date.strftime('%b'))
        timeline_data['risk_scores'].insert(0, max(20, 80 - i*8 + random.randint(-5, 5)))
        timeline_data['fitness_scores'].insert(0, min(90, 40 + i*8 + random.randint(-5, 5)))
    
    return jsonify(timeline_data)

def calculate_heart_rate_zone(age, current_hr):
    """Calculate heart rate zone and percentage"""
    max_hr = 220 - age
    percentage = (current_hr / max_hr) * 100
    
    if percentage < 50:
        zone = 'Resting'
    elif percentage < 60:
        zone = 'Fat Burn'
    elif percentage < 70:
        zone = 'Aerobic'
    elif percentage < 85:
        zone = 'Anaerobic'
    else:
        zone = 'Red Line'
    
    return {
        'zone': zone,
        'percentage': min(percentage, 100),
        'current_hr': current_hr,
        'max_hr': max_hr
    }

def calculate_bmi_category(bmi):
    """Calculate BMI category and health percentage"""
    if bmi < 18.5:
        category = 'Underweight'
        percentage = 30
    elif bmi < 25:
        category = 'Normal'
        percentage = 85
    elif bmi < 30:
        category = 'Overweight'
        percentage = 50
    else:
        category = 'Obese'
        percentage = 20
    
    return {
        'category': category,
        'percentage': percentage,
        'value': bmi
    }

def calculate_cholesterol_level(high_cholesterol):
    """Calculate cholesterol risk level"""
    if high_cholesterol:
        level = 'High Risk'
        percentage = 25
    else:
        level = 'Normal'
        percentage = 80
    
    return {
        'level': level,
        'percentage': percentage
    }

def calculate_fitness_level(age, physical_activity):
    """Calculate cardiovascular fitness level"""
    base_fitness = 60 if physical_activity else 30
    age_factor = max(0, (50 - age) / 50 * 20)  # Younger = higher fitness potential
    total_fitness = min(95, base_fitness + age_factor)
    
    if total_fitness >= 80:
        level = 'Excellent'
    elif total_fitness >= 65:
        level = 'Good'
    elif total_fitness >= 50:
        level = 'Fair'
    else:
        level = 'Poor'
    
    return {
        'level': level,
        'percentage': total_fitness
    }

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
