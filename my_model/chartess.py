from pymongo import MongoClient
import pandas as pd
import matplotlib.pyplot as plt

def chartes(df):
  
  df.drop(index=0, inplace=True)
  fg = ["bbox","image_path","_id","test"]
  df.drop(columns=fg, inplace=True)
  df['timestand_date_str'] = df['timestand'].apply(lambda x: x['$date'] if isinstance(x, dict) and '$date' in x else None)
  df['timestand_datetime'] = pd.to_datetime(df['timestand_date_str'])
  df["seconds"] = df['timestand_datetime'].dt.second
  df["mintes"] = df["timestand_datetime"].dt.minute
  return  df 


def bar_chart(df):
  plt.figure(figsize=(10, 6))
  class_counts = df['class'].value_counts()
  plt.bar(class_counts.index, class_counts.values)
  return {"labels": class_counts.index.tolist(),
        "values": class_counts.values.tolist()}


def line_chart(df,litess):
  ty =df[df["class"] == litess]
  ty = ty.sort_values(by="mintes", ascending=False)
  countesh = ty['mintes'].value_counts()
  plt.figure(figsize=(10, 6))
  sorted_countes = countesh.sort_index()
  plt.plot(sorted_countes.index, sorted_countes.values)
  return {
    "labels": sorted_countes.index.tolist(),
    "values": sorted_countes.values.tolist()
    }
