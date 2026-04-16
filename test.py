from my_model import vhd_fn, mongo_setup,DMP,DVP,DB_COLL,DB_NAME,MONGO_URL
print(DMP,DVP,DB_COLL,DB_NAME,MONGO_URL)

coll = mongo_setup(mgaddres ='mongodb://localhost:27017/',DB_NAME ="vehical_live_data",DB_COLL ="vehical_live")
print(type(coll))
vhd_fn(coll, DMP,DVP,save_name="output",save_location="./out",save=False ,save_mongodb=True)
