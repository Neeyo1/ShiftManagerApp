import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { NotificationService } from './notification.service';
import { DepartmentService } from './department.service';
import { EmployeeService } from './employee.service';
import { MemberService } from './member.service';
import { WorkRecordService } from './workRecord.service';
import { WorkShiftService } from './workShift.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private departmentService = inject(DepartmentService);
  private employeeService = inject(EmployeeService);
  private memberService = inject(MemberService);
  private workRecordService = inject(WorkRecordService);
  private workShiftService = inject(WorkShiftService);
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);
  roles = computed(() => {
    const user = this.currentUser();
    if (user && user.token){
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [role];
    }
    return [];
  })

  login(model: any){
    return this.http.post<User>(this.baseUrl + "account/login", model, {withCredentials: true}).pipe(
      map(user => {
        if (user){
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl + "account/register", model).pipe(
      map(user => {
        if (user){
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  logout(){
    localStorage.removeItem("user");
    this.currentUser.set(null);
    this.resetAllParams();
    this.notificationService.stopHubConnection();
  }

  setCurrentUser(user: User){
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUser.set(user);
    this.notificationService.getUnreadNotificationsCount();
    if (this.roles().includes("Manager")){
      this.notificationService.createHubConnection(user)
    }
  }

  changePassword(model: any){
    return this.http.post<User>(this.baseUrl + "account/change-password", model, {withCredentials: true}).pipe(
      map(user => {
        if (user){
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  refreshToken(token: string){
    return this.http.post<User>(this.baseUrl + "account/refresh", {token}, {withCredentials: true}).pipe(
      map(user => {
        if (user){
          this.setCurrentUser(user);
          this.notificationService.getUnreadNotificationsCount();
        }
        return user;
      }),
      catchError((error) => {
        this.logout();
        throw error;
      })
    )
  }

  resetAllParams(){
    this.notificationService.notificationCache.clear();
    this.notificationService.notificationDetailedCache.clear();
    this.notificationService.resetNotificationParams();
    this.notificationService.unreadMessages.set(0);
    this.departmentService.departmentCache.clear();
    this.departmentService.resetDepartmentParams();
    this.employeeService.employeeCache.clear();
    this.employeeService.resetEmployeeParams();
    this.memberService.memberCache.clear();
    this.memberService.resetMemberParams();
    this.workRecordService.workRecordCache.clear();
    this.workRecordService.resetWorkRecordParams();
    this.workShiftService.workShiftCache.clear();
    this.workShiftService.resetWorkShiftParams();
  }
}
