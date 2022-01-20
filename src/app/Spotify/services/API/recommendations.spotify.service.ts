import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RecommendationsService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/recommendations';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  /*
  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recommendations
  getRecommendations(tracks: string[], artists: string[], genres: string[]) {

  }
  */

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recommendation-genres
  getSpotifyGenres() {
    return this.http.get<SpotifyApi.AvailableGenreSeedsResponse>(
      `${this.backendAPI}/available-genre-seeds`,
    );
  }
}
