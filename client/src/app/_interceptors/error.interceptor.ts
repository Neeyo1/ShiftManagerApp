import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap } from 'rxjs';
import { AccountService } from '../_services/account.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastrService = inject(ToastrService);
  const accountService = inject(AccountService);

  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modalStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modalStateErrors.push(error.error.errors[key]);
                }
              }
              throw modalStateErrors.flat();
            } else {
              toastrService.error(error.error, error.status);
            }
            break;

          case 401:
            if (accountService.currentUser() && accountService.tokenExpired(accountService.currentUser()!.token)) {
              return accountService.refreshToken(accountService.currentUser()!.token).pipe(
                switchMap(() => {
                  req = req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${accountService.currentUser()?.token}`
                    }
                  })
                  return next(req);
                }),
                catchError((error) => {
                  toastrService.error('Unauthorized', error.status);
                  accountService.logout();
                  throw error;
                })
              );
            }

            toastrService.error('Unauthorized', error.status);
            break;

          case 404:
            router.navigateByUrl('/not-found');
            break;

          case 500:
            const navigationExtras: NavigationExtras = { state: { error: error.error } };
            router.navigateByUrl('/server-error', navigationExtras);
            break;

          default:
            toastrService.error('Something unexpected went wrong');
            break;
        }
      }
      throw error;
    })
  );
};
