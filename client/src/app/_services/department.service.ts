import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { Department } from '../_models/department';
import { DepartmentParams } from '../_models/departmentParams';
import { of, tap } from 'rxjs';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  departmentCache = new Map();
  paginatedResult = signal<PaginatedResult<Department[]> | null>(null);
  departmentParams = signal<DepartmentParams>(new DepartmentParams);
  myDepartment = signal<Department | null>(null);

  resetDepartmentParams(){
    this.departmentParams.set(new DepartmentParams);
  }

  getDepartments(){
    const response = this.departmentCache.get(Object.values(this.departmentParams()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);
    let params = setPaginationHeaders(this.departmentParams().pageNumber, this.departmentParams().pageSize)

    if (this.departmentParams().departmentId != null){
      params = params.append("departmentId", this.departmentParams().departmentId!);
    }
    params = params.append("name", this.departmentParams().name as string);
    params = params.append("orderBy", this.departmentParams().orderBy as string);

    return this.http.get<Department[]>(this.baseUrl + "departments", {observe: 'response', params}).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.departmentCache.set(Object.values(this.departmentParams()).join("-"), response);
      }
    });
  }

  getDepartment(id: number){
    const department: Department = [...this.departmentCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((g: Department) => g.id == id);

    if (department) return of(department);
    
    return this.http.get<Department>(this.baseUrl + `departments/${id}`);
  }

  createDepartment(model: any){
    return this.http.post<Department>(this.baseUrl + "departments", model).pipe(
      tap(() => {
        this.departmentCache.clear();
      })
    );
  }

  editDepartment(departmentId: number, model: any){
    return this.http.put<Department>(this.baseUrl + `departments/${departmentId}`, model).pipe(
      tap(() => {
        this.departmentCache.clear();
      })
    );
  }

  deleteDepartment(departmentId: number){
    return this.http.delete(this.baseUrl + `departments/${departmentId}`).pipe(
      tap(() => {
        this.departmentCache.clear();
      })
    );
  }

  addManager(departmentId: number, managerId: number){
    return this.http.post(this.baseUrl + `departments/${departmentId}/add-manager/${managerId}`, {}).pipe(
      tap(() => {
        this.departmentCache.clear();
      })
    );
  }

  removeManager(departmentId: number, managerId: number){
    return this.http.post(this.baseUrl + `departments/${departmentId}/remove-manager/${managerId}`, {}).pipe(
      tap(() => {
        this.departmentCache.clear();
      })
    );
  }
}

