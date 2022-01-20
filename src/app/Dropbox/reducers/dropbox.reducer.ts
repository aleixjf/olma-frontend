import { Action, createReducer } from '@ngrx/store';
import { DropboxState, initialState } from '../models/dropbox.state';

const _dropboxReducer = createReducer(initialState);

export function dropboxReducer(
  state: DropboxState | undefined,
  action: Action,
) {
  return _dropboxReducer(state, action);
}
