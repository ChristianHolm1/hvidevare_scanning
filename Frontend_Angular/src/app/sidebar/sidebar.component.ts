import { Component } from '@angular/core';
import { ApiMongoService } from '../shared/services/api-mongo.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(private apiMongoService: ApiMongoService) {}
  param:string = 'elgiganten';

  async callAPI(param:string) {
    await this.apiMongoService.getWebstoreProducts(param);
  }
}
