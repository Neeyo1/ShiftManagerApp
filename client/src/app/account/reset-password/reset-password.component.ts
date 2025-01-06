import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{
  private route = inject(ActivatedRoute);
  accountService = inject(AccountService);
  result = signal<boolean | undefined>(undefined);
  private fb = inject(FormBuilder);
  resetPasswordForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get("email");
    const token = this.route.snapshot.queryParamMap.get("token")?.replaceAll(" ", "+");
    if (email == null || token == null){
      this.result.set(false);
      return;
    }
    this.initializeForm(email, token);
  }

  initializeForm(email: string, token: string) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12),
        this.hasNumber(), this.hasLowerCase(), this.hasUpperCase()]],
      confirmNewPassword: ['', [Validators.required, this.matchValues('newPassword')]],
      email: [email, [Validators.required]],
      token: [token, [Validators.required]]
    })

    this.resetPasswordForm.controls['newPassword'].valueChanges.subscribe({
      next: () => this.resetPasswordForm.controls['confirmNewPassword'].updateValueAndValidity()
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { isPasswordMatching: true };
    }
  }

  hasNumber(): ValidatorFn {
    return (control: AbstractControl) => {
      return /\d/.test(control.value) === true ? null : { hasNumber: true };
    }
  }

  hasLowerCase(): ValidatorFn {
    return (control: AbstractControl) => {
      return /[a-z]/.test(control.value) === true ? null : { hasLowerCase: true };
    }
  }

  hasUpperCase(): ValidatorFn {
    return (control: AbstractControl) => {
      return /[A-Z]/.test(control.value) === true ? null : { hasUpperCase: true };
    }
  }

  resetPassword(){
    this.accountService.resetPassword(this.resetPasswordForm.value).subscribe({
      next: _ => this.result.set(true),
      error: _ => this.result.set(false)
    })
  }
}
