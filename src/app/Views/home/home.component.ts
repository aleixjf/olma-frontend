import { Component } from '@angular/core';

//DEBUG
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as SpotifyActions from 'src/app/Spotify/actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private authenticated = false;

  constructor(private store: Store<AppState>) {
    this.store.select('auth').subscribe((response) => {
      this.authenticated = response.authenticated;
    });
  }

  spotify() {
    if (this.authenticated) this.store.dispatch(SpotifyActions.authCode());
    else this.store.dispatch(SpotifyActions.implicitGrant());
  }

  dropbox() {
    if (this.authenticated) this.store.dispatch(SpotifyActions.authCode());
    else this.store.dispatch(SpotifyActions.implicitGrant());
  }
}
