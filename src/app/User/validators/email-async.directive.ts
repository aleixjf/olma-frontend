import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

export function emailAsyncValidator(
  userService: UserService,
  email?: string,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const currentEmail: boolean = email == control.value;
    if (currentEmail) return of(null);
    else
      return timer(1000).pipe(
        switchMap(() => userService.isEmailAlreadyUsed(control.value)),
        map((result) =>
          result && !currentEmail ? { uniqueEmail: true } : null,
        ),
        catchError(() => of(null)),
      );
  };
}
