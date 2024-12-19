import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { AccountService } from './_services/account.service';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { NotificationService } from './_services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  private accountService = inject(AccountService);
  notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const userString = localStorage.getItem("user");
    if (!userString) return;
    const user = JSON.parse(userString);
    if (this.accountService.tokenExpired(user.token)){
      this.accountService.refreshToken(user.token).subscribe();
    } else{
      this.accountService.setCurrentUser(user);
    }
  }
}
