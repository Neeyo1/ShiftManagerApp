import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { EmployeeService } from '../../_services/employee.service';
import { DepartmentService } from '../../_services/department.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { Employee } from '../../_models/employee';
import { WorkShiftService } from '../../_services/workShift.service';
import { WorkRecordService } from '../../_services/workRecord.service';
import { WorkShiftParams } from '../../_models/workShiftParams';
import { WorkRecordParams } from '../../_models/workRecordParams';
import { Department } from '../../_models/department';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SummaryService } from '../../_services/summary.service';
import { Summary } from '../../_models/summary';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [TabsModule, PaginationModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.css'
})
export class EmployeeDetailComponent implements OnInit, OnDestroy{
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  accountService = inject(AccountService);
  employee = signal<Employee | null>(null);

  departmentService = inject(DepartmentService);
  workShiftService = inject(WorkShiftService);
  workRecordService = inject(WorkRecordService);
  summaryService = inject(SummaryService);
  department = signal<Department | null>(null);
  summary = signal<Summary | null>(null);
  month: number | null = null;
  year: number | null = null;
  private previousWorkShiftParams: WorkShiftParams | null = null;
  private previousWorkRecordParams: WorkRecordParams | null = null;

  ngOnInit(): void {
    this.loadEmployee();
  }

  ngOnDestroy(): void {
    if (this.previousWorkShiftParams){
      this.workShiftService.workShiftParams.set(this.previousWorkShiftParams);
    }
    if (this.previousWorkRecordParams){
      this.workRecordService.workRecordParams.set(this.previousWorkRecordParams);
    }
    this.workShiftService.paginatedResult.set(null);
    this.workRecordService.paginatedResult.set(null);
  }

  loadEmployee(){
    const employeeId = Number(this.route.snapshot.paramMap.get("id"));
    if (!employeeId) this.router.navigateByUrl("/not-found");;

    this.employeeService.getEmployee(employeeId).subscribe({
      next: employee => this.employee.set(employee)
    })
  }

  loadDepartment(departmentId: number){
    if (this.department()) return;
    this.departmentService.getDepartment(departmentId).subscribe({
      next: department => this.department.set(department)
    });
  }

  loadWorkShifts(){
    if (this.previousWorkShiftParams == null){
      this.previousWorkShiftParams = this.workShiftService.workShiftParams();
      const newParams = new WorkShiftParams;
      newParams.employeeId = this.employee()!.id;
      this.workShiftService.workShiftParams.set(newParams)
    }
    this.workShiftService.getWorkShifts();
  }

  loadWorkRecords(){
    if (this.previousWorkRecordParams == null){
      this.previousWorkRecordParams = this.workRecordService.workRecordParams();
      const newParams = new WorkRecordParams;
      newParams.employeeId = this.employee()!.id;
      this.workRecordService.workRecordParams.set(newParams)
    }
    this.workRecordService.getWorkRecords();
  }

  loadSummary(){
    if (!this.employee() || !this.month || !this.year) return;
    this.summaryService.getSummary(this.employee()!.id, this.year, this.month).subscribe({
      next: summary => this.summary.set(summary)
    });
  }

  pageChangedWorkShift(event: any){
    if (this.workShiftService.workShiftParams().pageNumber != event.page){
      this.workShiftService.workShiftParams().pageNumber = event.page;
      this.workShiftService.getWorkShifts()
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  pageChangedWorkRecord(event: any){
    if (this.workRecordService.workRecordParams().pageNumber != event.page){
      this.workRecordService.workRecordParams().pageNumber = event.page;
      this.workRecordService.getWorkRecords()
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
