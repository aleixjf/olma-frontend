import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

export type SearchResponse = Pick<
  SpotifyApi.SearchResponse,
  'tracks' | 'artists' | 'albums' | 'playlists'
>;

@Injectable({ providedIn: 'root' })
export class SearchService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/search';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/search
  /**
   * Search for tracks, artists, albums, and playlists
   *
   * @param {string} term
   * @param {SpotifyAPIParameters} [apiParams={ limit: 50 }]
   * @return {*}  {(Observable<SearchResponse>)}
   */
  search(
    term: string,
    type: ('album' | 'artist' | 'playlist' | 'track' | 'show' | 'episode')[],
    limit = 50,
    offset = 0,
  ): Observable<SearchResponse> {
    if (limit < 0 || limit > 50)
      return throwError(
        'The limit for this request must be between 0 and 50 items.',
      );
    const params = new HttpParams({
      fromObject: {
        type: type.join(','),
        q: term,
        limit,
        offset,
      },
    });

    return this.http.get<SpotifyApi.SearchResponse>(this.backendAPI, {
      params,
    });
  }
}
