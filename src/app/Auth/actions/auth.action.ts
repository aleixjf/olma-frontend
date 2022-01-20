import { createAction, props } from '@ngrx/store';
import { CredentialsDTO } from '../models/credentials.dto';

/*************************/
/***** Login actions *****/
/*************************/

//Login
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: CredentialsDTO }>(), //The parameters we send to the back-end
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: any }>(), //The response we receive from the back-end
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ payload: any }>(), //The error response we receive from the back-end
);

//Login Redirect
export const loginRedirect = createAction('[Auth] Login Redirect');

/**************************/
/***** Logout actions *****/
/**************************/

export const logout = createAction('[Auth] Logout');
