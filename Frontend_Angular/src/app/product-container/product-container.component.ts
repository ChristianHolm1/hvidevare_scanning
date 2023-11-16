import { Component } from '@angular/core';
import { Product } from '../shared/classes/product';
import Chart from 'chart.js/auto';
import { ApiMongoService } from '../shared/services/api-mongo.service';
@Component({
  selector: 'app-product-container',
  templateUrl: './product-container.component.html',
  styleUrls: ['./product-container.component.scss']
})
export class ProductContainerComponent {
  static ProductList:Product[] = [];
  productList:Product[] = [];
  elgiganten_chart_product: any;
  bilka_chart_product: any;
  whiteaway_chart_product: any;


  constructor(private apiMongoService: ApiMongoService) {}

  async initCharts(collectionName: string, canvasId: string) {
    const list = await this.apiMongoService.getChartStats(collectionName);
    const chart = new Chart(canvasId, {
      type: 'pie',
      data: {
        labels: ['Old', 'New', 'Invalid'],
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
    this.elgiganten_chart_product = await this.initCharts('elgiganten', 'elgiganten_canvas_product');
    this.bilka_chart_product = await this.initCharts('bilka', 'bilka_canvas_product');
    this.whiteaway_chart_product = await this.initCharts('whiteaway', 'whiteaway_canvas_product');
  }

  get staticProductList() { 
    if(ProductContainerComponent.ProductList.length) {
      this.productList = ProductContainerComponent.ProductList;
      return "";
    }
    else {
      return "";
    }
  }

  

  showInvalid(){
    this.hideAll()
    this.showElement("invalid");
  }

  showOldLabel(){
    this.hideAll()
    this.showElement("old");
  }

  showNewLabel(){
    this.hideAll()
    this.showElement("new");
  }

  showAll(){
    this.showElement("new");
    this.showElement("invalid");
    this.showElement("old");
  }
  hideAll(){
    this.hideElement("new");
    this.hideElement("invalid");
    this.hideElement("old");
  }

  showElement(className:string){
    let elements = document.getElementsByClassName(className);
    for(let i=0; i<elements.length; i++){
      elements[i].classList.remove("invisable");
    }
  }
  hideElement(className:string){
    let elements = document.getElementsByClassName(className);
    for(let i=0; i<elements.length; i++){
      elements[i].classList.add("invisable");
    }
  }
  

}