//NgRX
import { Action, createReducer, on } from '@ngrx/store';
//NgRX - State
import { LibraryState, initialState } from '../models/library.state';
//NgRX - Actions
import * as LibraryActions from '../actions';

const _libraryReducer = createReducer(
  initialState,

  on(LibraryActions.parseLocalLibrary, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(LibraryActions.parseLocalLibrarySuccess, (state, action) => ({
    ...state,
    collection: action.library,
    error: null,
    pending: false,
  })),
  on(LibraryActions.parseLocalLibraryFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  on(LibraryActions.loadLibrary, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(LibraryActions.loadLibrarySuccess, (state) => ({
    ...state,
    active: {
      tracks: state.collection?.tracks,
    },
    error: null,
    pending: false,
  })),
  on(LibraryActions.loadLibraryFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  on(LibraryActions.matchLibrary, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(LibraryActions.matchLibrarySuccess, (state, action) => ({
    ...state,
    collection: {
      ...state.collection,
      tracks:
        state.collection?.tracks && action.tracks
          ? state.collection.tracks.map((track) => {
              const index = action.tracks!.findIndex(
                (t) => t.uuid == track.uuid,
              );
              return index != -1 ? action.tracks![index] : track;
            })
          : state.collection?.tracks,
    },
    active: state.active?.ids
      ? state.active
      : {
          ...state.active,
          tracks:
            state.collection?.tracks && action.tracks
              ? state.collection.tracks.map((track) => {
                  const index = action.tracks!.findIndex(
                    (t) => t.uuid == track.uuid,
                  );
                  return index != -1 ? action.tracks![index] : track;
                })
              : state.collection?.tracks,
        },
    error: null,
    pending: false,
  })),
  on(LibraryActions.matchLibraryFailure, (state, { payload }) => ({
    ...state,
    error: payload,
    pending: false,
  })),

  on(LibraryActions.matchPlaylist, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(LibraryActions.matchPlaylistSuccess, (state, action) => ({
    ...state,
    active: {
      ...state.active,
      tracks: action.tracks,
    },
    error: null,
    pending: false,
  })),
  on(LibraryActions.matchPlaylistFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  on(LibraryActions.filterLibrary, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(LibraryActions.filterLibrarySuccess, (state, action) => ({
    ...state,
    active: {
      ...state.active,
      filtered: action.tracks,
    },
    error: null,
    pending: false,
  })),
  on(LibraryActions.filterLibraryFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  on(LibraryActions.filterPlaylist, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(LibraryActions.filterPlaylistSuccess, (state, action) => ({
    ...state,
    active: {
      ...state.active,
      filtered: action.tracks,
    },
    error: null,
    pending: false,
  })),
  on(LibraryActions.filterPlaylistFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  on(LibraryActions.loadPlaylist, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(LibraryActions.loadPlaylistSuccess, (state, { playlistId, playlist }) => ({
    ...state,
    active: {
      uuid: playlistId,
      name: playlist.name,
      ids: playlist.ids,
      tracks: playlist.tracks,
      rules: playlist.rules,
      type: playlist.type,
    },
    error: null,
    pending: false,
  })),
  on(LibraryActions.loadPlaylistFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  on(LibraryActions.getTrack, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(LibraryActions.getTrackSuccess, (state, action) => ({
    ...state,
    editor: action.track,
    error: null,
    pending: false,
  })),
  on(LibraryActions.getTrackFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  /*
    on(LibraryActions.createTrack, (state) => ({
        ...state,
        error: null,
        pending: true,
    })),
    on(LibraryActions.createTrackSuccess, (state, action) => ({
        ...state,
        tracks: [...state.tracks, action.track],
        error: null,
        pending: false
    })),
    on(LibraryActions.createTrackFailure, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            status: payload.status,
            message: payload.message
        },
        pending: false,
    })),
    */

  on(LibraryActions.updateTrack, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(LibraryActions.updateTrackSuccess, (state, action) => ({
    ...state,
    collection: {
      ...state.collection,
      tracks: state.collection?.tracks
        ? state.collection.tracks.map((track) => {
            if (track.uuid === action.track.uuid) return action.track;
            else return track;
          })
        : undefined,
    },
    active: {
      ...state.active,
      tracks: state.active?.tracks
        ? state.active.tracks.map((track) => {
            if (track.uuid === action.track.uuid) return action.track;
            else return track;
          })
        : undefined,
      filtered: state.active?.filtered
        ? state.active.filtered.map((track) => {
            if (track.uuid === action.track.uuid) return action.track;
            else return track;
          })
        : undefined,
    },
    error: null,
    pending: false,
  })),
  on(LibraryActions.updateTrackFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  on(LibraryActions.deleteTrack, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(LibraryActions.deleteTrackSuccess, (state, action) => ({
    ...state,
    collection: {
      ...state.collection,
      tracks:
        state.collection?.tracks &&
        (state.active?.name == 'Library' ||
          state.active?.name == 'Traktor Playlists' ||
          !state.active?.name)
          ? state.collection.tracks.filter((track) => {
              if (typeof action.track === 'number')
                return track.uuid !== action.track.toFixed(0).toString();
              else if (typeof action.track === 'string')
                return track.uuid !== action.track;
              else return track.uuid !== action.track.uuid;
            })
          : state.collection?.tracks,
    },
    active: {
      ...state.active,
      tracks: state.active?.tracks
        ? state.active.tracks.filter((track) => {
            if (typeof action.track === 'number')
              return track.uuid !== action.track.toFixed(0).toString();
            else if (typeof action.track === 'string')
              return track.uuid !== action.track;
            else return track.uuid !== action.track.uuid;
          })
        : undefined,
      filtered: state.active?.filtered
        ? state.active.filtered.filter((track) => {
            if (typeof action.track === 'number')
              return track.uuid !== action.track.toFixed(0).toString();
            else if (typeof action.track === 'string')
              return track.uuid !== action.track;
            else return track.uuid !== action.track.uuid;
          })
        : undefined,
    },
    error: null,
    pending: false,
  })),
  on(LibraryActions.deleteTrackFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  on(LibraryActions.updateTree, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(LibraryActions.updateTreeSuccess, (state, action) => ({
    ...state,
    collection: {
      ...state.collection,
      playlists: action.playlists,
    },
    active: {
      ...state.active,
    },
    error: null,
    pending: false,
  })),
  on(LibraryActions.updateTreeFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  on(LibraryActions.updatePlaylist, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(LibraryActions.updatePlaylistSuccess, (state, action) => ({
    ...state,
    collection: {
      ...state.collection,
      playlists: action.tree,
    },
    active: action.playlist,
    error: null,
    pending: false,
  })),
  on(LibraryActions.updatePlaylistFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),

  on(LibraryActions.createPlaylist, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),
  on(LibraryActions.createPlaylistSuccess, (state, action) => ({
    ...state,
    collection: {
      ...state.collection,
      playlists: action.tree,
    },
    active: action.playlist,
    error: null,
    pending: false,
  })),
  on(LibraryActions.createPlaylistFailure, (state, { payload }) => ({
    ...state,
    error: {
      url: payload.url,
      status: payload.status,
      message: payload.message,
    },
    pending: false,
  })),
);

export function libraryReducer(
  state: LibraryState | undefined,
  action: Action,
) {
  return _libraryReducer(state, action);
}
