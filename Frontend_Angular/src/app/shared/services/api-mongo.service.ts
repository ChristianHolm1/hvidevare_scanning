import { Injectable } from '@angular/core';
import axios from 'axios';
import { Product } from '../classes/product';
import { ProductContainerComponent } from 'src/app/product-container/product-container.component';

@Injectable({
  providedIn: 'root'
})
export class ApiMongoService {

  constructor() { }

  productList: Product[] = [];

  async getWebstoreProducts(collectionName: string) {
    try {
      this.productList = [];

      const response = await axios.get(`http://127.0.0.1:8000/${collectionName}`);
      for (const product of response.data.products) {
        this.productList.push(
          new Product(
            product.title,
            product.price,
            product.rating,
            product.productImage,
            product.productLink,
            product.productEnergyImg,
            product.productLabel
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

  async getChartStats(collectionName: string): Promise<number[]> {
    try {
      const statsList: number[] = [0, 0, 0];

      const response = await axios.get(`http://127.0.0.1:8000/${collectionName}`);
      for (const product of response.data.products) {
        switch (product.productLabel) {
          case 'old':
            statsList[0]++;
            break;
          case 'new':
            statsList[1]++;
            break;
          case 'invalid':
            statsList[2]++;
            break;
        }
      }

      return statsList;
    } catch (error: any) {
      console.error('Error fetching chart stats:', error.message);
      throw error;
    }
  } 
}
