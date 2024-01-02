from scrapy.spiders import SitemapSpider
from datetime import datetime

class BilkaSpider(SitemapSpider):
    name = 'BilkaSpider'
    timestamp = datetime.now().strftime("%d-%m-%Y")
    allowed_domains = ['bilka.whiteaway.dk']
    sitemap_urls = ['https://bilka.whiteaway.dk/seo/sitemap-bilka-index.xml'] 

    sitemap_rules = [
        (r'/hvidevarer/.*?/product/', 'parse_hvidevarer'),

        #Rule to ignore 
        (r'.*mikroboelgeovn.*', 'parse')
    ]

    @classmethod
    def update_settings(cls, settings):
         super().update_settings(settings)
         settings.set("FEED_FORMAT", "json", priority="spider")
         settings.set("FEED_URI", f"..\\ScrapyScraper\\ScrapyData\\BilkaSpider\\{cls.name}_{cls.timestamp}.json", priority="spider")

    def parse(self, response):
        pass

    def parse_hvidevarer(self, response):
        yield {           
            'url': response.url,     
        }
