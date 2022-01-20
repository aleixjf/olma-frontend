import { PlatformIDs } from './metadata/platformIDs';
import { PlatformURLs } from './metadata/platformURLs';
import { TrackDTO } from './track.dto';
import { ArtistDTO } from './artist.dto';

export class AlbumDTO {
  /* Album information */
  name: string;
  artwork?: PlatformURLs;
  release_date?: Date;
  publish_date?: Date;

  ids?: PlatformIDs;
  urls?: PlatformURLs;

  /* Extra information */
  tracks?: TrackDTO[];
  artists?: ArtistDTO[];
  collaborators?: ArtistDTO[];

  constructor(
    name: string,
    artwork?: PlatformURLs,
    release_date?: Date,
    publish_date?: Date,

    ids?: PlatformIDs,
    urls?: PlatformURLs,

    tracks?: TrackDTO[],
    artists?: ArtistDTO[],
    collaborators?: ArtistDTO[],
  ) {
    this.ids = ids;
    this.urls = urls;

    this.name = name;
    this.artwork = artwork;
    this.release_date = release_date;
    this.publish_date = publish_date;

    this.tracks = tracks;
    this.artists = artists;
    this.collaborators = collaborators;
  }
}
