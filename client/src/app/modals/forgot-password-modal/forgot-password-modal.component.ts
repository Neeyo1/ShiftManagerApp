import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';

@Component({
  selector: 'app-forgot-password-modal',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './forgot-password-modal.component.html',
  styleUrl: './forgot-password-modal.component.css'
})
export class ForgotPasswordModalComponent implements OnInit{
  bsModalRef = inject(BsModalRef);
  completed = false;
  forceChange = false;
  private fb = inject(FormBuilder);
  forgotPasswordForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(100), Validators.email]]
    });
  }

  complete(){
    this.completed = true;
    this.bsModalRef.hide();
  }
}
