import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HvidevareScanning';
  url:string = '';
  result:string = '';

  async getHtmlFromSite() {
    try {
      const response = await axios.get(this.url);
      this.result = JSON.stringify(response.data.facts[0]);
    } catch (error:any) {
      console.error('Error fetching users:', error.message);
    }
  }
}
