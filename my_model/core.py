# -*- coding: utf-8 -*
try:
    import os
    os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
    import torch
    import cv2
    from ultralytics import YOLO
    from pymongo import  MongoClient
except ImportError as e:
    raise ImportError(f"Missing dependency: {e}. Run pip install -r requirements.txt")



# THis  funtion is  use  to load  model  and  it is  call under  vehical_dection_fn
def load_model(model_paths):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    if not model_paths:
        model_path = r"D:\reseach modles\vehical_detection2.pt"
    else:
        model_path = model_paths

    model = YOLO(model_path)
    model.to(device)
    return model

# THis  funtion is  use  to load  video  and  it is  call under  vehical_dection_fn
def  vedio_load(video_path):
    if not video_path:
        cap = cv2.VideoCapture(r"D:\reseacr dataset\video dataset test\12207144_1920_1080_30fps.mp4")
    else:
        cap = cv2.VideoCapture(video_path)
    return cap

# THis  funtion is  use  to load  file  and  save  output  in  mongodb  and localy  also   and  it is  call under  vehical_dection_fn
def file_load(cap,output_filename,outfil_location):
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    if not output_filename:
        out = cv2.VideoWriter('output.mp4', fourcc, fps, (width, height))
    else:
        out = cv2.VideoWriter(f'{output_filename}.mp4', fourcc, fps, (width, height))
    filepath = ""
    if not outfil_location:
        filepath = "image"
    else:
        filepath = outfil_location
    os.makedirs(filepath, exist_ok=True)

    return out , filepath

# THis  funtion is  uses  model  on  frame  and  out  is  is  then  retn  by  it and  it  is  call under  vehical_dection_fn
def process_frame(model, frame):
    results = model.track(frame, persist=True)
    return results


