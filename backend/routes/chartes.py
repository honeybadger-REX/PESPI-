from flask import Flask, jsonify
import pandas as pd
from my_model import chartes, bar_cahrt, line_chart
from 

app = Flask(__name__)

@app.route("/chartes")

coll = mongo_setup(mgaddres ='mongodb://localhost:27017/',DB_NAME ="Pavilion_mangment_dataset",DB_COLL ="vehical_live1")

def chart_data():
    df = pd.DataFrame(coll.find())
    df = chartes(df)

    lister = df["class"].unique()
    line_data = []

    # ✅ loop properly
    for cls in lister:
        line_data.append(line_chart(df, cls))

    # ✅ bar data once
    bar_data = bar_cahrt(df)

    # ✅ return AFTER loop

    return jsonify({
        "bar": bar_data,
        "line": line_data
    })
