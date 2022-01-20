import { XMLFile, XMLNode } from './xml';

export interface TraktorXMLLibrary extends XMLFile {
  elements: [NML];
}
export function isTraktorLibrary(object: any): object is TraktorXMLLibrary {
  return object.elements[0].name === 'NML';
}

/* ROOT NODES */
export interface NML extends XMLNode {
  name: 'NML';
  attributes: {
    VERSION: string; //number converted to string
  };
  elements?: [Head, MusicFolders, Collection, Sets, Playlists, Indexing];
}

export interface Head extends XMLNode {
  name: 'HEAD';
  attributes: {
    COMPANY: 'www.native-instruments.com';
    PROGRAM: 'Traktor';
  };
}

export interface MusicFolders extends XMLNode {
  name: 'MUSICFOLDERS';
}

export interface Collection extends XMLNode {
  name: 'COLLECTION';
  attributes: {
    ENTRIES: string; //number converted to string
  };
  elements?: Track[];
}
export function isCollection(object: any): object is Collection {
  return object.name === 'COLLECTION';
}

export interface Sets extends XMLNode {
  name: 'SETS';
  attributes: {
    ENTRIES: string; //number converted to string
  };
  elements?: RemixSet[];
}

export interface Playlists extends XMLNode {
  name: 'PLAYLISTS';
  elements?: Node[];
}
export function isPlaylists(object: any): object is Playlists {
  return object.name === 'COLLECTION';
}

export interface Indexing extends XMLNode {
  name: 'INDEXING';
  elements?: SortingInfo[];
}

/* TRACK NODE */
export interface Track extends XMLNode {
  name: 'ENTRY';
  attributes?: {
    AUDIO_ID?: string;
    TITLE?: string;
    ARTIST?: string;
    MODIFIED_DATE?: string;
    MODIFIED_TIME?: string;
    LOCK?: string;
    LOCK_MODIFICATION_TIME?: string;
  };
  elements?: (
    | Location
    | Album
    | ModificationInfo
    | Info
    | Tempo
    | Loudness
    | MusicalKey
    | CueV2
    | Stems
  )[];
}
export function isTrack(object: any): object is Track {
  return object.name === 'ENTRY';
}

export interface Location extends XMLNode {
  name: 'LOCATION';
  attributes: {
    WEBADDRESS?: string;
    DIR?: string;
    FILE?: string;
    VOLUME?: string;
    VOLUMEID?: string;
  };
}
export function isLocation(object: any): object is Location {
  return object.name === 'LOCATION';
}

export interface Album extends XMLNode {
  name: 'ALBUM';
  attributes: {
    TITLE?: string;
    TRACK?: string;
  };
}
export function isAlbum(object: any): object is Album {
  return object.name === 'ALBUM';
}

export interface ModificationInfo extends XMLNode {
  name: 'MODIFICATION_INFO';
  attributes?: {
    AUTHOR_TYPE?: string; //'user'
  };
}
export function isModificationInfo(object: any): object is ModificationInfo {
  return object.name === 'MODIFICATION_INFO';
}

export interface Info extends XMLNode {
  name: 'INFO';
  attributes?: {
    GENRE?: string;
    KEY?: string;
    RANKING?: string; //Rating
    BITRATE?: string;
    COVERARTID?: string;

    COMMENT?: string;
    RATING?: string; //Comment 2
    KEY_LYRICS?: string;

    MIX?: string;
    REMIXER?: string;
    PRODUCER?: string;

    RELEASE_DATE?: string;
    LABEL?: string;
    CATALOG_NO?: string;

    IMPORT_DATE?: string;
    FILESIZE?: string;
    FLAGS?: string;

    PLAYTIME?: string;
    PLAYTIME_FLOAT?: string;
    PLAYCOUNT?: string;
    LAST_PLAYED?: string;
  };
}

export function isInfo(object: any): object is Info {
  return object.name === 'INFO';
}

export interface Tempo extends XMLNode {
  name: 'TEMPO';
  attributes?: {
    BPM?: string;
    BPM_QUALITY?: string;
  };
}
export function isTempo(object: any): object is Tempo {
  return object.name === 'TEMPO';
}

export interface Loudness extends XMLNode {
  name: 'LOUDNESS';
  attributes?: {
    ANALYZED_DB?: string;
    PEAK_DB?: string;
    PERCEIVED_DB?: string;
  };
}
export function isLoudness(object: any): object is Loudness {
  return object.name === 'LOUDNESS';
}

export interface MusicalKey extends XMLNode {
  name: 'MUSICAL_KEY';
  attributes?: {
    VALUE?: string;
  };
}
export function isMusicalKey(object: any): object is MusicalKey {
  return object.name === 'MUSICAL_KEY';
}

export interface CueV2 extends XMLNode {
  name: 'CUE_V2';
  attributes: {
    NAME: string; //AutoGrid / Beat Marker --> Grid (name autogenerated)
    DISPL_ORDER: string;
    TYPE: string; //0: Hotcue, 1: Fade In, 2: Fade-Out, 3: Load, 4: Grid, 5: Loop
    START: string; //cue position (in ms?)
    LEN: string; //0: cue, >0: loop
    REPEATS: string; //-1: false, 1: true
    HOTCUE: string; //-1: not a hotcue, 0-7: hotcue 1-8
  };
}
export function isCue(object: any): object is CueV2 {
  return object.name === 'CUE_V2';
}

export interface Stems extends XMLNode {
  name: 'STEMS';
  attributes?: {
    STEMS?: string;
  };
}
export function isStems(object: any): object is Stems {
  return object.name === 'STEMS';
}

/* REMIX SET NODE */
export interface RemixSet extends XMLNode {
  name: 'SET';
  attributes: {
    TITLE: string;
    ARTIST: string;
    QUANT_VALUE?: string;
    QUANT_STATE?: string;
    MODIFIED_DATE?: string;
    MODIFIED_TIME?: string;
  };
  elements?: (Location | Album | ModificationInfo | Info | Tempo | Slot)[];
}

export interface Slot extends XMLNode {
  name: 'SLOT';
  attributes: {
    KEYLOCK: string;
    FXENABLE: string;
    PUNCHMODE: string;
    ACTIVE_CELL_INDEX: string;
  };
  elements?: Cell[];
}

export interface Cell extends XMLNode {
  name: 'CELL';
  attributes: {
    INDEX: string;
    CELLNAME: string;
    COLOR: string;
    SYNC: string;
    REVERSE: string;
    MODE: string;
    TYPE: string;
    SPEED: string;
    TRANSPOSE: string;
    OFFSET: string;
    NUDGE: string;
    GAIN: string;
    START_MARKER: string;
    END_MARKER: string;
    BPM: string;
    DIR: string;
    FILE: string;
    VOLUME: string;
  };
  elements?: Cell[];
}

/* PLAYLISTS NODE */
export interface Node extends XMLNode {
  name: 'NODE';
  attributes: {
    TYPE: string;
    NAME: string;
  };
  elements?: (Folder | Playlist | Smartlist)[];
}
export function isNode(object: any): object is Node {
  return object.name === 'NODE';
}

export interface Folder extends XMLNode {
  name: 'SUBNODES';
  attributes: {
    COUNT: string; //Folders + playlists inside its folder
  };
  elements?: Node[];
}
export function isFolder(object: any): object is Folder {
  return object.name === 'SUBNODES';
}

export interface Playlist extends XMLNode {
  name: 'PLAYLIST';
  attributes: {
    UUID?: string;
    TYPE: 'LIST';
    ENTRIES: string;
  };
  elements?: Entry[];
}
export function isPlaylist(object: any): object is Playlist {
  return object.name === 'PLAYLIST';
}
export interface Entry extends XMLNode {
  name: 'ENTRY';
  elements: PrimaryKey[];
}
export interface PrimaryKey extends XMLNode {
  name: 'PRIMARYKEY';
  attributes: {
    TYPE: string;
    KEY: string; //Path to audio file
  };
}

export interface Smartlist extends XMLNode {
  name: 'SMARTLIST';
  attributes: {
    UUID?: string;
  };
  elements?: SearchExpression[];
}
export function isSmartlist(object: any): object is Smartlist {
  return object.name === 'SMARTLIST';
}
export interface SearchExpression extends XMLNode {
  name: 'SEARCH_EXPRESSION';
  attributes: {
    VERSION: string;
    QUERY: string;
  };
}
export function isSearchExpression(object: any): object is SearchExpression {
  return object.name === 'SEARCH_EXPRESSION';
}

/* SORTING_INFO NODE */
export interface SortingInfo extends XMLNode {
  name: 'SORTING_INFO';
  attributes: {
    PATH: string;
  };
  elements?: SortingCriteria[];
}
export interface SortingCriteria extends XMLNode {
  name: 'CRITERIA';
  attributes: {
    ATTRIBUTE: string;
    DIRECTION: string;
  };
}