import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DepartmentService } from '../../_services/department.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Department } from '../../_models/department';
import { ModalService } from '../../_services/modal.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentFilterComponent } from '../../offcanvas/department-filter/department-filter.component';

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
  private myModalService = inject(ModalService);
  private offcanvasService = inject(NgbOffcanvas);

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
    this.myModalService.openCreateDepartmentModal();
  }

  editDepartment(department: Department){
    this.myModalService.openEditDepartmentModal(department);
  }

  deleteDepartment(departmentId: number){
    this.toastrService.info("Delete modal")
  }

  pageChanged(event: any){
    if (this.departmentService.departmentParams().pageNumber != event.page){
      this.departmentService.departmentParams().pageNumber = event.page;
      this.loadDepartments();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  showOffcanvas() {
		this.offcanvasService.open(DepartmentFilterComponent);
	}
}
