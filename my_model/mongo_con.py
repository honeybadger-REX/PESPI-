
from .def_file import MONGO_URL , DB_NAME , DB_COLL
from pymongo import  MongoClient

#This  funtion  is  use  to  connect  mongodb
def mongo_setup(mgaddres = MONGO_URL, dbs = DB_NAME, collections = DB_COLL):
    if not mgaddres or not dbs or not collections:
        raise ValueError("All parameters (mgaddres, dbs, collections) are required!")
    try:
        client = MongoClient(mgaddres)
        db = client[dbs]
        collection = db[collections]
        client.admin.command('ping')
        print("mongodp connectedd")
        print("use collection")
    except Exception as e:
        print(F"MOngoDB fail to  connect : {e}")
    return  collection

