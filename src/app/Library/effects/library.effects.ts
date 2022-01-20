//Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//RxJS
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';

//NgRX
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as LibraryActions from 'src/app/Library/actions';
import { LibraryService } from '../services/library.service';

@Injectable()
export class LibraryEffects {
  constructor(
    private actions$: Actions,
    private libraryService: LibraryService,
    private router: Router,
  ) {}

  getParseLibrary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.parseLocalLibrary),
      mergeMap(({ library }) =>
        this.libraryService.parseLibrary(library).pipe(
          map((library) =>
            LibraryActions.parseLocalLibrarySuccess({ library }),
          ),
          catchError((error) =>
            of(LibraryActions.parseLocalLibraryFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );
  parseLocalLibrarySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LibraryActions.parseLocalLibrarySuccess),
        map(() => {
          this.redirectTo('/library');
        }),
      ),
    { dispatch: false },
  );

  //Get all tracks
  loadLibrary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.loadLibrary),
      mergeMap(() =>
        this.libraryService.getTracks().pipe(
          map((tracks) => LibraryActions.loadLibrarySuccess({ tracks })),
          catchError((error) =>
            of(LibraryActions.loadLibraryFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  //Get all tracks
  loadPlaylist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.loadPlaylist),
      mergeMap(({ playlistId }) =>
        this.libraryService.getPlaylist(playlistId).pipe(
          map((playlist) =>
            LibraryActions.loadPlaylistSuccess({ playlistId, playlist }),
          ),
          catchError((error) =>
            of(LibraryActions.loadPlaylistFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  //Match Library
  matchLibrary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.matchLibrary),
      mergeMap(() =>
        this.libraryService.match_library().pipe(
          //tap((tracks) => console.log(`Current tracks:\n${tracks}`)),
          map((tracks) =>
            LibraryActions.matchLibrarySuccess({
              tracks: tracks.length > 0 ? tracks : undefined,
            }),
          ),
          catchError((error) =>
            of(LibraryActions.matchLibraryFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  //Match Playlist
  matchPlaylist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.matchPlaylist),
      mergeMap(() =>
        this.libraryService.match_playlist_ids().pipe(
          map((tracks) =>
            LibraryActions.matchPlaylistSuccess({
              tracks: tracks.length > 0 ? tracks : undefined,
            }),
          ),
          catchError((error) =>
            of(LibraryActions.matchPlaylistFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  //Filter Library
  filterLibrary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.filterLibrary),
      mergeMap(({ value, fields }) =>
        this.libraryService.filterTracks(value, undefined, fields).pipe(
          map((tracks) =>
            LibraryActions.filterLibrarySuccess({
              tracks:
                tracks.length > 0 || value.length > 0 ? tracks : undefined,
            }),
          ),
          catchError((error) =>
            of(LibraryActions.filterLibraryFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  //Filter Playlist
  filterPlaylist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.filterPlaylist),
      mergeMap(({ value, fields }) =>
        this.libraryService.filterTracks(value, undefined, fields, true).pipe(
          map((tracks) =>
            LibraryActions.filterPlaylistSuccess({
              tracks:
                tracks.length > 0 || value.length > 0 ? tracks : undefined,
            }),
          ),
          catchError((error) =>
            of(LibraryActions.filterPlaylistFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  //Get track
  getTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.getTrack),
      mergeMap(({ trackId }) =>
        this.libraryService.getTrack(trackId).pipe(
          map((track) => LibraryActions.getTrackSuccess({ track })),
          catchError((error) =>
            of(LibraryActions.getTrackFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  //Update track
  updateTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.updateTrack),
      mergeMap(({ track }) =>
        this.libraryService.updateTrack(track).pipe(
          map(() => LibraryActions.updateTrackSuccess({ track })),
          catchError((error) =>
            of(LibraryActions.updateTrackFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );

  //Create track
  /*
    createTrack$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LibraryActions.createTrack),
            mergeMap(({track}) =>
                this.libraryService.createTrack(track).pipe(
                    map((newTrack) =>
                        LibraryActions.createTrackSuccess({ track: newTrack })
                    ),
                    catchError((error) => of(LibraryActions.createTrackFailure({ payload: error })))
                )
            )
        )
    );
    createTrackSuccess$ = createEffect(
        () => this.actions$.pipe(
          ofType(LibraryActions.createTrackSuccess),
          map(() => { this.redirectTo('/tracks')})
        ),
        { dispatch: false }
    );
    */

  //Delete track
  deleteTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.deleteTrack),
      mergeMap(({ track }) => {
        const trackId: number | string =
          typeof track === 'object' ? track.uuid : track;
        return this.libraryService.deleteTrack(trackId).pipe(
          map(() => LibraryActions.deleteTrackSuccess({ track: trackId })),
          catchError((error) =>
            of(LibraryActions.deleteTrackFailure({ payload: error })),
          ),
        );
      }),
    ),
  );

  //Update Playlists
  updateTree$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.updateTree),
      mergeMap(() => {
        return this.libraryService.updateTree().pipe(
          map((playlists) => LibraryActions.updateTreeSuccess({ playlists })),
          catchError((error) =>
            of(LibraryActions.updateTreeFailure({ payload: error })),
          ),
        );
      }),
    ),
  );
  updateTreeAfterLibraryModifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        LibraryActions.updateTrackSuccess,
        LibraryActions.deleteTrackSuccess,
      ),
      mergeMap(({ track }) => {
        return this.libraryService
          .updateTree(typeof track === 'object' ? track : undefined)
          .pipe(
            map((playlists) => LibraryActions.updateTreeSuccess({ playlists })),
            catchError((error) =>
              of(LibraryActions.updateTreeFailure({ payload: error })),
            ),
          );
      }),
    ),
  );
  updateTreeAfterLibraryMatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.matchLibrarySuccess),
      mergeMap(() => {
        return this.libraryService.updateTree().pipe(
          map((playlists) => LibraryActions.updateTreeSuccess({ playlists })),
          catchError((error) =>
            of(LibraryActions.updateTreeFailure({ payload: error })),
          ),
        );
      }),
    ),
  );
  updateTreeAfterPlaylistModifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.updatePlaylist),
      mergeMap(({ playlist }) => {
        return this.libraryService.updateTree(playlist).pipe(
          map((playlists) =>
            LibraryActions.updatePlaylistSuccess({ playlist, tree: playlists }),
          ),
          catchError((error) =>
            of(LibraryActions.updatePlaylistFailure({ payload: error })),
          ),
        );
      }),
    ),
  );
  updatePlaylistSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LibraryActions.updatePlaylistSuccess),
        map(({ playlist }) => {
          this.redirectTo(`/library/playlists/${playlist.ids.traktor}`);
        }),
      ),
    { dispatch: false },
  );
  createPlaylist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.createPlaylist),
      mergeMap(({ playlist }) => {
        return this.libraryService.addPlaylist(playlist).pipe(
          map((tree) =>
            LibraryActions.createPlaylistSuccess({ playlist, tree }),
          ),
          catchError((error) =>
            of(LibraryActions.createPlaylistFailure({ payload: error })),
          ),
        );
      }),
    ),
  );
  createPlaylistSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LibraryActions.createPlaylistSuccess),
        map(({ playlist }) => {
          this.redirectTo(`/library/playlists/${playlist.ids.traktor}`);
        }),
      ),
    { dispatch: false },
  );

  redirectTo(uri: string): void {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }
}
