from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import models
import schemas
from database import get_db

router = APIRouter()

@router.get("/movies/", response_model=List[schemas.Movie])
async def get_movies(db: AsyncSession = Depends(get_db), code: Optional[str] = None):
    if not code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple code is required")
    return await models.get_movies(db, code)

@router.post("/movies/", response_model=schemas.Movie)
async def create_movie(
    movie: schemas.MovieCreate,
    db: AsyncSession = Depends(get_db),
    code: Optional[str] = None
):
    if not code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple code is required")
    try:
        return await models.create_movie(db, movie, code)
    except Exception as e:
        print(f"Error creating movie: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/movies/{movie_id}", response_model=schemas.Movie)
async def update_movie(
    movie_id: int,
    movie: schemas.MovieUpdate,
    db: AsyncSession = Depends(get_db),
    code: Optional[str] = None
):
    if not code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple code is required")
    try:
        return await models.update_movie(db, movie_id, movie, code)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating movie: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
