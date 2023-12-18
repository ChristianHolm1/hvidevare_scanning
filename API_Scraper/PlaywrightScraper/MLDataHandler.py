import math
import os
import requests

class MLDataHandler:
    def __init__(self, ml_api_url, path_to_images):
        self.ML_API_URL = ml_api_url
        self.path_to_images = path_to_images
        
    def send_data_to_ML_API(self, picture_start, picture_end):

        try:
            # Create a list to store the files data
            files_data = []

            # Iterate over the files in the specified folder
            for file_name in os.listdir(self.path_to_images):
                file_path = os.path.join(self.path_to_images, file_name)

                # Ensure the item is a file (not a subdirectory)
                if os.path.isfile(file_path):
                    # Append each file as a tuple to the files_data list
                    files_data.append(('images', (file_name, open(file_path, 'rb'))))
            files_data = files_data[picture_start:picture_end]
            # Check if there are any files to send
            if not files_data:
                print("No files found in the specified folder.")
                return
            

            # Send the files to the API using a POST request
            response = requests.post(self.ML_API_URL, files=files_data)

            # Check the response status
            response.raise_for_status()


        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
        except requests.exceptions.RequestException as req_err:
            print(f"Request error occurred: {req_err}")
        finally:
            # Close the files
            for file_tuple in files_data:
                file_tuple[1][1].close()
        return response.json()

    def insert_label_on_data(self, data, result_from_ML):
        new_data = []
        for item in data:
            title = item['title']
            
            # Check if the title exists in any of the dictionaries in result_from_ML
            
            for ml_item in result_from_ML:
                if title in ml_item:
                    # Extract the value for the title from the matching dictionary
                    label = ml_item[title][0]
                    # Add a new field 'energy_label' to the product
                    item['productLabel'] = label
                    new_data.append(item)
        
        return new_data

    def send_to_ML_API_and_split_elements_in_chunks(self, scraped_data):
        estimated_time = self.machine_learning_time_estimator(len(scraped_data))
        print(f'Sending data to machine learning API begun, estimated time: {estimated_time} minutes')
        
        result_from_ML = []
        scraped_data_length = len(scraped_data)
        thousands_in_scraped_data = math.floor(scraped_data_length // 1000)

        for i in range(thousands_in_scraped_data + 1):
            if(i == thousands_in_scraped_data and i * 1000 < scraped_data_length):
                result_from_ML.extend(self.send_data_to_ML_API(i*1000, (i+1)*1000))
            else:
                result_from_ML.extend(self.send_data_to_ML_API(i*1000, (i+1)*1000))
        
        print('Sending data to ML API finished')
        return result_from_ML
    
    def machine_learning_time_estimator(self, scarped_data_length):
        
        return math.ceil(scarped_data_length / 1000 * 1.5) 
    
    def process_data_to_ml(self, scraped_data):
        result_from_ML = self.send_to_ML_API_and_split_elements_in_chunks(scraped_data)
        result_with_lables = self.insert_label_on_data(scraped_data, result_from_ML)
        return result_with_lables