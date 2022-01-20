import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/users';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-list-users-playlists
  getPlaylists(userId: string, limit = 50, offset = 0) {
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
    return this.http.get<SpotifyApi.ListOfUsersPlaylistsResponse>(
      `${this.backendAPI}/${userId}/playlists`,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/create-playlist
  createPlaylists(
    userId: string,
    name: string,
    pub: boolean,
    collaborative: boolean,
    description: string,
  ) {
    const body = {
      name,
      public: pub,
      collaborative,
      description,
    };
    return this.http.post<SpotifyApi.CreatePlaylistResponse>(
      `${this.backendAPI}/${userId}/playlists`,
      body,
    );
  }
}
