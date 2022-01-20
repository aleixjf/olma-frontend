//Angular
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

//RxJS
import { Observable } from 'rxjs';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as AuthState from 'src/app/Auth/models/auth.state';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private access_token: string | undefined;

  constructor(private store: Store<AppState>, private router: Router) {
    this.access_token = undefined; //this.localStorageService.get('access_token');

    this.store.select('auth').subscribe((response: AuthState.AuthState) => {
      if (response.credentials)
        this.access_token = response.credentials.tokens?.olma.jwt;
      else this.access_token = undefined;
    });
  }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.access_token) return true;
    else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
