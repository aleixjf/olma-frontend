/*
Spotify documentation:
https://developer.spotify.com/documentation/web-api/guides/
https://developer.spotify.com/documentation/general/guides/authorization/
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
export class SpotifyOAuthService {
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

    this.callbackURL = `${environment.url}/auth/spotify`;
    this.clientID = 'f38ea9b3b0b14346a91d4bf93b0f57d0';
    const scopes = [
      /* Listening History */
      // 'user-read-recently-played',
      // 'user-top-read',
      // 'user-read-playback-position',
      /* Spotify Connect */
      // 'user-read-playback-state',
      // 'user-modify-playback-state',
      // 'user-read-currently-playing',
      /* Playback */
      // 'streaming',
      /* Playlists */
      'playlist-modify-public',
      'playlist-modify-private',
      'playlist-read-private',
      'playlist-read-collaborative',
      /* Library */
      'user-library-modify',
      'user-library-read',
      /* Users */
      // 'user-read-email',
      // 'user-read-private',
    ];
    this.scope = scopes.join(' ');
    this.controller = '';
    this.backendAPI = 'https://accounts.spotify.com'; // + this.controller;
  }

  implicitGrantURL(): string {
    const params = new URLSearchParams({
      response_type: 'token',
      client_id: this.clientID,
      scope: this.scope,
      redirect_uri: this.callbackURL,
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
      //state: generateRandomString(16) //OPTIONAL BUT RECOMMENDED
      code_challenge_method: 'S256',
      code_challenge: this.pkce ? this.pkce.code_challenge : '',
    });
    return `${this.backendAPI}/authorize?${params.toString()}`;
  }
  authorizationCodeRedirect(): void {
    window.location.replace(this.authorizationCodeURL());
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
    return this.http.post<any>(`${this.backendAPI}/api/token`, undefined, {
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

    console.log(`Refresh token is: ${refresh_token}`);
    return this.http.post<any>(`${this.backendAPI}/api/token`, undefined, {
      params,
    });
  }
  authorizationCodeFlow(code?: string): Observable<any> | void {
    if (!code) this.authorizationCodeRedirect();
    else return this.authorizationCodeToken(code);
  }

  getRefreshedToken(): Observable<TokenDTO> {
    return this.http.get<TokenDTO>(`/api/oauth/spotify/refresh`);
  }

  logout() {
    return this.http.delete(`/api/oauth/spotify`);
  }
}
