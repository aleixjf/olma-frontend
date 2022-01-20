import { Action, createReducer } from '@ngrx/store';
import { OneDriveState, initialState } from '../models/onedrive.state';

const _onedriveReducer = createReducer(initialState);

export function onedriveReducer(
  state: OneDriveState | undefined,
  action: Action,
) {
  return _onedriveReducer(state, action);
}
