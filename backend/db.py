from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["Pavilion_mangment_dataset"]

vehical_data = db["vehical_live1"]
stats = db["road_stats"]

detections = db["vehical_live1"]
