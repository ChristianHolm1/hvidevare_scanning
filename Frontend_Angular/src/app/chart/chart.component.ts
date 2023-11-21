import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { Input } from '@angular/core';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  @Input() chart: Chart = new Chart('', {});
 
  

  
}
