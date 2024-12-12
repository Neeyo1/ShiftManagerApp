import { Component, inject } from '@angular/core';
import { MemberService } from '../../_services/member.service';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './member-filter.component.html',
  styleUrl: './member-filter.component.css'
})
export class MemberFilterComponent {
  memberService = inject(MemberService);
  activeOffcanvas = inject(NgbActiveOffcanvas);
  orderByList = [
    {value: 'lastName', display: 'Last name ascending'},
    {value: 'lastName-desc', display: 'Last name descending'},
    {value: 'firstName', display: 'First name ascending'},
    {value: 'firstName-desc', display: 'First name descending'},
    {value: 'recentActive', display: 'Recent active ascending'},
    {value: 'recentActive-desc', display: 'Recent active descending'}
  ];
  statusList = [
    {value: 'user', display: 'User'},
    {value: 'manager', display: 'Manager'},
    {value: 'all', display: 'All'}
  ];

  loadMembers(){
    this.memberService.getMembers();
  }

  resetFilters(){
    this.memberService.resetMemberParams();
    this.loadMembers();
  }

  closeOffcanvas(offcanvas: any){
    offcanvas.close();
  }
}
