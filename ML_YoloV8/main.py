import cv2
from ultralytics import YOLO
from flask import Flask, request, Response

global PATH_TO_MODEL
PATH_TO_MODEL = "runs/detect/train30/weights/best.pt"

app = Flask(__name__)
def testWithCamera(path_to_model: str):
    model = YOLO(path_to_model)
    results = model(source=0, show=True, conf=0.6, save=True)


def trainModel(epochs: int):
    model = YOLO("yolov8s.pt")
    model.train(data="data.yaml", epochs=epochs)
    model.export(format='onnx')


def testWithVideo(path_to_model: str, path_to_video: str):
    model = YOLO(path_to_model)
    # Open the video file
    model.predict(path_to_video, conf=0.5, show=True, save=True, iou=0.75)


def testWithOneImage(path_to_model: str, path_to_images: str):
    model = YOLO(path_to_model)
    # Open the video file
    model.predict(path_to_images, conf=0.5, show=True, save=True, iou=0.75)



@app.route('/predict_images', methods=['POST'])
def testWithImages(images: []):
    model = YOLO(PATH_TO_MODEL)
    # Open the video file
    results = model.predict(images, conf=0.5, show=True, save=True, iou=0.75)

    return Response(response=results, status=200, mimetype="application/json")

def main():
    app.run()


if __name__ == '__main__':
    # Call the main function only when this script is executed directly
    main()
