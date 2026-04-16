
from pymongo import MongoClient
from .def_file import DMP ,DVP,DB_COLL ,MONGO_URL,DB_NAME
print(DB_NAME,DB_COLL)
#from .database import DB_mongo


# This function is used to connect to MongoDBc
def mongo_setup(mgaddres ='mongodb+srv://priyanshbadger257:12345@cluster0.8vmpyzh.mongodb.net/?appName=Cluster0',DB_NAME ="vehical_live_data",DB_COLL ="vehical_live"):

    if not mgaddres :
        raise ValueError("All parameters (mgaddres, dbs, collections) are required!")
    try:
        client = MongoClient(mgaddres)
        db = client[DB_NAME]
        collection = db[DB_COLL]

        # Test data to insert
        test_data = {"test": "data"}
        result = collection.insert_one(test_data)
        print(f"Data inserted successfully with ID: {result.inserted_id}")




# islolation test 
  #      trackid = 1
   #     cof = 0.95
    #    classes = "person"
     #   x1, y1, x2, y2 = 100, 150, 200, 300

# Call the function
      #  DB_mongo(trackid, cof, classes, x1, x2, y1, y2, collection)

       # print("Data inserted successfully!")
        
        # Check connection
        client.admin.command('ping')
        print("MongoDB connected successfully")

        return collection  # Return the collection object
    except Exception as e:
        print(f"MongoDB operation failed: {e}")
        return None  # Return None if connection fail


