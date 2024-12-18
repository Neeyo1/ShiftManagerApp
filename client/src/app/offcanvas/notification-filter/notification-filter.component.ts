import { Component, inject } from '@angular/core';
import { NotificationService } from '../../_services/notification.service';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './notification-filter.component.html',
  styleUrl: './notification-filter.component.css'
})
export class NotificationFilterComponent {
  notificationService = inject(NotificationService);
  activeOffcanvas = inject(NgbActiveOffcanvas);
  statusList = [
    {value: 'read', display: 'Read'},
    {value: 'unread', display: 'Unread'},
    {value: 'all', display: 'All'}
  ];
  orderByList = [
    {value: 'received', display: 'Received ascending'},
    {value: 'received-desc', display: 'Received descending'},
    {value: 'read', display: 'Read ascending'},
    {value: 'read-desc', display: 'Read descending'}
  ];

  loadNotifications(){
    this.notificationService.getNotifications();
  }

  resetFilters(){
    this.notificationService.resetNotificationParams();
    this.loadNotifications();
  }

  closeOffcanvas(offcanvas: any){
    offcanvas.close();
  }
}
