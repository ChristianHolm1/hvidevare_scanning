import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges, AfterViewInit {
  @Input() chartConfig: any = {};
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  chartInstance: Chart | null = null;
  chartData: any[] = [];
  chartName: string = "";

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["chartConfig"] && changes["chartConfig"].currentValue) {
      this.renderChart();
    }
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  private renderChart(): void {
    const canvas = this.chartCanvas.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (this.chartInstance) {
          this.chartInstance.destroy();
        }
        this.chartInstance = new Chart(ctx, {
          type: this.chartConfig.type,
          data: this.chartConfig.data,
          options: {
            responsive: false // Disables responsiveness
        }
        });
        this.chartData = this.chartConfig.data.datasets[0].data;
        this.chartName = this.chartConfig.data.datasets[0].label;
        
        
      }
    }
  }
}
