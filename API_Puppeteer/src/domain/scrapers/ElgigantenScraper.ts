import { ScraperIF } from "../Interfaces/ScraperIF";
import { Product } from "../entities/Product";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

export class ElgigantenScraper implements ScraperIF {
  private browser: any;

  async initialize(): Promise<void> {
    puppeteer.use(StealthPlugin());
    this.browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  async scrapeProducts(website: string, maxPages: number = 2): Promise<Product[]> {
    if (!this.browser) {
      throw new Error("Scraper is not initialized. Call initialize() first.");
    }

    let currentPage = 1;
    const products: Product[] = [];
    const page = await this.browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1000, height: 1332 });
    await page.goto(website, { waitUntil: "networkidle2" });
    await page.waitForTimeout(3000);
    this.scrollDownAndLoadMore(page);
    await page.waitForSelector("button.coi-banner__accept");
    await page.click("button.coi-banner__accept");

    while (currentPage <= maxPages) {
      const nextPageURL = `${website}/page-${currentPage}`;
      await page.goto(nextPageURL, { waitUntil: "networkidle2" });
      await page.waitForTimeout(3000);
      this.scrollDownAndLoadMore(page);

      let previousProductCount = 0;
      let currentProductCount = 0;

      while (true) {
        currentProductCount = (await page.$$(
          "div.product-tile.ng-star-inserted"
        )).length;

        if (currentProductCount === previousProductCount) {
          break;
        }
        await this.scrollDownAndLoadMore(page);
        previousProductCount = currentProductCount;
      }

      const productDetailsOnPage = await page.evaluate(() => {
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

      products.push(
        ...productDetailsOnPage.map((product: any) => {
          return new Product(
            product.name,
            product.price,
            product.rating,
            product.image,
            `https://www.elgiganten.dk${product.link}`,  
            product.productEngImg
          );
        })
      );

      const nextPageButton = await page.waitForSelector(".pagination__arrow.kps-link");

      if (!nextPageButton) {
        break;
      }

      await nextPageButton.click();
      await page.waitForNavigation({ waitUntil: "networkidle2" });
      currentPage++;

      await page.waitForTimeout(2000);
    }

    await this.browser.close();

    console.log(products.length);
    return products;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async scrollDownAndLoadMore(page: any): Promise<void> {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
