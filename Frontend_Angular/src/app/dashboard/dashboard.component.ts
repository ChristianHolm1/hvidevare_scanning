import { Component, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { ApiMongoService } from '../shared/services/api-mongo.service';
import { Subscription } from 'rxjs';
import { Product } from '../shared/classes/product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements DoCheck {
  elgiganten_chart: any;
  bilka_chart: any;
  whiteaway_chart: any;
  totalNew: number = 0;
  totalOld: number = 0;
  totalInvalid: number = 0;
  chartList: any[] = [];
  private subscription!: Subscription;
  productLists: any[] = [];
  
  websiteList: string[] = ["elgiganten", "bilka", "whiteaway"];

  constructor(private apiMongoService: ApiMongoService) {
    this.subscription = this.apiMongoService.getProductList().subscribe((productList: Product[]) => {
      this.productLists.push(productList);
    });
  }

  ngDoCheck(): void {
    if(this.productLists.length == this.websiteList.length){
      for(let i=0; i<this.productLists.length; i++){
        this.totalOld += this.productLists[i].filter((product: Product) => product.productLabel == "OldLabel").length;
        this.totalNew += this.productLists[i].filter((product: Product) => product.productLabel == "NewLabel").length;
        this.totalInvalid += this.productLists[i].filter((product: Product) => product.productLabel == "invalid").length;
      }
      this.initCharts(this.productLists);
    }
  }
  
  initCharts(productLists: Array<Product>[]) {
    for(let i=0; i<productLists.length; i++){
      this.chartList.push(this.createChart(productLists[i], this.websiteList[i]));
    }
    console.log(this.chartList);
  }

  createChart(productList: Product[], website: string) {
    let list = [5,0,2];
    const data = {
      labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: list,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    };
    const chart = {
      type: 'doughnut',
      data: data,
    };
    return chart;
  }

   async ngOnInit() {
    
  }
}
