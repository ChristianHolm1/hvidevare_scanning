import { Component, OnInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js/auto';
import { ApiMongoService } from '../shared/services/api-mongo.service';
import { Subscription } from 'rxjs';
import { Product } from '../shared/classes/product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalNew: number = 0;
  totalOld: number = 0;
  totalInvalid: number = 0;
  chartList: any[] = [];
  private subscription!: Subscription;
  productLists: any[] = [];
  websiteList: string[] = ["elgiganten", "bilka", "whiteaway"];
  static locked: boolean = false;

  constructor(private apiMongoService: ApiMongoService) { }

  ngOnInit(): void {
    this.subscription = this.apiMongoService.getProductList().subscribe((productList: Product[]) => {
      this.productLists.push(productList);
      this.updateDashboard();
    });
  }

  private updateDashboard(): void {
    if (!DashboardComponent.locked && this.productLists.length === this.websiteList.length) {
      this.calculateTotals();
      this.initCharts(this.productLists);
      DashboardComponent.locked = true;
    }
  }

  private calculateTotals(): void {
    for (let i = 0; i < this.productLists.length; i++) {
      this.totalOld += this.productLists[i].filter((product: Product) => product.productLabel === "OldLabel").length;
      this.totalNew += this.productLists[i].filter((product: Product) => product.productLabel === "NewLabel").length;
      this.totalInvalid += this.productLists[i].filter((product: Product) => product.productLabel === "invalid").length;
    }
  }

  private initCharts(productLists: Array<Product>[]): void {
    for (let i = 0; i < productLists.length; i++) {
      this.chartList.push(this.createChart(productLists[i], this.websiteList[i]));

    }
  }

  private createChart(productList: Product[], website: string): any {
    // Example chart configuration
    const productData = this.getLabelData(productList);
    const chartConfig = {
      type: 'pie', // Example chart type (adjust as needed)
      data: {
        labels: ['NewLabel', 'OldLabel', 'Invalid'],
        datasets: [{
          label: website,
          data: productData,
          hoverOffset: 4
        }]
      },
    };
    return chartConfig;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    DashboardComponent.locked = false;
  }
  getLabelData(productList: Product[]) {
    let newLabelCounter = 0;
    let oldLabelCounter = 0;
    let invalidCounter = 0;

    for (let i = 0; i < productList.length; i++) {
      switch (productList[i].productLabel) {
        case "NewLabel":
          newLabelCounter++;
          break;
        case "OldLabel":
          oldLabelCounter++;
          break;
        default:
          invalidCounter++;
          break;
      }
    }
    return [newLabelCounter, oldLabelCounter, invalidCounter];
  }

}

