def help_fn():
    print("""
📦 MY_MODEL LIBRARY HELP

Functions available:

1. vhd_fn(...)
   → Main function for vehicle detection on video
   → Inputs:
       - model_path: path to YOLO model
       - video_path: input video file
       - save_name: output file name
       - save_location: folder to save output
       - COLL: MongoDB collection (optional)
       - save: True/False (save frames)
       - save_mongodb: True/False (store data in MongoDB)

2. mongo_setup(...)
   → Connects to MongoDB and returns collection

--------------------------------------------------
Example usage:

from my_model import vhd_fn, mongo_setup

coll = mongo_setup("mongodb://localhost:27017", "db", "collection")

vhd_fn(
    model_path="model.pt",
    video_path="video.mp4",
    save_name="output",
    save_location="./out",
    COLL=coll
)
""")
