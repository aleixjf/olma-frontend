//Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//NgRX
import { Actions, createEffect, ofType } from '@ngrx/effects';
//RxJS
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import * as AuthActions from 'src/app/Auth/actions';
import * as DropboxActions from 'src/app/Dropbox/actions';
import { DropboxOAuthService } from 'src/app/Dropbox/services/oauth.dropbox.service';
//Services
import { OAuthService } from 'src/app/OAuth/services/oauth.service';

@Injectable()
export class OAuthEffects {
  constructor(
    private actions$: Actions,
    private oauthService: OAuthService,
    private dropboxAuthorizationService: DropboxOAuthService,
    private router: Router,
  ) {}

  /***************************************/
  /***** Implicit Grant Flow effects *****/
  /***************************************/

  //Implicit Grant Flow
  startImplicitGrantFlow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DropboxActions.implicitGrant),
      map(() => DropboxActions.implicitGrantRetrieveToken()),
    ),
  );
  implicitGrantAuthorization$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DropboxActions.implicitGrantRetrieveToken),
        map(() => this.dropboxAuthorizationService.implicitGrantRedirect()),
      ),
    { dispatch: false },
  );
  implicitGrantToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DropboxActions.implicitGrantRetrieveTokenSuccess),
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
        ofType(DropboxActions.authCode),
        map(() => DropboxActions.authCodeRetrieveCode()),
      ),
    //{ dispatch: false }
  );
  codeAuthorization$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DropboxActions.authCodeRetrieveCode),
        map(() => this.dropboxAuthorizationService.authorizationCodeRedirect()),
      ),
    { dispatch: false },
  );
  requestTokenWithCode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DropboxActions.authCodeRetrieveCodeSuccess),
        map(({ code }) => DropboxActions.authCodeRetrieveToken({ code })),
      ),
    //{ dispatch: false }
  );
  requestTokensWithCode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DropboxActions.authCodeRetrieveToken),
        /*
            exhaustMap(({code}) => 
                this.dropboxAuthorizationService.authorizationCodeToken(code).pipe(
                    map((token) => DropboxActions.authCodeDropboxTokenSuccess({ token })),
                    catchError((error) => of(DropboxActions.authCodeDropboxTokenFailure({ payload: error }))),
                )
            ),
            */
        exhaustMap(({ code }) =>
          this.dropboxAuthorizationService.authorizationCodeToken(code).pipe(
            //map((response) => DropboxActions.authCodeDropboxTokenSuccess({ access_token: response.access_token, refresh_token: response.refresh_token })),
            map((response) => {
              const resp = this.oauthService.generateTokens(
                response,
                'dropbox',
              );
              return DropboxActions.authCodeRetrieveTokenSuccess({
                access_token: resp.access_token,
                refresh_token: resp.refresh_token!,
              });
            }),
            catchError((error) =>
              of(
                DropboxActions.authCodeRetrieveTokenFailure({ payload: error }),
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
        ofType(DropboxActions.authCodeRetrieveTokenSuccess),
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
          DropboxActions.authCodeRetrieveTokenSuccess,
          DropboxActions.authCodeRefreshTokenSuccess,
        ),
        map(({ refresh_token }) => {
          if (refresh_token)
            return DropboxActions.saveRefreshToken({ refresh_token });
          else return DropboxActions.noRefreshToken();
        }),
      ),
    //{ dispatch: false },
  );

  saveTokenBackEnd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DropboxActions.saveRefreshToken),
      exhaustMap(({ refresh_token }) => {
        return this.oauthService.saveRefreshToken(refresh_token).pipe(
          map(() => DropboxActions.saveRefreshTokenSuccess()),
          catchError((error) =>
            of(DropboxActions.saveRefreshTokenFailure({ payload: error })),
          ),
        );
      }),
    ),
  );

  refreshTokenBackEnd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, DropboxActions.refreshToken),
      exhaustMap(() => {
        return this.dropboxAuthorizationService.getRefreshedToken().pipe(
          map((response) =>
            DropboxActions.refreshTokenSuccess({ access_token: response }),
          ),
          catchError((error) =>
            of(DropboxActions.refreshTokenFailure({ payload: error })),
          ),
        );
      }),
    ),
  );
}
