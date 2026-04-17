from fastapi import APIRouter
from db import detections

router = APIRouter()

@router.get("/vehicle")
def get_vehicle_data():
    data = list(detections.find({"class": "vehicle"}, {"_id": 0}))
    return data
