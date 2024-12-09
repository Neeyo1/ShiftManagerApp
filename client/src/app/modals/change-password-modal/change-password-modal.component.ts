import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.css'
})
export class ChangePasswordModalComponent implements OnInit{
  bsModalRef = inject(BsModalRef);
  completed = false;
  private fb = inject(FormBuilder);
  changePasswordForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12),
        this.hasNumber(), this.hasLowerCase(), this.hasUpperCase()]],
      confirmNewPassword: ['', [Validators.required, this.matchValues('newPassword')]]
    });
    this.changePasswordForm.controls['newPassword'].valueChanges.subscribe({
      next: () => this.changePasswordForm.controls['confirmNewPassword'].updateValueAndValidity()
    });
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {isMatching: true};
    }
  }

  hasNumber(): ValidatorFn{
    return (control: AbstractControl) => {
      return /\d/.test(control.value) === true ? null : {hasNumber: true};
    }
  }

  hasLowerCase(): ValidatorFn{
    return (control: AbstractControl) => {
      return /[a-z]/.test(control.value) === true ? null : {hasLowerCase: true};
    }
  }

  hasUpperCase(): ValidatorFn{
    return (control: AbstractControl) => {
      return /[A-Z]/.test(control.value) === true ? null : {hasUpperCase: true};
    }
  }

  complete(){
    this.completed = true;
    this.bsModalRef.hide();
  }
}
