import { Component } from '@angular/core';
import { Product } from '../shared/classes/product';

@Component({
  selector: 'app-product-container',
  templateUrl: './product-container.component.html',
  styleUrls: ['./product-container.component.scss']
})
export class ProductContainerComponent {
  static ProductList:Product[] = [];
  productList:Product[] = [];

  get staticProductList() { 
    if(ProductContainerComponent.ProductList.length) {
      this.productList = ProductContainerComponent.ProductList;
      return "";
    }
    else {
      return "";
    }
  }
}