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
    

    collectionv,db  = mongo_setup(mgaddres ='mongodb://localhost:27017/',DB_NAME ="Pavilion_mangment_dataset",DB_COLL="vehical_data")
    object2 = {
        "track_id": trackid,
        "class": classes,
        "confidens": float(cof),
        "timestand": datetime.now()}
    # Ensure collection is valid before inserting
    if collectionv is not None:
        collectionv.insert_one(object2)
    if collection is not None:
        try:
            collection.insert_one(objct)
        except Exception as e:
            
            print(f"Error inserting document into MongoDB: {e}")
    else:
        print("Invalid MongoDB collection provided.")




def DB_local(globale, trackid,save_location,save_name,frame):
    filepath = os.path.join(save_location,save_name)
    filename = f"frame_{globale+trackid}.jpg"
    imagepath = os.path.join(filepath, filename)
    cv2.imwrite(imagepath, frame)



