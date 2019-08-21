import { Component, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js';
import { ApiServiceService } from './api-service.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'regression-demo';
  isLoading = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private apiServ: ApiServiceService) {
  }

  // one step ahead
  @ViewChild('cnv1', {static: false}) canvas1: ElementRef;
  // 200 forecast
  @ViewChild('cnv2', {static: false}) canvas2: ElementRef;
  // dynamic_forecast
  @ViewChild('cnv3', {static: false}) canvas3: ElementRef;

  defaultOpts: any = {
    cutoutPercentage: 70,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        // type: 'linear',
        ticks: {
          callback(tick, index, array) {
            return (index % 5) ? '' : tick;
          }
        }
      }]
    }
  };

  drawForecast(apiData, rawDataLabels, rawDataPoint, canvas: ElementRef) {
    const mapDataRaw = this.toPoints(rawDataLabels, rawDataPoint);
    const mapDataPredict = this.toPoints(apiData.data[0], apiData.data[1]);
    const mapDataUpper = this.toPoints(apiData.data[0], apiData.data[3]);
    const mapDataLower = this.toPoints(apiData.data[0], apiData.data[2]);
    const dataLabel = _.union(rawDataLabels, apiData.data[0]);
    const chartData: any = {
      labels: dataLabel,
      datasets: [
        // raw data
        {
          label: 'raw data',
          fill: false,
          lineTension: 0,
          borderColor: '#2424c9',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: mapDataRaw,
        },
        {
          label: 'regression',
          fill: false,
          lineTension: 0,
          borderColor: '#c93b30',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: mapDataPredict,
        },
        {
          label: 'upper bound',
          fill: 3,
          lineTension: 0,
          borderColor: '#72bce3',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: mapDataUpper,
        },
        {
          label: 'lower bound',
          fill: false,
          lineTension: 0,
          borderColor: '#72bce3',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: mapDataLower,
        }
      ]
    };

    const ctx = canvas.nativeElement.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: this.defaultOpts
    });
  }

  /**
   * convert dataset and label to points data
   * @param labels
   * @param dataSet
   */
  toPoints(labels: Array<any>, dataSet: Array<number>) {
    const points = dataSet.map((value, index, array) => {
      return {
        x: labels[index],
        y: value
      };
    });
    return points;
  }

  showReport(id) {
    this.isLoading = true;
    this.apiServ.getPlotCached().subscribe(
      val => {
        this.drawForecast(val.one_step_ahead, val.raw_data[0], val.raw_data[1], this.canvas1);
        this.drawForecast(val.dynamic_forecast, val.raw_data[0], val.raw_data[1], this.canvas2);
        this.drawForecast(val['200_forecast'], val.raw_data[0], val.raw_data[1], this.canvas3);
      }, error => {},
      () => {
        this.isLoading = false;
      }
    );
  }
}
