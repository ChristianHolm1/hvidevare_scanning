import { ElgigantenScraper } from "./domain/scrapers/ElgigantenScraper";
import express, { Request, Response } from "express";
import cors from "cors";
let nyScraper: ElgigantenScraper = new ElgigantenScraper();


const app = express();
const port = 3000;
app.use(cors())
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.send('Api kører');
});

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});


app.post('/scrape',async (req: Request, res: Response) => {
  try {
    await nyScraper.initialize();
    console.log('Scraping products...');
    const products = await nyScraper.scrapeProducts(req.body.website);
    res.json(products);
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while scraping');
  }
});




