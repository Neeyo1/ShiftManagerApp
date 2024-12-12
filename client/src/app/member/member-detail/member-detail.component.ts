import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../_services/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { Member } from '../../_models/member';
import { DepartmentService } from '../../_services/department.service';
import { Department } from '../../_models/department';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, DatePipe],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit{
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  accountService = inject(AccountService);
  member = signal<Member | null>(null);

  departmentService = inject(DepartmentService);
  department = signal<Department | null>(null);

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    const memberId = Number(this.route.snapshot.paramMap.get("id"));
    if (!memberId) this.router.navigateByUrl("/not-found");;

    this.memberService.getMember(memberId).subscribe({
      next: member => this.member.set(member)
    })
  }

  loadDepartment(departmentId: number){
    if (this.department()) return;
    this.departmentService.getDepartment(departmentId).subscribe({
      next: department => this.department.set(department)
    });
  }
}
