import { Component, inject, OnInit, signal } from '@angular/core';
import { WorkRecordService } from '../../_services/workRecord.service';
import { EmployeeService } from '../../_services/employee.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { WorkRecord } from '../../_models/workRecord';
import { Employee } from '../../_models/employee';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-work-record-detail',
  standalone: true,
  imports: [TabsModule, RouterLink, DatePipe],
  templateUrl: './work-record-detail.component.html',
  styleUrl: './work-record-detail.component.css'
})
export class WorkRecordDetailComponent implements OnInit{
  private workRecordService = inject(WorkRecordService);
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  accountService = inject(AccountService);
  workRecord = signal<WorkRecord | null>(null);
  employee = signal<Employee | null>(null);

  ngOnInit(): void {
    this.loadWorkRecord();
  }

  loadWorkRecord(){
    const workRecordId = Number(this.route.snapshot.paramMap.get("id"));
    if (!workRecordId) this.router.navigateByUrl("/not-found");;

    this.workRecordService.getWorkRecord(workRecordId).subscribe({
      next: workRecord => this.workRecord.set(workRecord)
    })
  }

  loadEmployee(employeeId: number){
    if (this.employee()) return;
    this.employeeService.getEmployee(employeeId).subscribe({
      next: employee => this.employee.set(employee)
    });
  }
}
