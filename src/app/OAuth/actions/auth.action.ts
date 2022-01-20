import { createAction, props } from '@ngrx/store';

/***************************************/
/***** PKCE Authentication effects *****/
/***************************************/

//PKCE Generation
export const storePKCE = createAction(
  '[Auth] PKCE verifier + challenge successfully stored',
  props<{ pkce: object }>(),
);

//PKCE Generation
export const generatePKCE = createAction(
  '[Auth] Generate PKCE verifier + challenge',
);
export const generatePKCESuccess = createAction(
  '[Auth] PKCE verifier + challenge successfully generated',
  props<{ pkce: object }>(),
);
export const generatePKCEFailure = createAction(
  "[Auth] PKCE verifier + challenge could'nt be generated",
  props<{ payload: any }>(),
);

//Refresh tokens
export const refreshTokens = createAction(
  '[Auth] Get refreshed tokens',
  props<{ refresh_token: string }>(),
);
export const refreshTokensSuccess = createAction(
  '[Auth] Tokens have been succesfully refreshed',
  props<{ tokens: any }>(),
);
export const refreshTokensFailure = createAction(
  "[Auth] Couldn't refresh tokens",
  props<{ payload: any }>(),
);

//Retrieve OAuth tokens
export const getTokens = createAction('[Auth] Get third-party tokens');
export const getTokensSuccess = createAction(
  '[Auth] Succesfully retrieved the third-party tokens',
  props<{ tokens: any }>(),
);
export const getTokensFailure = createAction(
  "[Auth] Couldn't retrieve the third-party tokens",
  props<{ payload: any }>(),
);
