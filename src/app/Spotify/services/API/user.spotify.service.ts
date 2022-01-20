import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/me';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  getProfile(): Observable<SpotifyApi.CurrentUsersProfileResponse> {
    return this.http.get<SpotifyApi.CurrentUsersProfileResponse>(
      this.backendAPI,
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/follow-artists-users
  followUser(ids: string[]) {
    if (ids.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        type: 'user',
        ids: ids.join(','),
      },
    });
    return this.http.put<SpotifyApi.FollowArtistsOrUsersResponse>(
      `${this.backendAPI}/following`,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/unfollow-artists-users
  unfollowUser(ids: string[]) {
    if (ids.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        type: 'user',
        ids: ids.join(','),
      },
    });
    return this.http.delete<SpotifyApi.UnfollowArtistsOrUsersResponse>(
      `${this.backendAPI}/following`,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/check-current-user-follows
  checkFollowedUsers(ids: string[]) {
    if (ids.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        type: 'user',
        ids: ids.join(','),
      },
    });
    return this.http.get<SpotifyApi.UserFollowsUsersOrArtistsResponse>(
      `${this.backendAPI}/following/contains`,
      { params },
    );
  }
}
