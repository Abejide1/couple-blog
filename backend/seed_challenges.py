from sqlalchemy.ext.asyncio import AsyncSession
from backend.challenge_models import Challenge
from datetime import datetime

# Sample challenges for couples
sample_challenges = [
    {
        "title": "7-Day Compliment Streak",
        "description": "Give your partner a genuine compliment every day for a week. Share what you appreciate about them, from personality traits to small gestures.",
        "category": "daily",
        "points": 20,
        "icon": "💬"
    },
    {
        "title": "Date Night In",
        "description": "Plan and enjoy a special at-home date night. Cook a meal together, set a nice atmosphere, and enjoy quality time without distractions.",
        "category": "one-time",
        "points": 15,
        "icon": "🍽️"
    },
    {
        "title": "Photo Memory Hunt",
        "description": "Recreate a favorite photo from your relationship. Try to match the original setting, poses, and expressions, then share both images.",
        "category": "advanced",
        "points": 25,
        "icon": "📸"
    },
    {
        "title": "Surprise Message",
        "description": "Leave a surprise note or message for your partner to find. Hide it somewhere unexpected to brighten their day.",
        "category": "beginner",
        "points": 10,
        "icon": "✉️"
    },
    {
        "title": "Try a New Recipe Together",
        "description": "Cook a meal you've never made before as a team. Explore a new cuisine or challenging dish and enjoy the results together.",
        "category": "one-time",
        "points": 15,
        "icon": "🍲"
    },
    {
        "title": "Unplugged Evening",
        "description": "Spend an evening together with no phones or screens. Connect through conversation, games, or simply enjoying each other's company.",
        "category": "weekly",
        "points": 20,
        "icon": "🔌"
    },
    {
        "title": "Gratitude Journal",
        "description": "Each write 3 things you're grateful for about each other and share them. Focus on recent events or ongoing qualities you appreciate.",
        "category": "daily",
        "points": 15,
        "icon": "📝"
    },
    {
        "title": "Outdoor Adventure",
        "description": "Go for a walk, hike, or picnic together in nature. Discover a new location or revisit a favorite spot.",
        "category": "one-time",
        "points": 20,
        "icon": "🏞️"
    },
    {
        "title": "Book Club for Two",
        "description": "Read the same book and discuss it together. Choose something you're both interested in and share your perspectives.",
        "category": "advanced",
        "points": 25,
        "icon": "📚"
    },
    {
        "title": "Movie Marathon",
        "description": "Watch 2+ movies from each other's favorite genres. Take turns selecting films that are meaningful to you.",
        "category": "one-time",
        "points": 15,
        "icon": "🎬"
    },
    {
        "title": "Fitness Challenge",
        "description": "Complete a workout or yoga session together. Support each other through the activity and celebrate your achievement.",
        "category": "weekly",
        "points": 20,
        "icon": "🏋️"
    },
    {
        "title": "Random Acts of Kindness",
        "description": "Do something kind for your partner without telling them in advance. Notice what would make their day better and surprise them.",
        "category": "beginner",
        "points": 10,
        "icon": "🎁"
    },
    {
        "title": "Bucket List Planning",
        "description": "Add 3 new items to your couple's bucket list. Dream together about future experiences you want to share.",
        "category": "one-time",
        "points": 15,
        "icon": "🗒️"
    },
    {
        "title": "DIY Project",
        "description": "Build or craft something together. Create art, décor, or something functional for your home.",
        "category": "advanced",
        "points": 25,
        "icon": "🔨"
    },
    {
        "title": "Memory Lane",
        "description": "Look through old photos and share your favorite memories. Reminisce about your journey together so far.",
        "category": "one-time",
        "points": 15,
        "icon": "🖼️"
    },
    {
        "title": "Love Letter Exchange",
        "description": "Write and exchange heartfelt letters. Express your feelings in writing and read them to each other.",
        "category": "advanced",
        "points": 20,
        "icon": "💌"
    },
    {
        "title": "Learn Something New",
        "description": "Take an online class or tutorial together. Develop a new skill or explore a subject you're both curious about.",
        "category": "one-time",
        "points": 20,
        "icon": "🧠"
    },
    {
        "title": "Early Morning Date",
        "description": "Wake up early and watch the sunrise together. Start the day with a special moment of connection.",
        "category": "one-time",
        "points": 20,
        "icon": "🌅"
    },
    {
        "title": "Game Night",
        "description": "Play a board game or video game as a team. Work together to win or compete in a friendly way.",
        "category": "weekly",
        "points": 15,
        "icon": "🎲"
    },
    {
        "title": "Plan a Future Trip",
        "description": "Research and dream about a place you want to visit together. Create a vision for your next adventure.",
        "category": "one-time",
        "points": 15,
        "icon": "✈️"
    }
]

async def seed_challenges(db: AsyncSession):
    # Check if any challenges already exist (by querying the first one)
    from sqlalchemy.future import select
    result = await db.execute(select(Challenge).limit(1))
    existing = result.scalar_one_or_none()
    
    # If challenges already exist, skip seeding
    if existing:
        print("Challenges already exist in the database, skipping seed")
        return
    
    print("Seeding challenges...")
    # Create the challenges since none exist
    for challenge_data in sample_challenges:
        db_challenge = Challenge(
            title=challenge_data["title"],
            description=challenge_data["description"],
            category=challenge_data["category"],
            points=challenge_data["points"],
            icon=challenge_data["icon"],
            created_at=datetime.utcnow(),
            active=True
        )
        db.add(db_challenge)
    
    await db.commit()
    print(f"✓ {len(sample_challenges)} challenges seeded successfully")
