import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificationService } from '../../_services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationDetailed } from '../../_models/notification';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification-detail',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notification-detail.component.html',
  styleUrl: './notification-detail.component.css'
})
export class NotificationDetailComponent implements OnInit{
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  notification = signal<NotificationDetailed | null>(null);

  ngOnInit(): void {
    this.loadNotification();
  }

  loadNotification(){
    const notificationId = Number(this.route.snapshot.paramMap.get("id"));
    if (!notificationId) this.router.navigateByUrl("/not-found");;

    this.notificationService.getNotification(notificationId).subscribe({
      next: notification => this.notification.set(notification)
    })
  }
}

