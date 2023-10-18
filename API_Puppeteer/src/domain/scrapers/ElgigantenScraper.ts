
import { ScraperIF } from "../Interfaces/ScraperIF";
import { Product } from "../entities/Product";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";



export class ElgigantenScraper implements ScraperIF{
    // Use this.browser to interact with the Puppeteer browser instance;
    private browser: any;
    private products: Product[] = [];

    async initialize(): Promise<void> {
        this.browser = await puppeteer.launch({
            headless: false,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        puppeteer.use(StealthPlugin());
    }

    async scrapeProducts(website: string): Promise<Product[]> {
        if (!this.browser) {
            throw new Error("Scraper is not initialized. Call initialize() first.");
        }
        const page = await this.browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1000, height: 1332 });
        await page.goto(website, { waitUntil: "networkidle2"});
        await page.waitForTimeout(3000); //virker når der er waitfortimeout på, ellers lukker min browser for hurtigt.
        this.scrollDownAndLoadMore(page);
        await page.waitForSelector("button.coi-banner__accept");
        await page.click("button.coi-banner__accept");
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
              const productName =
                tile.querySelector("a.product-name")?.textContent?.trim() ?? "";
              const productPrice =
                tile.querySelector("span.price__value")?.textContent?.trim() ?? "";
              const productRating =
                tile.querySelector("span.rating__score")?.textContent?.trim() ??
                "0 Anmeldelser";
              const productImage =
                tile.querySelector("img.product-tile__image")?.getAttribute("src") ??
                "";
              const productLink =
                tile.querySelector("a.product-tile__link")?.getAttribute("href") ??
                "No link available";
              const productEngImg =
                tile.querySelector("img.energy-img")?.getAttribute("src") ??
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
        await this.browser.close();

        this.products = productDetails.map((product: any) => {
            return new Product(
                product.name,
                product.price,
                product.rating,
                product.image,
                product.link,
                product.productEngImg
            );
        });

          return this.products;
    }

    async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async scrollDownAndLoadMore(page:any): Promise<void> {
        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
} 

