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
  elgigantenList: number[] | undefined = [];
  
  constructor(private apiMongoService: ApiMongoService) {}
  
  async initCharts() {
    const list = await this.apiMongoService.getChartStats();
    this.updateList(list);
  }

  updateList(newList: number[]): void {
    this.elgigantenList = newList;
  }

  async ngOnInit() {
    await this.initCharts();

    this.elgiganten_chart = new Chart('elgiganten_canvas', {
      type: 'pie',
      data: {
        labels: ['New', 'Old', 'None'],
        datasets: [
          {
            label: '# of Votes',
            data: this.elgigantenList,
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
    
    this.bilka_chart = new Chart('bilka_canvas', {
      type: 'doughnut',
      data: {
        labels: ['New', 'Old', 'None'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3],
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
    
    this.whiteaway_chart = new Chart('whiteaway_canvas', {
      type: 'doughnut',
      data: {
        labels: ['New', 'Old', 'None'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3],
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
  }
}
