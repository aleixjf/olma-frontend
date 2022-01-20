//Angular
import { Injectable } from '@angular/core';

//RxJS
import {
  combineLatest,
  defer,
  from,
  Observable,
  Observer,
  of,
  throwError,
} from 'rxjs';
import {
  bufferTime,
  catchError,
  concatMap,
  delay,
  map,
  mergeAll,
  mergeMap,
  retryWhen,
  scan,
  take,
  tap,
} from 'rxjs/operators';

//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
//NgRX - States
import * as LibraryState from 'src/app/Library/models/library.state';
import { FolderDTO, isFolderDTO } from 'src/app/Shared/models/folder.dto';
import { isPlaylistDTO, PlaylistDTO } from 'src/app/Shared/models/playlist.dto';

//Models
import { TrackDTO } from 'src/app/Shared/models/track.dto';
import { TraktorLibrary } from '../models/library';
import { isTraktorLibrary } from '../models/xml/traktor.xml';

//Services
import { TraktorService } from './traktor.service';
import { SpotifyLibraryService } from 'src/app/Spotify/services/library.spotify.service';

//Other dependencies
import { json2xml, xml2json } from 'xml-js'; //INFO: https://www.npmjs.com/package/xml-js
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private library: TraktorLibrary | undefined;
  //private active: PlaylistDTO | undefined;
  private activeTracks: TrackDTO[] | undefined;

  constructor(
    private store: Store<AppState>,
    private traktorService: TraktorService,
    private spotifyService: SpotifyLibraryService,
  ) {
    this.store
      .select('library')
      .subscribe((response: LibraryState.LibraryState) => {
        if (response.collection) this.library = response.collection;
        /*
        if (response.active?.uuid) this.getPlaylist(response.active.uuid).subscribe(
          playlist => this.active = playlist
        )
        */
        this.activeTracks = response.active?.tracks;
      });
  }

  /* Tracks */
  getTrack(id: number | string | undefined): Observable<TrackDTO> {
    return this.getTracks().pipe(
      map((track) => {
        if (!track) throw 'No UUID provided';
        const t = track.find((track) => track.uuid == id);
        if (!t) throw 'No tracks found!';
        else return t;
      }),
      catchError((err, caught) => caught),
    );
  }

  updateTrack(track: TrackDTO): Observable<TrackDTO> {
    const t = this.getTrack(track.uuid).subscribe();
    if (t) return of(track);
    else return throwError('Track not found!');
  }

  deleteTrack(track: TrackDTO | number | string): Observable<any> {
    const id = typeof track === 'object' ? track.uuid : track;
    const t = this.getTrack(id).subscribe();
    if (t) return of({ affected: 1 });
    else return throwError('Track not found!');
  }

  /* Library */
  getTracks(ids?: string[]): Observable<TrackDTO[]> {
    let tracks: TrackDTO[] = [];
    if (this.library?.tracks) tracks = this.library.tracks;
    //if (ids) return of(tracks.filter(track => track.ids.traktor && ids.includes(track.ids.traktor.toString())));
    if (ids)
      return of(
        tracks.filter((track) => track.path && ids.includes(track.path)),
      );
    return of(tracks);
  }

  filterTracks(
    value: string,
    tracks?: TrackDTO[],
    fields?: (keyof TrackDTO)[],
    targetActive?: boolean,
  ): Observable<TrackDTO[]> {
    let result: TrackDTO[] = [];
    if (value.length == 0) return of([]); //INFO: We can remove this if we want to send back all the tracks, instead of an empty array
    console.dir(this.activeTracks);
    if (!tracks) {
      if (!targetActive && this.library?.tracks) result = this.library.tracks;
      else if (targetActive && this.activeTracks) result = this.activeTracks;
    } else result = tracks;

    if (value.length != 0)
      result = result.filter((track) => {
        const possibleFields: (keyof TrackDTO)[] = fields
          ? fields
          : [
              'title',
              'name',
              'mix',
              'artist',
              'remixer',
              'album',
              'key',
              'bpm',
              'energy',
            ]; //TO-DO: replace with visible columns
        for (const field of possibleFields) {
          const prop = track[field];
          if (
            prop &&
            prop.toString() &&
            prop.toString().toLowerCase().includes(value.toLowerCase())
          )
            return true;
        }
        return false;
      });
    return of(result);
  }

  getPlaylist(id: string): Observable<PlaylistDTO> {
    let playlist!: PlaylistDTO | null;
    if (this.library) {
      if (this.library.playlists)
        playlist = this.searchTree(this.library.playlists, id);
      if (playlist) {
        return of(playlist);
      } else return throwError('Playlist not found');
    } else return throwError('No collection loaded yet');
  }

  /* Tree */
  addPlaylist(playlist: PlaylistDTO): Observable<FolderDTO> {
    let playlists!: FolderDTO;
    if (this.library?.playlists) {
      if (this.library.playlists?.items) {
        //let items: (FolderDTO | PlaylistDTO)[] = this.library.playlists.items; //INFO: immutability error because of NgRX, even after copying (NgRX freezes it)
        const items: (FolderDTO | PlaylistDTO)[] = [];
        for (const node of this.library.playlists.items) {
          items.push(node);
        }
        items.push(playlist);
        playlists = new FolderDTO(
          this.library.playlists.name,
          this.library.playlists.ids,
          items,
        );
        return of(playlists);
      } else return throwError('Playlist not found');
    } else return throwError('No collection loaded yet');
  }

  updateTree(item?: PlaylistDTO | TrackDTO): Observable<FolderDTO> {
    let playlists!: FolderDTO;
    if (this.library?.playlists) {
      if (this.library.playlists?.items) {
        const items: (FolderDTO | PlaylistDTO)[] = [];
        for (const node of this.library.playlists.items) {
          items.push(this.updateNode(node, item));
        }
        playlists = new FolderDTO(
          this.library.playlists.name,
          this.library.playlists.ids,
          items,
        );
        return of(playlists);
      } else return throwError('Playlist not found');
    } else return throwError('No collection loaded yet');
  }

  private updateNode(
    node: FolderDTO | PlaylistDTO,
    item?: PlaylistDTO | TrackDTO,
  ): FolderDTO | PlaylistDTO {
    let updatedNode: FolderDTO | PlaylistDTO;
    if (isFolderDTO(node)) {
      const items: (FolderDTO | PlaylistDTO)[] = [];
      if (node.items) {
        for (const n of node.items) {
          items.push(this.updateNode(n, item));
        }
      }
      updatedNode = new FolderDTO(node.name, node.ids, items);
      return updatedNode;
    } else {
      if (
        isPlaylistDTO(item) &&
        item.ids &&
        item.ids.traktor == node.ids.traktor
      )
        return item;
      else
        return new PlaylistDTO(
          node.name,
          node.ids,
          node.track_ids('path'),
          node.rules,
          this.library?.tracks,
        );
    }
  }

  private searchTree(
    node: FolderDTO | PlaylistDTO,
    uuid: string,
  ): PlaylistDTO | null {
    if (isFolderDTO(node)) {
      if (node.items && node.items.length > 0) {
        for (const item of node.items) {
          const result = this.searchTree(item, uuid);
          if (result) return result;
        }
        return null;
      } else return null;
    } else if (node.ids.traktor === uuid) {
      return node;
    } else return null;
  }

  /* XML handler */
  parseLibrary(library: File): Observable<TraktorLibrary> {
    const reader = new FileReader();
    reader.readAsText(library);

    return new Observable((observer: Observer<TraktorLibrary>) => {
      //reader.onload = ((e: ProgressEvent): void => {
      reader.onload = (e: any): void => {
        const xml = e.target.result;
        let json = JSON.parse(xml2json(xml, { spaces: 2, compact: false }));

        /*
        console.log('After XML - JSON conversion:')
        console.dir(json)
        console.log('Before sanitizing:')
        console.dir(lib)
        */
        json = this.sanitizeObject(json, 'json');
        /*
        console.log('After sanitizing:')
        console.dir(lib)
        console.log(JSON.stringify(json))
        //const xml_converted = json2xml(JSON.stringify(json));
        //console.log(xml_converted)
        */

        if (json && json.elements && isTraktorLibrary(json)) {
          observer.next(
            this.traktorService.deserializeLibrary(json.elements[0]),
          );
          observer.complete();
          /*
          console.log('After JSON deserialization:')
          console.dir(traktor_json);
          const traktor_xml = JSON.stringify(this.traktorService.serializeLibrary(traktor_json));
          console.log(traktor_xml)
          console.log('After JSON - XML conversion:')
          console.log(json2xml(traktor_xml))
          */
        } else {
          //throw Error('Not a Traktor Library')
          observer.error('Not a Traktor Library');
        }
      };

      // if failed
      reader.onerror = (error: any): void => {
        observer.error(error);
      };
    });
  }

  private buildTraktorLibrary(): Blob {
    if (!this.library)
      throw Error("No collection loaded yet, so can't export anything!");
    let lib = this.traktorService.serializeLibrary(this.library);
    /*
    console.log('Before sanitizing:')
    console.dir(lib)
    */
    lib = this.sanitizeObject(lib, 'xml');
    /*
    console.log('After sanitizing:')
    console.dir(lib)
    */
    const xml = json2xml(JSON.stringify(lib), { spaces: 2, compact: false });
    return new Blob([xml], { type: 'text/xml' });
  }

  exportTraktorLibrary(storage?: string): void {
    const collection = this.buildTraktorLibrary();
    //window.open(URL.createObjectURL(collection));
    if (!storage) saveAs(collection, 'collection.nml');
  }

  private sanitize(item: string, mode: 'xml' | 'json'): string {
    if (mode === 'xml') {
      item = item.replace(/\&/g, '&amp;');
      item = item.replace(/\</g, '&lt;');
      item = item.replace(/\>/g, '&gt;');
      item = item.replace(/\<=/g, '&le;');
      item = item.replace(/\>=/g, '&ge;');
      item = item.replace(/\"/g, '&quot;');
      return item;
    } else {
      item = item.replace(/\&lt;/g, '<');
      item = item.replace(/\&gt;/g, '>');
      item = item.replace(/\&le;/g, '<=');
      item = item.replace(/\&ge;/g, '>=');
      item = item.replace(/\&amp;/g, '&');
      item = item.replace(/\&quot;/g, '"');
      return item;
    }
  }

  sanitizeObject(obj: any, mode: 'xml' | 'json') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] == 'string') {
          try {
            obj[key] = this.sanitize(obj[key], mode);
          } catch (e) {
            continue;
          }
        } else if (Array.isArray(obj[key])) {
          try {
            obj[key] = obj[key].map((object: any) =>
              this.sanitizeObject(object, mode),
            );
          } catch (e) {
            continue;
          }
        } else if (typeof obj[key] == 'object') {
          try {
            obj[key] = this.sanitizeObject(obj[key], mode);
          } catch (e) {
            continue;
          }
        }
      }
    }
    return obj;
  }

  match_library_ids(tracks: TrackDTO[]): Observable<TrackDTO[]> {
    /*
    //Combine latest approach --> Rate Limit...
    return combineLatest(
      this.library.tracks.map((track) =>
        this.spotifyService.update_ids(track, {
          use_isrc: false,
          use_ids: false,
          confidence_level: 95, //Confidence Interval of 95%
          duration_dif: 5,
          match_duration: true,
          match_artists: true,
        }),
      ),
    );
    */

    /*
    //forkJoin approach --> Rate Limit...
    const obsArr = tracks.map((track) =>
      defer(() =>
        this.spotifyService
          .update_ids(track, {
            use_isrc: false,
            use_ids: false,
            confidence_level: 95, //Confidence Interval of 95%
            duration_dif: 5,
            match_duration: true,
            match_artists: true,
          })
          .pipe(delay(100)),
      ),
    );
    //return zip(tracks$);
    return forkJoin(obsArr);
    */

    /*
    //Combine All approach
    const tracks$ = from(tracks).pipe(
      map((track) => {
        return this.spotifyService.update_ids(track, {
          use_isrc: false,
          use_ids: false,
          confidence_level: 95, //Confidence Interval of 95%
          duration_dif: 5,
          match_duration: true,
          match_artists: true,
        });
      }),
    );
    return tracks$.pipe(combineAll());
    */

    //ConcatMap + Scan + Buffer approach
    const tracks$ = from(tracks).pipe(
      //mergeMap((track) => {
      concatMap((track) => {
        return this.spotifyService.update_ids(track, {
          use_isrc: false,
          use_ids: false,
          confidence_level: 95, //Confidence Interval of 95%
          duration_dif: 5,
          match_duration: true,
          match_artists: true,
        });
      }),
      scan((acc: TrackDTO[], curr: TrackDTO) => [...acc, curr], []),
    );
    return tracks$;
  }

  match_track_ids(tracks: TrackDTO[]): Observable<TrackDTO> {
    //ConcatMap approach
    /*
    const track$ = from(tracks).pipe(
      concatMap((track) => {
        return this.spotifyService.update_ids(track, {
          use_isrc: false,
          use_ids: false,
          confidence_level: 95, //Confidence Interval of 95%
          duration_dif: 5,
          match_duration: true,
          match_artists: true,
        });
      }),
    );
    return track$;
    */

    /*
    //Scheduler approach (ConcatAll) --> Same result than ConcatMap
    const track$ = scheduled(tracks, queueScheduler).pipe(
      map((track) =>
        this.spotifyService.update_ids(track, {
          use_isrc: false,
          use_ids: false,
          confidence_level: 95, //Confidence Interval of 95%
          duration_dif: 5,
          match_duration: true,
          match_artists: true,
        }),
      ),
      concatAll(),
    );
    return track$;
    */

    //Defered MergeMap --> send blocks of data
    const tracks$ = tracks.map((track) =>
      defer(() =>
        this.spotifyService
          .update_ids(track, {
            use_isrc: false,
            use_ids: false,
            confidence_level: 95, //Confidence Interval of 95%
            duration_dif: 5,
            match_duration: true,
            match_artists: true,
          })
          .pipe(
            retryWhen((error) =>
              error.pipe(
                tap(() => {
                  console.log(error);
                  /*
                  if (!(error instanceof ErrorEvent) && error.status == 429) {
                    const time = error.headers.get('Retry-After');
                  }
                  */
                }),
                //delay(parseInt(time) * 1000);
                delay(5000),
                take(3),
              ),
            ),
          ),
      ),
    );
    return from(tracks$).pipe(mergeAll(3)); //send 3 request simultaneously, and when they finnish, send the next 3, etc.
  }

  match_library(): Observable<TrackDTO[]> {
    if (this.library?.tracks) {
      return this.match_track_ids(this.library.tracks).pipe(
        //INFO: This will collect the emitted tracks and send a feature request every 20 seconds/when 100 tracks have been matched! (100 because of Spotify limit of tracks/request)
        //When done, no more requests will be sent, of course. It automatically stops.
        bufferTime(20000, null, 100),
        mergeMap((response) =>
          this.update_audio_features(response).pipe(
            map((response) => response.flat()),
          ),
        ),
      );
    } else if (this.library) return throwError('No tracks in your collection');
    else return throwError('Collection not loaded');
  }

  update_audio_features(tracks: TrackDTO[]): Observable<TrackDTO[][]> {
    const tracks_chuncked: TrackDTO[][] = [];
    const limit = 100;
    for (let i = 0; i < Math.ceil(tracks.length / limit); i++) {
      const selected = tracks.slice(i * limit, (i + 1) * limit);
      tracks_chuncked.push(selected);
    }

    return combineLatest(
      tracks_chuncked.map((chunck) =>
        this.spotifyService.update_multiple_audio_features(chunck).pipe(
          map((response) => {
            const tracks_ids = response.map((t) => t.uuid);
            return response.concat(
              chunck.filter((t) => !tracks_ids.includes(t.uuid)),
            );
          }),
        ),
      ),
    );
  }

  match_playlist_ids(): Observable<TrackDTO[]> {
    if (this.activeTracks) {
      return combineLatest(
        this.activeTracks.map((track) =>
          this.spotifyService.update_ids(track, {
            use_isrc: false,
            use_ids: false,
            confidence_level: 95, //Confidence Interval of 95%
            duration_dif: 5,
            match_duration: true,
            match_artists: true,
          }),
        ),
      );
    } else return throwError('Current playlist has no tracks');
  }
}
