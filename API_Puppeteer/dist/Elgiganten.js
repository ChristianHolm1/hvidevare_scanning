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
const puppeteerOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
};
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
function init(website) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = website;
        getRawProductList(website);
    });
}
function getRawProductList(website) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const browser = yield puppeteer_extra_1.default.launch(puppeteerOptions);
                const page = yield browser.newPage();
                yield page.goto(website);
                yield page.waitForSelector('.product-tile');
                const productDivs = yield page.$$eval('.product-tile', (divs) => divs.map((div) => div.outerHTML));
                yield browser.close();
                resolve(productDivs);
            }
            catch (error) {
                reject(error);
            }
        }));
    });
}
getRawProductList('https://www.elgiganten.dk/hvidevarer/vask-tor')
    .then((productDivs) => {
    console.log(productDivs);
})
    .catch((error) => {
    console.error(error);
});
//# sourceMappingURL=Elgiganten.js.map