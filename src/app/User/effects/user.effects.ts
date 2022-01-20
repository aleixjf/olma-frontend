//Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//RxJS
import { of } from 'rxjs';
import { map, catchError, mergeMap, exhaustMap } from 'rxjs/operators';

//NgRX
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as UserActions from 'src/app/User/actions';
import { UserService } from 'src/app/User/services/user.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private router: Router,
  ) {}

  //Get user
  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getUser),
      exhaustMap(({ uuid }) =>
        this.userService.getUser(uuid).pipe(
          map((user) => UserActions.getUserSuccess({ user })),
          catchError((error) =>
            of(UserActions.getUserFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  //Register user
  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.registerUser),
      exhaustMap(({ user }) =>
        this.userService.register(user).pipe(
          map((newUser) => UserActions.registerUserSuccess({ user: newUser })),
          catchError((error) =>
            of(UserActions.registerUserFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );
  registerUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.registerUserSuccess),
        map(() => {
          this.redirectTo('/home');
        }),
      ),
    { dispatch: false },
  );

  //Update user information
  updateUserInformation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserInformation),
      mergeMap(({ user }) =>
        this.userService.updateUserInformation(user).pipe(
          map(() => UserActions.updateUserInformationSuccess({ user })),
          catchError((error) =>
            of(UserActions.updateUserInformationFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  //Update user password
  updateUserPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserPassword),
      mergeMap(({ user, password }) =>
        this.userService.updateUserPassword(user, password).pipe(
          map(() => UserActions.updateUserPasswordSuccess()),
          catchError((error) =>
            of(UserActions.updateUserPasswordFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  redirectTo(uri: string): void {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }
}
