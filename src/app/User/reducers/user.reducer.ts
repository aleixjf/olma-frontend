//NgRX
import { Action, on } from '@ngrx/store';
//NgRX - State
import { UserState, initialState } from '../models/user.state';
import { createRehydrateReducer } from 'src/app/Shared/services/rehydrate-store';
//NgRX - Actions
import * as UserActions from '../actions';
import * as AuthActions from 'src/app/Auth/actions';

const localStorageKey = 'userStore';
const localState = localStorage.getItem(localStorageKey);

export const _userReducer = createRehydrateReducer(
  localStorageKey,
  (localState && JSON.parse(localState)) ?? initialState,

  on(AuthActions.logout, () => initialState),

  /****************************/
  /***** Profile reducers *****/
  /****************************/

  //Get Profile
  on(UserActions.getProfile, (state) => ({
    ...state,
    user: undefined,
    error: null,
    pending: true,
  })),
  on(UserActions.getProfileSuccess, (state, action) => ({
    ...state,
    user: action.user,
    error: null,
    pending: false,
  })),
  on(UserActions.getProfileFailure, (state, { payload }) => ({
    ...state,
    user: undefined,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  //Update information
  on(UserActions.updateInformation, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(UserActions.updateInformationSuccess, (state, action) => ({
    ...state,
    user: action.user,
    error: null,
    pending: false,
  })),
  on(UserActions.updateInformationFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  //Update password
  on(UserActions.updatePassword, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(UserActions.updatePasswordSuccess, (state) => ({
    ...state,
    //user: action.user, //INFO: No modification since the password isn't stored locally.
    error: null,
    pending: false,
  })),
  on(UserActions.updatePasswordFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  /**************************/
  /***** User reducers *****/
  /**************************/

  //Register user
  on(UserActions.registerUser, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(UserActions.registerUserSuccess, (state) => ({
    ...state,
    //user: action.user, //INFO: We don't want to store the user's information after registering. We want him to login with his new account.
    error: null,
    pending: false,
  })),
  on(UserActions.registerUserFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  //Get user
  on(UserActions.getUser, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(UserActions.getUserSuccess, (state, action) => ({
    ...state,
    user: action.user,
    error: null,
    pending: false,
  })),
  on(UserActions.getUserFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  //Update user information
  on(UserActions.updateUserInformation, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(UserActions.updateUserInformationSuccess, (state, action) => ({
    ...state,
    user: action.user,
    error: null,
    pending: false,
  })),
  on(UserActions.updateUserInformationFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  //Update user password
  on(UserActions.updateUserPassword, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(UserActions.updateUserPasswordSuccess, (state) => ({
    ...state,
    //user: action.user, //INFO: No modification since the password isn't stored locally.
    error: null,
    pending: false,
  })),
  on(UserActions.updateUserPasswordFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),
);

export function userReducer(state: UserState | undefined, action: Action) {
  return _userReducer(state, action);
}
