import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { WorkShift } from '../_models/workShift';
import { WorkShiftParams } from '../_models/workShiftParams';
import { of, tap } from 'rxjs';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class WorkShiftService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  workShiftCache = new Map();
  paginatedResult = signal<PaginatedResult<WorkShift[]> | null>(null);
  workShiftParams = signal<WorkShiftParams>(new WorkShiftParams);

  resetWorkShiftParams(){
    this.workShiftParams.set(new WorkShiftParams);
  }

  getWorkShifts(){
    const response = this.workShiftCache.get(Object.values(this.workShiftParams()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);
    let params = setPaginationHeaders(this.workShiftParams().pageNumber, this.workShiftParams().pageSize)

    if (this.workShiftParams().workShiftId != null){
      params = params.append("workShiftId", this.workShiftParams().workShiftId!);
    }
    if (this.workShiftParams().employeeId != null){
      params = params.append("employeeId", this.workShiftParams().employeeId!);
    }
    params = params.append("dateFrom", this.workShiftParams().dateFrom as string);
    params = params.append("dateTo", this.workShiftParams().dateTo as string);
    params = params.append("orderBy", this.workShiftParams().orderBy as string);

    return this.http.get<WorkShift[]>(this.baseUrl + "workShifts", {observe: 'response', params}).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.workShiftCache.set(Object.values(this.workShiftParams()).join("-"), response);
      }
    });
  }

  getWorkShift(id: number){
    const workShift: WorkShift = [...this.workShiftCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((g: WorkShift) => g.id == id);

    if (workShift) return of(workShift);
    
    return this.http.get<WorkShift>(this.baseUrl + `workShifts/${id}`);
  }

  createWorkShift(model: any){
    return this.http.post<WorkShift>(this.baseUrl + "workShifts", model).pipe(
      tap(() => {
        this.workShiftCache.clear();
      })
    );
  }

  editWorkShift(workShiftId: number, model: any){
    return this.http.put<WorkShift>(this.baseUrl + `workShifts/${workShiftId}`, model).pipe(
      tap(() => {
        this.workShiftCache.clear();
      })
    );
  }

  deleteWorkShift(workShiftId: number){
    return this.http.delete(this.baseUrl + `workShifts/${workShiftId}`).pipe(
      tap(() => {
        this.workShiftCache.clear();
      })
    );
  }
}

