import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WorkRecordService } from '../../_services/workRecord.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { WorkRecord } from '../../_models/workRecord';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../_services/modal.service';
import { DatePipe } from '@angular/common';
import { WorkRecordFilterComponent } from '../../offcanvas/work-record-filter/work-record-filter.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-work-record-list',
  standalone: true,
  imports: [RouterLink, PaginationModule, FormsModule, DatePipe],
  templateUrl: './work-record-list.component.html',
  styleUrl: './work-record-list.component.css'
})
export class WorkRecordListComponent implements OnInit, OnDestroy{
  workRecordService = inject(WorkRecordService);
  accountService = inject(AccountService);
  private toastrService = inject(ToastrService);
  private myModalService = inject(ModalService);
  private offcanvasService = inject(NgbOffcanvas);

  ngOnInit(): void {
    this.loadWorkRecords();
  }

  ngOnDestroy(): void {
    this.workRecordService.paginatedResult.set(null);
  }

  loadWorkRecords(){
    this.workRecordService.getWorkRecords();
  }

  editWorkRecord(workRecord: WorkRecord){
    this.myModalService.openEditWorkRecordModal(workRecord);
  }

  deleteWorkRecord(workRecordId: number){
    this.myModalService.openConfirmModal("work record")?.subscribe({
      next: result => {
        if (result){
          this.workRecordService.deleteWorkRecord(workRecordId).subscribe({
            next: _ => this.loadWorkRecords()
          });
        }
      }
    })
  }

  pageChanged(event: any){
    if (this.workRecordService.workRecordParams().pageNumber != event.page){
      this.workRecordService.workRecordParams().pageNumber = event.page;
      this.loadWorkRecords();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  showOffcanvas() {
		this.offcanvasService.open(WorkRecordFilterComponent);
	}
}
