from pydantic import BaseModel
from typing import Dict

class NewsEvent(BaseModel):
    title: str
    description: str
    event_type: str
    probability: float
    sector_impacts_if_true: Dict[str, float]
    sector_impacts_if_false: Dict[str, float]