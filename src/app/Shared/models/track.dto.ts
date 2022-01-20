import * as Helpers from 'src/app/Shared/services/helpers/Helpers';
import * as KeyHelpers from 'src/app/Shared/services/helpers/KeyHelpers';

import { PlatformIDs } from './metadata/platformIDs';
import { PlatformURLs } from './metadata/platformURLs';
import { Artists } from './metadata/artists';

import { AlbumDTO } from './album.dto';
import { Label } from './metadata/label';

//Cues
import { CueDTO } from './cues/cue';
import { LoopDTO } from './cues/loop';
import { GridMarkerDTO } from './cues/gridMarker';

//import { ParsedPath } from "path";

export class TrackDTO {
  uuid: string;
  ids: PlatformIDs;
  urls?: PlatformURLs;

  /* Title information */
  title?: string; //ID3 Field - TIT1  // Tonight is the night (AJ Remix) [Extended Mix]
  name?: string; // Tonight is the night
  mix?: string; // AJ Remix
  version?: string; // Extended Mix

  /* Artists information */
  artist?: string;
  remixer?: string;
  composer?: string;
  lyricist?: string;
  artists_dto?: Artists;

  /* Album information */
  album?: string;
  album_dto?: AlbumDTO;
  track_number?: number;
  disc_number?: number;

  duration?: number; //in s (float)
  bpm?: number; // TODO: investigate 'Synchronized tempo codes (SYTC)'
  key?: string;
  key_id?: number;
  genre?: string; //string[];

  release_date?: Date;
  publish_date?: Date;

  /* Extra information */
  isrc?: string;
  label?: string;
  label_dto?: Label;
  catalog_number?: string;
  copyright?: string; // TODO: investigate 'Copyright message (TCOP)' vs. 'Copyright/Legal information	(WCOP)'
  terms?: string; // 'Terms of use (USER)'

  rating?: number;
  comments?: string;

  lyrics?: string; // TODO: investigate 'Unsynchronized lyric/text transcription (USLT)' vs 'Synchronized lyric/text	(SYLT)'
  language?: string; //string[];

  /* File information */
  file_availability?: boolean;
  media_source?: string;
  path?: string; //Path/to/file/file_name.ext
  volume?: string; //Macintosh HDD
  volume_id?: string; //Macintosh HDD
  dir?: string; //Path/to/file
  file_name?: string; //file_name.ext
  file_type?: string; //ext
  file_size?: number; //file size in KB
  encoder_info?: string;
  bitrate?: number;

  peak_db?: number;
  perceived_db?: number;
  analyzed_db?: number;

  /* Library information */
  import_date?: Date;
  last_played?: Date;
  playcount?: number;

  modification_date?: Date;
  modification_author?: string;

  /* DJ information */
  analyzed?: boolean;
  grid_lock?: boolean;
  grid_locked_date?: Date;
  gridMarkers?: GridMarkerDTO[];
  hotcues?: CueDTO[];
  loops?: LoopDTO[];
  color?: string;
  energy?: number;

  /* Traktor metadata */
  audio_id?: string;
  comments2?: string;
  flags?: string;
  cover_art_id?: string;
  bpm_quality?: string;
  stems?: string;
  content_type?: string;
  already_played?: boolean;

  /* Spotify metadata */
  popularity?: number;
  danceability?: number;
  valence?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  speechiness?: number;
  time_signature?: string;

  constructor(
    uuid: string,
    ids?: PlatformIDs,
    urls?: PlatformURLs,

    title?: string,
    name?: string,
    mix?: string,
    version?: string,

    artists?: Artists | string[] | string,
    album_dto?: AlbumDTO,
    track_number?: number,
    disc_number?: number,

    duration?: number,
    bpm?: number,
    key?: string,
    key_id?: number,
    genre?: string,

    release_date?: Date | string | number,
    publish_date?: Date | string | number,

    /* Extra information */
    isrc?: string,
    label?: Label | string,
    catalog_number?: string,
    copyright?: string, // TODO: investigate 'Copyright message (TCOP)' vs. 'Copyright/Legal information	(WCOP)'
    terms?: string, // 'Terms of use (USER)'

    rating?: number,
    comments?: string,

    lyrics?: string, // TODO: investigate 'Unsynchronized lyric/text transcription (USLT)' vs 'Synchronized lyric/text	(SYLT)'
    language?: string, //string[];

    /* File information */
    path?: string, //Path/to/file/file_name.ext
    volume?: string, //Macintosh HDD
    volume_id?: string, //Macintosh HDD
    dir?: string, //Path/to/file
    file_name?: string, //file_name.ext
    file_type?: string, //ext
    file_size?: number, //file size in KB
    encoder_info?: string,
    bitrate?: number,

    peak_db?: number,
    perceived_db?: number,
    analyzed_db?: number,

    /* Library information */
    import_date?: Date,
    last_played?: Date,
    playcount?: number,

    modification_date?: Date,
    modification_author?: string,

    /* DJ information */
    grid_lock?: boolean,
    locked_date?: Date,
    gridMarkers?: GridMarkerDTO[],
    hotcues?: CueDTO[],
    loops?: LoopDTO[],
    energy?: number | string,

    /* Traktor metadata */
    audio_id?: string,
    comments2?: string,
    flags?: string,
    cover_art_id?: string,
    bpm_quality?: string,
    stems?: string,

    /* Spotify metadata */
    popularity?: number,
    danceability?: number,
    valence?: number,
    acousticness?: number,
    instrumentalness?: number,
    liveness?: number,
    speechiness?: number,
    time_signature?: number | string,
  ) {
    this.uuid = uuid;
    this.ids = ids ? ids : {};
    this.urls = urls;

    this.title = title;
    this.name = name;
    this.mix = mix;
    this.version = version;

    if (typeof artists === 'string') this.artists_dto = new Artists(artists);
    else if (Array.isArray(artists))
      this.artists_dto = new Artists(undefined, artists);
    else {
      this.artists_dto = artists;
      this.artist = artists?.artist;
      this.remixer = artists?.remixer;
      this.composer = artists?.composer;
      this.lyricist = artists?.lyricist;
    }

    this.album = album_dto?.name;
    this.album_dto = album_dto;
    this.track_number = track_number;
    this.disc_number = disc_number;

    this.duration = duration;
    this.bpm = bpm;
    this.key = key;
    if (!key && key_id) this.key = KeyHelpers.keyIdToCamelot(key_id);
    this.key_id = key_id;
    if (!key_id && key) this.key_id = KeyHelpers.getKeyId(key);
    this.genre = genre;

    if (typeof release_date === 'string')
      this.release_date = new Date(Date.parse(release_date));
    else if (typeof release_date === 'number')
      this.release_date = new Date(release_date);
    else if (typeof release_date?.getMonth == 'function')
      this.release_date = release_date;

    if (typeof publish_date === 'string')
      this.publish_date = new Date(Date.parse(publish_date));
    else if (typeof publish_date === 'number')
      this.publish_date = new Date(publish_date);
    else if (typeof publish_date?.getMonth == 'function')
      this.publish_date = publish_date;

    this.isrc = isrc;
    if (typeof label === 'string') this.label = label;
    else {
      this.label = label?.name;
      this.label_dto = label;
    }
    this.catalog_number = catalog_number;
    this.copyright = copyright;
    this.terms = terms;

    this.rating = rating;
    this.comments = comments;

    this.lyrics = lyrics;
    this.language = language;

    this.path = path;
    this.volume = volume;
    this.volume_id = volume_id;
    this.dir = dir;
    this.file_name = file_name;
    this.file_type = file_type;
    this.file_size = file_size;
    this.encoder_info = encoder_info;
    this.bitrate = bitrate;

    this.peak_db = peak_db;
    this.perceived_db = perceived_db;
    this.analyzed_db = analyzed_db;

    this.import_date = import_date;
    this.last_played = last_played;
    this.playcount = playcount;

    this.modification_date = modification_date;
    this.modification_author = modification_author;

    this.analyzed = audio_id && bpm_quality ? true : false;
    this.grid_lock = grid_lock;
    this.grid_locked_date = locked_date;
    this.gridMarkers = gridMarkers;
    this.hotcues = hotcues;
    this.loops = loops;
    let energy_level: string | undefined;
    if (typeof energy === 'string')
      energy_level = energy.match(/energy (?<Level>\d{1}|\d{2})(?!\d)/i)?.groups
        ?.Level;
    else this.energy = energy;
    if (energy_level) this.energy = parseInt(energy_level);

    this.audio_id = audio_id;
    this.comments2 = comments2;
    this.flags = flags;
    this.cover_art_id = cover_art_id;
    this.bpm_quality = bpm_quality;
    this.stems = stems;

    this.popularity = popularity;
    this.danceability = danceability;
    this.valence = valence;
    this.acousticness = acousticness;
    this.instrumentalness = instrumentalness;
    this.liveness = liveness;
    this.speechiness = speechiness;
    if (time_signature && typeof time_signature === 'number')
      this.time_signature = `${time_signature}/4`;
    else if (time_signature && typeof time_signature === 'string')
      this.time_signature = time_signature;

    this.content_type = stems ? 'Stem' : 'Track';
    this.file_availability = true; //INFO: We can't know if local files are where they are supposed to be.
    this.already_played = false; //INFO: We can't know if local files are where they are supposed to be.
  }

  fillTags() {
    if (this.title) {
      if (!this.name) this.name = Helpers.name(this.title);
      if (!this.mix) this.mix = Helpers.mix(this.title);
      //if (!this.version) this.mix = Helpers.version(this.title)
    } else this.fillTitle();
  }

  /* ID3 Tags */
  fillTitle() {
    if (this.name)
      this.title = Helpers.title(this.name, this.mix, this.version);
  }
}
