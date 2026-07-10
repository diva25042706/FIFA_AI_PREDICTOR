from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:password@localhost:5432/fifadb")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Match(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True)
    home_team = Column(String, index=True)
    away_team = Column(String, index=True)
    home_score = Column(Integer)
    away_score = Column(Integer)
    tournament = Column(String)
    is_live = Column(Boolean, default=False)
    # Hybrid fields for ML
    home_xg = Column(Float, nullable=True)
    away_xg = Column(Float, nullable=True)
    home_elo = Column(Integer, nullable=True)
    away_elo = Column(Integer, nullable=True)

# In a real setup, we would run: Base.metadata.create_all(bind=engine)
