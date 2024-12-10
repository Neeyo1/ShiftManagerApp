import { Component, inject } from '@angular/core';
import { WorkRecordService } from '../../_services/workRecord.service';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-work-record-filter',
  standalone: true,
  imports: [FormsModule, BsDatepickerModule],
  templateUrl: './work-record-filter.component.html',
  styleUrl: './work-record-filter.component.css'
})
export class WorkRecordFilterComponent {
  workRecordService = inject(WorkRecordService);
  activeOffcanvas = inject(NgbActiveOffcanvas);
  orderByList = [
    {value: 'oldest', display: 'Oldest'},
    {value: 'newest', display: 'Newest'},
    {value: 'longest', display: 'Longest'},
    {value: 'shortest', display: 'Shortest'}
  ];
  statusList = [
    {value: 'going', display: 'Going'},
    {value: 'closed', display: 'Closed'},
    {value: 'all', display: 'All'}
  ];
  bsConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-dark-blue', 
    dateInputFormat: 'YYYY-MM-DD'
  };

  loadWorkRecords(){
    let dateFrom = new Date(this.workRecordService.workRecordParams().dateFrom);
    this.workRecordService.workRecordParams().dateFrom = dateFrom.toISOString();
    let dateTo = new Date(this.workRecordService.workRecordParams().dateTo);
    this.workRecordService.workRecordParams().dateTo = dateTo.toISOString();

    this.workRecordService.getWorkRecords();
  }

  resetFilters(){
    this.workRecordService.resetWorkRecordParams();
    this.loadWorkRecords();
  }

  closeOffcanvas(offcanvas: any){
    offcanvas.close();
  }
}
