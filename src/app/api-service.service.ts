import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CACHED_DATA } from './CachedData';
import { of, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  baseUrl = 'http://35.243.224.36:5000/data_analytics/SARMA_regression';

  constructor(private http: HttpClient) {
  }

  getPlotData(obj: any) {
    try {
      return this.http.post<any>(this.baseUrl, obj);
    } catch (error) {
      return throwError(error);
    }
  }

  getPlotCached(id: number) {
    return of(CACHED_DATA[id]);
  }

}
