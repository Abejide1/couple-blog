from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

# Challenge Model - System-defined challenges for all couples
class Challenge(Base):
    __tablename__ = "challenges"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)  # e.g., 'daily', 'weekly', 'one-time', 'beginner', 'advanced'
    points = Column(Integer, default=10)  # Reward points for completing
    icon = Column(String, nullable=True)  # Icon or emoji name
    created_at = Column(DateTime, default=datetime.utcnow)
    active = Column(Boolean, default=True)  # Whether challenge is active in system
    
# ChallengeProgress Model - Tracks which couples have started/completed challenges
class ChallengeProgress(Base):
    __tablename__ = "challenge_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey('challenges.id'))
    couple_code = Column(String, index=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    progress_data = Column(Text, nullable=True)  # JSON string for any progress-specific data
    
    # Relationship to Challenge
    challenge = relationship("Challenge", foreign_keys=[challenge_id])

# Goal Model - Couple-specific goals
class Goal(Base):
    __tablename__ = "goals"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    target_date = Column(DateTime, nullable=True)
    completed = Column(Boolean, default=False)
    priority = Column(String, nullable=True)  # 'low', 'medium', 'high'
    category = Column(String, nullable=True)  # Custom categorization
    created_by = Column(String, nullable=True)  # Which partner created the goal
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    couple_code = Column(String, index=True)
