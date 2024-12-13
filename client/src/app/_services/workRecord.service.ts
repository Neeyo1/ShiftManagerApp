import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { WorkRecord } from '../_models/workRecord';
import { WorkRecordParams } from '../_models/workRecordParams';
import { of, tap } from 'rxjs';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class WorkRecordService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  workRecordCache = new Map();
  paginatedResult = signal<PaginatedResult<WorkRecord[]> | null>(null);
  workRecordParams = signal<WorkRecordParams>(new WorkRecordParams);

  resetWorkRecordParams(){
    this.workRecordParams.set(new WorkRecordParams);
  }

  getWorkRecords(){
    const response = this.workRecordCache.get(Object.values(this.workRecordParams()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);
    let params = setPaginationHeaders(this.workRecordParams().pageNumber, this.workRecordParams().pageSize)

    if (this.workRecordParams().workRecordId != null){
      params = params.append("workRecordId", this.workRecordParams().workRecordId!);
    }
    if (this.workRecordParams().employeeId != null){
      params = params.append("employeeId", this.workRecordParams().employeeId!);
    }
    params = params.append("dateFrom", this.workRecordParams().dateFrom as string);
    params = params.append("dateTo", this.workRecordParams().dateTo as string);
    params = params.append("status", this.workRecordParams().status as string);
    params = params.append("orderBy", this.workRecordParams().orderBy as string);

    return this.http.get<WorkRecord[]>(this.baseUrl + "workRecords", {observe: 'response', params}).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.workRecordCache.set(Object.values(this.workRecordParams()).join("-"), response);
      }
    });
  }

  getWorkRecord(id: number){
    const workRecord: WorkRecord = [...this.workRecordCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((g: WorkRecord) => g.id == id);

    if (workRecord) return of(workRecord);
    
    return this.http.get<WorkRecord>(this.baseUrl + `workRecords/${id}`);
  }

  createWorkRecord(employeeId: number){
    return this.http.post<WorkRecord>(this.baseUrl + "workRecords?employeeId=" + employeeId, {}).pipe(
      tap(() => {
        this.workRecordCache.clear();
      })
    );
  }

  editWorkRecord(workRecordId: number, model: any){
    return this.http.put<WorkRecord>(this.baseUrl + `workRecords/${workRecordId}`, model).pipe(
      tap(() => {
        this.workRecordCache.clear();
      })
    );
  }

  deleteWorkRecord(workRecordId: number){
    return this.http.delete(this.baseUrl + `workRecords/${workRecordId}`).pipe(
      tap(() => {
        this.workRecordCache.clear();
      })
    );
  }
}

