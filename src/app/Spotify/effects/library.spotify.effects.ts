//Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//RxJS
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';

//NgRX
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as SpotifyActions from 'src/app/Spotify/actions';

//Services
import * as SpotifyAPI from 'src/app/Spotify/services/API';

@Injectable()
export class LibraryEffects {
  constructor(
    private actions$: Actions,
    private userTracksService: SpotifyAPI.UserTracksService,
    private router: Router,
  ) {}

  //Load library tracks (user liked tracks)
  loadLibrary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        SpotifyActions.loadLibrary,
        //INFO: Comment below if we don't want to automatically retrieve user's tracks
        SpotifyActions.implicitGrantRetrieveTokenSuccess,
        SpotifyActions.authCodeRetrieveTokenSuccess,
        SpotifyActions.authCodeRefreshTokenSuccess,
        SpotifyActions.refreshTokenSuccess,
      ),
      mergeMap(() =>
        this.userTracksService.getAllUserTracks().pipe(
          map((tracks) => SpotifyActions.loadLibrarySuccess({ tracks })),
          catchError((error) =>
            of(SpotifyActions.loadLibraryFailure({ payload: error })),
          ),
        ),
      ),
    ),
  );
}
