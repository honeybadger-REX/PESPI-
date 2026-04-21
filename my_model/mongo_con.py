
from pymongo import MongoClient
#from .database import DB_mongo


# This function is used to connect to MongoDBc
def mongo_setup(mgaddres ='mongodb://localhost:27017/',DB_NAME ="vehical_live_data",DB_COLL ="vehical_live"):

    if not mgaddres :
        raise ValueError("All parameters (mgaddres, dbs, collections) are required!")
    try:
        client = MongoClient(mgaddres)
        db = client[DB_NAME]
        collection = db[DB_COLL]

        # Test data to insert
        
        
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

        return collection , db   # Return the collection object
    except Exception as e:
        print(f"MongoDB operation failed: {e}")
        return None  # Return None if connection fail


