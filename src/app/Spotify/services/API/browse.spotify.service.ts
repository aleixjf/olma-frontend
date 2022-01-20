import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BrowseService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/browse';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-featured-playlists
  getFeaturedPlaylists(limit = 50, offset = 0, country?: string) {
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
    if (country) params.append('country', country);

    return this.http.get<SpotifyApi.ListOfFeaturedPlaylistsResponse>(
      `${this.backendAPI}/featured-playlists`,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-new-releases
  getFeaturedAlbums(limit = 50, offset = 0, country?: string) {
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
    if (country) params.append('country', country);

    return this.http.get<SpotifyApi.ListOfNewReleasesResponse>(
      `${this.backendAPI}/new-releases`,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-categories
  getCategories(limit = 50, offset = 0, country?: string) {
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
    if (country) params.append('country', country);

    return this.http
      .get<SpotifyApi.MultipleCategoriesResponse>(
        `${this.backendAPI}/categories`,
        { params },
      )
      .pipe(map((res) => res.categories));
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-category
  getCategory(categoryId: string) {
    return this.http.get<SpotifyApi.SingleCategoryResponse>(
      `${this.backendAPI}/categories/${categoryId}`,
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-categories-playlists
  getCategoryPlaylists(categoryId: string, limit = 50, offset = 0) {
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
    return this.http
      .get<SpotifyApi.CategoryPlaylistsReponse>(
        `${this.backendAPI}/categories/${categoryId}/playlists`,
        { params },
      )
      .pipe(map((res) => res.playlists));
  }
}
