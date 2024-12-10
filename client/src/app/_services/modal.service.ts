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
import { WorkShiftModalComponent } from '../modals/work-shift-modal/work-shift-modal.component';
import { WorkShiftService } from './workShift.service';
import { WorkShift } from '../_models/workShift';
import { WorkRecord } from '../_models/workRecord';
import { WorkRecordModalComponent } from '../modals/work-record-modal/work-record-modal.component';
import { WorkRecordService } from './workRecord.service';
import { map } from 'rxjs';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';

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
  private workShiftService = inject(WorkShiftService);
  private workRecordService = inject(WorkRecordService);

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

  openCreateWorkShiftModal(){
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false
      }
    };
    this.bsModalRef = this.modalService.show(WorkShiftModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          let workShiftForm = this.bsModalRef.content.workShiftForm;
          let time = new Date();
          time.setHours(workShiftForm.value['startHour'], workShiftForm.value['startMinute'], 0);
          workShiftForm.value['start'] = time.toISOString().slice(11,16);
          workShiftForm.value['dateFrom'] = workShiftForm.value['dateFrom'].toISOString().slice(0,10);
          workShiftForm.value['dateTo'] = workShiftForm.value['dateTo'].toISOString().slice(0,10);
          this.workShiftService.createWorkShift(workShiftForm.value).subscribe({
            next: _ => this.workShiftService.getWorkShifts()
          })
        }
      }
    })
  }

  openEditWorkShiftModal(workShift: WorkShift){
    if (workShift == null) return;
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false,
        workShift: workShift
      }
    };
    this.bsModalRef = this.modalService.show(WorkShiftModalComponent, config);
    return this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          let workShiftForm = this.bsModalRef.content.workShiftForm;
          let time = new Date(workShiftForm.value['startDate']);
          time.setHours(workShiftForm.value['startHour'], workShiftForm.value['startMinute'], 0);
          workShiftForm.value['start'] = time.toISOString();
          this.workShiftService.editWorkShift(workShift.id, workShiftForm.value).subscribe({
            next: _ => this.workShiftService.getWorkShifts()
          })
        }
      }
    })
  }

  openEditWorkRecordModal(workRecord: WorkRecord){
    if (workRecord == null) return;
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false,
        workRecord: workRecord
      }
    };
    this.bsModalRef = this.modalService.show(WorkRecordModalComponent, config);
    return this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          let workRecordForm = this.bsModalRef.content.workRecordForm;
          let start = new Date(workRecordForm.value['startDate']);
          start.setHours(workRecordForm.value['startHour'], workRecordForm.value['startMinute'], 0);
          workRecordForm.value['start'] = start.toISOString();
          let end = new Date(workRecordForm.value['endDate']);
          end.setHours(workRecordForm.value['endHour'], workRecordForm.value['endMinute'], 0);
          workRecordForm.value['end'] = end.toISOString();
          this.workRecordService.editWorkRecord(workRecord.id, workRecordForm.value).subscribe({
            next: _ => this.workRecordService.getWorkRecords()
          })
        }
      }
    })
  }

  openConfirmModal(name: string){
    const config: ModalOptions = {
      initialState: {
        result: false,
        name: name
      }
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, config);
    return this.bsModalRef.onHidden?.pipe(
      map(() => {
        if (this.bsModalRef?.content){
          return this.bsModalRef.content.result;
        } else{
          return false;
        }
      })
    )
  }
}
