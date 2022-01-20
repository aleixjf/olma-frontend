//Angular
import { Injectable } from '@angular/core';
//RxJS
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
//Models
import { TrackDTO } from 'src/app/Shared/models/track.dto';
import { MatchSettings } from 'src/app/Spotify/models/match-config.interface';
//Services
import { AudioFeaturesService } from './API';
import { SpotifyMatchService } from './match.spotify.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifyLibraryService {
  constructor(
    private matchService: SpotifyMatchService,
    private audioFeaturesService: AudioFeaturesService,
  ) {}

  update_ids(track: TrackDTO, config: MatchSettings): Observable<TrackDTO> {
    //INFO: If track is matched, it will update the popularity field + ids + urls.
    return this.matchService.match(track, config).pipe(
      map((response) => {
        if (response) {
          //console.log(response);
          const ids = track.ids
            ? { ...track.ids, spotify: response.id }
            : { spotify: response.id };
          const urls = track.urls
            ? { ...track.urls, spotify: response.external_urls.spotify }
            : { spotify: response.external_urls.spotify };
          const isrc = response.external_ids.isrc;
          const popularity = response.popularity;
          const updated_track = new TrackDTO(
            track.uuid,
            ids,
            urls,
            track.title,
            track.name,
            track.mix,
            track.version,
            track.artists_dto,
            track.album_dto,
            track.track_number,
            track.disc_number,
            track.duration,
            track.bpm,
            track.key,
            track.key_id,
            track.genre,
            track.release_date,
            track.publish_date,
            isrc,
            track.label_dto,
            track.catalog_number,
            track.copyright,
            track.terms,
            track.rating,
            track.comments,
            track.lyrics,
            track.language,
            track.path,
            track.volume,
            track.volume_id,
            track.dir,
            track.file_name,
            track.file_type,
            track.file_size,
            track.encoder_info,
            track.bitrate,
            track.peak_db,
            track.perceived_db,
            track.analyzed_db,
            track.import_date,
            track.last_played,
            track.playcount,
            track.modification_date,
            track.modification_author,
            track.grid_lock,
            track.grid_locked_date,
            track.gridMarkers,
            track.hotcues,
            track.loops,
            track.energy,
            track.audio_id,
            track.comments2,
            track.flags,
            track.cover_art_id,
            track.bpm_quality,
            track.stems,
            popularity,
            track.danceability,
            track.valence,
            track.acousticness,
            track.instrumentalness,
            track.liveness,
            track.speechiness,
            track.time_signature,
          );
          return updated_track;
        } else return track;
      }),
    );
  }

  update_audio_features(track: TrackDTO): Observable<TrackDTO> {
    //INFO: If track is matched, it will update the popularity field + ids + urls.
    if (!track.ids.spotify)
      return throwError(
        "Can't get the Audio Features of this track because it isn't matched.",
      );
    else
      return this.audioFeaturesService.getAudioFeatures(track.ids.spotify).pipe(
        map((response) => {
          if (response) {
            const danceability = Math.round(response.danceability * 100);
            const valence = Math.round(response.valence * 100);
            const acousticness = Math.round(response.acousticness * 100);
            const instrumentalness = Math.round(
              response.instrumentalness * 100,
            );
            const liveness = Math.round(response.liveness * 100);
            const speechiness = Math.round(response.speechiness * 100);
            const time_signature = response.time_signature;

            const updated_track = new TrackDTO(
              track.uuid,
              track.ids,
              track.urls,
              track.title,
              track.name,
              track.mix,
              track.version,
              track.artists_dto,
              track.album_dto,
              track.track_number,
              track.disc_number,
              track.duration,
              track.bpm,
              track.key,
              track.key_id,
              track.genre,
              track.release_date,
              track.publish_date,
              track.isrc,
              track.label_dto,
              track.catalog_number,
              track.copyright,
              track.terms,
              track.rating,
              track.comments,
              track.lyrics,
              track.language,
              track.path,
              track.volume,
              track.volume_id,
              track.dir,
              track.file_name,
              track.file_type,
              track.file_size,
              track.encoder_info,
              track.bitrate,
              track.peak_db,
              track.perceived_db,
              track.analyzed_db,
              track.import_date,
              track.last_played,
              track.playcount,
              track.modification_date,
              track.modification_author,
              track.grid_lock,
              track.grid_locked_date,
              track.gridMarkers,
              track.hotcues,
              track.loops,
              track.energy,
              track.audio_id,
              track.comments2,
              track.flags,
              track.cover_art_id,
              track.bpm_quality,
              track.stems,
              track.popularity,
              danceability,
              valence,
              acousticness,
              instrumentalness,
              liveness,
              speechiness,
              time_signature,
            );
            return updated_track;
          } else return track;
        }),
      );
  }

  update_multiple_audio_features(tracks: TrackDTO[]): Observable<TrackDTO[]> {
    const ids: string[] = tracks
      .filter((track) => track.ids.spotify !== undefined)
      .map((track) => track.ids.spotify!);
    if (ids.length == 0) return of(tracks);

    return this.audioFeaturesService.getMultipleAudioFeatures(ids).pipe(
      map((response) =>
        response.audio_features.map((features) => {
          const danceability = Math.round(features.danceability * 100);
          const valence = Math.round(features.valence * 100);
          const acousticness = Math.round(features.acousticness * 100);
          const instrumentalness = Math.round(features.instrumentalness * 100);
          const liveness = Math.round(features.liveness * 100);
          const speechiness = Math.round(features.speechiness * 100);
          const time_signature = features.time_signature;

          const track = tracks.find(
            (track) => track.ids.spotify === features.id,
          )!;

          const updated_track = new TrackDTO(
            track.uuid,
            track.ids,
            track.urls,
            track.title,
            track.name,
            track.mix,
            track.version,
            track.artists_dto,
            track.album_dto,
            track.track_number,
            track.disc_number,
            track.duration,
            track.bpm,
            track.key,
            track.key_id,
            track.genre,
            track.release_date,
            track.publish_date,
            track.isrc,
            track.label_dto,
            track.catalog_number,
            track.copyright,
            track.terms,
            track.rating,
            track.comments,
            track.lyrics,
            track.language,
            track.path,
            track.volume,
            track.volume_id,
            track.dir,
            track.file_name,
            track.file_type,
            track.file_size,
            track.encoder_info,
            track.bitrate,
            track.peak_db,
            track.perceived_db,
            track.analyzed_db,
            track.import_date,
            track.last_played,
            track.playcount,
            track.modification_date,
            track.modification_author,
            track.grid_lock,
            track.grid_locked_date,
            track.gridMarkers,
            track.hotcues,
            track.loops,
            track.energy,
            track.audio_id,
            track.comments2,
            track.flags,
            track.cover_art_id,
            track.bpm_quality,
            track.stems,
            track.popularity,
            danceability,
            valence,
            acousticness,
            instrumentalness,
            liveness,
            speechiness,
            time_signature,
          );
          return updated_track;
        }),
      ),
    );
  }
}
