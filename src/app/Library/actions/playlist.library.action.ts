import { createAction, props } from '@ngrx/store';
import { FolderDTO } from 'src/app/Shared/models/folder.dto';
import { PlaylistDTO } from 'src/app/Shared/models/playlist.dto';

//Get playlist
export const loadPlaylist = createAction(
  '[Library - Playlist] Load playlist',
  props<{ playlistId: string }>(),
);
export const loadPlaylistSuccess = createAction(
  '[Library - Playlist] Playlist loaded successfully',
  props<{ playlistId: string; playlist: PlaylistDTO }>(),
);
export const loadPlaylistFailure = createAction(
  "[Library - Playlist] Couldn't load playlist",
  props<{ payload: any }>(),
);

//Create playlist
export const createPlaylist = createAction(
  '[Library - Playlist] Create playlist',
  props<{ playlist: PlaylistDTO }>(),
);
export const createPlaylistSuccess = createAction(
  '[Library - Playlist] Playlist created successfully',
  props<{ playlist: PlaylistDTO; tree: FolderDTO }>(),
);
export const createPlaylistFailure = createAction(
  "[Library - Playlist] Couldn't create playlist",
  props<{ payload: any }>(),
);

//Update playlist
export const updatePlaylist = createAction(
  '[Library - Playlist] Update playlist',
  props<{ playlist: PlaylistDTO }>(),
);
export const updatePlaylistSuccess = createAction(
  '[Library - Playlist] Playlist updated successfully',
  props<{ playlist: PlaylistDTO; tree: FolderDTO }>(),
);
export const updatePlaylistFailure = createAction(
  "[Library - Playlist] Couldn't update playlist",
  props<{ payload: any }>(),
);
