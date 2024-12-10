import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { AccountService } from './_services/account.service';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { NotificationService } from './_services/notification.service';
import { NotificationParams } from './_models/notificationParams';

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
    if (this.tokenExpired(user.token)){
      localStorage.removeItem("user");
      return;
    }
    this.accountService.setCurrentUser(user);
    this.getUnreadMessages();
  }

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  getUnreadMessages(){
    this.notificationService.getUnreadNotificationsCount();
  }
}
