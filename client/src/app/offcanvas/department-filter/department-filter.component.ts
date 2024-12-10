import { Component, inject } from '@angular/core';
import { DepartmentService } from '../../_services/department.service';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './department-filter.component.html',
  styleUrl: './department-filter.component.css'
})
export class DepartmentFilterComponent {
  departmentService = inject(DepartmentService);
  activeOffcanvas = inject(NgbActiveOffcanvas);
  orderByList = [
    {value: 'name', display: 'Name ascending'},
    {value: 'name-desc', display: 'Name descending'},
    {value: 'most-employees', display: 'Most employees'},
    {value: 'least-employees', display: 'Least employees'}
  ];

  loadDepartments(){
    this.departmentService.getDepartments();
  }

  resetFilters(){
    this.departmentService.resetDepartmentParams();
    this.loadDepartments();
  }

  closeOffcanvas(offcanvas: any){
    offcanvas.close();
  }
}
