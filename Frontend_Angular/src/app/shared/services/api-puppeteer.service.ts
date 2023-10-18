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
      console.log(response.data);
      for (const product of response.data) {
        this.productList.push(
          new Product(
            product.title,
            product.price,
            product.rating,
            product.productImage,
            product.productLink,
            product.productEnergyImg
          )
        );
      }
      ProductContainerComponent.ProductList = this.productList;
      console.log(ProductContainerComponent.ProductList);
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  }
}
