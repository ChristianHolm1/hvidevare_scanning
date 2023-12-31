import { Injectable } from '@angular/core';
import axios from 'axios';
import { Product } from '../classes/product';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiMongoService {
  private productListSubject: Subject<Product[]> = new Subject<Product[]>();
  productList: Product[] = [];
  apiUrl: String = "http://127.0.0.1:8000";
  constructor() { }

  async getWebstoreProducts(collectionName: string) {
    try {
      this.productList = [];

      const response = await axios.get(`${this.apiUrl}/${collectionName}`);
      for (const product of response.data.products) {
        this.productList.push(
          new Product(
            product.title,
            product.price,
            product.energy_rating,
            product.varenummer,
            product.product_img,
            product.url,
            product.productLabel,
            getProductLabel(product.energy_rating, product.productLabel)
          )
        );
      }
      this.updateProductList(); // Update the product list in the subject
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  }

  private updateProductList(): void {
    this.productListSubject.next([...this.productList]); // Emit a new copy of the list
  }

  sendProductList(): void {
    this.updateProductList(); // Trigger update through the subject
  }

  getProductList(): Observable<Product[]> {
    return this.productListSubject.asObservable();
  }

  
}
function getProductLabel(energy_rating: string, productLabel: string): string {
  const labelsFolderPath = 'small_product_labels';
  const validLabels = ['NewLabel', 'OldLabel'];
  
  if (validLabels.includes(productLabel)) {
      const labelType = productLabel;
      const imageName = `${energy_rating.charAt(0).toUpperCase()}${energy_rating.slice(1)}.png`;
      return `assets/${labelsFolderPath}/${labelType}/${imageName}`;
  } else {
      // Return path for 'invalid' label
      return `assets/${labelsFolderPath}/invalid/invalid.png`;
  }
}
