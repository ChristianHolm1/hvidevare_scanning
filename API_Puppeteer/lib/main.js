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
const ElgigantenScraper_1 = require("./domain/scrapers/ElgigantenScraper");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
let nyScraper = new ElgigantenScraper_1.ElgigantenScraper();
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Api kører');
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
app.post('/scrape', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield nyScraper.initialize();
        console.log('Scraping products...');
        const products = yield nyScraper.scrapeProducts(req.body.website);
        res.json(products);
        res.status(200);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while scraping');
    }
}));
