from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from backend.database import get_db
from backend import schemas
from backend.challenge_ops import get_challenge, get_couple_challenges, start_challenge, complete_challenge, create_challenge, update_challenge
from .auth import validate_couple_code

router = APIRouter()

# Get all challenges (for logged-in couples)
@router.get("/", response_model=List[schemas.ChallengeWithProgress])
async def get_challenges(
    code: str = Depends(validate_couple_code),
    db: AsyncSession = Depends(get_db)
):
    """Get all challenges with progress for the current couple"""
    challenges = await get_couple_challenges(db, code)
    result = []
    
    for challenge, progress in challenges:
        challenge_dict = schemas.Challenge.from_orm(challenge).dict()
        challenge_dict["started"] = progress is not None
        challenge_dict["completed"] = progress is not None and progress.completed_at is not None
        challenge_dict["started_at"] = progress.started_at if progress else None
        challenge_dict["completed_at"] = progress.completed_at if progress else None
        result.append(schemas.ChallengeWithProgress(**challenge_dict))
        
    return result

# Start a challenge for a couple
@router.post("/{challenge_id}/start", response_model=schemas.ChallengeProgress)
async def start_challenge(
    challenge_id: int = Path(...),
    code: str = Depends(validate_couple_code),
    db: AsyncSession = Depends(get_db)
):
    """Start a challenge for a couple"""
    # Check if challenge exists
    challenge = await get_challenge(db, challenge_id)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
        
    progress = await start_challenge(db, challenge_id, code)
    return progress

# Complete a challenge for a couple
@router.post("/{challenge_id}/complete", response_model=schemas.ChallengeProgress)
async def complete_challenge(
    challenge_id: int = Path(...),
    progress_data: Optional[schemas.ProgressData] = None,
    code: str = Depends(validate_couple_code),
    db: AsyncSession = Depends(get_db)
):
    """Complete a challenge for a couple"""
    # Check if challenge exists
    challenge = await get_challenge(db, challenge_id)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
        
    progress = await complete_challenge(
        db, 
        challenge_id, 
        code, 
        progress_data.data if progress_data else None
    )
    return progress

# Admin endpoints for managing challenges
@router.post("/admin", response_model=schemas.Challenge, status_code=status.HTTP_201_CREATED)
async def create_challenge(
    challenge: schemas.ChallengeCreate,
    db: AsyncSession = Depends(get_db),
    # In a real app, add admin validation here
):
    """Create a new challenge (admin only)"""
    return await create_challenge(db, challenge)

@router.put("/admin/{challenge_id}", response_model=schemas.Challenge)
async def update_challenge(
    challenge_id: int = Path(...),
    challenge: schemas.ChallengeUpdate = None,
    db: AsyncSession = Depends(get_db),
    # In a real app, add admin validation here
):
    """Update an existing challenge (admin only)"""
    return await update_challenge(db, challenge_id, challenge)
