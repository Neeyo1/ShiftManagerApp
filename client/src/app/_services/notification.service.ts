import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { Notification, NotificationDetailed } from '../_models/notification';
import { NotificationParams } from '../_models/notificationParams';
import { of, tap } from 'rxjs';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubsUrl;
  notificationCache = new Map();
  notificationDetailedCache = new Map();
  paginatedResult = signal<PaginatedResult<Notification[]> | null>(null);
  notificationParams = signal<NotificationParams>(new NotificationParams);
  unreadMessages = signal<number>(0);
  hubConnection?: HubConnection;
  private toastrService = inject(ToastrService);

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'notification', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('NewNotification', _ => {
      this.toastrService.info("New notification");
      this.unreadMessages.update(x => x + 1);
      this.notificationCache.clear();
    });
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(error => console.log(error))
    }
  }

  resetNotificationParams(){
    this.notificationParams.set(new NotificationParams);
  }

  getNotifications(){
    const response = this.notificationCache.get(Object.values(this.notificationParams()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);
    let params = setPaginationHeaders(this.notificationParams().pageNumber, this.notificationParams().pageSize)

    params = params.append("status", this.notificationParams().status as string);
    params = params.append("orderBy", this.notificationParams().orderBy as string);

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
        this.notificationDetailedCache.get(`notification-detailed-${id}`);

    if (notification) return of(notification);
    
    return this.http.get<NotificationDetailed>(this.baseUrl + `notifications/${id}`).pipe(
        tap(notif => {
            if (notif.isChanged){
              this.notificationCache.clear();
              this.unreadMessages.update(x => x - 1);
            }
            this.notificationDetailedCache.set(`notification-detailed-${id}`, notif);
        })
    )
  }

  createNotificationToAdmin(message: string){
    return this.http.post(this.baseUrl + "notifications", {message}).pipe(
      tap(() => {
        this.createNotification("admins");
      })
    );
  }

  async createNotification(group: string, departmentId?: number) {
    return this.hubConnection?.invoke('SendNotification', group, departmentId)
  }
}
