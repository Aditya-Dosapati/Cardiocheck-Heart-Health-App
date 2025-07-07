import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

# Load dataset
df = pd.read_csv('datasets/heart_health.csv')

# Split features and target
X = df.drop('HeartDiseaseorAttack', axis=1)
y = df['HeartDiseaseorAttack']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, test_size=0.2, random_state=42)

# Preprocessing: Scaling continuous features
columns_to_scale = ['BMI', 'MentHlth', 'PhysHlth', 'Age', 'Education', 'Income']
preprocessor = ColumnTransformer(transformers=[
    ('scaler', StandardScaler(), columns_to_scale)
], remainder='passthrough')

# Best model (XGBoost)
model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')

# Full pipeline
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', model)
])

# Train
pipeline.fit(X_train, y_train)

# Save the model
with open('best_heart_model.pkl', 'wb') as f:
    pickle.dump(pipeline, f)

print("✅ Model saved as best_heart_model.pkl")
