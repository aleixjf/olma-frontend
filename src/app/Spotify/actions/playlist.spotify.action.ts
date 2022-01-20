import { createAction, props } from '@ngrx/store';

/***************************/
/***** Playlist actions ****/
/***************************/

//Load user playlists
export const loadPlaylists = createAction(
  '[Spotify - Library] Load user playlists',
);
export const loadPlaylistsSuccess = createAction(
  '[Spotify - Library]  Load user playlists success',
  props<{
    playlists: SpotifyApi.ListOfUsersPlaylistsResponse;
  }>(),
);
export const loadPlaylistsError = createAction(
  '[Spotify - Library] Load user playlists failure',
  props<{ error: string }>(),
);

//Load user playlists
export const loadFeaturedPlaylists = createAction(
  '[Home/Load Featured Playlists]',
);
export const loadFeaturedPlaylistsSuccess = createAction(
  '[Spotify - Library]',
  props<{
    response: SpotifyApi.ListOfFeaturedPlaylistsResponse;
  }>(),
);
export const loadFeaturedPlaylistsError = createAction(
  '[Spotify - Library]',
  props<{ error: string }>(),
);

/*
export const loadPlaylistSuccess = createAction(
  '[Playlists Store/Load Playlist By Id success]',
  props<{
    playlist: SpotifyApi.PlaylistObjectSimplified;
  }>()
);
*/

//Get playlist tracks
export const loadPlaylist = createAction(
  '[Spotify - Library] Load tracks from playlist',
  props<{ playlistId: string }>(),
);
export const loadPlaylistSuccess = createAction(
  '[Spotify - Library] Load tracks from playlist success',
  props<{
    playlistId: string;
    playlistTracks: SpotifyApi.PlaylistTrackResponse;
  }>(),
);
export const loadPlaylistError = createAction(
  '[Spotify - Library] Load tracks from playlist failure',
  props<{ error: string }>(),
);

/*
export const setPlaylistTracksStateStatus = createAction(
    '[Playlist Tracks/Set Playlist Tracks Status]',
    props<{ status: GenericStoreStatus }>()
);
*/
