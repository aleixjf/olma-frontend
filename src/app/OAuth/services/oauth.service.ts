//Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { AuthState } from 'src/app/Auth/models/auth.state';

//RxJS
import { Observable } from 'rxjs';

//Models
import { OAuthResponse } from 'src/app/OAuth/models/oauth-response.interface';
import { TokenDTO } from 'src/app/Shared/models/token.dto';

//Other dependencies
//import * as CryptoJS from 'crypto-js'; //INFO: We don't need to import everything!
import { enc, SHA256 } from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class OAuthService {
  private backendAPI: string;
  private controller: string;
  private uuid!: string | undefined;

  constructor(private store: Store<AppState>, private http: HttpClient) {
    this.controller = 'oauth';
    this.backendAPI = `/api/${this.controller}`;
    this.store.select('auth').subscribe((response: AuthState) => {
      if (response.credentials) this.uuid = response.credentials.uuid;
      else this.uuid = undefined;
    });
  }

  randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  randomString(length: number): string {
    const arr = new Uint8Array(length);
    window.crypto.getRandomValues(arr);
    const validChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return String.fromCharCode(
      ...arr.map((x) => validChars.charCodeAt(x % validChars.length)),
    );
  }
  code_verifier(min: number, max: number): string {
    const length = this.randomNumber(min, max);
    return this.randomString(length);
  }

  base64urlencode(a: ArrayBuffer): string {
    return Buffer.from(a)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  async sha256(input: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    return window.crypto.subtle.digest('SHA-256', data);
  }
  async pkce_challenge(verifier: string): Promise<string> {
    return this.base64urlencode(await this.sha256(verifier));
  }
  /*
  async generate_pkce(){
    const code_verifier = this.code_verifier(43, 128);
    return {
      code_verifier,
      code_challenge: await this.pkce_challenge(code_verifier)
    }
  }
  */
  generate_pkce() {
    const code_verifier = this.code_verifier(43, 128);
    return {
      code_verifier,
      //code_challenge: CryptoJS.SHA256(code_verifier).toString(CryptoJS.enc.Base64).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      code_challenge: SHA256(code_verifier)
        .toString(enc.Base64)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, ''),
    };
  }

  generateTokens(
    response: OAuthResponse,
    provider?: string,
  ): { access_token: TokenDTO; refresh_token: TokenDTO | null } {
    const access_token: TokenDTO = new TokenDTO(
      this.uuid!,
      response.access_token,
      undefined,
      response.expires_in,
      undefined,
      provider,
    );
    let refresh_token!: TokenDTO | null;
    if (response.refresh_token)
      refresh_token = new TokenDTO(
        this.uuid!,
        response.refresh_token,
        undefined,
        undefined,
        undefined,
        provider,
      );
    return { access_token, refresh_token };
  }

  refreshTokens(refresh_token: string): Observable<any> {
    const body = { refresh_token };
    return this.http.post<any>(`${this.backendAPI}/refresh`, body);
  }

  saveRefreshToken(token: TokenDTO): Observable<any> {
    return this.http.post<any>(`${this.backendAPI}/token`, token);
  }

  getTokens(): Observable<any> {
    return this.http.get<any>(`${this.backendAPI}/tokens`);
  }
}
