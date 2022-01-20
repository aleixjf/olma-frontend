import * as Helpers from 'src/app/Shared/services/helpers/Helpers';
import { ArtistDTO } from '../artist.dto';

export class Artists {
  artist?: string; // ID3 Field - TPE1
  remixer?: string; // ID3 Field - TPE4
  composer?: string; // ID3 Field - TCOM
  lyricist?: string; // ID3 Field - TEXT

  /* Artist's info */
  artists?: ArtistDTO[]; // All artists
  main?: ArtistDTO[]; // Main artists
  featurers?: ArtistDTO[]; // Featuring artists
  remixers?: ArtistDTO[]; // Remixers of the track
  composers?: ArtistDTO[]; // Composers
  lyricists?: ArtistDTO[]; // Lyricists

  constructor(
    artist?: string,
    artists?: ArtistDTO[] | string[],
    featurers?: ArtistDTO[] | string[],
    remixer?: string,
    remixers?: ArtistDTO[] | string[],
    composer?: string,
    composers?: ArtistDTO[] | string[],
    lyricist?: string,
    lyricists?: ArtistDTO[] | string[],
  ) {
    this.artist = artist;
    if (!this.artist && artists) {
      if (typeof artists[0] === 'string') this.artist = artists.join(', ');
      else
        this.artist = (artists as ArtistDTO[])
          .map((artist) => artist.name)
          .join(', ');
    }
    this.remixer = remixer;
    this.composer = composer;
    this.lyricist = lyricist;

    if (artists && artists.length > 0 && typeof artists[0] === 'string')
      this.artists = (artists as string[]).map(
        (artist) => new ArtistDTO(artist),
      );
    else if (artists) this.artists = artists as ArtistDTO[];
    else if (artist)
      this.artists = Helpers.parse_artist(artist).map(
        (artist) => new ArtistDTO(artist),
      );

    if (featurers && featurers.length > 0 && typeof featurers[0] === 'string')
      this.featurers = (featurers as string[]).map(
        (artist) => new ArtistDTO(artist),
      );
    else if (featurers) this.featurers = featurers as ArtistDTO[];
    //else if (featurer) this.artists = Helpers.parse_artist(featurer).map(artist => new ArtistDTO(artist));

    if (remixers && remixers.length > 0 && typeof remixers[0] === 'string')
      this.remixers = (remixers as string[]).map(
        (artist) => new ArtistDTO(artist),
      );
    else if (remixers) this.remixers = remixers as ArtistDTO[];
    else if (remixer)
      this.remixers = Helpers.parse_artist(remixer).map(
        (artist) => new ArtistDTO(artist),
      );

    if (composers && composers.length > 0 && typeof composers[0] === 'string')
      this.composers = (composers as string[]).map(
        (artist) => new ArtistDTO(artist),
      );
    else this.artists = artists as ArtistDTO[];

    if (lyricists && lyricists.length > 0 && typeof lyricists[0] === 'string')
      this.lyricists = (lyricists as string[]).map(
        (artist) => new ArtistDTO(artist),
      );
    else if (lyricists) this.lyricists = lyricists as ArtistDTO[];
    else if (lyricist)
      this.lyricists = Helpers.parse_artist(lyricist).map(
        (artist) => new ArtistDTO(artist),
      );
  }

  /* ID3 Tags */
  /*
  fillRemixer(mix: string) {
    if (!this.remixer) this.remixer = Helpers.remixer(mix, true)
  }

  fillFeaturer(title: string) {
    if (!this.featurers) this.featurers = Helpers.featurers(mix, true)
  }
  */

  retagFields(title: string, mix?: string) {
    this.main = this.artists;

    /* Featurers */
    let featurers: string | undefined = Helpers.featurers(title);
    if (featurers) {
      this.featurers = Helpers.parse_artist(featurers).map(
        (artist) => new ArtistDTO(artist),
      );
    }
    if (this.artist) {
      featurers = Helpers.featurers(this.artist);
      if (featurers && this.featurers) {
        const existing_featurers: string[] = this.featurers.map(
          (artist) => artist.name,
        );
        let featurers_array = Helpers.parse_artist(featurers);
        featurers_array = featurers_array.filter(
          (artist) => !existing_featurers.includes(artist),
        );

        this.featurers = this.featurers.concat(
          featurers_array.map((artist) => new ArtistDTO(artist)),
        );
      } else if (featurers) {
        this.featurers = Helpers.parse_artist(featurers).map(
          (artist) => new ArtistDTO(artist),
        );
      }
    }

    /* Remixer */
    if (!this.remixer) {
      let remixer: string | undefined;
      if (mix) remixer = Helpers.remixer(mix, true);
      if (!remixer) remixer = Helpers.remixer(title, false);
      this.remixer = remixer;
    }
  }
}
