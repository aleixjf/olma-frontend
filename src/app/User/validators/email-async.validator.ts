import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class EmailAsyncValidator implements AsyncValidator {
  constructor(private userService: UserService) {}

  validate(
    control: AbstractControl,
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return timer(1000).pipe(
      switchMap(() => this.userService.isEmailAlreadyUsed(control.value)),
      map((result) => (result ? { uniqueEmail: true } : null)),
      catchError(() => of(null)),
    );
    /*
    return this.userService.isEmailAlreadyUsed(control.value).pipe(
      map((response) => (response ? { uniqueEmail: true } : null)),
      catchError(() => of(null)),
    );
    */
  }
}
