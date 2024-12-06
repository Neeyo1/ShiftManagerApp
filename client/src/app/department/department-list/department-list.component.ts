import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DepartmentService } from '../../_services/department.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Department } from '../../_models/department';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [FormsModule, RouterLink, PaginationModule],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent implements OnInit, OnDestroy{
  departmentService = inject(DepartmentService);
  accountService = inject(AccountService);
  private toastrService = inject(ToastrService);

  ngOnInit(): void {
    this.loadDepartments();
  }

  ngOnDestroy(): void {
    this.departmentService.paginatedResult.set(null);
  }

  loadDepartments(){
    this.departmentService.getDepartments();
  }

  createDepartment(){
    this.toastrService.info("create department modal");
  }

  editDepartment(department: Department){
    this.toastrService.info("edit department modal");
  }

  deleteDepartment(departmentId: number){
    this.toastrService.info("Delete modal")
  }

  resetFilters(){
    this.departmentService.resetDepartmentParams();
    this.loadDepartments();
  }

  pageChanged(event: any){
    if (this.departmentService.departmentParams().pageNumber != event.page){
      this.departmentService.departmentParams().pageNumber = event.page;
      this.loadDepartments();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  showOffcanvas() {
		this.toastrService.info("filtering offcanvas");
	}
}
