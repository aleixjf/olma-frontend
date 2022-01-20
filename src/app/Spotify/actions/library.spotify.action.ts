import { createAction, props } from '@ngrx/store';
import { PlayedTrack } from '../interfaces/played-track';

/***************************/
/***** Library actions *****/
/***************************/

//Load library tracks (user liked tracks)
export const loadLibrary = createAction(
  '[Spotify - Library] Load tracks from user library',
);
export const loadLibrarySuccess = createAction(
  '[Spotify - Library] Load tracks from user library success',
  props<{ tracks: SpotifyApi.SavedTrackObject[] }>(),
);
export const loadLibraryFailure = createAction(
  '[Spotify - Library] Load tracks from user library failure',
  props<{ payload: any }>(),
);

//Load recently played tracks
export const loadRecentlyPlayedTracks = createAction(
  '[Home/Load Recent Played Tracks]',
);
export const loadRecentlyPlayedSuccess = createAction(
  '[Home/Load Recent Played Tracks Success]',
  props<{
    response: SpotifyApi.CursorBasedPagingObject<PlayedTrack>;
  }>(),
);
export const loadRecentlyPlayedError = createAction(
  '[Home/Load Recent Played Tracks Error]',
  props<{ error: string }>(),
);
