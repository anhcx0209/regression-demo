import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  baseUrl = 'http://35.243.224.36:5000/data_analytics/SARMA_regression';

  constructor(private http: HttpClient) { }

  getPlotData(id) {
    const samples = [
      {
        index: "co2",
        time_field: "date",
        value_field: "co2"
      },
      {
        index: "co2",
        time_field: "date",
        value_field: "co2"
      }
    ];
    
    return this.http.post(this.baseUrl, samples[+id])
  }


}
