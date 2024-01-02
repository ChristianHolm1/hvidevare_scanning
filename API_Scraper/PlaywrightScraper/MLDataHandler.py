import math
import os
import requests

class MLDataHandler:
    """
    Class for handling data to machine learning API.
    """
    def __init__(self, ml_api_url: str, path_to_images: str):
        """
        Initialize the MLDataHandler class.
        
        Args:
            ml_api_url (str): The URL to the machine learning API.
            path_to_images (str): The path to the folder with images.
        """
        self.ML_API_URL = ml_api_url
        self.path_to_images = path_to_images
        
    def send_data_to_ML_API(self, picture_start: int, picture_end: int):
        """
        Send data to the machine learning API.
        
        Args:
            picture_start (int): The start index of the images to send.
            picture_end (int): The end index of the images to send.
        Returns:
            dict: The result from the machine learning API.
        """
        try:
            files_data = []
            
            for file_name in os.listdir(self.path_to_images):
                file_path = os.path.join(self.path_to_images, file_name)
                
                if os.path.isfile(file_path):
                    files_data.append(('images', (file_name, open(file_path, 'rb'))))
            files_data = files_data[picture_start:picture_end]

            if not files_data:
                print("No files found in the specified folder.")
                return
            
            response = requests.post(self.ML_API_URL, files=files_data)
            response.raise_for_status()

        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
            
        except requests.exceptions.RequestException as req_err:
            print(f"Request error occurred: {req_err}")
            
        finally:
            for file_tuple in files_data:
                file_tuple[1][1].close()
        
        return response.json()

    def insert_label_on_data(self, data: dict, result_from_ML: dict):
        """
        Insert the label into the data.
        
        Args:
            data (dict): The data to insert the label into.
            result_from_ML (dict): The result from the machine learning API.
        Returns:
            dict: The data with the label inserted.
        """
        new_data = []
        for item in data:
            title = item['title']

            for ml_item in result_from_ML:
                if title in ml_item:
                    # Get's the label from the result
                    label = ml_item[title][0]
                    item['productLabel'] = label
                    new_data.append(item)
        
        return new_data

    def send_to_ML_API_and_split_elements_in_chunks(self, data: dict):
        """
        Send data to machine learning API and split the data into chunks of 1000 elements.
        
        Args:
            scraped_data (dict): The data to send to the machine learning API.
        Returns:
            dict: The result from the machine learning API.
        """
        estimated_time = self.machine_learning_time_estimator(len(data))
        print(f'Sending data to machine learning API begun, estimated time: {estimated_time} minutes')
        
        result_from_ML = []
        scraped_data_length = len(data)
        thousands_in_scraped_data = math.floor(scraped_data_length // 1000)

        for i in range(thousands_in_scraped_data + 1):
            if(i == thousands_in_scraped_data and i * 1000 < scraped_data_length):
                result_from_ML.extend(self.send_data_to_ML_API(i*1000, (i+1)*1000))
            else:
                result_from_ML.extend(self.send_data_to_ML_API(i*1000, (i+1)*1000))
        
        print('Sending data to ML API finished')
        return result_from_ML
    
    def machine_learning_time_estimator(self, data_length: int):
        """
        Estimate the time it will take to send data to the machine learning API.
        
        Args:
            data_length (int): The length of the scraped data.
        Returns:
            int: The estimated time in minutes.
        """
        return math.ceil(data_length / 1000 * 1.5) 
    
    def process_data_to_ml(self, data: dict):
        """
        Process data to machine learning API.
        
        Args:
            data (dict): The data to process with the machine learning API.
        Returns:
            dict: The data with the label inserted.
        """
        result_from_ML = self.send_to_ML_API_and_split_elements_in_chunks(data)
        result_with_lables = self.insert_label_on_data(data, result_from_ML)
        return result_with_lables