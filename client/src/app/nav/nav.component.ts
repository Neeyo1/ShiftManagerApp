import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ModalService } from '../_services/modal.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  model: any = {};
  accountService = inject(AccountService);
  notificationService = inject(NotificationService);
  private router = inject(Router);
  private myModalService = inject(ModalService);

  login(){
    this.accountService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/'])});
      }
    })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl("/");
  }

  changePassword(){
    this.myModalService.openChangePasswordModal();
  }

  forgotPassword(){
    this.myModalService.openForgotPasswordModal();
  }
}
