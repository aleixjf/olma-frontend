//Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//RxJS
import { of } from 'rxjs';
import { map, tap, catchError, exhaustMap } from 'rxjs/operators';

//NgRX
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as AuthActions from '../actions';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
  ) {}

  /*************************/
  /***** Login effects *****/
  /*************************/

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((payload) => of(AuthActions.loginFailure({ payload }))),
        ),
      ),
    ),
  );
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/'])),
      ),
    { dispatch: false },
  );

  /**************************/
  /***** Logout effects *****/
  /**************************/

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.router.navigate(['/']);
        }),
      ),
    { dispatch: false },
  );
}
