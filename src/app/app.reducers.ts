//NgRX
import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import * as fromRouter from '@ngrx/router-store';

//States
import { AuthState } from './Auth/models/auth.state';
import { OAuthState } from './OAuth/models/oauth.state';
import { UserState } from './User/models/user.state';
import { LibraryState } from './Library/models/library.state';
import { SpotifyState } from './Spotify/models/spotify.state';
import { OneDriveState } from './OneDrive/models/onedrive.state';
import { DropboxState } from './Dropbox/models/dropbox.state';

//Reducers
import * as AuthReducer from './Auth/reducers';
import * as OAuthReducer from './OAuth/reducers';
import * as UserReducer from './User/reducers';
import * as LibraryReducer from './Library/reducers';
import * as SpotifyReducer from './Spotify/reducers';
import * as OneDriveReducer from './OneDrive/reducers';
import * as DropboxReducer from './Dropbox/reducers';

//Effects
import { AuthEffects } from './Auth/effects/auth.effects';
import { OAuthEffects } from './OAuth/effects/oauth.effects';
import * as UserEffects from './User/effects';
import { LibraryEffects } from './Library/effects/library.effects';
import * as SpotifyEffects from './Spotify/effects';
import * as OneDriveEffects from './OneDrive/effects';
import * as DropboxEffects from './Dropbox/effects';

export interface AppState {
  router: fromRouter.RouterReducerState<any>;
  auth: AuthState;
  oauth: OAuthState;
  user: UserState;
  library: LibraryState;
  spotify: SpotifyState;
  onedrive: OneDriveState;
  dropbox: DropboxState;
}

export const appReducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  auth: AuthReducer.authReducer,
  oauth: OAuthReducer.oauthReducer,
  user: UserReducer.userReducer,
  library: LibraryReducer.libraryReducer,
  spotify: SpotifyReducer.spotifyReducer,
  onedrive: OneDriveReducer.onedriveReducer,
  dropbox: DropboxReducer.dropboxReducer,
};

export const EffectsArray: any[] = [
  AuthEffects,
  OAuthEffects,
  UserEffects.ProfileEffects,
  UserEffects.UserEffects,
  LibraryEffects,
  SpotifyEffects.OAuthEffects,
  SpotifyEffects.LibraryEffects,
  OneDriveEffects.OAuthEffects,
  DropboxEffects.OAuthEffects,
];
