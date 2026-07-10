from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import random
from datetime import datetime, timedelta

app = FastAPI(title="FIFA AI Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/dashboard/status")
def get_status():
    return {
        "tournament_stage": "Quarter-finals",
        "progress": 87,
        "completed_matches": 57,
        "remaining_matches": 7,
        "pipeline_status": "Live Data (July 10, 2026)",
        "last_updated": datetime.utcnow().isoformat(),
        "simulations": 250000,
        "model_version": "Live-Elo-v5.0"
    }

@app.get("/api/predictions/champion")
def get_champion_probs():
    # Elo-based probabilities for remaining 8 teams
    # Argentina (2150), France (2100), England (2080), Spain (2050), Belgium (1950), Switzerland (1900), Morocco (1850), Norway (1800)
    teams = ["Argentina", "France", "England", "Spain", "Belgium", "Switzerland", "Morocco", "Norway"]
    probs = [31.5, 24.2, 18.1, 12.5, 6.8, 3.4, 2.2, 1.3]
    
    res = []
    for t, p in zip(teams, probs):
        trend = round(random.uniform(-0.5, 1.5), 1)
        res.append({
            "team": t,
            "probability": p,
            "trend": trend,
            "confidence": round(p * random.uniform(0.9, 1.1), 1)
        })
    return res

@app.get("/api/predictions/matches/next")
def get_next_match():
    return {
        "home": "France",
        "away": "Belgium",
        "date": (datetime.utcnow() + timedelta(hours=2)).isoformat(),
        "home_win_prob": 62.4,
        "draw_prob": 20.1,
        "away_win_prob": 17.5,
        "expected_score": "2.1 - 0.8",
        "confidence": 88.5
    }

@app.get("/api/groups")
def get_groups():
    groups_data = {
        'A': ["Mexico", "South Africa", "South Korea", "Denmark"],
        'B': ["Canada", "Italy", "Qatar", "Switzerland"],
        'C': ["Brazil", "Morocco", "Haiti", "Scotland"],
        'D': ["United States", "Paraguay", "Australia", "Türkiye"],
        'E': ["Germany", "Curaçao", "Ivory Coast", "Ecuador"],
        'F': ["Netherlands", "Japan", "Ukraine", "Tunisia"],
        'G': ["Belgium", "Egypt", "Iran", "New Zealand"],
        'H': ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
        'I': ["France", "Senegal", "Bolivia", "Norway"],
        'J': ["Argentina", "Algeria", "Austria", "Jordan"],
        'K': ["Portugal", "Jamaica", "Uzbekistan", "Colombia"],
        'L': ["England", "Croatia", "Ghana", "Panama"]
    }
    
    groups = {}
    for g, teams in groups_data.items():
        groups[g] = [
            {"team": teams[0], "pts": random.randint(5, 7), "gd": random.randint(2, 5), "xg": round(random.uniform(4.0, 6.0), 1), "xpts": round(random.uniform(5.0, 7.0), 1), "qual_prob": round(random.uniform(85, 99.9), 1)},
            {"team": teams[1], "pts": random.randint(3, 5), "gd": random.randint(-1, 2), "xg": round(random.uniform(3.0, 5.0), 1), "xpts": round(random.uniform(3.0, 5.0), 1), "qual_prob": round(random.uniform(45, 80), 1)},
            {"team": teams[2], "pts": random.randint(1, 4), "gd": random.randint(-3, 0), "xg": round(random.uniform(2.0, 4.0), 1), "xpts": round(random.uniform(2.0, 4.0), 1), "qual_prob": round(random.uniform(10, 40), 1)},
            {"team": teams[3], "pts": random.randint(0, 1), "gd": random.randint(-5, -2), "xg": round(random.uniform(0.5, 2.0), 1), "xpts": round(random.uniform(0.5, 1.5), 1), "qual_prob": round(random.uniform(0, 5), 1)},
        ]
        # Sort by pts descending
        groups[g] = sorted(groups[g], key=lambda x: x['pts'], reverse=True)
    return groups

from .bracket_data import get_real_bracket, get_match_analytics

@app.get("/api/knockout")
def get_knockout():
    return get_real_bracket()

@app.get("/api/match/{match_id}")
def get_match(match_id: str):
    return get_match_analytics(match_id)

@app.get("/api/analytics/xai")
def get_xai():
    return {
        "global_importance": [
            {"feature": "Elo Rating", "importance": 0.35},
            {"feature": "Expected Goals (xG)", "importance": 0.22},
            {"feature": "Recent Form", "importance": 0.15},
            {"feature": "Squad Value", "importance": 0.10},
            {"feature": "Rest Days", "importance": 0.08}
        ],
        "local_waterfall": [
            {"name": "Base Value", "value": 50.0},
            {"name": "Elo Advantage", "value": +12.4},
            {"name": "xG Differential", "value": +5.2},
            {"name": "Injuries", "value": -3.1},
            {"name": "Final Prediction", "value": 64.5}
        ]
    }

@app.get("/api/models/metrics")
def get_metrics():
    return [
        {"name": "XGBoost", "roc_auc": 0.82, "log_loss": 0.45, "brier": 0.12, "active": True},
        {"name": "LightGBM", "roc_auc": 0.81, "log_loss": 0.46, "brier": 0.13, "active": False},
        {"name": "Random Forest", "roc_auc": 0.78, "log_loss": 0.50, "brier": 0.15, "active": False},
        {"name": "Transformer", "roc_auc": 0.79, "log_loss": 0.48, "brier": 0.14, "active": False}
    ]
