import { createAction, props } from '@ngrx/store';
import { TrackDTO } from 'src/app/Shared/models/track.dto';

//Get track
export const getTrack = createAction(
  '[Library - Track] Get Track',
  props<{ trackId: string | number | undefined }>(),
);
export const getTrackSuccess = createAction(
  '[Library - Track] Get Track Success',
  props<{ track: TrackDTO }>(),
);
export const getTrackFailure = createAction(
  '[Library - Track] Get Track Failure',
  props<{ payload: any }>(),
);

//Update track
export const updateTrack = createAction(
  '[Library - Track] Update Track',
  props<{ track: TrackDTO }>(),
);
export const updateTrackSuccess = createAction(
  '[Library - Track] Update Track Success',
  props<{ track: TrackDTO }>(),
);
export const updateTrackFailure = createAction(
  '[Library - Track] Update Track Failure',
  props<{ payload: any }>(),
);

//Create track
export const createTrack = createAction(
  '[Library - Track] Create Track',
  props<{ track: TrackDTO }>(),
);
export const createTrackSuccess = createAction(
  '[Library - Track] Create Track Success',
  props<{ track: TrackDTO }>(),
);
export const createTrackFailure = createAction(
  '[Library - Track] Create Track Failure',
  props<{ payload: any }>(),
);

//Delete track
export const deleteTrack = createAction(
  '[Library - Track] Delete Track',
  props<{ track: TrackDTO | number | string }>(),
);
export const deleteTrackSuccess = createAction(
  '[Library - Track] Delete Track Success',
  props<{ track: TrackDTO | number | string }>(),
);
export const deleteTrackFailure = createAction(
  '[Library - Track] Delete Track Failure',
  props<{ payload: any }>(),
);
