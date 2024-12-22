import { Component, inject } from '@angular/core';
import { DepartmentService } from '../_services/department.service';
import { AccountService } from '../_services/account.service';
import { RouterLink } from '@angular/router';
import { ModalService } from '../_services/modal.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  accountService = inject(AccountService);
  departmentService = inject(DepartmentService);
  private myModalService = inject(ModalService);
  private notificationService = inject(NotificationService);

  createWorkShift(){
    this.myModalService.openCreateWorkShiftModal();
  }
  
  sendNotification() {
    this.notificationService.createNotificationToAdmin("Test message").subscribe();
  }
}
