import { createAction, props } from '@ngrx/store';
import { UserDTO } from '../models/user.dto';

//Get logged user info
export const getProfile = createAction('[User - Profile] Load user profile');
export const getProfileSuccess = createAction(
  '[User - Profile] Profile loaded successfully',
  props<{ user: UserDTO }>(),
);
export const getProfileFailure = createAction(
  "[User - Profile] Couldn't load user's profile",
  props<{ payload: any }>(),
);

//Update Information
export const updateInformation = createAction(
  '[User - Profile] Update user information',
  props<{ user: UserDTO }>(),
);
export const updateInformationSuccess = createAction(
  '[User - Profile] User information updated successfully',
  props<{ user: UserDTO }>(),
);
export const updateInformationFailure = createAction(
  "[User - Profile] Couldn't update user's information",
  props<{ payload: any }>(),
);

//Update Password
export const updatePassword = createAction(
  "[User - Profile] Update user's password",
  props<{ user: UserDTO; password: string }>(),
);
export const updatePasswordSuccess = createAction(
  '[User - Profile] Password updated successfully',
);
export const updatePasswordFailure = createAction(
  "[User - Profile] Couldn't update user's password",
  props<{ payload: any }>(),
);
