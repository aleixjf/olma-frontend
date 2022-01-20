//Angular
import { Injectable } from '@angular/core';

//RxJS
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';

//Models
import { MatchSettings } from 'src/app/Spotify/models/match-config.interface';
import { Artists } from 'src/app/Shared/models/metadata/artists';
import { TrackDTO } from 'src/app/Shared/models/track.dto';

//Services
import { SearchService } from './API';
import * as Helpers from 'src/app/Shared/services/helpers/Helpers';

//External Dependencies
import { ratio, partial_ratio, token_sort_ratio } from 'fuzzball';

@Injectable({
  providedIn: 'root',
})
export class SpotifyMatchService {
  tracks!: SpotifyApi.TrackObjectFull[];

  constructor(
    private store: Store<AppState>,
    private searchService: SearchService,
  ) {
    this.store.select('spotify').subscribe((response) => {
      if (response.tracks) this.tracks = response.tracks;
    });
  }

  match(
    track: TrackDTO,
    config: MatchSettings,
  ): Observable<SpotifyApi.TrackObjectFull | undefined> {
    /* Build query */
    let query: string;
    if (config.use_isrc && track.isrc) query = `isrc:${track.isrc}`;
    else if (track.name) {
      if (track.mix && track.remixer)
        query = `track:${track.name} - ${track.mix}+artist:${track.artist} ${track.remixer}`; //[track.name, track.mix, track.artist, track.remixer].join(' ');
      if (track.mix)
        `track:${track.name} - ${track.mix}+artist:${track.artist}`;
      //[track.name, track.mix, track.artist].join(' ');
      else query = `track:${track.name}+artist:${track.artist}`; //[track.name, track.artist].join(' ');
    } else if (track.title) {
      query = query = `track:${track.title}+artist:${track.artist}`; //[track.title, track.artist].join(' ');
    } else return throwError('Not enough info provided');

    /* Try to match first with user's tracks */
    let userTrack: SpotifyApi.TrackObjectFull | undefined;
    if (this.tracks)
      this.match_with_user_tracks(track, config).subscribe((resp) => {
        if (resp) userTrack = resp;
      });
    if (userTrack) {
      console.log('Returning local track');
      console.log(userTrack);
      return of(userTrack);
    }

    /* Match local track */
    return this.searchService.search(query!, ['track'], 10).pipe(
      map((response) => {
        /* Use ISRC */
        if (config.use_isrc && track.isrc) {
          return response.tracks?.items.find(
            (api) => api.external_ids.isrc === track.isrc,
          );
        }

        /* Use IDs */
        if (config.use_ids && track.ids.spotify) {
          return response.tracks?.items.find(
            (api) => api.id === track.ids.spotify,
          );
        }

        /* Match */
        let matches = response.tracks
          ? response.tracks.items.map((t) =>
              this.compare_tracks(track, t, config),
            )
          : [];
        matches = matches.sort((a, b) => (b.match < a.match ? -1 : 1));
        if (matches[0] && matches[0].track && matches[0].match)
          return matches[0].track;
        return undefined;
      }),
    );
  }

  match_with_user_tracks(
    track: TrackDTO,
    config: MatchSettings,
  ): Observable<SpotifyApi.TrackObjectFull | undefined> {
    let tracks: SpotifyApi.TrackObjectFull[] = [];
    /* Build query */
    if (config.use_isrc && track.isrc)
      return of(this.tracks.find((t) => t.external_ids.isrc == track.isrc));
    if (config.use_ids && track.ids.spotify) {
      return of(this.tracks.find((t) => t.id === track.ids.spotify));
    } else if (track.title) {
      tracks = this.tracks.filter(
        (t) => partial_ratio(t.name, track.title!) > 80,
      );
    } else if (track.name) {
      tracks = this.tracks.filter(
        (t) => partial_ratio(t.name, track.name!) > 80,
      );
    } else return throwError('Not enough info provided');

    /* Match local track */
    let matches: {
      match: number;
      track: SpotifyApi.TrackObjectFull | null;
      results: any;
    }[] = [];
    if (tracks && tracks.length > 0)
      matches = tracks.map((t) => this.compare_tracks(track, t, config));

    matches = matches.sort((a, b) => (b.match < a.match ? -1 : 1));
    if (
      matches[0] &&
      matches[0].track &&
      matches[0].match >= config.confidence_level
    )
      return of(matches[0].track);
    return of(undefined);
  }

  private compare_tracks(
    local: TrackDTO,
    api: SpotifyApi.TrackObjectFull,
    config: MatchSettings,
  ): { match: number; track: SpotifyApi.TrackObjectFull | null; results: any } {
    const local_name = local.name
      ? local.name
      : local.title
      ? Helpers.name(local.title)
      : undefined;
    const local_mix = local.mix
      ? local.mix
      : local.title
      ? Helpers.mix(local.title)
      : undefined;

    const api_name = Helpers.name(api.name);
    const api_mix = Helpers.mix(api.name);

    const title_coinc = local.title ? ratio(local.title, api.name) : 0;
    const name_coinc = local_name ? ratio(local_name, api_name) : 0;
    const mix_coinc =
      !local.mix && !api_mix
        ? 100
        : local_mix && api_mix
        ? ratio(local_mix, api_mix)
        : 0;
    const artists_match = this.match_artists(local, api);
    const time_diff = Math.abs(
      api.duration_ms / 1000 - (local.duration ? local.duration : 0),
    );
    const results = {
      title: title_coinc,
      name: name_coinc,
      mix: mix_coinc,
      artists: artists_match,
      time_diff,
    };
    /*
    console.log(
      `Local title: ${local.title}\nAPI title: ${api.name}\nTitle coincidence: ${title_coinc}\n
       \nLocal name: ${local_name}\nAPI name: ${api_name}\nName coincidence: ${name_coinc}\n
       \nLocal mix: ${local_mix}\nAPI mix: ${api_mix}\nMix coincidence: ${mix_coinc}\n
       \nMain artists coincidence: ${artists_match.main}\nRemixers coincidence: ${artists_match.remixer}\n
       \nTime diff: ${time_diff}`,
    );
    */

    // Duration filter
    if (!local.duration && config.match_duration)
      throw Error('Track has no duration');
    if (config.match_duration && time_diff > config.duration_dif)
      return { match: 0, track: api, results: { time_diff } };

    // Exact match
    if (
      title_coinc >= config.confidence_level ||
      (name_coinc >= config.confidence_level &&
        mix_coinc >= config.confidence_level)
    ) {
      if (config.match_artists) {
        if (artists_match.main > config.confidence_level)
          return { match: 100, track: api, results };
        else
          return {
            match: artists_match.main * artists_match.remixer,
            track: api,
            results,
          };
      } else return { match: 100, track: api, results };
    }
    // Fuzzy match
    else if (title_coinc >= config.confidence_level) {
      if (config.match_artists) {
        if (
          artists_match.main > config.confidence_level &&
          artists_match.remixer > config.confidence_level
        )
          return { match: 100, track: api, results };
        else
          return {
            match: title_coinc * artists_match.main * artists_match.remixer,
            track: api,
            results,
          };
      } else
        return {
          match: Math.max(title_coinc, name_coinc * mix_coinc),
          track: api,
          results,
        };
    }
    // No match
    else {
      return { match: 0, track: api, results };
    }
  }

  private match_artists(
    local_track: TrackDTO,
    api_track: SpotifyApi.TrackObjectFull,
  ): { main: number; remixer: number; all: number } {
    const local: Artists = local_track.artists_dto
      ? local_track.artists_dto
      : new Artists(
          local_track.artist,
          undefined,
          undefined,
          local_track.remixer,
          undefined,
        );
    const api: Artists = new Artists(
      undefined,
      api_track.artists.map((artist) => artist.name),
    );

    //Artist fields
    const artist_coinc =
      local.artist && api.artist
        ? token_sort_ratio(local.artist, api.artist)
        : 0;
    const remixer_coinc =
      !local.remixer && !api.remixer
        ? 100
        : local.remixer && api.remixer
        ? token_sort_ratio(local.remixer, api.remixer)
        : 0;

    const artists_coinc =
      local.artist && api.artist
        ? token_sort_ratio(
            local.remixer ? `${local.artist}, ${local.remixer}` : local.artist,
            api.remixer ? `${api.artist}, ${api.remixer}` : api.artist,
          )
        : 0;
    /*
    console.log(
      `Local artists: ${local.artist}\nAPI Artist: ${api.artist}\nArtist coinc: ${artist_coinc}\n
      \nLocal remixer: ${local.remixer}\nAPI Remixer: ${api.remixer}\nRemixer coinc: ${remixer_coinc}`,
    );
    */
    return { main: artist_coinc, remixer: remixer_coinc, all: artist_coinc };
  }

  /*
  //TODO: Improve artist match algorithm
  private match_artists(
    local_track: TrackDTO,
    api_track: SpotifyApi.TrackObjectFull,
    config: MatchSettings,
  ): number {
    const local: Artists = local_track.artists_dto
      ? local_track.artists_dto
      : new Artists(
          local_track.artist,
          undefined,
          undefined,
          local_track.remixer,
          undefined,
        );
    local.retagFields(local_track.title ? local_track.title : '');
    const api: Artists = new Artists(
      undefined,
      api_track.artists.map((artist) => artist.name),
    );
    api.retagFields(api_track.name);

    //Artist fields
    const artist_coinc =
      local.artist && api.artist ? ratio(local.artist, api.artist) : 0;
    const remixer_coinc =
      local.remixer && api.remixer ? ratio(local.remixer, api.remixer) : 0;

    //Artists in arrays
    const artists_coinc =
      local.artists && api.artists
        ? token_sort_ratio(
            Helpers.join_artists(local.artists.map((artist) => artist.name)),
            Helpers.join_artists(api.artists.map((artist) => artist.name)),
          )
        : 0;
    const main_artists_coinc =
      local.main && api.main
        ? token_sort_ratio(
            Helpers.join_artists(local.main.map((artist) => artist.name)),
            Helpers.join_artists(api.main.map((artist) => artist.name)),
          )
        : 0;
    const feat_artists_coinc =
      local.featurers && api.featurers
        ? token_sort_ratio(
            Helpers.join_artists(local.featurers.map((artist) => artist.name)),
            Helpers.join_artists(api.featurers.map((artist) => artist.name)),
          )
        : 0;
    const remixers_coinc =
      local.remixers && api.remixers
        ? token_sort_ratio(
            Helpers.join_artists(local.remixers.map((artist) => artist.name)),
            Helpers.join_artists(api.remixers.map((artist) => artist.name)),
          )
        : 0;

    if (
      artist_coinc >= config.confidence_level ||
      artists_coinc >= config.confidence_level ||
      (main_artists_coinc >= config.confidence_level &&
        (feat_artists_coinc >= config.confidence_level ||
          remixer_coinc >= config.confidence_level ||
          remixers_coinc >= config.confidence_level))
    )
      return 1;
    else
      return Math.max(
        artist_coinc,
        artists_coinc,
        main_artists_coinc *
          Math.max(feat_artists_coinc, remixer_coinc, remixers_coinc),
      );
  }
  */
}
