//Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//NgRX
import { Actions, createEffect, ofType } from '@ngrx/effects';
//RxJS
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import * as DropboxActions from 'src/app/Dropbox/actions';
import * as OAuthActions from 'src/app/OAuth/actions';
import * as OneDriveActions from 'src/app/OneDrive/actions';
import * as SpotifyActions from 'src/app/Spotify/actions';
//Services
import { OAuthService } from '../services/oauth.service';

@Injectable()
export class OAuthEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private oauthService: OAuthService,
  ) {}

  /***************************************/
  /***** PKCE Authentication effects *****/
  /***************************************/

  generatePKCE$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          OAuthActions.generatePKCE,
          SpotifyActions.authCode,
          OneDriveActions.authCode,
          DropboxActions.authCode,
        ),
        map(() => {
          /*
        const pkce = {
          code_verifier: 'I9AirKDzODUyl8Ht0XCNHLLWGlulK6D7Xvk5MuVyyyERsdmMEWBxgJUOjyZg1XqaLVfZCEc5qtuFl7EvX7aQL2Jffd6yhSp',
          code_challenge: 'JTG3galM8wsV5KtnixkkS1vo0PeqpLJuLeC_JL5numw'    
        }
        */
          const pkce = this.oauthService.generate_pkce();
          return OAuthActions.generatePKCESuccess({ pkce });
        }),
        /*
      switchMap(() => from(this.oauthService.generate_pkce()).pipe(
        map(pkce => OAuthActions.generatePKCESuccess({ pkce }))
      )),
      */
        //map(pkce => OAuthActions.generatePKCESuccess({ pkce }))
      ),
    //{ dispatch: false }
  );

  //TODO: Replace with individual refresh calls.
  getTokens$ = createEffect(() =>
    this.actions$.pipe(
      //ofType(AuthActions.loginSuccess, OAuthActions.getTokens),
      ofType(OAuthActions.getTokens),
      exhaustMap(() =>
        this.oauthService.getTokens().pipe(
          map((response) =>
            OAuthActions.getTokensSuccess({ tokens: response }),
          ),
          catchError((error) =>
            of(OAuthActions.getTokensFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  refreshTokens$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OAuthActions.refreshTokens),
      exhaustMap(({ refresh_token }) =>
        this.oauthService.refreshTokens(refresh_token).pipe(
          map((response) =>
            OAuthActions.refreshTokensSuccess({ tokens: response }),
          ),
          catchError((error) =>
            of(OAuthActions.refreshTokensFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );
}
