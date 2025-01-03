import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';

@Component({
  selector: 'app-member-modal',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './member-modal.component.html',
  styleUrl: './member-modal.component.css'
})
export class MemberModalComponent implements OnInit{
  bsModalRef = inject(BsModalRef);
  completed = false;
  private fb = inject(FormBuilder);
  memberForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.memberForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]],
      firstName: ['', [Validators.required, Validators.maxLength(24)]],
      lastName: ['', [Validators.required, Validators.maxLength(48)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24),
        this.hasNumber(), this.hasLowerCase(), this.hasUpperCase()]],
      confirmPassword: ['', [Validators.required, this.matchPasswordValues('password')]],
      email: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
      confirmEmail: ['', [Validators.required, this.matchEmailValues('email')]],
    })
    this.memberForm.controls['password'].valueChanges.subscribe({
      next: () => this.memberForm.controls['confirmPassword'].updateValueAndValidity()
    })
    this.memberForm.controls['email'].valueChanges.subscribe({
      next: () => this.memberForm.controls['confirmEmail'].updateValueAndValidity()
    })
  }

  matchPasswordValues(matchTo: string): ValidatorFn{
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {isPasswordMatching: true};
    }
  }

  matchEmailValues(matchTo: string): ValidatorFn{
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {isEmailMatching: true};
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
