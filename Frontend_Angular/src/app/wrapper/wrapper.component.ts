import { Component } from '@angular/core';
import { ApiMongoService } from '../shared/services/api-mongo.service';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent {
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
    let dashboard = document.getElementById('dashboard');
    let products = document.getElementById('product-container');

    frontpage?.classList.replace('show', 'hide');
    dashboard?.classList.replace('show', 'hide');
    products?.classList.replace('hide', 'show');
  }
  async viewDashboard() {
    let frontpage = document.getElementById('frontpage');
    let dashboard = document.getElementById('dashboard');
    let products = document.getElementById('product-container');

    frontpage?.classList.replace('show', 'hide');
    products?.classList.replace('show', 'hide');
    dashboard?.classList.replace('hide', 'show');
  }
  async viewFrontpage() {
    let frontpage = document.getElementById('frontpage');
    let dashboard = document.getElementById('dashboard');
    let products = document.getElementById('product-container');

    products?.classList.replace('show', 'hide');
    dashboard?.classList.replace('show', 'hide');
    frontpage?.classList.replace('hide', 'show');
  }
}
