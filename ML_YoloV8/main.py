from ultralytics import YOLO
from flask import Flask, request, Response
from PIL import Image
import numpy as np
from io import BytesIO
import json


global PATH_TO_MODEL
PATH_TO_MODEL = "ML_YoloV8/best.pt"

app = Flask(__name__)

@app.route('/', methods=['POST'])
def display_image():
    if 'files' not in request.files:
        return "No key with the name of files found"
    
    uploaded_files = request.files.getlist('files')
    
    if not uploaded_files:
        return "No selected files"
    
    images = []
    resultDictionary = {}
    for uploaded_file in uploaded_files:
        if uploaded_file.filename == '':
            continue  # Skip empty file inputs
        resultDictionary[uploaded_file.filename] = []
        image_bytes = uploaded_file.read()
        image = Image.open(BytesIO(image_bytes))
        images.append(image)

    results = testWithImages(images)
    for i in range(len(results)):
        resultDictionary[uploaded_files[i].filename] = results[i]

    json_object = json.dumps(resultDictionary, indent = 4) 
    return Response(json_object, status=200, mimetype='application/json')

def testWithCamera():
    model = YOLO(PATH_TO_MODEL)
    results = model(source=0, show=True, conf=0.6, save=True)


def trainModel(epochs: int):
    model = YOLO("yolov8s.pt")
    model.train(data="data.yaml", epochs=epochs)
    model.export(format='onnx')


def testWithVideo(path_to_video: str):
    model = YOLO(PATH_TO_MODEL)
    # Open the video file
    model.predict(path_to_video, conf=0.5, show=True, save=True, iou=0.75)


def testWithImages(path_to_images: str):
    model = YOLO(PATH_TO_MODEL)
    results = model.predict(path_to_images, conf=0.5, iou=0.75)
    classLabels = []
    for result in results:
        boxes = result.boxes  # Boxes object for bbox outputs
        if(len(boxes.cls) == 0):
            classLabels.append("No label")
        else:
            classLabelId = int(boxes.cls[0].item())
            classLabels.append(result.names[classLabelId])
    return classLabels

    

def main():
    app.run(debug=True)



if __name__ == '__main__':
    # Call the main function only when this script is executed directly
    main()
