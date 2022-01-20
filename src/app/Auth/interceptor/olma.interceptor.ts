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
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as AuthState from 'src/app/Auth/models/auth.state';
import * as AuthActions from 'src/app/Auth/actions';
import * as OAuthActions from 'src/app/OAuth/actions';

//Models
import { TokenDTO } from 'src/app/Shared/models/token.dto';

//Services
import { OAuthService } from 'src/app/OAuth/services/oauth.service';

@Injectable({
  providedIn: 'root',
})
export class OlmaInterceptorService implements HttpInterceptor {
  private backendAPI: string;
  private clientID: string | undefined;
  private token: TokenDTO | undefined;
  private refresh_token: TokenDTO | undefined;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private oauthService: OAuthService,
  ) {
    this.backendAPI = `/api`;

    this.store.select('auth').subscribe((response: AuthState.AuthState) => {
      if (response.credentials) {
        this.token = response.credentials.tokens?.olma;
        this.refresh_token = response.credentials.tokens?.olma_refresh;
      }
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith(this.backendAPI) && this.token) {
      req = req.clone({
        setHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${this.token.jwt}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (req.url.startsWith(this.backendAPI)) {
          /* Client-side error */
          if (error.error instanceof ErrorEvent) {
            console.log(`[OLMA] App error: ${error.error.message}`);
            return throwError(error);
          } else {
            /* Server-side error */
            const message = error.error.message;
            console.log(
              `[OLMA API] Server error: ${error.status} - ${message}`,
            );
            switch (error.status) {
              //Unauthorized (No token or bad/expired access token)
              case 401:
                switch (message) {
                  case 'No auth token':
                    this.router.navigateByUrl('/login');
                    break;
                  case 'jwt expired':
                    if (this.refresh_token) {
                      return this.oauthService
                        .refreshTokens(this.refresh_token.jwt)
                        .pipe(
                          tap(() =>
                            console.log('Refreshing tokens and retrying...'),
                          ),
                          switchMap((response) => {
                            this.store.dispatch(
                              OAuthActions.refreshTokensSuccess({
                                tokens: response,
                              }),
                            );
                            //INFO: We must reset the request header with the new access token
                            //The Request instance is immutable, hence we have to clone it to add the new headers
                            req = req.clone({
                              setHeaders: {
                                Accept: 'application/json',
                                'Content-Type':
                                  'application/json; charset=utf-8',
                                Authorization: `Bearer ${this.token!.jwt}`,
                              },
                            });
                            return next.handle(req);
                          }),
                          catchError((err) => {
                            return throwError(err);
                          }),
                        );
                    }
                    break;
                  default:
                    break;
                }
                break;
              //Forbidden (Bad OAuth request, for example)
              case 403:
                //TODO: Restart OAuth flow?
                break;
              //Not found
              case 404:
                break;
              //Expired/Malformed/Revoked refresh token
              case 422:
                this.store.dispatch(AuthActions.logout());
                break;
              //Rate limiting
              case 429:
                console.log(error.headers.get('Retry-After'));
                //INFO: If error isn't intercepted ans is shown as a "normal error", it's probably because the backend API is "blocking" it and the error is returned without CORS headers.
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
