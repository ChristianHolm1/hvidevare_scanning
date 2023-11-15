import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { ApiMongoService } from '../shared/services/api-mongo.service';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.scss']
})
export class FrontpageComponent {
  elgiganten_chart: any;
  bilka_chart: any;
  whiteaway_chart: any;

  constructor(private apiMongoService: ApiMongoService) {}
  
  async initCharts(collectionName: string, canvasId: string) {
    const list = await this.apiMongoService.getChartStats(collectionName);
    const chart = new Chart(canvasId, {
      type: 'pie',
      data: {
        labels: ['New', 'Old', 'None'],
        datasets: [
          {
            label: '# of Votes',
            data: list,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return chart;
  }

  async ngOnInit() {
    this.elgiganten_chart = await this.initCharts('elgiganten', 'elgiganten_canvas');
    this.bilka_chart = await this.initCharts('bilka', 'bilka_canvas');
    this.whiteaway_chart = await this.initCharts('whiteaway', 'whiteaway_canvas');
  }
}
