from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import motor.motor_asyncio
import json
import uvicorn
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator
from pydantic import ConfigDict, BaseModel, Field
from typing import Optional, List

app = FastAPI(
    title="Webstore DB API"
)

# Load config
with open('DB_Mongo/config.json') as config_file:
    config = json.load(config_file)

# MongoDB client and dynamic database
client = motor.motor_asyncio.AsyncIOMotorClient(config["mongo_connection_string"])
db = client[config["database"]]
product_collection = db.get_collection("elgiganten")

# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]

class ProductModel(BaseModel):
    """
    Container for a single product.
    """

    # The primary key for the ProjectModel, stored as a `str` on the instance.
    # This will be aliased to `_id` when sent to MongoDB,
    # but provided as `id` in the API requests and responses.
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    title: str = Field(...)
    model_config = ConfigDict(
        extra='allow',
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "Title": "Vaskemaskine",   
            }
        },
    )

class ProductCollection(BaseModel):
    """
    A container holding a list of `StudentModel` instances.

    This exists because providing a top-level array in a JSON response can be a [vulnerability](https://haacked.com/archive/2009/06/25/json-hijacking.aspx/)
    """

    products: List[ProductModel]


@app.get("/{collection_name}/", response_model=ProductCollection)
async def list_products(collection_name: str):
    if collection_name not in await db.list_collection_names():
        raise HTTPException(status_code=404, detail="Collection not found")
    
    product_collection = db[collection_name]
    products = await product_collection.find().to_list(10000)
    return ProductCollection(products=products)
  
@app.delete("/{collection_name}/")
async def delete_products(collection_name: str):
    if collection_name not in await db.list_collection_names():
        raise HTTPException(status_code=404, detail="Collection not found")
    
    product_collection = db[collection_name]
    await product_collection.delete_many({})

from fastapi import HTTPException

@app.post("/{collection_name}/")
async def add_products(collection_name: str, products: ProductCollection):
    try:
        product_collection = db[collection_name]
        product_dicts = [
            product.model_dump(by_alias=True, exclude_none=True) 
            for product in products.products
        ]
        
        if not product_dicts:
            raise HTTPException(status_code=400, detail="No products provided")

        # Insert data into the database
        result = await product_collection.insert_many(product_dicts)

        # Check if all items were inserted successfully
        if result.inserted_ids and len(result.inserted_ids) == len(product_dicts):
            return JSONResponse(
                status_code=201,
                content={"message": "Products added successfully"}
            )
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to add all products to the database"
            )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to add products: {str(e)}"
        )

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)
