import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings


from spiders.ElgigantenSpider import ElgigantenSpider
from spiders.BilkaSpider import BilkaSpider

def run_spiders():
    process = CrawlerProcess(get_project_settings())


    process.crawl(ElgigantenSpider)
    process.crawl(BilkaSpider)


    process.start()

if __name__ == '__main__':
    run_spiders()
