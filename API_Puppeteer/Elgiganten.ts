import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const puppeteerOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
};
puppeteer.use(StealthPlugin());


async function init(website:string) {
    let url = website;
    getRawProductList(website);
    
}

async function getRawProductList(website: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch(puppeteerOptions);
        const page = await browser.newPage();
        await page.goto(website);
        await page.waitForSelector('.product-tile');
        const productDivs = await page.$$eval('.product-tile', (divs) =>
          divs.map((div) => div.outerHTML)
        );
  
        await browser.close();
        resolve(productDivs);
      } catch (error) {
        reject(error);
      }
    });
  }


  getRawProductList('https://www.elgiganten.dk/hvidevarer/vask-tor')
  .then((productDivs) => {
    // Process productDivs here
    console.log(productDivs);
    
  })
  .catch((error) => {
    console.error(error);
  });