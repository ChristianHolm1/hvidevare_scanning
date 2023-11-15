# scraper.py
import asyncio
from playwright.async_api import async_playwright
import logging
import aiofiles
import re
import json
import os

class Scraper:
    def __init__(self, config):
        self.config = config
        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    async def fetch_page_content(self, url, user_agent, semaphore):
        async with semaphore:
            try:
                async with async_playwright() as p:
                    browser = await p.chromium.launch(headless=True)
                    context = await browser.new_context(user_agent=user_agent, viewport={'width': 1280, 'height': 720})
                    page = await context.new_page()
                    await self.add_cookies(context)

                    logging.info(f"Fetching URL: {url}")
                    await page.goto(url, timeout=15000)
                    await page.wait_for_load_state('networkidle')

                    title_element = await page.query_selector(self.config['title_xpath'])
                    title = await title_element.inner_text() if title_element else 'Not available'
                    sanitized_title = self.sanitize_filename(title)
                    await self.screenshot_page(sanitized_title, page)

                    await page.mouse.wheel(0, 5000)
                    if self.config.get('button_xpath'):
                        await page.click(self.config['button_xpath'], timeout=5000) 
                        await asyncio.sleep(1)

                    result = await self.extract_data_from_page(page)
                    result['url'] = url
                    result['title'] = sanitized_title

                    await context.close()
                    await browser.close()
                    return result
            except Exception as e:
                logging.error(f"Error fetching URL {url}: {e}")
                return None

    async def extract_data_from_page(self, page):
        data = {
            'price': await self.extract_element_text(page, self.config['price_xpath']),
            'energy_rating': await self.extract_element_text(page, self.config['energy_rating_xpath']),
            'varenummer': await self.extract_varenummer(page)
        }
        return data

    async def extract_element_text(self, page, xpath):
        element = await page.query_selector(xpath)
        return await element.inner_text() if element else 'Not available'

    async def extract_varenummer(self, page):
        varenummer_element = await page.query_selector(self.config['varenummer_xpath'])
        return await page.evaluate('(element) => element.nextElementSibling.innerText', varenummer_element) if varenummer_element else 'Not available'

    async def screenshot_page(self, title, page):
        screenshot_filename = os.path.join(self.config['screenshot_path'], f"{self.sanitize_filename(title)}.png")
        await page.screenshot(path=screenshot_filename)

    def sanitize_filename(self, filename):
        return re.sub(r'[\\/*?:"<>|]', '_', filename)

    async def add_cookies(self,context):
        async with aiofiles.open(self.config['cookie_file'], 'r') as file:
            cookies = json.loads(await file.read())
        await context.add_cookies(cookies)
