const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cors = require('cors');
const puppeteerOptions = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
};
puppeteer.use(StealthPlugin());
const cheerio = require('cheerio');

const app = express();
const port = 3000;
app.use(cors())
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post('/scrape', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const website = req.body.website;
  if (!website) {
    const error = new Error('No website specified');
    error.status = 400;
    return res.status(400).send(error.message);
  }
  try {
    const scraped = await scrape(website);
    res.status(200).send(scraped);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
});

async function scrape(website) {
  try {
    const browser = await puppeteer.launch(puppeteerOptions);
    const page = await browser.newPage();
    await page.goto(website);
    const content = await page.content();
    const $ = cheerio.load(content);

    fetchTitle($);
    fetchPrice($);
    fetchImage($);
    fetchData($);
    await browser.close();

    return scrapedList;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function fetchTitle($) {
  const productTitle = $(`head > title`).text();
  scrapedList['title'] = productTitle;
}

function fetchPrice($) {
  const productPrice = $(`.box__price`).text();
  scrapedList['price'] = productPrice;
}

function fetchImage($) {
  const productImage = $(`#main > ng-component > div > div > section:nth-child(3) > div > div.pdp__media-intro.pdp__media-intro--icons.sticky.stuck > div.pdp__media > elk-product-media > div > div > elk-product-media-viewer > elk-carousel > div > swiper > div > div.swiper-slide.ng-star-inserted.swiper-slide-active > img`).attr('src');
  scrapedList['image'] = productImage;
}

function fetchData($) {
  selectorList.forEach(element => {
    const productTypeElement = $(`.spec-attributes__cell--name:contains('${element}')`).first();
    const productType = productTypeElement.next('.spec-attributes__cell--value').text();
    scrapedList.specs[element] = productType
  });
}

let selectorList = [
  'Produkttype',
  'Type vaskemaskine',
  'Energimærke',
  'Højde (inkl. emballage)',
  'Bredde (cm)',
  'Dybde (cm)',
  'Vægt (kg)'
]

let scrapedList = {
  specs: {}
}