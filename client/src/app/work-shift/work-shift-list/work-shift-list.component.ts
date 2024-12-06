import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WorkShiftService } from '../../_services/workShift.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { WorkShift } from '../../_models/workShift';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-work-shift-list',
  standalone: true,
  imports: [RouterLink, PaginationModule, FormsModule],
  templateUrl: './work-shift-list.component.html',
  styleUrl: './work-shift-list.component.css'
})
export class WorkShiftListComponent implements OnInit, OnDestroy{
  workShiftService = inject(WorkShiftService);
  accountService = inject(AccountService);
  private toastrService = inject(ToastrService);

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
    this.toastrService.info("create workShift modal");
  }

  editWorkShift(workShift: WorkShift){
    this.toastrService.info("edit workShift modal");
  }

  deleteWorkShift(workShiftId: number){
    this.toastrService.info("Delete modal")
  }

  resetFilters(){
    this.workShiftService.resetWorkShiftParams();
    this.loadWorkShifts();
  }

  pageChanged(event: any){
    if (this.workShiftService.workShiftParams().pageNumber != event.page){
      this.workShiftService.workShiftParams().pageNumber = event.page;
      this.loadWorkShifts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  showOffcanvas() {
		this.toastrService.info("filtering offcanvas");
	}
}
