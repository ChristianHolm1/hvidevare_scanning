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
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const cheerio_1 = __importDefault(require("cheerio"));
const puppeteerOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
};
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
function init(website) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = website;
    });
}
function GetRawProducts(website) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_extra_1.default.launch(puppeteerOptions);
        const page = yield browser.newPage();
        yield page.setViewport({ width: 1000, height: 1332 });
        yield page.goto(website, { waitUntil: 'networkidle2' });
        scrollDownAndLoadMore();
        yield page.waitForSelector('button.coi-banner__accept');
        yield page.click('button.coi-banner__accept');
        function scrollDownAndLoadMore() {
            return __awaiter(this, void 0, void 0, function* () {
                yield page.evaluate(() => {
                    window.scrollBy(0, window.innerHeight);
                });
                yield page.waitForTimeout(2000);
            });
        }
        let previousProductCount = 0;
        let currentProductCount = 0;
        while (true) {
            currentProductCount = (yield page.$$('div.product-tile.ng-star-inserted')).length;
            if (currentProductCount === previousProductCount) {
                break;
            }
            yield scrollDownAndLoadMore();
            previousProductCount = currentProductCount;
        }
        const products = yield page.evaluate(() => {
            const productTiles = document.querySelectorAll('div.product-tile.ng-star-inserted');
            return Array.from(productTiles, (tile) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                const productName = ((_b = (_a = tile.querySelector('a.product-name')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '';
                const productPrice = ((_d = (_c = tile.querySelector('span.price__value')) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim()) || '';
                const productRating = ((_f = (_e = tile.querySelector('span.rating__score')) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.trim()) || '0 Anmeldelser';
                const productImage = ((_g = tile.querySelector('img.product-tile__image')) === null || _g === void 0 ? void 0 : _g.getAttribute('src')) || '';
                const productLink = ((_h = tile.querySelector('a.product-tile__link')) === null || _h === void 0 ? void 0 : _h.getAttribute('href')) || 'No link available';
                const productEngImg = ((_j = tile.querySelector('img.energy-img')) === null || _j === void 0 ? void 0 : _j.getAttribute('src')) || 'No eng img available';
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
        yield browser.close();
    });
}
function GetRawProducts2(website) {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = cheerio_1.default.load(website);
        const productDivs = $('div.data-swiper-slide-index').html();
        return productDivs ? "Found" : "Not found";
    });
}
GetRawProducts('https://www.elgiganten.dk/hvidevarer/vask-tor');
