from fastapi import APIRouter
from app.services.news_generator import generate_news

router = APIRouter(prefix="/news", tags=["news"])

@router.post("/generate")
def generate_news_route(payload: dict):
    year = payload.get("year", 1)

    events = generate_news(year)

    return {
        "year": year,
        "events": events
    }