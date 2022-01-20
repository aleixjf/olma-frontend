/*
OneDrive documentation:
https://docs.microsoft.com/es-es/azure/active-directory/develop/v2-oauth2-auth-code-flow
https://docs.microsoft.com/es-es/onedrive/developer/rest-api/getting-started/graph-oauth?view=odsp-graph-online
https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-angular-auth-code
https://docs.microsoft.com/es-es/azure/active-directory/develop/authentication-flows-app-scenarios
*/

//Environment
import { environment } from 'src/environments/environment';
//Angular
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//NgRX
import { Store } from '@ngrx/store';
//RxJS
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { OAuthState } from 'src/app/OAuth/models/oauth.state';
//Services
import { OAuthService } from 'src/app/OAuth/services/oauth.service';
//Models
import { TokenDTO } from 'src/app/Shared/models/token.dto';

@Injectable({
  providedIn: 'root',
})
export class OneDriveOAuthService {
  private callbackURL: string;
  private clientID: string;
  private scope: string;
  private backendAPI: string;
  private controller: string;
  private tenant: 'common' | 'organization' | 'consumers';
  private pkce!: {
    code_verifier: string;
    code_challenge: string;
  } | null;

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private router: Router,
    private oauthService: OAuthService,
  ) {
    this.store.select('oauth').subscribe((response: OAuthState) => {
      this.pkce = response.pkce;
    });
    /*
    this.pkce.code_challenge = this.oauthService.pkce_challenge(response.pkce?.code_verifier).then;
    console.dir(this.pkce)


    this.pkce = {
      code_verifier: 'I9AirKDzODUyl8Ht0XCNHLLWGlulK6D7Xvk5MuVyyyERsdmMEWBxgJUOjyZg1XqaLVfZCEc5qtuFl7EvX7aQL2Jffd6yhSp',
      code_challenge: 'JTG3galM8wsV5KtnixkkS1vo0PeqpLJuLeC_JL5numw'
    }
    */

    this.callbackURL = `${environment.url}/auth/onedrive`;
    this.clientID = '55e00ee3-5573-4694-8aa2-cf37b969cc9c';
    const scopes = [
      /* OpenID */
      //'email',
      //'profile',
      //'offline_access', //INFO: Mantain access to allowed files

      /* Files Read & Write access */
      //'files.read',
      'files.readwrite',
      //files.read.selected //INFO: BETA state
      //files.write.selected //INFO: BETA state
      //files.readwrite.selected //INFO: BETA state
      //'files.read.all',
      //'files.readwrite.all',
    ];
    this.scope = scopes.join(' ');
    this.controller = 'oauth2/v2.0';
    this.tenant = 'common';
    this.backendAPI =
      `https://login.microsoftonline.com/${this.tenant}/` + this.controller;
  }

  implicitGrantURL(): string {
    const params = new URLSearchParams({
      response_type: 'token',
      client_id: this.clientID,
      scope: this.scope,
      redirect_uri: this.callbackURL,
      //response_mode: 'query', //INFO: Only valid for 'response_type' = 'code'
      //prompt: 'none',
      //state: generateRandomString(16) //OPTIONAL BUT RECOMMENDED
    });
    return `${this.backendAPI}/authorize?${params.toString()}`;
  }
  implicitGrantRedirect(): void {
    window.location.replace(this.implicitGrantURL());
    //window.location.href = this.implicitGrantURL();
  }

  authorizationCodeURL(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientID,
      scope: this.scope,
      redirect_uri: this.callbackURL,
      response_mode: 'query', //Accepted values are: query / fragment / form_post
      //prompt: 'none',
      //state: generateRandomString(16) //OPTIONAL BUT RECOMMENDED
      code_challenge_method: 'S256',
      code_challenge: this.pkce ? this.pkce.code_challenge : '',
    });
    return `${this.backendAPI}/authorize?${params.toString()}`;
  }
  authorizationCodeRedirect(): void {
    window.location.replace(this.authorizationCodeURL());
    //window.location.href = this.authorizationCodeURL();
  }

  authorizationCodeToken(code: string): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.callbackURL,
        client_id: this.clientID,
        code_verifier: this.pkce ? this.pkce.code_verifier : '',
      },
    });
    return this.http.post<any>(`${this.backendAPI}/token`, params.toString());
  }
  authorizationCodeRefresh(refresh_token: string): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        grant_type: 'refresh_token',
        refresh_token,
        client_id: this.clientID,
      },
    });
    return this.http.post<any>(`${this.backendAPI}/token`, params.toString());
  }
  authorizationCodeFlow(code?: string): Observable<any> | void {
    if (!code) this.authorizationCodeRedirect();
    else return this.authorizationCodeToken(code);
  }

  getRefreshedToken(): Observable<TokenDTO> {
    return this.http.get<TokenDTO>(`/api/oauth/onedrive/refresh`);
  }

  logout() {
    return this.http.delete(`/api/oauth/onedrive`);
  }
}
