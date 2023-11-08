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
