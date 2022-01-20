import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserAlbumsService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/me/albums';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-saved-albums
  getUserAlbums(limit = 50, offset = 0) {
    const params = new HttpParams({
      fromObject: {
        limit,
        offset,
      },
    });
    return this.http.get<SpotifyApi.UsersSavedAlbumsResponse>(this.backendAPI, {
      params,
    });
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/save-albums-user
  addUserAlbum(albumIds: string[]) {
    if (albumIds.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        ids: albumIds.join(','),
      },
    });
    return this.http.put<SpotifyApi.SaveAlbumsForUserResponse>(
      this.backendAPI,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/remove-albums-user
  deleteUserAlbum(albumIds: string[]) {
    if (albumIds.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        ids: albumIds.join(','),
      },
    });
    return this.http.get<SpotifyApi.RemoveAlbumsForUserResponse>(
      this.backendAPI,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/check-users-saved-albums
  areDuplicatedAlbums(albumIds: string[]) {
    if (albumIds.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        ids: albumIds.join(','),
      },
    });
    return this.http.get<SpotifyApi.CheckUserSavedAlbumsResponse>(
      this.backendAPI,
      { params },
    );
  }
}
