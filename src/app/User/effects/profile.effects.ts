//Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//RxJS
import { of } from 'rxjs';
import { map, catchError, mergeMap, exhaustMap } from 'rxjs/operators';

//NgRX
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as UserActions from 'src/app/User/actions';
import { ProfileService } from 'src/app/User/services/profile.service';

@Injectable()
export class ProfileEffects {
  constructor(
    private actions$: Actions,
    private profileService: ProfileService,
    private router: Router,
  ) {}

  //Get profile
  getProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getProfile),
      exhaustMap(() =>
        this.profileService.profile().pipe(
          map((user) => UserActions.getProfileSuccess({ user })),
          catchError((error) =>
            of(UserActions.getProfileFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  //Update information
  updateInformation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateInformation),
      mergeMap(({ user }) =>
        this.profileService.updateInformation(user).pipe(
          map(() => UserActions.updateInformationSuccess({ user })),
          catchError((error) =>
            of(UserActions.updateInformationFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  //Update password
  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updatePassword),
      mergeMap(({ user, password }) =>
        this.profileService.updatePassword(user, password).pipe(
          map(() => UserActions.updatePasswordSuccess()),
          catchError((error) =>
            of(UserActions.updatePasswordFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  //Update success redirect
  updateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          UserActions.updateInformationSuccess,
          UserActions.updatePasswordSuccess,
        ),
        map(() => {
          this.redirectTo('/profile');
        }),
      ),
    { dispatch: false },
  );

  redirectTo(uri: string): void {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }
}
