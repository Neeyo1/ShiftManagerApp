import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-confirm-account',
  standalone: true,
  imports: [],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.css'
})
export class ConfirmAccountComponent implements OnInit{
  private route = inject(ActivatedRoute);
  accountService = inject(AccountService);
  result = signal<boolean | undefined>(undefined);
  model: any;
  validationErrors: any[] | undefined;

  ngOnInit(): void {
    this.confirmAccount();
  }

  confirmAccount(){
    this.model = {
      email: this.route.snapshot.queryParamMap.get("email"),
      token: this.route.snapshot.queryParamMap.get("token")?.replaceAll(" ", "+")
    };

    if (this.model.email == null || this.model.token == null){
      this.result.set(false);
    }

    this.accountService.confirmAccount(this.model).subscribe({
      next: _ => this.result.set(true),
      error: error => {
        this.validationErrors = error.error;
        this.result.set(false)
      }
    })
  }
}
