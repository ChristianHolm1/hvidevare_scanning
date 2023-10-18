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

app.post('/scrape', async (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const website = req.body.website;
  console.log(website); //virker
  if (!website) {
    const error = new Error('No website specified');
    return res.status(400).send(error.message);
  }
  try {
    await nyScraper.initialize();
    const scraped = await nyScraper.scrapeProducts(website);
    res.status(200).send(scraped);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
});

