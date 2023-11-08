import { Component } from '@angular/core';
import { Product } from '../shared/classes/product';
import { ApiMongoService } from '../shared/services/api-mongo.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  constructor(private apiMongoService: ApiMongoService) {}
  param:string = 'elgiganten';
  productList: Product[] = [];
  showSpinner:boolean = false;
  async callAPI(param:string) {
    this.showSpinner = true;
    await this.apiMongoService.getWebstoreProducts(param);
    this.showSpinner = false;
  }
}
