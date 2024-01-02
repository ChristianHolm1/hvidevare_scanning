import { Component } from '@angular/core';
import { ApiMongoService } from '../shared/services/api-mongo.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(private apiMongoService: ApiMongoService) {}
  async dataToDashboard() {
    await this.apiMongoService.getWebstoreProducts("elgiganten");
    await this.apiMongoService.getWebstoreProducts("bilka");
    await this.apiMongoService.getWebstoreProducts("whiteaway");
  }
  async callAPI(param: string) {
    await this.apiMongoService.getWebstoreProducts(param);
    this.apiMongoService.sendProductList(); // Notify subscribers about the updated product list
  }
}
