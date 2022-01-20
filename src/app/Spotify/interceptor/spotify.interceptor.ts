//Angular
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//RxJS
import { Observable, throwError, timer } from 'rxjs';
import {
  catchError,
  mergeMap,
  retryWhen,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as AuthState from 'src/app/Auth/models/auth.state';
import * as SpotifyActions from 'src/app/Spotify/actions';

//Models
import { TokenDTO } from 'src/app/Shared/models/token.dto';

//Services
import { SpotifyOAuthService } from '../services/oauth.spotify.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifyInterceptorService implements HttpInterceptor {
  private backendAPI: string;
  private token: TokenDTO | undefined;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private spotifyService: SpotifyOAuthService,
  ) {
    this.backendAPI = 'https://api.spotify.com';

    this.store.select('auth').subscribe((response: AuthState.AuthState) => {
      if (response.credentials) {
        this.token = response.credentials.tokens?.spotify;
      }
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (req.url.match('https://accounts.spotify.com/api/token')) {
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } else if (req.url.startsWith(this.backendAPI) && this.token) {
      req = req.clone({
        setHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${this.token.jwt}`,
        },
      });
    }

    return next.handle(req).pipe(
      retryWhen((errors) =>
        //INFO: Handle Rate Limiting
        errors.pipe(
          mergeMap((error) => {
            if (!(error.error instanceof ErrorEvent) && error.status === 429) {
              const time = error.headers.get('Retry-After');
              if (typeof time === 'string') {
                console.log(`Delaying request for ${time} seconds...`);
                return timer(parseInt(time) * 1000);
              } else return throwError(error);
            } else return throwError(error);
          }),
          take(3),
        ),
      ),
      catchError((error: HttpErrorResponse) => {
        if (
          req.url.match('https://accounts.spotify.com/api/token') ||
          req.url.startsWith(this.backendAPI)
        ) {
          /* Client-side error */
          if (error.error instanceof ErrorEvent) {
            console.log(`[OLMA] App error: ${error.error.message}`);
            return throwError(error);
          } else {
            /* Server-side error */
            const message = error.error.error.message;
            console.log(
              `[Spotify API] Server error: ${error.status} - ${message}`,
            );
            /* Spotify Response Status Codes:
            https://developer.spotify.com/documentation/web-api/#response-status-codes
            */
            switch (error.status) {
              //Unauthorized (No token or bad/expired token)
              case 401:
                switch (message) {
                  case 'No token provided':
                    this.store.dispatch(SpotifyActions.authCode());
                    break;
                  case 'The access token expired':
                    return this.spotifyService.getRefreshedToken().pipe(
                      tap(() =>
                        console.log('Refreshing tokens and retrying...'),
                      ),
                      switchMap((response) => {
                        this.store.dispatch(
                          SpotifyActions.refreshTokenSuccess({
                            access_token: response,
                          }),
                        );
                        //INFO: We must reset the request header with the new access token
                        //The Request instance is immutable, hence we have to clone it to add the new headers
                        req = req.clone({
                          setHeaders: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json; charset=utf-8',
                            Authorization: `Bearer ${this.token!.jwt}`,
                          },
                        });
                        return next.handle(req);
                      }),
                      catchError((err) => {
                        return throwError(err);
                      }),
                    );
                    break;
                  default:
                    break;
                }
                break;
              //Forbidden (Bad OAuth request, for example)
              case 403:
                //TODO: Restart OAuth flow?
                //this.store.dispatch(SpotifyActions.authCode());
                break;
              //Not found
              case 404:
                break;
              //Rate limiting
              case 429:
                /*
                //INFO: Handled withretryWhen
                const time = error.headers.get('Retry-After');
                if (typeof time === 'string') {
                  console.log(`Delaying request for ${time} seconds...`);
                  console.log(`Before: ${new Date().toLocaleTimeString()}`);
                  return next.handle(req).pipe(
                    tap(() => console.log(`Retrying...`)),
                    delay(parseInt(time) * 1000),
                    tap(() =>
                      console.log(`After: ${new Date().toLocaleTimeString()}`),
                    ),
                    retry(3),
                  );
                }
                */
                break;
              default:
                break;
            }

            return throwError(error);
          }
        } else return throwError(error);
      }),
    );
  }
}
