import { Injectable } from '@angular/core';
import axios from 'axios';
import { Product } from '../classes/product';
import { ProductContainerComponent } from 'src/app/product-container/product-container.component';

@Injectable({
  providedIn: 'root',
})
export class ApiPuppeteerService {
  constructor() {}
  productList: Product[] = [];
  async getHtmlFromSite(url: string) {
    try {
      this.productList = [];
      const response = await axios.post('http://localhost:3000/scrape', {
        website: url,
      });
      const product = new Product('', '', '', []);
      product.title = response.data.title;
      product.price = response.data.price;
      product.image = response.data.image;
      for (const key in response.data.specs) {
        if (response.data.specs.hasOwnProperty(key)) {
          product.specs.push({ key, value: response.data.specs[key] });
        }
      }
      this.productList.push(product)
      this.productList.push(product)
      

      ProductContainerComponent.ProductList = this.productList;
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  }
}
