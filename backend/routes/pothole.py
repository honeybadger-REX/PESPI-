from fastapi import APIRouter
from db import detections

router = APIRouter()

@router.get("/pothole")
def get_pothole_data():
    data = list(
        detections.find(
            {"class": "pothole"},
            {"_id": 0}
        )
    )
    return data
