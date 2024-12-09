import { Component, inject, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Employee } from '../../_models/employee';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';

@Component({
  selector: 'app-employee-modal',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './employee-modal.component.html',
  styleUrl: './employee-modal.component.css'
})
export class EmployeeModalComponent implements OnInit{
  bsModalRef = inject(BsModalRef);
  completed = false;
  employee?: Employee;
  private fb = inject(FormBuilder);
  employeeForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.employeeForm = this.fb.group({
      firstName: [this.employee?.firstName == null ? '' : this.employee.firstName, 
        [Validators.required, Validators.maxLength(24)]],
      lastName: [this.employee?.lastName == null ? '' : this.employee.lastName, 
        [Validators.required, Validators.maxLength(48)]],
      departmentId: [this.employee?.departmentId == null ? '' : this.employee.departmentId, 
        [Validators.required]],
    })
  }

  complete(){
    this.completed = true;
    this.bsModalRef.hide();
  }
}
