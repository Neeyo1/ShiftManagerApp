import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WorkShiftService } from '../../_services/workShift.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { WorkShift } from '../../_models/workShift';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../_services/modal.service';
import { DatePipe } from '@angular/common';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { WorkShiftFilterComponent } from '../../offcanvas/work-shift-filter/work-shift-filter.component';

@Component({
  selector: 'app-work-shift-list',
  standalone: true,
  imports: [RouterLink, PaginationModule, FormsModule, DatePipe],
  templateUrl: './work-shift-list.component.html',
  styleUrl: './work-shift-list.component.css'
})
export class WorkShiftListComponent implements OnInit, OnDestroy{
  workShiftService = inject(WorkShiftService);
  accountService = inject(AccountService);
  private toastrService = inject(ToastrService);
  private myModalService = inject(ModalService);
  private offcanvasService = inject(NgbOffcanvas);

  ngOnInit(): void {
    this.loadWorkShifts();
  }

  ngOnDestroy(): void {
    this.workShiftService.paginatedResult.set(null);
  }

  loadWorkShifts(){
    this.workShiftService.getWorkShifts();
  }

  createWorkShift(){
    this.myModalService.openCreateWorkShiftModal();
  }

  editWorkShift(workShift: WorkShift){
    this.myModalService.openEditWorkShiftModal(workShift);
  }

  deleteWorkShift(workShiftId: number){
    this.myModalService.openConfirmModal("work shift")?.subscribe({
      next: result => {
        if (result){
          this.workShiftService.deleteWorkShift(workShiftId).subscribe({
            next: _ => this.loadWorkShifts()
          });
        }
      }
    })
  }

  pageChanged(event: any){
    if (this.workShiftService.workShiftParams().pageNumber != event.page){
      this.workShiftService.workShiftParams().pageNumber = event.page;
      this.loadWorkShifts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  showOffcanvas() {
		this.offcanvasService.open(WorkShiftFilterComponent);
	}
}
