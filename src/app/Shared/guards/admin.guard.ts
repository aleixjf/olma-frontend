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
export class AdminGuard implements CanActivate {
  private access_token: string | undefined;
  private admin_rights: boolean;

  constructor(private store: Store<AppState>, private router: Router) {
    this.access_token = undefined;
    this.admin_rights = false;

    this.store.select('auth').subscribe((response: AuthState.AuthState) => {
      if (response.credentials) {
        this.access_token = response.credentials.tokens?.olma.jwt;
        this.admin_rights = response.admin;
      } else {
        this.access_token = undefined;
        this.admin_rights = false;
      }
    });
  }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.access_token && this.admin_rights) return true;
    else if (this.access_token) {
      this.router.navigate(['/unauthorized']);
      return false;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
