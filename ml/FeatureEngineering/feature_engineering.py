import pandas as pd
import os

class FeatureEngineeringPipeline:
    def __init__(self, input_path: str, output_path: str):
        self.input_path = input_path
        self.output_path = output_path

    def run(self):
        print(f"Loading data from {self.input_path}")
        df = pd.read_csv(self.input_path)
        
        print("Creating features...")
        # Target variable: 0 = Away Win, 1 = Draw, 2 = Home Win
        conditions = [
            (df['home_score'] > df['away_score']),
            (df['home_score'] == df['away_score']),
            (df['home_score'] < df['away_score'])
        ]
        choices = [2, 1, 0]
        df['result'] = pd.Series(pd.NA)
        import numpy as np
        df['result'] = np.select(conditions, choices, default=pd.NA)
        df['result'] = df['result'].astype(int)

        # Elo difference
        df['elo_diff'] = df['home_elo'] - df['away_elo']
        
        # xG difference
        df['xg_diff'] = df['home_xg'] - df['away_xg']
        
        # Is tournament match (more competitive)
        df['is_tournament'] = (df['tournament'] == 'World Cup').astype(int)

        features = [
            'home_elo', 'away_elo', 'elo_diff', 
            'home_xg', 'away_xg', 'xg_diff', 
            'is_tournament'
        ]
        
        X = df[features]
        y = df['result']

        os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
        final_df = pd.concat([X, y], axis=1)
        final_df.to_csv(self.output_path, index=False)
        print(f"Feature engineering complete. Saved to {self.output_path}")

if __name__ == "__main__":
    pipeline = FeatureEngineeringPipeline(
        input_path="../../datasets/historical_matches.csv",
        output_path="../../datasets/engineered_features.csv"
    )
    pipeline.run()
