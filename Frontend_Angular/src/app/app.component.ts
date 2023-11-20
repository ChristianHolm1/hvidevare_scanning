import { Component } from '@angular/core';
import { ApiMongoService } from '../app/shared/services/api-mongo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'HvidevareScanning';
  
  constructor(private apiMongoService: ApiMongoService) {}
  param:string = 'elgiganten';

  async callAPI(param:string) {
    await this.apiMongoService.getWebstoreProducts(param);
  }
}

