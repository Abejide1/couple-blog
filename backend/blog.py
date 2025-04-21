from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import models
import schemas
from database import get_db

router = APIRouter()

@router.get("/blog-entries/", response_model=List[schemas.BlogEntry])
async def get_blog_entries(db: AsyncSession = Depends(get_db), code: Optional[str] = None):
    if not code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple code is required")
    return await models.get_blog_entries(db, code)

@router.post("/blog-entries/", response_model=schemas.BlogEntry)
async def create_blog_entry(
    entry: schemas.BlogEntryCreate,
    db: AsyncSession = Depends(get_db),
    code: Optional[str] = None
):
    if not code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple code is required")
    try:
        return await models.create_blog_entry(db, entry, code)
    except Exception as e:
        print(f"Error creating blog entry: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
