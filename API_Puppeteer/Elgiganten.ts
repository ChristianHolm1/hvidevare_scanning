import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import cheerio from 'cheerio';

const puppeteerOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
};
puppeteer.use(StealthPlugin());


async function init(website:string) {
    let url = website;
    
    
}

async function GetRawProducts(website: string) {
  const browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1332 });
  await page.goto(website, { waitUntil: 'networkidle2' });
  scrollDownAndLoadMore()
  await page.waitForSelector('button.coi-banner__accept');
  await page.click('button.coi-banner__accept');


  async function scrollDownAndLoadMore() {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await page.waitForTimeout(2000); 
  }


  let previousProductCount = 0;
  let currentProductCount = 0;

  while (true) {
    
    currentProductCount = (await page.$$('div.product-tile.ng-star-inserted')).length;

    if (currentProductCount === previousProductCount) {
      break;
    }
    await scrollDownAndLoadMore();
    previousProductCount = currentProductCount;
  }
  const products = await page.evaluate(() => {
    const productTiles = document.querySelectorAll('div.product-tile.ng-star-inserted');
    return Array.from(productTiles, (tile) => {
      const productName = tile.querySelector('a.product-name')?.textContent?.trim() || '';
      const productPrice = tile.querySelector('span.price__value')?.textContent?.trim() || '';
      const productRating = tile.querySelector('span.rating__score')?.textContent?.trim() || '0 Anmeldelser';
      const productImage = tile.querySelector('img.product-tile__image')?.getAttribute('src') || '';
      const productLink = tile.querySelector('a.product-tile__link')?.getAttribute('href') || 'No link available';
      const productEngImg = tile.querySelector('img.energy-img')?.getAttribute('src') || 'No eng img available';

      return {
        name: productName,
        price: productPrice,
        rating: productRating,
        image: productImage,
        link: `https://www.elgiganten.dk${productLink}`,
        productEngImg,
      };
    });
  });

  console.log('Product Details:');
  console.log(products);
  console.log(`Total Products: ${products.length}`);

  await browser.close();
}

async function GetRawProducts2(website: string) {
    const $ = cheerio.load(website);
    const productDivs = $('div.data-swiper-slide-index').html();
    return productDivs ? "Found" : "Not found";
  }

  GetRawProducts('https://www.elgiganten.dk/hvidevarer/vask-tor')