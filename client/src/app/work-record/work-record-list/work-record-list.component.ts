import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WorkRecordService } from '../../_services/workRecord.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { WorkRecord } from '../../_models/workRecord';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-work-record-list',
  standalone: true,
  imports: [RouterLink, PaginationModule, FormsModule],
  templateUrl: './work-record-list.component.html',
  styleUrl: './work-record-list.component.css'
})
export class WorkRecordListComponent implements OnInit, OnDestroy{
  workRecordService = inject(WorkRecordService);
  accountService = inject(AccountService);
  private toastrService = inject(ToastrService);

  ngOnInit(): void {
    this.loadWorkRecords();
  }

  ngOnDestroy(): void {
    this.workRecordService.paginatedResult.set(null);
  }

  loadWorkRecords(){
    this.workRecordService.getWorkRecords();
  }

  createWorkRecord(){
    this.toastrService.info("create work record modal");
  }

  editWorkRecord(workRecord: WorkRecord){
    this.toastrService.info("edit work record modal");
  }

  deleteWorkRecord(workRecordId: number){
    this.toastrService.info("Delete modal")
  }

  resetFilters(){
    this.workRecordService.resetWorkRecordParams();
    this.loadWorkRecords();
  }

  pageChanged(event: any){
    if (this.workRecordService.workRecordParams().pageNumber != event.page){
      this.workRecordService.workRecordParams().pageNumber = event.page;
      this.loadWorkRecords();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  showOffcanvas() {
		this.toastrService.info("filtering offcanvas");
	}
}
