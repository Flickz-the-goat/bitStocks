import random

SECTORS = ["Technology", "Energy", "Finance", "Healthcare"]

def random_impact():
    return round(random.uniform(-5, 5), 2)

def generate_news(year: int):
    events = []

    for _ in range(10):  # 3 events per year
        impacts_true = {sector: random_impact() for sector in SECTORS}
        impacts_false = {sector: random_impact() for sector in SECTORS}

        event = {
            "title": f"Global Event Year {year}",
            "description": "Major economic shift expected.",
            "event_type": "macro",
            "probability": round(random.uniform(0.4, 0.8), 2),
            "sector_impacts_if_true": impacts_true,
            "sector_impacts_if_false": impacts_false
        }

        events.append(event)

    return events