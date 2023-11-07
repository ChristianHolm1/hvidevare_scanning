from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import motor.motor_asyncio

from fastapi import FastAPI

app = FastAPI()

config = open('config.json')
key = json.load(config)
connectionString = key['mongo_connection_string']

client = motor.motor_asyncio.AsyncIOMotorClient(connectionString)
db = client['webstore']

cur = db['elgiganten'].find_one({"title":"Samsung WW5000T vaskemaskine WW85TA047AE"})

for doc in cur:
    print(doc)





# Get, Post, Delete
@app.get("/stores")
async def read_store():
    return {"All stores"}

@app.get("/stores/{store_name}")
async def read_store(store_name: str):
    return {"store_name": store_name}

@app.post("/stores/{store_name}")
async def post_store(store_name: str):
    return {"store_name": store_name}

@app.delete("/stores/{store_name}")
async def delete_store(store_name: str):
    return {"store_name": store_name}