import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Department } from '../../_models/department';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';

@Component({
  selector: 'app-department-modal',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './department-modal.component.html',
  styleUrl: './department-modal.component.css'
})
export class DepartmentModalComponent implements OnInit{
  bsModalRef = inject(BsModalRef);
  completed = false;
  department?: Department;
  private fb = inject(FormBuilder);
  departmentForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.departmentForm = this.fb.group({
      name: [this.department?.name == null ? '' : this.department.name, 
        [Validators.required, Validators.minLength(5), Validators.maxLength(50)]]
    })
  }

  complete(){
    this.completed = true;
    this.bsModalRef.hide();
  }
}
