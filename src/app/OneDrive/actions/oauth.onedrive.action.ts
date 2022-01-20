import { createAction, props } from '@ngrx/store';
import { TokenDTO } from 'src/app/Shared/models/token.dto';

/***************************************/
/***** Implicit Grant Flow actions *****/
/***************************************/

//Implicit Grant Flow
export const implicitGrant = createAction(
  '[OneDrive - Implicit Grant Flow] Flow started',
);

//Implicit Grant Flow - Token
export const implicitGrantRetrieveToken = createAction(
  '[OneDrive - Implicit Grant Flow] Retrieve the access token',
);
export const implicitGrantRetrieveTokenSuccess = createAction(
  '[OneDrive - Implicit Grant Flow] Succesfully retrieved the access token',
  props<{ access_token: TokenDTO }>(),
);
export const implicitGrantRetrieveTokenFailure = createAction(
  "[OneDrive - Implicit Grant Flow] Couldn't retrieve the the access token",
  props<{ payload: any }>(),
);

/*******************************************/
/***** Authorization Code Flow actions *****/
/*******************************************/

//Authorization Code Flow
export const authCode = createAction(
  '[OneDrive - Authentication Code Flow] Flow started',
);

//Authorization Code Flow - Code
export const authCodeRetrieveCode = createAction(
  '[OneDrive - Authentication Code Flow] Retrieve the Authoriaztion Code',
);
export const authCodeRetrieveCodeSuccess = createAction(
  '[OneDrive - Authentication Code Flow] Succesfully retrieved the Authoriaztion Code',
  props<{ code: string }>(),
);
export const authCodeRetrieveCodeFailure = createAction(
  "[OneDrive - Authentication Code Flow] Couldn't retrieve the the Authoriaztion Code",
  props<{ payload: any }>(),
);

//Authorization Code Flow - Tokens
export const authCodeRetrieveToken = createAction(
  '[OneDrive - Authentication Code Flow] Retrieve the tokens',
  props<{ code: string }>(),
);
export const authCodeRetrieveTokenSuccess = createAction(
  '[OneDrive - Authentication Code Flow] Access + Refresh tokens retrieved successfully',
  props<{ access_token: TokenDTO; refresh_token: TokenDTO }>(),
);
export const authCodeRetrieveTokenFailure = createAction(
  "[OneDrive - Authentication Code Flow] Couldn't retrieve the tokens",
  props<{ payload: any }>(),
);

//Authorization Code Flow - Refresh
export const authCodeRefreshToken = createAction(
  '[OneDrive - Authentication Code Flow] Refresh the tokens',
  props<{ refresh_token: string }>(),
);
export const authCodeRefreshTokenSuccess = createAction(
  '[OneDrive - Authentication Code Flow] Access + Refresh tokens refreshed successfully',
  props<{ access_token: TokenDTO; refresh_token: TokenDTO | null }>(),
);
export const authCodeRefreshTokenFailure = createAction(
  "[OneDrive - Authentication Code Flow] Couldn't refresh the tokens",
  props<{ payload: any }>(),
);

/*****************************************************/
/***** Authorization Code Flow (BackEnd) actions *****/
/*****************************************************/

//Refresh access token on Backend
export const refreshToken = createAction(
  '[OneDrive - Authentication Code Flow (BackEnd)] Refresh the access token (on BackEnd)',
);
export const refreshTokenSuccess = createAction(
  '[OneDrive - Authentication Code Flow (BackEnd)] Succesfully refreshed the access token (on BackEnd)',
  props<{ access_token: TokenDTO }>(),
);
export const refreshTokenFailure = createAction(
  "[OneDrive - Authentication Code Flow (BackEnd)] Couldn't refresh the access token (on BackEnd)",
  props<{ payload: any }>(),
);

//Save refresh tokens on Backend
export const saveRefreshToken = createAction(
  '[OneDrive - Authentication Code Flow (BackEnd)] Save the refresh token on the backend database',
  props<{ refresh_token: TokenDTO }>(),
);
export const saveRefreshTokenSuccess = createAction(
  '[OneDrive - Authentication Code Flow (BackEnd)] Refresh token succesfully saved on the backend database',
);
export const saveRefreshTokenFailure = createAction(
  "[OneDrive - Authentication Code Flow (BackEnd)] Couldn't save the refresh token on the backend database",
  props<{ payload: any }>(),
);
export const noRefreshToken = createAction(
  "[OneDrive - Authentication Code Flow (BackEnd)] OneDrive API didn't return any refresh token...",
);
