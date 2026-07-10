import os
import time
import requests
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

class HybridDataAgent:
    def __init__(self):
        self.api_key = os.getenv("API_FOOTBALL_KEY")
        self.api_host = os.getenv("API_FOOTBALL_HOST")
        self.output_dir = "../datasets"
        os.makedirs(self.output_dir, exist_ok=True)
        self.historical_url = "https://raw.githubusercontent.com/martj42/international_results/master/results.csv"

    def fetch_live_fixtures(self):
        """Fetches live fixtures and scores using API-Football."""
        if not self.api_key or self.api_key == "your_rapidapi_key_here":
            print("[HybridDataAgent] No valid API_FOOTBALL_KEY found in .env.")
            return self._fallback_to_historical()
            
        print("[HybridDataAgent] Requesting live fixtures from API-Football...")
        url = f"https://{self.api_host}/v3/fixtures?live=all"
        headers = {
            "X-RapidAPI-Key": self.api_key,
            "X-RapidAPI-Host": self.api_host
        }
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                print(f"[HybridDataAgent] Success: Retrieved {len(data['response'])} live fixtures.")
                # Here we would map this to the SQLAlchemy PostgreSQL models
                return data['response']
            elif response.status_code == 429:
                print("[HybridDataAgent] Rate limited by API. Falling back to Cache/Historical.")
                return self._fallback_to_historical()
            else:
                print(f"[HybridDataAgent] Error {response.status_code}: {response.text}")
                return self._fallback_to_historical()
        except Exception as e:
            print(f"[HybridDataAgent] Exception during API call: {e}")
            return self._fallback_to_historical()

    def _fallback_to_historical(self):
        """Downloads martj42 historical international dataset for ML training."""
        print("[HybridDataAgent] FALLBACK: Fetching martj42/international_results historical dataset...")
        try:
            df = pd.read_csv(self.historical_url)
            output_path = os.path.join(self.output_dir, "martj42_results.csv")
            df.to_csv(output_path, index=False)
            print(f"[HybridDataAgent] Saved {len(df)} historical matches to {output_path}")
            return df
        except Exception as e:
            print(f"[HybridDataAgent] Critical Error fetching fallback data: {e}")
            return None

if __name__ == "__main__":
    agent = HybridDataAgent()
    # 1. Try to fetch live data via API (fallback to historical if it fails)
    agent.fetch_live_fixtures()
