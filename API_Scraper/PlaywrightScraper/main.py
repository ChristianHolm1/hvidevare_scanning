from scraper import Scraper
import asyncio
from datetime import datetime
import random
import json
import os
import requests


website_name = 'elgiganten'

def load_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

def send_data_to_ML_API(path_to_images):
    # Send data to ML API
    ML_API_URL = 'http://localhost:8080/predict_images'
    
    try:
        # Create a list to store the files data
        files_data = []

        # Iterate over the files in the specified folder
        for file_name in os.listdir(path_to_images):
            file_path = os.path.join(path_to_images, file_name)

            # Ensure the item is a file (not a subdirectory)
            if os.path.isfile(file_path):
                # Append each file as a tuple to the files_data list
                files_data.append(('images', (file_name, open(file_path, 'rb'))))

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
    finally:
        # Close the files
        for file_tuple in files_data:
            file_tuple[1][1].close()
    return response.json()

def insert_label_on_data(data, result_from_ML):
    for item in data:
        title = item['title']
        
        # Check if the title exists in any of the dictionaries in result_from_ML
        for ml_item in result_from_ML:
            if title in ml_item:
                # Extract the value for the title from the matching dictionary
                label = ml_item[title][0]
                # Add a new field 'energy_label' to the product
                item['productLabel'] = label
        
    return data


async def delete_data_in_db(api_url, collection_name):
    response = requests.delete(api_url + collection_name)
    return response.status_code == 200
  

async def send_data_to_db(api_url,data, collection_name):
    response = requests.post(api_url + collection_name, data=data)
    return response.status_code == 201


def delete_images_from_folder(path_to_images):
    try:
        for filename in os.listdir(path_to_images):
            if os.path.isfile(os.path.join(path_to_images, filename)):
                os.remove(os.path.join(path_to_images, filename))
    except Exception as e:
        print(e)
        pass

async def main(website: str,concurrency_limit: int):
    timestamp = datetime.now().strftime("%d-%m-%Y")
    config_path = f'API_Scraper\PlaywrightScraper\Configs\{website}Config.json'
    config = load_json(config_path)
    scraper = Scraper(config)

    user_agents = load_json(r'API_Scraper\PlaywrightScraper\BrowserData\Useragents.json')
    data = load_json(f'API_Scraper\ScrapyScraper\ScrapyData\{website}Spider\{website}Spider_{timestamp}.json')

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
    
    path_to_images = 'API_Scraper/PlaywrightScraper/ProductData/{name}/Screenshots'.format(name=website_name)
    result_from_ML = send_data_to_ML_API(path_to_images)
    ### WHEN PUSHED, GET IT UPDATEDET TO THE NEW FAST API ML, AND CHANGE THE URL TO THE NEW ONE, SO THAT IT DOESN'T HAVE .JPG/.PNG IN THE END
    scraped_data = insert_label_on_data(scraped_data, result_from_ML)
    scraped_data = {'products': scraped_data}
    formated_data = json.dumps(scraped_data)
    database_url = 'http://127.0.0.1:8000/'
    collection_name = website_name
    await delete_data_in_db(database_url, collection_name)
 
    await send_data_to_db(database_url, formated_data, collection_name)
    
    delete_images_from_folder(path_to_images)


 

    with open(f"{config['productdata_path']}_{timestamp}.json", 'w') as file:
        json.dump([content for content in scraped_data if content], file, indent=4)

if __name__ == "__main__":
    asyncio.run(main("elgiganten", 10))