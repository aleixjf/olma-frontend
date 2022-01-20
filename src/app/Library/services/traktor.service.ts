/*
Documentation:
https://en.wikipedia.org/wiki/ID3
*/

//Angular
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

//Models
import { TraktorLibrary } from '../models/library';
import { FolderDTO, isFolderDTO } from 'src/app/Shared/models/folder.dto';
import { PlaylistDTO } from 'src/app/Shared/models/playlist.dto';
import { RulesDTO } from 'src/app/Shared/models/rules.dto';
import { TrackDTO } from 'src/app/Shared/models/track.dto';
import { AlbumDTO } from 'src/app/Shared/models/album.dto';
//Models - Cues
import { CueDTO } from 'src/app/Shared/models/cues/cue';
import { LoopDTO } from 'src/app/Shared/models/cues/loop';
import { GridMarkerDTO } from 'src/app/Shared/models/cues/gridMarker';
//Models - Metadata
import { PlatformIDs } from 'src/app/Shared/models/metadata/platformIDs';
import { Artists } from 'src/app/Shared/models/metadata/artists';
//Models - XML
import { XMLDeclaration } from '../models/xml/xml';
import {
  NML,
  Location,
  isLocation,
  Album,
  isAlbum,
  ModificationInfo,
  isModificationInfo,
  Info,
  isInfo,
  Tempo,
  isTempo,
  Loudness,
  isLoudness,
  MusicalKey,
  isMusicalKey,
  CueV2,
  isCue,
  Stems,
  isStems,
  TraktorXMLLibrary,
  Head,
  MusicFolders,
  Collection,
  Track,
  Playlist,
  Playlists,
  Sets,
  RemixSet,
  SortingInfo,
  Indexing,
  Folder,
  Node,
  isFolder,
  Smartlist,
  SearchExpression,
  isSearchExpression,
  Entry,
} from '../models/xml/traktor.xml';

//External dependencies
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class TraktorService {
  private decimals = 6;
  private tracks!: TrackDTO[];

  constructor(private datePipe: DatePipe) {
    this.tracks = [];
  }

  deserializeLibrary(library: NML): TraktorLibrary {
    //Tracks
    let tracks = this.deserializeTracks(library.elements?.[2].elements);
    if (tracks) this.tracks = tracks;
    else tracks = this.tracks;

    //Playlists
    let playlists: FolderDTO | any;
    if (library.elements?.[4].elements)
      playlists = this.deserializeNode(
        library.elements?.[4].elements?.[0],
        'Traktor Playlists',
      );

    const musicFolders: MusicFolders = library.elements?.[1]
      ? library.elements?.[1]
      : {
          type: 'element',
          name: 'MUSICFOLDERS',
        };
    const remixSets: Sets = library.elements?.[3]
      ? library.elements?.[3]
      : {
          type: 'element',
          name: 'SETS',
          attributes: {
            ENTRIES: '0',
          },
        };
    const indexing: Indexing = library.elements?.[5]
      ? library.elements?.[5]
      : {
          type: 'element',
          name: 'INDEXING',
          //elements: indexing,
        };

    return { tracks, playlists, musicFolders, remixSets, indexing };
  }

  serializeLibrary(library: TraktorLibrary): TraktorXMLLibrary {
    const tracks: Track[] | undefined = library.tracks
      ? this.serializeTracks(library.tracks)
      : undefined;
    const tree: Playlists = this.serializeTree(library.playlists);
    let sets: RemixSet[];
    let indexing: SortingInfo[];

    const Head: Head = {
      type: 'element',
      name: 'HEAD',
      attributes: {
        COMPANY: 'www.native-instruments.com',
        PROGRAM: 'Traktor',
      },
    };
    const MusicFolders: MusicFolders = library.musicFolders
      ? library.musicFolders
      : {
          type: 'element',
          name: 'MUSICFOLDERS',
        };
    const Collection: Collection = {
      type: 'element',
      name: 'COLLECTION',
      attributes: {
        ENTRIES: tracks ? tracks.length.toString() : '0',
      },
      elements: tracks,
    };
    const Sets: Sets = library.remixSets
      ? library.remixSets
      : {
          type: 'element',
          name: 'SETS',
          attributes: {
            ENTRIES: '0',
          },
        };
    const Playlists: Playlists = this.serializeTree(library.playlists);
    const Indexing: Indexing = library.indexing
      ? library.indexing
      : {
          type: 'element',
          name: 'INDEXING',
          //elements: indexing,
        };
    const NML: NML = {
      type: 'element',
      name: 'NML',
      attributes: {
        VERSION: '19',
      },
      elements: [Head, MusicFolders, Collection, Sets, Playlists, Indexing],
    };
    const declaration: XMLDeclaration = {
      attributes: {
        version: '1.0',
        encoding: 'UTF-8',
        standalone: 'no',
      },
    };

    return { declaration, elements: [NML] };
  }

  deserializeTracks(tracks: Track[] | undefined): TrackDTO[] {
    if (!tracks) return [];
    else
      return tracks.map((track) => {
        const location: Location | undefined =
          track.elements?.find<Location>(isLocation);
        const album: Album | undefined = track.elements?.find<Album>(isAlbum);
        const modificationInfo: ModificationInfo | undefined =
          track.elements?.find<ModificationInfo>(isModificationInfo);
        const info: Info | undefined = track.elements?.find<Info>(isInfo);
        const tempo: Tempo | undefined = track.elements?.find<Tempo>(isTempo);
        const loudness: Loudness | undefined =
          track.elements?.find<Loudness>(isLoudness);
        const musicalKey: MusicalKey | undefined =
          track.elements?.find<MusicalKey>(isMusicalKey);
        const cues: CueV2[] | undefined = track.elements?.filter<CueV2>(isCue);
        const stems: Stems | undefined = track.elements?.find<Stems>(isStems);

        //1. Check if it's a local track or one from streamming services --> Metadata needs to be handled differently;
        let platform: string | undefined;
        let platform_id: number | undefined;
        if (!location?.attributes.hasOwnProperty('WEBADDRESS'))
          platform = 'local';
        else {
          const uri = location.attributes.WEBADDRESS!;
          const id = uri.match(/\d+/g)?.join('');
          platform_id = id ? parseInt(id) : undefined;
          if (uri.includes('beatport')) platform = 'beatport';
          else if (uri.includes('beatsource')) platform = 'beatsource';
        }

        //2. Build our track object
        const platformIds: PlatformIDs = {
          beatport: platform == 'beatport' ? platform_id : undefined,
          beatsource: platform == 'beatsource' ? platform_id : undefined,
        };

        /* Title information */
        let title: string | undefined;
        let name: string | undefined;
        const mix: string | undefined = info?.attributes?.MIX;
        const version = undefined;
        if (platform == 'local') {
          title = track.attributes?.TITLE;
        } else {
          //Beatport & Beatsource trakcs have the 'name' in the title field.
          name = track.attributes?.TITLE;
        }

        /* Track information */
        const artists: Artists = new Artists(
          track.attributes?.ARTIST,
          undefined,
          undefined,
          info?.attributes?.REMIXER,
          undefined,
          info?.attributes?.PRODUCER,
        );
        //if (info?.attributes?.MIX && !info?.attributes?.REMIXER) artists.fillRemixer(info.attributes.MIX)
        let album_dto: AlbumDTO | undefined;
        if (album?.attributes.TITLE) {
          album_dto = new AlbumDTO(album.attributes.TITLE);
        }

        const track_number: number | undefined = album?.attributes.TRACK
          ? parseInt(album.attributes.TRACK)
          : undefined;
        const disc_number = undefined;

        const duration: number | undefined = info?.attributes?.PLAYTIME_FLOAT
          ? parseFloat(info.attributes.PLAYTIME_FLOAT)
          : info?.attributes?.PLAYTIME
          ? parseInt(info.attributes.PLAYTIME)
          : undefined;
        const bpm: number | undefined = tempo?.attributes?.BPM
          ? parseFloat(tempo.attributes.BPM)
          : undefined;
        const key: string | undefined = info?.attributes?.KEY;
        const key_id: number | undefined = musicalKey?.attributes?.VALUE
          ? parseInt(musicalKey?.attributes?.VALUE)
          : undefined;
        const genre: string | undefined = info?.attributes?.GENRE;

        const release_date = info?.attributes?.RELEASE_DATE;
        const publish_date = undefined;

        /* Extra information */
        const isrc = undefined;
        const label = info?.attributes?.LABEL;
        const catalog_number = info?.attributes?.CATALOG_NO;
        const copyright = undefined;
        const terms = undefined;

        const rating = info?.attributes?.RANKING
          ? parseInt(info.attributes.RANKING) / 51
          : undefined;
        const comments = info?.attributes?.COMMENT;

        const lyrics = info?.attributes?.KEY_LYRICS;
        const language = undefined;

        /* File information */
        let path = undefined;
        const volume = location?.attributes.VOLUME;
        const volume_id = location?.attributes.VOLUMEID;
        const dir = location?.attributes.DIR;
        const file_name = location?.attributes.FILE;
        if (volume_id && dir && file_name)
          path = `${volume_id}${dir}${file_name}`;

        const file_size: number | undefined = info?.attributes?.FILESIZE
          ? parseInt(info?.attributes?.FILESIZE)
          : undefined; //file size in KB
        const file_type = undefined;
        const encoder_info = undefined;
        const bitrate: number | undefined = info?.attributes?.BITRATE
          ? parseInt(info?.attributes?.BITRATE)
          : undefined;

        const peak_db: number | undefined = loudness?.attributes?.PEAK_DB
          ? parseFloat(loudness.attributes.PEAK_DB)
          : undefined;
        const perceived_db: number | undefined = loudness?.attributes
          ?.PERCEIVED_DB
          ? parseFloat(loudness.attributes.PERCEIVED_DB)
          : undefined;
        const analyzed_db: number | undefined = loudness?.attributes
          ?.ANALYZED_DB
          ? parseFloat(loudness.attributes.ANALYZED_DB)
          : undefined;

        /* Library information */
        const import_date: Date | undefined = info?.attributes?.IMPORT_DATE
          ? new Date(info.attributes.IMPORT_DATE)
          : undefined;
        const last_played: Date | undefined = info?.attributes?.LAST_PLAYED
          ? new Date(info.attributes.LAST_PLAYED)
          : undefined;
        const playcount: number | undefined = info?.attributes?.PLAYCOUNT
          ? parseInt(info.attributes.PLAYCOUNT)
          : undefined;

        let modification_date: Date | undefined;
        if (track.attributes?.MODIFIED_DATE && track.attributes?.MODIFIED_TIME)
          modification_date = new Date(
            Date.parse(track.attributes.MODIFIED_DATE) +
              parseInt(track.attributes.MODIFIED_TIME) * 1000,
          );
        else if (track.attributes?.MODIFIED_DATE)
          modification_date = new Date(track.attributes.MODIFIED_DATE);
        const modification_author: string | undefined =
          modificationInfo?.attributes?.AUTHOR_TYPE;

        /* DJ information */
        const grid_lock = track?.attributes?.LOCK
          ? track.attributes.LOCK == '1'
            ? true
            : false
          : undefined;
        const grid_locked_date = track.attributes?.LOCK_MODIFICATION_TIME
          ? new Date(track.attributes.LOCK_MODIFICATION_TIME)
          : undefined;
        const gridMarkers = cues
          ?.filter((cue) => parseInt(cue.attributes.TYPE) == 4)
          .map<GridMarkerDTO>((gridMarker) => {
            const name = gridMarker.attributes.NAME;
            const index = parseInt(gridMarker.attributes.HOTCUE);
            const position = parseFloat(gridMarker.attributes.START);
            return new GridMarkerDTO(
              position,
              bpm!,
              index,
              name,
              undefined,
              undefined,
            );
          });
        const hotcues: CueDTO[] | undefined = cues
          ?.filter((cue) => parseInt(cue.attributes.TYPE) < 4)
          .map<CueDTO>((cuePoint) => {
            const name = cuePoint.attributes.NAME;
            const index = parseInt(cuePoint.attributes.HOTCUE);
            const type = parseInt(cuePoint.attributes.TYPE);
            const position = parseFloat(cuePoint.attributes.START);
            return new CueDTO(position, index, name, type);
          });
        const loops: LoopDTO[] | undefined = cues
          ?.filter((cue) => parseInt(cue.attributes.TYPE) == 5)
          .map<LoopDTO>((loop) => {
            const name = loop.attributes.NAME;
            const index = parseInt(loop.attributes.HOTCUE);
            const position = parseFloat(loop.attributes.START);
            const length = parseFloat(loop.attributes.LEN);
            return new LoopDTO(position, length, index, name);
          });
        let energy: string | undefined;
        if (comments?.match(/energy (?<Level>\d{1}|\d{2})(?!\d)/i))
          energy = comments?.match(/energy (?<Level>\d{1}|\d{2})(?!\d)/i)?.[0];

        /* Traktor metadata */
        const comments2 = info?.attributes?.RATING;
        const audio_id = track.attributes?.AUDIO_ID;
        const flags = info?.attributes?.FLAGS;
        const cover_art_id = info?.attributes?.COVERARTID;
        const bpm_quality = tempo?.attributes?.BPM_QUALITY;
        const stems_info = stems?.attributes?.STEMS;

        return new TrackDTO(
          uuid.v4(),
          platformIds,
          undefined,
          title,
          name,
          mix,
          version,
          artists,
          album_dto,
          track_number,
          disc_number,
          duration,
          bpm,
          key,
          key_id,
          genre,
          release_date,
          publish_date,
          isrc,
          label,
          catalog_number,
          copyright,
          terms,
          rating,
          comments,
          lyrics,
          language,
          path,
          volume,
          volume_id,
          dir,
          file_name,
          file_type,
          file_size,
          encoder_info,
          bitrate,
          peak_db,
          perceived_db,
          analyzed_db,
          import_date,
          last_played,
          playcount,
          modification_date,
          modification_author,
          grid_lock,
          grid_locked_date,
          gridMarkers,
          hotcues,
          loops,
          energy,
          audio_id,
          comments2,
          flags,
          cover_art_id,
          bpm_quality,
          stems_info,
        );
      });
  }

  serializeTracks(tracks: TrackDTO[]): Track[] {
    return tracks.map((track) => {
      const location: Location = {
        type: 'element',
        name: 'LOCATION',
        attributes: {
          WEBADDRESS: track.ids.beatport
            ? `beatport://tracks/${track.ids.beatport}`
            : track.ids.beatsource
            ? `beatsource://tracks/${track.ids.beatsource}`
            : undefined, //TO-DO: Add setting to use beatport or beatsource first if matched to both services
          DIR: track.dir,
          FILE: track.file_name,
          VOLUME: track.volume,
          VOLUMEID: track.volume_id,
        },
      };

      const album: Album = {
        type: 'element',
        name: 'ALBUM',
        attributes: {
          TITLE: track.album,
          TRACK: track.track_number?.toString(),
        },
      };

      const modificationInfo: ModificationInfo = {
        type: 'element',
        name: 'MODIFICATION_INFO',
        attributes: {
          AUTHOR_TYPE: track.modification_author,
        },
      };

      const import_date = track.import_date
        ? this.datePipe.transform(track.import_date, 'yyyy/M/d')
        : undefined;
      const last_played = track.last_played
        ? this.datePipe.transform(track.last_played, 'yyyy/M/d')
        : undefined;
      const release_date = track.release_date
        ? this.datePipe.transform(track.release_date, 'yyyy/M/d')
        : undefined;
      const info: Info = {
        type: 'element',
        name: 'INFO',
        attributes: {
          GENRE: track.genre,
          KEY: track.key,
          RANKING: track.rating ? (track.rating * 51).toString() : undefined,
          BITRATE: track.bitrate?.toString(),
          COVERARTID: track.cover_art_id,

          COMMENT: track.comments,
          RATING: track.comments2,
          KEY_LYRICS: track.lyrics,

          MIX: track.mix,
          REMIXER: track.remixer,
          PRODUCER: track.composer,

          RELEASE_DATE:
            typeof release_date === 'string' ? release_date : undefined,
          LABEL: track.label,
          CATALOG_NO: track.catalog_number,

          IMPORT_DATE:
            typeof import_date === 'string' ? import_date : undefined,
          FILESIZE: track.file_size?.toString(),
          FLAGS: track.flags,

          PLAYTIME: track.duration
            ? Math.ceil(track.duration).toFixed(0)
            : undefined,
          PLAYTIME_FLOAT: track.duration?.toFixed(this.decimals),
          PLAYCOUNT: track.playcount?.toString(),
          LAST_PLAYED:
            typeof last_played === 'string' ? last_played : undefined,
        },
      };

      const tempo: Tempo = {
        type: 'element',
        name: 'TEMPO',
        attributes: {
          BPM: track.bpm?.toFixed(this.decimals),
          BPM_QUALITY: track.bpm_quality,
        },
      };

      const loudness: Loudness = {
        type: 'element',
        name: 'LOUDNESS',
        attributes: {
          PEAK_DB: track.peak_db?.toFixed(this.decimals),
          PERCEIVED_DB: track.perceived_db?.toFixed(this.decimals),
          ANALYZED_DB: track.analyzed_db?.toFixed(this.decimals),
        },
      };

      const musicalKey: MusicalKey = {
        type: 'element',
        name: 'MUSICAL_KEY',
        attributes: {
          VALUE: track.key_id?.toString(),
        },
      };

      const hotcues = track.hotcues?.map<CueV2>((hotcue) => {
        return {
          type: 'element',
          name: 'CUE_V2',
          attributes: {
            NAME: hotcue.name ? hotcue.name : 'n.n.',
            DISPL_ORDER: hotcue.order.toString(),
            TYPE: hotcue.type ? hotcue.type.toString() : '0',
            START: hotcue.position.toFixed(this.decimals).toString(),
            LEN: '0.000000',
            REPEATS: hotcue.repeats.toString(),
            HOTCUE: hotcue.index.toString(),
          },
        };
      });
      const loops = track.loops?.map<CueV2>((loop) => {
        return {
          type: 'element',
          name: 'CUE_V2',
          attributes: {
            NAME: loop.name ? loop.name : 'n.n.',
            DISPL_ORDER: loop.order.toString(),
            TYPE: loop.type.toString(),
            START: loop.position.toFixed(this.decimals),
            LEN: loop.length.toFixed(this.decimals),
            REPEATS: loop.repeats.toString(),
            HOTCUE: loop.index.toString(),
          },
        };
      });
      const gridMarkers = track.gridMarkers?.map<CueV2>((gridMarker) => {
        return {
          type: 'element',
          name: 'CUE_V2',
          attributes: {
            NAME: gridMarker.name ? gridMarker.name : 'n.n.',
            DISPL_ORDER: gridMarker.order.toString(),
            TYPE: gridMarker.type.toString(),
            START: gridMarker.position.toFixed(this.decimals),
            LEN: '0.000000',
            REPEATS: gridMarker.repeats.toString(),
            HOTCUE: gridMarker.index.toString(),
          },
        };
      });

      const stems: Stems | undefined = track.stems
        ? {
            type: 'element',
            name: 'STEMS',
            attributes: {
              STEMS: track.stems,
            },
          }
        : undefined;

      let elements: (
        | Location
        | Album
        | ModificationInfo
        | Info
        | Tempo
        | Loudness
        | MusicalKey
        | CueV2
        | Stems
      )[] = [
        location,
        album,
        modificationInfo,
        info,
        tempo,
        loudness,
        musicalKey,
      ];
      /*
      if (hotcues) elements = elements.concat(hotcues.flat())
      if (loops) elements = elements.concat(loops.flat())
      if (gridMarkers) elements = elements.concat(gridMarkers.flat())
      */

      let cues: CueV2[] = [];
      if (hotcues) cues = cues.concat(hotcues.flat());
      if (loops) cues = cues.concat(loops.flat());
      if (gridMarkers) cues = cues.concat(gridMarkers.flat());

      if (cues.length > 0) {
        //Sort like Traktor does: by 'START' position (position in the Waveform')
        /*
        Additionally, if 2 cues overlap, sort by their type with this priority order:
        1. GridMarkers
        2. Load
        3. FadeIn
        4. FadeOut
        5. Loop
        6. HotCue
        */
        //cues.sort((a,b) => (parseFloat(a.attributes.START) < parseFloat(b.attributes.START)) ? -1 : ((parseFloat(b.attributes.START) < parseFloat(a.attributes.START)) ? 1 : 0))
        cues.sort((a, b) =>
          parseFloat(a.attributes.START) < parseFloat(b.attributes.START)
            ? -1
            : parseFloat(b.attributes.START) < parseFloat(a.attributes.START)
            ? 1
            : a.attributes.TYPE == '4'
            ? -1
            : b.attributes.TYPE == '4'
            ? 1
            : a.attributes.HOTCUE != '-1'
            ? -1
            : b.attributes.HOTCUE != '-1'
            ? 1
            : 0,
        );
        elements = elements.concat(cues.flat());
      }

      if (stems) elements.push(stems);

      const modification_date: Date | undefined = track.modification_date;
      const modified_date = modification_date
        ? this.datePipe.transform(modification_date, 'yyyy/M/d')
        : undefined;
      const modified_time = modification_date
        ? Math.round(
            (modification_date.getTime() - Date.parse(modified_date!)) / 1000,
          ).toString()
        : undefined;
      const grid_modification_date = track.grid_locked_date
        ? this.datePipe.transform(track.grid_locked_date, 'yyyy-MM-ddThh:mm:ss')
        : undefined;
      const formatted: Track = {
        type: 'element',
        name: 'ENTRY',
        attributes: {
          AUDIO_ID: track.audio_id,
          TITLE: track.title,
          ARTIST: track.artist,
          MODIFIED_DATE:
            typeof modified_date === 'string' ? modified_date : undefined,
          MODIFIED_TIME: modified_time,
          LOCK: track.grid_lock ? '1' : undefined,
          LOCK_MODIFICATION_TIME:
            typeof grid_modification_date === 'string' && track.grid_lock
              ? grid_modification_date
              : undefined,
        },
        elements: elements,
      };
      return formatted;
    });
  }

  deserializeNode(node: Node, customName?: string): FolderDTO | PlaylistDTO {
    const name: string = customName ? customName : node.attributes.NAME;
    let children: (FolderDTO | PlaylistDTO)[];
    if (node.elements)
      children = node.elements.map<FolderDTO | PlaylistDTO>((element) => {
        if (isFolder(element)) return this.deserializeFolder(element, name);
        else return this.deserializePlaylist(element, name);
      });
    return children![0];
  }
  deserializeFolder(folder: Folder, name: string): FolderDTO {
    let items: (FolderDTO | PlaylistDTO)[] | undefined;
    if (folder.elements)
      items = folder.elements.map((node) => {
        return this.deserializeNode(node);
      });
    return new FolderDTO(name, undefined, items);
  }
  deserializePlaylist(
    playlist: Playlist | Smartlist,
    name: string,
  ): PlaylistDTO {
    const ids: PlatformIDs = { traktor: playlist.attributes?.UUID };
    const tracks: string[] = [];
    const rules: RulesDTO[] = [];

    if (playlist.elements)
      playlist.elements.forEach((element) => {
        if (isSearchExpression(element))
          rules.push(
            new RulesDTO(
              parseInt(element.attributes.VERSION),
              element.attributes.QUERY,
            ),
          );
        else {
          tracks.push(element.elements[0].attributes.KEY);
        }
      });

    return new PlaylistDTO(
      name,
      ids,
      tracks.length > 0 ? tracks : undefined,
      rules.length > 0 ? rules[0] : undefined,
      this.tracks,
    );
  }

  serializeTree(playlists: FolderDTO | undefined): Playlists {
    return {
      type: 'element',
      name: 'PLAYLISTS',
      elements: playlists
        ? this.serializeNode([playlists], '$ROOT')
        : undefined,
    };
  }

  serializeNode(
    node: (FolderDTO | PlaylistDTO)[],
    customName?: string,
  ): Node[] {
    return node.map((element) => {
      if (isFolderDTO(element))
        return {
          type: 'element',
          name: 'NODE',
          attributes: {
            TYPE: 'FOLDER',
            NAME: customName ? customName : element.name,
          },
          elements: [this.serializeFolder(element.items)],
        };
      else if (element.rules && element.rules.traktor_supported)
        return {
          type: 'element',
          name: 'NODE',
          attributes: {
            TYPE: 'SMARTLIST',
            NAME: customName ? customName : element.name,
          },
          elements: [this.serializeSmartlist(element)],
        };
      else
        return {
          type: 'element',
          name: 'NODE',
          attributes: {
            TYPE: 'PLAYLIST',
            NAME: customName ? customName : element.name,
          },
          elements: [this.serializePlaylist(element)],
        };
    });
  }

  serializeFolder(items: (FolderDTO | PlaylistDTO)[] | undefined): Folder {
    return {
      type: 'element',
      name: 'SUBNODES',
      attributes: {
        COUNT: items ? items.length.toString() : '0',
      },
      elements: items ? this.serializeNode(items) : undefined,
    };
  }

  serializePlaylist(playlist: PlaylistDTO): Playlist {
    return {
      type: 'element',
      name: 'PLAYLIST',
      attributes: {
        UUID: playlist.ids?.traktor?.toString(), //INFO: Traktor will automatically generate an UUID for them.
        TYPE: 'LIST',
        ENTRIES: playlist.tracks ? playlist.tracks.length.toString() : '0',
      },
      elements: playlist.tracks?.map<Entry>((track) => {
        return {
          type: 'element',
          name: 'ENTRY',
          elements: [
            {
              type: 'element',
              name: 'PRIMARYKEY',
              attributes: {
                TYPE: 'TRACK',
                KEY: typeof track === 'string' ? track : track.path!,
              },
            },
          ],
        };
      }),
    };
  }

  serializeSmartlist(playlist: PlaylistDTO): Smartlist {
    return {
      type: 'element',
      name: 'SMARTLIST',
      attributes: {
        UUID: playlist.ids?.traktor
          ? playlist.ids.traktor?.toString()
          : undefined,
      },
      elements: [playlist.rules!].map<SearchExpression>((rule) => {
        return {
          type: 'element',
          name: 'SEARCH_EXPRESSION',
          attributes: {
            VERSION: rule.version.toString(),
            QUERY: rule.query,
          },
        };
      }),
    };
  }
}
