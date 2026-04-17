from fastapi import APIRouter
from db import detections

router = APIRouter()

@router.get("/crack")
def get_crack_data():
    data = list(
        detections.find(
            {"class": "crack"},
            {"_id": 0}
        )
    )
    return data
