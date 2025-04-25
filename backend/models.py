from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from backend import schemas
from backend.database import Base



class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    status = Column(String)  # "planned", "completed"
    category = Column(String)  # "outdoor", "indoor", "dining", "entertainment", "travel"
    difficulty = Column(String)  # "easy", "medium", "hard"
    duration = Column(Integer)  # Duration in minutes
    cost = Column(String)  # "free", "low", "medium", "high"
    season = Column(String, nullable=True)  # "spring", "summer", "fall", "winter", null for any season
    mood = Column(String, nullable=True)  # Emoji or text mood
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    rating = Column(Integer, nullable=True)  # Rating after completion (1-5)
    notes = Column(Text, nullable=True)  # Notes after completing the activity
    couple_code = Column(String, index=True)

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String)
    status = Column(String)  # "to_read", "reading", "completed"
    rating = Column(Integer, nullable=True)  # 1-5 stars
    review = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    couple_code = Column(String, index=True)

class Movie(Base):
    __tablename__ = "movies"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    genre = Column(String, nullable=True)  # <-- Add this line
    director = Column(String, nullable=True)
    status = Column(String)  # "to_watch", "watched"
    rating = Column(Integer, nullable=True)  # 1-5 stars
    review = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    couple_code = Column(String, index=True)

class BlogEntry(Base):
    __tablename__ = "blog_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    mood = Column(String, nullable=True)  # Emoji or text mood
    created_at = Column(DateTime, default=datetime.utcnow)
    couple_code = Column(String, index=True)



class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String, nullable=False)
    activity_id = Column(Integer, nullable=True)
    blog_entry_id = Column(Integer, nullable=True)
    couple_code = Column(String, index=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

# --- Badge Logic Placeholder ---
def calculate_badges(db: AsyncSession, couple_code: str):
    # Example: return list of badge names/ids based on activity counts, streaks, etc.
    return []

# Database operations
async def get_activities(
    db: AsyncSession,
    code: str = None,
    category: schemas.Category = None,
    difficulty: schemas.Difficulty = None,
    cost: schemas.Cost = None,
    season: schemas.Season = None
):
    try:
        query = select(Activity)
        
        if code:
            query = query.filter(Activity.couple_code == code)
        if category:
            query = query.filter(Activity.category == category)
        if difficulty:
            query = query.filter(Activity.difficulty == difficulty)
        if cost:
            query = query.filter(Activity.cost == cost)
        if season:
            query = query.filter(Activity.season == season)
        
        result = await db.execute(query)
        return result.scalars().all()
    except Exception as e:
        print(f"Database error in get_activities: {str(e)}")
        raise

async def create_activity(db: AsyncSession, activity: schemas.ActivityCreate, code: str):
    try:
        activity_data = activity.dict()
        activity_data['couple_code'] = code
        db_activity = Activity(**activity_data)
        db.add(db_activity)
        await db.commit()
        await db.refresh(db_activity)
        return db_activity
    except Exception as e:
        print(f"Database error in create_activity: {str(e)}")
        await db.rollback()
        raise

async def update_activity(db: AsyncSession, activity_id: int, activity: schemas.ActivityUpdate, code: str):
    result = await db.execute(
        select(Activity)
        .filter(Activity.id == activity_id)
        .filter(Activity.couple_code == code)
    )
    db_activity = result.scalar_one_or_none()
    
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    for key, value in activity.dict(exclude_unset=True).items():
        setattr(db_activity, key, value)
    
    await db.commit()
    await db.refresh(db_activity)
    return db_activity

async def get_books(db: AsyncSession, code: str):
    result = await db.execute(select(Book).filter(Book.couple_code == code))
    return result.scalars().all()

async def create_book(db: AsyncSession, book: schemas.BookCreate, code: str):
    book_data = book.dict()
    book_data['couple_code'] = code
    db_book = Book(**book_data)
    db.add(db_book)
    await db.commit()
    await db.refresh(db_book)
    return db_book

async def update_book(db: AsyncSession, book_id: int, book: schemas.BookUpdate, code: str):
    result = await db.execute(
        select(Book)
        .filter(Book.id == book_id)
        .filter(Book.couple_code == code)
    )
    db_book = result.scalar_one_or_none()
    
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    for key, value in book.dict(exclude_unset=True).items():
        setattr(db_book, key, value)
    
    await db.commit()
    await db.refresh(db_book)
    return db_book

async def get_movies(db: AsyncSession, code: str):
    result = await db.execute(select(Movie).filter(Movie.couple_code == code))
    return result.scalars().all()

async def create_movie(db: AsyncSession, movie: schemas.MovieCreate, code: str):
    movie_data = movie.dict()
    movie_data['couple_code'] = code
    db_movie = Movie(**movie_data)
    db.add(db_movie)
    await db.commit()
    await db.refresh(db_movie)
    return db_movie

async def update_movie(db: AsyncSession, movie_id: int, movie: schemas.MovieUpdate, code: str):
    result = await db.execute(
        select(Movie)
        .filter(Movie.id == movie_id)
        .filter(Movie.couple_code == code)
    )
    db_movie = result.scalar_one_or_none()
    
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    for key, value in movie.dict(exclude_unset=True).items():
        setattr(db_movie, key, value)

# Calendar Model
class CalendarEvent(Base):
    __tablename__ = "calendar_events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)
    all_day = Column(Boolean, default=False)
    location = Column(String, nullable=True)
    event_type = Column(String, nullable=True)  # 'birthday', 'anniversary', 'date', 'reminder', etc.
    recurrence = Column(String, nullable=True)  # 'daily', 'weekly', 'monthly', 'yearly', or null for one-time
    color = Column(String, nullable=True)  # Color code for the calendar event
    reminder = Column(Integer, nullable=True)  # Minutes before event to remind
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String, nullable=True)  # Which partner created the event
    shared = Column(Boolean, default=True)  # If false, only visible to creator
    couple_code = Column(String, index=True)
    activity_id = Column(Integer, ForeignKey('activities.id'), nullable=True)  # Optional link to an activity
    
    # Relationship to Activity if one exists
    activity = relationship("Activity", foreign_keys=[activity_id])

# Calendar CRUD operations
async def get_calendar_events(db: AsyncSession, code: str, start_date: datetime = None, end_date: datetime = None):
    query = select(CalendarEvent).filter(CalendarEvent.couple_code == code)
    
    if start_date:
        query = query.filter(CalendarEvent.start_time >= start_date)
    if end_date:
        query = query.filter(CalendarEvent.start_time <= end_date)
        
    result = await db.execute(query)
    return result.scalars().all()

async def create_calendar_event(db: AsyncSession, event: schemas.CalendarEventCreate, code: str, partner_id: str = None):
    try:
        event_data = event.dict()
        event_data['couple_code'] = code
        event_data['created_by'] = partner_id
        db_event = CalendarEvent(**event_data)
        db.add(db_event)
        await db.commit()
        await db.refresh(db_event)
        return db_event
    except Exception as e:
        print(f"Database error in create_calendar_event: {str(e)}")
        await db.rollback()
        raise

async def update_calendar_event(db: AsyncSession, event_id: int, event: schemas.CalendarEventUpdate, code: str):
    result = await db.execute(
        select(CalendarEvent)
        .filter(CalendarEvent.id == event_id)
        .filter(CalendarEvent.couple_code == code)
    )
    db_event = result.scalar_one_or_none()
    
    if not db_event:
        raise HTTPException(status_code=404, detail="Calendar event not found")
    
    for key, value in event.dict(exclude_unset=True).items():
        setattr(db_event, key, value)
    
    await db.commit()
    await db.refresh(db_event)
    return db_event

async def delete_calendar_event(db: AsyncSession, event_id: int, code: str):
    result = await db.execute(
        select(CalendarEvent)
        .filter(CalendarEvent.id == event_id)
        .filter(CalendarEvent.couple_code == code)
    )
    db_event = result.scalar_one_or_none()
    
    if not db_event:
        raise HTTPException(status_code=404, detail="Calendar event not found")
    
    await db.delete(db_event)
    await db.commit()
    return {"status": "success"}

    
    await db.commit()
    await db.refresh(db_movie)
    return db_movie

async def get_blog_entries(db: AsyncSession, code: str):
    result = await db.execute(select(BlogEntry).filter(BlogEntry.couple_code == code))
    return result.scalars().all()

async def create_blog_entry(db: AsyncSession, entry: schemas.BlogEntryCreate, code: str):
    entry_data = entry.dict()
    entry_data['couple_code'] = code
    db_entry = BlogEntry(**entry_data)
    db.add(db_entry)
    await db.commit()
    await db.refresh(db_entry)
    return db_entry

async def update_blog_entry(db: AsyncSession, entry_id: int, entry: schemas.BlogEntryUpdate, code: str):
    result = await db.execute(
        select(BlogEntry)
        .filter(BlogEntry.id == entry_id)
        .filter(BlogEntry.couple_code == code)
    )
    db_entry = result.scalar_one_or_none()
    
    if not db_entry:
        raise HTTPException(status_code=404, detail="Blog entry not found")
    
    for key, value in entry.dict(exclude_unset=True).items():
        setattr(db_entry, key, value)
    
    await db.commit()
    await db.refresh(db_entry)
    return db_entry
