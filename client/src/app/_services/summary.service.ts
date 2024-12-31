import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Summary } from '../_models/summary';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  summaryCache = new Map();

  getSummary(employeeId: number, year: number, month: number){
    const response = this.summaryCache.get(`${employeeId}-${year}-${month}`);
    if (response) return of(response);

    let params = new HttpParams;

    return this.http.get<Summary>(this.baseUrl + `summary/month?employeeId=${employeeId}&year=${year}&month=${month}`).pipe(
      tap(res => {
        this.summaryCache.set(`${employeeId}-${year}-${month}`, res);
      })
    );
  }
}
