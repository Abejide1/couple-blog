from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

class CoupleCode(BaseModel):
    code: str

class Category(str, Enum):
    OUTDOOR = "outdoor"
    INDOOR = "indoor"
    DINING = "dining"
    ENTERTAINMENT = "entertainment"
    TRAVEL = "travel"

class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class Cost(str, Enum):
    FREE = "free"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Season(str, Enum):
    SPRING = "spring"
    SUMMER = "summer"
    FALL = "fall"
    WINTER = "winter"
    ANY = "any"

class ActivityBase(BaseModel):
    title: str
    description: str
    status: str
    category: Category
    difficulty: Difficulty
    duration: int  # in minutes
    cost: Cost
    season: Optional[Season] = None
    mood: Optional[str] = None  # emoji or text

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    status: str
    completed_at: Optional[datetime] = None
    rating: Optional[int] = None
    notes: Optional[str] = None
    mood: Optional[str] = None

class Activity(ActivityBase):
    id: int
    created_at: datetime
    mood: Optional[str] = None

    class Config:
        orm_mode = True

class BookBase(BaseModel):
    title: str
    author: str
    status: str
    review: Optional[str] = None
    rating: Optional[int] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    status: str
    review: Optional[str] = None
    rating: Optional[int] = None

class Book(BookBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class MovieBase(BaseModel):
    title: str
    genre: str
    status: str
    review: Optional[str] = None
    rating: Optional[int] = None

class MovieCreate(MovieBase):
    pass

class MovieUpdate(BaseModel):
    status: str
    review: Optional[str] = None
    rating: Optional[int] = None

class Movie(MovieBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class BlogEntryBase(BaseModel):
    title: str
    content: str
    mood: Optional[str] = None

class BlogEntryCreate(BlogEntryBase):
    pass

class Photo(BaseModel):
    id: int
    file_path: str
    activity_id: Optional[int] = None
    blog_entry_id: Optional[int] = None
    couple_code: str
    uploaded_at: datetime

    class Config:
        orm_mode = True

class BlogEntryUpdate(BlogEntryBase):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None

class BlogEntry(BlogEntryBase):
    id: int
    created_at: datetime
    mood: Optional[str] = None

    class Config:
        orm_mode = True
