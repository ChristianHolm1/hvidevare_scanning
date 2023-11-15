import { Injectable } from '@angular/core';
import axios from 'axios';
import { Product } from '../classes/product';
import { ProductContainerComponent } from 'src/app/product-container/product-container.component';
import { UrlSegment } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiMongoService {

  constructor() { }

  productList: Product[] = [];
  async getWebstoreProducts(param: string) {
    try {
      this.productList = [];

      const response = await axios.get(`http://127.0.0.1:8000/${param}`)
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

  elgigantenStatsList: number[] = [];
  old: number = 0;
  new: number = 0;
  invalid: number = 0;

  async getChartStats(): Promise<number[]> {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/elgiganten`)
      for (const product of response.data.products) {
        switch (product.productLabel) {
          case "old":
            this.old++;
            break;
          case "new":
            this.new++;
            break;
          case "invalid":
            this.invalid++;
            break;
        }
      }
      this.elgigantenStatsList.push(this.old, this.new, this.invalid);
      return this.elgigantenStatsList as number[];
    } catch (error: any) {
      return error;
    }
  } 
}
