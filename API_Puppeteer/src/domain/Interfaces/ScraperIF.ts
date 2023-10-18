import { Product } from "../entities/Product";

export interface ScraperIF {
    initialize(): Promise<void>;
    scrapeProducts(website: string): Promise<Product[]>;
    close(): Promise<void>;
}