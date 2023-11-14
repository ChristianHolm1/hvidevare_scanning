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

  showInvalid(){
    this.hideAll()
    this.showElement("invalid");
  }

  showOldLabel(){
    this.hideAll()
    this.showElement("old");
  }

  showNewLabel(){
    this.hideAll()
    this.showElement("new");
  }

  showAll(){
    this.showElement("new");
    this.showElement("invalid");
    this.showElement("old");
  }
  hideAll(){
    this.hideElement("new");
    this.hideElement("invalid");
    this.hideElement("old");
  }

  showElement(className:string){
    let elements = document.getElementsByClassName(className);
    for(let i=0; i<elements.length; i++){
      elements[i].classList.remove("invisable");
    }
  }
  hideElement(className:string){
    let elements = document.getElementsByClassName(className);
    for(let i=0; i<elements.length; i++){
      elements[i].classList.add("invisable");
    }
  }
  

}