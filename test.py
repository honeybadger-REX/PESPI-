from my_model import vhd_fn, mongo_setup,DMP,DVP,DB_COLL
coll = mongo_setup("mongodb://localhost:27017", "db", "collection")
print(f"use  collection {coll}")
vhd_fn(
     DMP,
    DVP,
    save_name="output",
    save_location="./out",
    save=True,
    save_mongodb=False,
    COLL=DB_COLL
    )
