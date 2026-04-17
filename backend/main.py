from fastapi import FastAPI
from routes import vehicle, pothole, crack, health
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vehicle.router)
app.include_router(pothole.router)
app.include_router(crack.router)
app.include_router(health.router)
