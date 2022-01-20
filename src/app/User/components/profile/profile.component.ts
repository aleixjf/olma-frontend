//Angular
import { Component } from '@angular/core';
import { formatDate } from '@angular/common';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';

//NgRX - Actions
import * as UserActions from 'src/app/User/actions';
import * as SpotifyActions from 'src/app/Spotify/actions';
import * as OneDriveActions from 'src/app/OneDrive/actions';
import * as DropboxActions from 'src/app/Dropbox/actions';

//Models
import { UserState } from 'src/app/User/models/user.state';
import { UserDTO } from 'src/app/User/models/user.dto';
import { AuthState } from 'src/app/Auth/models/auth.state';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  spinner!: boolean;
  user: UserDTO | undefined;
  full_name!: string;
  formatted_date!: string;

  platforms!: any;

  constructor(private store: Store<AppState>) {
    this.store.select('user').subscribe((response: UserState) => {
      this.spinner = response.pending;
      if (response.user) {
        this.user = response.user;
        this.full_name = this.user.surname_2
          ? `${this.user.name} ${this.user.surname_1} ${this.user.surname_2}`.trim()
          : `${this.user.name} ${this.user.surname_1}`.trim();
        this.formatted_date = formatDate(
          this.user.birth_date,
          'yyyy-MM-dd',
          'en',
        );
      }
    });

    if (!this.user) this.store.dispatch(UserActions.getProfile());

    this.store.select('auth').subscribe((response: AuthState) => {
      if (response.credentials && response.credentials.tokens) {
        this.platforms = {};
        if (response.credentials.tokens.spotify) this.platforms.spotify = true;
        //if (response.credentials.tokens.tidal) this.platforms.spotify = true
        if (response.credentials.tokens.onedrive)
          this.platforms.onedrive = true;
        if (response.credentials.tokens.dropbox) this.platforms.dropbox = true;
      }
    });
  }

  oauthFlow(platform: string, flow = 'authentication_code'): void {
    switch (platform) {
      case 'spotify':
        if (this.platforms && !this.platforms.spotify) {
          if (flow == 'authentication_code')
            this.store.dispatch(SpotifyActions.authCode());
          else if (flow == 'implicit_grant')
            this.store.dispatch(SpotifyActions.implicitGrant());
        } else {
          console.log('You are already connected to Spotify!');
        }
        break;
      case 'onedrive':
        if (this.platforms && !this.platforms.onedrive) {
          if (flow == 'authentication_code')
            this.store.dispatch(OneDriveActions.authCode());
          else if (flow == 'implicit_grant')
            this.store.dispatch(OneDriveActions.implicitGrant());
        } else {
          console.log('You are already connected to OneDrive!');
        }
        break;
      case 'dropbox':
        if (this.platforms && !this.platforms.onedrive) {
          if (flow == 'authentication_code')
            this.store.dispatch(DropboxActions.authCode());
          else if (flow == 'implicit_grant')
            this.store.dispatch(DropboxActions.implicitGrant());
        } else {
          console.log('You are already connected to Dropbox!');
        }
        break;
      default:
        console.log();
    }
  }
}
