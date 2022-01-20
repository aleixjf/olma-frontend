import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/me/player';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-information-about-the-users-current-playback
  getUserPlayback() {
    return this.http.get<SpotifyApi.CurrentPlaybackResponse>(this.backendAPI);
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/transfer-a-users-playback
  transferUserPlayback(deviceId: string) {
    return this.http.put(this.backendAPI, {
      device_ids: [deviceId],
      play: true,
    });
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/start-a-users-playback
  play(request: SpotifyApi.PlayParameterObject) {
    const params = new HttpParams({});
    if (request.device_id) params.set('device_id', request.device_id);

    return this.http.put(`${this.backendAPI}/play`, request);
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/pause-a-users-playback
  pause(deviceId?: string) {
    const params = new HttpParams({});
    if (deviceId) params.set('device_id', deviceId);

    return this.http.put(`${this.backendAPI}/pause`, { params });
  }

  togglePlay(isPlaying: boolean, request: SpotifyApi.PlayParameterObject) {
    //TODO: retrieve isPlaying from playbackState
    if (!isPlaying) return this.play(request);
    else return this.pause();
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/skip-users-playback-to-next-track
  next() {
    return this.http.post(`${this.backendAPI}/next`, {});
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/seek-to-position-in-currently-playing-track
  prev() {
    return this.http.post(`${this.backendAPI}/previous`, {});
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/seek-to-position-in-currently-playing-track
  seek(positionMs: number, deviceId?: string) {
    const params = new HttpParams({
      fromObject: {
        position_ms: positionMs,
      },
    });
    if (deviceId) params.set('device_id', deviceId);

    return this.http.put(`${this.backendAPI}/seek`, null, { params });
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/set-volume-for-users-playback
  setVolume(volume: number, deviceId?: string) {
    const params = new HttpParams({
      fromObject: {
        volume_percent: volume,
      },
    });
    if (deviceId) params.set('device_id', deviceId);

    return this.http.put(`${this.backendAPI}/volume`, null, { params });
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/set-repeat-mode-on-users-playback
  setRepeatMode(state: 'track' | 'context' | 'off', deviceId?: string) {
    const params = new HttpParams({
      fromObject: {
        state,
      },
    });
    if (deviceId) params.set('device_id', deviceId);

    return this.http.put(`${this.backendAPI}/repeat`, null, { params });
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/toggle-shuffle-for-users-playback
  setShuffleMode(enabled: boolean, deviceId?: string) {
    const params = new HttpParams({
      fromObject: {
        state: enabled,
      },
    });
    if (deviceId) params.set('device_id', deviceId);

    return this.http.put(`${this.backendAPI}/shuffle`, null, { params });
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recently-played
  getRecentPlayedTracks(limit = 50, before?: number, after?: number) {
    if (limit < 1 || limit > 50)
      return throwError(
        'The limit for this request must be between 1 and 50 items.',
      );
    if (before && after)
      return throwError(
        "Before and after can't be defined at the same time. Set only one of them",
      );
    const params = new HttpParams({
      fromObject: {
        limit,
      },
    });
    if (before) params.set('before', before);
    if (after) params.set('after', after);

    return this.http.get<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
      `${this.backendAPI}/recently-played`,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/add-to-queue
  addToQueue(uri: string, deviceId?: string) {
    const params = new HttpParams({
      fromObject: {
        uri,
      },
    });
    if (deviceId) params.set('device_id', deviceId);

    return this.http.post<SpotifyApi.AddToQueueResponse>(
      `${this.backendAPI}/queue`,
      { params },
    );
  }
}
