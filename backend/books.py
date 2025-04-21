from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from backend import models
from backend import schemas
from backend.database import get_db

router = APIRouter()

@router.patch("/books/{book_id}", response_model=schemas.Book)
async def update_book(
    book_id: int,
    book: schemas.BookUpdate,
    db: AsyncSession = Depends(get_db),
    code: Optional[str] = None
):
    if not code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple code is required")
    try:
        return await models.update_book(db, book_id, book, code)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating book: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/books/", response_model=List[schemas.Book])
async def get_books(db: AsyncSession = Depends(get_db), code: Optional[str] = None):
    if not code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple code is required")
    return await models.get_books(db, code)

@router.post("/books/", response_model=schemas.Book)
async def create_book(
    book: schemas.BookCreate,
    db: AsyncSession = Depends(get_db),
    code: Optional[str] = None
):
    if not code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple code is required")
    try:
        return await models.create_book(db, book, code)
    except Exception as e:
        print(f"Error creating book: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
