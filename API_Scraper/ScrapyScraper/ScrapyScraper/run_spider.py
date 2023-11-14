import subprocess
import os
from datetime import datetime

# List of your spider names
spiders = ['ElgigantenSpider']

for spider in spiders:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"data/{spider}_{timestamp}.json"

    # Ensure the data directory exists
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    # Run the spider and save its output
    subprocess.run(['scrapy', 'crawl', spider, '-o', filename])

