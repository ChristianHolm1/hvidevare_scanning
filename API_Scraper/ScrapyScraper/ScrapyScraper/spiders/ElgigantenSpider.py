from scrapy.spiders import SitemapSpider
from datetime import datetime

class ElgigantenSpider(SitemapSpider):
    name = 'ElgigantenSpider'
    timestamp = datetime.now().strftime("%d-%m-%Y")
    allowed_domains = ['elgiganten.dk']
    sitemap_urls = ['https://www.elgiganten.dk/sitemaps/OCDKELG.pdp.index.sitemap.xml'] 

    sitemap_rules = [
        # Rule for vaskemaskine
        ('/hvidevarer/vask-tor/vaskemaskine', 'parse_hvidevarer'),

        # Rule for torretumbler
        ('/hvidevarer/vask-tor/torretumbler-torreskab/torretumbler/', 'parse_hvidevarer'),

        # Rule for køleskab
        ('/product/hvidevarer/koleskabe-fryseskabe/', 'parse_hvidevarer'),

        # Rule for ovn
        ('/hvidevarer/ovn-komfur/ovn', 'parse_hvidevarer'),

        # Rule for emhætte
        ('/hvidevarer/emhatte', 'parse_hvidevarer'),

        # Rule for vinkøleskab
        ('/hvidevarer/vinkoler-vinkoleskab', 'parse_hvidevarer'),

        #Rule to ignore 
        (r'.*koletaske-og-koleboks.*', 'parse'),
        (r'.*mikrobolgeovn.*', 'parse')
    ]

    def parse(self, response):
        pass   

    def parse_hvidevarer(self, response):
        yield {           
            'url': response.url,     
        }