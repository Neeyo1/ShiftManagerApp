import { Component, inject } from '@angular/core';
import { DepartmentService } from '../_services/department.service';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  accountService = inject(AccountService);
  departmentService = inject(DepartmentService);
}
