//NgRX
import { Action, on } from '@ngrx/store';
//NgRX - Actions
import * as AuthActions from 'src/app/Auth/actions';
import * as DropboxActions from 'src/app/Dropbox/actions';
import * as OAuthActions from 'src/app/OAuth/actions';
import * as OneDriveActions from 'src/app/OneDrive/actions';
import { createRehydrateReducer } from 'src/app/Shared/services/rehydrate-store';
import * as SpotifyActions from 'src/app/Spotify/actions';
//NgRX - State
import { AuthState, initialState } from '../models/auth.state';

/*
const _authReducer = createReducer(
    initialState,
*/

const localStorageKey = 'authStore';
const localState = localStorage.getItem(localStorageKey);

export const _authReducer = createRehydrateReducer(
  localStorageKey,
  (localState && JSON.parse(localState)) ?? initialState,

  /**************************/
  /***** Login reducers *****/
  /**************************/

  on(AuthActions.login, (state) => ({
    ...state,
    authenticated: false,
    admin: false,
    error: null,
    pending: true,
  })),
  on(AuthActions.loginSuccess, (state, action) => ({
    ...state,
    credentials: {
      uuid: action.response.user,
      tokens: {
        olma: action.response.tokens.olma,
        olma_refresh: action.response.tokens.olma_refresh,
        /*
        spotify: action.response.tokens.spotify,
        dropbox: action.response.tokens.dropbox,
        onedrive: action.response.tokens.onedrive,
        */
      },
    },
    authenticated: true,
    admin: false, //TODO: manage admin state
    error: null,
    pending: false,
  })),
  on(AuthActions.loginFailure, (state, { payload }) => ({
    ...state,
    authenticated: false,
    admin: false,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  on(OAuthActions.refreshTokensSuccess, (state, action) => ({
    ...state,
    credentials: {
      uuid: state.credentials.uuid,
      tokens: {
        ...state.credentials.tokens,
        olma: action.tokens.olma,
        olma_refresh: action.tokens.olma_refresh,
      },
    },
  })),

  on(OAuthActions.getTokensSuccess, (state, action) => ({
    ...state,
    credentials: {
      uuid: state.credentials.uuid,
      tokens: {
        ...state.credentials.tokens,
        spotify: action.tokens.spotify,
        dropbox: action.tokens.dropbox,
        onedrive: action.tokens.onedrive,
      },
    },
  })),

  /***************************/
  /***** Logout reducers *****/
  /***************************/

  on(AuthActions.logout, () => initialState),

  /******************************************/
  /***** Spotify Authorization reducers *****/
  /******************************************/

  on(SpotifyActions.implicitGrantRetrieveTokenSuccess, (state, action) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        spotify: action.access_token,
      },
    },
  })),
  on(SpotifyActions.authCodeRetrieveTokenSuccess, (state, action) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        spotify: action.access_token,
        spotify_refresh: action.refresh_token,
      },
    },
  })),
  on(SpotifyActions.authCodeRefreshTokenSuccess, (state, action) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        spotify: action.access_token,
        spotify_refresh: action.refresh_token,
      },
    },
  })),
  on(SpotifyActions.refreshTokenSuccess, (state, action) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        spotify: action.access_token,
      },
    },
  })),
  on(SpotifyActions.saveRefreshTokenSuccess, (state) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        spotify_refresh: undefined,
      },
    },
  })),

  /*******************************************/
  /***** OneDrive Authorization reducers *****/
  /*******************************************/

  on(OneDriveActions.implicitGrantRetrieveTokenSuccess, (state, action) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        onedrive: action.access_token,
      },
    },
  })),
  on(OneDriveActions.authCodeRetrieveTokenSuccess, (state, action) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        onedrive: action.access_token,
        onedrive_refresh: action.refresh_token,
      },
    },
  })),
  on(OneDriveActions.authCodeRefreshTokenSuccess, (state, action) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        onedrive: action.access_token,
        onedrive_refresh: action.refresh_token,
      },
    },
  })),
  on(OneDriveActions.refreshTokenSuccess, (state, action) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        onedrive: action.access_token,
      },
    },
  })),
  on(OneDriveActions.saveRefreshTokenSuccess, (state) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        onedrive_refresh: undefined,
      },
    },
  })),

  /******************************************/
  /***** Dropbox Authorization reducers *****/
  /******************************************/

  on(DropboxActions.implicitGrantRetrieveTokenSuccess, (state, action) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        dropbox: action.access_token,
      },
    },
  })),
  on(DropboxActions.authCodeRetrieveTokenSuccess, (state, action) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        dropbox: action.access_token,
        dropbox_refresh: action.refresh_token,
      },
    },
  })),
  on(DropboxActions.authCodeRefreshTokenSuccess, (state, action) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        dropbox: action.access_token,
        dropbox_refresh: action.refresh_token,
      },
    },
  })),
  on(DropboxActions.refreshTokenSuccess, (state, action) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        dropbox: action.access_token,
      },
    },
  })),
  on(DropboxActions.saveRefreshTokenSuccess, (state) => ({
    ...state,
    credentials: {
      ...state.credentials,
      tokens: {
        ...state.credentials.tokens,
        dropbox_refresh: undefined,
      },
    },
  })),
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return _authReducer(state, action);
}
