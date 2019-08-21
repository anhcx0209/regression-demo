import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CACHED_DATA } from './CachedData';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  baseUrl = 'http://35.243.224.36:5000/data_analytics/SARMA_regression';

  constructor(private http: HttpClient) {
  }

  getPlotData(id: number) {
    const samples = [
      {
        index: 'co2',
        time_field: 'date',
        value_field: 'co2'
      },
      {
        index: 'visit_customers',
        time_field: 'month',
        value_field: 'no_customer'
      }
    ];

    return this.http.post<any>(this.baseUrl, samples[id]);
  }

  getPlotCached(id: number) {
    return of(CACHED_DATA[id]);
  }


}
