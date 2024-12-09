import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AccountService } from './account.service';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordModalComponent } from '../modals/change-password-modal/change-password-modal.component';
import { DepartmentModalComponent } from '../modals/department-modal/department-modal.component';
import { DepartmentService } from './department.service';
import { Department } from '../_models/department';
import { EmployeeModalComponent } from '../modals/employee-modal/employee-modal.component';
import { EmployeeService } from './employee.service';
import { Employee } from '../_models/employee';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  bsModalRef?: BsModalRef;
  private modalService = inject(BsModalService);
  private accountService = inject(AccountService);
  private toastrService = inject(ToastrService);
  private departmentService = inject(DepartmentService);
  private employeeService = inject(EmployeeService);

  openChangePasswordModal(){
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false
      }
    };
    this.bsModalRef = this.modalService.show(ChangePasswordModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          const changePasswordForm = this.bsModalRef.content.changePasswordForm;

          this.accountService.changePassword(changePasswordForm.value).subscribe({
            next: _ => this.toastrService.success("Password changed successfully")
          })
        }
      }
    })
  }

  openCreateDepartmentModal(){
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false
      }
    };
    this.bsModalRef = this.modalService.show(DepartmentModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          let departmentForm = this.bsModalRef.content.departmentForm;
          this.departmentService.createDepartment(departmentForm.value).subscribe({
            next: _ => this.departmentService.getDepartments()
          })
        }
      }
    })
  }

  openEditDepartmentModal(department: Department){
    if (department == null) return;
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false,
        department: department
      }
    };
    this.bsModalRef = this.modalService.show(DepartmentModalComponent, config);
    return this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          let departmentForm = this.bsModalRef.content.departmentForm;
          this.departmentService.editDepartment(department.id, departmentForm.value).subscribe({
            next: _ => this.departmentService.getDepartments()
          })
        }
      }
    })
  }

  openCreateEmployeeModal(){
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false
      }
    };
    this.bsModalRef = this.modalService.show(EmployeeModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          let employeeForm = this.bsModalRef.content.employeeForm;
          this.employeeService.createEmployee(employeeForm.value).subscribe({
            next: _ => this.employeeService.getEmployees()
          })
        }
      }
    })
  }

  openEditEmployeeModal(employee: Employee){
    if (employee == null) return;
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false,
        employee: employee
      }
    };
    this.bsModalRef = this.modalService.show(EmployeeModalComponent, config);
    return this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          let employeeForm = this.bsModalRef.content.employeeForm;
          this.employeeService.editEmployee(employee.id, employeeForm.value).subscribe({
            next: _ => this.employeeService.getEmployees()
          })
        }
      }
    })
  }
}
