import { Component, inject, OnInit, signal } from '@angular/core';
import { DepartmentService } from '../../_services/department.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { Department } from '../../_models/department';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-department-detail',
  standalone: true,
  imports: [TabsModule],
  templateUrl: './department-detail.component.html',
  styleUrl: './department-detail.component.css'
})
export class DepartmentDetailComponent implements OnInit{
  private departmentService = inject(DepartmentService);
  private toastrService = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  accountService = inject(AccountService);
  department = signal<Department | null>(null);

  ngOnInit(): void {
    this.loadDepartment();
  }

  loadDepartment(){
    const departmentId = Number(this.route.snapshot.paramMap.get("id"));
    if (!departmentId) this.router.navigateByUrl("/not-found");;

    this.departmentService.getDepartment(departmentId).subscribe({
      next: department => this.department.set(department)
    })
  }

  loadEmployees(){
    this.toastrService.info("Load employees")
  }
}
