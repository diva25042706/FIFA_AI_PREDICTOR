# Use official Python 3.11 image
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (needed for XGBoost, psycopg2, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
# In a real app we'd use requirements.txt, but for this MVP we install explicitly
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    celery \
    redis \
    sqlalchemy \
    psycopg2-binary \
    xgboost \
    pandas \
    scikit-learn \
    shap \
    mlflow \
    python-dotenv \
    requests

# Copy backend code
COPY . /app

# Expose FastAPI port
EXPOSE 8000

# Command to run FastAPI server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
