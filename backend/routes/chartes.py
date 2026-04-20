from flask import Flask, jsonify
import pandas as pd
from my_model import mongo_setup

from my_model import chartes, bar_chart, line_chart

app = Flask(__name__)

@app.route("/chartes")


def chart_data():
    coll = mongo_setup(mgaddres ='mongodb://localhost:27017/',DB_NAME ="Pavilion_mangment_dataset",DB_COLL ="vehical_live1")
    df = pd.DataFrame(coll.find())
    df = chartes(df)

    lister = df["class"].unique()
    line_data = []

    # ✅ loop properly
    for cls in lister:
        line_data.append(line_chart(df, cls))

    # ✅ bar data once
    bar_data = bar_chart(df)

    # ✅ return AFTER loop
    print(bar_data)
    print(line_data)
    return jsonify({
        "bar": bar_data,
        "line": line_data
    })

chart_data()
