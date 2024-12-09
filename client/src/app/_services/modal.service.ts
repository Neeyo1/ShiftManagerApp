import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AccountService } from './account.service';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordModalComponent } from '../modals/change-password-modal/change-password-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  bsModalRef?: BsModalRef;
  private modalService = inject(BsModalService);
  private accountService = inject(AccountService);
  private toastrService = inject(ToastrService);

  openChangePasswordModal(){
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false
      }
    };
    this.bsModalRef = this.modalService.show(ChangePasswordModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          const changePasswordForm = this.bsModalRef.content.changePasswordForm;

          this.accountService.changePassword(changePasswordForm.value).subscribe({
            next: _ => this.toastrService.success("Password changed successfully")
          })
        }
      }
    })
  }
}
