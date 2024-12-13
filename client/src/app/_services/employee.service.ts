import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { Employee } from '../_models/employee';
import { EmployeeParams } from '../_models/employeeParams';
import { of, tap } from 'rxjs';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  employeeCache = new Map();
  paginatedResult = signal<PaginatedResult<Employee[]> | null>(null);
  employeeParams = signal<EmployeeParams>(new EmployeeParams);

  resetEmployeeParams(){
    this.employeeParams.set(new EmployeeParams);
  }

  getEmployees(){
    const response = this.employeeCache.get(Object.values(this.employeeParams()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);
    let params = setPaginationHeaders(this.employeeParams().pageNumber, this.employeeParams().pageSize)

    if (this.employeeParams().employeeId != null){
      params = params.append("employeeId", this.employeeParams().employeeId!);
    }
    if (this.employeeParams().departmentId != null){
      params = params.append("departmentId", this.employeeParams().departmentId!);
    }
    params = params.append("firstName", this.employeeParams().firstName as string);
    params = params.append("lastName", this.employeeParams().lastName as string);
    params = params.append("status", this.employeeParams().status as string);
    params = params.append("orderBy", this.employeeParams().orderBy as string);

    return this.http.get<Employee[]>(this.baseUrl + "employees", {observe: 'response', params}).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.employeeCache.set(Object.values(this.employeeParams()).join("-"), response);
      }
    });
  }

  getEmployee(id: number){
    const employee: Employee = [...this.employeeCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((g: Employee) => g.id == id);

    if (employee) return of(employee);
    
    return this.http.get<Employee>(this.baseUrl + `employees/${id}`);
  }

  createEmployee(model: any){
    return this.http.post<Employee>(this.baseUrl + "employees", model).pipe(
      tap(() => {
        this.employeeCache.clear();
      })
    );
  }

  editEmployee(employeeId: number, model: any){
    return this.http.put<Employee>(this.baseUrl + `employees/${employeeId}`, model).pipe(
      tap(() => {
        this.employeeCache.clear();
      })
    );
  }

  deleteEmployee(employeeId: number){
    return this.http.delete(this.baseUrl + `employees/${employeeId}`).pipe(
      tap(() => {
        this.employeeCache.clear();
      })
    );
  }

  activeEmployee(employeeId: number){
    return this.http.post(this.baseUrl + `employees/${employeeId}/active`, {}).pipe(
      tap(() => {
        this.employeeCache.clear();
      })
    );
  }

  deactiveEmployee(employeeId: number){
    return this.http.post(this.baseUrl + `employees/${employeeId}/deactive`, {}).pipe(
      tap(() => {
        this.employeeCache.clear();
      })
    );
  }
}

