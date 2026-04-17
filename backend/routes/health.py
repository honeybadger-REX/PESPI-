from fastapi import APIRouter
from db import stats

router = APIRouter()

@router.get("/health")
def get_health():
    data = list(stats.find({}, {"_id": 0}))
    return data
