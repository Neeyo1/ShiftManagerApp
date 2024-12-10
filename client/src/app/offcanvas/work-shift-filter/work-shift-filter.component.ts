import { Component, inject } from '@angular/core';
import { WorkShiftService } from '../../_services/workShift.service';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-work-shift-filter',
  standalone: true,
  imports: [FormsModule, BsDatepickerModule],
  templateUrl: './work-shift-filter.component.html',
  styleUrl: './work-shift-filter.component.css'
})
export class WorkShiftFilterComponent {
  worhShiftService = inject(WorkShiftService);
  activeOffcanvas = inject(NgbActiveOffcanvas);
  orderByList = [
    {value: 'oldest', display: 'Oldest'},
    {value: 'newest', display: 'Newest'}
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

  loadWorkShifts(){
    let dateFrom = new Date(this.worhShiftService.workShiftParams().dateFrom);
    this.worhShiftService.workShiftParams().dateFrom = dateFrom.toISOString().slice(0,10);
    let dateTo = new Date(this.worhShiftService.workShiftParams().dateTo);
    this.worhShiftService.workShiftParams().dateTo = dateTo.toISOString().slice(0,10);

    this.worhShiftService.getWorkShifts();
  }

  resetFilters(){
    this.worhShiftService.resetWorkShiftParams();
    this.loadWorkShifts();
  }

  closeOffcanvas(offcanvas: any){
    offcanvas.close();
  }
}
