import { PlatformIDs } from './metadata/platformIDs';
import { PlatformURLs } from './metadata/platformURLs';
import { TrackDTO } from './track.dto';
import { AlbumDTO } from './album.dto';

export class ArtistDTO {
  /* Artist information */
  name: string;
  ids?: PlatformIDs;
  urls?: PlatformURLs;

  /* Artist work */
  albums?: AlbumDTO[];
  singles?: TrackDTO[];

  constructor(
    name: string,
    ids?: PlatformIDs,
    urls?: PlatformURLs,

    albums?: AlbumDTO[],
    singles?: TrackDTO[],
  ) {
    this.ids = ids;
    this.urls = urls;

    this.name = name;
    this.albums = albums;
    this.singles = singles;
  }
}
