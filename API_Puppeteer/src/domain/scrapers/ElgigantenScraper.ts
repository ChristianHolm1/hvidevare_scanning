
import { ScraperIF } from "../Interfaces/ScraperIF";
import { Product } from "../entities/Product";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";



export class ElgigantenScraper implements ScraperIF{
    private browser: any;
    private products: Product[] = [];

    async initialize(): Promise<void> {
      puppeteer.use(StealthPlugin());
        this.browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
    }

    async scrapeProducts(website: string): Promise<Product[]> {
        if (!this.browser) {
            throw new Error("Scraper is not initialized. Call initialize() first.");
        }
        this.products = [];
        const page = await this.browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.0.0 Safari/537.36');
        await page.setViewport({  width: 1920, height: 1080 });
        await page.goto(website, { waitUntil: "networkidle2"});
  //      await page.waitForTimeout(3000); //virker når der er waitfortimeout på, ellers lukker min browser for hurtigt.
        this.scrollDownAndLoadMore(page);
        await page.waitForSelector("button.coi-banner__accept");
        await page.click("button.coi-banner__accept");
        let currentPage = 0;
        let prevPage = 0;
        while(true){
        currentPage++;
        await this.scrapeProducts1(page);
        if(currentPage === prevPage){
          break;
        }
        const nextPageLinkElement = await page.$("a.pagination__arrow.kps-link[aria-label='Gå til næste side']");
        console.log(nextPageLinkElement);
        if (nextPageLinkElement) {
            await nextPageLinkElement.click();
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
        } else {
            break;
        }
        }
        await this.browser.close();

        console.log(`Scraped a total of ${this.products.length} products`);
          return this.products;
    }

  private async scrapeProducts1(page: any): Promise<Product[]> {
    let previousProductCount = 0;
    let currentProductCount = 0;
    while (true) {
      currentProductCount = (await page.$$("div.product-tile.ng-star-inserted"))
        .length;

      if (currentProductCount === previousProductCount) {
        break;
      }
     await this.scrollDownAndLoadMore(page);
      previousProductCount = currentProductCount;
    }

    const productDetails = await page.evaluate(() => {
      const productTiles = document.querySelectorAll(
        "div.product-tile.ng-star-inserted"
      );
      const productsData = [];

      for (const tile of productTiles) {
        const productName = tile.querySelector("a.product-name")?.textContent?.trim() ?? "";
        const productPrice = tile.querySelector("span.price__value")?.textContent?.trim() ?? "";
        const productRating = tile.querySelector("span.rating__score")?.textContent?.trim() ??
          "0 Anmeldelser";
        const productImage = tile.querySelector("img.product-tile__image")?.getAttribute("src") ??
          "";
        const productLink = tile.querySelector("a.product-tile__link")?.getAttribute("href") ??
          "No link available";
        const productEngImg = tile.querySelector("img.energy-img")?.getAttribute("src") ??
          "No eng img available";
        productsData.push({
          name: productName,
          price: productPrice,
          rating: productRating,
          image: productImage,
          link: `https://www.elgiganten.dk${productLink}`,
          productEngImg,
        });
      }

      return productsData;
    });

    const products = productDetails.map((product: any) => {
      return new Product(
          product.name,
          product.price,
          product.rating,
          product.image,
          product.link,
          product.productEngImg
      );
  });
  for (const product of products) {
    this.products.push(product);
  }

    return products;
  }

    async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async scrollDownAndLoadMore(page:any): Promise<void> {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight* 2);
      });
        await new Promise(resolve => setTimeout(resolve, 300));
      }
} 

