import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { Notification, NotificationDetailed } from '../_models/notification';
import { NotificationParams } from '../_models/notificationParams';
import { of, tap } from 'rxjs';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  notificationCache = new Map();
  paginatedResult = signal<PaginatedResult<Notification[]> | null>(null);
  notificationParams = signal<NotificationParams>(new NotificationParams);
  unreadMessages = signal<number>(0);

  resetNotificationParams(){
    this.notificationParams.set(new NotificationParams);
  }

  getNotifications(){
    const response = this.notificationCache.get(Object.values(this.notificationParams()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);
    let params = setPaginationHeaders(this.notificationParams().pageNumber, this.notificationParams().pageSize)

    params = params.append("status", this.notificationParams().status as string);

    return this.http.get<Notification[]>(this.baseUrl + "notifications", {observe: 'response', params}).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.notificationCache.set(Object.values(this.notificationParams()).join("-"), response);
      }
    });
  }

  getUnreadNotificationsCount(){
    let params = setPaginationHeaders(1,1);
    params = params.append("status", "unread");

    return this.http.get<Notification[]>(this.baseUrl + "notifications", {observe: 'response', params}).subscribe({
      next: response => {
        const pagination: Pagination = JSON.parse(response.headers.get('Pagination')!);
        this.unreadMessages.set(pagination.totalItems);
      }
    });
  }

  getNotification(id: number){
    const notification: NotificationDetailed = 
        this.notificationCache.get(`notification-detailed-${id}`);

    if (notification) return of(notification);
    
    return this.http.get<NotificationDetailed>(this.baseUrl + `notifications/${id}`).pipe(
        tap(notif => {
            this.notificationCache.set(`notification-detailed-${id}`, notif);
        })
    )
  }

  createNotification(){
    return this.http.post(this.baseUrl + "notifications", {}).pipe(
      tap(() => {
        this.notificationCache.clear();
      })
    );
  }
}
