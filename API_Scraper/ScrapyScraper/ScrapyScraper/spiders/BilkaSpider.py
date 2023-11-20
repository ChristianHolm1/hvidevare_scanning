from scrapy.spiders import SitemapSpider
from datetime import datetime

class BilkaSpider(SitemapSpider):
    name = 'BilkaSpider'
    timestamp = datetime.now().strftime("%d-%m-%Y")
    custom_settings = {
        'FEED_FORMAT': 'json',
        'FEED_URI': f'ScrapyScraper\ScrapyData\BilkaSpider\{name}_{timestamp}.json'
    }
    allowed_domains = ['bilka.whiteaway.dk']
    sitemap_urls = ['https://bilka.whiteaway.dk/seo/sitemap-bilka-index.xml'] 

    sitemap_rules = [
        (r'/hvidevarer/.*?/product/', 'parse_hvidevarer'),
    ]

    def parse_hvidevarer(self, response):
        yield {           
            'url': response.url,     
        }
