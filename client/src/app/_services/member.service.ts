import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { Member } from '../_models/member';
import { MemberParams } from '../_models/memberParams';
import { of, tap } from 'rxjs';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  memberCache = new Map();
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  memberParams = signal<MemberParams>(new MemberParams);

  resetMemberParams(){
    this.memberParams.set(new MemberParams);
  }

  getMembers(){
    const response = this.memberCache.get(Object.values(this.memberParams()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);
    let params = setPaginationHeaders(this.memberParams().pageNumber, this.memberParams().pageSize)

    if (this.memberParams().memberId != null){
      params = params.append("memberId", this.memberParams().memberId!);
    }
    if (this.memberParams().departmentId != null){
      params = params.append("departmentId", this.memberParams().departmentId!);
    }
    params = params.append("firstName", this.memberParams().firstName as string);
    params = params.append("lastName", this.memberParams().lastName as string);
    params = params.append("status", this.memberParams().status as string);
    params = params.append("orderBy", this.memberParams().orderBy as string);

    return this.http.get<Member[]>(this.baseUrl + "users", {observe: 'response', params}).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.memberCache.set(Object.values(this.memberParams()).join("-"), response);
      }
    });
  }

  getMember(id: number){
    const member: Member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((g: Member) => g.id == id);

    if (member) return of(member);
    
    return this.http.get<Member>(this.baseUrl + `users/${id}`);
  }

  createMember(model: any){
    return this.http.post<Member>(this.baseUrl + "users", model).pipe(
      tap(() => {
        this.memberCache.clear();
      })
    );
  }

  editPassword(memberId: number, model: any){
    return this.http.put<Member>(this.baseUrl + `users/${memberId}`, model).pipe(
      tap(() => {
        this.memberCache.clear();
      })
    );
  }

  deleteMember(memberId: number){
    return this.http.delete(this.baseUrl + `users/${memberId}`).pipe(
      tap(() => {
        this.memberCache.clear();
      })
    );
  }
}
