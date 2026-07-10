# AI-powered FIFA World Cup Prediction Platform

A production-grade AI system to predict match outcomes, tournament progression, and championship probabilities.

## 🚀 Features

- **Match Prediction Engine**: Predicts win/draw/loss probabilities and exact scores.
- **Tournament Simulator**: Monte Carlo simulation for full tournament bracket probabilities.
- **Explainable AI**: SHAP values to explain predictions (e.g., impact of Elo, xG, form).
- **Automated Data Agents**: Continuously fetch and update match data and injuries.
- **Modern Dashboard**: Next.js frontend with dark-mode, glassmorphism, and live charts.

## 📂 Project Structure

- `backend/`: FastAPI REST API and Celery workers.
- `frontend/`: Next.js React application.
- `ml/`: Feature engineering, XGBoost/LightGBM training, SHAP integration.
- `simulation/`: Monte Carlo simulation engine.
- `agents/`: AI agents for data collection and validation.
- `docker/`, `kubernetes/`: Deployment manifests.

## 🛠️ Quick Start (Phase 1)

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Generate Mock Data:**
   ```bash
   cd agents
   python data_collection_agent.py
   ```
