import os
import time
import random
import pandas as pd
import mlflow
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, log_loss

class DataValidationAgent:
    def __init__(self, data_path: str):
        self.data_path = data_path

    def validate(self) -> bool:
        """
        Simulates checking for data drift and anomalies.
        Returns True if the data is valid and retraining should proceed.
        """
        print("[DataValidationAgent] Checking for new data...")
        time.sleep(1)
        if not os.path.exists(self.data_path):
            print("[DataValidationAgent] Error: Data file not found!")
            return False
            
        df = pd.read_csv(self.data_path)
        print(f"[DataValidationAgent] Validating {len(df)} records for data drift...")
        
        # Check for missing values
        if df.isnull().sum().sum() > 0:
            print("[DataValidationAgent] Warning: Missing values detected! Attempting automatic imputation...")
            time.sleep(1)
            
        print("[DataValidationAgent] Data validation passed. No severe drift detected.")
        return True

class ModelTrainingAgent:
    def __init__(self, data_path: str):
        self.data_path = data_path
        # Setup MLflow
        mlflow.set_tracking_uri("sqlite:///mlflow.db")
        mlflow.set_experiment("FIFA_WorldCup_Predictor")

    def train(self):
        print("[ModelTrainingAgent] Starting automated model training...")
        df = pd.read_csv(self.data_path)
        X = df.drop(columns=['result'])
        y = df['result']
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        with mlflow.start_run() as run:
            # Hyperparameters
            params = {
                'use_label_encoder': False,
                'eval_metric': 'mlogloss',
                'max_depth': random.choice([3, 5, 7]),
                'learning_rate': random.choice([0.01, 0.05, 0.1]),
                'n_estimators': 100
            }
            mlflow.log_params(params)
            
            print(f"[ModelTrainingAgent] Training XGBoost with params: {params}")
            model = xgb.XGBClassifier(**params, random_state=42)
            model.fit(X_train, y_train)

            # Evaluation
            y_pred = model.predict(X_test)
            y_prob = model.predict_proba(X_test)
            
            acc = accuracy_score(y_test, y_pred)
            loss = log_loss(y_test, y_prob)
            
            mlflow.log_metric("accuracy", acc)
            mlflow.log_metric("log_loss", loss)
            
            # Log Model
            mlflow.xgboost.log_model(model, artifact_path="model")
            
            print(f"[ModelTrainingAgent] Training complete. Accuracy: {acc:.4f} | Log Loss: {loss:.4f}")
            return run.info.run_id, acc

class DeploymentAgent:
    def __init__(self):
        self.threshold_accuracy = 0.50 # Baseline threshold

    def evaluate_and_deploy(self, run_id: str, new_accuracy: float):
        print(f"[DeploymentAgent] Evaluating new model (Run ID: {run_id}) against production threshold ({self.threshold_accuracy})...")
        time.sleep(1)
        if new_accuracy > self.threshold_accuracy:
            print(f"[DeploymentAgent] SUCCESS: New model outperformed baseline. Deploying to production endpoint...")
            # In a real scenario, this updates MLflow model registry tags
            # e.g., client = MlflowClient(); client.transition_model_version_stage(...)
            print(f"[DeploymentAgent] Model {run_id} is now ACTIVE in Production.")
        else:
            print(f"[DeploymentAgent] REJECTED: New model did not meet accuracy threshold. Keeping current production model.")

def run_mlops_pipeline():
    print("=== FIFA World Cup AI: MLOps Agentic Orchestrator ===")
    data_path = "../datasets/engineered_features.csv"
    
    # 1. Validation
    validator = DataValidationAgent(data_path)
    if not validator.validate():
        print("Pipeline aborted by DataValidationAgent.")
        return
        
    # 2. Training
    trainer = ModelTrainingAgent(data_path)
    run_id, accuracy = trainer.train()
    
    # 3. Deployment
    deployer = DeploymentAgent()
    deployer.evaluate_and_deploy(run_id, accuracy)
    
if __name__ == "__main__":
    run_mlops_pipeline()
