import pickle
import pandas as pd
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_auc_score, roc_curve
)
from sklearn.model_selection import cross_val_score, train_test_split
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

class HeartDiseaseModelEvaluator:
    """
    Comprehensive model evaluation for heart disease prediction
    """
    
    def __init__(self, model_path='best_heart_model.pkl', data_path='datasets/heart_health.csv'):
        """
        Initialize the evaluator with model and data paths
        """
        self.model_path = model_path
        self.data_path = data_path
        self.model = None
        self.data = None
        self.X = None
        self.y = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        
    def load_model(self):
        """Load the trained model"""
        try:
            with open(self.model_path, 'rb') as file:
                self.model = pickle.load(file)
            print("✅ Model loaded successfully!")
            return True
        except FileNotFoundError:
            print(f"❌ Error: Model file not found at {self.model_path}")
            return False
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            return False
    
    def load_data(self):
        """Load and prepare the dataset"""
        try:
            self.data = pd.read_csv(self.data_path)
            print("✅ Data loaded successfully!")
            print(f"📊 Dataset shape: {self.data.shape}")
            
            # Prepare features and target
            target_column = 'HeartDiseaseorAttack'  # Your actual target column name
            if target_column in self.data.columns:
                self.X = self.data.drop(target_column, axis=1)
                self.y = self.data[target_column]
            else:
                # If target column name is different, try common alternatives
                possible_targets = ['HeartDiseaseorAttack', 'HeartDisease', 'target', 'heart_disease', 'outcome']
                for col in possible_targets:
                    if col in self.data.columns:
                        self.X = self.data.drop(col, axis=1)
                        self.y = self.data[col]
                        target_column = col
                        break
                else:
                    print("❌ Could not find target column. Please check your dataset.")
                    print(f"Available columns: {list(self.data.columns)}")
                    return False
            
            print(f"✅ Features: {list(self.X.columns)}")
            print(f"✅ Target: {target_column}")
            return True
            
        except FileNotFoundError:
            print(f"❌ Error: Data file not found at {self.data_path}")
            return False
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            return False
    
    def split_data(self, test_size=0.2, random_state=42):
        """Split data into training and testing sets"""
        if self.X is None or self.y is None:
            print("❌ Please load data first!")
            return False
        
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            self.X, self.y, test_size=test_size, random_state=random_state, stratify=self.y
        )
        
        print(f"✅ Data split successfully!")
        print(f"📊 Training set: {self.X_train.shape}")
        print(f"📊 Testing set: {self.X_test.shape}")
        return True
    
    def evaluate_model(self):
        """Comprehensive model evaluation"""
        if self.model is None:
            print("❌ Please load model first!")
            return None
        
        if self.X_test is None or self.y_test is None:
            print("❌ Please split data first!")
            return None
        
        # Make predictions
        y_pred = self.model.predict(self.X_test)
        y_prob = self.model.predict_proba(self.X_test)[:, 1] if hasattr(self.model, 'predict_proba') else None
        
        # Calculate metrics
        metrics = {
            'accuracy': accuracy_score(self.y_test, y_pred),
            'precision': precision_score(self.y_test, y_pred),
            'recall': recall_score(self.y_test, y_pred),
            'f1_score': f1_score(self.y_test, y_pred),
            'roc_auc': roc_auc_score(self.y_test, y_prob) if y_prob is not None else None
        }
        
        return metrics, y_pred, y_prob
    
    def print_evaluation_report(self):
        """Print comprehensive evaluation report"""
        print("\n" + "="*60)
        print("🔬 HEART DISEASE MODEL EVALUATION REPORT")
        print("="*60)
        
        metrics, y_pred, y_prob = self.evaluate_model()
        
        if metrics is None:
            return
        
        # Print metrics
        print(f"\n📈 PERFORMANCE METRICS:")
        print(f"   Accuracy:  {metrics['accuracy']:.4f} ({metrics['accuracy']*100:.2f}%)")
        print(f"   Precision: {metrics['precision']:.4f} ({metrics['precision']*100:.2f}%)")
        print(f"   Recall:    {metrics['recall']:.4f} ({metrics['recall']*100:.2f}%)")
        print(f"   F1-Score:  {metrics['f1_score']:.4f} ({metrics['f1_score']*100:.2f}%)")
        if metrics['roc_auc']:
            print(f"   ROC-AUC:   {metrics['roc_auc']:.4f} ({metrics['roc_auc']*100:.2f}%)")
        
        # Confusion Matrix
        cm = confusion_matrix(self.y_test, y_pred)
        print(f"\n📊 CONFUSION MATRIX:")
        print(f"   True Negative:  {cm[0,0]}")
        print(f"   False Positive: {cm[0,1]}")
        print(f"   False Negative: {cm[1,0]}")
        print(f"   True Positive:  {cm[1,1]}")
        
        # Classification Report
        print(f"\n📋 DETAILED CLASSIFICATION REPORT:")
        print(classification_report(self.y_test, y_pred, target_names=['No Heart Disease', 'Heart Disease']))
        
        # Cross-validation scores
        if self.X is not None and self.y is not None:
            cv_scores = cross_val_score(self.model, self.X, self.y, cv=5, scoring='accuracy')
            print(f"\n🔄 CROSS-VALIDATION RESULTS:")
            print(f"   CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
            print(f"   CV Scores: {cv_scores}")
        
        # Model interpretation
        print(f"\n🎯 MODEL INTERPRETATION:")
        self.interpret_results(metrics)
        
        return metrics
    
    def interpret_results(self, metrics):
        """Provide interpretation of model results"""
        accuracy = metrics['accuracy']
        precision = metrics['precision']
        recall = metrics['recall']
        f1 = metrics['f1_score']
        
        print(f"   Model Quality: ", end="")
        if accuracy >= 0.90:
            print("🌟 Excellent")
        elif accuracy >= 0.80:
            print("✅ Good")
        elif accuracy >= 0.70:
            print("⚠️ Fair")
        else:
            print("❌ Needs Improvement")
        
        print(f"   Reliability: ", end="")
        if precision >= 0.85:
            print("🔒 High - Few false alarms")
        elif precision >= 0.70:
            print("⚖️ Moderate - Some false alarms")
        else:
            print("⚠️ Low - Many false alarms")
        
        print(f"   Sensitivity: ", end="")
        if recall >= 0.85:
            print("🎯 High - Catches most cases")
        elif recall >= 0.70:
            print("📊 Moderate - Misses some cases")
        else:
            print("⚠️ Low - Misses many cases")
        
        print(f"   Overall Balance: ", end="")
        if f1 >= 0.85:
            print("⚖️ Excellent balance")
        elif f1 >= 0.75:
            print("✅ Good balance")
        else:
            print("⚠️ Could be better balanced")
    
    def plot_evaluation_charts(self):
        """Create visualization charts for model evaluation"""
        try:
            metrics, y_pred, y_prob = self.evaluate_model()
            
            if metrics is None:
                return
            
            # Create subplots
            fig, axes = plt.subplots(2, 2, figsize=(15, 12))
            fig.suptitle('Heart Disease Model Evaluation Dashboard', fontsize=16, fontweight='bold')
            
            # 1. Confusion Matrix
            cm = confusion_matrix(self.y_test, y_pred)
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[0,0])
            axes[0,0].set_title('Confusion Matrix')
            axes[0,0].set_xlabel('Predicted')
            axes[0,0].set_ylabel('Actual')
            
            # 2. Metrics Bar Chart
            metric_names = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
            metric_values = [metrics['accuracy'], metrics['precision'], metrics['recall'], metrics['f1_score']]
            
            bars = axes[0,1].bar(metric_names, metric_values, color=['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'])
            axes[0,1].set_title('Performance Metrics')
            axes[0,1].set_ylabel('Score')
            axes[0,1].set_ylim(0, 1)
            
            # Add value labels on bars
            for bar, value in zip(bars, metric_values):
                height = bar.get_height()
                axes[0,1].text(bar.get_x() + bar.get_width()/2., height + 0.01,
                             f'{value:.3f}', ha='center', va='bottom')
            
            # 3. ROC Curve (if available)
            if y_prob is not None:
                fpr, tpr, _ = roc_curve(self.y_test, y_prob)
                axes[1,0].plot(fpr, tpr, color='darkorange', lw=2, 
                              label=f'ROC curve (AUC = {metrics["roc_auc"]:.3f})')
                axes[1,0].plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
                axes[1,0].set_xlim([0.0, 1.0])
                axes[1,0].set_ylim([0.0, 1.05])
                axes[1,0].set_xlabel('False Positive Rate')
                axes[1,0].set_ylabel('True Positive Rate')
                axes[1,0].set_title('ROC Curve')
                axes[1,0].legend(loc="lower right")
            else:
                axes[1,0].text(0.5, 0.5, 'ROC Curve\nNot Available', 
                              ha='center', va='center', fontsize=12)
                axes[1,0].set_title('ROC Curve')
            
            # 4. Feature Importance (if available)
            if hasattr(self.model, 'feature_importances_'):
                feature_importance = pd.DataFrame({
                    'feature': self.X.columns,
                    'importance': self.model.feature_importances_
                }).sort_values('importance', ascending=True).tail(10)
                
                axes[1,1].barh(feature_importance['feature'], feature_importance['importance'])
                axes[1,1].set_title('Top 10 Feature Importance')
                axes[1,1].set_xlabel('Importance')
            else:
                axes[1,1].text(0.5, 0.5, 'Feature Importance\nNot Available', 
                              ha='center', va='center', fontsize=12)
                axes[1,1].set_title('Feature Importance')
            
            plt.tight_layout()
            plt.show()
            
            print("✅ Evaluation charts generated successfully!")
            
        except Exception as e:
            print(f"❌ Error generating charts: {e}")
    
    def run_full_evaluation(self):
        """Run complete model evaluation pipeline"""
        print("🚀 Starting comprehensive model evaluation...")
        
        # Load model and data
        if not self.load_model():
            return False
        
        if not self.load_data():
            return False
        
        # Split data
        if not self.split_data():
            return False
        
        # Print evaluation report
        metrics = self.print_evaluation_report()
        
        # Generate charts
        try:
            self.plot_evaluation_charts()
        except:
            print("⚠️ Charts could not be generated (matplotlib might not be available)")
        
        print("\n✅ Model evaluation completed successfully!")
        return metrics

def main():
    """Main function to run the evaluator"""
    evaluator = HeartDiseaseModelEvaluator()
    evaluator.run_full_evaluation()

if __name__ == "__main__":
    main()
