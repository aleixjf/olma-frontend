//NgRX
import { Action, on } from '@ngrx/store';
//NgRX - State
import { OAuthState, initialState } from '../models/oauth.state';
import { createRehydrateReducer } from 'src/app/Shared/services/rehydrate-store';
//NgRX - Actions
import { logout } from 'src/app/Auth/actions';
import {
  storePKCE,
  generatePKCE,
  generatePKCESuccess,
  generatePKCEFailure,
} from 'src/app/OAuth/actions';
import * as SpotifyActions from 'src/app/Spotify/actions';
import * as OneDriveActions from 'src/app/OneDrive/actions';
import * as DropboxActions from 'src/app/Dropbox/actions';

/*
const _authReducer = createReducer(
    initialState,
*/

const localStorageKey = 'oauthStore';
const localState = localStorage.getItem(localStorageKey);

export const _oauthReducer = createRehydrateReducer(
  localStorageKey,
  (localState && JSON.parse(localState)) ?? initialState,

  /***************************/
  /***** Logout reducers *****/
  /***************************/

  on(logout, () => initialState),

  /***************************/
  /***** PKCE reducers *****/
  /***************************/

  on(storePKCE, (state, action) => ({
    ...state,
    pkce: action.pkce,
  })),

  on(generatePKCE, (state) => ({
    ...state,
    pkce: null,
    pending: true,
  })),
  on(generatePKCESuccess, (state, action) => ({
    ...state,
    pkce: action.pkce,
    pending: false,
  })),

  /******************************************/
  /***** Spotify Authorization reducers *****/
  /******************************************/

  //Authentication Code Flow
  on(SpotifyActions.authCode, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'start',
    pending: true,
  })),

  on(SpotifyActions.authCodeRetrieveCode, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'code',
    pending: true,
  })),
  on(SpotifyActions.authCodeRetrieveCodeSuccess, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'code',
    pending: false,
  })),

  on(SpotifyActions.authCodeRetrieveToken, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'token',
    pending: true,
  })),
  on(SpotifyActions.authCodeRetrieveTokenSuccess, () => initialState),

  on(SpotifyActions.authCodeRefreshToken, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'refresh',
    pending: true,
  })),
  on(SpotifyActions.authCodeRefreshTokenSuccess, () => initialState),

  //Implicit Grant Flow
  on(SpotifyActions.implicitGrant, (state) => ({
    ...state,
    flow: 'implicit_grant',
    state: 'start',
    pending: true,
  })),

  on(SpotifyActions.implicitGrantRetrieveToken, (state) => ({
    ...state,
    flow: 'implicit_grant',
    state: 'token',
    pending: true,
  })),
  on(SpotifyActions.implicitGrantRetrieveTokenSuccess, () => initialState),

  /*******************************************/
  /***** OneDrive Authorization reducers *****/
  /*******************************************/

  //Authentication Code Flow
  on(OneDriveActions.authCode, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'start',
    pending: true,
  })),

  on(OneDriveActions.authCodeRetrieveCode, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'code',
    pending: true,
  })),
  on(OneDriveActions.authCodeRetrieveCodeSuccess, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'code',
    pending: false,
  })),

  on(OneDriveActions.authCodeRetrieveToken, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'token',
    pending: true,
  })),
  on(OneDriveActions.authCodeRetrieveTokenSuccess, () => initialState),

  on(OneDriveActions.authCodeRefreshToken, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'refresh',
    pending: true,
  })),
  on(OneDriveActions.authCodeRefreshTokenSuccess, () => ({
    initialState,
  })),

  //Implicit Grant Flow
  on(OneDriveActions.implicitGrant, (state) => ({
    ...state,
    flow: 'implicit_grant',
    state: 'start',
    pending: true,
  })),

  on(OneDriveActions.implicitGrantRetrieveToken, (state) => ({
    ...state,
    flow: 'implicit_grant',
    state: 'token',
    pending: true,
  })),
  on(OneDriveActions.implicitGrantRetrieveTokenSuccess, () => initialState),

  /******************************************/
  /***** Dropbox Authorization reducers *****/
  /******************************************/

  //Authentication Code Flow
  on(DropboxActions.authCode, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'start',
    pending: true,
  })),

  on(DropboxActions.authCodeRetrieveCode, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'code',
    pending: true,
  })),
  on(DropboxActions.authCodeRetrieveCodeSuccess, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'code',
    pending: false,
  })),

  on(DropboxActions.authCodeRetrieveToken, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'token',
    pending: true,
  })),
  on(DropboxActions.authCodeRetrieveTokenSuccess, () => initialState),

  on(DropboxActions.authCodeRefreshToken, (state) => ({
    ...state,
    flow: 'authentication_code',
    state: 'refresh',
    pending: true,
  })),
  on(DropboxActions.authCodeRefreshTokenSuccess, () => initialState),

  //Implicit Grant Flow
  on(DropboxActions.implicitGrant, (state) => ({
    ...state,
    flow: 'implicit_grant',
    state: 'start',
    pending: true,
  })),

  on(DropboxActions.implicitGrantRetrieveToken, (state) => ({
    ...state,
    flow: 'implicit_grant',
    state: 'token',
    pending: true,
  })),
  on(DropboxActions.implicitGrantRetrieveTokenSuccess, () => initialState),
);

export function oauthReducer(state: OAuthState | undefined, action: Action) {
  return _oauthReducer(state, action);
}
