import { Component, inject, OnInit, signal } from '@angular/core';
import { WorkShiftService } from '../../_services/workShift.service';
import { EmployeeService } from '../../_services/employee.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { WorkShift } from '../../_models/workShift';
import { Employee } from '../../_models/employee';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-work-shift-detail',
  standalone: true,
  imports: [TabsModule, RouterLink],
  templateUrl: './work-shift-detail.component.html',
  styleUrl: './work-shift-detail.component.css'
})
export class WorkShiftDetailComponent implements OnInit{
  private workShiftService = inject(WorkShiftService);
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  accountService = inject(AccountService);
  workShift = signal<WorkShift | null>(null);
  employee = signal<Employee | null>(null);

  ngOnInit(): void {
    this.loadWorkShift();
  }

  loadWorkShift(){
    const workShiftId = Number(this.route.snapshot.paramMap.get("id"));
    if (!workShiftId) this.router.navigateByUrl("/not-found");;

    this.workShiftService.getWorkShift(workShiftId).subscribe({
      next: workShift => this.workShift.set(workShift)
    })
  }

  loadEmployee(employeeId: number){
    if (this.employee()) return;
    this.employeeService.getEmployee(employeeId).subscribe({
      next: employee => this.employee.set(employee)
    });
  }
}
