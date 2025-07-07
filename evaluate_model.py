"""
Quick Model Evaluation Script
Run this to evaluate your heart disease prediction model
"""

from model_evaluation import HeartDiseaseModelEvaluator

def quick_evaluation():
    """Quick model evaluation"""
    print("🔬 CARDIOCHECK MODEL EVALUATOR")
    print("="*50)
    
    # Initialize evaluator
    evaluator = HeartDiseaseModelEvaluator(
        model_path='best_heart_model.pkl',
        data_path='datasets/heart_health.csv'
    )
    
    # Run full evaluation
    results = evaluator.run_full_evaluation()
    
    if results:
        print("\n🎉 Evaluation completed! Your model is ready.")
    else:
        print("\n❌ Evaluation failed. Please check your model and data files.")

if __name__ == "__main__":
    quick_evaluation()
