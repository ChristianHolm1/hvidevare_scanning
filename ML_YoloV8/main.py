from typing import List

import uvicorn
from ultralytics import YOLO
from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image
from io import BytesIO
import json

app = FastAPI()

# Define your YOLO model path
PATH_TO_MODEL = "ML_YoloV8/best.pt"
model = YOLO(PATH_TO_MODEL)


@app.post("/predict_images")
async def predict_images(images: List[UploadFile]):
    if not images:
        raise HTTPException(status_code=400, detail="No images uploaded")

    results = []
    for uploaded_file in images:
        if uploaded_file.filename == '':
            continue  # Skip empty file inputs

        image_bytes = uploaded_file.file.read()
        image = Image.open(BytesIO(image_bytes))
        result = predict_with_image(image)
        file_without_extension = uploaded_file.filename.split('.')[0]
        results.append({file_without_extension: result})

    return results


def predict_with_image(image):
    try:
        results = model.predict(image, conf=0.5, iou=0.75)
        class_labels = []

        for result in results:
            boxes = result.boxes
            if len(boxes.cls) == 0:
                class_labels.append("invalid")
            else:
                class_label_id = int(boxes.cls[0].item())
                class_labels.append(result.names[class_label_id])

        return class_labels
    except Exception as e:
        return str(e)


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8080)
