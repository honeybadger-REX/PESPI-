from fastapi import APIRouter
from db import vehical_data

router = APIRouter()

@router.get("/vehicle")
def get_vehicle_data():
    data = list(
        vehical_data.find(
            {
                "class": {"$in": ["heavy", "medium", "light"]}
            },
            {"_id" : 0}
        )
    )
    return data
