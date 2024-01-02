import { Component, DoCheck, OnChanges, SimpleChanges , ViewChild, ElementRef, AfterViewInit, AfterContentInit} from '@angular/core';
import { Product } from '../shared/classes/product';
import { ChartComponent } from '../chart/chart.component';
import { Subscription } from 'rxjs';
import { ApiMongoService } from '../shared/services/api-mongo.service';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-product-container',
  templateUrl: './product-container.component.html',
  styleUrls: ['./product-container.component.scss']
})
export class ProductContainerComponent implements DoCheck{
  productList: Product[] = [];
  private subscription!: Subscription;
  chartInstance: any;
  chartConfig: any = {};
  prevList: number = 0;
  chartDone: boolean = false;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private apiMongoService: ApiMongoService) {
    this.subscription = this.apiMongoService.getProductList().subscribe((productList: Product[]) => {
      this.productList = productList;
    });
    
  }
  



  ngDoCheck(): void {
    if(this.productList.length > 0 && this.prevList !== this.productList.length){
      this.prevList = this.productList.length;
      let websiteUrl = window.location.href.split("/")[4];
      this.chartConfig = this.createChart(this.productList, websiteUrl);
      this.chartDone = true;
    }
  }



  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showInvalid() {
    this.hideAll()
    this.showElement("invalid");
  }

  showOldLabel() {
    this.hideAll()
    this.showElement("old");
  }

  showNewLabel() {
    this.hideAll()
    this.showElement("new");
  }

  showAll() {
    this.showElement("new");
    this.showElement("invalid");
    this.showElement("old");
  }
  hideAll() {
    this.hideElement("new");
    this.hideElement("invalid");
    this.hideElement("old");
  }

  showElement(className: string) {
    let elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove("invisable");
    }
  }
  hideElement(className: string) {
    let elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add("invisable");
    }
  }


  private createChart(productList: Product[], website: string): any {
    // Example chart configuration
    const productData = this.getLabelData(productList);
    const chartConfig = {
      type: 'pie', // Example chart type (adjust as needed)
      data: {
        labels: ['Nye', 'Gamle', 'Ikke valide'],
        datasets: [{
          label: website,
          data: productData,
          hoverOffset: 4
        }]
      },
    };
    return chartConfig;
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