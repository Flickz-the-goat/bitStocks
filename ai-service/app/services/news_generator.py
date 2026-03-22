import os
import json
import random
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
SECTORS = ["Technology", "Energy", "Finance", "Healthcare", "Industrial", "Consumer"]

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-3-flash-preview")


def generate_news(year: int):
    prompt = f"""
You are a financial news simulation engine.

Generate EXACTLY 10 macroeconomic news events for the year {year}.

Each event MUST follow this JSON structure:
{{
  "title": string,
  "description": string,
  "event_type": "macro",
  "probability": float (0.0 to 1.0),
  "sector_impacts_if_true": {{
    "Technology": float (-5 to 5),
    "Energy": float (-5 to 5),
    "Finance": float (-5 to 5),
    "Healthcare": float (-5 to 5),
    "Industrial": float (-5 to 5),
    "Consumer": float (-5 to 5)
  }},
  "sector_impacts_if_false": same structure
}}

STRICT RULES:
- Output ONLY valid JSON (no markdown, no explanations)
- Return an array of 10 events
- Probabilities must be realistic (based on real-world likelihoods)
- Impacts must reflect real economic logic:
  Example:
    - Oil supply disruption → Energy up, Consumer down
    - Interest rate hikes → Finance mixed, Tech down
- "description" must:
    - explain WHY the event might happen
    - explain HOW it impacts sectors
    - help a player make an investment decision
- "title" must:
    - be concise
    - feel like a real headline
    - grab attention

Make events diverse:
- geopolitics
- central bank policy
- technological breakthroughs
- pandemics
- supply chain disruptions
- regulation changes
"""

    response = model.generate_content(prompt)

    # Clean + parse response safely
    text = response.text.strip()

    try:
        events = json.loads(text)
    except Exception:
        # fallback if AI slightly breaks format
        text = text[text.find("["):text.rfind("]") + 1]
        events = json.loads(text)

    # Final validation + fallback safety
    validated_events = []

    for event in events:
        validated_event = {
            "title": event.get("title", f"Market Event {year}"),
            "description": event.get("description", ""),
            "event_type": "macro",
            "probability": round(float(event.get("probability", random.uniform(0.4, 0.7))), 2),
            "sector_impacts_if_true": event.get("sector_impacts_if_true", {s: 0 for s in SECTORS}),
            "sector_impacts_if_false": event.get("sector_impacts_if_false", {s: 0 for s in SECTORS}),
        }
        validated_events.append(validated_event)

    return validated_events