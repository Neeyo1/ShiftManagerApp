import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const managerGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastrService = inject(ToastrService);
  
  if (accountService.roles().includes('Admin') || accountService.roles().includes('Manager')){
    return true;
  } else{
    toastrService.error("You cannot enter admin page");
    return false;
  }
};
