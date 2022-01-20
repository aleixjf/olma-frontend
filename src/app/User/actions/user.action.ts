import { createAction, props } from '@ngrx/store';
import { UserDTO } from '../models/user.dto';

//Get users
export const getUsers = createAction('[User] Get Users');
export const getUsersSuccess = createAction(
  '[User] Get User Success',
  props<{ user: UserDTO }>(),
);
export const getUsersFailure = createAction(
  '[User] Get User Failure',
  props<{ payload: any }>(),
);

//Get user
export const getUser = createAction(
  '[User] Get User',
  props<{ uuid: string }>(),
);
export const getUserSuccess = createAction(
  '[User] Get User Success',
  props<{ user: UserDTO }>(),
);
export const getUserFailure = createAction(
  '[User] Get User Failure',
  props<{ payload: any }>(),
);

//Register user
export const registerUser = createAction(
  '[User] Register user',
  props<{ user: UserDTO }>(),
);
export const registerUserSuccess = createAction(
  '[User] User has been succesfully registered',
  props<{ user: UserDTO }>(),
);
export const registerUserFailure = createAction(
  '[User] An error occured while registering the user',
  props<{ payload: any }>(),
);

//Update user information
export const updateUserInformation = createAction(
  '[User - Profile] Update user information',
  props<{ user: UserDTO }>(),
);
export const updateUserInformationSuccess = createAction(
  '[User - Profile] User information updated successfully',
  props<{ user: UserDTO }>(),
);
export const updateUserInformationFailure = createAction(
  "[User - Profile] Couldn't update user's information",
  props<{ payload: any }>(),
);

//Update user password
export const updateUserPassword = createAction(
  "[User] Update user's password",
  props<{ user: UserDTO; password: string }>(),
);
export const updateUserPasswordSuccess = createAction(
  '[User] Password updated successfully',
);
export const updateUserPasswordFailure = createAction(
  "[User] Couldn't update user's password",
  props<{ payload: any }>(),
);
