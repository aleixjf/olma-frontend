import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AudioAnalysisService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/audio-analysis';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-audio-analysis
  getAudioAnalysis(trackId: string) {
    return this.http.get<SpotifyApi.AudioAnalysisResponse>(
      `${this.backendAPI}/${trackId}`,
    );
  }
}
