import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WorkRecord } from '../../_models/workRecord';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerComponent } from '../../_forms/date-picker/date-picker.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@Component({
  selector: 'app-work-record-modal',
  standalone: true,
  imports: [DatePickerComponent, TimepickerModule, ReactiveFormsModule],
  templateUrl: './work-record-modal.component.html',
  styleUrl: './work-record-modal.component.css'
})
export class WorkRecordModalComponent implements OnInit{
  bsModalRef = inject(BsModalRef);
  completed = false;
  workRecord?: WorkRecord;
  private fb = inject(FormBuilder);
  workRecordForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.workRecordForm = this.fb.group({
      startDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
    })
  }

  complete(){
    this.completed = true;
    this.bsModalRef.hide();
  }
}
