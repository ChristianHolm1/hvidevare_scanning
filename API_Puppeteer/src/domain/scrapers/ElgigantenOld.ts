import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Product } from "../entities/Product";
import fs from "fs";
import { ElgigantenScraper } from "./ElgigantenScraper";


 
let nyScraper: ElgigantenScraper = new ElgigantenScraper();

const puppeteerOptions = {
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
};
puppeteer.use(StealthPlugin());

async function GetRawProducts(website: string) {
  const browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1332 });
  await page.goto(website, { waitUntil: "networkidle2" });
  scrollDownAndLoadMore();
  await page.waitForSelector("button.coi-banner__accept");
  await page.click("button.coi-banner__accept");

  async function scrollDownAndLoadMore() {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  let previousProductCount = 0;
  let currentProductCount = 0;

  while (true) {
    currentProductCount = (await page.$$("div.product-tile.ng-star-inserted"))
      .length;

    if (currentProductCount === previousProductCount) {
      break;
    }
    await scrollDownAndLoadMore();
    previousProductCount = currentProductCount;
  }
  const productDetails = await page.evaluate(() => {
    const productTiles = document.querySelectorAll(
      "div.product-tile.ng-star-inserted"
    );
    const products = [];

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
      products.push({
        name: productName,
        price: productPrice,
        rating: productRating,
        image: productImage,
        link: `https://www.elgiganten.dk${productLink}`,
        productEngImg,
      });
    }

    return products;
  });
  const cookies = await page.cookies();
  await browser.close();
  fs.writeFileSync("Elgigantencookies.json", JSON.stringify(cookies, null, 2));

  const products: Product[] = productDetails.map(
    (productData) =>
      new Product(
        productData.name,
        productData.price,
        productData.rating,
        productData.image,
        productData.link,
        productData.productEngImg
      )
  );


  console.log("Product Details:");
  for (const product of products) {
    console.log(product.toString());
  }
  console.log(`Total Products: ${products.length}`);
 
}

(async () => {
  await nyScraper.initialize();
  const products = await nyScraper.scrapeProducts('https://www.elgiganten.dk/hvidevarer/vask-tor?filter=PTLowestLevelNodeValue:T%C3%B8rretumbler&filter=PTLowestLevelNodeValue:Vaskemaskine');
  console.log("Product Details:");
  for (const product of products) {
    console.log(product.toString());
  }
  console.log(`Total Products: ${products.length}`);
})();
