import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Manager } from '../../_models/manager';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';

@Component({
  selector: 'app-change-manager-modal',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './change-manager-modal.component.html',
  styleUrl: './change-manager-modal.component.css'
})
export class ChangeManagerModalComponent implements OnInit{
  bsModalRef = inject(BsModalRef);
  completed = false;
  managers?: Manager[];
  departmentId?: number;
  private fb = inject(FormBuilder);
  changeManagerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.changeManagerForm = this.fb.group({
      memberId: ['', [Validators.required]]
    })
  }

  complete(){
    this.completed = true;
    this.bsModalRef.hide();
  }
}
