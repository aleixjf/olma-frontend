import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TracksService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/tracks';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-track
  getTrack(trackId: string) {
    return this.http.get<SpotifyApi.SingleTrackResponse>(
      `${this.backendAPI}/${trackId}`,
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-several-tracks
  getMultipleTracks(trackIds: string[]) {
    if (trackIds.length > 50)
      return throwError('Too many ids provided. Maximum is 50 per request.');
    const params = new HttpParams({
      fromObject: {
        ids: trackIds.join(','),
      },
    });
    return this.http.get<SpotifyApi.MultipleTracksResponse>(this.backendAPI, {
      params,
    });
  }
}
