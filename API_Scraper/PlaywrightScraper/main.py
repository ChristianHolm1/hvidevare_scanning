# main.py
from scraper import Scraper
import asyncio
import random
import json
import os
import requests
import base64
import pprint
def load_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)
    

# def find_images_based_on_title(data):
#     data_to_ML_API = []
#     path_to_images = 'API_Scraper/PlaywrightScraper/ProductData/Elgiganten/Screenshots'

#     for item in data:
#         item_title = item.get('title')
#         image = find_image_by_name(path_to_images, item_title)
        
#         if image:
#             data_to_ML_API.append({'files': image})
#         else:
#             pass

#     return data_to_ML_API
        
# def find_image_by_name(folder_path, name):
#     image_files = [f for f in os.listdir(folder_path) if f.lower().startswith(name.lower()) and f.lower().endswith(('.jpg', '.png', '.jpeg'))]

#     if image_files:
#         # Assuming there's only one matching image, return its file name without extension
#         full_path = os.path.join(folder_path, image_files[0])
#         with open(full_path, 'rb') as image_file:
#             image_content = image_file.read()

#         return image_content
#     else:
#         return None

def send_data_to_ML_API():
    # Send data to ML API
    ML_API_URL = 'http://localhost:5000/'
    path_to_images = 'API_Scraper/PlaywrightScraper/ProductData/Elgiganten/Screenshots'
    try:
        # Create a list to store the files data
        files_data = []

        # Iterate over the files in the specified folder
        for file_name in os.listdir(path_to_images):
            file_path = os.path.join(path_to_images, file_name)

            # Ensure the item is a file (not a subdirectory)
            if os.path.isfile(file_path):
                # Append each file as a tuple to the files_data list
                files_data.append(('files', (file_name, open(file_path, 'rb'))))

        # Check if there are any files to send
        if not files_data:
            print("No files found in the specified folder.")
            return

        # Send the files to the API using a POST request
        response = requests.post(ML_API_URL, files=files_data)

        # Check the response status
        response.raise_for_status()


    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except requests.exceptions.RequestException as req_err:
        print(f"Request error occurred: {req_err}")
    return response.json()

def insert_label_on_data(data, result_from_ML):
    for item in data:
        ###FIX THIS, SO THAT IT DOESN'T HAVE .JPG/.PNG IN THE END
        title = item['title'] + '.png'
        
        # Check if the title exists in the energy_labels dictionary
        if title in result_from_ML:
            # Add a new field 'energy_label' to the product
            
            item['energy_label'] = result_from_ML[title]
        
    return data
    
async def main():
    config_path = r'API_Scraper\PlaywrightScraper\Configs\ElgigantenConfig.json'
    config = load_json(config_path)
    scraper = Scraper(config)

    user_agents = load_json(r'API_Scraper\PlaywrightScraper\BrowserData\Useragents.json')
    data = load_json(r'API_Scraper\ScrapyScraper\data\test.json')

    concurrency_limit = 10
    semaphore = asyncio.Semaphore(concurrency_limit)

    scrape_tasks = []
    for item in data:
        ua = random.choice(user_agents)
        task = asyncio.create_task(scraper.fetch_page_content(item['url'], ua, semaphore))
        scrape_tasks.append(task)

    scraped_data = []
    for task in asyncio.as_completed(scrape_tasks):
        result = await task
        if result:
            scraped_data.append(result)
            
    result_from_ML = send_data_to_ML_API()
    ### WHEN PUSHED, GET IT UPDATEDET TO THE NEW FAST API ML, AND CHANGE THE URL TO THE NEW ONE, SO THAT IT DOESN'T HAVE .JPG/.PNG IN THE END
    scraped_data = insert_label_on_data(scraped_data, result_from_ML)
    pp = pprint.PrettyPrinter(indent=4)
    pp.pprint(scraped_data)

    with open(r'API_Scraper\PlaywrightScraper\ProductData\Elgiganten\Products\scraped_data.json', 'w') as file:
        json.dump([content for content in scraped_data if content], file, indent=4)

if __name__ == "__main__":
    asyncio.run(main())
