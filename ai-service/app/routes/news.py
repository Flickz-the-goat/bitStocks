from fastapi import APIRouter
from app.services.news_generator import generate_news
import threading

router = APIRouter(prefix="/news", tags=["news"])

# Global cache
all_news = {}

def generate_future_news(start_year: int):
    years_to_generate = [start_year + 1, start_year + 2, start_year + 3]

    for y in years_to_generate:
        if y not in all_news:
            try:
                events = generate_news(y)
                all_news[y] = events
            except Exception as e:
                print(f"Error generating news for {y}: {e}")

@router.post("/generate")
def generate_news_route(payload: dict):
    year = payload.get("year")

    # ✅ If cached → instant
    if year in all_news:
        return {
            "year": year,
            "events": all_news[year],
            "cached": True,
        }

    # ✅ Generate ONLY current year (fastest possible response)
    events = generate_news(year)
    all_news[year] = events

    # ✅ Start background caching for future years
    thread = threading.Thread(target=generate_future_news, args=(year,))
    thread.start()

    return {
        "year": year,
        "events": events,
        "cached": False,
    }