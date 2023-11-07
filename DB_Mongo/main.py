from typing import Union
import json
import motor.motor_asyncio
import pprint
from fastapi import FastAPI
from bson import ObjectId
app = FastAPI()

config = open('config.json')
key = json.load(config)
connectionString = key['mongo_connection_string']

client = motor.motor_asyncio.AsyncIOMotorClient(connectionString)
db = client['webstore']


def convert_object_ids_to_strings(doc):
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
    return doc

# Get, Post, Delete
@app.get("/stores")
async def read_store():
    return {"stores": "stores"}
    

@app.get("/stores/{store_name}")
async def read_store(store_name: str):
    documents = db[store_name].find({})
    products = [convert_object_ids_to_strings(document) for document in await documents.to_list(length=1000)]
    return {"products": products}

@app.post("/stores/{store_name}")
async def post_store(store_name: str):
    return {"store_name": store_name}

@app.delete("/stores/{store_name}")
async def delete_store(store_name: str):
    return {"store_name": store_name}

