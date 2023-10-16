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
  url:string = 'https://www.elgiganten.dk/product/hvidevarer/vask-tor/vaskemaskine/hisense-washing-machine-wf3q1043bw-white/624062';
  product:Product = new Product("", "", "", []);
  async callAPI(url:string) {
    this.product = await this.apiPuppeteerService.getHtmlFromSite(url);
    console.log(this.product.title);
  }
}
