import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DepartmentService } from '../../_services/department.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { Department } from '../../_models/department';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { EmployeeParams } from '../../_models/employeeParams';
import { EmployeeService } from '../../_services/employee.service';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department-detail',
  standalone: true,
  imports: [TabsModule, RouterLink, PaginationModule, FormsModule],
  templateUrl: './department-detail.component.html',
  styleUrl: './department-detail.component.css'
})
export class DepartmentDetailComponent implements OnInit, OnDestroy{
  private departmentService = inject(DepartmentService);
  employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  accountService = inject(AccountService);
  department = signal<Department | null>(null);
  private previousEmployeeParams: EmployeeParams | null = null;

  ngOnInit(): void {
    this.loadDepartment();
  }

  ngOnDestroy(): void {
    if (this.previousEmployeeParams){
      this.employeeService.employeeParams.set(this.previousEmployeeParams);
    }
    this.employeeService.paginatedResult.set(null);
  }

  loadDepartment(){
    const departmentId = Number(this.route.snapshot.paramMap.get("id"));
    if (!departmentId) this.router.navigateByUrl("/not-found");;

    this.departmentService.getDepartment(departmentId).subscribe({
      next: department => this.department.set(department)
    })
  }

  loadEmployees(){
    if (this.previousEmployeeParams == null){
      this.previousEmployeeParams = this.employeeService.employeeParams();
      const newParams = new EmployeeParams;
      newParams.departmentId = this.department()!.id;
      this.employeeService.employeeParams.set(newParams)
    }
    this.employeeService.getEmployees();
  }

  pageChanged(event: any){
    if (this.employeeService.employeeParams().pageNumber != event.page){
      this.employeeService.employeeParams().pageNumber = event.page;
      this.employeeService.getEmployees()
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
