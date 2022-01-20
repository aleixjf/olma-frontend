//Angular
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
//Angular Material
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
//NgRX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as LibraryActions from 'src/app/Library/actions';
import * as LibraryState from 'src/app/Library/models/library.state';
//Models
import { TrackDTO } from 'src/app/Shared/models/track.dto';
//Other dependencies
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import * as KeyHelpers from 'src/app/Shared/services/helpers/KeyHelpers';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent {
  uuid!: string;
  spinner!: boolean;

  columns: string[] = [
    'title',
    'name',
    'mix',
    'version',
    'artist',
    'remixer',
    'album',
    'duration',
    'bpm',
    'key',
    'genre',
    'release_date',
    'release_year',
    'label',
    'rating',
    'comments',
    'energy',
    'language',
    'import_date',
    'last_played',
    'playcount',
    'modification_date',
    'popularity',
    'danceability',
    'valence',
    'acousticness',
    'instrumentalness',
    'liveness',
    'speechiness',
    'time_signature',
    'urls',
  ];
  visibleColumns: string[] = [
    'title',
    'mix',
    'duration',
    'artist',
    'album',
    'release_date',
    'genre',
    'rating',
    'bpm',
    'time_signature',
    'key',
    'energy',
    'popularity',
    'danceability',
    'import_date',
    'urls',
  ];
  //displayedColumns: string[] = [...this.visibleColumns, "actions"] //INFO: If approached like this, sorting doesn't work!
  displayedColumns!: string[];
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.visibleColumns,
      event.previousIndex,
      event.currentIndex,
    );
    this.displayedColumns = this.visibleColumns.concat(['actions']);
  }

  dataSource: TableVirtualScrollDataSource<TrackDTO> =
    new TableVirtualScrollDataSource([] as TrackDTO[]);
  @ViewChild(MatTable) table!: MatTable<TrackDTO>;
  @ViewChild(MatSort) sort!: MatSort;
  sortData(sort: Sort) {
    if (this.dataSource) this.table.renderRows();
    /*
    Custom sorting:
    const data = this.tracks.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'calories':
          return compare(a.calories, b.calories, isAsc);
        case 'fat':
          return compare(a.fat, b.fat, isAsc);
        case 'carbs':
          return compare(a.carbs, b.carbs, isAsc);
        case 'protein':
          return compare(a.protein, b.protein, isAsc);
        default:
          return 0;
      }
    });
    */

    /*
    // Announce the change in sort state for assistive technology.
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    /*
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sort.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
    */
  }

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private liveAnnouncer: LiveAnnouncer,
  ) {
    let loaded = false;
    this.store
      .select('library')
      .subscribe((response: LibraryState.LibraryState) => {
        if (response.collection) loaded = true;
        else loaded = false;
      });

    this.route.paramMap.subscribe((params) => {
      const uuid = params.get('uuid');
      if (uuid) {
        this.uuid = uuid;
        this.store.dispatch(
          LibraryActions.loadPlaylist({ playlistId: this.uuid }),
        );
      } else if (loaded) this.store.dispatch(LibraryActions.loadLibrary());
    });

    this.store
      .select('library')
      .subscribe((response: LibraryState.LibraryState) => {
        this.spinner = response.pending;
        if (response.active?.filtered) {
          this.dataSource = new TableVirtualScrollDataSource(
            response.active.filtered,
          );
          this.dataSource.sort = this.sort;
        } else if (response.active?.tracks) {
          this.dataSource = new TableVirtualScrollDataSource(
            response.active.tracks,
          );
          this.dataSource.sort = this.sort;
        }
      });
    this.displayedColumns = this.visibleColumns.concat(['actions']);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  formattedKey(
    key_id: number | undefined,
    key: string | undefined,
  ): string | undefined {
    if (key_id) return KeyHelpers.keyIdToCamelot(key_id);
    else if (key) return key;
    else return '';
  }

  formattedDate(date: Date | undefined, format = 'dd/MM/yyyy'): string {
    return date ? formatDate(date, format, 'en') : '';
  }

  formattedTime(time: number | undefined): string {
    if (!time) return '00:00';
    const roundedSec = Math.round(time);
    const sec = roundedSec % 60;
    const min = (roundedSec - sec) / 60;

    let secStr = sec.toString();
    if (sec < 10) secStr = '0' + secStr;

    let minStr = min.toString();
    if (min < 10) minStr = '0' + minStr;

    return minStr + ':' + secStr;
  }

  updateRating(track: TrackDTO, rating: number): void {
    //let updatedTrack: TrackDTO = { ...track, rating}
    const updatedTrack: TrackDTO = track;
    updatedTrack.rating = rating;
    this.updateTrack(updatedTrack);
  }

  updateTrack(track: TrackDTO): void {
    this.store.dispatch(LibraryActions.updateTrack({ track }));
  }

  editTrack(track: TrackDTO): void {
    const id: string | number | undefined = track.uuid;
    if (id) this.router.navigateByUrl('/library/tracks/' + id);
    else throw Error('No UUID for this track.');
  }

  deleteTrack(track: TrackDTO): void {
    const id: string | number | undefined = track.uuid;
    if (id) {
      // show confirmation popup
      // let result = confirm('Confirm delete track with title "' + track.title + '"');
      const result = confirm(
        'Do you really wat to delete the selected tracks from the collection?',
      );
      if (result) {
        this.store.dispatch(LibraryActions.deleteTrack({ track }));
      }
    } else return;
  }
}
