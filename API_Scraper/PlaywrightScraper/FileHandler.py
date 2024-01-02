import os
import json

class FileHandler:
    """
    Class for handling files.
    """
    
    @staticmethod
    def save_json(data, file_path : str):
        """
        Save data to JSON file.
        
        Args:
            data (dict): Data to save.
            file_path (str): Path to JSON file.
        """ 
        try:
            with open(file_path, 'w') as file:
                json.dump(data, file, indent=4)
                print(f"Data saved to {file_path}")
        except Exception as e:
            print(e)
            
    @staticmethod
    def load_json(file_path : str):
        """
        Load data from JSON file.
        
        Args:
            file_path (str): Path to JSON file.
        """
        try:
            with open(file_path, 'r') as file:
                print(f"Data loaded from {file_path}")
                return json.load(file)
        except Exception as e:
            print(e)
      

    @staticmethod
    def delete_images_from_folder(path_to_images : str):
        """
        Load data from JSON file.
        
        Args:
            path_to_images (str): Path to folder with images.
        """ 
        try:
            for file_path in os.listdir(path_to_images):
                if os.path.isfile(os.path.join(path_to_images, file_path)):
                    os.remove(os.path.join(path_to_images, file_path))
        except Exception as e:
            print(e)
