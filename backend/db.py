from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["road_db"]

detections = db["detections"]
stats = db["road_stats"]
