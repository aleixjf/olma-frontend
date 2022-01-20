import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioFeaturesService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/audio-features';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-audio-features
  getAudioFeatures(trackId: string) {
    return this.http.get<SpotifyApi.AudioFeaturesResponse>(
      `${this.backendAPI}/${trackId}`,
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-several-audio-features
  getMultipleAudioFeatures(trackIds: string[]) {
    if (trackIds.length > 100)
      return throwError('Too many ids provided. Maximum is 100 per request.');
    const params = new HttpParams({
      fromObject: {
        ids: trackIds.join(','),
      },
    });
    return this.http.get<SpotifyApi.MultipleAudioFeaturesResponse>(
      this.backendAPI,
      { params },
    );
  }
}
