import { PlatformIDs } from 'src/app/Shared/models/metadata/platformIDs';
import { TrackDTO } from 'src/app/Shared/models/track.dto';
import { RulesDTO } from './rules.dto';

export class PlaylistDTO {
  name: string;
  ids: PlatformIDs;
  tracks: TrackDTO[];
  rules?: RulesDTO;

  constructor(
    name: string,
    ids: PlatformIDs,
    tracks: TrackDTO[] | string[] = [],
    rules?: RulesDTO,
    library?: TrackDTO[],
  ) {
    this.name = name;
    this.ids = ids;
    this.rules = rules;
    if (tracks.length > 0 && typeof tracks[0] === 'string')
      this.tracks = this.buildTracks(
        library ? library : [],
        tracks as string[],
        'path',
      );
    else if (rules) this.tracks = this.buildTracks(library ? library : []);
    else this.tracks = tracks as TrackDTO[];
  }

  get num_tracks(): number {
    return this.tracks ? this.tracks.length : 0;
  }

  get type(): 'smartlist' | 'playlist' {
    return this.rules ? 'smartlist' : 'playlist';
  }

  track_ids(field: keyof TrackDTO): string[] {
    if (this.tracks)
      return this.tracks.map((track) => {
        const target = track[field];
        return target ? target.toString() : '';
      });
    else return [];
  }

  update_tracks(library: TrackDTO[] = []): void {
    const ids = this.track_ids('uuid');
    this.tracks = this.buildTracks(library, ids, 'uuid');
  }

  private buildTracks(
    library: TrackDTO[] = [],
    ids?: string[],
    field?: keyof TrackDTO,
  ): TrackDTO[] {
    if (this.rules) {
      return this.filterTracks(library, this.rules);
    } else if (ids && field) {
      return library.filter((track) => {
        const target = track[field];
        return target && ids.includes(target.toString());
      });
    }
    return library;
  }

  private filterTracks(library: TrackDTO[], rules: RulesDTO): TrackDTO[] {
    let tracks: TrackDTO[] = [];
    if (!rules.type || rules.type === 'or') {
      for (const rule of rules.rules) {
        library.forEach((track) => {
          const target = track[rule.field];
          if (target && rule.filter(target, rule.target)) tracks.push(track);
        });
      }
    } else {
      let iteration = 0;
      for (const rule of rules.rules) {
        if (iteration == 0) {
          library.forEach((track) => {
            const target = track[rule.field];
            if (target && rule.filter(target, rule.target)) tracks.push(track);
          });
        } else {
          tracks = tracks.filter((track) => {
            const target = track[rule.field];
            return target && rule.filter(target, rule.target);
          });
        }
        iteration++;
      }
    }
    return tracks;
  }
}

export function isPlaylistDTO(object: any): object is PlaylistDTO {
  try {
    return object.tracks;
  } catch (e) {
    return false;
  }
}
