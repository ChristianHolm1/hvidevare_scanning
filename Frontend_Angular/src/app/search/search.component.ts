import { Component } from '@angular/core';
import { Product } from '../shared/classes/product';
import { ApiPuppeteerService } from '../shared/services/api-puppeteer.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  constructor(private apiPuppeteerService: ApiPuppeteerService) {}
  url:string = 'https://www.elgiganten.dk/hvidevarer/vask-tor?filter=PTLowestLevelNodeValue:Tørretumbler&filter=PTLowestLevelNodeValue:Vaskemaskine';
  productList: Product[] = [];
  showSpinner:boolean = false;
  async callAPI(url:string) {
    this.showSpinner = true;
    await this.apiPuppeteerService.getHtmlFromSite(url);
    this.showSpinner = false;
  }
}
