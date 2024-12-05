import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastrService = inject(ToastrService);
  
  if (accountService.roles().includes('Admin')){
    return true;
  } else{
    toastrService.error("You cannot enter admin page");
    return false;
  }
};
