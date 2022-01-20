/*
Dropbox documentation:
https://developers.dropbox.com/es-es/oauth-guide
*/

//Environment
import { environment } from 'src/environments/environment';

//Angular
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//RxJS
import { Observable } from 'rxjs';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { OAuthState } from 'src/app/OAuth/models/oauth.state';

//Models
import { TokenDTO } from 'src/app/Shared/models/token.dto';

//Services
import { OAuthService } from 'src/app/OAuth/services/oauth.service';

@Injectable({
  providedIn: 'root',
})
export class DropboxOAuthService {
  private callbackURL: string;
  private clientID: string;
  private scope: string;
  private backendAPI: string;
  private controller: string;
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

    this.callbackURL = `${environment.url}/auth/dropbox`;
    this.clientID = 'md53g3ajpn92b8b';
    const scopes = [
      //'offline_access',
      'account_info.read', //INFO: Obligatory by Dropbox policies
      /* Files Read & Write access */
      'files.content.read',
      'files.content.write',
      'files.metadata.read',
      'files.metadata.write',
    ];
    this.scope = scopes.join(' ');
    this.controller = 'oauth2';
    this.backendAPI = `https://api.dropbox.com/` + this.controller;
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
    //return `${this.backendAPI}/authorize?` + authParameters.toString();
    return `https://www.dropbox.com/oauth2/authorize?` + params.toString();
  }
  implicitGrantRedirect(): void {
    window.location.replace(this.implicitGrantURL());
    //window.location.href = this.implicitGrantURL();
  }

  authorizationCodeURL(): string {
    console.log(this.callbackURL);
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
      token_access_type: 'offline', //INFO: 'offline' --> short access_token + refresh token; 'online' --> short access_token; if omitted, by default it returns a long access_token
      force_reapprove: 'false',
    });
    return `https://www.dropbox.com/oauth2/authorize?` + params.toString();
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
    return this.http.post<any>(`${this.backendAPI}/token`, undefined, {
      params,
    });
  }
  authorizationCodeRefresh(refresh_token: string): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        grant_type: 'refresh_token',
        refresh_token,
        client_id: this.clientID,
      },
    });
    return this.http.post<any>(`${this.backendAPI}/token`, undefined, {
      params,
    });
  }
  authorizationCodeFlow(code?: string): Observable<any> | void {
    if (!code) this.authorizationCodeRedirect();
    else return this.authorizationCodeToken(code);
  }

  getRefreshedToken(): Observable<TokenDTO> {
    return this.http.get<TokenDTO>(`/api/oauth/dropbox/refresh`);
  }

  logout() {
    return this.http.delete(`/api/oauth/dropbox`);
  }
}
