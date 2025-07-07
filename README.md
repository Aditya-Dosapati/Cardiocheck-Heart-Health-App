# CardioCheck - Advanced Heart Disease Risk Prediction Platform

A comprehensive cardiovascular health assessment platform featuring advanced machine learning, interactive analytics, and personalized health recommendations. This professional-grade application provides detailed risk analysis with an intuitive, modern interface.

## 🚀 Core Features

### **Smart Risk Assessment**
- Multi-step health questionnaire with intelligent validation
- Real-time form validation and user guidance  
- Progressive assessment with visual indicators
- Comprehensive cardiovascular risk evaluation

### **Advanced Analytics Dashboard** 
- **Health Metrics Grid**: Heart rate zones, BMI analysis, cholesterol levels, fitness scores
- **Interactive Risk Matrix**: Visual heat map of 8 key cardiovascular risk factors
- **Health Goals Tracking**: Personalized progress tracking with animated indicators
- **Community Comparisons**: Anonymous demographic health comparisons

### **AI-Powered Recommendations**
- Machine learning-based personalized health suggestions
- Priority-ranked recommendations (High/Medium/Low)
- Evidence-based lifestyle modification guidance
- Professional healthcare integration recommendations

### **Health Journey Timeline**
- Interactive progress tracking over time
- Multi-metric visualization (risk score, fitness level)
- Data export capabilities (CSV/PDF)
- Manual health data entry system

### **Beautiful Modern UI**
- Responsive design optimized for all devices
- Professional medical interface aesthetic
- Smooth animations and transitions
- Interactive charts and visualizations using Chart.js

### **Gamification & Motivation**
- Achievement system with unlockable badges
- Health milestone tracking
- Progress visualization and goal setting
- Community health insights and rankings

## 🎯 Advanced Features

### **Professional Data Visualization**
- Real-time updating charts and metrics
- Interactive risk factor heat maps
- Animated progress indicators
- Comprehensive health dashboards

### **Smart Health Recommendations**
- AI-driven personalized suggestions
- Exercise and lifestyle recommendations
- Medical monitoring guidance
- Stress management techniques

### **Community Health Features**
- Anonymous demographic comparisons
- Regional health statistics
- Percentile rankings
- Motivational achievement system

### **Export & Sharing**
- PDF health report generation
- Email sharing capabilities
- Print-optimized layouts
- Data export functionality

## � Project Structure

```
CardioCheck/
├── 📱 app.py                 # Main Flask application
├── 🤖 best_heart_model.pkl   # Trained ML model
├── 📊 model_evaluation.py    # Model performance analysis
├── 🔧 pickle_generator.py    # Model training script
├── 📋 requirements.txt       # Python dependencies
├── 📖 README.md             # Project documentation
├── 🚫 .gitignore            # Git ignore rules
├── 📁 templates/            # HTML templates
│   └── index.html           # Main application interface
├── 📁 static/               # Static assets
│   ├── 📁 css/
│   │   └── main.css         # Custom styles
│   ├── 📁 js/
│   │   └── main.js          # Interactive functionality
│   └── 📁 images/
│       └── logo.svg         # Animated logo
├── 📁 datasets/             # Data files
│   └── heart_health.csv     # Training dataset (add your own)
└── 📁 .venv/               # Virtual environment
```

## 📊 Dataset Required

**Important**: You need to place your heart health dataset in `datasets/heart_health.csv` for model evaluation to work.

The dataset should contain the following columns:
- HighBP, HighChol, CholCheck, BMI, Smoker, Stroke
- Diabetes, PhysActivity, Fruits, Veggies, HvyAlcoholConsump
- AnyHealthcare, NoDocbcCost, GenHlth, MentHlth, PhysHlth
- DiffWalk, Sex, Age, Education, Income
- HeartDiseaseorAttack (target variable)

## 📁 Project Structure

