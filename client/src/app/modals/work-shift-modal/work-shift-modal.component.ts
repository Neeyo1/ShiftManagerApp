import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WorkShift } from '../../_models/workShift';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { DatePickerComponent } from '../../_forms/date-picker/date-picker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@Component({
  selector: 'app-work-shift-modal',
  standalone: true,
  imports: [TextInputComponent, DatePickerComponent, ReactiveFormsModule, BsDatepickerModule, TimepickerModule],
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
        employeeId: ['', [Validators.required]],
        dateRange: ['', [Validators.required]],
        start: ['', [Validators.required]],
        shiftLength: [8, [Validators.required, Validators.min(1), Validators.max(12)]]
      })
    } else{
      this.workShiftForm = this.fb.group({
        startDate: ['', [Validators.required]],
        start: ['', [Validators.required]],
        shiftLength: [8, [Validators.required, Validators.min(1), Validators.max(12)]]
      })
    }
  }

  complete(){
    this.completed = true;
    this.bsModalRef.hide();
  }
}
