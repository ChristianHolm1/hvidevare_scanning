import os
import json

class FileHandler:
    def __init__(self, path_to_images):
        self.path_to_images = path_to_images
    
    @staticmethod
    def load_json(filename):
        try:
            with open(filename, 'r') as file:
                print(f"Data loaded from {filename}")
                return json.load(file)
        except Exception as e:
            print(e)
    @staticmethod
    def save_json(data, filename):
        try:
            with open(filename, 'w') as file:
                json.dump(data, file, indent=4)
                print(f"Data saved to {filename}")
        except Exception as e:
            print(e)

    @staticmethod
    def delete_images_from_folder(path_to_images):
        try:
            for filename in os.listdir(path_to_images):
                if os.path.isfile(os.path.join(path_to_images, filename)):
                    os.remove(os.path.join(path_to_images, filename))
        except Exception as e:
            print(e)
