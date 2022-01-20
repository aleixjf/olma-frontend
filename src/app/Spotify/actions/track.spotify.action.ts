import { createAction, props } from '@ngrx/store';
import { TrackDTO } from 'src/app/Shared/models/track.dto';

/*****************************************/
/***** Spotify Track actions *****/
/*****************************************/

//Get track
export const getTrack = createAction(
  '[Spotify - Library] Get Track',
  props<{ trackId: number }>(),
);
export const getTrackSuccess = createAction(
  '[Spotify - Library] Get Track Success',
  props<{ track: TrackDTO }>(),
);
export const getTrackFailure = createAction(
  '[Spotify - Library] Get Track Failure',
  props<{ payload: any }>(),
);

//Update track
export const updateTrack = createAction(
  '[Spotify - Library] Update Track',
  props<{ track: TrackDTO }>(),
);
export const updateTrackSuccess = createAction(
  '[Spotify - Library] Update Track Success',
  props<{ track: TrackDTO }>(),
);
export const updateTrackFailure = createAction(
  '[Spotify - Library] Update Track Failure',
  props<{ payload: any }>(),
);

/*
//Create track
export const createTrack = createAction('[Spotify - Library] Create Track',
    props<{ track: TrackDTO }>()
);
export const createTrackSuccess = createAction('[Spotify - Library] Create Track Success',
    props<{ track: TrackDTO }>()
);
export const createTrackFailure = createAction(
    '[Spotify - Library] Create Track Failure',
    props<{ payload: any }>()
);
*/

//Delete track
export const deleteTrack = createAction(
  '[Spotify - Library] Delete Track',
  props<{ track: TrackDTO | number }>(),
);
export const deleteTrackSuccess = createAction(
  '[Spotify - Library] Delete Track Success',
);
export const deleteTrackFailure = createAction(
  '[Spotify - Library] Delete Track Failure',
  props<{ payload: any }>(),
);
