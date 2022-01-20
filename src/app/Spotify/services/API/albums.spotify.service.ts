import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlbumsService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/albums';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-album
  getAlbum(albumId: string) {
    return this.http.get<SpotifyApi.SingleAlbumResponse>(
      `${this.backendAPI}/${albumId}`,
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-multiple-albums
  getMultipleAlbums(albumIds: string[]) {
    if (albumIds.length > 20)
      return throwError('Too many ids provided. Maximum is 20 per request.');
    const params = new HttpParams({
      fromObject: {
        ids: albumIds.join(','),
      },
    });
    return this.http.get<SpotifyApi.MultipleAlbumsResponse>(this.backendAPI, {
      params,
    });
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-albums-tracks
  getAlbumTracks(albumId: string, limit = 50, offset = 0) {
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
    return this.http.get<SpotifyApi.AlbumTracksResponse>(
      `${this.backendAPI}/${albumId}/tracks`,
      { params },
    );
  }
}
