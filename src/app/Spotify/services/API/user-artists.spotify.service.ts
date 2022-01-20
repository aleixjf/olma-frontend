import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserArtistsService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/me/following';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-followed
  getFollowedArtists(limit = 50, after: string) {
    if (limit < 1 || limit > 50)
      return throwError(
        'The limit for this request must be between 1 and 50 items.',
      );
    const params = new HttpParams({
      fromObject: {
        type: 'artist',
        limit,
        after,
      },
    });
    return this.http.get<SpotifyApi.UsersFollowedArtistsResponse>(
      this.backendAPI,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/follow-artists-users
  followArtist(ids: string[]) {
    if (ids.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        type: 'artist',
        ids: ids.join(','),
      },
    });
    return this.http.put<SpotifyApi.FollowArtistsOrUsersResponse>(
      this.backendAPI,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/unfollow-artists-users
  unfollowArtist(ids: string[]) {
    if (ids.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        type: 'artist',
        ids: ids.join(','),
      },
    });
    return this.http.delete<SpotifyApi.UnfollowArtistsOrUsersResponse>(
      this.backendAPI,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/check-current-user-follows
  checkFollowedArtists(ids: string[]) {
    if (ids.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        type: 'artist',
        ids: ids.join(','),
      },
    });
    return this.http.get<SpotifyApi.UserFollowsUsersOrArtistsResponse>(
      this.backendAPI,
      { params },
    );
  }
}
