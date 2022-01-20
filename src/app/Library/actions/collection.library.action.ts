import { createAction, props } from '@ngrx/store';
import { FolderDTO } from 'src/app/Shared/models/folder.dto';
import { TrackDTO } from 'src/app/Shared/models/track.dto';
import { TraktorLibrary } from '../models/library';

//Parse library
export const parseLocalLibrary = createAction(
  '[Library - Parser] Parse uploaded library',
  props<{ library: File }>(),
);
export const parseLocalLibrarySuccess = createAction(
  '[Library - Parser] Parse uploaded library Success',
  props<{ library: TraktorLibrary }>(),
);
export const parseLocalLibraryFailure = createAction(
  '[Library - Parser] Parse uploaded library Failure',
  props<{ payload: any }>(),
);

//Get tracks
export const loadLibrary = createAction('[Library] Load Library  Tracks');
export const loadLibrarySuccess = createAction(
  '[Library] Load Library Tracks Success',
  props<{ tracks: TrackDTO[] }>(),
);
export const loadLibraryFailure = createAction(
  '[Library] Load Library Tracks Failure',
  props<{ payload: any }>(),
);

//Match Library
export const matchLibrary = createAction('[Library] Match Library');
export const matchLibrarySuccess = createAction(
  '[Library] Match Library Success',
  props<{ tracks: TrackDTO[] | undefined }>(),
);
export const matchLibraryFailure = createAction(
  '[Library] Match Library Failure',
  props<{ payload: any }>(),
);

//Match Playlist
export const matchPlaylist = createAction('[Library] Match Playlist');
export const matchPlaylistSuccess = createAction(
  '[Library] Match Playlist Success',
  props<{ tracks: TrackDTO[] | undefined }>(),
);
export const matchPlaylistFailure = createAction(
  '[Library] Match Playlist Failure',
  props<{ payload: any }>(),
);

//Filter Library
export const filterLibrary = createAction(
  '[Library] Filter Library',
  props<{ value: string; fields?: (keyof TrackDTO)[] }>(),
);
export const filterLibrarySuccess = createAction(
  '[Library] Filter Library Success',
  props<{ tracks: TrackDTO[] | undefined }>(),
);
export const filterLibraryFailure = createAction(
  '[Library] Filter Library Failure',
  props<{ payload: any }>(),
);

//Filter Playlist
export const filterPlaylist = createAction(
  '[Library - Playlist] Filter Playlist',
  props<{ value: string; fields?: (keyof TrackDTO)[] }>(),
);
export const filterPlaylistSuccess = createAction(
  '[Library - Playlist] Filter Playlist Success',
  props<{ tracks: TrackDTO[] | undefined }>(),
);
export const filterPlaylistFailure = createAction(
  '[Library - Playlist] Filter Playlist Failure',
  props<{ payload: any }>(),
);

//Update Playlists Tree
export const updateTree = createAction('[Library] Update Playlists');
export const updateTreeSuccess = createAction(
  '[Library] Update Playlists Success',
  props<{ playlists: FolderDTO | undefined }>(),
);
export const updateTreeFailure = createAction(
  '[Library] Update Playlists Failure',
  props<{ payload: any }>(),
);
