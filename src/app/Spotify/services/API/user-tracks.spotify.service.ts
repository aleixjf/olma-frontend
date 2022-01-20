import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, throwError } from 'rxjs';
import { expand, reduce, tap } from 'rxjs/operators';
import { SpotifyLibraryService } from '../library.spotify.service';

@Injectable({ providedIn: 'root' })
export class UserTracksService {
  private backendAPI: string;
  private controller: string;

  constructor(
    private http: HttpClient,
    private helperService: SpotifyLibraryService,
  ) {
    this.controller = 'v1/me/tracks';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-saved-tracks
  getUserTracks(next?: string, limit = 50, offset = 0) {
    if (limit < 1 || limit > 50)
      return throwError(
        'The limit for this request must be between 1 and 50 items.',
      );
    const params = new HttpParams({
      fromObject: {
        limit,
        offset,
      },
    });
    return next
      ? this.http.get<SpotifyApi.UsersSavedTracksResponse>(next)
      : this.http.get<SpotifyApi.UsersSavedTracksResponse>(
          `${this.backendAPI}`,
          {
            params,
          },
        );
  }
  getAllUserTracks() {
    return this.getUserTracks().pipe(
      tap(() => console.log("Spotify API - Getting all user's tracks")),
      expand((response) =>
        response.next === null ? EMPTY : this.getUserTracks(response.next),
      ),
      reduce(
        (
          acc: SpotifyApi.SavedTrackObject[],
          val: SpotifyApi.UsersSavedTracksResponse,
        ) => {
          acc = [...acc, ...val.items];
          return acc;
        },
        [],
      ),
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/save-tracks-user
  addUserTracks(trackIds: string[]) {
    if (trackIds.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        ids: trackIds.join(','),
      },
    });
    return this.http.put<SpotifyApi.SaveTracksForUserResponse>(
      this.backendAPI,
      { params },
    );
  }
  /*
  addAllUserTracks(trackIds: string[]) {
    const limit = 50;
    for (let i = 0; i < Math.ceil(trackIds.length / limit); i++) {
      this.addUserTracks(trackIds.slice(i * limit, (i + 1) * limit));
    }
  }
  */

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/remove-tracks-user
  deleteUserTracks(trackIds: string[]) {
    if (trackIds.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        ids: trackIds.join(','),
      },
    });
    return this.http.delete<SpotifyApi.RemoveUsersSavedTracksResponse>(
      this.backendAPI,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/check-users-saved-tracks
  areDuplicatedTracks(trackIds: string[]) {
    if (trackIds.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        ids: trackIds.join(','),
      },
    });
    return this.http.get<SpotifyApi.CheckUsersSavedTracksResponse>(
      this.backendAPI,
      { params },
    );
  }
}
