import { Component } from '@angular/core';
import { ApiMongoService } from '../shared/services/api-mongo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private apiMongoService: ApiMongoService) {}
  param:string = 'elgiganten';
  showSpinner:boolean = false;
  async callAPI(param:string) {
    this.viewProducts();
    this.showSpinner = true;
    await this.apiMongoService.getWebstoreProducts(param);
    this.showSpinner = false;
  }
  async viewProducts() {
    let frontpage = document.getElementById('frontpage');
    let products = document.getElementById('product-container')
    frontpage?.classList.replace('show', 'hide');
    products?.classList.replace('hide', 'show');
  }
  async viewDashboard() {
    let frontpage = document.getElementById('frontpage');
    let products = document.getElementById('product-container')
    frontpage?.classList.replace('hide', 'show');
    products?.classList.replace('show', 'hide');
  }
}
