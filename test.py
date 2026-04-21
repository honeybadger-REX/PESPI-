from my_model import vhd_fn, mongo_setup,DMP,DVP,DB_COLL,DB_NAME,MONGO_URL
print(DMP,DVP,DB_COLL,DB_NAME,MONGO_URL)

coll,db = mongo_setup(mgaddres ='mongodb://localhost:27017/',DB_NAME ="Pavilion_mangment_dataset",DB_COLL ="vehical_live1")
print(coll , db)
print(type(coll))
vhd_fn(coll,db , DMP,DVP,save_name=".output2",save_location=r"D:\test-area-v1",save=True ,save_mongodb=True)
