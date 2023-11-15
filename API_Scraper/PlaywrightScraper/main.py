# main.py
from scraper import Scraper
import asyncio
import random
import json

def load_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

async def main():
    config_path = r'C:\Users\Lucas\OneDrive\Documents\Project Solita\Hvidevare scanning\API_Scraper\PlaywrightScraper\Configs\ElgigantenConfig.json'
    config = load_json(config_path)
    scraper = Scraper(config)

    user_agents = load_json(r'C:\Users\Lucas\OneDrive\Documents\Project Solita\Hvidevare scanning\API_Scraper\PlaywrightScraper\BrowserData\Useragents.json')
    data = load_json(r'C:\Users\Lucas\OneDrive\Documents\Project Solita\Hvidevare scanning\API_Scraper\ScrapyScraper\data\test.json')

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

    with open(r'C:\Users\Lucas\OneDrive\Documents\Project Solita\Hvidevare scanning\API_Scraper\PlaywrightScraper\ProductData\Elgiganten\Products\scraped_data.json', 'w') as file:
        json.dump([content for content in scraped_data if content], file, indent=4)

if __name__ == "__main__":
    asyncio.run(main())
