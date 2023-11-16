import subprocess
import os
from datetime import datetime

spiders = ['ElgigantenSpider','bilkawhiteawaySpider']

for spider in spiders:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"ScrapyData/{spider}/{spider}_{timestamp}.json"  # Changed to relative path

    # Ensure the data directory exists
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    # Construct the command
    command = ['scrapy', 'crawl', spider, '-o', filename]
    print(f"Running command: {' '.join(command)}")  # Debugging

    # Run the spider and save its output
    subprocess.run(command, shell=True)  # Added shell=True