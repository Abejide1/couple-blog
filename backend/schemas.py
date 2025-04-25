from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

# --- User Schemas ---
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: str
    display_name: Optional[str] = None
    couple_code: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    display_name: Optional[str] = None
    profile_pic: Optional[str] = None
    couple_code: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: str
    display_name: Optional[str]
    profile_pic: Optional[str]
    couple_code: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

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
        from_attributes = True

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
        from_attributes = True

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
        from_attributes = True

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
        from_attributes = True

class BlogEntryUpdate(BlogEntryBase):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None

class BlogEntry(BlogEntryBase):
    id: int
    created_at: datetime
    mood: Optional[str] = None

    class Config:
        from_attributes = True

# Calendar Event Schemas
class EventType(str, Enum):
    BIRTHDAY = "birthday"
    ANNIVERSARY = "anniversary"
    DATE = "date"
    REMINDER = "reminder"
    APPOINTMENT = "appointment"
    ACTIVITY = "activity"
    OTHER = "other"

class RecurrenceType(str, Enum):
    NONE = "none"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"

class CalendarEventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    all_day: bool = False
    location: Optional[str] = None
    event_type: Optional[EventType] = None
    recurrence: Optional[RecurrenceType] = None
    color: Optional[str] = None
    reminder: Optional[int] = None  # minutes before event
    shared: bool = True
    activity_id: Optional[int] = None

class CalendarEventCreate(CalendarEventBase):
    pass

class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    all_day: Optional[bool] = None
    location: Optional[str] = None
    event_type: Optional[EventType] = None
    recurrence: Optional[RecurrenceType] = None
    color: Optional[str] = None
    reminder: Optional[int] = None
    shared: Optional[bool] = None
    activity_id: Optional[int] = None

class CalendarEventOut(CalendarEventBase):
    id: int
    created_at: datetime
    created_by: Optional[str] = None
    couple_code: str
    
    class Config:
        from_attributes = True
        
# Challenge & Goal Schemas
class ChallengeBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None  # e.g., 'daily', 'weekly', 'one-time', 'beginner', 'advanced'
    points: int = 10  # Reward points for completing
    icon: Optional[str] = None  # Icon or emoji name
    active: bool = True  # Whether challenge is active in system

class ChallengeCreate(ChallengeBase):
    pass

class ChallengeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    points: Optional[int] = None
    icon: Optional[str] = None
    active: Optional[bool] = None

class Challenge(ChallengeBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChallengeWithProgress(Challenge):
    started: bool = False
    completed: bool = False
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class ProgressData(BaseModel):
    data: Optional[str] = None

class ChallengeProgress(BaseModel):
    id: int
    challenge_id: int
    couple_code: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    progress_data: Optional[str] = None
    
    class Config:
        from_attributes = True

# Goal Schemas
class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    priority: Optional[str] = None  # 'low', 'medium', 'high'
    category: Optional[str] = None  # Custom categorization

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    category: Optional[str] = None

class Goal(GoalBase):
    id: int
    completed: bool
    created_by: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    couple_code: str
    
    class Config:
        from_attributes = True
