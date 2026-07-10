from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import uvicorn
from celery.result import AsyncResult
from celery_worker import celery_app, predict_match, run_monte_carlo_simulation

app = FastAPI(
    title="FIFA World Cup Prediction Platform API",
    description="API for match predictions, tournament simulations, and probabilities.",
    version="1.0.0"
)

class MatchRequest(BaseModel):
    home_team: str
    away_team: str

class SimulationRequest(BaseModel):
    num_simulations: int = 100000

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "fifa-world-cup-ai"}

@app.post("/predict")
def predict_match_endpoint(request: MatchRequest):
    """
    Submits a background task to predict a match.
    """
    task = predict_match.delay(request.home_team, request.away_team)
    return {"task_id": task.id, "status": "Task submitted"}

@app.post("/simulate")
def simulate_tournament(request: SimulationRequest):
    """
    Submits a background task to run the Monte Carlo simulation.
    """
    task = run_monte_carlo_simulation.delay(request.num_simulations)
    return {"task_id": task.id, "status": "Task submitted"}

@app.get("/task/{task_id}")
def get_task_status(task_id: str):
    """
    Gets the status and result of a Celery background task.
    """
    task_result = AsyncResult(task_id, app=celery_app)
    if task_result.state == 'PENDING':
        return {"state": task_result.state, "status": "Pending..."}
    elif task_result.state != 'FAILURE':
        return {
            "state": task_result.state,
            "result": task_result.result
        }
    else:
        return {
            "state": task_result.state,
            "error": str(task_result.info)
        }

from tournament_state import state

@app.get("/teams/active")
def get_active_teams():
    """
    Returns the list of teams that are still alive in the tournament.
    """
    return {"active_teams": state.get_active_teams()}

class MatchResult(BaseModel):
    home_team: str
    away_team: str
    home_score: int
    away_score: int

@app.post("/matches/result")
def post_match_result(result: MatchResult):
    """
    Records a match result, eliminates the loser, and automatically triggers
    a rerun of the Monte Carlo simulation to update probabilities.
    """
    if result.home_score > result.away_score:
        loser = result.away_team
    elif result.away_score > result.home_score:
        loser = result.home_team
    else:
        # In knockout, a draw goes to penalties, assume home wins for simplicity if not specified
        loser = result.away_team 

    success = state.eliminate_team(loser)
    if not success:
        raise HTTPException(status_code=400, detail=f"Team {loser} could not be eliminated (maybe already eliminated or doesn't exist).")

    # Automatically trigger full simulation recalculation
    sim_task = run_monte_carlo_simulation.delay(100000)
    
    return {
        "message": f"Match recorded. {loser} has been ELIMINATED.",
        "active_teams_count": len(state.get_active_teams()),
        "trigger_simulation_task_id": sim_task.id
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
