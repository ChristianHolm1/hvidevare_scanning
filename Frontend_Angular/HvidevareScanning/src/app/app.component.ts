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
  result:string = '';
  results:Array<string> = [
    '1',
    '2',
    '3',
    '4',
  ]

  async getHtmlFromSite() {
    try {
       const response = await axios.post("http://localhost:3000/scrape", {
        website: this.url,
        
  });
      console.log(response.data);
      this.result = JSON.stringify(response.data);
    } catch (error:any) {
      console.error('Error fetching users:', error.message);
    }
  }
}
