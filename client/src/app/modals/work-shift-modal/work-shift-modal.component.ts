import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WorkShift } from '../../_models/workShift';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { DatePickerComponent } from '../../_forms/date-picker/date-picker.component';

@Component({
  selector: 'app-work-shift-modal',
  standalone: true,
  imports: [TextInputComponent, DatePickerComponent, ReactiveFormsModule],
  templateUrl: './work-shift-modal.component.html',
  styleUrl: './work-shift-modal.component.css'
})
export class WorkShiftModalComponent implements OnInit{
  bsModalRef = inject(BsModalRef);
  completed = false;
  workShift?: WorkShift;
  private fb = inject(FormBuilder);
  workShiftForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    if (!this.workShift){
      this.workShiftForm = this.fb.group({
        dateFrom: ['', [Validators.required]],
        dateTo: ['', [Validators.required]],
        startHour: ['', [Validators.required, Validators.min(0), Validators.max(23)]],
        startMinute: ['', [Validators.required, Validators.min(0), Validators.max(59)]],
        shiftLength: [8, [Validators.required, Validators.min(1), Validators.max(12)]],
        employeeId: ['', [Validators.required]]
      })
    } else{
      this.workShiftForm = this.fb.group({
        startDate: ['', [Validators.required]],
        startHour: [this.workShift.start.getUTCHours, 
          [Validators.required, Validators.min(0), Validators.max(23)]],
        startMinute: [this.workShift.start.getUTCMinutes, 
          [Validators.required, Validators.min(0), Validators.max(59)]],
        shiftLength: [8, [Validators.required, Validators.min(1), Validators.max(12)]],
        employeeId: [this.workShift.employeeId, [Validators.required]]
      })
    }
  }

  complete(){
    this.completed = true;
    this.bsModalRef.hide();
  }
}
