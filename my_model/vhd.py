import os
import torch 
import cv2
from pymongo import  MongoClient
from .core import load_model, vedio_load, file_load, process_frame
from .def_file import DMP ,DVP,DB_COLL
from datetime import datetime

# THis  funtion is  use  to load  file  and  save  output  in  mongodb  and localy  also   and  it is  call under  vehical_dection_fn
def data_procesing(result,filepath,frame,out,save,save_mongodb,collection):
    # Store unique IDs
    seen_ids = set()
    classes = ""
    data = []
    boxes = result[0].boxes
    for box in boxes:
        if box.id is None:
            continue
        trackid = int(box.id[0])
        cls = int(box.cls[0])
        cof = float(box.conf[0])
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        if cls == 0 :
            classes = "light"
        elif cls == 1 :
            classes = "heavy"
        else:
            classes = "medium"



        if trackid not in seen_ids :
            if save == True:
                seen_ids.add(trackid)
                filename = f"frame_{trackid}.jpg"
                imagepath = os.path.join(filepath,filename)
                cv2.imwrite(imagepath,frame)

            if cof > 0.7 :
                cv2.rectangle(frame, (x1,y1),(x2,y2),(0,255,0),2)
                cv2.putText(frame, f"{cls}:{cof:.2f}", (x1, y1-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2)
                if save_mongodb == True:
                    objct = { "track_id" : trackid,"class" : classes,"confidens" : float(cof),"bbox": {
                          "x1": int(x1),
                          "y1": int(y1),
                          "x2": int(x2),
                          "y2": int(y2)},
                          "image_path" : imagepath,"timestand" : datetime.now()}
                    collection.insertOne(objct)
                cv2.imshow("Detection", frame)
                data.extend(frame)
                out.write(frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

    out.release()
    cv2.destroyAllWindows()
    if save == True:
        return data ,seen_ids
    else:
        return data, 0 

# main  funtion under  whihc  all the  funtion  ar  called and  work  in  proper flow
def  vhd_fn(model_path = DMP , video_path = DVP,save_name = ".out",save_location=r"D:\test-area-v1",save = True,save_mongodb = True,COLL=DB_COLL):

    model = load_model(model_path)
    cap = vedio_load(video_path)
    out , filepath = file_load(cap,save_name,save_location)
        # Store unique IDs
    frame_count =  0



    while cap.isOpened():
        ret , frame = cap.read()
        if not ret:
            break
        frame_count += 1
        if frame_count >= 499:
            break
        frame = cv2.resize(frame, (640, 360))
        result = process_frame(model, frame)
        data ,seen_ids = data_procesing(result,filepath,frame,out,save,save_mongodb,COLL)
    cap.release()
    print(f"Done! Output saved as {filepath}.mp4")

