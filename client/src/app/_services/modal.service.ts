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
import { MemberModalComponent } from '../modals/member-modal/member-modal.component';
import { MemberService } from './member.service';
import { ChangeManagerModalComponent } from '../modals/change-manager-modal/change-manager-modal.component';
import { Manager } from '../_models/manager';

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
  private memberService = inject(MemberService);

  openChangePasswordModal(memberId?: number){
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false,
        forceChange: memberId
      }
    };
    this.bsModalRef = this.modalService.show(ChangePasswordModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          const changePasswordForm = this.bsModalRef.content.changePasswordForm;

          if (memberId){
            this.memberService.editPassword(memberId, changePasswordForm.value).subscribe({
              next: _ => this.toastrService.success("Password changed successfully")
            })
          } else{
            this.accountService.changePassword(changePasswordForm.value).subscribe({
              next: _ => this.toastrService.success("Password changed successfully")
            })
          }
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
          this.employeeService.editEmployee(employee, employeeForm.value).subscribe({
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
          workShiftForm.value['start'] = workShiftForm.value['start'].toISOString().slice(11,16);
          workShiftForm.value['dateFrom'] = workShiftForm.value['dateRange'][0].toISOString().slice(0,10);
          workShiftForm.value['dateTo'] = workShiftForm.value['dateRange'][1].toISOString().slice(0,10);
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
          let date = new Date(workShiftForm.value['startDate']);
          let time = workShiftForm.value['start'].toString().slice(16,21);
          date.setHours(Number(time.slice(0,2)), Number(time.slice(3,5)), 0);
          workShiftForm.value['start'] = date.toISOString();
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

          let startDate = new Date(workRecordForm.value['startDate']);
          let startTime = workRecordForm.value['startTime'].toString().slice(16,21);
          startDate.setHours(Number(startTime.slice(0,2)), Number(startTime.slice(3,5)), 0);

          let endDate = new Date(workRecordForm.value['endDate']);
          let endTime = workRecordForm.value['endTime'].toString().slice(16,21);
          endDate.setHours(Number(endTime.slice(0,2)), Number(endTime.slice(3,5)), 0);

          workRecordForm.value['start'] = startDate.toISOString();
          workRecordForm.value['end'] = endDate.toISOString();

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

  openCreateMemberModal(){
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false
      }
    };
    this.bsModalRef = this.modalService.show(MemberModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          let memberForm = this.bsModalRef.content.memberForm;
          this.memberService.createMember(memberForm.value).subscribe({
            next: _ => this.memberService.getMembers()
          })
        }
      }
    })
  }

  openAddManagerModal(departmentId: number){
    if (departmentId == null) return;
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false,
        departmentId: departmentId
      }
    };
    this.bsModalRef = this.modalService.show(ChangeManagerModalComponent, config);
    return this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          let memberId = this.bsModalRef.content.changeManagerForm.value['memberId'];
          this.departmentService.addManager(departmentId, memberId).subscribe({
            next: _ => this.departmentService.getDepartments()
          })
        }
      }
    })
  }

  openRemoveManagerModal(departmentId: number, managers: Manager[]){
    if (departmentId == null) return;
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false,
        departmentId: departmentId,
        managers: managers
      }
    };
    this.bsModalRef = this.modalService.show(ChangeManagerModalComponent, config);
    return this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          let memberId = this.bsModalRef.content.changeManagerForm.value['memberId'];
          this.departmentService.removeManager(departmentId, memberId).subscribe({
            next: _ => this.departmentService.getDepartments()
          })
        }
      }
    })
  }
}
