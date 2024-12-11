import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../_services/notification.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterLink } from '@angular/router';
import { NotificationFilterComponent } from '../../offcanvas/notification-filter/notification-filter.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [FormsModule, PaginationModule, RouterLink, DatePipe],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css'
})
export class NotificationListComponent implements OnInit, OnDestroy{
  notificationService = inject(NotificationService);
  private offcanvasService = inject(NgbOffcanvas);

  ngOnInit(): void {
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.notificationService.paginatedResult.set(null);
  }

  loadNotifications(){
    this.notificationService.getNotifications();
  }

  pageChanged(event: any){
    if (this.notificationService.notificationParams().pageNumber != event.page){
      this.notificationService.notificationParams().pageNumber = event.page;
      this.loadNotifications();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  showOffcanvas() {
		this.offcanvasService.open(NotificationFilterComponent);
	}
}
