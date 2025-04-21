from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from backend.models import Base

DATABASE_URL = "sqlite+aiosqlite:///./couple_activities.db"

engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Disable SQL logging
    connect_args={'check_same_thread': False}
)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False  # Disable autoflush for better performance
)

async def init_db():
    async with engine.begin() as conn:
        # Drop all tables to start fresh (ONE TIME ONLY)
        await conn.run_sync(Base.metadata.drop_all)
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
