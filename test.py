from my_model import vhd_fn, mongo_setup,DMP,DVP,DB_COLL,DB_NAME,MONGO_URL
print(DMP,DVP,DB_COLL,DB_NAME,MONGO_URL)

coll = mongo_setup(mgaddres ='mongodb://localhost:27017/',DB_NAME ="vehical_live_data",DB_COLL ="vehical_live1")
print(type(coll))
vhd_fn(coll, DMP,DVP,save_name=".output2",save_location=r"D:\test-area-v1",save=True ,save_mongodb=True)

