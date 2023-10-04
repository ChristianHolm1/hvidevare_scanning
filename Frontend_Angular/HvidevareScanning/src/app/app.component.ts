import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'HvidevareScanning';
  url:string = 'https://www.elgiganten.dk/product/hvidevarer/vask-tor/vaskemaskine/hisense-washing-machine-wf3q1043bw-white/624062';
  
  product: Reformatted = {
    title: '',
    price: '',
    image: '',
    specs: []
  };
  
  async getHtmlFromSite() {
    try {
      this.clearResults()
      const response = await axios.post("http://localhost:3000/scrape", {
        website: this.url,
      });
      this.product.title = response.data.title;
      this.product.image = response.data.image;
      for (const key in response.data.specs) {
        if (response.data.specs.hasOwnProperty(key)) {
          this.product.specs.push({ key, value: response.data.specs[key] });
        }
      }
    } catch (error:any) {
      console.error('Error fetching users:', error.message);
    }
  }

  clearResults() {
    this.product.title = '';
    this.product.specs = [];
  }
}

interface Reformatted {
  title: string;
  price: string;
  image: string;
  specs: { key: string; value: string }[];
}