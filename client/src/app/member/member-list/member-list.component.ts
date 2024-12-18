import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MemberService } from '../../_services/member.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../_services/modal.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { MemberFilterComponent } from '../../offcanvas/member-filter/member-filter.component';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [RouterLink, PaginationModule, FormsModule, DatePipe],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit, OnDestroy{
  memberService = inject(MemberService);
  accountService = inject(AccountService);
  private toastrService = inject(ToastrService);
  private myModalService = inject(ModalService);
  private offcanvasService = inject(NgbOffcanvas);

  ngOnInit(): void {
    this.loadMembers();
  }

  ngOnDestroy(): void {
    this.memberService.paginatedResult.set(null);
  }

  loadMembers(){
    this.memberService.getMembers();
  }

  createMember(){
    this.myModalService.openCreateMemberModal();
  }

  changePassword(memberId: number){
    this.myModalService.openChangePasswordModal(memberId);
  }

  deleteMember(memberId: number){
    this.myModalService.openConfirmModal("member")?.subscribe({
      next: result => {
        if (result){
          this.memberService.deleteMember(memberId).subscribe({
            next: _ => this.loadMembers()
          });
        }
      }
    })
  }

  pageChanged(event: any){
    if (this.memberService.memberParams().pageNumber != event.page){
      this.memberService.memberParams().pageNumber = event.page;
      this.loadMembers();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  showOffcanvas() {
    this.offcanvasService.open(MemberFilterComponent);
  }
}
