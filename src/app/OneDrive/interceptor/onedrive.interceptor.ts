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
import * as OneDriveActions from 'src/app/OneDrive/actions';

//Models
import { TokenDTO } from 'src/app/Shared/models/token.dto';

//Services
import { OneDriveOAuthService } from '../services/oauth.onedrive.service';

@Injectable({
  providedIn: 'root',
})
export class OneDriveInterceptorService implements HttpInterceptor {
  private backendAPI: string;
  private clientID: string | undefined;
  private token: TokenDTO | undefined;
  private tenant: 'common' | 'organization' | 'consumers';

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private oneDriveService: OneDriveOAuthService,
  ) {
    this.tenant = 'common';
    this.backendAPI = `https://graph.microsoft.com/v1.0`;

    this.store.select('auth').subscribe((response: AuthState.AuthState) => {
      if (response.credentials) {
        this.token = response.credentials.tokens?.onedrive;
      }
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (
      req.url.match(
        `https://login.microsoftonline.com/${this.tenant}/oauth2/v2.0/token`,
      )
      /*
      req.url.startsWith('https://login.microsoftonline.com/') &&
      req.url.includes('oauth2/v2.0')
      */
    ) {
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
          req.url.match(
            `https://login.microsoftonline.com/${this.tenant}/oauth2/v2.0/token`,
          ) ||
          req.url.startsWith(this.backendAPI)
        ) {
          /* Client-side error */
          if (error.error instanceof ErrorEvent) {
            console.log(`[OLMA] App error: ${error.error.message}`);
            const payload = `Error: ${error.error.message}`;
            return throwError(payload);
          } else {
            /* Server-side error */
            const message = error.error.error.message;
            console.log(
              `[OneDrive API] Server error: ${error.status} - ${message}`,
            );
            /* OneDrive Response Status Codes:
            https://docs.microsoft.com/es-es/onedrive/developer/rest-api/concepts/errors?view=odsp-graph-online
            */
            switch (error.status) {
              //Unauthorized (No token or bad/expired token)
              case 401:
                switch (message) {
                  case 'No token provided':
                    this.store.dispatch(OneDriveActions.authCode());
                    break;
                  case 'The access token expired':
                    return this.oneDriveService.getRefreshedToken().pipe(
                      tap(() =>
                        console.log('Refreshing tokens and retrying...'),
                      ),
                      switchMap((response) => {
                        this.store.dispatch(
                          OneDriveActions.refreshTokenSuccess({
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
                //this.store.dispatch(OneDriveActions.authCode());
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
