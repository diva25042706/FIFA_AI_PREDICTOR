from celery import Celery
import time
import os

# Configure Celery to use Redis as the broker
broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
backend_url = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

celery_app = Celery("world_cup_tasks", broker=broker_url, backend=backend_url)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task(name="tasks.run_monte_carlo_simulation")
def run_monte_carlo_simulation(num_simulations: int = 100000):
    """
    Simulates the World Cup tournament dynamically using only active teams.
    """
    from tournament_state import state
    print(f"Starting {num_simulations} Monte Carlo simulations...")
    time.sleep(2)  # Mock simulation time
    
    active_teams = state.get_active_teams()
    
    if not active_teams:
        return {"champion_probabilities": {}, "upset_probability": 0}
        
    # Mock dynamic probability distribution among active teams
    base_probs = [0.35, 0.25, 0.20, 0.10, 0.05, 0.03, 0.01, 0.01]
    
    results = {"champion_probabilities": {}}
    for i, team in enumerate(active_teams):
        prob = base_probs[i] if i < len(base_probs) else 0.0
        results["champion_probabilities"][team["name"]] = prob
        
    results["upset_probability"] = 0.34
    
    print("Simulation complete.")
    return results

@celery_app.task(name="tasks.predict_match")
def predict_match(home_team: str, away_team: str):
    """
    Predicts a single match using the XGBoost model.
    """
    print(f"Predicting match: {home_team} vs {away_team}")
    time.sleep(1) # Mock ML inference time
    
    # Mock prediction probabilities
    return {
        "home_team": home_team,
        "away_team": away_team,
        "home_win_prob": 0.45,
        "draw_prob": 0.25,
        "away_win_prob": 0.30,
        "confidence_score": 0.88,
        "shap_explanation": "Home team favored due to +200 Elo advantage."
    }
