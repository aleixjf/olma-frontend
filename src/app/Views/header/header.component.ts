//Angular
import { Component } from '@angular/core';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as AuthActions from 'src/app/Auth/actions';
import * as AuthState from 'src/app/Auth/models/auth.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  authenticated!: boolean;
  admin!: boolean;

  constructor(private store: Store<AppState>) {
    this.store.select('auth').subscribe((response: AuthState.AuthState) => {
      this.authenticated = response.authenticated;
      this.admin = response.admin;
    });
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
