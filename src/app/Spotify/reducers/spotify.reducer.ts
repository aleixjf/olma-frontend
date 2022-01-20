import * as SpotifyActions from 'src/app/Spotify/actions';
import { Action, createReducer, on } from '@ngrx/store';
import { SpotifyState, initialState } from '../models/spotify.state';

const _spotifyReducer = createReducer(
  initialState,
  on(SpotifyActions.loadLibrary, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(SpotifyActions.loadLibrarySuccess, (state, action) => ({
    ...state,
    tracks: [...action.tracks.map((item) => item.track)],
    error: null,
    pending: false,
  })),
  on(SpotifyActions.loadLibraryFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),
);

export function spotifyReducer(
  state: SpotifyState | undefined,
  action: Action,
) {
  return _spotifyReducer(state, action);
}
