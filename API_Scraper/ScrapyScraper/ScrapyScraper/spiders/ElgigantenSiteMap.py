from scrapy.spiders import SitemapSpider




class ElgigantenSitemapSpider(SitemapSpider):
    name = 'ElgigantenSpider'
    allowed_domains = ['elgiganten.dk']
    sitemap_urls = ['https://www.elgiganten.dk/sitemaps/OCDKELG.pdp.index.sitemap.xml'] 

    custom_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'

    sitemap_rules = [
        ('/hvidevarer/', 'parse_hvidevarer'),
    ]

    def parse_hvidevarer(self, response):
        yield {           
            'url': response.url,     
        }
