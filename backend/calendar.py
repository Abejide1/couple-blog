from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from typing import List, Optional
from backend.database import get_db
from backend import models, schemas
from .auth import validate_couple_code

router = APIRouter()

@router.get("/", response_model=List[schemas.CalendarEventOut])
async def get_events(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    code: str = Depends(validate_couple_code),
    db: AsyncSession = Depends(get_db)
):
    """Get all calendar events for a couple between optional start and end dates"""
    events = await models.get_calendar_events(db, code, start_date, end_date)
    return events

@router.post("/", response_model=schemas.CalendarEventOut, status_code=status.HTTP_201_CREATED)
async def create_event(
    event: schemas.CalendarEventCreate,
    code: str = Depends(validate_couple_code),
    db: AsyncSession = Depends(get_db),
    partner_id: Optional[str] = None
):
    """Create a new calendar event"""
    return await models.create_calendar_event(db, event, code, partner_id)

@router.put("/{event_id}", response_model=schemas.CalendarEventOut)
async def update_event(
    event_id: int,
    event: schemas.CalendarEventUpdate,
    code: str = Depends(validate_couple_code),
    db: AsyncSession = Depends(get_db)
):
    """Update an existing calendar event"""
    return await models.update_calendar_event(db, event_id, event, code)

@router.delete("/{event_id}", status_code=status.HTTP_200_OK)
async def delete_event(
    event_id: int,
    code: str = Depends(validate_couple_code),
    db: AsyncSession = Depends(get_db)
):
    """Delete a calendar event"""
    return await models.delete_calendar_event(db, event_id, code)
