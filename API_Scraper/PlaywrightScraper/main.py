import asyncio
from datetime import datetime
import json
import random

from scraper import Scraper
from DatabaseHandler import DatabaseHandler
from FileHandler import FileHandler
from MLDataHandler import MLDataHandler


async def main(website: str,concurrency_limit: int):
    path_to_images = f"API_Scraper/PlaywrightScraper/ProductData/{website}/Screenshots"
    ml_sender = MLDataHandler('http://localhost:8080/predict_images', path_to_images)
    database_url = f'http://localhost:8000/'
    database_handler = DatabaseHandler(website, database_url) 
    file_handler = FileHandler(path_to_images)
    
    timestamp = datetime.now().strftime("%d-%m-%Y")
    config_path = f'API_Scraper\PlaywrightScraper\Configs\{website}Config.json'
    config = file_handler.load_json(config_path)
    productdata_path = f"{config['productdata_path']}_{timestamp}.json"
    
    scraper = Scraper(config)
    user_agents = file_handler.load_json(r'API_Scraper\PlaywrightScraper\BrowserData\Useragents.json')
    #CHNAGE!!!!{timestamp}
    data = file_handler.load_json(f'API_Scraper\ScrapyScraper\ScrapyData\{website}Spider\{website}spider_20-11-2023.json')

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
    
    print(f"Scraped {len(scraped_data)} products")
    file_handler.save_json(scraped_data, productdata_path)

    data_with_labels = {'products': ml_sender.process_data_to_ml(scraped_data)}
    
    file_handler.save_json(data_with_labels, productdata_path)
    data_to_db = json.dumps(data_with_labels)
    
    await database_handler.process_data_to_db(data_to_db)

    file_handler.delete_images_from_folder()
    

if __name__ == "__main__":
    asyncio.run(main("bilka", 10))