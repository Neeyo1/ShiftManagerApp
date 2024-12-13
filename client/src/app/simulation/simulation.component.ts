import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../_forms/text-input/text-input.component';
import { WorkRecordService } from '../_services/workRecord.service';
import { ToastrService } from 'ngx-toastr';
import { AlertModule } from 'ngx-bootstrap/alert'

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule, AlertModule],
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.css'
})
export class SimulationComponent implements OnInit{
  private fb = inject(FormBuilder);
  simulationForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  private workRecordService = inject(WorkRecordService);
  private toastrService = inject(ToastrService);

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.simulationForm = this.fb.group({
      employeeId: ['', [Validators.required]]
    })
  }

  simulate(){
    let employeeId = this.simulationForm.value['employeeId'];
    this.workRecordService.createWorkRecord(employeeId).subscribe({
      next: result => {
        if (result.end){
          this.toastrService.success(`Bye, you have spent ${Math.floor(result.minutesInWork/60)} hour(s) and ${result.minutesInWork%60} minute(s) in work`);
        } else{
          this.toastrService.success("Hello");
        }
      }
    })
  }
}
