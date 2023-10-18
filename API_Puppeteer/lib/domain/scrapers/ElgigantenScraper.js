"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElgigantenScraper = void 0;
const Product_1 = require("../entities/Product");
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
class ElgigantenScraper {
    constructor() {
        this.products = [];
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield puppeteer_extra_1.default.launch({
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
            puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
        });
    }
    scrapeProducts(website) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.browser) {
                throw new Error("Scraper is not initialized. Call initialize() first.");
            }
            const page = yield this.browser.newPage();
            yield page.setViewport({ width: 1000, height: 1332 });
            yield page.goto(website, { waitUntil: "networkidle2" });
            yield page.waitForTimeout(3000); //virker når der er waitfortimeout på, ellers lukker min browser for hurtigt.
            this.scrollDownAndLoadMore(page);
            yield page.waitForSelector("button.coi-banner__accept");
            yield page.click("button.coi-banner__accept");
            let previousProductCount = 0;
            let currentProductCount = 0;
            while (true) {
                currentProductCount = (yield page.$$("div.product-tile.ng-star-inserted"))
                    .length;
                if (currentProductCount === previousProductCount) {
                    break;
                }
                yield this.scrollDownAndLoadMore(page);
                previousProductCount = currentProductCount;
            }
            const productDetails = yield page.evaluate(() => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                const productTiles = document.querySelectorAll("div.product-tile.ng-star-inserted");
                const productsData = [];
                for (const tile of productTiles) {
                    const productName = (_c = (_b = (_a = tile.querySelector("a.product-name")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "";
                    const productPrice = (_f = (_e = (_d = tile.querySelector("span.price__value")) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : "";
                    const productRating = (_j = (_h = (_g = tile.querySelector("span.rating__score")) === null || _g === void 0 ? void 0 : _g.textContent) === null || _h === void 0 ? void 0 : _h.trim()) !== null && _j !== void 0 ? _j : "0 Anmeldelser";
                    const productImage = (_l = (_k = tile.querySelector("img.product-tile__image")) === null || _k === void 0 ? void 0 : _k.getAttribute("src")) !== null && _l !== void 0 ? _l : "";
                    const productLink = (_o = (_m = tile.querySelector("a.product-tile__link")) === null || _m === void 0 ? void 0 : _m.getAttribute("href")) !== null && _o !== void 0 ? _o : "No link available";
                    const productEngImg = (_q = (_p = tile.querySelector("img.energy-img")) === null || _p === void 0 ? void 0 : _p.getAttribute("src")) !== null && _q !== void 0 ? _q : "No eng img available";
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
            yield this.browser.close();
            this.products = productDetails.map((product) => {
                return new Product_1.Product(product.name, product.price, product.rating, product.image, product.link, product.productEngImg);
            });
            return this.products;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser) {
                yield this.browser.close();
            }
        });
    }
    scrollDownAndLoadMore(page) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
            });
            yield new Promise(resolve => setTimeout(resolve, 2000));
        });
    }
}
exports.ElgigantenScraper = ElgigantenScraper;
