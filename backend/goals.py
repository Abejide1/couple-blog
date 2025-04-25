from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from backend.database import get_db
from backend import models, schemas
from .auth import validate_couple_code

router = APIRouter()

@router.get("/", response_model=List[schemas.Goal])
async def get_goals(
    code: str = Depends(validate_couple_code),
    db: AsyncSession = Depends(get_db)
):
    """Get all goals for a couple"""
    return await models.get_couple_goals(db, code)

@router.post("/", response_model=schemas.Goal, status_code=status.HTTP_201_CREATED)
async def create_goal(
    goal: schemas.GoalCreate,
    code: str = Depends(validate_couple_code),
    db: AsyncSession = Depends(get_db),
    partner_id: Optional[str] = None  # Could come from auth in a real app
):
    """Create a new goal for a couple"""
    return await models.create_goal(db, goal, code, partner_id)

@router.put("/{goal_id}", response_model=schemas.Goal)
async def update_goal(
    goal_id: int = Path(...),
    goal: schemas.GoalUpdate = None,
    code: str = Depends(validate_couple_code),
    db: AsyncSession = Depends(get_db)
):
    """Update an existing goal"""
    return await models.update_goal(db, goal_id, goal, code)

@router.delete("/{goal_id}", status_code=status.HTTP_200_OK)
async def delete_goal(
    goal_id: int = Path(...),
    code: str = Depends(validate_couple_code),
    db: AsyncSession = Depends(get_db)
):
    """Delete a goal"""
    return await models.delete_goal(db, goal_id, code)
