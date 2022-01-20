//Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//RxJS
import { of } from 'rxjs';
import { map, catchError, exhaustMap } from 'rxjs/operators';

//NgRX
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as AuthActions from 'src/app/Auth/actions';
import * as SpotifyActions from 'src/app/Spotify/actions';

//Services
import { SpotifyOAuthService } from 'src/app/Spotify/services/oauth.spotify.service';
import { OAuthService } from 'src/app/OAuth/services/oauth.service';

@Injectable()
export class OAuthEffects {
  constructor(
    private actions$: Actions,
    private oauthService: OAuthService,
    private spotifyAuthorizationService: SpotifyOAuthService,
    private router: Router,
  ) {}

  /***************************************/
  /***** Implicit Grant Flow effects *****/
  /***************************************/

  startImplicitGrantFlow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpotifyActions.implicitGrant),
      map(() => SpotifyActions.implicitGrantRetrieveToken()),
    ),
  );
  implicitGrantAuthorization$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SpotifyActions.implicitGrantRetrieveToken),
        map(() => this.spotifyAuthorizationService.implicitGrantRedirect()),
      ),
    { dispatch: false },
  );
  implicitGrantToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SpotifyActions.implicitGrantRetrieveTokenSuccess),
        map(() => this.router.navigateByUrl('profile')),
      ),
    { dispatch: false },
  );

  /********************************************/
  /***** Authentication Code Flow effects *****/
  /********************************************/

  startAuthCodeFlow$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SpotifyActions.authCode),
        map(() => SpotifyActions.authCodeRetrieveCode()),
      ),
    //{ dispatch: false }
  );
  codeAuthorization$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SpotifyActions.authCodeRetrieveCode),
        map(() => this.spotifyAuthorizationService.authorizationCodeRedirect()),
      ),
    { dispatch: false },
  );
  requestTokenWithCode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SpotifyActions.authCodeRetrieveCodeSuccess),
        map(({ code }) => SpotifyActions.authCodeRetrieveToken({ code })),
      ),
    //{ dispatch: false }
  );
  requestTokensWithCode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SpotifyActions.authCodeRetrieveToken),
        /*
            exhaustMap(({code}) => 
                this.spotifyAuthorizationService.authorizationCodeToken(code).pipe(
                    map((token) => SpotifyActions.authCodeOneDriveTokenSuccess({ token })),
                    catchError((error) => of(SpotifyActions.authCodeOneDriveTokenFailure({ payload: error }))),
                )
            ),
            */
        exhaustMap(({ code }) =>
          this.spotifyAuthorizationService.authorizationCodeToken(code).pipe(
            //map((response) => SpotifyActions.authCodeOneDriveTokenSuccess({ access_token: response.access_token, refresh_token: response.refresh_token })),
            map((response) => {
              const resp = this.oauthService.generateTokens(
                response,
                'spotify',
              );
              return SpotifyActions.authCodeRetrieveTokenSuccess({
                access_token: resp.access_token,
                refresh_token: resp.refresh_token!,
              });
            }),
            catchError((error) =>
              of(
                SpotifyActions.authCodeRetrieveTokenFailure({ payload: error }),
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
        ofType(SpotifyActions.authCodeRetrieveTokenSuccess),
        map(() => this.router.navigateByUrl('profile')),
      ),
    { dispatch: false },
  );
  refreshToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SpotifyActions.authCodeRefreshToken),
        /*
            exhaustMap(({code}) => 
                this.spotifyAuthorizationService.authorizationCodeToken(code).pipe(
                    map((token) => SpotifyActions.authCodeOneDriveTokenSuccess({ token })),
                    catchError((error) => of(SpotifyActions.authCodeOneDriveTokenFailure({ payload: error }))),
                )
            ),
            */
        exhaustMap(({ refresh_token }) =>
          this.spotifyAuthorizationService
            .authorizationCodeRefresh(refresh_token)
            .pipe(
              //map((response) => SpotifyActions.authCodeOneDriveTokenSuccess({ access_token: response.access_token, refresh_token: response.refresh_token })),
              map((response) => {
                const resp = this.oauthService.generateTokens(
                  response,
                  'spotify',
                );
                return SpotifyActions.authCodeRetrieveTokenSuccess({
                  access_token: resp.access_token,
                  refresh_token: resp.refresh_token!,
                });
              }),
              catchError((error) =>
                of(
                  SpotifyActions.authCodeRefreshTokenFailure({
                    payload: error,
                  }),
                ),
              ),
            ),
        ),
      ),
    //{ dispatch: false }
  );

  /***************************/
  /***** BackEnd effects *****/
  /***************************/

  saveToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          SpotifyActions.authCodeRetrieveTokenSuccess,
          SpotifyActions.authCodeRefreshTokenSuccess,
        ),
        map(({ refresh_token }) => {
          if (refresh_token)
            return SpotifyActions.saveRefreshToken({ refresh_token });
          else return SpotifyActions.noRefreshToken();
        }),
      ),
    //{ dispatch: false },
  );

  saveTokenBackEnd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpotifyActions.saveRefreshToken),
      exhaustMap(({ refresh_token }) => {
        return this.oauthService.saveRefreshToken(refresh_token).pipe(
          map(() => SpotifyActions.saveRefreshTokenSuccess()),
          catchError((error) =>
            of(SpotifyActions.saveRefreshTokenFailure({ payload: error })),
          ),
        );
      }),
    ),
  );

  refreshTokenBackEnd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, SpotifyActions.refreshToken),
      exhaustMap(() => {
        return this.spotifyAuthorizationService.getRefreshedToken().pipe(
          map((response) =>
            SpotifyActions.refreshTokenSuccess({ access_token: response }),
          ),
          catchError((error) =>
            of(SpotifyActions.refreshTokenFailure({ payload: error })),
          ),
        );
      }),
    ),
  );
}
