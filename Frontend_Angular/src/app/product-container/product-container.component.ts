import { Component } from '@angular/core';
import { Product } from '../shared/classes/product';
import { Subscription } from 'rxjs';
import { ApiMongoService } from '../shared/services/api-mongo.service';
@Component({
  selector: 'app-product-container',
  templateUrl: './product-container.component.html',
  styleUrls: ['./product-container.component.scss']
})
export class ProductContainerComponent {
  static ProductList:Product[] = [];
  productList:Product[] = [];
  private subscription!: Subscription;


  
  constructor(private apiMongoService: ApiMongoService) {
    this.subscription = this.apiMongoService.getProductList().subscribe((productList: Product[]) => {
      this.productList = productList;
      // Update charts or perform other actions based on the new productList
    });
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
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