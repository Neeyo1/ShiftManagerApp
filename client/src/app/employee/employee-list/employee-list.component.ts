import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../_services/employee.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../../_models/employee';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../_services/modal.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeFilterComponent } from '../../offcanvas/employee-filter/employee-filter.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [RouterLink, PaginationModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit, OnDestroy{
  employeeService = inject(EmployeeService);
  accountService = inject(AccountService);
  private toastrService = inject(ToastrService);
  private myModalService = inject(ModalService);
  private offcanvasService = inject(NgbOffcanvas);

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.employeeService.paginatedResult.set(null);
  }

  loadEmployees(){
    this.employeeService.getEmployees();
  }

  createEmployee(){
    this.myModalService.openCreateEmployeeModal();
  }

  editEmployee(employee: Employee){
    this.myModalService.openEditEmployeeModal(employee);
  }

  deleteEmployee(employeeId: number){
    this.toastrService.info("Delete modal")
  }

  activeEmployee(employeeId: number){
    this.employeeService.activeEmployee(employeeId).subscribe({
      next: _ => this.loadEmployees()
    })
  }

  deactiveEmployee(employeeId: number){
    this.employeeService.deactiveEmployee(employeeId).subscribe({
      next: _ => this.loadEmployees()
    })
  }

  pageChanged(event: any){
    if (this.employeeService.employeeParams().pageNumber != event.page){
      this.employeeService.employeeParams().pageNumber = event.page;
      this.loadEmployees();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  showOffcanvas() {
		this.offcanvasService.open(EmployeeFilterComponent);
	}
}
