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
    this.showSpinner = true;
    await this.apiMongoService.getWebstoreProducts(param);
    this.showSpinner = false;
  }
}
