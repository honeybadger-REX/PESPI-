from pymongo import MongoClient
import pandas as pd
import matplotlib.pyplot as plt
from .mongo_con import mongo_setup


def chartes(colle,db,mongo_save=False):
    
    
    df = pd.DataFrame(colle.find())

    df.drop(index=0, inplace=True, errors='ignore')
    fg = ["bbox","image_path","_id","test"]
    df.drop(columns=fg, inplace=True, errors='ignore')

    df['timestand_date_str'] = df['timestand'].apply(lambda x: x['$date'] if isinstance(x, dict) and '$date' in x else None)

    df['timestand_datetime'] = pd.to_datetime(df['timestand_date_str'])
    df["seconds"] = df['timestand_datetime'].dt.second
    df["mintes"] = df["timestand_datetime"].dt.minute

    # charts
    line_data = []
    bar = bar_chart(df)

    fg = df["class"].unique()

    for f in range(len(fg)):   # ✅ fix: rnage → range
        line_data.append(line_chart(df, fg[f]))

    vehical_graph = {
        "bar_data": bar,
        "line_data": line_data
    }

    # MongoDB logic
    if mongo_save == True:
        collectionv = db["vehical_graph"]
        collectionv.insert_one(vehical_graph)   # ✅ fix: actually save data
        


    return vehical_graph   # ✅ fix: return graph instead of df


def bar_chart(df):
    plt.figure(figsize=(10, 6))
    class_counts = df['class'].value_counts()
    plt.bar(class_counts.index, class_counts.values)
    return {
        "labels": class_counts.index.tolist(),
        "values": class_counts.values.tolist()
    }


def line_chart(df, litess):
    ty = df[df["class"] == litess]
    ty = ty.sort_values(by="mintes", ascending=False)
    countesh = ty['mintes'].value_counts()

    plt.figure(figsize=(10, 6))
    sorted_countes = countesh.sort_index()
    plt.plot(sorted_countes.index, sorted_countes.values)

    return {
        "labels": sorted_countes.index.tolist(),
        "values": sorted_countes.values.tolist()
    }   
