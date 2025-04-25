from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from datetime import datetime
from .challenge_models import Challenge, ChallengeProgress, Goal
from . import schemas

# Challenge CRUD operations
async def get_all_challenges(db: AsyncSession, active_only: bool = True):
    query = select(Challenge)
    if active_only:
        query = query.filter(Challenge.active == True)
    result = await db.execute(query)
    return result.scalars().all()

async def get_challenge(db: AsyncSession, challenge_id: int):
    result = await db.execute(select(Challenge).filter(Challenge.id == challenge_id))
    return result.scalar_one_or_none()

async def create_challenge(db: AsyncSession, challenge: schemas.ChallengeCreate):
    db_challenge = Challenge(**challenge.dict())
    db.add(db_challenge)
    await db.commit()
    await db.refresh(db_challenge)
    return db_challenge

async def update_challenge(db: AsyncSession, challenge_id: int, challenge: schemas.ChallengeUpdate):
    result = await db.execute(select(Challenge).filter(Challenge.id == challenge_id))
    db_challenge = result.scalar_one_or_none()
    
    if not db_challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    for key, value in challenge.dict(exclude_unset=True).items():
        setattr(db_challenge, key, value)
    
    await db.commit()
    await db.refresh(db_challenge)
    return db_challenge

# Challenge Progress operations
async def get_couple_challenges(db: AsyncSession, code: str):
    result = await db.execute(
        select(Challenge, ChallengeProgress)
        .outerjoin(ChallengeProgress, 
                  (Challenge.id == ChallengeProgress.challenge_id) & 
                  (ChallengeProgress.couple_code == code))
    )
    return result.all()

async def start_challenge(db: AsyncSession, challenge_id: int, code: str):
    # Check if already started
    result = await db.execute(
        select(ChallengeProgress)
        .filter(ChallengeProgress.challenge_id == challenge_id)
        .filter(ChallengeProgress.couple_code == code)
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        return existing
        
    db_progress = ChallengeProgress(challenge_id=challenge_id, couple_code=code)
    db.add(db_progress)
    await db.commit()
    await db.refresh(db_progress)
    return db_progress

async def complete_challenge(db: AsyncSession, challenge_id: int, code: str, progress_data: str = None):
    result = await db.execute(
        select(ChallengeProgress)
        .filter(ChallengeProgress.challenge_id == challenge_id)
        .filter(ChallengeProgress.couple_code == code)
    )
    db_progress = result.scalar_one_or_none()
    
    if not db_progress:
        # Auto-start if not started
        db_progress = ChallengeProgress(challenge_id=challenge_id, couple_code=code)
        db.add(db_progress)
    
    db_progress.completed_at = datetime.utcnow()
    if progress_data:
        db_progress.progress_data = progress_data
    
    await db.commit()
    await db.refresh(db_progress)
    return db_progress

# Goal operations
async def get_couple_goals(db: AsyncSession, code: str):
    result = await db.execute(select(Goal).filter(Goal.couple_code == code))
    return result.scalars().all()

async def create_goal(db: AsyncSession, goal: schemas.GoalCreate, code: str, partner_id: str = None):
    goal_data = goal.dict()
    goal_data['couple_code'] = code
    goal_data['created_by'] = partner_id
    db_goal = Goal(**goal_data)
    db.add(db_goal)
    await db.commit()
    await db.refresh(db_goal)
    return db_goal

async def update_goal(db: AsyncSession, goal_id: int, goal: schemas.GoalUpdate, code: str):
    result = await db.execute(
        select(Goal)
        .filter(Goal.id == goal_id)
        .filter(Goal.couple_code == code)
    )
    db_goal = result.scalar_one_or_none()
    
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    for key, value in goal.dict(exclude_unset=True).items():
        setattr(db_goal, key, value)
    
    # If completing the goal, set completed_at timestamp
    if goal.completed and not db_goal.completed_at:
        db_goal.completed_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(db_goal)
    return db_goal

async def delete_goal(db: AsyncSession, goal_id: int, code: str):
    result = await db.execute(
        select(Goal)
        .filter(Goal.id == goal_id)
        .filter(Goal.couple_code == code)
    )
    db_goal = result.scalar_one_or_none()
    
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    await db.delete(db_goal)
    await db.commit()
    return {"status": "success"}
