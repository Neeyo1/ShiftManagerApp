import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  bsModalRef = inject(BsModalRef);
  name = "";
  result = false;

  confirm(){
    this.result = true;
    this.bsModalRef.hide();
  }

  cancel(){
    this.bsModalRef.hide();
  }
}
