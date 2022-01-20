//Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//RxJS
import { of } from 'rxjs';
import { map, catchError, exhaustMap } from 'rxjs/operators';

//NgRX
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as AuthActions from 'src/app/Auth/actions';
import * as OneDriveActions from 'src/app/OneDrive/actions';

//Services
import { OAuthService } from 'src/app/OAuth/services/oauth.service';
import { OneDriveOAuthService } from 'src/app/OneDrive/services/oauth.onedrive.service';

@Injectable()
export class OAuthEffects {
  constructor(
    private actions$: Actions,
    private oauthService: OAuthService,
    private onedriveAuthorizationService: OneDriveOAuthService,
    private router: Router,
  ) {}

  /***************************************/
  /***** Implicit Grant Flow effects *****/
  /***************************************/

  //Implicit Grant Flow
  startImplicitGrantFlow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OneDriveActions.implicitGrant),
      map(() => OneDriveActions.implicitGrantRetrieveToken()),
    ),
  );
  implicitGrantAuthorization$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OneDriveActions.implicitGrantRetrieveToken),
        map(() => this.onedriveAuthorizationService.implicitGrantRedirect()),
      ),
    { dispatch: false },
  );
  implicitGrantToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OneDriveActions.implicitGrantRetrieveTokenSuccess),
        map(() => this.router.navigateByUrl('profile')),
      ),
    { dispatch: false },
  );

  /********************************************/
  /***** Authentication Code Flow effects *****/
  /********************************************/

  //Authentication Code Flow
  startAuthCodeFlow$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OneDriveActions.authCode),
        map(() => OneDriveActions.authCodeRetrieveCode()),
      ),
    //{ dispatch: false }
  );
  codeAuthorization$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OneDriveActions.authCodeRetrieveCode),
        map(() =>
          this.onedriveAuthorizationService.authorizationCodeRedirect(),
        ),
      ),
    { dispatch: false },
  );
  requestTokenWithCode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OneDriveActions.authCodeRetrieveCodeSuccess),
        map(({ code }) => OneDriveActions.authCodeRetrieveToken({ code })),
      ),
    //{ dispatch: false }
  );
  requestTokensWithCode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OneDriveActions.authCodeRetrieveToken),
        /*
            exhaustMap(({code}) => 
                this.onedriveAuthorizationService.authorizationCodeToken(code).pipe(
                    map((token) => OneDriveActions.authCodeOneDriveTokenSuccess({ token })),
                    catchError((error) => of(OneDriveActions.authCodeOneDriveTokenFailure({ payload: error }))),
                )
            ),
            */
        exhaustMap(({ code }) =>
          this.onedriveAuthorizationService.authorizationCodeToken(code).pipe(
            //map((response) => OneDriveActions.authCodeOneDriveTokenSuccess({ access_token: response.access_token, refresh_token: response.refresh_token })),
            map((response) => {
              const resp = this.oauthService.generateTokens(
                response,
                'onedrive',
              );
              return OneDriveActions.authCodeRetrieveTokenSuccess({
                access_token: resp.access_token,
                refresh_token: resp.refresh_token!,
              });
            }),
            catchError((error) =>
              of(
                OneDriveActions.authCodeRetrieveTokenFailure({
                  payload: error,
                }),
              ),
            ),
          ),
        ),
      ),
    //{ dispatch: false }
  );
  authCodeToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OneDriveActions.authCodeRetrieveTokenSuccess),
        map(() => this.router.navigateByUrl('profile')),
      ),
    { dispatch: false },
  );

  /***************************/
  /***** BackEnd effects *****/
  /***************************/

  saveToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          OneDriveActions.authCodeRetrieveTokenSuccess,
          OneDriveActions.authCodeRefreshTokenSuccess,
        ),
        map(({ refresh_token }) => {
          if (refresh_token)
            return OneDriveActions.saveRefreshToken({ refresh_token });
          else return OneDriveActions.noRefreshToken();
        }),
      ),
    //{ dispatch: false },
  );

  saveTokenBackEnd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OneDriveActions.saveRefreshToken),
      exhaustMap(({ refresh_token }) => {
        return this.oauthService.saveRefreshToken(refresh_token).pipe(
          map(() => OneDriveActions.saveRefreshTokenSuccess()),
          catchError((error) =>
            of(OneDriveActions.saveRefreshTokenFailure({ payload: error })),
          ),
        );
      }),
    ),
  );

  refreshTokenBackEnd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, OneDriveActions.refreshToken),
      exhaustMap(() => {
        return this.onedriveAuthorizationService.getRefreshedToken().pipe(
          map((response) =>
            OneDriveActions.refreshTokenSuccess({ access_token: response }),
          ),
          catchError((error) =>
            of(OneDriveActions.refreshTokenFailure({ payload: error })),
          ),
        );
      }),
    ),
  );
}
