import os
import torch 
import cv2
from pymongo import MongoClient
from datetime import datetime
from .mongo_con import mongo_setup



# Ensure imagepath is assigned a valid value before use
imagepath = "path/to/images"  # Update this to the correct path

def DB_mongo(trackid, cof, classes, x1, x2, y1, y2, collection):
    # Construct the object to insert
    print(collection)
    objct = {
        "track_id": trackid,
        "class": classes,
        "confidens": float(cof),
        "bbox": {
            "x0": int(x1),
            "y0": int(y1),
            "x1": int(x2),
            "y1": int(y2)
        },
        "image_path": imagepath,
        "timestand": datetime.now()

    }
    

    
    if collection is not None:
        try:
            collection.insert_one(objct)
        except Exception as e:
            
            print(f"Error inserting document into MongoDB: {e}")
    else:
        print("Invalid MongoDB collection provided.")




def DB_local(seen_ids, trackid,save_location,save_name,frame):
    filepath = os.path.join(save_location,save_name)
    seen_ids.add(trackid)
    filename = f"frame_{trackid}.jpg"
    imagepath = os.path.join(filepath, filename)
    cv2.imwrite(imagepath, frame)
    return seen_ids


