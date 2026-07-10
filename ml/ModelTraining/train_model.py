import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import shap
import matplotlib.pyplot as plt
import os
import pickle

class ModelTrainer:
    def __init__(self, data_path: str, model_output_dir: str):
        self.data_path = data_path
        self.model_output_dir = model_output_dir
        os.makedirs(self.model_output_dir, exist_ok=True)

    def train_and_evaluate(self):
        print(f"Loading data from {self.data_path}")
        df = pd.read_csv(self.data_path)
        
        # Features and Target
        X = df.drop(columns=['result'])
        y = df['result']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        print("Training XGBoost Classifier...")
        # 0=Away Win, 1=Draw, 2=Home Win
        model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', random_state=42)
        model.fit(X_train, y_train)
        
        print("Evaluating Model...")
        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        print(f"Accuracy: {acc:.4f}")
        print(classification_report(y_test, y_pred))
        
        model_path = os.path.join(self.model_output_dir, "xgboost_model.pkl")
        with open(model_path, 'wb') as f:
            pickle.dump(model, f)
        print(f"Model saved to {model_path}")
        
        self._generate_shap(model, X_train)
        
    def _generate_shap(self, model, X_train):
        print("Generating SHAP values for Explainable AI...")
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(X_train)
        
        # Save summary plot
        plt.figure(figsize=(10, 6))
        # shap_values for multiclass is a list, taking the first class (Away win) as an example for the plot or just plotting all
        if isinstance(shap_values, list):
            shap.summary_plot(shap_values, X_train, plot_type="bar", show=False)
        else:
            shap.summary_plot(shap_values, X_train, show=False)
        
        plot_path = os.path.join(self.model_output_dir, "shap_summary.png")
        plt.savefig(plot_path, bbox_inches='tight')
        plt.close()
        print(f"SHAP summary plot saved to {plot_path}")

if __name__ == "__main__":
    trainer = ModelTrainer(
        data_path="../../datasets/engineered_features.csv",
        model_output_dir="../../ml/models"
    )
    trainer.train_and_evaluate()
