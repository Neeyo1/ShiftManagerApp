import { Component, inject } from '@angular/core';
import { EmployeeService } from '../../_services/employee.service';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-employee-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './employee-filter.component.html',
  styleUrl: './employee-filter.component.css'
})
export class EmployeeFilterComponent {
  employeeService = inject(EmployeeService);
  activeOffcanvas = inject(NgbActiveOffcanvas);
  orderByList = [
    {value: 'lastName', display: 'Last name ascending'},
    {value: 'lastName-desc', display: 'Last name descending'},
    {value: 'firstName', display: 'First name ascending'},
    {value: 'firstName-desc', display: 'First name descending'}
  ];
  statusList = [
    {value: 'active', display: 'Active'},
    {value: 'not-active', display: 'Not Active'},
    {value: 'all', display: 'All'}
  ];

  loadEmployees(){
    this.employeeService.getEmployees();
  }

  resetFilters(){
    this.employeeService.resetEmployeeParams();
    this.loadEmployees();
  }

  closeOffcanvas(offcanvas: any){
    offcanvas.close();
  }
}
