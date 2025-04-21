import os
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status, Form
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from backend import models, schemas
from backend.database import get_db
from datetime import datetime

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter()

@router.post("/photos/", response_model=schemas.Photo)
async def upload_photo(
    couple_code: str = Form(...),
    activity_id: Optional[int] = Form(None),
    blog_entry_id: Optional[int] = Form(None),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    if not couple_code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple code is required")
    filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    rel_path = f"uploads/{filename}"
    photo = models.Photo(
        file_path=rel_path,
        activity_id=activity_id,
        blog_entry_id=blog_entry_id,
        couple_code=couple_code
    )
    db.add(photo)
    await db.commit()
    await db.refresh(photo)
    return photo

@router.get("/photos/", response_model=List[schemas.Photo])
async def list_photos(
    couple_code: str,
    activity_id: Optional[int] = None,
    blog_entry_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    query = models.Photo.__table__.select().where(models.Photo.couple_code == couple_code)
    if activity_id:
        query = query.where(models.Photo.activity_id == activity_id)
    if blog_entry_id:
        query = query.where(models.Photo.blog_entry_id == blog_entry_id)
    result = await db.execute(query)
    return result.fetchall()

@router.get("/photos/file/{filename}")
async def get_photo_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)
