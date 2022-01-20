//Angular
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
//NgRX - Actions
import * as SpotifyActions from 'src/app/Spotify/actions';
import * as OneDriveActions from 'src/app/OneDrive/actions';
import * as DropboxActions from 'src/app/Dropbox/actions';
//NgRX - States
import { AuthState } from 'src/app/Auth/models/auth.state';
import { OAuthState } from 'src/app/OAuth/models/oauth.state';

//Models
import { TokenDTO } from 'src/app/Shared/models/token.dto';
import { OAuthCallback } from '../../models/oauth-callback.interface copy';

@Component({
  selector: 'app-oauth-callback',
  templateUrl: './oauth-callback.component.html',
  styleUrls: ['./oauth-callback.component.scss'],
})
export class OAuthCallbackComponent {
  private uuid!: string | undefined;
  authorized!: boolean;
  platform!: string;
  state!: string;
  flow!: string;
  flow_state!: string | undefined;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.platform = params['platform'];
      if (!this.platform) console.log('No platform detected');
    });
    this.store.select('auth').subscribe((response: AuthState) => {
      if (response.credentials) this.uuid = response.credentials.uuid;
      else this.uuid = undefined;
      /*
        if (response.credentials && response.credentials.tokens) {
          switch(this.platform) {
            case 'spotify':
              if (response.credentials.tokens.spotify) this.authorized = true
              else this.authorized = false
              break;
            default:
              this.authorized = false;
          }
        }
        */
    });
    this.store.select('oauth').subscribe((response: OAuthState) => {
      if (response.flow) {
        this.flow = response.flow;
        this.flow_state = response.state;
        /*
          INFO: This is to automatically start the OAuth flow when getting to the /auth endpoint
          if (this.flow_state == 'start') {
            switch(this.platform) {
              case 'spotify':
                if (this.flow == 'authentication_code') this.store.dispatch(SpotifyActions.authCode())
                else if (this.flow == 'implicit_grant') this.store.dispatch(SpotifyActions.implicitGrant())
                break;
              case 'onedrive':
                if (this.flow == 'authentication_code') this.store.dispatch(OneDriveActions.authCode())
                else if (this.flow == 'implicit_grant') this.store.dispatch(OneDriveActions.implicitGrant())
                break;
              case 'dropbox':
                if (this.flow == 'authentication_code') this.store.dispatch(DropboxActions.authCode())
                else if (this.flow == 'implicit_grant') this.store.dispatch(DropboxActions.implicitGrant())
                break;
              default:
                console.log();
            }
          }
          */
      }
    });
    this.route.fragment.subscribe((fragment) => {
      //console.log(fragment)
      if (fragment) {
        const params = new URLSearchParams(fragment);

        const error = params.get('error');
        const error_description = params.get('error_description');

        const state = params.get('state');
        const code = params.get('code');
        const id_token = params.get('it_token');

        const jwt = params.get('access_token');
        const expires_in = params.get('expires_in')
          ? parseInt(params.get('expires_in')!)
          : undefined;
        const token_type = params.get('token_type');

        const response = {
          error,
          error_description,
          state,
          code,
          id_token,
          jwt,
          expires_in,
          token_type,
        };
        this.handleCallback(response);
      }
    });
    this.route.queryParams.subscribe((params) => {
      //console.dir(params);
      if (params) {
        const error = params.error;
        const error_description = params.error_description;

        const state = params.state;
        const code = params.code;
        const id_token = params.id_token;

        const jwt = params.access_token;
        const expires_in = params.expires_in;
        const token_type = params.token_type;

        const response = {
          error,
          error_description,
          state,
          code,
          id_token,
          jwt,
          expires_in,
          token_type,
        };
        this.handleCallback(response);
      }
    });
  }

  handleCallback(response: OAuthCallback): void {
    if (this.flow == 'authentication_code' && response.code) {
      switch (this.platform) {
        case 'spotify':
          this.store.dispatch(
            SpotifyActions.authCodeRetrieveCodeSuccess({ code: response.code }),
          );
          break;
        case 'onedrive':
          this.store.dispatch(
            OneDriveActions.authCodeRetrieveCodeSuccess({
              code: response.code,
            }),
          );
          break;
        case 'dropbox':
          this.store.dispatch(
            DropboxActions.authCodeRetrieveCodeSuccess({ code: response.code }),
          );
          break;
        default:
          console.log();
      }
    } else if (this.flow == 'implicit_grant' && response.jwt) {
      const access_token: TokenDTO = new TokenDTO(
        this.uuid!,
        response.jwt,
        undefined,
        response.expires_in ? response.expires_in : undefined,
        undefined,
        this.platform,
      );
      switch (this.platform) {
        case 'spotify':
          this.store.dispatch(
            SpotifyActions.implicitGrantRetrieveTokenSuccess({ access_token }),
          );
          break;
        case 'onedrive':
          this.store.dispatch(
            OneDriveActions.implicitGrantRetrieveTokenSuccess({ access_token }),
          );
          break;
        case 'dropbox':
          this.store.dispatch(
            DropboxActions.implicitGrantRetrieveTokenSuccess({ access_token }),
          );
          break;
        default:
          console.log();
      }
    } else if (response.error) {
      const payload = {
        message: response.error_description,
      };
      switch (this.platform) {
        case 'spotify':
          if (this.flow == 'authentication_code')
            this.store.dispatch(
              SpotifyActions.authCodeRetrieveCodeFailure({ payload }),
            );
          else if (this.flow == 'implicit_grant')
            this.store.dispatch(
              SpotifyActions.implicitGrantRetrieveTokenFailure({ payload }),
            );
          break;
        case 'onedrive':
          if (this.flow == 'authentication_code')
            this.store.dispatch(
              OneDriveActions.authCodeRetrieveCodeFailure({ payload }),
            );
          else if (this.flow == 'implicit_grant')
            this.store.dispatch(
              OneDriveActions.implicitGrantRetrieveTokenFailure({ payload }),
            );
          break;
        case 'dropbox':
          if (this.flow == 'authentication_code')
            this.store.dispatch(
              DropboxActions.authCodeRetrieveCodeFailure({ payload }),
            );
          else if (this.flow == 'implicit_grant')
            this.store.dispatch(
              DropboxActions.implicitGrantRetrieveTokenFailure({ payload }),
            );
          break;
        default:
          console.log();
      }
    } else {
    }
  }

  send() {
    this.route.fragment.subscribe((fragment) => {
      //console.log(fragment)
      if (fragment) {
        const params = new URLSearchParams(fragment);

        const error = params.get('error');
        const error_description = params.get('error_description');

        const state = params.get('state');
        const code = params.get('code');
        const id_token = params.get('it_token');

        const jwt = params.get('access_token');
        const expires_in = params.get('expires_in')
          ? parseInt(params.get('expires_in')!)
          : undefined;
        const token_type = params.get('token_type');

        const response = {
          error,
          error_description,
          state,
          code,
          id_token,
          jwt,
          expires_in,
          token_type,
        };
        this.handleCallback(response);
      }
    });
    this.route.queryParams.subscribe((params) => {
      //console.dir(params);
      if (params) {
        const error = params.error;
        const error_description = params.error_description;

        const state = params.state;
        const code = params.code;
        const id_token = params.id_token;

        const jwt = params.access_token;
        const expires_in = params.expires_in;
        const token_type = params.token_type;

        const response = {
          error,
          error_description,
          state,
          code,
          id_token,
          jwt,
          expires_in,
          token_type,
        };
        this.handleCallback(response);
      }
    });
  }
}
