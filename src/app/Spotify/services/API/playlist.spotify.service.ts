import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlaylistsService {
  private backendAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'v1/playlists';
    this.backendAPI = 'https://api.spotify.com/' + this.controller;
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlist
  getPlaylist(
    playlistId: string,
    fields?: (keyof SpotifyApi.PlaylistBaseObject)[],
  ) {
    //TODO: Add fields to params.
    let params = {};
    if (fields) params = { ...params, fields };
    return this.http.get<SpotifyApi.PlaylistObjectFull>(
      `${this.backendAPI}/${playlistId}`,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlists-tracks
  getPlaylistTracks(
    playlistId: string,
    fields?: (keyof SpotifyApi.TrackObjectSimplified)[],
  ) {
    let params = {};
    if (fields) params = { ...params, fields };
    return this.http.get<SpotifyApi.PlaylistTrackResponse>(
      `${this.backendAPI}/${playlistId}/tracks`,
      { params },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/change-playlist-details
  updatePlaylistInfo(
    playlistId: string,
    name?: string,
    pub?: boolean,
    collaborative?: boolean,
    description?: string,
  ) {
    const body = {
      name,
      public: pub,
      collaborative,
      description,
    };
    return this.http.put<SpotifyApi.ChangePlaylistDetailsReponse>(
      `${this.backendAPI}/${playlistId}`,
      body,
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/reorder-or-replace-playlists-tracks
  /*
  updatePlaylistTracks(playlistId: string, uris: string[]) {
    if (uris.length > 100) return throwError("Too many URIs provided. Maximum is 100 per request.")
    const body = {
      uris,

    }
    return this.http.put<SpotifyApi.ChangePlaylistDetailsReponse>(
      `${this.backendAPI}/${playlistId}`, body
    );
  }
  */

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist
  /*
  addPlaylistTracks(playlistId: string, uris: string[]) {
    if (uris.length > 100) return throwError("Too many URIs provided. Maximum is 100 per request.")
    const body = {
      uris,

    }
    return this.http.put<SpotifyApi.ChangePlaylistDetailsReponse>(
      `${this.backendAPI}/${playlistId}`, body
    );
  }
  */

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/remove-tracks-playlist
  removePlaylistTracks(playlistId: string, uris: string[]) {
    if (uris.length > 100)
      return throwError('Too many URIs provided. Maximum is 100 per request.');
    const body = {
      tracks: uris,
    };
    return this.http.delete<SpotifyApi.ChangePlaylistDetailsReponse>(
      `${this.backendAPI}/${playlistId}`,
      { body },
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/follow-playlist
  followPlaylist(playlistId: string, pub = false) {
    const body = {
      public: pub,
    };
    return this.http.put<SpotifyApi.FollowPlaylistReponse>(
      `${this.backendAPI}/${playlistId}/followers`,
      body,
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/unfollow-playlist
  unfollowPlaylist(playlistId: string) {
    return this.http.delete<SpotifyApi.UnfollowPlaylistReponse>(
      `${this.backendAPI}/${playlistId}/followers`,
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/check-if-user-follows-playlist
  checkPlaylistFollowers(playlistId: string, users: string[]) {
    if (users.length > 5)
      return throwError('Too many ids provided. Maximum is 5 per request.');
    const params = new HttpParams({
      fromObject: {
        ids: users.join(','),
      },
    });
    return this.http.put<SpotifyApi.UsersFollowPlaylistReponse>(
      `${this.backendAPI}/${playlistId}/followers/contains`,
      { params },
    );
  }

  /*
  //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlist-cover
  getPlaylistCover(playlistId: string) {
    return this.http.get<SpotifyApi.Playlist>(
      `${this.backendAPI}/${playlistId}/images`
    );
  }

  //https://developer.spotify.com/documentation/web-api/reference/#/operations/upload-custom-playlist-cover
  addPlaylistCover(playlistId: string) {
    return this.http.put<SpotifyApi.UploadCustomPlaylistCoverImageReponse>(
      `${this.backendAPI}/${playlistId}/images`, { }
    );
  }
  */
}
