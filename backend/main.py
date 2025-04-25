from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from backend import models
from backend import schemas
from backend.database import engine, get_db, init_db, Base, AsyncSessionLocal
from backend.books import router as books_router
from backend.movies import router as movies_router
from backend.blog import router as blog_router
from backend.photos import router as photos_router
from backend.calendar import router as calendar_router
from backend.challenges import router as challenges_router
from backend.goals import router as goals_router
from backend.user_auth import router as user_auth_router

# Import our custom models to ensure they're included in create_all
from backend.challenge_models import Challenge, ChallengeProgress, Goal

# Import seed data function
from backend.seed_challenges import seed_challenges

app = FastAPI()

# Configure CORS (must be before routers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TEMP: allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Register routers for books, movies, blog, photos, calendar, challenges, goals
app.include_router(books_router)
app.include_router(movies_router)
app.include_router(blog_router)
app.include_router(photos_router)
app.include_router(calendar_router, prefix="/calendar", tags=["calendar"])
app.include_router(challenges_router, prefix="/challenges", tags=["challenges"])
app.include_router(goals_router, prefix="/goals", tags=["goals"])
app.include_router(user_auth_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Couple Activities API"}

# Initialize database and seed data on startup
@app.on_event("startup")
async def startup_event():
    # Create database tables if they don't exist (don't drop existing tables)
    async with engine.begin() as conn:
        # Create all tables if they don't exist (without dropping existing ones)
        await conn.run_sync(Base.metadata.create_all)
    
    # Get a DB session
    async with AsyncSessionLocal() as session:
        try:
            # Seed challenges
            await seed_challenges(session)
            print("✓ Database initialized and challenges seeded")
        except Exception as e:
            print(f"Error during seeding: {e}")
            # Continue app startup even if seeding fails

@app.get("/activities/", response_model=List[schemas.Activity])
async def get_activities(
    db: AsyncSession = Depends(get_db),
    code: Optional[str] = None,
    category: Optional[schemas.Category] = None,
    difficulty: Optional[schemas.Difficulty] = None,
    cost: Optional[schemas.Cost] = None,
    season: Optional[schemas.Season] = None
):
    try:
        if not code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Couple code is required"
            )

        activities = await models.get_activities(
            db=db,
            code=code,
            category=category,
            difficulty=difficulty,
            cost=cost,
            season=season
        )
        return activities
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting activities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.post("/activities/", response_model=schemas.Activity)
async def create_activity(
    activity: schemas.ActivityCreate,
    db: AsyncSession = Depends(get_db),
    code: str = None
):
    try:
        if not code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Couple code is required"
            )

        return await models.create_activity(db=db, activity=activity, code=code)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating activity: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/activities/categories", response_model=List[str])
async def get_categories():
    return [category.value for category in schemas.Category]

@app.get("/activities/difficulties", response_model=List[str])
async def get_difficulties():
    return [difficulty.value for difficulty in schemas.Difficulty]

@app.get("/activities/costs", response_model=List[str])
async def get_costs():
    return [cost.value for cost in schemas.Cost]

@app.get("/activities/seasons", response_model=List[str])
async def get_seasons():
    return [season.value for season in schemas.Season]

@app.get("/badges/", response_model=List[str])
async def get_badges(code: str, db: AsyncSession = Depends(get_db)):
    return models.calculate_badges(db, code)

@app.on_event("startup")
async def startup():
    await init_db()
