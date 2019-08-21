import { Component, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js';
import { ApiServiceService } from './api-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'regression-demo';

  constructor(@Inject(PLATFORM_ID) private platformId: any, private apiServ: ApiServiceService) { }

  @ViewChild('mycanvas', { static: false }) canvas: ElementRef;

  labels = ['Germany', 'France', 'USA', 'India', 'Italy', 'China'];
  backgroundColor = ['#009688', '#2196F3', '#9C27B0', '#00BCD4', '#F44336', '#FF9800'];
  data = [1012, 1656, 1132, 1025, 655, 453].sort((a, b) => b - a);
  total = this.data.reduce((pv, cv) => pv + cv, 0);

  chartData: any = {
    labels: this.labels,
    datasets: [
      {
        backgroundColor: this.backgroundColor,
        borderColor: 'transparent',
        data: this.data,
      }
    ],
    options: {
      elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      }
    }
  };

  showReport(id) {
    console.log(id);
    this.apiServ.getPlotData(id).subscribe(
      val => {
        this.labels = val.raw_data[0];
        this.data = val.raw_data[1];

        if (isPlatformBrowser(this.platformId)) {
          const ctx = this.canvas.nativeElement.getContext('2d');

          const chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: this.chartData,

            // Configuration options go here
            options: {
              cutoutPercentage: 70,
              legend: {
                display: false
              }
            }
          });
        }
      }
    )
  }
}
