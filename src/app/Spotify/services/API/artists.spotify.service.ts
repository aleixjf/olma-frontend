import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArtistsService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/artists';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artist
  getArtist(artistId: string) {
    return this.http.get<SpotifyApi.SingleAlbumResponse>(
      `${this.backendAPI}/${artistId}`,
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-multiple-artists
  getMultipleArtists(artistIds: string[]) {
    if (artistIds.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        ids: artistIds.join(','),
      },
    });
    return this.http.get<SpotifyApi.MultipleArtistsResponse>(this.backendAPI, {
      params,
    });
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-albums
  getArtistAlbums(
    artistId: string,
    limit = 50,
    offset = 50,
    types: ('album' | 'single' | 'appears_on' | 'compilation')[] = [
      'album',
      'single',
    ],
  ) {
    if (limit < 1 || limit > 50)
      return throwError(
        'The limit for this request must be between 1 and 50 items.',
      );
    const params = new HttpParams({
      fromObject: {
        limit,
        offset,
        include_groups: types,
      },
    });
    return this.http.get<SpotifyApi.ArtistsAlbumsResponse>(
      `${this.backendAPI}/${artistId}/albums`,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-top-tracks
  getArtistTopTracks(artistId: string) {
    return this.http.get<SpotifyApi.ArtistsTopTracksResponse>(
      `${this.backendAPI}/${artistId}/top-tracks`,
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-related-artists
  getRelatedArtists(artistId: string) {
    return this.http.get<SpotifyApi.ArtistsRelatedArtistsResponse>(
      `${this.backendAPI}/${artistId}/related-artists`,
    );
  }
}
