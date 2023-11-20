from scrapy.spiders import SitemapSpider
import re

class BilkaWhiteawaySiteMapSpider(SitemapSpider):
    name = 'bilkawhiteawaySpider'
    allowed_domains = ['bilka.whiteaway.dk']
    sitemap_urls = ['https://bilka.whiteaway.dk/seo/sitemap-bilka-index.xml'] 

    sitemap_rules = [
        (r'/hvidevarer/.*?/product/', 'parse_hvidevarer'),
    ]

    def parse_hvidevarer(self, response):
        yield {           
            'url': response.url,     
        }
